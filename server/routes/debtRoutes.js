import express from 'express';
import { getMyDebtsStructured,getOwedToMe } from '../controllers/debtController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { validateQuery } from '../middlewares/validateRequest.js';
import {owedToMeQuerySchema} from '../validators/debtValidators.js'
const router = express.Router();

router.get('/my-debts-structured', verifyToken, getMyDebtsStructured);
router.get(
  '/owed-to-me',
  verifyToken,
  validateQuery(owedToMeQuerySchema),
  getOwedToMe
);

export default router;