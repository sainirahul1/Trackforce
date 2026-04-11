import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../utils/ProtectedRoute';
import EmployeeLayout from '../layouts/EmployeeLayout';

import LoginPage from '../pages/auth/LoginPage';
import SignupPage from '../pages/auth/SignupPage';
import Home from '../pages/home/Home';

import EmployeeDashboard from '../pages/Dashboard';
import EmployeeProfile from '../pages/Profile';
import EmployeeVisits from '../pages/Visits';
import EmployeeOrders from '../pages/Orders';
import EmployeeActivity from '../pages/Activity';
import EmployeeTasks from '../pages/Tasks';
import EmployeeIssues from '../pages/Issues';
import NotificationsPage from '../pages/shared/NotificationsPage';

const AppRouter = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/employee/login" element={<LoginPage portal="EMPLOYEE" />} />
    <Route path="/login" element={<LoginPage portal="EMPLOYEE" />} />
    <Route path="/signup" element={<SignupPage />} />

    <Route 
      path="/employee/*" 
      element={
        <ProtectedRoute role="employee">
          <EmployeeLayout />
        </ProtectedRoute>
      }
    >
      <Route path="dashboard" element={<EmployeeDashboard />} />
      <Route path="profile" element={<EmployeeProfile />} />
      <Route path="visits" element={<EmployeeVisits />} />
      <Route path="orders" element={<EmployeeOrders />} />
      <Route path="activity" element={<EmployeeActivity />} />
      <Route path="tasks" element={<EmployeeTasks />} />
      <Route path="issues" element={<EmployeeIssues />} />
      <Route path="notifications" element={<NotificationsPage />} />
      <Route index element={<Navigate to="dashboard" replace />} />
    </Route>
    {/* Always redirect unknown subroutes to dashboard if logged in */}
    <Route path="*" element={<Navigate to="/employee/dashboard" replace />} />
  </Routes>
);

export default AppRouter;
