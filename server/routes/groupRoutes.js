import express from 'express';
import {
  createGroup,
  getUserGroups,
  deleteUserGroup,
  updateGroupName,
  checkIfAdmin,
  deleteGroupById
} from '../controllers/groupController.js';

import { verifyToken, isGroupAdmin } from '../middlewares/authMiddleware.js';
import { validateBody, validateParams } from '../middlewares/validateRequest.js';
import {
  groupCreationSchema,
  groupUpdateSchema,
  groupIdParamSchema
} from '../validators/groupValidators.js';

const router = express.Router();

router.post('', verifyToken, validateBody(groupCreationSchema), createGroup);
router.get('', verifyToken, getUserGroups);
router.put('/:id', verifyToken, validateParams(groupIdParamSchema), validateBody(groupUpdateSchema), updateGroupName);
router.get('/:groupId/isAdmin', verifyToken, validateParams(groupIdParamSchema), checkIfAdmin);
router.post('/:groupId/leave', verifyToken, validateParams(groupIdParamSchema), deleteUserGroup);
router.delete('/:groupId', verifyToken, validateParams(groupIdParamSchema), isGroupAdmin, deleteGroupById);

export default router;
