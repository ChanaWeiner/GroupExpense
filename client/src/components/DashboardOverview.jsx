export default function DashboardOverview() {
  return (
    <div className="dashboard-overview">
      <h2>Dashboard Overview</h2>
      <p>Welcome to your dashboard! Here you can manage your account, view statistics, and access various features.</p>
      {/* Add more content as needed */}
      <section className="stats">
        <h3>Your Statistics</h3>
        <ul>
          <li>Total Groups: 5</li>
          <li>Active Members: 120</li>
          <li>Pending Requests: 3</li>
        </ul>
      </section>
    </div>
  );
}