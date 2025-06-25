import React from 'react';
import { useAuth } from '../context/AuthContext';
import '../../styles/DebtList.css';

export default function DebtList({ recentDebts, isLoading }) {
  const { user } = useAuth();

  return (
    <section className="debt-list" dir="rtl">
      {isLoading ? (
        <div className="loading">טוען חובות...</div>
      ) : (
        <div className="debt-list-content">
          <h3 className="debt-list-title">חובות אחרונים</h3>

          {recentDebts.length > 0 ? (
            <ul className="debt-list-items">
              {recentDebts.map((debt) => {
                const amountText = `${debt.amount}₪`;
                const fromUser = debt.from_user_name || `משתמש מס' ${debt.from_user_id}`;
                const toUser = debt.to_user_name || `משתמש מס' ${debt.to_user_id}`;
                const formattedDate = new Date(debt.created_at).toLocaleDateString('he-IL');
                const paidAtText = debt.paid_at
                  ? new Date(debt.paid_at).toLocaleDateString('he-IL')
                  : 'טרם שולם';
                const statusText = debt.status === 'paid' ? 'שולם' :
                                   debt.status === 'pending' ? 'ממתין' :
                                   debt.status === 'overdue' ? 'פג תוקף' :
                                   debt.status; // ברירת מחדל
                const expenseText = debt.expense_description || 'אין תיאור';
                const expenseId = debt.expense_id || '—';

                return (
                  <li key={debt.id} className="debt-item">
                    <div className="debt-details">
                      <span className="debt-amount">{amountText}</span>
                      <span className="debt-users">
                        {user.id === debt.from_user_id
                          ? `את/ה ➜ ${toUser}`
                          : `${fromUser} ➜ את/ה`}
                      </span>
                      <span className="debt-description">
                        הוצאה #{expenseId}: {expenseText}
                      </span>
                      <span className="debt-status">סטטוס: {statusText}</span>
                      <span className="debt-paid-at">תאריך תשלום: {paidAtText}</span>
                    </div>
                    <div className="debt-date">נוצר בתאריך: {formattedDate}</div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="no-debts">לא נמצאו חובות אחרונים.</p>
          )}
        </div>
      )}
    </section>
  );
}
