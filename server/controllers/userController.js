import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import { createUser, getUserByEmail, updateUserById } from '../models/userModel.js';

const JWT_SECRET = process.env.JWT_SECRET;

export const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, email, password, paypal_email } = req.body;

    const existingUser = await getUserByEmail(email);
    if (existingUser) return res.status(400).json({ message: 'Email already in use' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await createUser({ name, email, password: hashedPassword, paypal_email });

    const token = jwt.sign({ id: newUser.id }, JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ message: 'User created', token, user: { id: newUser.id, name, email, paypal_email } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Database error' });
  }
};

export const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;

    const user = await getUserByEmail(email);
    if (!user) return res.status(400).json({ message: 'Incorrect email or password. Please try again.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Incorrect email or password. Please try again.' });

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Database error' });
  }
};

export const updateUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { id } = req.params;
  const { name, email, paypal_email } = req.body;

  try {
    const result = await updateUserById(id, name, email, paypal_email);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Database error', details: err });
  }
};

