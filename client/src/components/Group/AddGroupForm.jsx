import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import sendRequest from '../../services/serverApi';
import '../../styles/AddGroupForm.css'
export default function AddGroupForm({ onGroupCreated, onClose }) {
  const { token } = useAuth();
  const [groupName, setGroupName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!groupName.trim()) {
      setError("יש להזין שם קבוצה");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await sendRequest('groups', 'POST', {
        name: groupName,
      }, token);
      setGroupName('');
      setError(null);
      onGroupCreated?.(response.group);
    } catch (err) {
      setError("שגיאה ביצירת קבוצה");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-group-form">
      <h2>🎯 יצירת קבוצה חדשה</h2>

      <label className="label">שם קבוצה:</label>
      <input
        type="text"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
        required
        placeholder="למשל: ועד כיתה"
        className="input"
      />

      {error && <p className="error">{error}</p>}

      <button type="submit" disabled={isSubmitting} className="submit-button">
        {isSubmitting ? "יוצר..." : "צור קבוצה"}
      </button>

      <button
        type="button"
        onClick={onClose}
        className="cancel-button"
        style={{ marginLeft: '1rem' }}
      >
        ביטול
      </button>
    </form>
  );

}
