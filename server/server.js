import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import userDataRoutes from './routes/userDataRoutes.js';
import groupRoutes from './routes/groupRoutes.js';
import expenseFrameRoutes from './routes/expenseFrameRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';
import shoppingItemRoutes  from './routes/shoppingItemRoutes.js';

import cors from 'cors';

dotenv.config();
const app = express();
app.use(cors());

app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/userData', userDataRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/frames', expenseFrameRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/shopping-items', shoppingItemRoutes);


app.listen(3000, () => {
  console.log('Server running...');
});
