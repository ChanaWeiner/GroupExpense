import { useNavigate } from 'react-router-dom';
import '../../styles/QuickActions.css'; // Assuming you have a CSS file for styling
export default function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    { label: 'Add Expense', path: '/expenses/new', color: '#1376D0' },
    { label: 'Create Group', path: '/groups/new', color: '#FED52F' },
    { label: 'Join Group', path: '/groups/join', color: '#FF5D32' },
    { label: 'Send Payment', path: '/payments/new', color: '#616161' }
  ];

  return (
    <section className="quick-actions">
      <h3>Quick Actions</h3>
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
