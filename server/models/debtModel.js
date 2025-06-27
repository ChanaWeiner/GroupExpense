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

export async function getDebtsDueSoon(userId, days = 1) {
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
      AND d.due_date IS NOT NULL
      AND d.due_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL ? DAY)
    ORDER BY d.due_date ASC
  `;
  const [rows] = await db.query(query, [userId, userId, days]);
  return rows;
}

// דוגמה פשוטה: יוצרים חוב לכל משתמש בקבוצה, מחלקים שווה בשווה
export const createDebtsForGroup = async (group_id, expense_id, to_user_id, debtPerUser,due_date, connection) => {
  const [users] = await connection.query(
    `SELECT user_id FROM group_members WHERE group_id = ?`,
    [group_id]
  );
  for (const user of users) {
    if (user.user_id === to_user_id) continue;
    await connection.query(
      `INSERT INTO debts (expense_id, from_user_id, to_user_id, amount, created_at,due_date, paid_at, status)
       VALUES (?, ?, ?, ?, NOW(),?, NULL, 'open')`,
      [expense_id, user.user_id, to_user_id, debtPerUser,due_date]
    );
  }
};

export const getMyDebtsWithDetails = async (userId) => {
  const [rows] = await db.query(
    `SELECT d.id, d.expense_id, d.amount, d.created_at as date, d.due_date,
            u.name as to_user_name,
            u.id as to_user_id,
            u.paypal_email,                     
            e.description,
            g.id as group_id, g.name as group_name,
            f.id as frame_id, f.name as frame_name
     FROM debts d
     JOIN users u ON u.id = d.to_user_id
     JOIN expenses e ON e.id = d.expense_id
     JOIN expense_frames f ON f.id = e.frame_id
     JOIN \`groups\` g ON g.id = f.group_id
     WHERE d.from_user_id = ? AND d.status = 'open'
     ORDER BY g.id, f.id, d.created_at`,
    [userId]
  );
  return rows;
};


export const markDebtAsPaid = async (connection, debt_id) => {
  await connection.query(
    `UPDATE debts SET status = 'paid', paid_at = NOW() WHERE id = ?`,
    [debt_id]
  );
};


function getDateFilter(filter) {
  if (filter === '7days') return 'AND d.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)';
  if (filter === '14days') return 'AND d.created_at >= DATE_SUB(NOW(), INTERVAL 14 DAY)';
  return '';
}

export async function getOwedToMeDb(userId, page, pageSize, filter,isPayed=false) {
  const offset = (page - 1) * pageSize;
  const dateFilter = getDateFilter(filter);

  // סך הכל חובות (ל-paging)
  const [countRows] = await db.query(
    `SELECT COUNT(*) as count
     FROM debts d
     WHERE d.to_user_id = ? ${dateFilter}`,
    [userId]
  );
  const totalCount = countRows[0].count;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const status = isPayed ? 'paid' : 'open';
  // מביאים את החובות עצמם עם פרטי ההוצאה
  const [rows] = await db.query(
    `SELECT d.*, e.description, e.date as expense_date, e.total_amount, e.paid_by, e.note, e.id as expense_id, u.name as debtor_name
     FROM debts d
     JOIN expenses e ON d.expense_id = e.id
     JOIN users u ON d.from_user_id = u.id
     WHERE d.to_user_id = ? AND d.status = ? ${dateFilter}
     ORDER BY d.expense_id DESC, d.created_at DESC
     LIMIT ? OFFSET ?`,
    [userId,status, pageSize, offset]
  );

  // עוטפים כל חוב עם פרטי ההוצאה
  const debts = rows.map(row => ({
    ...row,
    expense: {
      id: row.expense_id,
      description: row.description,
      date: row.expense_date,
      total_amount: row.total_amount,
      paid_by: row.paid_by,
      note: row.note,
    }
  }));

  return { debts, totalPages };
}



