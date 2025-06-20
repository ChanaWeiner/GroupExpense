import {
  getUserOwedDebts,
  getDebtsOwedToUser,
  getRecentDebts,
  getOverdueDebts,
} from '../models/debtModel.js';

export async function getUserData(req, res) {
  const userId =req.params.id;
  const user = req.user;

  if (user.id !== Number(userId)) {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    const userOwedDebts = await getUserOwedDebts(userId);
    const debtsOwedToUser = await getDebtsOwedToUser(userId);
    const youOwe = userOwedDebts.reduce((sum, d) => sum + Number(d.amount), 0);
    const owedToYou = debtsOwedToUser.reduce((sum, d) => sum + Number(d.amount), 0);
    const totalCredit = owedToYou - youOwe;

    const recentDebts = await getRecentDebts(userId);
    const overdueDebts = await getOverdueDebts(userId);

    res.json({
      youOwe,
      owedToYou,
      totalCredit,
      recentDebts,
      overdueDebts
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Database error' });
  }
}
