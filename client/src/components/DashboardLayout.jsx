import { Link,Outlet } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <div className="dashboard-layout">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
      </header>
      <nav className="dashboard-nav">
        <ul>
          <li><Link to="/dashboard/overview" >Overview</Link></li>
          <li><Link to="/dashboard/groups" >Groups</Link></li>
          {/* Add more navigation items as needed */}
        </ul>
      </nav>
      <main className="dashboard-content">
        <Outlet />
      </main>
    </div>
  );
}