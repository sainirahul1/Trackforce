import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import HelpCenter from '../components/layout/HelpCenter';
import SuspendedOverlay from '../components/overlays/SuspendedOverlay';
import MaintenanceOverlay from '../components/overlays/MaintenanceOverlay';
import * as authService from '../services/core/authService';
import { getPublicSettings } from '../services/core/publicService';
import { useAuth } from '../context/AuthContext';

// Impersonation bootstrap is now handled centrally in AuthContext.jsx

const DashboardLayout = ({ allowedRole }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);
  const [workStatus, setWorkStatus] = React.useState('Offline');
  const [maintenanceMode, setMaintenanceMode] = React.useState(false);
  const [isCheckingMaintenance, setIsCheckingMaintenance] = React.useState(true);

  const { user: localUser, isLoading: authLoading } = useAuth();

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
  const storedRole = sessionStorage.getItem('role') || localStorage.getItem('role');

  React.useEffect(() => {
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

  if (!storedRole || (allowedRole && storedRole !== allowedRole)) {
    return <Navigate to="/login" replace />;
  }

  if (maintenanceMode && storedRole !== 'superadmin') {
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
            <Outlet context={{ workStatus, setWorkStatus }} />
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
