import express from 'express';
import {
  getFrames, getFrame, create, update, remove, search
} from '../controllers/expenseFrameController.js';

import { verifyToken, isGroupAdmin } from '../middlewares/authMiddleware.js';
import { validateParams, validateBody, validateQuery } from '../middlewares/validateRequest.js';

import {
  groupIdParamSchema,
  frameIdParamSchema,
  searchQuerySchema,
  createFrameBodySchema,
  updateFrameBodySchema,
  frameIdParamSchemaWithGroupId
} from '../validators/frameValidators.js';

const router = express.Router();

router.get(
  '/groups/:group_id',
  verifyToken,
  validateParams(groupIdParamSchema),
  getFrames
);

router.get(
  '/groups/:group_id/search',
  verifyToken,
  validateParams(groupIdParamSchema),
  validateQuery(searchQuerySchema),
  search
);

router.get(
  '/:frame_id',
  verifyToken,
  validateParams(frameIdParamSchema),
  getFrame
);

router.post(
  '/groups/:group_id',
  verifyToken,
  isGroupAdmin,
  validateParams(groupIdParamSchema),
  validateBody(createFrameBodySchema),
  create
);

router.put(
  '/:frame_id',
  verifyToken,
  validateParams(frameIdParamSchema),
  validateBody(updateFrameBodySchema),
  update
);

router.delete(
  '/:frame_id/group/:group_id',
  verifyToken,
  isGroupAdmin,
  validateParams(frameIdParamSchemaWithGroupId),
  remove
);

export default router;
