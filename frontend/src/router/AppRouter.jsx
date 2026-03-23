import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import LoginPage from '../pages/auth/LoginPage';
import SignupPage from '../pages/auth/SignupPage';
import Home from '../pages/home/Home';

// Dashboards
import SuperAdminDashboard from '../pages/superadmin/Dashboard';
import CompaniesList from '../pages/superadmin/Companies';
import Subscriptions from '../pages/superadmin/Subscriptions';
import RolesPermissions from '../pages/superadmin/RolesPermissions';
import NotificationsSuperAdmin from '../pages/superadmin/Notifications';
import SettingsSuperAdmin from '../pages/superadmin/Settings';
import TenantDashboard from '../pages/tenant/Dashboard';
import TenantEmployees from '../pages/tenant/Employees';
import ManagerDashboard from '../pages/manager/Dashboard';
import ManagerTeam from '../pages/manager/Team';
import EmployeeDetails from '../pages/manager/EmployeeDetails';
import LiveTracking from '../pages/manager/LiveTracking';
import ManagerTasksBoard from '../pages/manager/Tasks';
import ManagerVisits from '../pages/manager/Visits';
import InventoryOrders from '../pages/manager/InventoryOrders';
import ManagerAnalytics from '../pages/manager/Analytics';
import ManagerActivityLog from '../pages/manager/ActivityLog';
import ManagerProfile from '../pages/manager/Profile';
import ManagerIssues from '../pages/manager/Issues';
import TenantIssues from '../pages/tenant/Issues';
import LiveTrackingTenant from '../pages/tenant/LiveTracking';
import VisitsTenant from '../pages/tenant/Visits';
import OrdersTenant from '../pages/tenant/Orders';
import SubscriptionTenant from '../pages/tenant/Subscription';
import AnalyticsTenant from '../pages/tenant/Analytics';
import ActivityTenant from '../pages/tenant/Activity';
import SettingsTenant from '../pages/tenant/Settings';
import NotificationsTenant from '../pages/tenant/Notifications';
import TenantProfile from '../pages/tenant/Profile';
import SuperAdminIssues from '../pages/superadmin/Issues';

// Employee Portal
import EmployeeDashboard from '../pages/employee/Dashboard';
import EmployeeProfile from '../pages/employee/Profile';
import EmployeeVisits from '../pages/employee/Visits';
import EmployeeOrders from '../pages/employee/Orders';
import EmployeeActivity from '../pages/employee/Activity';
import EmployeeTasks from '../pages/employee/Tasks';

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
      <Route path="subscriptions" element={<Subscriptions />} />
      <Route path="roles" element={<RolesPermissions />} />
      <Route path="notifications" element={<NotificationsSuperAdmin />} />
      <Route path="settings" element={<SettingsSuperAdmin />} />
      <Route path="issues" element={<SuperAdminIssues />} />
      <Route index element={<Navigate to="dashboard" replace />} />
    </Route>

    {/* Tenant Routes */}
    <Route path="/tenant" element={<DashboardLayout allowedRole="tenant" />}>
      <Route path="dashboard" element={<TenantDashboard />} />
      <Route path="employees" element={<TenantEmployees />} />
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

    {/* Manager Routes */}
    <Route path="/manager" element={<DashboardLayout allowedRole="manager" />}>
      <Route path="dashboard" element={<ManagerDashboard />} />
      <Route path="team" element={<ManagerTeam />} />
      <Route path="team/:id" element={<EmployeeDetails />} />
      <Route path="live" element={<LiveTracking />} />
      <Route path="tasks" element={<ManagerTasksBoard />} />
      <Route path="visits" element={<ManagerVisits />} />
      <Route path="inventory" element={<InventoryOrders />} />
      <Route path="analytics" element={<ManagerAnalytics />} />
      <Route path="activity" element={<ManagerActivityLog />} />
      <Route path="profile" element={<ManagerProfile />} />
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
