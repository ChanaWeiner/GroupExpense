import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import { createUser, getUserByEmail, updateUserById, searchUsersByEmailOrName, getUserById, checkPaypalAccounts } from '../models/userModel.js';

const JWT_SECRET = process.env.JWT_SECRET;

const REFRESH_SECRET = process.env.REFRESH_SECRET;
const REFRESH_EXPIRES = '7d'; // שבוע

// הפקת שני טוקנים
function generateTokens(userId) {
  const accessToken = jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ id: userId }, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES });
  return { accessToken, refreshToken };
}

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
      user: { name, email, paypal_email }
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
      user: { name: user.name, email: user.email, paypal_email: user.paypal_email }
    });

    // const { accessToken, refreshToken } = generateTokens(user.id);
    // res.cookie("refreshToken", refreshToken, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === 'production',
    //   sameSite: 'Strict',
    //   maxAge: 7 * 24 * 60 * 60 * 1000, // שבוע
    // });
    // res.json({
    //   token: accessToken,
    //   user: { name: user.name, email: user.email, paypal_email: user.paypal_email }
    // });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'שגיאת מסד נתונים' });
  }
};

export const updateUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  const userId = req.user.id;
  const { name, paypal_email } = req.body;

  try {
    const result = await updateUserById(userId, name, paypal_email);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'המשתמש לא נמצא' });
    }

    res.json({ message: 'המשתמש עודכן בהצלחה' });
  } catch (err) {
    res.status(500).json({ error: 'שגיאת מסד נתונים:' + err });
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

export const getUser = async (req, res) => {
  const id = req.user.id;
  try {
    const user = await getUserById(id);
    if (!user) return res.status(404).json({ message: 'משתמש לא נמצא' });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'שגיאת מסד נתונים' });
  }
}


export const checkPaypalAccountsController = async (req, res) => {
  try {
    const fromUserId = req.user.id;
    const { toUserId } = req.body;
    const result = await checkPaypalAccounts(fromUserId, toUserId);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'שגיאה בבדיקת חשבונות PayPal' });
  }
};

