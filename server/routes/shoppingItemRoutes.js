import express from 'express';
import {
  getItemsByFrame,
  getItemById,
  createItem,
  updateItem,
  deleteItem
} from '../controllers/shoppingItemController.js';

import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// פריטי קניות למסגרת מסוימת
router.get('/frame/:frame_id', verifyToken, getItemsByFrame);
router.post('/frame/:frame_id', verifyToken, createItem);

// פעולות לפי מזהה פריט
router.get('/:id', verifyToken, getItemById);
router.put('/:id', verifyToken, updateItem);
router.delete('/:id', verifyToken, deleteItem);

export default router;
