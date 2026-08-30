import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUser } from './redux/authSlice.js';

// Pages
import Landing from './pages/Landing.jsx';
import Login from './pages/auth/Login.jsx';
import Register from './pages/auth/Register.jsx';

// Customer Pages
import CustomerDashboard from './pages/customer/Dashboard.jsx';
import CustomerTickets from './pages/customer/Tickets.jsx';
import CreateTicket from './pages/customer/CreateTicket.jsx';
import TicketDetail from './pages/customer/TicketDetail.jsx';
import Profile from './pages/Profile.jsx';

// Agent Pages
import AgentDashboard from './pages/agent/Dashboard.jsx';
import AgentTickets from './pages/agent/Tickets.jsx';
import AgentTicketDetail from './pages/agent/TicketDetail.jsx';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard.jsx';
import AdminTickets from './pages/admin/Tickets.jsx';
import AdminUsers from './pages/admin/Users.jsx';

// Layouts
import DashboardLayout from './layouts/DashboardLayout.jsx';

// Protected Route
import ProtectedRoute from './routes/ProtectedRoute.jsx';

function App() {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        {/* ⭐ LANDING PAGE ⭐ */}
        <Route path="/" element={<Landing />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Customer Routes */}
        <Route path="/customer" element={
          <ProtectedRoute allowedRoles={['customer']}>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<CustomerDashboard />} />
          <Route path="tickets" element={<CustomerTickets />} />
          <Route path="tickets/create" element={<CreateTicket />} />
          <Route path="tickets/:id" element={<TicketDetail />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Agent Routes */}
        <Route path="/agent" element={
          <ProtectedRoute allowedRoles={['agent', 'admin']}>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<AgentDashboard />} />
          <Route path="tickets" element={<AgentTickets />} />
          <Route path="tickets/:id" element={<AgentTicketDetail />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="tickets" element={<AdminTickets />} />
          <Route path="users" element={<AdminUsers />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;