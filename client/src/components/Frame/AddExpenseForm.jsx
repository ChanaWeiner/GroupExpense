import React, { useState } from 'react';
import sendRequest from '../../services/serverApi';

export default function AddExpenseForm({ frameId, onAdd, token }) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [receiptFile, setReceiptFile] = useState(null);
const [isSubmitting, setIsSubmitting] = useState(false);
   // אני רוצה שיהיה בדף תצוגה של שגיאות שהתרחשו
   const [errors, setErrors] = useState([]);
  async function handleSubmit(e) {
    e.preventDefault();
    if (!description || !amount) {
      alert('אנא מלאי תיאור וסכום');
      return;
    }
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('description', description);
      formData.append('amount', amount);
      if (receiptFile) formData.append('receipt', receiptFile);

      const newExpense = await sendRequest(
        `frames/${frameId}/expenses`,
        'POST',
        formData,
        token,
        true // flag שמסמן שהגוף הוא FormData (אפשר לשפר בsendRequest)
      );

      onAdd(newExpense);
      setDescription('');
      setAmount('');
      setReceiptFile(null);
    } catch (err) {
      alert('שגיאה בהוספת הוצאה');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h3>הוספת הוצאה חדשה</h3>
      <div>
        <label>תיאור: </label>
        <input type="text" value={description} onChange={e => setDescription(e.target.value)} required />
      </div>
      <div>
        <label>סכום: </label>
        <input type="number" value={amount} onChange={e => setAmount(e.target.value)} required min="0" step="0.01" />
      </div>
      <div>
        <label>קובץ קבלה (אופציונלי): </label>
        <input type="file" onChange={e => setReceiptFile(e.target.files[0])} accept="image/*,application/pdf" />
      </div>
      <button type="submit" disabled={isSubmitting}>שמור הוצאה</button>
    </form>
  );
}
