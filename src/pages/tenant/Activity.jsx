import React from 'react';
import { Clock, LogIn, MapPin, CheckCircle, Smartphone, AlertTriangle } from 'lucide-react';

const Activity = () => {
  const activities = [
    { id: 1, user: 'John Doe', action: 'Logged In', target: 'Mobile App', time: '2 minutes ago', icon: LogIn, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
    { id: 2, user: 'Jane Smith', action: 'Completed Visit', target: 'Apple Store NYC', time: '15 minutes ago', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
    { id: 3, user: 'Mike Ross', action: 'Tracking Started', target: 'Brooklyn Sector', time: '45 minutes ago', icon: MapPin, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { id: 4, user: 'Sarah Connor', action: 'Failed Login', target: 'Unidentified Device', time: '1 hour ago', icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-50 dark:bg-rose-900/20' },
    { id: 5, user: 'System', action: 'Report Generated', target: 'Monthly Revenue', time: '3 hours ago', icon: Smartphone, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Activity Timeline</h1>
        <p className="text-gray-500 dark:text-gray-400 font-medium">Real-time audit log of all system and field activities.</p>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-8 shadow-sm">
        <div className="flex items-center gap-2 mb-8">
          <Clock size={20} className="text-indigo-600" />
          <h3 className="font-bold text-gray-900 dark:text-white">Live Stream</h3>
        </div>

        <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-indigo-600 before:via-gray-100 before:to-gray-100 dark:before:via-gray-800 dark:before:to-gray-800">
          {activities.map((activity) => (
            <div key={activity.id} className="relative flex items-start group">
              <div className={`flex items-center justify-center w-10 min-w-[40px] h-10 rounded-xl relative z-10 ${activity.bg} ${activity.color} ring-4 ring-white dark:ring-gray-900 transition-all group-hover:scale-110`}>
                <activity.icon size={18} />
              </div>
              <div className="ml-6 pt-1">
                <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
                  <p className="text-sm font-black text-gray-900 dark:text-white">{activity.user}</p>
                  <p className="text-sm font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-0.5 rounded-lg w-fit">{activity.action}</p>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{activity.time}</p>
                </div>
                <p className="text-sm text-gray-500 font-medium mt-1">Target: <span className="text-gray-900 dark:text-white">{activity.target}</span></p>
              </div>
            </div>
          ))}
        </div>

        <button className="w-full mt-12 py-3 bg-gray-50 dark:bg-gray-800 text-gray-500 font-bold rounded-2xl hover:text-indigo-600 transition-all">
          Load More Activity
        </button>
      </div>
    </div>
  );
};

export default Activity;
