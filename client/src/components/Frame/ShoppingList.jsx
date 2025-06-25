import React, { useEffect, useState } from 'react';
import sendRequest from '../../services/serverApi';

export default function ShoppingList({ frameId, isAdmin, token }) {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchItems() {
      try {
        const data = await sendRequest(`frames/${frameId}/shopping-list`, 'GET', null, token);
        setItems(data);
      } catch (err) {
        console.error(err);
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
        `frames/${frameId}/shopping-list`,
        'POST',
        { name: newItem },
        token
      );
      setItems(prev => [...prev, addedItem]);
      setNewItem('');
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleMarkBought(id) {
    try {
      await sendRequest(`frames/${frameId}/shopping-list/${id}/bought`, 'POST', null, token);
      setItems(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      alert(err.message);
    }
  }

  if (loading) return <p>טוען רשימת קניות...</p>;
  if (items.length === 0) return <p>אין פריטים ברשימת הקניות.</p>;

  return (
    <section className="shopping-list" style={{ padding: '1rem', borderTop: '1px solid #ccc' }}>
      <h3>רשימת קניות</h3>
      <ul>
        {items.map(item => (
          <li key={item.id} style={{ marginBottom: '0.5rem' }}>
            <label>
              <input
                type="checkbox"
                onChange={() => handleMarkBought(item.id)}
              />
              {item.name}
            </label>
          </li>
        ))}
      </ul>
      {isAdmin && (
        <div style={{ marginTop: '1rem' }}>
          <input
            type="text"
            placeholder="הוסף פריט חדש"
            value={newItem}
            onChange={e => setNewItem(e.target.value)}
          />
          <button onClick={handleAddItem}>הוסף</button>
        </div>
      )}
    </section>
  );
}
