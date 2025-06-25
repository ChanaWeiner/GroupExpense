import { create, getGroupsByUserId, deleteGroup, updateGroup,isUserGroupAdmin } from '../models/groupModel.js';
import { addMember } from '../models/groupMemberModel.js';

export const createGroup = async (req, res) => {
  const { name } = req.body;
  const created_by = req.user?.id;

  if (!name) return res.status(400).send('חסר שם');

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
  const groupId = req.params.id;
  const userId = req.user.id;

  try {
    const success = await deleteGroup(groupId, userId);
    if (success) {
      res.json({ message: "הקבוצה נמחקה" });
    } else {
      res.status(404).json({ message: "הקבוצה לא נמצאה או שאינך הבעלים שלה" });
    }
  } catch {
    res.status(500).json({ message: "שגיאת מסד נתונים" });
  }
};

export const updateGroupName = async (req, res) => {
  const groupId = req.params.id;
  const userId = req.user.id;
  const { name: newName } = req.body;

  if (!newName) {
    return res.status(400).json({ message: "חסר שם חדש לקבוצה" });
  }

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
