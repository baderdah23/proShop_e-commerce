import pool from "../../config/db.js";

export const findWishlistItem = async (userId: string, productId: string) => {
  const query = `
    SELECT * FROM wishlists 
    WHERE user_id = $1 AND product_id = $2;
  `;
  const result = await pool.query(query, [userId, productId]);
  return result.rows[0] || null;
};

export const insertWishlistItem = async (userId: string, productId: string) => {
  const query = `
    INSERT INTO wishlists (user_id, product_id)
    VALUES ($1, $2)
    RETURNING *;
  `;
  const result = await pool.query(query, [userId, productId]);
  return result.rows[0];
};

export const findWishlistByUserId = async (userId: string) => {
  const query = `
    SELECT 
      w.wishlist_id,
      w.product_id,
      w.added_at,
      p.product_id AS nested_product_id,
      p.name AS product_name,
      p.slug AS product_slug,
      p.price AS product_original_price,
      p.discount_price AS product_price,
      p.stock_quantity AS product_stock_quantity,
      p.rating_avg AS product_rating_avg,
      (
        SELECT pi.image_url
        FROM product_images pi
        WHERE pi.product_id = p.product_id
        ORDER BY pi.is_primary DESC, pi.sort_order ASC
        LIMIT 1
      ) AS product_image
      ,
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
      ) AS category_image_url
    FROM wishlists w
    INNER JOIN products p ON w.product_id = p.product_id
    WHERE w.user_id = $1
    ORDER BY w.added_at DESC;
  `;
  const result = await pool.query(query, [userId]);
  return result.rows.map((row) => ({
    wishlist_id: row.wishlist_id,
    product_id: row.product_id,
    added_at: row.added_at,
    product: {
      product_id: row.nested_product_id,
      name: row.product_name,
      slug: row.product_slug,
      price: row.product_original_price,
      discount_price: row.product_price,
      stock_quantity: row.product_stock_quantity,
      rating_avg: row.product_rating_avg,
      image_url: row.product_image,
      images: row.product_images,
      category_image_url: row.category_image_url,
    },
  }));
};

export const deleteWishlistItemFromDb = async (
  userId: string,
  productId: string,
) => {
  const query = `
    DELETE FROM wishlists 
    WHERE user_id = $1 AND product_id = $2 RETURNING *;
  `;
  const result = await pool.query(query, [userId, productId]);
  return result.rows[0];
};
