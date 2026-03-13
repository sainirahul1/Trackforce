import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Building2, ClipboardList, Map, Settings, LogOut, ShieldCheck, Bell, ShoppingBag, Camera, Clock, AlertCircle } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Sidebar = ({ role, user }) => {
  const menuItems = {
    superadmin: [
      { name: 'Dashboard', icon: LayoutDashboard, path: '/superadmin/dashboard' },
      { name: 'Companies', icon: Building2, path: '/superadmin/companies' },
      { name: 'Issues', icon: AlertCircle, path: '/superadmin/issues' },
    ],
    tenant: [
      { name: 'Dashboard', icon: LayoutDashboard, path: '/tenant/dashboard' },
      { name: 'Employees', icon: Users, path: '/tenant/employees' },
      { name: 'Issues', icon: AlertCircle, path: '/tenant/issues' },
    ],
    manager: [
      { name: 'Dashboard', icon: LayoutDashboard, path: '/manager/dashboard' },
      { name: 'Team', icon: Users, path: '/manager/team' },
      { name: 'Issues', icon: AlertCircle, path: '/manager/issues' },
    ],
    employee: [
      { name: 'Dashboard', icon: LayoutDashboard, path: '/employee/dashboard' },
      { name: 'My Tasks', icon: ClipboardList, path: '/employee/tasks' },
      { name: 'My Visits', icon: Map, path: '/employee/visits' },
      { name: 'My Orders', icon: ShoppingBag, path: '/employee/orders' },
      { name: 'Upload Proof', icon: Camera, path: '/employee/upload-proof' },
      { name: 'Activity', icon: Clock, path: '/employee/activity' },
      { name: 'Notifications', icon: Bell, path: '/employee/notifications' },
      { name: 'My Portfolio', icon: Users, path: '/employee/profile' },
    ],
  };

  const currentMenu = menuItems[role] || [];

  return (
    <aside className="w-64 h-screen bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 flex flex-col fixed left-0 top-0 z-30 transition-colors duration-300">
      <div className="p-8 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-main rounded-2xl flex items-center justify-center text-white shadow-xl rotate-3">
            <ShieldCheck size={24} />
          </div>
          <span className="text-2xl font-black italic tracking-tighter text-gray-900 dark:text-white">TrackForce</span>
        </div>
      </div>
      <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
        {currentMenu.map((item) => (
          <NavLink 
            key={item.path} 
            to={item.path} 
            className={({ isActive }) => `flex items-center space-x-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all ${
              isActive 
                ? 'bg-primary-main/10 text-primary-main shadow-inner dark:bg-primary-main/20' 
                : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <item.icon size={18} /><span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between p-2 rounded-2xl bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-primary-main/10 dark:bg-primary-main/20 flex items-center justify-center text-primary-main font-bold shrink-0">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold text-gray-900 dark:text-white truncate">{user?.name || 'User'}</span>
              <span className="text-xs text-gray-400 capitalize truncate">{role || 'Role'}</span>
            </div>
          </div>
          <button 
            onClick={() => { localStorage.clear(); window.location.href = '/login'; }} 
            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
