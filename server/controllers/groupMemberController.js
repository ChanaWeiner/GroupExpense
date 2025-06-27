import * as groupMemberModel from '../models/groupMemberModel.js';

import { getUserByEmail } from '../models/userModel.js';

export const addGroupMember = async (req, res) => {
  const { group_id, user_email } = req.body;

  try {
    // חיפוש המשתמש לפי מייל
    const user = await getUserByEmail(user_email);
    if (!user) {
      return res.status(404).json({ message: "משתמש לא נמצא" });
    }

    // בדיקה אם המשתמש כבר חבר בקבוצה
    const alreadyMember = await groupMemberModel.isMemberInGroup(group_id, user.id);
    if (alreadyMember) {
      return res.status(409).json({ message: "המשתמש כבר חבר בקבוצה" });
    }

    // הוספת המשתמש לפי ה-id שלו
    await groupMemberModel.addMember(group_id, user.id);
    res.status(201).json({ message: "החבר נוסף בהצלחה" });

  } catch (error) {
    console.error("שגיאה בהוספת חבר:", error);
    res.status(500).json({ message: "שגיאה בהוספת חבר" });
  }
};



export const removeGroupMember = async (req, res) => {
  const { group_id, id } = req.params;

  try {
    const isMember = await groupMemberModel.isMemberInGroup(group_id, id);
    if (!isMember) {
      return res.status(404).json({ message: "המשתמש אינו חבר בקבוצה" });
    }
    const hasExpenses = await groupMemberModel.userHasExpensesOrDebts(group_id, id);
    if (hasExpenses) {
      return res.status(400).json({ message: "לא ניתן למחוק חבר שביצע הוצאות או חובות בקבוצה" });
    }
    await groupMemberModel.removeMember(group_id, id);
    res.json({ message: "החבר הוסר מהקבוצה" });

  } catch (error) {
    console.error("שגיאה במחיקת חבר:", error);
    res.status(500).json({ message: "שגיאה במחיקת חבר" });
  }
};


export const getGroupMembers = async (req, res) => {
  const { group_id } = req.params;
  const user_id = req.user.id;

  // אפשר גם לבדוק האם המשתמש חבר בקבוצה, אם רוצים הגבלה
  try {
    const members = await groupMemberModel.getMembers(group_id);
    res.json(members);
  } catch {
    res.status(500).json({ message: "Failed to fetch members" });
  }
};

