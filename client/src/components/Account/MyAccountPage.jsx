// MyAccountPage.jsx
import { Outlet, Link } from 'react-router-dom';
import '../../styles/MyAccountPage.css';

export default function MyAccountPage() {
  return (
    <div className="my-account-page">
      <h2>👤 החשבון האישי שלי</h2>

      <nav className="my-account-nav">
        <Link className='link' to="my-debts">📌 החובות שלי</Link>
        <Link className='link' to="owed-to-me">💰 חייבים לי</Link>
        <Link className='link' to="my-expenses">🧾 ההוצאות שלי</Link>
      </nav>

      <div className="my-account-content">
        <Outlet />
      </div>
    </div>
  );
}
