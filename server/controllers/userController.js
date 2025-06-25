import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import { createUser, getUserByEmail, updateUserById,searchUsersByEmailOrName } from '../models/userModel.js';

const JWT_SECRET = process.env.JWT_SECRET;

// נשארו שמות הפונקציות באנגלית, רק הטקסטים שנשלחים למשתמש תורגמו לעברית

export const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { name, email, password, paypal_email } = req.body;

    const existingUser = await getUserByEmail(email);
    if (existingUser)
      return res.status(400).json({ message: 'כתובת הדוא"ל כבר בשימוש' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await createUser({ name, email, password: hashedPassword, paypal_email });

    const token = jwt.sign({ id: newUser.id }, JWT_SECRET, { expiresIn: '1d' });
    res.status(201).json({
      message: 'המשתמש נוצר בהצלחה',
      token,
      user: { id: newUser.id, name, email, paypal_email }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'שגיאת מסד נתונים' });
  }
};

export const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;

    const user = await getUserByEmail(email);
    if (!user)
      return res.status(400).json({ message: 'דוא"ל או סיסמה שגויים. נסה שוב.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: 'דוא"ל או סיסמה שגויים. נסה שוב.' });

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1d' });
    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'שגיאת מסד נתונים' });
  }
};

export const updateUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { id } = req.params;
  const { name, email, paypal_email } = req.body;

  try {
    const result = await updateUserById(id, name, email, paypal_email);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'המשתמש לא נמצא' });
    }

    res.json({ message: 'המשתמש עודכן בהצלחה' });
  } catch (err) {
    res.status(500).json({ error: 'שגיאת מסד נתונים', details: err });
  }
};

export const searchUsers = async (req, res) => {
  const query = req.query.query?.toLowerCase()?.trim();
  if (!query || query.length < 2) {
    return res.status(400).json({ message: "החיפוש קצר מדי" });
  }

  try {
    const users = await searchUsersByEmailOrName(query);
    res.json(users);
  } catch (err) {
    console.error('שגיאה בפונקציית searchUsers:', err);
    res.status(500).json({ message: 'שגיאה בשרת' });
  }
};
