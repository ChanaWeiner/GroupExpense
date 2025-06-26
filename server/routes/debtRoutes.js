import express from 'express';
import { getMyDebtsStructured,getOwedToMe } from '../controllers/debtController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/my-debts-structured', verifyToken, getMyDebtsStructured);
router.get('/owed-to-me', verifyToken, getOwedToMe);
export default router;