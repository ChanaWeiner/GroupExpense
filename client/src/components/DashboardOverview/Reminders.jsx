export default function Reminders({ reminders, isLoading }) {
  if (isLoading) {
    return <p>Loading reminders...</p>;
  }

  if (!reminders || reminders.length === 0) {
    return <p>No reminders set.</p>;
  }

  return (
    <section className="reminders">
      <h3 className="reminders-title">Reminders</h3>
      <ul className="reminder-list">
        {reminders.map((reminder, index) => (
          <li key={index} className="reminder-item">
            <span className="reminder-text">{reminder.text}</span>
            <span className="reminder-date">{new Date(reminder.date).toLocaleDateString()}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}