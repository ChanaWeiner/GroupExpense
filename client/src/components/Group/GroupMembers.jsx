import { useEffect, useState } from 'react';
import sendRequest from '../../services/serverApi';
import { useAuth } from '../context/AuthContext';
import '../../styles/GroupMembersList.css';
import { useParams } from 'react-router-dom';
import getGravatarUrl from '../../services/getProfileImg';

export default function GroupMembers({ }) {
  const [members, setMembers] = useState([]);
  const [error, setError] = useState(null);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { token, user } = useAuth();
  const { groupId } = useParams();
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    loadMembers();
    checkIfAdmin();
  }, [groupId]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (newMemberEmail.trim() && showSuggestions) {
        fetchSuggestions();
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [newMemberEmail, showSuggestions]);



  async function checkIfAdmin() {
    try {
      const response = await sendRequest(`/groups/${groupId}/isAdmin`, 'GET', null, token);
      setIsAdmin(response.isAdmin);
    }
    catch (err) {
      setError(err.message);
    }
  }

  async function loadMembers() {
    try {
      const data = await sendRequest(`/members/group/${groupId}`, 'GET', null, token);
      setMembers(data);
    } catch (err) {
      setError(err.message || "שגיאה בטעינת חברים");
    }
  }

  async function fetchSuggestions() {
    try {
      const data = await sendRequest(`/users/search?query=${encodeURIComponent(newMemberEmail)}`, 'GET', null, token);
      setSearchResults(data);
      setShowSuggestions(true);
    } catch {
      setSearchResults([]);
    }
  }

  async function handleAddMember() {
    if (!newMemberEmail.trim()) return;
    try {
      if (members.some(member => member.user_email === newMemberEmail)) {
        setError("חבר זה כבר קיים בקבוצה");
        return;
      }

      const emailRegex = /^\S+@\S+\.\S+$/;
      if (!emailRegex.test(newMemberEmail.trim())) {
        setError("כתובת דוא\"ל לא תקינה");
        return;
      }

      await sendRequest(`/members/group/${groupId}`, 'POST', { user_email: newMemberEmail}, token);
      setNewMemberEmail('');
      setShowSuggestions(false);
      loadMembers();
    } catch(err) {
      setError(err.message || "שגיאה בהוספת חבר");
    }
  }

  async function handleRemoveMember(memberId) {
    try {
      await sendRequest(`/members/${memberId}/group/${groupId}`, 'DELETE', null, token);
      loadMembers();
    } catch(err) {
      setError(err.message || "שגיאה במחיקת חבר");
    }
  }

  function handleSelectSuggestion(email) {
    setNewMemberEmail(email);
    setShowSuggestions(false);
  }

  return (
    <div className="members-list fadeInAnimation">
      <h3>👥 חברי הקבוצה</h3>
      {error && <p className="error">{error}</p>}

      <div className="add-member">
        <input
          type="email"
          placeholder="להוספה של חבר"
          value={newMemberEmail}
          onChange={e => {
            setNewMemberEmail(e.target.value);
            setShowSuggestions(true);
          }}
        />
        <button onClick={handleAddMember}>הוסף חבר</button>

        {showSuggestions && searchResults.length > 0 && (
          <ul className="suggestions-list">
            {searchResults.map(user => (
              <li
                key={user.id}
                className="suggestion-item"
                onClick={() => handleSelectSuggestion(user.email)}
              >
                <img src={getGravatarUrl(user.email)} alt={user.name} className="suggestion-avatar" />
                <span>{user.name}</span>
                <span style={{ fontSize: '0.85em', color: '#666' }}>{user.email}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {members.map(member => (
        <div key={member.id} className="member-card">
          <img src={getGravatarUrl(member.email)} alt={member.name} className="member-avatar" />

          <span className="member-name">{member.name}</span>
          <span className="member-name">{member.email}</span>
          {member.is_admin && <span className="admin-badge">⭐ מנהל</span>}

          {isAdmin && (
            <button
              className="remove-member-btn"
              onClick={() => handleRemoveMember(member.id)}
              title="מחק חבר"
            >
              ❌
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
