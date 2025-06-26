import db from '../config/db.js';
import * as paymentModel from '../models/paymentModel.js';
import * as debtModel from '../models/debtModel.js';
import { sendPayout } from '../services/PayPalService.js';


// export const createPayment = async (req, res) => {
//   const from_user_id = req.user.id;
//   const { to_user_id, amount, debt_id } = req.body;

//   const connection = await db.getConnection();
//   try {
//     await connection.beginTransaction();

//     await insertPayment(connection, {
//       from_user_id,
//       to_user_id,
//       amount,
//       debt_id
//     });

//     await markDebtAsPaid(connection, debt_id);

//     await connection.commit();
//     res.json({ success: true });
//   } catch (err) {
//     await connection.rollback();
//     console.error(err);
//     res.status(500).json({ message: 'שגיאה בעת תשלום בפייפאל' });
//   } finally {
//     connection.release();
//   }
// };



export const payViaPaypal = async (req, res) => {
  const connection = await db.getConnection();

  try {
    const fromUserId = req.user.id;
    const { debt_id, amount, to_user_email, to_user_id } = req.body;

    await connection.beginTransaction();

    // 1. העברה בפועל דרך PayPal
    const result = await sendPayout({
      email: to_user_email,
      amount,
      note: 'Group Payment',
      sender_item_id: debt_id,
    });

    // 2. הכנסה למסד
    await paymentModel.insertPayment(connection, {
      from_user_id: fromUserId,
      to_user_id,
      amount,
      method: 'paypal',
      debt_id,
    });

    await debtModel.markDebtAsPaid(connection, debt_id);

    await connection.commit();
    res.json({ success: true, paypal: result });
  } catch (err) {
    await connection.rollback();
    console.error(err);
    res.status(500).json({ message: 'שגיאה בתשלום דרך PayPal' });
  } finally {
    connection.release();
  }
};


