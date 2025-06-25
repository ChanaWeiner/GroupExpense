import db from '../config/db.js';

export const getAllByFrame = async (frameId) => {
  const [rows] = await db.query(
    `SELECT * FROM shopping_items WHERE frame_id = ? ORDER BY is_purchased, id`,
    [frameId]
  );
  return rows;
};

export const getById = async (id) => {
  const [rows] = await db.query(
    `SELECT * FROM shopping_items WHERE id = ?`,
    [id]
  );
  return rows[0];
};

export const create = async ({ frame_id, name, suggested_by, note }) => {
  const [result] = await db.query(
    `INSERT INTO shopping_items (frame_id, name, suggested_by, note)
     VALUES (?, ?, ?, ?)`,
    [frame_id, name, suggested_by, note]
  );
  return { id: result.insertId, frame_id, name, suggested_by, note, is_purchased: false };
};

export const update = async (id, fields) => {
  const keys = Object.keys(fields);
  if (keys.length === 0) return false;
  const values = Object.values(fields);
  const setClause = keys.map(key => `${key} = ?`).join(', ');
  values.push(id);
  const [result] = await db.query(`UPDATE shopping_items SET ${setClause} WHERE id = ?`, values);
  return result.affectedRows > 0;
};

export const remove = async (id) => {
  const [result] = await db.query(
    `DELETE FROM shopping_items WHERE id = ?`,
    [id]
  );
  return result.affectedRows > 0;
};
