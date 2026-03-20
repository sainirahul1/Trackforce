import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import HelpCenter from '../components/HelpCenter';
import SuspendedOverlay from '../components/SuspendedOverlay';
import * as authService from '../services/authService';

const DashboardLayout = ({ allowedRole }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);
  const [workStatus, setWorkStatus] = React.useState('Offline'); // Offline, Active, Paused
  
  const storedRole = localStorage.getItem('role');
  let storedUser = {};
  try {
    storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  } catch (e) {
    console.error("Failed to parse user from localStorage", e);
  }

  const [localUser, setLocalUser] = React.useState(storedUser);

  React.useEffect(() => {
    const fetchStatus = async () => {
      try {
        const freshUser = await authService.getMe();
        setLocalUser(freshUser);
      } catch (e) {
        console.error("Failed to fetch user status", e);
      }
    };
    if (storedRole && storedRole !== 'superadmin') {
      fetchStatus();
    }
  }, [storedRole]);

  if (!storedRole || (allowedRole && storedRole !== allowedRole)) {
    return <Navigate to="/login" replace />;
  }

  const isSuspended = localUser.tenantStatus === 'suspended';

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950 flex transition-colors duration-300 relative">
      {isSuspended && <SuspendedOverlay />}
      <div className="print:hidden">
        <Sidebar 
          role={storedRole} 
          user={storedUser} 
          isCollapsed={isSidebarCollapsed} 
          onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
        />
      </div>
      <div className={`flex-1 ${isSidebarCollapsed ? 'ml-20' : 'ml-64'} flex flex-col min-h-screen transition-all duration-300 print:ml-0 print:p-0 overflow-x-hidden`}>
        <div className="print:hidden">
          <Navbar user={storedUser} />
        </div>
        <main className="flex-1 p-8 overflow-y-auto text-gray-900 dark:text-gray-100 print:p-0">
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
