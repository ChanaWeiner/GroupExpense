import express from 'express';
import {
  createExpense,
  getExpensesByFrame,
  getExpenseById,
  updateExpense,
  deleteExpense,
  searchExpenses
} from '../controllers/expenseController.js';

import { verifyToken } from '../middlewares/authMiddleware.js';
import multer from 'multer';
const upload = multer({ dest: 'uploads/' }); // תיקיית שמירת הקבצים

const router = express.Router();

// הוצאות לפי מסגרת מסוימת
router.get('/frame/:frame_id', verifyToken, getExpensesByFrame);
router.get('/frame/:frame_id/search', verifyToken, searchExpenses);

// פעולה על הוצאה מסוימת
router.get('/:id', verifyToken, getExpenseById);
router.post('/group/:group_id/frame/:frame_id',upload.single('receipt'), verifyToken, createExpense);
router.put('/:id', verifyToken, updateExpense);
router.delete('/:id', verifyToken, deleteExpense);

export default router;
