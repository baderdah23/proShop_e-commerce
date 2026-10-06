import pool from "../../config/db.js";

const findReviewByUserAndProduct = async (
  product_id: string,
  user_id: string,
) => {
  const query = "SELECT * FROM reviews WHERE product_id = $1 AND user_id = $2";
  const result = await pool.query(query, [product_id, user_id]);
  return result.rows[0];
};

const insertReview = async (
  product_id: string,
  user_id: string,
  customerName: string,
  rating: number,
  comment: string,
) => {
  const query =
    "INSERT INTO reviews (product_id, user_id, customer_name, rating, comment) VALUES ($1, $2, $3, $4, $5) RETURNING *";
  const result = await pool.query(query, [
    product_id,
    user_id,
    customerName,
    rating,
    comment,
  ]);
  return result.rows[0];
};

const getReviewsByProductId = async (product_id: string) => {
  const query =
    "SELECT * FROM reviews WHERE product_id = $1 ORDER BY review_date DESC";
  const result = await pool.query(query, [product_id]);
  return result.rows;
};

const getAllReviews = async () => {
  const query = "SELECT * FROM reviews ORDER BY review_date DESC";
  const result = await pool.query(query);
  return result.rows;
};

const findReviewById = async (review_id: string) => {
  const query = "SELECT * FROM reviews WHERE review_id = $1";
  const result = await pool.query(query, [review_id]);
  return result.rows[0];
};

const updateReviewInDb = async (
  review_id: string,
  rating?: number,
  comment?: string,
) => {
  const query =
    "UPDATE reviews SET rating = COALESCE($1, rating), comment = COALESCE($2, comment), updated_at = NOW() WHERE review_id = $3 RETURNING *";
  const result = await pool.query(query, [
    rating ?? null,
    comment ?? null,
    review_id,
  ]);
  return result.rows[0];
};

const deleteReviewFromDb = async (review_id: string) => {
  const query = "DELETE FROM reviews WHERE review_id = $1 RETURNING *";
  const result = await pool.query(query, [review_id]);
  return result.rows[0];
};

export {
  findReviewByUserAndProduct,
  insertReview,
  getReviewsByProductId,
  getAllReviews,
  findReviewById,
  updateReviewInDb,
  deleteReviewFromDb,
};
