import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import HelpCenter from '../components/HelpCenter';

const DashboardLayout = ({ allowedRole }) => {
  const storedRole = localStorage.getItem('role');
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');

  if (!storedRole || (allowedRole && storedRole !== allowedRole)) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950 flex transition-colors duration-300">
      <Sidebar role={storedRole} user={storedUser} />
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <Navbar user={storedUser} />
        <main className="flex-1 p-8 overflow-y-auto animate-in text-gray-900 dark:text-gray-100">
          <div className="max-w-7xl mx-auto"><Outlet /></div>
        </main>
      </div>
      <HelpCenter role={storedRole} />
    </div>
  );
};

export default DashboardLayout;
