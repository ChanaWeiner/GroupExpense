import {
  create,
  getAllByFrame,
  getById,
  update,
  remove,
  search
} from '../models/expenseModel.js';

// ✅ שליפה לפי מזהה מסגרת
export const getExpensesByFrame = async (req, res) => {
  const { frame_id } = req.params;

  try {
    const data = await getAllByFrame(frame_id);
    res.json(data);
  } catch {
    res.status(500).json({ message: "שגיאה בטעינת ההוצאות מהמסגרת" });
  }
};

// ✅ שליפה של הוצאה בודדת לפי מזהה
export const getExpenseById = async (req, res) => {
  const { id } = req.params;

  try {
    const expense = await getById(id);
    if (!expense) return res.status(404).json({ message: "הוצאה לא נמצאה" });
    res.json(expense);
  } catch {
    res.status(500).json({ message: "שגיאה בטעינת הוצאה" });
  }
};

// ✅ יצירת הוצאה חדשה למסגרת
export const createExpense = async (req, res) => {
  const { frame_id } = req.params;
  const paid_by = req.user.id;
  const { total_amount, description, date } = req.body;

  if (!total_amount || isNaN(total_amount)) {
    return res.status(400).json({ message: "סכום אינו תקין" });
  }

  try {
    const newExpense = await create({
      frame_id,
      paid_by,
      total_amount,
      description,
      date: date || new Date().toISOString().split('T')[0]
    });
    res.status(201).json(newExpense);
  } catch {
    res.status(500).json({ message: "שגיאה ביצירת הוצאה" });
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
