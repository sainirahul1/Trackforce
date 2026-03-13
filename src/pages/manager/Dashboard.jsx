import React from 'react';
import { Users, MapPin, Activity, ClipboardList, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import DashboardCard from '../../components/DashboardCard';

const ManagerDashboard = () => {
  const stats = [
    { title: 'Team Size', value: '12 Users', icon: Users, color: 'text-blue-600', trend: 'up', trendValue: '2' },
    { title: 'In Field', value: '8', icon: MapPin, color: 'text-emerald-600', trend: 'up', trendValue: '5' },
    { title: 'Visits Today', value: '42', icon: ClipboardList, color: 'text-indigo-600', trend: 'up', trendValue: '12' },
  ];

  const criticalUpdates = [
    { id: 1, type: 'alert', message: 'Device offline: John Doe', time: '5 mins ago', icon: AlertCircle, color: 'text-rose-500', bg: 'bg-rose-50' },
    { id: 2, type: 'success', message: 'Target met: Jane Smith', time: '1 hour ago', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { id: 3, type: 'info', message: 'New zone assigned: North', time: '2 hours ago', icon: Activity, color: 'text-blue-500', bg: 'bg-blue-50' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Team Overview</h1>
        <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">Operational monitoring and performance tracking for your unit</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((s, i) => (
          <DashboardCard key={i} {...s} colorClass={s.color} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black text-gray-900 dark:text-white">Performance Snapshot</h2>
            <div className="flex space-x-2">
              <span className="flex items-center text-xs font-bold text-gray-400 dark:text-gray-500">
                <div className="w-2 h-2 rounded-full bg-blue-500 mr-2" /> Visits
              </span>
            </div>
          </div>
          <div className="h-64 flex items-end justify-between space-x-4">
            {[65, 45, 85, 55, 95, 75, 50].map((height, i) => (
              <div key={i} className="flex-1 flex flex-col items-center group">
                <div 
                  className="w-full bg-blue-50 dark:bg-blue-900/20 group-hover:bg-blue-500 transition-all rounded-t-xl relative"
                  style={{ height: `${height}%` }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {height}
                  </div>
                </div>
                <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 mt-3">{"MTWTFSS"[i]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 p-8 shadow-sm">
          <h2 className="text-xl font-black text-gray-900 dark:text-white mb-8">Priority Updates</h2>
          <div className="space-y-6">
            {criticalUpdates.map((update) => (
              <div key={update.id} className="flex items-start space-x-4">
                <div className={`p-2 rounded-lg ${update.bg} ${update.color} dark:bg-opacity-10`}>
                  <update.icon size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{update.message}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 font-medium mt-1">{update.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm font-bold hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            View All Logs
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
