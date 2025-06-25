import db from '../config/db.js';

export const getAllByFrame = async (groupId, frameId) => {
  const [rows] = await db.query(
    `SELECT * FROM expenses WHERE group_id = ? AND frame_id = ?`,
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

export const create = async ({ group_id, frame_id, paid_by, total_amount, description, date }) => {
  const [result] = await db.query(
    `INSERT INTO expenses (group_id, frame_id, paid_by, total_amount, description, date)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [group_id, frame_id, paid_by, total_amount, description, date]
  );

  return {
    id: result.insertId,
    group_id,
    frame_id,
    paid_by,
    total_amount,
    description,
    date
  };
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
