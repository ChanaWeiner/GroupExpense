// GroupPage.jsx
import { Outlet, Link, useParams } from 'react-router-dom';
import '../../styles/GroupPage.css';

export default function GroupPage() {
  const { groupId } = useParams();

  return (
    <div className="group-page">
      <h2>📂 מסגרת קבוצה #{groupId}</h2>

      <nav className="group-nav">
        <Link to="members">👥 חברים</Link>
        <Link to="frames">💼 מסגרות הוצאות</Link>
        <Link to="summary">📊 חישוב אישי</Link>
      </nav>

      <div className="group-content">
        <Outlet/>
      </div>
    </div>
  );
}