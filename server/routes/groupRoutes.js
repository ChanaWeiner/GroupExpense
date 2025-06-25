import express from 'express';
import {
  createGroup,
  getUserGroups,
  deleteUserGroup,
  updateGroupName,
  checkIfAdmin
} from '../controllers/groupController.js';

import {
  getFrames, getFrame, create, update, remove, search
} from '../controllers/expenseFrameController.js';

import {
  addGroupMember,
  removeGroupMember,
  getGroupMembers,
  
} from '../controllers/groupMemberController.js';

import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('', verifyToken, createGroup);
router.get('', verifyToken, getUserGroups);
router.delete('/:id', verifyToken, deleteUserGroup);
router.put('/:id', verifyToken, updateGroupName);
router.get('/:groupId/isAdmin',verifyToken,checkIfAdmin)
// חברי קבוצה — תחת /:group_id/members
router.get('/:group_id/members', verifyToken, getGroupMembers);
router.post('/:group_id/members', verifyToken, addGroupMember);
router.delete('/:group_id/members/:member_id', verifyToken, removeGroupMember);



export default router;
