import React from 'react';
import PayPalCheckout from './PayPalCheckout';
import Login from './login';
import Register from './register';
import { BrowserRouter as Router, Routes, Route,Navigate } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';
import DashboardOverview from './DashboardOverview/DashboardOverview';
import GroupsPage from './GroupsPage';
import RequireAuth from './ProtectedRoutes/RequireAuth';
import '../styles/App.css'; // Assuming you have some styles for the app
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
                </Route>
            </Routes>
        </Router>
    );
}

