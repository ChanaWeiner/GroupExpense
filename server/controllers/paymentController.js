import db from '../config/db.js';
import { insertPayment } from '../models/paymentModel.js';
import { markDebtAsPaid } from '../models/debtModel.js';

export const createPayment = async (req, res) => {
  const from_user_id = req.user.id;
  const { to_user_id, amount, debt_id } = req.body;

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    await insertPayment(connection, {
      from_user_id,
      to_user_id,
      amount,
      debt_id
    });

    await markDebtAsPaid(connection, debt_id);

    await connection.commit();
    res.json({ success: true });
  } catch (err) {
    await connection.rollback();
    console.error(err);
    res.status(500).json({ message: 'שגיאה בעת תשלום בפייפאל' });
  } finally {
    connection.release();
  }
};
