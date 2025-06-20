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
  const { user, token } = useAuth();

  const [balance, setBalance] = useState({
    totalCredit: 0,
    owedToYou: 0,
    youOwe: 0,
  });
  const [recentDebts, setRecentDebts] = useState([]);
  const [overDueDebts, setOverDueDebts] = useState([]);

  // refs for section scrolling
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
        const response = await sendRequest(`/userData/${user.id}`, "GET", null, token);
        setBalance({
          totalCredit: response.totalCredit || 0,
          owedToYou: response.owedToYou || 0,
          youOwe: response.youOwe || 0,
        });
        setRecentDebts(response.recentDebts || []);
        setOverDueDebts(response.overDueDebts || []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="dashboard-overview">
      <h2 className="overview-title">Dashboard Overview</h2>

      {/* ניווט פנימי לעוגנים */}
      <nav className="overview-nav">
        <button onClick={() => scrollToSection(actionsRef)}>Quick Actions</button>
        <button onClick={() => scrollToSection(groupRef)}>Group</button>
        <button onClick={() => scrollToSection(remindersRef)}>Reminders</button>
        <button onClick={() => scrollToSection(balanceRef)}>Balance</button>
        <button onClick={() => scrollToSection(debtsRef)}>Debts</button>
      </nav>

      {/* תיאור פתיחה */}
      <div className="overview-description">
        <p>Welcome to your dashboard! Here you can manage your account, view statistics, and access various features.</p>
        <p>You can go to groups in order to create new group or to see updates in your groups.</p>
      </div>

      {/* תוכן הדשבורד */}
      <div className="overview-grid">

        <section ref={actionsRef}>
          <QuickActions />
        </section>

        <section ref={groupRef}>
          <GroupSummary currentGroup={user.currentGroup} />
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
