import React from 'react';
import PayPalCheckout from './PayPalCheckout';
import Login from './Login';
import Register from './Register';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';
import DashboardOverview from './DashboardOverview/DashboardOverview';
import GroupsPage from './Group/GroupsPage';
import GroupPage from './Group/GroupPage';
import GroupMembers from './Group/GroupMembers';
import GroupExpenseFrames from './Group/ExpenseFrames';
import ExpenseFramePage from './Frame/ExpenseFramePage';
import GroupSummary from './Group/GroupSummary';
import RequireAuth from './ProtectedRoutes/RequireAuth';
import ReceiptUploader from './ReceiptUploader';
import '../styles/App.css';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/checkout" element={<PayPalCheckout />} />
        <Route path="*" element={<div>404 Not Found</div>} />

        <Route path="/dashboard" element={
          <RequireAuth>
            <DashboardLayout />
          </RequireAuth>
        }>
          <Route path="overview" index element={<DashboardOverview />} />
          <Route path="groups" element={<GroupsPage />} />

          {/* מסלול לעמוד קבוצה עם תתי-עמודים */}
          <Route path="groups/:groupId" element={<GroupPage />}>
            <Route path="members" element={<GroupMembers />} />
            <Route path="frames" element={<GroupExpenseFrames />} />
            <Route path="frames/:frameId" element={<ExpenseFramePage />} />
            <Route path="summary" element={<GroupSummary />} />
          </Route>

          <Route path="overview/expenses/new" element={<ReceiptUploader />} />
        </Route>
      </Routes>
    </Router>
  );
}
