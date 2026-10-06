import pool from "../../config/db.js";

export interface IPaymentRecord {
  orderId: string;
  userId: string;
  method: "credit_card" | "cash_on_delivery";
  status: "pending" | "paid" | "failed" | "refunded";
  amount: number;
  transactionRef?: string | null;
}

export const createPaymentInDb = async (paymentData: IPaymentRecord) => {
  const query = `
    INSERT INTO payments (
      order_id, 
      created_by, 
      method, 
      status, 
      amount, 
      transaction_ref
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;

  const values = [
    paymentData.orderId,
    paymentData.userId,
    paymentData.method,
    paymentData.status,
    paymentData.amount,
    paymentData.transactionRef || null,
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};

export const updatePaymentStatusByRefFromDb = async (
  transactionRef: string,
  status: "paid" | "failed" | "refunded",
) => {
  const query = `
    UPDATE payments
    SET 
      status = $1,
      updated_at = NOW()
    WHERE transaction_ref = $2
    RETURNING *;
  `;

  const result = await pool.query(query, [status, transactionRef]);
  return result.rows[0] || null;
};

export const findPaymentsByOrderIdFromDb = async (orderId: string) => {
  const query = `
    SELECT * FROM payments 
    WHERE order_id = $1 
    ORDER BY created_at DESC;
  `;

  const result = await pool.query(query, [orderId]);
  return result.rows;
};

export const findOrderIdByPaymentRefFromDb = async (transactionRef: string) => {
  const query = `
    SELECT order_id FROM payments 
    WHERE transaction_ref = $1 
    LIMIT 1;
  `;
  const result = await pool.query(query, [transactionRef]);
  return result.rows[0]?.order_id || null;
};
