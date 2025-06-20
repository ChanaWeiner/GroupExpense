import db from '../config/db.js';

export const createUser = async (user) => {
  const [result] = await db.execute(
    'INSERT INTO users (name, email, password, paypal_email) VALUES (?, ?, ?, ?)',
    [user.name, user.email, user.password, user.paypal_email]
  );
  return { id: result.insertId, ...user };
};

export const getUserByEmail = async (email) => {
  const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
};

export const getUserById = async (id) => {
  const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [id]);
  return rows[0];
};

export const updateUserById = async (id, name, email, paypal_email) => {
  const [result] = await db.execute(
    'UPDATE users SET name = ?, email = ?, paypal_email = ? WHERE id = ?',
    [name, email, paypal_email, id]
  );
  return result;
};
