import pool from "../../config/db.js";

export const findUser = async (email: string) => {
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);

  return result.rows;
};

export const findUserById = async (id: string) => {
  const result = await pool.query(
    "SELECT user_id, full_name, email, phone, role, is_active, created_at FROM users WHERE user_id = $1",
    [id],
  );

  return result.rows;
};

export const addUser = async (
  full_name: string,
  email: string,
  phone: string,
  Password: string,
) => {
  const qurey = `INSERT INTO users ( full_name, email, phone, password ) VALUES ($1 , $2 , $3, $4) RETURNING *`;
  const result = await pool.query(qurey, [full_name, email, phone, Password]);

  return result.rows[0];
};

export const updateResetCode = async (
  resetCodeHash: string | null,
  expiresAt: Date | null,
  email: string,
) => {
  const query = `UPDATE users SET reset_password_code_hash = $1, reset_password_code_expires_at = $2 WHERE email = $3 RETURNING *`;
  const result = await pool.query(query, [resetCodeHash, expiresAt, email]);
  return result.rows[0];
};

export const updatePassword = async (email: string, password: string) => {
  const query = `UPDATE users SET password = $1 WHERE email = $2 RETURNING *`;
  const result = await pool.query(query, [password, email]);
  return result.rows[0];
};

export const updatePasswordHash = async (
  userId: string,
  passwordHash: string,
) => {
  const query = `UPDATE users SET password = $1, updated_at = NOW() WHERE user_id = $2 RETURNING *`;
  const result = await pool.query(query, [passwordHash, userId]);
  return result.rows[0];
};

export const updateCurrentUser = async (
  userId: string,
  fullName: string,
  email: string,
  phone: string,
) => {
  const result = await pool.query(
    `UPDATE users SET full_name = $1, email = $2, phone = $3, updated_at = NOW()
     WHERE user_id = $4
     RETURNING user_id, full_name, email, phone, role, is_active, created_at`,
    [fullName, email, phone, userId],
  );
  return result.rows[0] || null;
};
