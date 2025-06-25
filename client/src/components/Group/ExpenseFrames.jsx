import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import sendRequest from '../../services/serverApi';
import { useAuth } from '../context/AuthContext';

export default function ExpenseFrames() {
  const { groupId } = useParams();
  const { user, token } = useAuth();
  const [frames, setFrames] = useState([]);
  const [newFrame, setNewFrame] = useState({ name: '', description: '' });
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetchFrames();
    checkIfAdmin();
  }, [groupId]);

  async function fetchFrames() {
    const data = await sendRequest(`frames/groups/${groupId}`, 'GET', null, token);
    setFrames(data);
  }

  async function checkIfAdmin() {
    try {
      const response = await sendRequest(`/groups/${groupId}/isAdmin`, 'GET', null, token);
      setIsAdmin(response.isAdmin);
    }
    catch {

    }
  }

  async function handleAddFrame(e) {
    e.preventDefault();
    try {
      await sendRequest(`/frames/groups/${groupId}`, 'POST', newFrame, token);
      setNewFrame({ name: '', description: '' });
      setShowForm(false);
      fetchFrames();
    } catch {
      alert('שגיאה בהוספת מסגרת');
    }
  }

  async function handleDeleteFrame(frameId) {
    if (!window.confirm('האם למחוק את המסגרת?')) return;
    try {
      await sendRequest(`/expenseFrames/${frameId}`, 'DELETE', null, token);
      fetchFrames();
    } catch {
      alert('שגיאה במחיקה');
    }
  }

  const filteredFrames = frames.filter(f => f.name.includes(searchTerm));

  return (
    <div>
      <h3>💼 מסגרות הוצאות</h3>

      <input
        type="text"
        placeholder="חיפוש מסגרת..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />

      {isAdmin && (
        <>
          <button onClick={() => setShowForm(prev => !prev)}>
            {showForm ? 'ביטול' : '➕ הוסף מסגרת'}
          </button>

          {showForm && (
            <form onSubmit={handleAddFrame} style={{ marginTop: '1em' }}>
              <input
                type="text"
                placeholder="שם המסגרת"
                value={newFrame.name}
                onChange={e => setNewFrame({ ...newFrame, name: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="תיאור"
                value={newFrame.description}
                onChange={e => setNewFrame({ ...newFrame, description: e.target.value })}
              />
              <button type="submit">שמור</button>
            </form>
          )}
        </>
      )}

      <ul>
        {filteredFrames.map(frame => (
          <li key={frame.id}>
            <Link to={`${frame.id}`}>{frame.name} – ₪{frame.total}</Link>
            {isAdmin && (
              <button onClick={() => handleDeleteFrame(frame.id)} style={{ marginInlineStart: '1em' }}>
                ❌
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
