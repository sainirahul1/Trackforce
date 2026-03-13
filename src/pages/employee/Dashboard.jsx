import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Navigation2, Calendar, TrendingUp, Clock, User, ClipboardList, Settings, Map, Bell, Camera, ShoppingBag } from 'lucide-react';

const EmployeeDashboard = () => {
  const [isOnDuty, setIsOnDuty] = useState(false);
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 dark:from-indigo-900 dark:to-indigo-950 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex justify-between items-start">
          <div className="space-y-4">
            <h1 className="text-4xl font-black tracking-tight leading-none">Hello, Abhiram</h1>
            <p className="font-bold text-indigo-100 dark:text-indigo-200">Senior Field Executive | ID: #TX402</p>
          </div>
          <Link 
            to="/employee/profile"
            className="p-4 bg-white/20 backdrop-blur-md rounded-2xl border border-white/20 hover:bg-white/30 transition-all group"
          >
            <User className="group-hover:scale-110 transition-transform" />
          </Link>
        </div>
        <div className="mt-8 p-6 bg-white/10 dark:bg-black/20 backdrop-blur-xl rounded-3xl border border-white/10 w-fit flex items-center space-x-6">
            <span className={`text-sm font-black tracking-widest uppercase ${isOnDuty ? 'text-green-300' : 'text-white/40 dark:text-white/20'}`}>{isOnDuty ? 'on duty' : 'off duty'}</span>
            <button
              onClick={() => setIsOnDuty(!isOnDuty)}
              className={`px-6 py-2 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${isOnDuty
                ? 'bg-white text-indigo-600 hover:scale-105 shadow-xl'
                : 'bg-indigo-600 text-white border border-white/20 hover:bg-indigo-500'
                }`}
            >
              {isOnDuty ? 'End Shift' : 'Start Shift'}
            </button>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl" />
        </div>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {[
          { name: 'Tasks', icon: ClipboardList, path: '/employee/tasks', color: 'bg-indigo-50 text-indigo-600' },
          { name: 'Visits', icon: Map, path: '/employee/visits', color: 'bg-emerald-50 text-emerald-600' },
          { name: 'Orders', icon: ShoppingBag, path: '/employee/orders', color: 'bg-blue-50 text-blue-600' },
          { name: 'Proof', icon: Camera, path: '/employee/upload-proof', color: 'bg-purple-50 text-purple-600' },
          { name: 'Activity', icon: Clock, path: '/employee/activity', color: 'bg-orange-50 text-orange-600' },
          { name: 'Alerts', icon: Bell, path: '/employee/notifications', color: 'bg-gray-50 text-gray-600' },
        ].map((action, i) => (
          <Link 
            key={i}
            to={action.path}
            className="flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group"
          >
            <div className={`p-3 rounded-2xl ${action.color} mb-3 group-hover:scale-110 transition-transform`}>
              <action.icon size={20} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{action.name}</span>
          </Link>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-900 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm">
          <p className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Today's Visits</p>
          <p className="text-4xl font-black text-gray-900 dark:text-white mt-2">12</p>
          <div className="mt-4 flex items-center text-xs font-bold text-success">
            <TrendingUp size={14} className="mr-1" />
            <span>+2 from yesterday</span>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm">
          <p className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Hours Active</p>
          <p className="text-4xl font-black text-gray-900 dark:text-white mt-2">6.5h</p>
          <div className="mt-4 flex items-center text-xs font-bold text-gray-400 dark:text-gray-500">
            <Clock size={14} className="mr-1" />
            <span>Shift started 8:00 AM</span>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm">
          <p className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Active Tasks</p>
          <p className="text-4xl font-black text-gray-900 dark:text-white mt-2">04</p>
          <div className="mt-4 flex items-center text-xs font-bold text-indigo-600">
            <ClipboardList size={14} className="mr-1" />
            <span>2 High Priority</span>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 p-10 shadow-sm">
        <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight mb-8">Next Target Location</h2>
        <div className="flex items-start space-x-6 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border border-gray-100 dark:border-gray-800">
          <div className="w-16 h-16 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-600 shrink-0">
            <MapPin size={32} />
          </div>
          <div className="flex-1">
            <p className="text-xl font-black text-gray-900 dark:text-white">Global Tech Solutions HQ</p>
            <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">123 Business Enclave, North Zone</p>
            <div className="mt-6 flex space-x-3">
              <button className="px-6 py-3 bg-indigo-600 text-white rounded-2xl text-sm font-black shadow-lg shadow-indigo-600/20 hover:scale-105 transition-all">Get Directions</button>
              <button className="px-6 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-2xl text-sm font-black hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">View Details</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
