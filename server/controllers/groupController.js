import { create, getGroupsByUserId, deleteGroup, updateGroup,isUserGroupAdmin } from '../models/groupModel.js';
import { addMember,removeMember } from '../models/groupMemberModel.js';
import * as expenseFrameModel from '../models/expenseFrameModel.js';
export const createGroup = async (req, res) => {
  const { name } = req.body;
  const created_by = req.user?.id;

  try {
    const newGroup = await create(name, created_by);
    await addMember(newGroup.id, created_by, 1);

    res.status(201).json({ message: 'הקבוצה נוצרה', group: newGroup });
  } catch {
    res.status(500).json({ message: "שגיאת מסד נתונים" });
  }
};

export const getUserGroups = async (req, res) => {
  try {
    const userId = req.user.id;
    const groups = await getGroupsByUserId(userId);
    res.json(groups);
  } catch {
    res.status(500).json({ message: "שגיאה בטעינת הקבוצות" });
  }
};

export const deleteUserGroup = async (req, res) => {
  const {groupId} = req.params;
  const userId = req.user.id;

  try {
    const success = await removeMember(groupId, userId);
    if (success) {
      res.json({ message: "משתמש נמחק בהצלחה" });
    } else {
      res.status(401).json({ message: "אינך חבר בקבוצה" });
    }
  } catch {
    res.status(500).json({ message: "שגיאת מסד נתונים" });
  }
};

export const updateGroupName = async (req, res) => {
  const groupId = req.params.id;
  const userId = req.user.id;
  const { name: newName } = req.body;

  try {
    const updated = await updateGroup(groupId, userId, newName);
    if (updated) {
      res.json({ message: "שם הקבוצה עודכן" });
    } else {
      res.status(403).json({ message: "אין לך הרשאה לערוך קבוצה זו" });
    }
  } catch {
    res.status(500).json({ message: "שגיאת מסד נתונים בעת עדכון שם הקבוצה" });
  }
};

export const checkIfAdmin = async (req, res)=>{
  const userId = req.user.id;
  const groupId = req.params.groupId;

  try {
    const isAdmin = await isUserGroupAdmin(userId, groupId);
    res.json({ isAdmin });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}

export const deleteGroupById = async (req, res) => {
  const groupId = req.params.groupId;
  const userId = req.user.id;
  try {
    const hasExpenseFrames= await expenseFrameModel.getAllFramesByGroup(groupId);
    if (hasExpenseFrames.length > 0) {
      return res.status(400).json({ message: "יש מסגרות של הוצאות בקבוצה זו, לא ניתן למחוק" });
    }
    const deleted = await deleteGroup(groupId,userId);
    if (deleted) {
      res.json({ message: "הקבוצה נמחקה בהצלחה" });
    } else {
      res.status(403).json({ message: "אין לך הרשאה למחוק קבוצה זו" });
    }
  } catch {
    res.status(500).json({ message: "שגיאת מסד נתונים בעת מחיקת קבוצה" });
  }
};
