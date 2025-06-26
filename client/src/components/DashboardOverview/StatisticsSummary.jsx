import React from 'react';
import '../../styles/StatisticsSummary.css';
export default function StatisticsSummary({ statistics, isLoading }) {
  if (isLoading) {
    return <div className="statistics-summary">טוען נתונים...</div>;
  }

  return (
    <div className="statistics-summary">
      <h3>סטטיסטיקות כלליות</h3>
      <ul>
        <li>
          <span>קבוצות פעילות:</span>
          <b>{statistics.numGroups}</b>
        </li>
        <li>
          <span>חובות פתוחים:</span>
          <b>{statistics.numDebts}</b>
        </li>
        <li>
          <span>הוצאות החודש:</span>
          <b>{Number(statistics.monthlyExpensesSum).toLocaleString()} ₪</b>
        </li>
      </ul>
    </div>
  );
}