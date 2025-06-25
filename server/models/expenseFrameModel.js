import db from '../config/db.js';

export async function getAllFramesByGroup(groupId) {
  const [rows] = await db.query("SELECT * FROM expense_frames WHERE group_id = ?", [groupId]);
  return rows;
}

export async function getFrameById(id) {
  const [rows] = await db.query(`
    SELECT e.*, g.name AS groupName
    FROM expense_frames e 
    JOIN \`groups\` g ON e.group_id = g.id
    WHERE e.id = ?`, [id]);
  return rows[0];
}

export async function createFrame(group_id, name, description) {
  const [result] = await db.query(
    "INSERT INTO expense_frames (group_id, name, description) VALUES (?, ?, ?)",
    [group_id, name, description]
  );
  return { id: result.insertId };
}

export async function updateFrame(id, name, description) {
  const [result] = await db.query(
    "UPDATE expense_frames SET name = ?, description = ? WHERE id = ?",
    [name, description, id]
  );
  return result.affectedRows;
}

export async function deleteFrame(id) {
  const [result] = await db.query("DELETE FROM expense_frames WHERE id = ?", [id]);
  return result.affectedRows;
}

export async function searchFrames(groupId, query) {
  const [rows] = await db.query(
    "SELECT * FROM expense_frames WHERE group_id = ? AND name LIKE ?",
    [groupId, `%${query}%`]
  );
  return rows;
}
