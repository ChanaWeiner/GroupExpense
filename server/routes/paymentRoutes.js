import express from 'express';
import { payViaPaypal } from '../controllers/paymentController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { validateBody } from '../middlewares/validateRequest.js';
import { paypalPaymentSchema } from '../validators/paymentValidators.js';

const router = express.Router();

router.post('/paypal', verifyToken, validateBody(paypalPaymentSchema), payViaPaypal);

export default router;