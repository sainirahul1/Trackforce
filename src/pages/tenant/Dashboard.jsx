import React from 'react';
import { Users, ClipboardList, Activity, Calendar } from 'lucide-react';
import DashboardCard from '../../components/DashboardCard';

const TenantDashboard = () => {
  const stats = [
    { title: 'Total Staff', value: '450', icon: Users, color: 'text-blue-600', trend: 'up', trendValue: '12' },
    { title: 'Active Visits', value: '128', icon: ClipboardList, color: 'text-indigo-600', trend: 'up', trendValue: '8' },
    { title: 'Avg. Efficiency', value: '94%', icon: Activity, color: 'text-emerald-600', trend: 'up', trendValue: '5' },
  ];

  const recentActivities = [
    { id: 1, user: 'Abhiram', action: 'Completed visit', target: 'Global Tech HQ', time: '2 mins ago', type: 'success' },
    { id: 2, user: 'rahul', action: 'Started shift', target: 'North Zone', time: '15 mins ago', type: 'info' },
    { id: 3, user: 'Robert', action: 'Reported issue', target: 'Device Malfunction', time: '1 hour ago', type: 'error' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Executive Overview</h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">Real-time operational intelligence and fleet performance</p>
        </div>
        <div className="hidden md:flex items-center space-x-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <Calendar size={16} className="text-gray-400 dark:text-gray-500" />
          <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
            {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((s, i) => (
          <DashboardCard key={i} {...s} colorClass={s.color} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Visit Velocity Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-[2rem] border border-gray-100 dark:border-gray-700 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black text-gray-900 dark:text-white">Visit Velocity</h2>
            <select className="bg-gray-50 dark:bg-gray-700 border-none rounded-xl text-xs font-bold px-3 py-2 outline-none dark:text-gray-300">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-64 flex items-end justify-between space-x-2">
            {[40, 70, 55, 90, 65, 80, 95].map((height, i) => (
              <div key={i} className="flex-1 flex flex-col items-center group">
                <div
                  className="w-full bg-indigo-50 dark:bg-indigo-900/20 group-hover:bg-indigo-500 transition-all rounded-t-xl relative"
                  style={{ height: `${height}%` }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {height}%
                  </div>
                </div>
                <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 mt-3">Day {i + 1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Live Activity Feed */}
        <div className="bg-white dark:bg-gray-800 rounded-[2rem] border border-gray-100 dark:border-gray-700 p-8 shadow-sm">
          <h2 className="text-xl font-black text-gray-900 dark:text-white mb-8">Live Activity Feed</h2>
          <div className="space-y-6">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-4">
                <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${
                  activity.type === 'success' ? 'bg-emerald-500' :
                  activity.type === 'info' ? 'bg-blue-500' : 'bg-rose-500'
                }`} />
                <div className="flex-1">
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    <span className="font-bold">{activity.user}</span>
                    <span className="text-gray-500 dark:text-gray-400 mx-1">{activity.action}</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">{activity.target}</span>
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 font-medium mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-3 rounded-2xl bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm font-bold hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
            View All Operations
          </button>
        </div>
      </div>
    </div>
  );
};

export default TenantDashboard;
