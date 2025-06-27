import db from '../config/db.js';

export const create = async (name, created_by) => {
  const [result] = await db.query(
    'INSERT INTO \`groups\` (name, created_by) VALUES (?, ?)',
    [name, created_by]
  );
  return { id: result.insertId, name, created_by };
};

export const getGroupsByUserId = async (userId) => {
  const [rows] = await db.query(
    `SELECT 
        g.id, 
        g.name,
        CASE WHEN g.created_by = ? THEN 1 ELSE 0 END AS is_admin
     FROM \`groups\` g
     JOIN group_members m ON g.id = m.group_id
     WHERE m.user_id = ?`,
    [userId, userId]
  );
  return rows;
};

export const deleteGroup = async (groupId, userId) => {
  const [result] = await db.query(
    'DELETE FROM \`groups\` WHERE id = ? AND created_by = ?',
    [groupId, userId]
  );
  return result.affectedRows > 0;
};


export const updateGroup = async (groupId, userId, newName) => {
  const [result] = await db.query(
    `UPDATE \`groups\`
     SET name = ?
     WHERE id = ? AND created_by = ?`,
    [newName, groupId, userId]
  );

  return result.affectedRows > 0;
};

export const isUserGroupAdmin = async (userId, groupId) => {
  const result = await db.query(
    'SELECT COUNT(*) AS count FROM \`groups\` WHERE id = ? AND created_by = ?',
    [groupId, userId]
  );
  return result[0][0].count > 0;
}

