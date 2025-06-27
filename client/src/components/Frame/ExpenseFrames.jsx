import { useParams,useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import sendRequest from '../../services/serverApi';
import { useAuth } from '../context/AuthContext';
import '../../styles/ExpenseFrames.css';
export default function ExpenseFrames() {
  const { groupId } = useParams();
  const {  token } = useAuth();
  const [frames, setFrames] = useState([]);
  const [newFrame, setNewFrame] = useState({ name: '', description: '',end_date: '' });
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
    catch (err) {
      setError(err.message);
    }
  }

  async function handleAddFrame(e) {
    e.preventDefault();
    try {
      if (new Date(newFrame.end_date) < new Date()) {
        setError('יש להכניס תאריך שטרם היה בעבר');
        return;
      }
      await sendRequest(`/frames/groups/${groupId}`, 'POST', newFrame, token);
      setNewFrame({ name: '', description: '' });
      setShowForm(false);
      fetchFrames();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDeleteFrame(frameId) {
    try {
      await sendRequest(`/frames/${frameId}/group/${groupId}`, 'DELETE', null, token);
      fetchFrames();
    } catch (err) {
      setError(err.message);
    }
  }

  const filteredFrames = frames.filter(f => f.name.includes(searchTerm));

  return (
    <div className="container fadeInAnimation">
      <h3>💼 מסגרות הוצאות</h3>

      <input
        type="text"
        placeholder="חיפוש מסגרת..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        className="search-input"
      />

      {isAdmin && (
        <>
          <button className='button-primary add-btn' onClick={() => setShowForm(prev => !prev)} >
            {showForm ? 'ביטול' : '+ הוסף מסגרת'}
          </button>
          {error && <p className="error">{error}</p>}
          {showForm && (
            <form onSubmit={handleAddFrame} style={{ marginTop: '1em' }}>
              <div className="form-group">
                <label>שם המסגרת</label>
                <input
                  type="text"
                  placeholder="שם המסגרת"
                  value={newFrame.name}
                  onChange={e => setNewFrame({ ...newFrame, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>תיאור</label>
                <input
                  type="text"
                  placeholder="תיאור"
                  value={newFrame.description}
                  onChange={e => setNewFrame({ ...newFrame, description: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>תאריך סיום</label>
                <input
                  type="date"
                  placeholder="תאריך סיום"
                  value={newFrame.end_date || ''}
                  onChange={e => setNewFrame({ ...newFrame, end_date: e.target.value })}
                />
              </div>

              <button type="submit" className="button-primary">שמור</button>
              {error && <p className="error">{error}</p>}
            </form>
          )}
        </>
      )}

      <ul className="frames-list">
        {filteredFrames.map(frame => (
          <li key={frame.id} className="frame-card" onClick={() => navigate(`${frame.id}`)}>
            <span className="frame-name">{frame.name}</span>

            <span className="arrow-icon">›</span>

            {isAdmin && (
              <div className="frame-actions" onClick={e => e.stopPropagation()}>
                <button onClick={() => handleDeleteFrame(frame.id)} title="מחק מסגרת">
                  ❌
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>


  );
}
