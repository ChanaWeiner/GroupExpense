import { useNavigate } from "react-router-dom";

export default function WelcomeSection({ onGroupsClick, onActionsClick }) {
  const navigate = useNavigate();
  return (
    <div className="welcome-section">
      <h1 className="welcome-title">ברוך הבא למערכת לניהול כספים קבוצתיים</h1>
      <p className="welcome-subtitle">
        המערכת שתעזור לך לנהל הוצאות, חובות ותשלומים – בצורה קלה, שקופה וביחד עם כולם.
      </p>
      <div className="welcome-actions">
        <button onClick={()=>{navigate('/group-expense/groups')}} className="main-button">
          מעבר לקבוצות
        </button>
        <button onClick={onActionsClick} className="secondary-button">
          ביצוע פעולה מהירה
        </button>
      </div>
    </div>
  );
}