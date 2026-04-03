import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Clock, LogIn, MapPin, CheckCircle, Smartphone, AlertTriangle, Camera, User, X, ChevronLeft } from 'lucide-react';

const Activity = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedVisit, setSelectedVisit] = useState(location.state?.selectedVisit || null);

  const activities = [
    { id: 1, user: 'John Doe', action: 'Completed Visit', target: 'Reliance Digital – Brooklyn, NY', time: '10:30 AM', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
    { id: 2, user: 'Jane Smith', action: 'Visit In Progress', target: 'Global Tech Ltd – Queens, NY', time: '12:45 PM', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20' },
    { id: 3, user: 'Mike Ross', action: 'Visit Pending', target: 'Apple Store – Manhattan, NY', time: '02:15 PM', icon: MapPin, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { id: 4, user: 'John Doe', action: 'Logged In', target: 'Mobile App', time: '09:00 AM', icon: LogIn, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
    { id: 5, user: 'Sarah Connor', action: 'Failed Login', target: 'Unidentified Device', time: '08:45 AM', icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-50 dark:bg-rose-900/20' },
    { id: 6, user: 'System', action: 'Report Generated', target: 'Monthly Revenue', time: '07:00 AM', icon: Smartphone, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
  ];

  const statusColor = (status) => {
    if (status === 'Completed') return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
    if (status === 'In Progress') return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
    return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Activity Timeline</h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Real-time audit log of all system and field activities.</p>
        </div>
        <button
          onClick={() => navigate('/tenant/visits')}
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-indigo-600 hover:border-indigo-300 transition-all shadow-sm"
        >
          <ChevronLeft size={16} />
          Back to Visits
        </button>
      </div>

      {/* Selected Visit Highlight Card (shown when navigated from a visit row) */}
      {selectedVisit && (
        <div className="bg-indigo-50 dark:bg-indigo-900/20 border-2 border-indigo-200 dark:border-indigo-800 rounded-3xl p-6 animate-in slide-in-from-top-4 duration-500">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${selectedVisit.type === 'Store'
                  ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600'
                  : 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600'
                }`}>
                {selectedVisit.type === 'Store' ? <Camera size={22} /> : <User size={22} />}
              </div>
              <div>
                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">Selected Visit Details</p>
                <h2 className="text-lg font-black text-gray-900 dark:text-white tracking-tight">{selectedVisit.name}</h2>
                <div className="flex flex-wrap items-center gap-3 mt-1.5">
                  <span className="flex items-center gap-1 text-xs font-bold text-gray-500 dark:text-gray-400">
                    <MapPin size={12} className="text-indigo-400" />
                    {selectedVisit.location}
                  </span>
                  <span className="text-gray-300 dark:text-gray-600">·</span>
                  <span className="flex items-center gap-1 text-xs font-bold text-gray-500 dark:text-gray-400">
                    <User size={12} className="text-indigo-400" />
                    {selectedVisit.executive}
                  </span>
                  <span className="text-gray-300 dark:text-gray-600">·</span>
                  <span className="flex items-center gap-1 text-xs font-bold text-gray-500 dark:text-gray-400">
                    <Clock size={12} className="text-indigo-400" />
                    {selectedVisit.time}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${statusColor(selectedVisit.status)}`}>
                    {selectedVisit.status}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setSelectedVisit(null)}
              className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-white/60 dark:hover:bg-gray-800/60 transition-all shrink-0"
              title="Dismiss"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Activity Log */}
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
