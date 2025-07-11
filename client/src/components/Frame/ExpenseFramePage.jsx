import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import sendRequest from '../../services/serverApi';
import { useAuth } from '../context/AuthContext';
import '../../styles/ExpenseFramePage.css';
import FrameHeader from './FrameHeader';
import ExpenseList from './ExpenseList';
import AddExpenseForm from './AddExpenseForm';
import FrameSummary from './FrameSummary';
import ShoppingList from './ShoppingList';

export default function ExpenseFramePage() {
  const { groupId, frameId } = useParams();
  const { token } = useAuth();
  const [frame, setFrame] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState(null);
  const [showAddExpense, setShowAddExpense] = useState(false); // חדש

  useEffect(() => {

    fetchData();
  }, [groupId, frameId, token]);

  async function fetchData() {
    const scrollY = window.scrollY; // שמור את המיקום הנוכחי

    setIsLoading(true);
    try {
      const [frameData, expensesData, adminStatus] = await Promise.all([
        sendRequest(`frames/${frameId}`, 'GET', null, token),
        sendRequest(`expenses/frame/${frameId}`, 'GET', null, token),
        sendRequest(`groups/${groupId}/isAdmin`, 'GET', null, token),
      ]);
      setFrame(frameData);
      setExpenses(expensesData);
      setIsAdmin(adminStatus.isAdmin);
      setError(null);
      setShowAddExpense(false);
    } catch (err) {
      setError('שגיאה בטעינת נתוני מסגרת ההוצאות');
    } finally {
      setIsLoading(false);
      window.scrollTo({ top: scrollY, behavior: 'auto' });
    }
  }

  const handleAddExpense = (newExpense) => {
    setExpenses(prev => [...prev, newExpense]);
    fetchData();
  };

  const totalAmount = expenses.reduce((sum, e) => sum + Number(e.total_amount || 0), 0);

  if (isLoading) return <p>טוען את מסגרת ההוצאה...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!frame) return <p>מסגרת לא נמצאה.</p>;

  return (
    <div className="expense-frame-page">
      <FrameHeader frame={frame} total={totalAmount} />
      <FrameSummary total={totalAmount} expenses={expenses} />
      {/* <ExpenseList expenses={expenses} isAdmin={isAdmin} frameId={frameId} onDeleteExpense={id => setExpenses(prev => prev.filter(e => e.id !== id))} /> */}
      <button
        className="add-btn"
        style={{ marginBottom: '1.5rem' }}
        onClick={() => setShowAddExpense(s => !s)}
      >
        {showAddExpense ? 'סגור טופס הוספה' : 'הוסף הוצאה חדשה'}
      </button>
      {showAddExpense && (
        <AddExpenseForm frameId={frameId} onAdd={handleAddExpense} />
      )}      <ShoppingList frameId={frameId} isAdmin={isAdmin} />
    </div>
  );
}
