import React, { useState } from 'react';
import { 
  Bell, 
  Send, 
  Trash2, 
  AlertTriangle, 
  Info, 
  CheckCircle, 
  Search, 
  Calendar,
  Zap,
  Clock,
  ExternalLink,
  Users
} from 'lucide-react';
import Button from '../../components/Button';

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Scheduled System Maintenance',
      message: 'TrackForce will be undergoing scheduled maintenance on Sunday, March 22nd from 02:00 to 04:00 UTC.',
      type: 'maintenance',
      target: 'All Tenants',
      date: 'Mar 15, 2026',
      status: 'Sent',
      icon: Clock,
      color: 'amber'
    },
    {
      id: 2,
      title: 'New Feature Release: AI Route Optimization',
      message: 'We are excited to announce the launch of AI-powered route optimization for all Premium and Enterprise tenants.',
      type: 'announcement',
      target: 'Premium & Enterprise',
      date: 'Mar 12, 2026',
      status: 'Sent',
      icon: Zap,
      color: 'indigo'
    },
    {
      id: 3,
      title: 'Critical Security Update',
      message: 'Please advise all tenant admins to update their mobile apps to the latest version (v2.4.5) to ensure GPS integrity.',
      type: 'critical',
      target: 'All Tenants',
      date: 'Mar 10, 2026',
      status: 'Sent',
      icon: AlertTriangle,
      color: 'red'
    }
  ]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
            <Bell size={32} className="text-indigo-600" />
            Global Notifications
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium italic">Broadcast platform alerts, announcements, and maintenance logs to all organizations.</p>
        </div>
        <Button variant="primary" className="rounded-2xl py-3 px-6 shadow-xl shadow-indigo-100 dark:shadow-none flex items-center gap-2">
          <Send size={18} />
          <span className="font-bold">Broadcast Alert</span>
        </Button>
      </div>

      {/* Stats Mini Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Broadcasts', value: '42', icon: Send, color: 'indigo' },
          { label: 'Total Recipients', value: '14.2k', icon: Users, color: 'blue' },
          { label: 'Delivery Rate', value: '99.8%', icon: CheckCircle, color: 'emerald' },
          { label: 'Scheduled', value: '3', icon: Calendar, color: 'amber' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-4">
            <div className={`p-2.5 rounded-xl bg-${stat.color}-50 dark:bg-${stat.color}-500/10 text-${stat.color}-600 dark:text-${stat.color}-400`}>
              <stat.icon size={18} />
            </div>
            <div>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-lg font-black text-gray-900 dark:text-white">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Notifications List */}
      <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/20">
          <div className="flex items-center gap-4">
            <h3 className="font-black text-gray-900 dark:text-white uppercase tracking-widest text-xs">Broadcast History</h3>
            <div className="flex bg-white dark:bg-gray-900 p-1 rounded-xl border border-gray-200 dark:border-gray-700">
              {['All', 'Critical', 'Alerts'].map(type => (
                <button key={type} className="px-3 py-1 text-[10px] font-black uppercase rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  {type}
                </button>
              ))}
            </div>
          </div>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search broadcasts..." className="pl-9 pr-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold outline-none w-48 sm:w-64" />
          </div>
        </div>

        <div className="divide-y divide-gray-50 dark:divide-gray-800">
          {notifications.map((notif) => (
            <div key={notif.id} className="p-6 sm:p-8 hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-all group">
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                <div className={`w-14 h-14 rounded-2xl bg-${notif.color}-50 dark:bg-${notif.color}-500/10 text-${notif.color}-600 dark:text-${notif.color}-400 flex items-center justify-center shrink-0 shadow-sm border border-${notif.color}-100 dark:border-${notif.color}-500/20 rotate-3 group-hover:rotate-0 transition-transform duration-300`}>
                  <notif.icon size={28} />
                </div>
                
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <h4 className="text-lg font-black text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors">{notif.title}</h4>
                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest bg-${notif.color}-50 dark:bg-${notif.color}-500/10 text-${notif.color}-600 dark:text-${notif.color}-400 border border-${notif.color}-100 dark:border-${notif.color}-500/20`}>
                      {notif.type}
                    </span>
                    <span className="ml-auto text-xs font-bold text-gray-400 italic">{notif.date}</span>
                  </div>
                  
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed max-w-3xl">
                    {notif.message}
                  </p>

                  <div className="flex items-center gap-6 pt-2">
                    <div className="flex items-center gap-2">
                      <Users size={14} className="text-gray-400" />
                      <span className="text-xs font-black text-gray-400 uppercase tracking-widest">To: {notif.target}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                      <span className="text-xs font-black text-emerald-600 uppercase tracking-widest">{notif.status}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start">
                  <button className="p-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-all shadow-sm">
                    <ExternalLink size={18} />
                  </button>
                  <button className="p-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all shadow-sm">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-8 bg-gray-50 dark:bg-gray-800/20 flex flex-col items-center justify-center text-center space-y-4 border-t border-gray-50 dark:border-gray-800">
          <div className="p-4 bg-white dark:bg-gray-900 rounded-full shadow-sm">
            <Info size={24} className="text-gray-400" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest italic">Viewing Last 10 Broadcasts</p>
            <p className="text-xs text-gray-400 font-medium tracking-tight">Only the most recent alerts are shown in quick view. Visit logs for more details.</p>
          </div>
          <Button variant="outline" className="rounded-xl px-12 py-2.5 text-xs font-black uppercase tracking-widest border-gray-200 hover:border-indigo-500 transition-colors">
            Load More logs
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
