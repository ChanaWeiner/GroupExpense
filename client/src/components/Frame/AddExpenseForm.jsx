import React, { useState } from 'react';
import sendRequest from '../../services/serverApi';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';
import '../../styles/AddExpenseForm.css';
import { useParams } from 'react-router-dom';

export default function AddExpenseForm({ frameId, onAdd }) {
  const {groupId} = useParams();
  const { token } = useAuth();
  const [description, setDescription] = useState('');
  const [receiptFile, setReceiptFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState([]);
  const [user, setUser] = useState({});

  const [shoppingItems, setShoppingItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});
  const [receiptPreview, setReceiptPreview] = useState(null);

  function handleReceiptFileChange(e) {
    const file = e.target.files[0];
    setReceiptFile(file);
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setReceiptPreview(url);
    } else {
      setReceiptPreview(null);
    }
  }

  // בתוך ה- JSX של הטופס


  useEffect(() => {
    fetchUser();
    fetchShoppingItems();
  }, [token]);

  async function fetchUser() {
    try {
      const response = await sendRequest(`users/me`, 'GET', null, token);
      setUser(response);
    } catch (err) {
      setError(err);
    }
  }

  async function fetchShoppingItems() {
    try {
      const items = await sendRequest(`shopping-items/frame/${frameId}?filter=unpurchased`, 'GET', null, token);
      setShoppingItems(items);
    } catch (err) {
      setError('שגיאה בטעינת פריטים');
    }
  }

  function handleItemSelect(itemId, isChecked) {
    setSelectedItems(prev => {
      const updated = { ...prev };
      if (isChecked) updated[itemId] = '';
      else delete updated[itemId];
      return updated;
    });
  }

  function handleItemAmountChange(itemId, amount) {
    setSelectedItems(prev => ({
      ...prev,
      [itemId]: amount
    }));
  }

  const totalAmount = Object.values(selectedItems).reduce((sum, val) => sum + (parseFloat(val) || 0), 0);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!description || totalAmount === 0) {
      setError('אנא מלאי תיאור ובחרי פריטים עם סכומים');
      return;
    }
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('description', description);
      formData.append('total_amount', totalAmount);
      if (receiptFile) formData.append('receipt', receiptFile);
      formData.append('items', JSON.stringify(
        Object.entries(selectedItems).map(([id, amount]) => ({ id, amount }))
      ));
      const newExpense = await sendRequest(
        `expenses/group/${groupId}/frame/${frameId}`,
        'POST',
        formData,
        token,
        true
      );

      onAdd(newExpense);
      setDescription('');
      setReceiptFile(null);
      setSelectedItems({});
      setReceiptPreview(false);
      fetchShoppingItems();
    } catch (err) {
      setError('שגיאה בהוספת הוצאה');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="add-expense-form" onSubmit={handleSubmit}>
      <h3 className="add-expense-form__title">הוספת הוצאה חדשה</h3>

      <div className="form-group">
        <label className="form-label">תיאור:</label>
        <input
          type="text"
          className="form-input"
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
        />
      </div>

      <div className="shopping-items-container">
        <h4 className="shopping-items-title">בחרי פריטים מהרשימה:</h4>
        <table className="shopping-items-table">
          <thead>
            <tr>
              <th>בחרי</th>
              <th>שם</th>
              <th>הערה</th>
              <th>סכום</th>
            </tr>
          </thead>
          <tbody>
            {shoppingItems.map(item => (
              <tr key={item.id}>
                <td>
                  <input
                    type="checkbox"
                    className="shopping-item-checkbox"
                    checked={item.id in selectedItems}
                    onChange={e => handleItemSelect(item.id, e.target.checked)}
                  />
                </td>
                <td className="shopping-item-name">{item.name}</td>
                <td className="shopping-item-note">{item.note}</td>
                <td>
                  {item.id in selectedItems && (
                    <input
                      type="number"
                      className="shopping-item-amount"
                      min="0"
                      step="0.01"
                      value={selectedItems[item.id]}
                      onChange={e => handleItemAmountChange(item.id, e.target.value)}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="total-amount">
        <strong>סכום כולל:</strong> {totalAmount.toFixed(2)} ₪
      </div>
      <div className="form-group">
        <label className="form-label">קובץ קבלה (אופציונלי):</label>
        <input
          type="file"
          accept="image/*,application/pdf"
          onChange={handleReceiptFileChange}
          className="form-input"
        />
      </div>

      {receiptPreview && (
        <div className="receipt-preview-container">
          <img src={receiptPreview} alt="תצוגת קבלה" className="receipt-preview-image" />
        </div>
      )}
      {error && <p className="form-error">{error}</p>}

      <button className="submit-button" type="submit" disabled={isSubmitting}>
        שמור הוצאה
      </button>
    </form>
  );
}
