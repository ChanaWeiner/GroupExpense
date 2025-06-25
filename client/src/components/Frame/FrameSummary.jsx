import React from 'react';

export default function FrameSummary({ total, expenses }) {
  const participants = new Set(expenses.map(e => e.paidBy)).size;
  const shoppingItemsCount = expenses.reduce((count, e) => count + (e.shoppingItems?.length || 0), 0);

  return (
    <section className="frame-summary" style={{ backgroundColor: '#f0f8ff', padding: '1rem', marginBottom: '1rem', borderRadius: '8px' }}>
      <div>₪ {total.toFixed(2)} הוצאות כוללות</div>
      <div>{participants} משתתפים</div>
      <div>{shoppingItemsCount} פריטים שנרכשו</div>
    </section>
  );
}
