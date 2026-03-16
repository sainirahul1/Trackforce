import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import LoginPage from '../pages/auth/LoginPage';
import SignupPage from '../pages/auth/SignupPage';
import Home from '../pages/home/Home';

// Dashboards
import SuperAdminDashboard from '../pages/superadmin/Dashboard';
import CompaniesList from '../pages/superadmin/Companies';
import TenantDashboard from '../pages/tenant/Dashboard';
import TenantEmployees from '../pages/tenant/Employees';
import ManagerDashboard from '../pages/manager/Dashboard';
import ManagerTeam from '../pages/manager/Team';
import EmployeeDetails from '../pages/manager/EmployeeDetails';
import EmployeeDashboard from '../pages/employee/Dashboard';
import EmployeeProfile from '../pages/employee/Profile';
import EmployeeVisits from '../pages/employee/Visits';
import EmployeeOrders from '../pages/employee/Orders';
import EmployeeActivity from '../pages/employee/Activity';
import EmployeeTasks from '../pages/employee/Tasks';
import ManagerIssues from '../pages/manager/Issues';
import TenantIssues from '../pages/tenant/Issues';
import SuperAdminIssues from '../pages/superadmin/Issues';

const AppRouter = () => (
  <Routes>
    {/* Public Landing Page */}
    <Route path="/" element={<Home />} />

    {/* Auth Routes */}
    <Route path="/login" element={<LoginPage />} />
    <Route path="/signup" element={<SignupPage />} />


    {/* Super Admin Routes */}
    <Route path="/superadmin" element={<DashboardLayout allowedRole="superadmin" />}>
      <Route path="dashboard" element={<SuperAdminDashboard />} />
      <Route path="companies" element={<CompaniesList />} />
      <Route path="issues" element={<SuperAdminIssues />} />
      <Route index element={<Navigate to="dashboard" replace />} />
    </Route>

    {/* Tenant Routes */}
    <Route path="/tenant" element={<DashboardLayout allowedRole="tenant" />}>
      <Route path="dashboard" element={<TenantDashboard />} />
      <Route path="employees" element={<TenantEmployees />} />
      <Route path="issues" element={<TenantIssues />} />
      <Route index element={<Navigate to="dashboard" replace />} />
    </Route>

    {/* Manager Routes */}
    <Route path="/manager" element={<DashboardLayout allowedRole="manager" />}>
      <Route path="dashboard" element={<ManagerDashboard />} />
      <Route path="team" element={<ManagerTeam />} />
      <Route path="team/:id" element={<EmployeeDetails />} />
      <Route path="issues" element={<ManagerIssues />} />
      <Route index element={<Navigate to="dashboard" replace />} />
    </Route>

    {/* Employee Routes */}
    <Route path="/employee" element={<DashboardLayout allowedRole="employee" />}>
      <Route path="dashboard" element={<EmployeeDashboard />} />
      <Route path="profile" element={<EmployeeProfile />} />
      <Route path="visits" element={<EmployeeVisits />} />
      <Route path="orders" element={<EmployeeOrders />} />
      <Route path="activity" element={<EmployeeActivity />} />
      <Route path="tasks" element={<EmployeeTasks />} />
      <Route index element={<Navigate to="dashboard" replace />} />
    </Route>

    {/* Fallback */}
    <Route path="*" element={<Navigate to="/login" replace />} />
  </Routes>
);

export default AppRouter;
