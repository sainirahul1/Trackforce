import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Building2, ClipboardList, Map, Settings, LogOut, ShieldCheck, Bell, ShoppingBag, Camera, Clock, AlertCircle, ChevronLeft, ChevronRight, Menu, Activity, User, Lock, CreditCard } from 'lucide-react';
import ThemeToggle from '../ui/ThemeToggle';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ role, user, isCollapsed, onToggle }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const menuItems = {
    superadmin: [
      { name: 'Dashboard', icon: LayoutDashboard, path: '/superadmin/dashboard' },
      { name: 'Organizations', icon: Building2, path: '/superadmin/companies' },
      { name: 'Subscriptions', icon: ShieldCheck, path: '/superadmin/subscriptions' },
      { name: 'Roles & Access', icon: Lock, path: '/superadmin/roles' },
      { name: 'System Alerts', icon: Bell, path: '/superadmin/notifications' },
      { name: 'Platform Settings', icon: Settings, path: '/superadmin/settings' },
      { name: 'Support Issues', icon: AlertCircle, path: '/superadmin/issues' },
      { name: 'Profile', icon: User, path: '/superadmin/profile' },
    ],
    tenant: [
      { name: 'Dashboard', icon: LayoutDashboard, path: '/tenant/dashboard' },
      { name: 'Employees', icon: Users, path: '/tenant/employees' },
      { name: 'Live Tracking', icon: Map, path: '/tenant/live' },
      { name: 'Visits', icon: Camera, path: '/tenant/visits' },
      { name: 'Orders & Revenue', icon: ShoppingBag, path: '/tenant/orders' },
      { name: 'Analytics', icon: Activity, path: '/tenant/analytics' },
      { name: 'Activity Log', icon: Clock, path: '/tenant/activity' },
      { name: 'Subscription', icon: CreditCard, path: '/tenant/subscription' },
      { name: 'Profile', icon: User, path: '/tenant/profile' },
      { name: 'Notifications', icon: Bell, path: '/tenant/notifications' },
      { name: 'Settings', icon: Settings, path: '/tenant/settings' },
    ],
    manager: [
      { name: 'Dashboard', icon: LayoutDashboard, path: '/manager/analytics' },
      { name: 'Live Tracking', icon: Map, path: '/manager/live' },
      { name: 'Mission Board', icon: ClipboardList, path: '/manager/tasks' },
      { name: 'Visits', icon: Camera, path: '/manager/visits' },
      { name: 'Inventory/Orders', icon: ShoppingBag, path: '/manager/inventory' },
      // { name: 'Analytics', icon: Activity, path: '/manager/analytics' },
      { name: 'Team', icon: Users, path: '/manager/team' },
      { name: 'Support Issues', icon: AlertCircle, path: '/manager/issues' },
      { name: 'Activity Log', icon: Clock, path: '/manager/activity' },
      { name: 'Profile', icon: User, path: '/manager/profile' },
    ],
    employee: [
      { name: 'Dashboard', icon: LayoutDashboard, path: '/employee/dashboard' },
      { name: 'My Tasks', icon: ClipboardList, path: '/employee/tasks' },
      { name: 'My Visits', icon: Map, path: '/employee/visits' },
      { name: 'My Orders', icon: ShoppingBag, path: '/employee/orders' },
      { name: 'Activity', icon: Clock, path: '/employee/activity' },
      { name: 'My Profile', icon: Users, path: '/employee/profile' },
      { name: 'Support Issues', icon: AlertCircle, path: '/employee/issues' },
    ],
  };

  const currentMenu = menuItems[role] || [];

  return (
    <aside className={`${isCollapsed ? 'w-20' : 'w-64'} h-screen bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 flex flex-col fixed left-0 top-0 z-[110] transition-all duration-300 ease-in-out`}>
      <div className={`p-6 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} border-b border-gray-50 dark:border-gray-800`}>
        {!isCollapsed && (
          <div className="flex items-center gap-2.5 animate-in fade-in duration-300">
            <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl rotate-3 shrink-0">
              <ShieldCheck size={24} />
            </div>
            <span className="text-[22px] font-black italic tracking-tighter text-gray-900 dark:text-white pt-0.5">TrackForce</span>
          </div>
        )}
        <button
          onClick={onToggle}
          className="p-2 rounded-xl text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-indigo-600 transition-all"
        >
          {isCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
        {currentMenu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3 px-4'} py-3 rounded-2xl font-bold text-sm transition-all relative group ${isActive
              ? 'bg-indigo-50 text-indigo-600 shadow-inner dark:bg-indigo-900/20'
              : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
              }`}
          >
            <item.icon size={20} className={isCollapsed ? 'shrink-0' : ''} />
            {!isCollapsed && <span className="animate-in slide-in-from-left-2 duration-300">{item.name}</span>}
            {isCollapsed && (
              <div className="absolute left-full ml-4 px-3 py-2 bg-gray-900 text-white text-xs font-bold rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                {item.name}
              </div>
            )}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-100 dark:border-gray-800">
        <div className={`flex items-center ${isCollapsed ? 'flex-col gap-4' : 'justify-between'} p-2 rounded-2xl bg-gray-50 dark:bg-gray-800/50`}>
          <div className={`flex items-center ${isCollapsed ? 'flex-col text-center' : 'space-x-3'} overflow-hidden`}>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 font-bold shrink-0 overflow-hidden relative">
              {user?.profile?.profileImage ? (
                <img 
                  src={user.profile.profileImage.startsWith('data:') ? user.profile.profileImage : (() => {
                    let url = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
                    url = url.replace(/\/$/, '');
                    if (!url.endsWith('/api')) url += '/api';
                    return `${url.replace('/api', '')}${user.profile.profileImage}`;
                  })()} 
                  alt="DP" 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 font-bold">
                  {user?.name?.charAt(0) || <User size={20} />}
                </div>
              )}
            </div>
            {!isCollapsed && (
              <div className="flex flex-col min-w-0 animate-in fade-in duration-300">
                <span className="text-sm font-bold text-gray-900 dark:text-white truncate">{user?.name || 'User'}</span>
                <span className="text-xs text-gray-400 capitalize truncate">{role || 'Role'}</span>
              </div>
            )}
          </div>
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="p-2 text-gray-400 hover:text-red-600 transition-colors shrink-0"
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
