import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import userDataRoutes from './routes/userDataRoutes.js';
import cors from 'cors';

dotenv.config();
const app = express();
app.use(cors());

app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/userData', userDataRoutes);

app.listen(3000, () => {
  console.log('Server running...');
});
