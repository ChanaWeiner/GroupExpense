export default function GroupSummary({ group, isLoading }) {
  if (isLoading) {
    return <p>טוען סיכום קבוצה...</p>;
  }

  if (!group) {
    return <p>אין נתונים זמינים עבור קבוצה זו.</p>;
  }

  return (
    <section className="group-summary" dir="rtl">
      <h3 className="group-title">{group.name}</h3>
      <div className="group-details">
        <p><strong>חברים:</strong> {group.members.join(', ')}</p>
        <p><strong>יתרה כוללת:</strong> {group.totalBalance}₪</p>
        <p><strong>חובות פעילים:</strong> {group.activeDebts.length}</p>
      </div>
    </section>
  );
}
