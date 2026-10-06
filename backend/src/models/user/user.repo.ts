import pool from "../../config/db.js";

const createUserQuery = async (
  full_name: string,
  email: string,
  phone: string,
  password: string,
) => {
  const qurey = `INSERT INTO users (full_name, email, phone, password) VALUES ($1, $2, $3, $4) RETURNING *`;
  const result = await pool.query(qurey, [full_name, email, phone, password]);
  return result;
};

const getAllUsers = async (limit: number, offset: number) => {
  const qurey = `SELECT user_id, full_name, email, phone, role, is_active, created_at FROM users LIMIT $1 OFFSET $2`;
  const result = await pool.query(qurey, [limit, offset]);
  return result;
};

const getUserByIdQuery = async (id: string) => {
  const qurey = `SELECT * FROM users WHERE user_id = $1`;
  const result = await pool.query(qurey, [id]);
  return result;
};

const updateUserQuery = async (
  id?: string,
  full_name?: string,
  email?: string,
  phone?: string,
  password?: string,
  role?: string,
  is_active?: boolean,
) => {
  const query = `
    UPDATE users 
    SET 
      full_name = COALESCE($1, full_name), 
      email = COALESCE($2, email), 
      phone = COALESCE($3, phone),
      password = COALESCE($4, password),
      role = COALESCE($5, role),
      is_active = COALESCE($6, is_active),
      updated_at = NOW()
    WHERE user_id = $7 
    RETURNING *`;
  const result = await pool.query(query, [
    full_name,
    email,
    phone,
    password,
    role,
    is_active,
    id,
  ]);
  return result;
};

const deleteUserQuery = async (id: string) => {
  const qurey = `DELETE FROM users WHERE user_id = $1 RETURNING *`;
  const result = await pool.query(qurey, [id]);
  return result;
};

export {
  getUserByIdQuery,
  createUserQuery,
  getAllUsers,
  updateUserQuery,
  deleteUserQuery,
};
