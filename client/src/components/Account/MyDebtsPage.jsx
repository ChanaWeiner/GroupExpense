import { useEffect, useState } from 'react';
import sendRequest from '../../services/serverApi';
import { useAuth } from '../context/AuthContext';
import PayPalCheckout from './PayPalCheckout';
import '../../styles/MyDebtsPage.css';

export default function MyDebtsPage() {
  const { token } = useAuth();
  const [debtsData, setDebtsData] = useState(null);
  const [expandedGroups, setExpandedGroups] = useState({});
  const [expandedFrames, setExpandedFrames] = useState({});
  const [selectedDebt, setSelectedDebt] = useState({});
  const [showPayPal, setShowPayPal] = useState(false);

  useEffect(() => {
    fetchDebts();
  }, []);

  async function fetchDebts() {
    try {
      const result = await sendRequest('debts/my-debts-structured', 'GET', null, token);
      setDebtsData(result);
    } catch (err) {
      console.error(err);
    }
  }

  function toggleGroup(groupId) {
    setExpandedGroups(prev => ({ ...prev, [groupId]: !prev[groupId] }));
  }

  function toggleFrame(frameId) {
    setExpandedFrames(prev => ({ ...prev, [frameId]: !prev[frameId] }));
  }

  function toggleDebtSelection(debt) {
    if (!debt.paypal_email) return; // לא מאפשר סימון אם אין מייל פייפאל
    setSelectedDebt(prev => (prev?.debt_id === debt.debt_id ? {} : debt));
  }


  if (debtsData === null) return <div>טוען...</div>;
  if (debtsData.length === 0) return <div>אין לך חובות פתוחים 🎉</div>;
  return (
    <div className="my-debts-page">
      <h2>החובות שלי</h2>

      {debtsData.map(group => (
        <div key={group.group_id} className="group-section">
          <div className="group-header" onClick={() => toggleGroup(group.group_id)}>
            <span>{group.group_name}</span>
            <span>{expandedGroups[group.group_id] ? '▼' : '▶'}</span>
          </div>

          {expandedGroups[group.group_id] && (
            <div className="frames-container">
              {group.frames.map(frame => (
                <div key={frame.frame_id} className="frame-section">
                  <div className="frame-header" onClick={() => toggleFrame(frame.frame_id)}>
                    <span>{frame.frame_name}</span>
                    <span>{expandedFrames[frame.frame_id] ? '▼' : '▶'}</span>
                  </div>

                  {expandedFrames[frame.frame_id] && (
                    <table className="debts-table">
                      <thead>
                        <tr>
                          <th></th>
                          <th>למי</th>
                          <th>תיאור</th>
                          <th>סכום</th>
                          <th>תאריך סיום</th> {/* חדש */}
                        </tr>
                      </thead>
                      <tbody>
                        {frame.debts.map(debt => (
                          <tr
                            key={debt.debt_id}
                            className={selectedDebt?.debt_id === debt.debt_id ? 'selected-row' : ''}
                            onClick={() => toggleDebtSelection(debt)}
                            style={{ cursor: debt.paypal_email ? 'pointer' : 'not-allowed' }}
                          >
                            <td>
                              <input
                                type="checkbox"
                                checked={selectedDebt?.debt_id === debt.debt_id}
                                disabled={!debt.paypal_email}
                                onChange={() => toggleDebtSelection(debt)}
                                onClick={e => e.stopPropagation()}
                              />
                            </td>
                            <td>{debt.to_user_name}</td>
                            <td>{debt.description}</td>
                            <td>{parseFloat(debt.amount).toFixed(2)} ₪</td>
                            <td>{debt.due_date ? new Date(debt.due_date).toLocaleDateString() : '—'}</td> {/* חדש */}
                          </tr>
                        ))}
                      </tbody>


                    </table>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      <button
        onClick={() => setShowPayPal(true)}
        disabled={!selectedDebt.debt_id}
      >
        לתשלום
      </button>
      {showPayPal && <PayPalCheckout debt={selectedDebt} setShowPayPal={setShowPayPal} onSuccess={fetchDebts} />}
    </div>

  );
}
