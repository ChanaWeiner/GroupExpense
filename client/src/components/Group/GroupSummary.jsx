import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import sendRequest from '../../services/serverApi';

export default function GroupSummary() {
  const { id } = useParams();
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    async function fetchSummary() {
      const data = await sendRequest(`/groups/${id}/summary`, 'GET');
      setSummary(data);
    }
    fetchSummary();
  }, [id]);

  if (!summary) return <p>טוען...</p>;

  return (
    <div>
      <h3>📊 החישוב האישי שלך</h3>
      <p>החוב שלך: ₪{summary.youOwe}</p>
      <p>חייבים לך: ₪{summary.othersOweYou}</p>
    </div>
  );
}