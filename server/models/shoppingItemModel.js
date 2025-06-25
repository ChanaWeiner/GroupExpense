import db from '../config/db.js';

export const getAllByFrame = async (frameId) => {
  const [rows] = await db.query(
    `
    SELECT 
      si.*,
      ei.id IS NOT NULL AS is_purchased,
      ei.amount AS purchased_amount,
      e.id AS expense_id,
      e.date AS purchase_date,
      e.total_amount,
      e.description AS expense_description,
      e.receipt_url
    FROM shopping_items si
    LEFT JOIN expense_items ei ON ei.shopping_item_id = si.id
    LEFT JOIN expenses e ON ei.expense_id = e.id
    WHERE si.frame_id = ?
    `,
    [frameId]
  );
  return rows;
};

export const getUnpurchasedByFrame = async (frameId) => {
  const [rows] = await db.query(
    `
    SELECT *
    FROM shopping_items si
    WHERE si.frame_id = ?
      AND NOT EXISTS (
        SELECT 1
        FROM expense_items ei
        WHERE ei.shopping_item_id = si.id
      )
    `,
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
