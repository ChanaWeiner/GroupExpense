import React, { useRef, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import sendRequest from '../../services/serverApi';

import BalanceSummary from './BalanceSummary';
import DebtList from './DebtList';
import QuickActions from './QuickActions';
import Reminders from './Reminders';
import WelcomeSection from './WelcomeSection';
import HomeSummary from './HomeSummary';
import StatisticsSummary from './StatisticsSummary';

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
  const [messages, setMessages] = useState([]);
  const [statistics, setStatistics] = useState({
    numGroups: 0,
    numDebts: 0,
    monthlyExpensesSum: 0
  });

  // refs לגלילה בין מקטעים
  const actionsRef = useRef(null);
  const groupRef = useRef(null);

  const scrollToSection = (ref) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await sendRequest(`/userData`, "GET", null, token);
        setBalance(response.balance || { totalCredit: 0, owedToYou: 0, youOwe: 0 });
        setStatistics(response.statistics || { numGroups: 0, numDebts: 0, monthlyExpensesSum: 0 });
        setMessages(response.messages || []);
        setRecentDebts(response.recentDebts || []);
      } catch (error) {
        console.error("שגיאה בטעינת הנתונים:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [token]);

  return (
    <div className="dashboard-overview">
      <WelcomeSection
        onGroupsClick={() => scrollToSection(groupRef)}
        onActionsClick={() => scrollToSection(actionsRef)}
      />
      <HomeSummary />

      <div className="overview-grid">
        <section ref={actionsRef}>
          <QuickActions />
        </section>
        <section>
          <Reminders reminders={messages} />
        </section>
        <section>
          <BalanceSummary balance={balance} isLoading={isLoading} />
        </section>
        <section>
          <StatisticsSummary statistics={statistics} isLoading={isLoading} />
        </section>
        <section>
          <DebtList recentDebts={recentDebts} isLoading={isLoading} />
        </section>
      </div>
    </div>
  );
}