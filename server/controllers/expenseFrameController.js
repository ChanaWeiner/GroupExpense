import {
  getAllFramesByGroup,
  getFrameById,
  createFrame,
  updateFrame,
  deleteFrame,
  searchFrames
} from '../models/expenseFrameModel.js';

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
const {group_id}= req.params;
  const {  name, description,end_date } = req.body;
  try {
    const result = await createFrame(group_id, name, description,end_date);
    res.status(201).json({ message: 'נוצר בהצלחה', id: result.id });
  } catch {
    res.status(500).json({ message: 'שגיאה ביצירה' });
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
