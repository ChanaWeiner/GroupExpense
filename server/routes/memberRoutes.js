import express from 'express';
import { verifyToken,isGroupAdmin } from '../middlewares/authMiddleware.js';
const router = express.Router();
import {
    getGroupMembers,
    addGroupMember,
    removeGroupMember
  } from '../controllers/groupMemberController.js';

router.get('/group/:group_id', verifyToken, getGroupMembers);
router.post('/group/:group_id', verifyToken, addGroupMember);
router.delete('/:id/group/:group_id', verifyToken, isGroupAdmin, removeGroupMember);

export default router;
