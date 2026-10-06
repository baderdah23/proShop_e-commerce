import pool from "../../config/db.js";

export const findCouponByCode = async (code: string) => {
  const query = `
    SELECT * FROM coupons 
    WHERE code = $1;
  `;
  const result = await pool.query(query, [code.toUpperCase()]);
  return result.rows[0] || null;
};

export const findCouponById = async (couponId: string) => {
  const query = `
    SELECT * FROM coupons 
    WHERE coupon_id = $1;
  `;
  const result = await pool.query(query, [couponId]);
  return result.rows[0] || null;
};

/**
 * Returns a human-readable reason a coupon cannot be applied, or null when
 * the coupon is usable. Exists because the same checks were duplicated in the
 * coupons, orders, and (now) cart controllers and drifted apart.
 */
export const getCouponInvalidReason = (coupon: {
  is_active: boolean;
  used_count: number;
  max_uses: number;
  valid_from: string;
  valid_until: string;
} | null): string | null => {
  if (!coupon) return "Coupon code not found.";
  if (!coupon.is_active) return "This coupon is no longer active.";
  if (coupon.used_count >= coupon.max_uses)
    return "Coupon usage limit has been reached."

  const currentDate = new Date();
  if (
    currentDate < new Date(coupon.valid_from) ||
    currentDate > new Date(coupon.valid_until)
  ) {
    return "Coupon is expired or not valid yet.";
  }
  return null;
};

export const insertCoupon = async (data: {
  code: string;
  discount_type: string;
  discount_value: number;
  max_uses: number;
  valid_from: string;
  valid_until: string;
  is_active?: boolean;
}) => {
  const query = `
    INSERT INTO coupons (code, discount_type, discount_value, max_uses, valid_from, valid_until, is_active)
    VALUES ($1, $2, $3, $4, $5, $6, COALESCE($7, TRUE))
    RETURNING *;
  `;
  const values = [
    data.code.toUpperCase(),
    data.discount_type,
    data.discount_value,
    data.max_uses,
    data.valid_from,
    data.valid_until,
    data.is_active,
  ];
  const result = await pool.query(query, values);
  return result.rows[0];
};

export const findAllCoupons = async () => {
  const query = `
    SELECT * FROM coupons 
    ORDER BY created_at DESC;
  `;
  const result = await pool.query(query);
  return result.rows;
};

export const deleteCouponFromDb = async (couponId: string) => {
  const query = `
    DELETE FROM coupons 
    WHERE coupon_id = $1 RETURNING *;
  `;
  const result = await pool.query(query, [couponId]);
  return result.rows[0];
};
