import express from 'express';
import { payViaPaypal } from '../controllers/paymentController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/paypal', verifyToken, payViaPaypal);

export default router;