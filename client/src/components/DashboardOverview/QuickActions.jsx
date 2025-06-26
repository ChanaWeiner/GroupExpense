import { useNavigate } from 'react-router-dom';
import '../../styles/QuickActions.css';

export default function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    { label: 'הוסף הוצאה', path: '/group-expense/groups', color: 'var(--color-primary)' },
    { label: 'צור קבוצה', path: '/group-expense/groups', color: 'var(--color-accent)' },
    { label: 'שלח תשלום', path: '/group-expense/my-account/my-debts', color: 'var(--color-success)' }
  ];

  return (
    <section className="quick-actions" dir="rtl">
      <h2>פעולות מהירות</h2>
      <div className="actions-grid">
        {actions.map((action, i) => (
          <button
            key={i}
            onClick={() => navigate(action.path)}
            style={{ backgroundColor: action.color }}
            className="action-button"
          >
            {action.label}
          </button>
        ))}
      </div>
    </section>
  );
}
