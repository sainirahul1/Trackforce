import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../utils/ProtectedRoute';
import SuperAdminLayout from '../layouts/SuperAdminLayout';

import LoginPage from '../pages/auth/LoginPage';
import SignupPage from '../pages/auth/SignupPage';
import Home from '../pages/home/Home';

import SuperAdminDashboard from '../pages/Dashboard';
import CompaniesList from '../pages/Companies';
import Subscriptions from '../pages/Subscriptions';
import RolesPermissions from '../pages/RolesPermissions';
import NotificationsSuperAdmin from '../pages/Notifications';
import SettingsSuperAdmin from '../pages/Settings';
import SuperAdminIssues from '../pages/Issues';
import SuperAdminProfile from '../pages/Profile';

const AppRouter = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/superadmin/login" element={<LoginPage portal="SUPER_ADMIN" />} />
    <Route path="/login" element={<LoginPage portal="SUPER_ADMIN" />} />
    <Route path="/signup" element={<SignupPage />} />

    <Route 
      path="/superadmin/*" 
      element={
        <ProtectedRoute role="superadmin">
          <SuperAdminLayout />
        </ProtectedRoute>
      }
    >
      <Route path="dashboard" element={<SuperAdminDashboard />} />
      <Route path="companies" element={<CompaniesList />} />
      <Route path="subscriptions" element={<Subscriptions />} />
      <Route path="roles" element={<RolesPermissions />} />
      <Route path="notifications" element={<NotificationsSuperAdmin />} />
      <Route path="settings" element={<SettingsSuperAdmin />} />
      <Route path="issues" element={<SuperAdminIssues />} />
      <Route path="profile" element={<SuperAdminProfile />} />
      <Route index element={<Navigate to="dashboard" replace />} />
    </Route>
    <Route path="*" element={<Navigate to="/superadmin/dashboard" replace />} />
  </Routes>
);

export default AppRouter;
