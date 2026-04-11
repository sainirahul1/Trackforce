import React, { useState, useEffect } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import HelpCenter from '../components/layout/HelpCenter';
import SuspendedOverlay from '../components/overlays/SuspendedOverlay';
import MaintenanceOverlay from '../components/overlays/MaintenanceOverlay';
import * as authService from '../services/core/authService';
import { getPublicSettings } from '../services/core/publicService';
import { useAuth } from '../context/AuthContext';
import TenantSkeletonRegistry from '../components/skeletons/tenant/TenantSkeletonRegistry';
import ManagerSkeletonRegistry from '../components/skeletons/manager/ManagerSkeletonRegistry';
import EmployeeSkeletonRegistry from '../components/skeletons/employee/EmployeeSkeletonRegistry';

// Impersonation bootstrap is now handled centrally in AuthContext.jsx

const DashboardLayout = ({ allowedRole }) => {
  // const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);
  // const [workStatus, setWorkStatus] = React.useState('Offline');
  // const [maintenanceMode, setMaintenanceMode] = React.useState(false);
  // const [isCheckingMaintenance, setIsCheckingMaintenance] = React.useState(true);

  // const { user: localUser, isLoading: authLoading } = useAuth();

  // Logic to automatically end impersonation if returning to a superadmin route via back button
  const impersonatedRole = sessionStorage.getItem('role');
  const localRole = localStorage.getItem('role');
  if (allowedRole === 'superadmin' && localRole === 'superadmin' && impersonatedRole && impersonatedRole !== 'superadmin') {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('role');
    sessionStorage.removeItem('user');
    window.location.reload(); // Force full reload to rebuild superadmin AuthContext
  }

  // storedRole is read AFTER any potential cleanup, so it's always fresh
  // const storedRole = sessionStorage.getItem('role') || localStorage.getItem('role');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const location = useLocation();
  const [workStatus, setWorkStatus] = useState('Offline'); // Offline, Active, Paused
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [isCheckingMaintenance, setIsCheckingMaintenance] = useState(true);

  // CRITICAL: During impersonation, role is in sessionStorage. Read it first, fall back to localStorage.
  const storedRole = sessionStorage.getItem('role') || localStorage.getItem('role');
  const { user: localUser, isLoading: authLoading, refreshUser } = useAuth();

  // Route Change Skeleton Trigger (Real-Time Synchronization Rollout)
  // Removed forced loading state to support 0s hydration and "Instant Water" flow
  // Modules are now responsible for their own loading states if necessary.

  useEffect(() => {
    const fetchMaintenanceStatus = async () => {
      try {
        const settings = await getPublicSettings();
        setMaintenanceMode(settings?.maintenanceMode ? true : false);
      } catch (err) {
        console.error('Failed to fetch maintenance status', err);
      } finally {
        setIsCheckingMaintenance(false);
      }
    };

    if (storedRole) {
      if (storedRole !== 'superadmin') {
        fetchMaintenanceStatus();
        const intervalId = setInterval(fetchMaintenanceStatus, 15000);
        return () => clearInterval(intervalId);
      }
    } else {
      setIsCheckingMaintenance(false);
    }
  }, [storedRole]);

  if (authLoading || (isCheckingMaintenance && storedRole !== 'superadmin')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50 dark:bg-gray-950">
        <div className="w-14 h-14 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin shadow-xl" />
      </div>
    );
  }
  const setPageLoading = (isLoading) => {
    setIsPageLoading(isLoading);
  };


  // MANDATORY SECURITY RULE: Block cross-portal navigation
  if (!storedRole) {
    // No session at all → send to login
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && storedRole !== allowedRole) {
    // User IS logged in but trying to access a DIFFERENT portal
    // → Redirect them BACK to their own portal (do NOT logout)
    console.warn(`[SECURITY] Cross-Portal Blocked: Role '${storedRole}' tried to access '${allowedRole}' portal. Redirecting to /${storedRole}/dashboard.`);
    return <Navigate to={`/${storedRole}/dashboard`} replace />;
  }

  // Superadmins impersonating other roles bypass maintenance mode
  const isImpersonating = !!sessionStorage.getItem('token');
  if (maintenanceMode && storedRole !== 'superadmin' && !isImpersonating) {
    return <MaintenanceOverlay />;
  }

  const isSuspended = localUser?.tenantStatus === 'suspended' || localUser?.isDeactivated === true;

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950 flex transition-colors duration-300 relative">
      {isSuspended && <SuspendedOverlay />}
      <div className="print:hidden">
        <Sidebar
          role={storedRole}
          user={localUser}
          isCollapsed={isSidebarCollapsed}
          onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
      </div>
      <div className={`flex-1 ${isSidebarCollapsed ? 'ml-20' : 'ml-64'} flex flex-col min-h-screen transition-all duration-300 print:ml-0 print:p-0 overflow-x-hidden`}>
        <div className="print:hidden">
          <Navbar user={localUser} />
        </div>
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto text-gray-900 dark:text-gray-100 print:p-0">
          <div className="max-w-7xl mx-auto print:max-w-none print:m-0">
            <div className="content-ready">
              <Outlet context={{ workStatus, setWorkStatus, setPageLoading }} />
            </div>
            {isPageLoading && (
              <div className="animate-in fade-in duration-300">
                {location.pathname.startsWith('/tenant') ? (
                  <TenantSkeletonRegistry pathname={location.pathname} />
                ) : location.pathname.startsWith('/manager') ? (
                  <ManagerSkeletonRegistry pathname={location.pathname} />
                ) : location.pathname.startsWith('/employee') ? (
                  <EmployeeSkeletonRegistry pathname={location.pathname} />
                ) : null}
              </div>
            )}
          </div>
        </main>
      </div>
      <div className="print:hidden">
        <HelpCenter role={storedRole} />
      </div>
    </div>
  );
};


export default DashboardLayout;
