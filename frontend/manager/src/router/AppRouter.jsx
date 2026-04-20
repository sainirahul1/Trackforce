import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../utils/ProtectedRoute';
import ManagerLayout from '../layouts/ManagerLayout';

import LoginPage from '../pages/auth/LoginPage';
import SignupPage from '../pages/auth/SignupPage';
import Home from '../pages/home/Home';

import ManagerTeam from '../pages/Team';
import EmployeeDetails from '../pages/EmployeeDetails';
import LiveTracking from '../pages/LiveTracking';
import ManagerTasksBoard from '../pages/Tasks';
import ManagerVisits from '../pages/Visits';
import ManagerFollowUps from '../pages/FollowUps';
import InventoryOrders from '../pages/InventoryOrders';
import ManagerAnalytics from '../pages/Analytics';
import ManagerActivityLog from '../pages/ActivityLog';
import ManagerProfile from '../pages/Profile';
import ManagerIssues from '../pages/Issues';
import NotificationsPage from '../pages/shared/NotificationsPage';

const AppRouter = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/manager/login" element={<LoginPage portal="MANAGER" />} />
    <Route path="/login" element={<LoginPage portal="MANAGER" />} />
    <Route path="/signup" element={<SignupPage />} />

    <Route 
      path="/manager/*" 
      element={
        <ProtectedRoute role="manager">
          <ManagerLayout />
        </ProtectedRoute>
      }
    >
      <Route path="dashboard" element={<Navigate to="/manager/analytics" replace />} />
      <Route path="team" element={<ManagerTeam />} />
      <Route path="team/:id" element={<EmployeeDetails />} />
      <Route path="live" element={<LiveTracking />} />
      <Route path="tasks" element={<ManagerTasksBoard />} />
      <Route path="visits" element={<ManagerVisits />} />
      <Route path="follow-ups" element={<ManagerFollowUps />} />
      <Route path="inventory" element={<InventoryOrders />} />
      <Route path="analytics" element={<ManagerAnalytics />} />
      <Route path="activity" element={<ManagerActivityLog />} />
      <Route path="profile" element={<ManagerProfile />} />
      <Route path="issues" element={<ManagerIssues />} />
      <Route path="notifications" element={<NotificationsPage />} />
      <Route index element={<Navigate to="analytics" replace />} />
    </Route>
    <Route path="*" element={<Navigate to="/manager/analytics" replace />} />
  </Routes>
);

export default AppRouter;
