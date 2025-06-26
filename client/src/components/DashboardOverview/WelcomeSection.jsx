export default function WelcomeSection({ onGroupsClick, onActionsClick }) {
  return (
    <div className="welcome-section">
      <h1 className="welcome-title">ברוך הבא למערכת לניהול כספים קבוצתיים</h1>
      <p className="welcome-subtitle">
        המערכת שתעזור לך לנהל הוצאות, חובות ותשלומים – בצורה קלה, שקופה וביחד עם כולם.
      </p>
      <div className="welcome-actions">
        <button onClick={onGroupsClick} className="main-button">
          מעבר לקבוצות
        </button>
        <button onClick={onActionsClick} className="secondary-button">
          ביצוע פעולה מהירה
        </button>
      </div>
    </div>
  );
}