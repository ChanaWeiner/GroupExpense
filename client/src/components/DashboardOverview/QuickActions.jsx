import { useNavigate } from 'react-router-dom';
import '../../styles/QuickActions.css';

export default function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    { label: 'הוסף הוצאה', path: 'expenses/new', color: '#1376D0' },
    { label: 'צור קבוצה', path: 'groups/new', color: '#FED52F' },
    { label: 'הצטרף לקבוצה', path: 'groups/join', color: '#FF5D32' },
    { label: 'שלח תשלום', path: 'payments/new', color: '#616161' }
  ];

  return (
    <section className="quick-actions" dir="rtl">
      <h3>פעולות מהירות</h3>
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
