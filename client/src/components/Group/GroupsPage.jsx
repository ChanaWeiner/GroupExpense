import { useNavigate } from 'react-router-dom';
import sendRequest from '../../services/serverApi';
import { useAuth } from '../context/AuthContext';
import AddGroupForm from './AddGroupForm';
import { useState, useEffect } from 'react';
import '../../styles/GroupsPage.css';
import add from '../../img/add.png';

export default function GroupsPage() {
  const [groups, setGroups] = useState([]);
  const { token, user } = useAuth();
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const navigateToPageGroup = useNavigate();
  const [editingGroupId, setEditingGroupId] = useState(null);
  const [newGroupName, setNewGroupName] = useState('');

  useEffect(() => {
    loadGroups();
  }, []);

  async function loadGroups() {
    try {
      const groups = await sendRequest(`/groups`, "GET", null, token);
      setGroups(groups);
    } catch (err) {
      setError(err.message || "שגיאה בטעינת הקבוצות");
    }
  }

  function handleGroupCreated(newGroup) {
    setGroups(prev => [...prev, {...newGroup, is_admin:true}]);
    setShowForm(false);
  }

  async function handleUpdateGroupName(groupId) {
    try {
      await sendRequest(`/groups/${groupId}`, `PUT`, { name: newGroupName }, token);
      setGroups(prev =>
        prev.map(group =>
          group.id === groupId ? { ...group, name: newGroupName } : group
        )
      );
      setEditingGroupId(null);
      setNewGroupName('');
    } catch(err) {
      setError(err.message || 'שגיאה בעדכון שם הקבוצה');
    }
  }

  async function handleDeleteGroup(groupId) {
    try {
      if (!window.confirm("האם אתה בטוח שברצונך למחוק את הקבוצה? פעולה זו בלתי הפיכה.")) return;
      await sendRequest(`/groups/${groupId}`, 'DELETE', null, token);
      setGroups(prev => prev.filter(group => group.id !== groupId));
    } catch(err) {
      setError(err.message || 'שגיאה במחיקת הקבוצה');
    }
  }

  async function handleLeaveGroup(groupId) {
    try {
      if (!window.confirm("האם אתה בטוח שברצונך לעזוב את הקבוצה?")) return;
      await sendRequest(`/groups/${groupId}/leave`, 'POST', null, token);
      setGroups(prev => prev.filter(group => group.id !== groupId));
    } catch(err) {
      setError(err.message || 'שגיאה בעזיבת הקבוצה');
    }
  }

  return (
    <div className="groups-page fadeInAnimation">
      <h2>📋 הקבוצות שלך</h2>

      <div className="group-list">
        {groups.map(group => (
          <div
            key={group.id}
            className="group-card"
            onClick={() => editingGroupId ? null : navigateToPageGroup(`${group.id}`)}
          >
            <div className="group-icon">
              {group.name.charAt(0).toUpperCase()}
            </div>

            {editingGroupId === group.id ? (
              <div className="group-edit-form">
                <input
                  type="text"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                />
                <button onClick={() => handleUpdateGroupName(group.id)}>שמירה</button>
                <button onClick={() => { setEditingGroupId(null); setNewGroupName(''); }}>
                  ביטול
                </button>
              </div>
            ) : (
              <div className="group-name-row">
                <div className="group-name">{group.name}</div>
                <div className="group-actions">
                  <button
                    className="edit-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingGroupId(group.id);
                      setNewGroupName(group.name);
                    }}
                  >
                    ✏️
                  </button>
                  {group.is_admin ? (
                    <button
                      className="delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteGroup(group.id);
                      }}
                    >
                      🗑 מחיקת קבוצה
                    </button>
                  ) : (
                    <button
                      className="delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLeaveGroup(group.id);
                      }}
                    >
                      🚪 עזוב קבוצה
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {error && <p>{error}</p>}

      <button className='add-btn' onClick={() => setShowForm(true)}><img src={add} alt="" width="20px" /> הוספת קבוצה</button>

      {showForm && (
        <AddGroupForm
          onGroupCreated={handleGroupCreated}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
