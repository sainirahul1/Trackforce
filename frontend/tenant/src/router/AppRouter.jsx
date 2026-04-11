import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../utils/ProtectedRoute';
import TenantLayout from '../layouts/TenantLayout';

import LoginPage from '../pages/auth/LoginPage';
import SignupPage from '../pages/auth/SignupPage';
import Home from '../pages/home/Home';

import TenantDashboard from '../pages/Dashboard';
import TenantEmployees from '../pages/Employees';
import ManagerDetails from '../pages/ManagerDetails';
import LiveTrackingTenant from '../pages/LiveTracking';
import VisitsTenant from '../pages/Visits';
import OrdersTenant from '../pages/Orders';
import SubscriptionTenant from '../pages/Subscription';
import AnalyticsTenant from '../pages/Analytics';
import ActivityTenant from '../pages/Activity';
import SettingsTenant from '../pages/Settings';
import NotificationsTenant from '../pages/Notifications';
import TenantIssues from '../pages/Issues';
import TenantProfile from '../pages/Profile';

const AppRouter = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/tenant/login" element={<LoginPage portal="TENANT" />} />
    <Route path="/login" element={<LoginPage portal="TENANT" />} />
    <Route path="/signup" element={<SignupPage />} />

    <Route 
      path="/tenant/*" 
      element={
        <ProtectedRoute role="tenant">
          <TenantLayout />
        </ProtectedRoute>
      }
    >
      <Route path="dashboard" element={<TenantDashboard />} />
      <Route path="employees" element={<TenantEmployees />} />
      <Route path="employees/:id" element={<ManagerDetails />} />
      <Route path="live" element={<LiveTrackingTenant />} />
      <Route path="visits" element={<VisitsTenant />} />
      <Route path="orders" element={<OrdersTenant />} />
      <Route path="subscription" element={<SubscriptionTenant />} />
      <Route path="analytics" element={<AnalyticsTenant />} />
      <Route path="activity" element={<ActivityTenant />} />
      <Route path="settings" element={<SettingsTenant />} />
      <Route path="notifications" element={<NotificationsTenant />} />
      <Route path="issues" element={<TenantIssues />} />
      <Route path="profile" element={<TenantProfile />} />
      <Route index element={<Navigate to="dashboard" replace />} />
    </Route>
    <Route path="*" element={<Navigate to="/tenant/dashboard" replace />} />
  </Routes>
);

export default AppRouter;
