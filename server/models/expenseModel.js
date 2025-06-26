import db from '../config/db.js';

export const getAllByFrame = async (groupId, frameId) => {
  const [rows] = await db.query(
    `SELECT * FROM expenses WHERE frame_id = ?`,
    [groupId, frameId]
  );
  return rows;
};

export const getById = async (groupId, frameId, expenseId) => {
  const [rows] = await db.query(
    `SELECT * FROM expenses WHERE id = ? AND group_id = ? AND frame_id = ?`,
    [expenseId, groupId, frameId]
  );
  return rows[0];
};

export const createExpense = async ({ frame_id, paid_by, total_amount, description, date, receipt_path }, connection) => {
  const [result] = await connection.query(
    `INSERT INTO expenses (frame_id, paid_by, total_amount, description, date, receipt_url)
     VALUES ( ?, ?, ?, ?, ?, ?)`,
    [frame_id, paid_by, total_amount, description, date, receipt_path]
  );
  return { id: result.insertId, frame_id, paid_by, total_amount, description, date, receipt_path };
};

export const createExpenseItem = async (expense_id, shopping_item_id, amount, connection) => {
  await connection.query(
    `INSERT INTO expense_items (expense_id, shopping_item_id, amount)
     VALUES (?, ?, ?)`,
    [expense_id, shopping_item_id, amount]
  );
};


export const update = async (groupId, frameId, expenseId, fields) => {
  const keys = Object.keys(fields);
  if (keys.length === 0) return false;

  const values = Object.values(fields);
  const setClause = keys.map(key => `${key} = ?`).join(', ');
  values.push(expenseId, groupId, frameId);

  const [result] = await db.query(
    `UPDATE expenses SET ${setClause} WHERE id = ? AND group_id = ? AND frame_id = ?`,
    values
  );

  return result.affectedRows > 0;
};

export const remove = async (groupId, frameId, expenseId) => {
  const [result] = await db.query(
    `DELETE FROM expenses WHERE id = ? AND group_id = ? AND frame_id = ?`,
    [expenseId, groupId, frameId]
  );

  return result.affectedRows > 0;
};

export const search = async (groupId, frameId, query) => {
  const [rows] = await db.query(
    `SELECT * FROM expenses WHERE group_id = ? AND frame_id = ? AND description LIKE ?`,
    [groupId, frameId, `%${query}%`]
  );

  return rows;
};



export const validateItemsBelongToFrame = async (frame_id, items, connection) => {
  if (!items.length) return false;

  // יצירת מחרוזת שאלות לפי מספר הפריטים
  const placeholders = items.map(() => '?').join(',');

  // שימוש בחיבור אם קיים, אחרת ב־db הרגיל
  const conn = connection || db;

  const [rows] = await conn.query(
    `SELECT id FROM shopping_items WHERE frame_id = ? AND id IN (${placeholders})`,
    [frame_id, ...items.map(i => i.id)]
  );

  const validItemIds = rows.map(row => row.id);
  return validItemIds.length === items.length;
};
