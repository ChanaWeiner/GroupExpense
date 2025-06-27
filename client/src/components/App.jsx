import React from 'react';
import Login from './Login';
import Register from './Register';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';
import DashboardOverview from './DashboardOverview/DashboardOverview';
import GroupsPage from './Group/GroupsPage';
import GroupPage from './Group/GroupPage';
import GroupMembers from './Group/GroupMembers';
import GroupExpenseFrames from './Frame/ExpenseFrames';
import ExpenseFramePage from './Frame/ExpenseFramePage';
import RequireAuth from './ProtectedRoutes/RequireAuth';
import MyAccountPage from './Account/MyAccountPage';
import MyDebtsPage from './Account/MyDebtsPage';
import OwedToMePage from './Account/OwedToMePage';
import MyExpensesPage from './Account/MyExpensesPage';
import LandingPage from './LandingPage';
import '../styles/App.css';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/landing" replace />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/group-expense" element={
          <RequireAuth>
            <DashboardLayout />
          </RequireAuth>
        }>
          <Route path="" element={<Navigate to="overview" replace />} />
          <Route path="overview" index element={<DashboardOverview />} />
          <Route path="groups" element={<GroupsPage />} />

          <Route path="groups/:groupId" element={<GroupPage />}>
            <Route path="" element={<Navigate to="frames" replace />} />
            <Route path="members" element={<GroupMembers />} />
            <Route path="frames" element={<GroupExpenseFrames />} />
            <Route path="frames/:frameId" element={<ExpenseFramePage />} />
          </Route>

          <Route path="my-account" element={<MyAccountPage />}>
            <Route path="my-debts" element={<MyDebtsPage />} />
            <Route path="owed-to-me" element={<OwedToMePage />} />
            <Route path="my-expenses" element={<MyExpensesPage />} />
          </Route>
        </Route>

        <Route path="*" element={<div>404 Not Found</div>} />

      </Routes>
    </Router>
  );
}
