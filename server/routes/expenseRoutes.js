// routes/expensesRoutes.js
import express from 'express';
import multer from 'multer';

import {
  createExpense,
  getExpensesByFrame,
  getExpenseById,
  searchExpenses,
  getUserExpenses
} from '../controllers/expenseController.js';

import { verifyToken } from '../middlewares/authMiddleware.js';
import { validateParams, validateQuery, validateBody } from '../middlewares/validateRequest.js';

import {
  frameIdParamSchema,
  expenseIdParamSchema,
  groupAndFrameIdParamsSchema,
  searchExpensesQuerySchema,
  createExpenseBodySchema
} from '../validators/expenseValidators.js';

const upload = multer({ dest: 'uploads/' }); // שמירת קבצים זמנית
const router = express.Router();

// הוצאות לפי מסגרת מסוימת


router.get('/my', verifyToken, getUserExpenses);


router.get(
  '/frame/:frame_id',
  verifyToken,
  validateParams(frameIdParamSchema),
  getExpensesByFrame
);

router.get(
  '/frame/:frame_id/search',
  verifyToken,
  validateParams(frameIdParamSchema),
  validateQuery(searchExpensesQuerySchema),
  searchExpenses
);

// פעולה על הוצאה מסוימת
router.get(
  '/:id',
  verifyToken,
  validateParams(expenseIdParamSchema),
  getExpenseById
);

// יצירת הוצאה חדשה
router.post(
  '/group/:group_id/frame/:frame_id',
  upload.single('receipt'),
  verifyToken,
  validateParams(groupAndFrameIdParamsSchema),
  validateBody(createExpenseBodySchema),
  createExpense
);

export default router;
