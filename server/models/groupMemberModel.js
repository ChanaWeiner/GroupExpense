import db from '../config/db.js';

export const addMember = async (group_id, user_id, is_admin = 0) => {
  await db.query(
    `INSERT INTO group_members (group_id, user_id, is_admin)
       VALUES (?, ?, ?)`,
      [group_id, user_id, is_admin]
  );
};

export const removeMember = async (group_id, user_id) => {
  const [result] = await db.query(
    'DELETE FROM group_members WHERE group_id = ? AND user_id = ?',
    [group_id, user_id]
  );
  return result.affectedRows > 0;
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

export const getUserGroupsCount = async(user_id)=> {
  const [rows] = await db.query(
    `SELECT COUNT(*) AS count
    FROM group_members gm
    JOIN \`groups\` g ON gm.group_id = g.id
    WHERE gm.user_id = ?`,
    [user_id]
  );
  return rows[0].count;
}


export async function userHasExpensesOrDebts(group_id, user_id) {
  // בדיקת הוצאות של המשתמש בקבוצה
  const [expenses] = await db.query(
    `SELECT 1
     FROM expenses e
     JOIN expense_frames f ON e.frame_id = f.id
     JOIN \`groups\` g ON f.group_id = g.id
     WHERE g.id = ? AND e.paid_by = ?
     LIMIT 1`,
    [group_id, user_id]
  );
  if (expenses.length > 0) return true;

  // בדיקת חובות של המשתמש בקבוצה (דרך expenses)
  const [debts] = await db.query(
    `SELECT 1
     FROM debts d
     JOIN expenses e ON d.expense_id = e.id
     JOIN expense_frames f ON e.frame_id = f.id
     JOIN \`groups\` g ON f.group_id = g.id
     WHERE g.id = ? AND (d.from_user_id = ? OR d.to_user_id = ?)
     LIMIT 1`,
    [group_id, user_id, user_id]
  );
  if (debts.length > 0) return true;

  return false;
}
