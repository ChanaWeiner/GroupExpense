import {
  getUserOwedDebts,
  getDebtsOwedToUser,
  getRecentDebts,
  getDebtsDueSoon,
} from '../models/debtModel.js';

import * as paymentModel from '../models/paymentModel.js';

import * as debtModel from '../models/debtModel.js';
import * as groupMemberModel from '../models/groupMemberModel.js';
import * as expenseModel from '../models/expenseModel.js';
import e from 'express';

export async function getUserData(req, res) {
  const userId = req.user.id;

  try {
    const userOwedDebts = await getUserOwedDebts(userId);
    const debtsOwedToUser = await getDebtsOwedToUser(userId);
    const youOwe = userOwedDebts.reduce((sum, d) => sum + Number(d.amount), 0);
    const owedToYou = debtsOwedToUser.reduce((sum, d) => sum + Number(d.amount), 0);
    const totalCredit = owedToYou - youOwe;
    const balance = { youOwe, owedToYou, totalCredit };
    const recentDebts = await getRecentDebts(userId);
    const overdueDebts = await getDebtsDueSoon(userId);
    const overdueMessages = overdueDebts.map(od => "עליך לשלם את החוב ל" + od.from_user_name + " עד מחר בתאריך " + od.due_date);
    const recentPaymentsForUser = (await paymentModel.getRecentPaymentsForUser(userId)).map(p => getPaymentSummaryString(p));
    const messages = { overdueMessages, recentPaymentsForUser };
    //סטטיסטיקות
    //כמה קבוצות יש לי
    //כמה חובות יש לי
    //סכום הוצאות החודש/השנה
    const monthlyExpenses = await expenseModel.getUserExpenses(userId);
    const monthlyExpensesSum = monthlyExpenses.reduce((sum, d) => sum + Number(d.total_amount), 0);
    const numGroups = (await groupMemberModel.getUserGroupsCount(userId))?.count || 0;
    const numDebts = userOwedDebts.length;
    const statistics = { numGroups, numDebts, monthlyExpensesSum };
    res.json({
      balance,
      recentDebts,
      messages,
      statistics
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'שגיאת מסד נתונים' });
  }
}

export function getPaymentSummaryString(payment) {
  // דוגמה: "קיבלת 50 ₪ מ-דני עבור הוצאה: קניות בסופר"
  return `קיבלת ${Number(payment.amount).toFixed(2)} ₪ מ-${payment.from_user_name} עבור הוצאה: ${payment.expense_description}`;
}
