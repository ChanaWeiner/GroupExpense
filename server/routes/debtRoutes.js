import express from 'express';
import { getMyDebtsStructured } from '../controllers/debtController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/my-debts-structured', verifyToken, getMyDebtsStructured);

export default router;