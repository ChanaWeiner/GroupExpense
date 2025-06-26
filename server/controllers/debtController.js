import {getMyDebtsWithDetails} from '../models/debtModel.js';

export const getMyDebtsStructured = async (req, res) => {
  try {
    const userId = req.user.id;
    const debts = await getMyDebtsWithDetails(userId);

    const grouped = {};
    for (const debt of debts) {
      const { group_id, group_name, frame_id, frame_name } = debt;

      if (!grouped[group_id]) {
        grouped[group_id] = {
          group_id,
          group_name,
          frames: {}
        };
      }

      if (!grouped[group_id].frames[frame_id]) {
        grouped[group_id].frames[frame_id] = {
          frame_id,
          frame_name,
          debts: []
        };
      }

      grouped[group_id].frames[frame_id].debts.push({
        debt_id: debt.id,
        expense_id: debt.expense_id,
        description: debt.description,
        amount: debt.amount,
        to_user_name: debt.to_user_name,
        to_user_id: debt.to_user_id,
        paypal_email: debt.paypal_email,
        due_date: debt.due_date,
        date: debt.date,
      });
    }

    const result = Object.values(grouped).map(group => ({
      ...group,
      frames: Object.values(group.frames)
    }));

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'שגיאה בשליפת חובות' });
  }
};