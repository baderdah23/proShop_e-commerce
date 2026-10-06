import pool from "../../config/db.js";

export const findOrCreateCartByUserId = async (userId: string) => {
  const selectQuery = `
    SELECT 
      c.cart_id, c.user_id, c.coupon_id, c.created_at, c.updated_at,
      cu.coupon_id AS coupon_coupon_id,
      cu.code AS coupon_code,
      cu.discount_type AS coupon_discount_type,
      cu.discount_value AS coupon_discount_value,
      cu.max_uses AS coupon_max_uses,
      cu.used_count AS coupon_used_count,
      cu.valid_from AS coupon_valid_from,
      cu.valid_until AS coupon_valid_until,
      cu.is_active AS coupon_is_active
    FROM carts c
    LEFT JOIN coupons cu ON cu.coupon_id = c.coupon_id
    WHERE c.user_id = $1;
  `;
  const existingCart = await pool.query(selectQuery, [userId]);

  if (existingCart.rows.length > 0) {
    return {
      ...existingCart.rows[0],
      coupon: existingCart.rows[0].coupon_coupon_id
        ? {
            coupon_id: existingCart.rows[0].coupon_coupon_id,
            code: existingCart.rows[0].coupon_code,
            discount_type: existingCart.rows[0].coupon_discount_type,
            discount_value: existingCart.rows[0].coupon_discount_value,
            max_uses: existingCart.rows[0].coupon_max_uses,
            used_count: existingCart.rows[0].coupon_used_count,
            valid_from: existingCart.rows[0].coupon_valid_from,
            valid_until: existingCart.rows[0].coupon_valid_until,
            is_active: existingCart.rows[0].coupon_is_active,
          }
        : null,
    };
  }

  const insertQuery = `
    INSERT INTO carts (user_id) 
    VALUES ($1) 
    RETURNING *;
  `;
  const newCart = await pool.query(insertQuery, [userId]);
  return newCart.rows[0];
};

export const findCartItem = async (cartId: string, productId: string) => {
  const query = `
    SELECT * FROM cart_items 
    WHERE cart_id = $1 AND product_id = $2;
  `;
  const result = await pool.query(query, [cartId, productId]);
  return result.rows[0] || null;
};

export const insertCartItem = async (
  cartId: string,
  productId: string,
  quantity: number,
) => {
  const query = `
    INSERT INTO cart_items (cart_id, product_id, quantity)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const result = await pool.query(query, [cartId, productId, quantity]);
  return result.rows[0];
};

export const updateCartItemQuantityInDb = async (
  cartItemId: string,
  newQuantity: number,
) => {
  const query = `
    UPDATE cart_items 
    SET quantity = $1, updated_at = NOW()
    WHERE cart_item_id = $2
    RETURNING *;
  `;
  const result = await pool.query(query, [newQuantity, cartItemId]);
  return result.rows[0];
};

export const findCartDetailsWithProducts = async (cartId: string) => {
  const query = `
    SELECT 
      ci.cart_item_id,
      ci.quantity,
      ci.added_at,
      p.product_id,
      p.name AS product_name,
      p.discount_price AS product_price,
      (
        SELECT pi.image_url
        FROM product_images pi
        WHERE pi.product_id = p.product_id
        ORDER BY pi.is_primary DESC, pi.sort_order ASC
        LIMIT 1
      ) AS product_image,
      COALESCE((
        SELECT json_agg(
          json_build_object(
            'image_id', pi.image_id,
            'product_id', pi.product_id,
            'image_url', pi.image_url,
            'is_primary', pi.is_primary,
            'sort_order', pi.sort_order
          ) ORDER BY pi.is_primary DESC, pi.sort_order ASC
        )
        FROM product_images pi
        WHERE pi.product_id = p.product_id
      ), '[]'::json) AS product_images,
      (
        SELECT c.image_url
        FROM categories c
        WHERE c.category_id = p.category_id
      ) AS category_image_url,
      (ci.quantity * p.discount_price) AS total_item_price
    FROM cart_items ci
    INNER JOIN products p ON ci.product_id = p.product_id
    WHERE ci.cart_id = $1
    ORDER BY ci.added_at DESC;
  `;
  const result = await pool.query(query, [cartId]);
  return result.rows;
};

export const deleteCartItemFromDb = async (
  cartItemId: string,
  userId: string,
) => {
  const query = `
    DELETE FROM cart_items 
    WHERE cart_item_id = $1 AND 
    cart_id = (SELECT cart_id FROM carts WHERE user_id = $2) 
    RETURNING *;
  `;
  const result = await pool.query(query, [cartItemId, userId]);
  return result.rows[0];
};

export const clearCartItemsFromDb = async (cartId: string) => {
  const query = `
    DELETE FROM cart_items 
    WHERE cart_id = $1 RETURNING *;
  `;
  const result = await pool.query(query, [cartId]);
  return result.rows;
};

export const applyCouponToCartInDb = async (cartId: string, couponId: string) => {
  const query = `
    UPDATE carts 
    SET coupon_id = $2, updated_at = NOW()
    WHERE cart_id = $1
    RETURNING *;
  `;
  const result = await pool.query(query, [cartId, couponId]);
  return result.rows[0] || null;
};

export const removeCouponFromCartInDb = async (cartId: string) => {
  const query = `
    UPDATE carts 
    SET coupon_id = NULL, updated_at = NOW()
    WHERE cart_id = $1
    RETURNING *;
  `;
  const result = await pool.query(query, [cartId]);
  return result.rows[0] || null;
};
