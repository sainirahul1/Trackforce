import React, { useState, useEffect } from 'react';
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
import Button from '../components/ui/Button';
import superadminService from '../services/superadminService';
import { useDialog } from '../context/DialogContext';

const mockNotifications = [
  {
    _id: 'mock-1',
    type: 'critical',
    title: 'System Performance Degradation',
    message: 'We are currently investigating reports of increased latency across the tracking APIs. Engineering teams are actively working to resolve the incident and restore normal performance levels.',
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    target: 'Global',
    status: 'Investigating'
  },
  {
    _id: 'mock-2',
    type: 'maintenance',
    title: 'Scheduled Database Upgrade',
    message: 'Routine maintenance and database indexing optimization will be performed this weekend to improve overall query response times. Brief service interruptions (less than 5 minutes) may occur.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    target: 'All Regions',
    status: 'Scheduled'
  },
  {
    _id: 'mock-3',
    type: 'announcement',
    title: 'Introducing Advanced Geofencing V2',
    message: 'We are excited to roll out the highly requested Advanced Geofencing V2! This update brings polygon mapping, tighter integration with the mobile app, and real-time alerts. Check out the documentation for more details.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    target: 'Premium Tiers',
    status: 'Delivered'
  }
];

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [newAlert, setNewAlert] = useState({ title: '', message: '', type: 'announcement' });
  const { showAlert } = useDialog();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await superadminService.getNotifications();
      if (data && data.length > 0) {
        setNotifications(data);
      } else {
        setNotifications(mockNotifications);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setNotifications(mockNotifications);
    } finally {
      setLoading(false);
    }
  };

  const handleBroadcast = async (e) => {
    e.preventDefault();
    try {
      await superadminService.broadcastNotification(newAlert);
      setShowBroadcastModal(false);
      setNewAlert({ title: '', message: '', type: 'announcement' });
      fetchNotifications();
      showAlert('Alert broadcasted successfully.', 'Broadcast Sent', 'success');
    } catch (error) {
      showAlert('Error broadcasting alert: ' + error.message, 'Broadcast Failed', 'error');
    }
  };

  const getIcon = (type) => {
    switch(type) {
      case 'critical': return AlertTriangle;
      case 'maintenance': return Clock;
      default: return Zap;
    }
  };

  const getColor = (type) => {
    switch(type) {
      case 'critical': return 'red';
      case 'maintenance': return 'amber';
      default: return 'indigo';
    }
  };

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
        <Button 
          onClick={() => setShowBroadcastModal(true)}
          variant="primary" 
          className="rounded-2xl py-3 px-6 shadow-xl shadow-indigo-100 dark:shadow-none flex items-center gap-2"
        >
          <Send size={18} />
          <span className="font-bold">Broadcast Alert</span>
        </Button>
      </div>

      {showBroadcastModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-[2.5rem] p-8 space-y-6 border border-gray-100 dark:border-gray-800">
            <h3 className="text-xl font-black text-gray-900 dark:text-white">Broadcast Platforms Alert</h3>
            <form onSubmit={handleBroadcast} className="space-y-4">
              <input 
                required
                className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl text-sm font-bold" 
                placeholder="Alert Title" 
                value={newAlert.title}
                onChange={e => setNewAlert({...newAlert, title: e.target.value})}
              />
              <textarea 
                required
                className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl text-sm font-bold min-h-[120px]" 
                placeholder="Message content..." 
                value={newAlert.message}
                onChange={e => setNewAlert({...newAlert, message: e.target.value})}
              />
              <select 
                className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl text-sm font-bold"
                value={newAlert.type}
                onChange={e => setNewAlert({...newAlert, type: e.target.value})}
              >
                <option value="announcement">Announcement</option>
                <option value="maintenance">Maintenance</option>
                <option value="critical">Critical</option>
              </select>
              <div className="flex gap-3 pt-4">
                <Button type="button" onClick={() => setShowBroadcastModal(false)} variant="outline" className="flex-1 py-4 rounded-xl font-black uppercase tracking-widest text-[10px]">Cancel</Button>
                <Button variant="primary" className="flex-1 py-4 rounded-xl font-black uppercase tracking-widest text-[10px]">Send Broadcast</Button>
              </div>
            </form>
          </div>
        </div>
      )}

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
          {notifications.map((notif) => {
            const Icon = getIcon(notif.type);
            const color = getColor(notif.type);
            return (
              <div key={notif._id} className="p-6 sm:p-8 hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-all group">
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  <div className={`w-14 h-14 rounded-2xl bg-${color}-50 dark:bg-${color}-500/10 text-${color}-600 dark:text-${color}-400 flex items-center justify-center shrink-0 shadow-sm border border-${color}-100 dark:border-${color}-500/20 rotate-3 group-hover:rotate-0 transition-transform duration-300`}>
                    <Icon size={28} />
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <h4 className="text-lg font-black text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors">{notif.title}</h4>
                      <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest bg-${color}-50 dark:bg-${color}-500/10 text-${color}-600 dark:text-${color}-400 border border-${color}-100 dark:border-${color}-500/20`}>
                        {notif.type}
                      </span>
                      <span className="ml-auto text-xs font-bold text-gray-400 italic">{new Date(notif.createdAt).toLocaleDateString()}</span>
                    </div>
                    
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed max-w-3xl">
                      {notif.message}
                    </p>

                    <div className="flex items-center gap-6 pt-2">
                      <div className="flex items-center gap-2">
                        <Users size={14} className="text-gray-400" />
                        <span className="text-xs font-black text-gray-400 uppercase tracking-widest">To: {notif.target || 'Global'}</span>
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
            );
          })}
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
