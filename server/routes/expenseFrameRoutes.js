// routes/framesRoutes.js
import express from 'express';
import {
  getFrames, getFrame, create, update, remove, search
} from '../controllers/expenseFrameController.js';
import { verifyToken,isGroupAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// מסגרות של קבוצה מסוימת
router.get('/groups/:group_id', verifyToken, getFrames);
router.get('/groups/:group_id/search', verifyToken, search);

// מסגרת מסוימת לפי מזהה
router.get('/:frame_id', verifyToken, getFrame);
router.post('/groups/:group_id', verifyToken,isGroupAdmin, create);
router.put('/:frame_id', verifyToken, update);
router.delete('/:frame_id', verifyToken,isGroupAdmin, remove);

export default router;
