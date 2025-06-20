import express from 'express';
import { verifyToken } from '../middlewares/authMiddleware.js';

import { getUserData } from '../controllers/userDataController.js';

const router = express.Router();
// Route to get user data
router.get('/:id', verifyToken, getUserData);
// Route to update user data
// router.put('/:id', verifyToken, updateUserData);

export default router;
