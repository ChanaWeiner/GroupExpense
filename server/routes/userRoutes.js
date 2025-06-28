import express from 'express';
import { register, login,updateUser,searchUsers,getUser,checkPaypalAccountsController  } from '../controllers/userController.js';
import { registerValidator, loginValidator,updateUserValidator } from '../validators/userValidators.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', registerValidator, register);
router.post('/login', loginValidator, login);
router.put('/', verifyToken, updateUserValidator, updateUser);
router.get('/search', verifyToken, searchUsers);
router.get('/me', verifyToken, getUser);
router.post('/check-paypal-accounts', verifyToken,checkPaypalAccountsController );


export default router;
