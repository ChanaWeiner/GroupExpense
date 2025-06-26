export default function Reminders({ reminders, isLoading }) {
  if (isLoading) {
    return <p>טוען תזכורות...</p>;
  }

  if (!reminders || (!reminders.overdueMessages?.length && !reminders.recentPaymentsForUser?.length)) {
    return <p>לא קיימות תזכורות.</p>;
  }

  return (
    <section className="reminders" dir="rtl">
      <h3 className="reminders-title">תזכורות</h3>
      <ul className="reminder-list">
        {/* תזכורות תשלום */}
        {reminders.overdueMessages && reminders.overdueMessages.map((msg, idx) => (
          <li key={`overdue-${idx}`} className="reminder-item reminder-overdue">
            <span className="reminder-text">{msg}</span>
            {/* אפשר להוסיף כאן אייקון או עיצוב ייחודי */}
          </li>
        ))}
        {/* הודעות על תשלומים שהתקבלו */}
        {reminders.recentPaymentsForUser && reminders.recentPaymentsForUser.map((msg, idx) => (
          <li key={`payment-${idx}`} className="reminder-item reminder-payment">
            <span className="reminder-text">{msg}</span>
            {/* אפשר להוסיף כאן אייקון או עיצוב ייחודי */}
          </li>
        ))}
      </ul>
    </section>
  );
}