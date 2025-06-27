import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import userDataRoutes from './routes/userDataRoutes.js';
import groupRoutes from './routes/groupRoutes.js';
import expenseFrameRoutes from './routes/expenseFrameRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';
import shoppingItemRoutes  from './routes/shoppingItemRoutes.js';
import debtRoutes  from './routes/debtRoutes.js';
import paymentRoutes  from './routes/paymentRoutes.js';
import memberRoutes  from './routes/memberRoutes.js';

import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
const app = express();
app.use(cors());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// הוספת השירות הסטטי
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/userData', userDataRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/frames', expenseFrameRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/shopping-items', shoppingItemRoutes);
app.use('/api/debts', debtRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/members', memberRoutes);


app.listen(3000, () => {
  console.log('Server running...');
});
