import React from 'react';

export default function FrameSummary({ total, expenses }) {
  const participants = new Set(expenses.map(e => e.paidBy)).size;
  const shoppingItemsCount = expenses.reduce((count, e) => count + (e.items_count || 0), 0);

  return (
    <section className="frame-summary">
      <div>₪ {total.toFixed(2)} הוצאות כוללות</div>
      <div>{participants} משתתפים</div>
      <div>{shoppingItemsCount} פריטים שנרכשו</div>
    </section>
  );
}
