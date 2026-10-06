import pool from "../../config/db.js";

export const createOrderWithTransaction = async (data: {
  orderNumber: string;
  userId: string;
  addressId: string;
  couponId: string | null;
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  totalAmount: number;
  orderStatus: string;
  items: Array<{ product_id: string; quantity: number; product_price: number }>;
}) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const insertOrderQuery = `
      INSERT INTO orders (
        order_number, user_id, address_id, coupon_id, 
        subtotal, discount_amount, shipping_fee, total_amount, 
        status, created_by
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *;
    `;
    const orderValues = [
      data.orderNumber,
      data.userId,
      data.addressId,
      data.couponId,
      data.subtotal,
      data.discountAmount,
      data.shippingFee,
      data.totalAmount,
      data.orderStatus,
      data.userId,
    ];
    const orderResult = await client.query(insertOrderQuery, orderValues);
    const createdOrder = orderResult.rows[0];

    for (const item of data.items) {
      const itemSubtotal = item.quantity * item.product_price;
      const insertItemQuery = `
        INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal)
        VALUES ($1, $2, $3, $4, $5);
      `;
      await client.query(insertItemQuery, [
        createdOrder.order_id,
        item.product_id,
        item.quantity,
        item.product_price,
        itemSubtotal,
      ]);

      await client.query(
        `UPDATE inventory SET quantity = quantity - $1, last_updated = NOW() WHERE product_id = $2;`,
        [item.quantity, item.product_id],
      );
    }

    if (data.couponId) {
      await client.query(
        `UPDATE coupons SET used_count = used_count + 1 WHERE coupon_id = $1;`,
        [data.couponId],
      );
    }

    await client.query(
      `DELETE FROM cart_items WHERE cart_id = (SELECT cart_id FROM carts WHERE user_id = $1);`,
      [data.userId],
    );

    // The applied coupon is consumed with the order, so it can no longer
    // surface on the checkout page after the purchase.
    await client.query(
      `UPDATE carts SET coupon_id = NULL, updated_at = NOW() WHERE user_id = $1;`,
      [data.userId],
    );

    await client.query("COMMIT");
    return createdOrder;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export const findOrdersByUserIdFromDb = async (userId: string) => {
  const query = `
    SELECT 
      o.*, 
      a.full_name, a.phone, a.street, a.building, a.city, a.country,
      JSON_AGG(
        JSON_BUILD_OBJECT(
          'order_item_id', oi.order_item_id,
          'product_id', oi.product_id,
          'product_name', p.name,
          'product_sku', p.sku,
          'quantity', oi.quantity,
          'unit_price', oi.unit_price,
          'subtotal', oi.subtotal
        )
      ) AS items
    FROM orders o
    LEFT JOIN addresses a ON o.address_id = a.address_id
    LEFT JOIN order_items oi ON o.order_id = oi.order_id
    LEFT JOIN products p ON oi.product_id = p.product_id
    WHERE o.user_id = $1
    GROUP BY o.order_id, a.address_id
    ORDER BY o.created_at DESC;
  `;
  const result = await pool.query(query, [userId]);
  return result.rows;
};

export const findAllOrdersFromDb = async () => {
  const query = `
    SELECT o.*, u.full_name AS customer_name, u.email AS customer_email,
      COALESCE(
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'order_item_id', oi.order_item_id,
            'product_id', oi.product_id,
            'product_name', p.name,
            'product_sku', p.sku,
            'quantity', oi.quantity,
            'unit_price', oi.unit_price,
            'subtotal', oi.subtotal
          )
        ) FILTER (WHERE oi.order_item_id IS NOT NULL),
        '[]'
      ) AS items
    FROM orders o
    INNER JOIN users u ON u.user_id = o.user_id
    LEFT JOIN order_items oi ON oi.order_id = o.order_id
    LEFT JOIN products p ON oi.product_id = p.product_id
    GROUP BY o.order_id, u.user_id
    ORDER BY o.created_at DESC;
  `;
  const result = await pool.query(query);
  return result.rows;
};

export const updateOrderStatusInDb = async (orderId: string, status: string) => {
  const result = await pool.query(
    "UPDATE orders SET status = $1, updated_at = NOW() WHERE order_id = $2 RETURNING *",
    [status, orderId],
  );
  return result.rows[0];
};

export const findOrderByIdFromDb = async (orderId: string, userId: string) => {
  const query = `
    SELECT 
      o.*, 
      a.full_name, a.phone, a.street, a.building, a.city, a.country,
      JSON_AGG(
        JSON_BUILD_OBJECT(
          'order_item_id', oi.order_item_id,
          'product_id', oi.product_id,
          'product_name', p.name,
          'product_sku', p.sku,
          'quantity', oi.quantity,
          'unit_price', oi.unit_price,
          'subtotal', oi.subtotal
        )
      ) AS items
    FROM orders o
    LEFT JOIN addresses a ON o.address_id = a.address_id
    LEFT JOIN order_items oi ON o.order_id = oi.order_id
    LEFT JOIN products p ON oi.product_id = p.product_id
    WHERE o.order_id = $1 AND o.user_id = $2
    GROUP BY o.order_id, a.address_id;
  `;
  const result = await pool.query(query, [orderId, userId]);
  return result.rows[0] || null;
};

export const cancelPendingOrderAndReleaseReservation = async (
  orderId: string,
  userId?: string,
) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const orderParams = userId ? [orderId, userId] : [orderId];
    const userFilter = userId ? " AND user_id = $2" : "";
    const orderResult = await client.query(
      `SELECT * FROM orders WHERE order_id = $1 AND status = 'pending'${userFilter} FOR UPDATE`,
      orderParams,
    );
    const order = orderResult.rows[0];
    if (!order) {
      await client.query("ROLLBACK");
      return null;
    }

    const itemsResult = await client.query(
      "SELECT product_id, quantity FROM order_items WHERE order_id = $1",
      [orderId],
    );
    for (const item of itemsResult.rows) {
      await client.query(
        `UPDATE inventory
         SET quantity = quantity + $1, last_updated = NOW(), updated_at = NOW()
         WHERE product_id = $2`,
        [item.quantity, item.product_id],
      );
    }
    if (order.coupon_id) {
      await client.query(
        `UPDATE coupons SET used_count = GREATEST(used_count - 1, 0), updated_at = NOW()
         WHERE coupon_id = $1`,
        [order.coupon_id],
      );
    }
    await client.query("DELETE FROM payments WHERE order_id = $1", [orderId]);
    const cancelledOrder = await client.query(
      `UPDATE orders SET status = 'cancelled', updated_at = NOW()
       WHERE order_id = $1 RETURNING *`,
      [orderId],
    );
    await client.query("COMMIT");
    return cancelledOrder.rows[0] || null;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
