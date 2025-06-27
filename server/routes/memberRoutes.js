import express from 'express';
import { verifyToken, isGroupAdmin } from '../middlewares/authMiddleware.js';
import { validateParams, validateBody } from '../middlewares/validateRequest.js';
import {
  groupIdParamSchema,
  removeMemberParamsSchema,
  addMemberBodySchema
} from '../validators/memberValidators.js';

import {
  getGroupMembers,
  addGroupMember,
  removeGroupMember
} from '../controllers/groupMemberController.js';

const router = express.Router();

router.get(
  '/group/:group_id',
  verifyToken,
  validateParams(groupIdParamSchema),
  getGroupMembers
);

router.post(
  '/group/:group_id',
  verifyToken,
  validateParams(groupIdParamSchema),
  validateBody(addMemberBodySchema),
  addGroupMember
);

router.delete(
  '/:id/group/:group_id',
  verifyToken,
  validateParams(removeMemberParamsSchema),
  isGroupAdmin,
  removeGroupMember
);

export default router;
