import React, { useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Bell, MessageSquare, ShieldAlert, Award, ChevronRight, Check } from 'lucide-react';

const Notifications = () => {
  const { setPageLoading } = useOutletContext();
  
  useEffect(() => {
    // Simulate data loading completion
    const timer = setTimeout(() => {
      if (setPageLoading) setPageLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [setPageLoading]);
  const notifications = [
    { id: 1, title: 'New Store Visit Uploaded', desc: 'John Doe uploaded 3 photos for Apple Store Brooklyn.', time: '2 mins ago', type: 'info', icon: Bell },
    { id: 2, title: 'Subscription Renewal', desc: 'Your Enterprise plan will renew on April 18, 2026.', time: '1 hour ago', type: 'warning', icon: ShieldAlert },
    { id: 3, title: 'Team Milestone', desc: 'Your team completed 500 visits this week! Keep it up.', time: '4 hours ago', type: 'success', icon: Award },
    { id: 4, title: 'New Message from Manager', desc: 'Sarah sent a message regarding Sector 45 performance.', time: '1 day ago', type: 'message', icon: MessageSquare },
  ];

  const typeConfig = {
    info: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600',
    warning: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600',
    success: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600',
    message: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600',
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Notification Center</h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Manage alerts and system communications.</p>
        </div>
        <button className="text-sm font-bold text-indigo-600 flex items-center gap-1.5 hover:underline">
          <Check size={16} /> Mark all as read
        </button>
      </div>

      <div className="space-y-3">
        {notifications.map((notif) => (
          <div key={notif.id} className="p-6 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 hover:ring-2 hover:ring-indigo-500 transition-all cursor-pointer group">
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-2xl ${typeConfig[notif.type]} shrink-0`}>
                <notif.icon size={22} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-0.5">
                  <h3 className="font-bold text-gray-900 dark:text-white">{notif.title}</h3>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{notif.time}</span>
                </div>
                <p className="text-sm text-gray-500 font-medium">{notif.desc}</p>
              </div>
              <ChevronRight className="text-gray-300 mt-1 opacity-0 group-hover:opacity-100 transition-all" size={18} />
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center justify-center py-20 opacity-20">
        <Bell size={64} className="text-gray-400 mb-4" />
        <p className="font-black text-lg uppercase tracking-[0.2em] text-gray-500">End of Notifications</p>
      </div>
    </div>
  );
};

export default Notifications;
