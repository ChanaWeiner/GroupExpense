import express from 'express';
import { register, login,updateUser  } from '../controllers/userController.js';
import { registerValidator, loginValidator,updateUserValidator } from '../validators/userValidators.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', registerValidator, register);
router.post('/login', loginValidator, login);
router.put('/:id', verifyToken, updateUserValidator, updateUser);

export default router;
