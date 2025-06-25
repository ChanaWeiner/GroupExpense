import React, { useEffect, useState } from 'react';
import sendRequest from '../../services/serverApi';
import { useAuth } from '../context/AuthContext';
import '../../styles/ShoppingList.css';
export default function ShoppingList({ frameId, isAdmin }) {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [newItem, setNewItem] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({ name: '', note: '' });
  const [expandedItemId, setExpandedItemId] = useState(null);

  useEffect(() => {
    async function fetchItems() {
      try {
        const data = await sendRequest(`shopping-items/frame/${frameId}`, 'GET', null, token);
        setItems(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchItems();
  }, [frameId, token]);


  async function handleAddItem() {
    if (!newItem.trim()) return;
    try {
      const addedItem = await sendRequest(
        `shopping-items/frame/${frameId}`,
        'POST',
        { name: newItem, note: newNote },
        token
      );
      setItems(prev => [...prev, addedItem]);
      setNewItem('');
      setNewNote('');
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDeleteItem(id) {
    try {
      await sendRequest(`shopping-items/${id}`, 'DELETE', null, token);
      setItems(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleUpdateItem(id) {
    try {
      await sendRequest(`shopping-items/${id}`, 'PUT', editValues, token);
      setItems(prev =>
        prev.map(item => (item.id === id ? { ...item, ...editValues } : item))
      );
      setEditingId(null);
      setEditValues({ name: '', note: '' });
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleTogglePurchased(itemId) {
    try {
      const updated = await sendRequest(
        `frames/${frameId}/shopping-items/${itemId}/toggle`,
        'PUT',
        null,
        token
      );
      setItems(prev => prev.map(item => item.id === itemId ? updated : item));
    } catch (err) {
      setError(err.message);
    }
  }

  function toggleExpanded(itemId) {
    setExpandedItemId(prev => (prev === itemId ? null : itemId));
  }

  if (loading) return <p>טוען רשימת קניות...</p>;

  return (
    <section className="shopping-list" style={{ padding: '1rem', borderTop: '1px solid #ccc' }}>
      <h3>רשימת קניות</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {items.map(item => (
          // בתוך המפה של items.map(item => ...)
          <li key={item.id} style={{ marginBottom: '0.5rem' }}>
            {editingId === item.id ? (
              <form style={{ marginRight: '1rem' }}>
                <input
                  value={editValues.name}
                  onChange={e => setEditValues({ ...editValues, name: e.target.value })}
                />
                <textarea
                  value={editValues.note}
                  onChange={e => setEditValues({ ...editValues, note: e.target.value })}
                  placeholder="הערה"
                />
                <button onClick={() => handleUpdateItem(item.id)}>שמור</button>
                <button onClick={() => setEditingId(null)}>בטל</button>
              </form>
            ) : (
              <div className="item-card">
                <label className="checkbox-label">
                  <input type="checkbox" checked={item.is_purchased} readOnly />
                  {item.name}
                </label>
                {item.note && <p style={{ fontStyle: 'italic' }}>הערה: {item.note}</p>}

                {item.is_purchased && (
                  <>
                    <button onClick={() => toggleExpanded(item.id)} style={{ marginTop: '0.25rem' }}>
                      {expandedItemId === item.id ? 'הסתר פרטי קנייה' : 'הצג פרטי קנייה'}
                    </button>
                    {expandedItemId === item.id && (
                      <div className="purchase-details" style={{ marginTop: '0.5rem', padding: '0.5rem', background: '#f1f1f1', borderRadius: '0.5rem' }}>
                        <p><strong>תאריך:</strong> {item.purchase_date}</p>
                        <p><strong>סכום שנקנה:</strong> {item.purchased_amount} ₪</p>
                        {item.expense_description && <p><strong>תיאור ההוצאה:</strong> {item.expense_description}</p>}
                        {item.receipt_url && (
                          <img width="400" src={`http://localhost:3000/${item.receipt_url}`} alt="קבלה" />

                        )}
                      </div>
                    )}
                  </>
                )}

                {!item.is_purchased && (
                  <div className="item-actions">
                    <button onClick={() => {
                      setEditingId(item.id);
                      setEditValues({ name: item.name, note: item.note || '' });
                    }}>
                      ערוך
                    </button>
                    <button onClick={() => handleDeleteItem(item.id)}>מחק</button>
                  </div>
                )}
              </div>
            )}
          </li>

        ))}
      </ul>

      <form style={{ marginTop: '1rem' }}>
        <input
          type="text"
          placeholder="הוסף פריט חדש"
          value={newItem}
          onChange={e => setNewItem(e.target.value)}
          style={{ marginBottom: '0.5rem', display: 'block' }}
        />
        <textarea
          placeholder="הוסף הערה לפריט (אופציונלי)"
          value={newNote}
          onChange={e => setNewNote(e.target.value)}
          rows={3}
          style={{ width: '100%', marginBottom: '0.5rem' }}
        />
        <button onClick={handleAddItem}>הוסף</button>
      </form>

    </section>
  );
}
