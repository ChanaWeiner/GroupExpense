
import * as expenseModel from '../models/expenseModel.js';
import * as debtModel from '../models/debtModel.js';
import * as memberModel from '../models/groupMemberModel.js';

import db from '../config/db.js';


// ✅ שליפה לפי מזהה מסגרת
export const getExpensesByFrame = async (req, res) => {
  const { frame_id } = req.params;

  try {
    const data = await expenseModel.getAllByFrame(frame_id);
    res.json(data);
  } catch(err) {
    res.status(500).json({ message: "שגיאה בטעינת ההוצאות מהמסגרת" });
  }
};

// ✅ שליפה של הוצאה בודדת לפי מזהה
export const getExpenseById = async (req, res) => {
  const { id } = req.params;

  try {
    const expense = await expenseModel.getById(id);
    if (!expense) return res.status(404).json({ message: "הוצאה לא נמצאה" });
    res.json(expense);
  } catch {
    res.status(500).json({ message: "שגיאה בטעינת הוצאה" });
  }
};



export const createExpense = async (req, res) => {
  const { frame_id, group_id } = req.params;
  const paid_by = req.user.id;
  const { total_amount, description, date } = req.body;
  let items;

  try {
    items = JSON.parse(req.body.items);
  } catch {
    return res.status(400).json({ message: 'פריטים אינם בפורמט תקין' });
  }

  if (!description || !total_amount || isNaN(total_amount)) {
    return res.status(400).json({ message: 'שדות חסרים או סכום אינו תקין' });
  }

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'יש לבחור לפחות פריט אחד' });
  }

  const connection = await db.getConnection();
  await connection.beginTransaction();

  try {
    // ⚠ ולידציה שהסכומים מסתכמים בדיוק לסכום הכולל
    const sumOfItems = items.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
    if (Math.abs(sumOfItems - total_amount) > 0.01) {
      throw new Error('סכום הפריטים אינו תואם לסכום הכולל');
    }

    // ⚠ ולידציה שהפריטים שייכים למסגרת (עברה למודל)
    const isValid = await expenseModel.validateItemsBelongToFrame(frame_id, items, connection);
    if (!isValid) {
      throw new Error('פריטים מסוימים אינם שייכים למסגרת זו');
    }

    const receipt_path = req.file?.path || null;

    const frame = await expenseModel.getFrameById(frame_id, connection); // כוללת את end_date
    const due_date = frame?.end_date || null;

    const newExpense = await expenseModel.createExpense({
      frame_id,
      paid_by,
      total_amount,
      description,
      date: date || new Date().toISOString().split('T')[0],
      receipt_path
    }, connection);

    for (const item of items) {
      await expenseModel.createExpenseItem(newExpense.id, item.id, item.amount, connection);
    }

    const numOfMembers = await memberModel.getNumOfMembersInGroup(group_id, connection);
    const debtPerUser = total_amount / numOfMembers;

    await debtModel.createDebtsForGroup(group_id, newExpense.id, paid_by, debtPerUser, due_date, connection);

    await connection.commit();
    res.status(201).json(newExpense);
  } catch (err) {
    await connection.rollback();
    console.error(err);
    res.status(500).json({ message: err.message || 'שגיאה ביצירת הוצאה' });
  } finally {
    await connection.release();
  }
};



// ✅ עדכון הוצאה
export const updateExpense = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const success = await update(id, updates);
    if (success)
      res.json({ message: "עודכן בהצלחה" });
    else
      res.status(404).json({ message: "הוצאה לא נמצאה לעדכון" });
  } catch {
    res.status(500).json({ message: "שגיאה בעדכון הוצאה" });
  }
};

// ✅ מחיקת הוצאה
export const deleteExpense = async (req, res) => {
  const { id } = req.params;

  try {
    const success = await remove(id);
    if (success)
      res.json({ message: "נמחק בהצלחה" });
    else
      res.status(404).json({ message: "הוצאה לא נמצאה למחיקה" });
  } catch {
    res.status(500).json({ message: "שגיאה במחיקת הוצאה" });
  }
};

// ✅ חיפוש הוצאות בתוך מסגרת
export const searchExpenses = async (req, res) => {
  const { frame_id } = req.params;
  const q = req.query.q || '';

  try {
    const results = await search(frame_id, q);
    res.json(results);
  } catch {
    res.status(500).json({ message: "שגיאה בחיפוש הוצאות" });
  }
};
