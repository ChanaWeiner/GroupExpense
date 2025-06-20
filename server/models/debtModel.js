import db from '../config/db.js';

export async function getUserOwedDebts(userId) {
  const [rows] = await db.query(
    'SELECT * FROM debts WHERE from_user_id = ? AND status = "open"',
    [userId]
  );
  return rows;
}

export async function getDebtsOwedToUser(userId) {
  const [rows] = await db.query(
    'SELECT * FROM debts WHERE to_user_id = ? AND status = "open"',
    [userId]
  );
  return rows;
}
export async function getRecentDebts(userId, limit = 5) {
  const query = `
    SELECT d.*, 
           u_from.name AS from_user_name, 
           u_to.name AS to_user_name,
           e.description AS expense_description
    FROM debts d
    JOIN users u_from ON d.from_user_id = u_from.id
    JOIN users u_to ON d.to_user_id = u_to.id
    JOIN expenses e ON d.expense_id = e.id
    WHERE d.from_user_id = ? OR d.to_user_id = ?
    ORDER BY d.created_at DESC
    LIMIT ?
  `;
  const [rows] = await db.query(query, [userId, userId, limit]);
  return rows;
}

export async function getOverdueDebts(userId, days = 14) {
  const query = `
    SELECT d.*, 
           u_from.name AS from_user_name, 
           u_to.name AS to_user_name,
           e.description AS expense_description
    FROM debts d
    JOIN users u_from ON d.from_user_id = u_from.id
    JOIN users u_to ON d.to_user_id = u_to.id
    JOIN expenses e ON d.expense_id = e.id
    WHERE (d.from_user_id = ? OR d.to_user_id = ?)
      AND d.status = 'open'
      AND d.created_at < NOW() - INTERVAL ? DAY
    ORDER BY d.created_at ASC
  `;
  const [rows] = await db.query(query, [userId, userId, days]);
  return rows;
}