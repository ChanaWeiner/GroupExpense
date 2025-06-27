import { useEffect, useState } from 'react';
import sendRequest from '../../services/serverApi';
import { useAuth } from '../context/AuthContext';
import '../../styles/OwedToMePage.css';
const PAGE_SIZE = 10;

export default function OwedToMePage() {
  const { token } = useAuth();
  const [debts, setDebts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, 7days, 14days
  const [error, setError] = useState(null);
  useEffect(() => {
    async function fetchDebts() {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page,
          pageSize: PAGE_SIZE,
          filter
        });
        const data = await sendRequest(`debts/owed-to-me?${params.toString()}`, 'GET', null, token);
        setDebts(data.debts);
        setTotalPages(data.totalPages);
      } catch (err) {
        setError(err.message);
        setDebts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchDebts();
  }, [page, filter, token]);

  // קיבוץ לפי מזהה הוצאה
  const grouped = debts.reduce((acc, debt) => {
    acc[debt.expense_id] = acc[debt.expense_id] || { expense: debt.expense, people: [] };
    acc[debt.expense_id].people.push(debt);
    return acc;
  }, {});

  return (
    <div className="owed-to-me-page" >
      <h2>💰 חייבים לי</h2>
      {error && <p >{error}</p>}
      <div style={{ margin: '1em 0' }}>
        <button onClick={() => setFilter('all')} className={filter === 'all' ? 'active' : ''}>הכל</button>
        <button onClick={() => setFilter('7days')} className={filter === '7days' ? 'active' : ''}>7 ימים אחרונים</button>
        <button onClick={() => setFilter('14days')} className={filter === '14days' ? 'active' : ''}>14 ימים אחרונים</button>
      </div>
      {loading ? <p>טוען...</p> : (
        debts.length === 0 ? <p>אין חובות להצגה.</p> :
        Object.entries(grouped).map(([expenseId, { expense, people }]) => (
          <div key={expenseId} className="debt-expense-group">
            <h4>הוצאה: {expense?.description || expenseId}</h4>
            <ul>
              {people.map(d => (
                <li key={d.id}>
                  {d.debtor_name} חייב/ת לך <b>{d.amount} ₪</b>
                  {/* אפשר להוסיף תאריך, סטטוס וכו' */}
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
      <div style={{ marginTop: '1em' }}>
        <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>הקודם</button>
        <span style={{ margin: '0 1em' }}>{page} / {totalPages}</span>
        <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>הבא</button>
      </div>
    </div>
  );
}