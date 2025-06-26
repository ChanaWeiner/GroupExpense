import db from '../config/db.js';

export const insertPayment = async (connection, { from_user_id, to_user_id, amount, method, debt_id }) => {
  await connection.query(
    `INSERT INTO payments (from_user_id, to_user_id, amount, method, debt_id, paid_at)
     VALUES (?, ?, ?, ?, ?, NOW())`,
    [from_user_id, to_user_id, amount, method, debt_id]
  );
};

export const getRecentPaymentsForUser = async (userId, limit = 5) => {
  const [rows] = await db.query(
    `SELECT p.*, u_from.name AS from_user_name, u_to.name AS to_user_name, e.description AS expense_description
     FROM payments p
     JOIN users u_from ON p.from_user_id = u_from.id
     JOIN users u_to ON p.to_user_id = u_to.id
     JOIN debts d ON p.debt_id = d.id
     JOIN expenses e ON d.expense_id = e.id
     WHERE p.to_user_id = ?
     ORDER BY p.paid_at DESC
     LIMIT ?`,
    [userId, limit]
  );
  return rows;
};
