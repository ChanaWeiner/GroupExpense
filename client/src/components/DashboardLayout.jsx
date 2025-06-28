import { Link, Outlet, useNavigate } from "react-router-dom";
import illustration from '../img/illus.jpg';
import '../styles/Dashboard.css';
import { useState } from 'react';
import { useAuth } from './context/AuthContext';
import EditProfileForm from "./DashboardOverview/EditProfileForm"; // ודאי שהנתיב נכון

export default function DashboardLayout() {
  const { logout, user, setUser } = useAuth();
  const navigate = useNavigate();
  const [showProfileModal, setShowProfileModal] = useState(false);


  const handleLogout = () => {
    navigate('/login');
    logout();
  };


  const handleProfileClick = () => {
    setShowProfileModal(true);
  };


  const handleCloseModal = () => {
    setShowProfileModal(false);
  };

  // הכנת אות ראשונה לשם המשתמש אם אין תמונה
  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : '';

  return (
    <div className="dashboard-layout" dir="rtl">
      <header className="dashboard-header">
        <img className="dashboard-img prominent" src={illustration} alt="איור לוח בקרה" />
      </header>

      <nav className="dashboard-nav">
        <ul>
          <li><Link to="overview">סקירה</Link></li>
          <li><Link to="groups">קבוצות</Link></li>
          <li><Link to="my-account">החשבון שלי</Link></li>
          {/* ניתן להוסיף קישורים נוספים לפי הצורך */}
        </ul>

        <div className="user-section">
          <div className="user-profile" onClick={handleProfileClick} title="פרטי משתמש">
            <div className="user-avatar">{userInitial}</div>
            <span>{user?.name || 'משתמש'}</span>
          </div>

          <button className="logout-button" onClick={handleLogout}>התנתקות</button>
        </div>
      </nav>

      {showProfileModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={handleCloseModal}>✖</button>
            <EditProfileForm user={user} onUpdate={setUser} />
          </div>
        </div>
      )}

      <main className="dashboard-content">
        <Outlet />
      </main>
    </div>
  );
}
