import React from 'react';
import sendRequest from '../../services/serverApi';

export default function ExpenseList({ expenses, isAdmin, token, frameId, onDeleteExpense }) {

  async function handleDelete(id) {
    if (!window.confirm('למחוק הוצאה זו?')) return;
    try {
      await sendRequest(`frames/${frameId}/expenses/${id}`, 'DELETE', null, token);
      onDeleteExpense(id);
    } catch (err) {
      alert('שגיאה במחיקת הוצאה');
    }
  }

  if (expenses.length === 0) return <p>אין הוצאות להצגה.</p>;

  return (
    <section className="expense-list" style={{ marginBottom: '1rem' }}>
      {expenses.map(expense => (
        <div key={expense.id} style={{ border: '1px solid #ddd', padding: '0.75rem', marginBottom: '0.5rem', borderRadius: '6px', backgroundColor: '#fff' }}>
          <strong>{expense.paidBy}</strong> קנה: {expense.description} – ₪{expense.amount.toFixed(2)}  
          <br />
          <small>{new Date(expense.date).toLocaleDateString('he-IL')}</small>
          {expense.receiptUrl && (
            <div>
              <a href={expense.receiptUrl} target="_blank" rel="noopener noreferrer">📄 קבלה</a>
            </div>
          )}
          {isAdmin && (
            <button style={{ marginTop: '0.5rem', color: 'red', cursor: 'pointer' }} onClick={() => handleDelete(expense.id)}>
              🗑️ מחק
            </button>
          )}
        </div>
      ))}
    </section>
  );
}
