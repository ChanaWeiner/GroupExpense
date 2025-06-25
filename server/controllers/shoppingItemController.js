import {
  getAllByFrame,
  getById,
  create,
  update,
  remove
} from '../models/shoppingItemModel.js';

// שליפת כל פריטי הקניות למסגרת מסוימת
export const getItemsByFrame = async (req, res) => {
  const { frame_id } = req.params;
  try {
    const data = await getAllByFrame(frame_id);
    res.json(data);
  } catch {
    res.status(500).json({ message: "שגיאה בטעינת רשימת הקניות" });
  }
};

// שליפה לפי מזהה פריט
export const getItemById = async (req, res) => {
  const { id } = req.params;
  try {
    const item = await getById(id);
    if (!item) return res.status(404).json({ message: "הפריט לא נמצא" });
    res.json(item);
  } catch {
    res.status(500).json({ message: "שגיאה בטעינת פריט" });
  }
};

// יצירת פריט חדש לרשימת קניות
export const createItem = async (req, res) => {
  const { frame_id } = req.params;
  const suggested_by = req.user.id;

  const { name, note } = req.body;

  if (!name) {
    return res.status(400).json({ message: "חסר שם לפריט" });
  }

  try {
    const newItem = await create({
      frame_id,
      suggested_by,
      name,
      note
    });
    res.status(201).json(newItem);
  } catch {
    res.status(500).json({ message: "שגיאה ביצירת פריט" });
  }
};

// עדכון פריט
export const updateItem = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const success = await update(id, updates);
    if (success)
      res.json({ message: "עודכן בהצלחה" });
    else
      res.status(404).json({ message: "הפריט לא נמצא לעדכון" });
  } catch {
    res.status(500).json({ message: "שגיאה בעדכון פריט" });
  }
};

// מחיקת פריט
export const deleteItem = async (req, res) => {
  const { id } = req.params;

  try {
    const success = await remove(id);
    if (success)
      res.json({ message: "נמחק בהצלחה" });
    else
      res.status(404).json({ message: "הפריט לא נמצא למחיקה" });
  } catch {
    res.status(500).json({ message: "שגיאה במחיקת פריט" });
  }
};
