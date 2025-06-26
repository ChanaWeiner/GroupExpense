import express from 'express';
import { createPayment } from '../controllers/paymentController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('paypal', verifyToken, createPayment);

export default router;