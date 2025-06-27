import {
  getAllFramesByGroup,
  getFrameById,
  createFrame,
  updateFrame,
  deleteFrame,
  searchFrames
} from '../models/expenseFrameModel.js';

import * as shoppingItemModel from '../models/shoppingItemModel.js';

export const getFrames = async (req, res) => {
  const { group_id } = req.params;
  try {
    const frames = await getAllFramesByGroup(group_id);
    res.json(frames);
  } catch {
    res.status(500).json({ message: 'שגיאה בטעינת מסגרות ההוצאה' });
  }
};

export const getFrame = async (req, res) => {
  const { frame_id } = req.params;
  try {
    const frame = await getFrameById(frame_id);
    if (!frame) return res.status(404).json({ message: 'לא נמצא' });
    res.json(frame);
  } catch {
    res.status(500).json({ message: 'שגיאה בטעינה' });
  }
};

export const create = async (req, res) => {
  const { group_id } = req.params;
  const { name, description, end_date } = req.body;

  const safeEndDate = end_date ? end_date : null;

  try {
    const result = await createFrame(group_id, name, description, safeEndDate);
    res.status(201).json({ message: 'נוצר בהצלחה', id: result.id });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY' || (err.message && err.message.includes('duplicate'))) {
      return res.status(400).json({ message: 'שם מסגרת זה כבר קיים בקבוצה' });
    }
    if (err.message) {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: 'שגיאה ביצירת מסגרת' });
  }
};

export const update = async (req, res) => {
  const { frame_id } = req.params;
  const { name, description } = req.body;
  try {
    const affected = await updateFrame(frame_id, name, description);
    if (!affected) return res.status(404).json({ message: 'לא נמצא' });
    res.json({ message: 'עודכן בהצלחה' });
  } catch {
    res.status(500).json({ message: 'שגיאה בעדכון' });
  }
};

export const remove = async (req, res) => {
  const { frame_id } = req.params;
  try {
    const hasShoppingList = await shoppingItemModel.hasShoppingList(frame_id);
    if (hasShoppingList) return res.status(400).json({ message: ' לא ניתן למחוק כי יש רשימת קניות' });
    const affected = await deleteFrame(frame_id);
    if (!affected) return res.status(404).json({ message: 'לא נמצא' });
    res.json({ message: 'נמחק בהצלחה' });
  } catch {
    res.status(500).json({ message: 'שגיאה במחיקה' });
  }
};

export const search = async (req, res) => {
  const { group_id } = req.params;
  const { query } = req.query;
  try {
    const results = await searchFrames(group_id, query || '');
    res.json(results);
  } catch {
    res.status(500).json({ message: 'שגיאה בחיפוש' });
  }
};
