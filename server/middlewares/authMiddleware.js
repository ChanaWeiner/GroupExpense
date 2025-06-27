import jwt from 'jsonwebtoken';
import * as groupMemberModel from '../models/groupMemberModel.js';
const JWT_SECRET = process.env.JWT_SECRET;

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'אין לך הרשאה' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'טוקן לא תקף' });
  }
};

export const isGroupAdmin = async(req,res,next)=>{
  const groupId = req.params.group_id;
  const userId = req.user.id;
  if (!groupId) return res.status(400).json({ message: 'חסר קבוצה' });
  if (!userId) return res.status(400).json({ message: 'חסר משתמש' });
  const isAdmin = await groupMemberModel.isGroupAdmin(groupId, userId);
  if (!isAdmin) return res.status(403).json({ message: 'אין לך הרשאה' });
  next();
}
