import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import sendRequest from "../../services/serverApi";
import '../../styles/EditProfileForm.css';
export default function EditProfileForm({ user, onUpdate }) {
  const { token } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [paypalEmail, setPaypalEmail] = useState(user?.paypal_email || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!name.trim()) {
      setError("יש להזין שם");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await sendRequest(
        "users",
        "PUT",
        { name, paypal_email: paypalEmail },
        token
      );
      setSuccess("הפרטים עודכנו בהצלחה");
      onUpdate?.(res.user);
    } catch (err) {
      setError(err.message || "שגיאה בעדכון הפרטים");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="edit-profile-form" onSubmit={handleSubmit}>
      <h2>עריכת פרטי משתמש</h2>
      <label>שם:</label>
      <input
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        required
        disabled={isSubmitting}
      />

      <label>PayPal Email:</label>
      <input
        type="email"
        value={paypalEmail}
        onChange={e => setPaypalEmail(e.target.value)}
        placeholder="אופציונלי"
        disabled={isSubmitting}
      />

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "שומר..." : "שמירה"}
      </button>
    </form>
  );
}