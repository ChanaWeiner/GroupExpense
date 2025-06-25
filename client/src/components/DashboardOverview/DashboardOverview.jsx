import React, { useRef, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import sendRequest from '../../services/serverApi';

import BalanceSummary from './BalanceSummary';
import DebtList from './DebtList';
import QuickActions from './QuickActions';
import Reminders from './Reminders';
import GroupSummary from './GroupSummary';

import '../../styles/Overview.css';

export default function DashboardOverview() {
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useAuth();

  const [balance, setBalance] = useState({
    totalCredit: 0,
    owedToYou: 0,
    youOwe: 0,
  });
  const [recentDebts, setRecentDebts] = useState([]);
  const [overDueDebts, setOverDueDebts] = useState([]);

  // refs לגלילה בין מקטעים
  const actionsRef = useRef(null);
  const groupRef = useRef(null);
  const remindersRef = useRef(null);
  const balanceRef = useRef(null);
  const debtsRef = useRef(null);

  const scrollToSection = (ref) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await sendRequest(`/userData`, "GET", null, token);
        setBalance({
          totalCredit: response.totalCredit || 0,
          owedToYou: response.owedToYou || 0,
          youOwe: response.youOwe || 0,
        });
        setRecentDebts(response.recentDebts || []);
        setOverDueDebts(response.overDueDebts || []);
      } catch (error) {
        console.error("שגיאה בטעינת הנתונים:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="dashboard-overview" dir="rtl">
      <h2 className="overview-title">סקירת לוח בקרה</h2>

      {/* ניווט בין מקטעים */}
      <nav className="overview-nav">
        <button onClick={() => scrollToSection(actionsRef)}>פעולות מהירות</button>
        <button onClick={() => scrollToSection(groupRef)}>קבוצות</button>
        <button onClick={() => scrollToSection(remindersRef)}>תזכורות</button>
        <button onClick={() => scrollToSection(balanceRef)}>יתרה</button>
        <button onClick={() => scrollToSection(debtsRef)}>חובות</button>
      </nav>

      {/* תיאור פתיחה */}
      <div className="overview-description">
        <p>ברוך הבא ללוח הבקרה שלך! כאן תוכל לנהל את החשבון שלך, לצפות בסטטיסטיקות ולבצע פעולות שונות.</p>
        <p>ניתן לעבור לעמוד הקבוצות כדי ליצור קבוצה חדשה או לצפות בעדכונים בקבוצות שלך.</p>
      </div>

      {/* תוכן לוח הבקרה */}
      <div className="overview-grid">

        <section ref={actionsRef}>
          <QuickActions />
        </section>

        <section ref={groupRef}>
          <GroupSummary />
        </section>

        <section ref={remindersRef}>
          <Reminders reminders={overDueDebts} />
        </section>

        <section ref={balanceRef}>
          <BalanceSummary balance={balance} isLoading={isLoading} />
        </section>

        <section ref={debtsRef}>
          <DebtList recentDebts={recentDebts} isLoading={isLoading} />
        </section>

      </div>
    </div>
  );
}
