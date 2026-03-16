import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import HelpCenter from '../components/HelpCenter';

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

  if (!storedRole || (allowedRole && storedRole !== allowedRole)) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950 flex transition-colors duration-300">
      <Sidebar 
        role={storedRole} 
        user={storedUser} 
        isCollapsed={isSidebarCollapsed} 
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
      />
      <div className={`flex-1 ${isSidebarCollapsed ? 'ml-20' : 'ml-64'} flex flex-col min-h-screen transition-all duration-300`}>
        <Navbar user={storedUser} />
        <main className="flex-1 p-8 overflow-y-auto text-gray-900 dark:text-gray-100">
          <div className="max-w-7xl mx-auto">
            <Outlet context={{ workStatus, setWorkStatus }} />
          </div>
        </main>
      </div>
      <HelpCenter role={storedRole} />
    </div>
  );
};

export default DashboardLayout;
