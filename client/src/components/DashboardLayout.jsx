import { Link, Outlet } from "react-router-dom";
import illustration from '../img/illus.jpg';
import '../styles/Dashboard.css';
import { useAuth } from './context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function DashboardLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-layout" dir="rtl">
      <header className="dashboard-header">
        <h1 className="dashboard-title">לוח בקרה</h1>
        <img className="dashboard-img" src={illustration} alt="איור לוח בקרה" />
      </header>

      <nav className="dashboard-nav">
        <ul>
          <li><Link to="/dashboard/overview">סקירה</Link></li>
          <li><Link to="/dashboard/groups">קבוצות</Link></li>
          {/* ניתן להוסיף קישורים נוספים לפי הצורך */}
        </ul>
        <button onClick={handleLogout}>התנתקות</button>
      </nav>

      <main className="dashboard-content">
        <Outlet />
      </main>
    </div>
  );
}
