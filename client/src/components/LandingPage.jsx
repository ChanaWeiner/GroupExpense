import { useNavigate } from 'react-router-dom';
import '../styles/LandingPage.css';
import illus from '../img/illus.jpg';
export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <div className="landing-content">
        <h1 className="landing-title">ניהול כספים קבוצתי</h1>
        <p className="landing-description">
          מערכת קלה ויעילה לניהול הוצאות, תשלומים, קבוצות וחלוקת חובות בין חברים.
        </p>
        <img
          src={illus}
          alt="איור של ניהול הוצאות"
          className="landing-image"
        />
        <button className="landing-button" onClick={() => navigate('/login')}>
          התחברות למערכת
        </button>
      </div>
    </div>
  );
}
