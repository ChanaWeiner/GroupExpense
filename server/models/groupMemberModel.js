import db from '../config/db.js';

export const addMember = async (group_id, user_id, is_admin = 0) => {
  await db.query(
    `INSERT INTO group_members (group_id, user_id, is_admin)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE is_admin = VALUES(is_admin)`,
    [group_id, user_id, is_admin]
  );
};

export const removeMember = async (group_id, user_id) => {
  await db.query(
    'DELETE FROM group_members WHERE group_id = ? AND user_id = ?',
    [group_id, user_id]
  );
};

export const getMembers = async (group_id) => {
  const [rows] = await db.query(
    `SELECT users.id, users.name, gm.is_admin, users.email
     FROM group_members gm
     JOIN users ON gm.user_id = users.id
     WHERE gm.group_id = ?`,
    [group_id]
  );
  return rows;
};

export const isGroupAdmin = async (group_id, user_id) => {
  const [[row]] = await db.query(
    'SELECT is_admin FROM group_members WHERE group_id = ? AND user_id = ?',
    [group_id, user_id]
  );
  return row?.is_admin === 1;
};

export const isMemberInGroup = async(group_id, user_id)=> {
  const [rows] = await db.query(
    'SELECT 1 FROM group_members WHERE group_id = ? AND user_id = ?',
    [group_id, user_id]
  );
  return rows.length > 0;
}

export const getNumOfMembersInGroup = async(group_id,connection)=> {
  const [rows] = await connection.query(
    'SELECT COUNT(*) AS count FROM group_members WHERE group_id = ?',
    [group_id]
  );
  return rows[0].count;
}

