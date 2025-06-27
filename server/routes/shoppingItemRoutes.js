import express from 'express';
import {
  getItemsByFrame,
  getItemById,
  createItem,
  updateItem,
  deleteItem
} from '../controllers/shoppingItemController.js';

import { verifyToken } from '../middlewares/authMiddleware.js';
import { validateParams, validateBody } from '../middlewares/validateRequest.js';
import {
  frameIdParamSchema,
  itemIdParamSchema,
  createItemSchema,
  updateItemSchema
} from '../validators/itemValidators.js';

const router = express.Router();

// פריטי קניות למסגרת מסוימת
router.get('/frame/:frame_id', verifyToken, validateParams(frameIdParamSchema), getItemsByFrame);
router.post('/frame/:frame_id', verifyToken, validateParams(frameIdParamSchema), validateBody(createItemSchema), createItem);

// פעולות לפי מזהה פריט
router.get('/:id', verifyToken, validateParams(itemIdParamSchema), getItemById);
router.put('/:id', verifyToken, validateParams(itemIdParamSchema), validateBody(updateItemSchema), updateItem);
router.delete('/:id', verifyToken, validateParams(itemIdParamSchema), deleteItem);

export default router;
