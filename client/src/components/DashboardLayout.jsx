import { Link,Outlet } from "react-router-dom";
import illustration from '../img/illus.jpg'; // Adjust the path as needed
import '../styles/Dashboard.css'; // Assuming you have a CSS file for styling
import { useAuth } from './context/AuthContext'; // Adjust the path as needed
import { useNavigate } from 'react-router-dom';

export default function DashboardLayout() {
  const {logout} = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirect to login page after logout
  };
  return (
    <div className="dashboard-layout">
      <header className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
        <img className="dashboard-img" src={illustration} alt="Dashboard Illustration" />
      </header>
      <nav className="dashboard-nav">
        <ul>
          <li><Link to="/dashboard/overview" >Overview</Link></li>
          <li><Link to="/dashboard/groups" >Groups</Link></li>
          {/* Add more navigation items as needed */}
        </ul>
        <button onClick={handleLogout}>Log Out</button>
      </nav>
      <main className="dashboard-content">
        <Outlet />
      </main>
    </div>
  );
}