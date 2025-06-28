import { useEffect, useState } from "react";
import sendRequest from "../../services/serverApi";
import { useAuth } from "../context/AuthContext";
import "../../styles/MyExpensesPage.css";

const PAGE_SIZE = 8;

export default function MyExpensesPage() {
  const { token } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchExpenses();
    // eslint-disable-next-line
  }, [page]);

  async function fetchExpenses() {
    setIsLoading(true);
    setError(null);
    try {
      const res = await sendRequest(
        `expenses/my?page=${page}&pageSize=${PAGE_SIZE}`,
        "GET",
        null,
        token
      );
      setExpenses(res.expenses || []);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      setError("שגיאה בטעינת ההוצאות");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="my-expenses-page">
      <h2>🧾 ההוצאות שלי</h2>
      {isLoading && <div className="loading">טוען...</div>}
      {error && <div className="error">{error}</div>}
      {!isLoading && expenses.length === 0 && <div className="empty">לא נמצאו הוצאות</div>}
      <ul className="expenses-list">
        {expenses.map((exp) => (
          <li key={exp.id} className="expense-card">
            <div className="expense-title">{exp.description}</div>
            <div className="expense-details">
              <span>סכום: <b>{exp.total_amount} ₪</b></span>
              <span>תאריך: {new Date(exp.date).toLocaleDateString()}</span>
            </div>
          </li>
        ))}
      </ul>
      <div className="paging">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
        >
          הקודם
        </button>
        <span>
          עמוד {page} מתוך {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          הבא
        </button>
      </div>
    </div>
  );
}