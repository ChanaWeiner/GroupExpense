import db from '../config/db.js';

export const createUser = async (user) => {
  const [result] = await db.query(
    'INSERT INTO users (name, email, password, paypal_email) VALUES (?, ?, ?, ?)',
    [user.name, user.email, user.password, user.paypal_email]
  );
  return { id: result.insertId, ...user };
};

export const getUserByEmail = async (email) => {
  const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
};

export const getUserById = async (id) => {
  const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
  return rows[0];
};

export const updateUserById = async (id, name, paypal_email) => {
  const [result] = await db.execute(
    'UPDATE users SET name = ?, paypal_email = ? WHERE id = ?',
    [name, paypal_email, id]
  );
  return result;
};

export async function searchUsersByEmailOrName(query) {
  const [rows] = await db.query(`
    SELECT id, name, email FROM users
    WHERE email LIKE ? OR name LIKE ?
    LIMIT 10
  `, [`%${query}%`, `%${query}%`]);

  return rows;
};


export const checkPaypalAccounts = async (fromUserId, toUserId) => {
  const [rows] = await db.query(
    `SELECT id, paypal_email FROM users WHERE id IN (?, ?)`,
    [fromUserId, toUserId]
  );

  let fromUserHasPaypal = false;
  let toUserHasPaypal = false;

  for (const user of rows) {
    if (user.id === fromUserId && user.paypal_email) fromUserHasPaypal = true;
    if (user.id === toUserId && user.paypal_email) toUserHasPaypal = true;
  }

  return { fromUserHasPaypal, toUserHasPaypal };
};


