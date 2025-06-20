import React from 'react';
import { useAuth } from '../context/AuthContext';
import '../../styles/DebtList.css'; // Assuming you have a CSS file for styling


export default function DebtList({ recentDebts, isLoading }) {
  const { user } = useAuth();

  return (
    <section className="debt-list">
  {isLoading ? (
    <div className="loading">Loading debts...</div>
  ) : (
    <div className="debt-list-content">
      <h3 className="debt-list-title">Recent Debts</h3>

      {recentDebts.length > 0 ? (
        <ul className="debt-list-items">
          {recentDebts.map((debt) => {
            const amountText = `${debt.amount}₪`;
            const fromUser = debt.from_user_name || `User #${debt.from_user_id}`;
            const toUser = debt.to_user_name || `User #${debt.to_user_id}`;
            const formattedDate = new Date(debt.created_at).toLocaleDateString();
            const paidAtText = debt.paid_at
              ? new Date(debt.paid_at).toLocaleDateString()
              : 'Not paid yet';
            const statusText = debt.status.charAt(0).toUpperCase() + debt.status.slice(1);
            const expenseText = debt.expense_description || 'No description';
            const expenseId = debt.expense_id || '—';

            return (
              <li key={debt.id} className="debt-item">
                <div className="debt-details">
                  <span className="debt-amount">{amountText}</span>
                  <span className="debt-users">
                    {user.id === debt.from_user_id
                      ? `You ➜ ${toUser}`
                      : `${fromUser} ➜ You`}
                  </span>
                  <span className="debt-description">
                    Expense #{expenseId}: {expenseText}
                  </span>
                  <span className="debt-status">Status: {statusText}</span>
                  <span className="debt-paid-at">Paid at: {paidAtText}</span>
                </div>
                <div className="debt-date">Created: {formattedDate}</div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="no-debts">No recent debts found.</p>
      )}
    </div>
  )}
</section>

  );
}
