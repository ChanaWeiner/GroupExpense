export default function Reminders({ reminders, isLoading }) {
  if (isLoading) {
    return <p>טוען תזכורות...</p>;
  }

  if (!reminders || reminders.length === 0) {
    return <p>לא קיימות תזכורות.</p>;
  }

  return (
    <section className="reminders" dir="rtl">
      <h3 className="reminders-title">תזכורות</h3>
      <ul className="reminder-list">
        {reminders.map((reminder, index) => (
          <li key={index} className="reminder-item">
            <span className="reminder-text">{reminder.text}</span>
            <span className="reminder-date">
              {new Date(reminder.date).toLocaleDateString('he-IL')}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
