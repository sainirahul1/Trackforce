import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, 
  RefreshCw, 
  CheckCheck, 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle, 
  User, 
  Info, 
  Clock, 
  Trash2 
} from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';

const getNotificationIcon = (type) => {
  switch (type) {
    case 'success': return { icon: CheckCircle2, gradient: 'from-emerald-500 to-teal-500', color: 'text-white' };
    case 'alert': return { icon: AlertTriangle, gradient: 'from-rose-500 to-pink-500', color: 'text-white' };
    case 'task': return { icon: CheckCheck, gradient: 'from-indigo-500 to-violet-500', color: 'text-white' };
    case 'reminder': return { icon: AlertCircle, gradient: 'from-orange-500 to-amber-500', color: 'text-white' };
    case 'account': return { icon: User, gradient: 'from-blue-500 to-cyan-500', color: 'text-white' };
    case 'system': return { icon: Info, gradient: 'from-gray-600 to-slate-600', color: 'text-white' };
    case 'message': return { icon: Info, gradient: 'from-fuchsia-500 to-purple-500', color: 'text-white' };
    default: return { icon: Info, gradient: 'from-gray-500 to-slate-500', color: 'text-white' };
  }
};

const priorityBadge = {
  high: 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20 shadow-sm shadow-rose-500/10',
  medium: 'bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20 shadow-sm shadow-orange-500/10',
  low: 'bg-gray-50 text-gray-500 border-gray-200 dark:bg-gray-500/10 dark:text-gray-400 dark:border-gray-500/20',
};

const NotificationsPage = () => {
  const navigate = useNavigate();
  const { allNotifications, unreadCount, markAsRead, markAllAsRead, deleteNotification, isLoading, refetch } = useNotifications();
  const [filter, setFilter] = React.useState('all');

  const handleNotificationClick = (n) => {
    const id = n.id || n._id;
    if (!n.isRead) markAsRead(id);

    // Smart Redirection Logic
    if (n.metadata?.taskId && n.metadata?.missionType) {
      const { taskId, missionType, store } = n.metadata;
      // Navigate to Log Visit with prefilled data
      navigate(`/employee/visits/log?taskId=${taskId}&type=${missionType}&storeName=${encodeURIComponent(store || '')}`);
    } else if (n.type === 'task') {
      // Fallback for tasks without full metadata - go to task list
      navigate('/employee/tasks');
    }
  };

  const filtered = allNotifications.filter(n => {
    if (filter === 'unread') return !n.isRead;
    if (filter === 'read') return n.isRead;
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto pb-24 animate-in fade-in duration-500 space-y-6">
      
      {/* Premium Header */}
      <div className="relative bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 sm:p-10 border border-gray-100 dark:border-gray-800 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.05)] dark:shadow-none overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />
        
        <div className="flex items-center gap-6 relative z-10">
          <div className="w-16 h-16 rounded-[1.25rem] bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-900/20 dark:to-gray-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-md border border-indigo-100 dark:border-indigo-800/50">
            <Bell size={28} strokeWidth={2} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 border-2 border-white dark:border-gray-900 animate-pulse" />
            )}
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Updates Center</h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">
              {unreadCount > 0 ? `You have ${unreadCount} new alerts waiting` : 'Zero unread notifications. All clear!'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <button
            onClick={refetch}
            className="w-12 h-12 flex items-center justify-center rounded-[1.25rem] bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 text-gray-500 hover:text-indigo-600 hover:bg-white dark:hover:bg-gray-800 transition-all shadow-sm group"
            title="Refresh"
          >
            <RefreshCw size={20} className={`${isLoading ? 'animate-spin text-indigo-500' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
          </button>
          
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-6 h-12 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-[1.25rem] text-xs font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-xl hover:shadow-indigo-500/20 flex items-center gap-2 active:scale-95"
            >
              <CheckCheck size={18} />
              Mark All Read
            </button>
          )}
        </div>
      </div>

      {/* Segmented Filter Control */}
      <div className="flex justify-center md:justify-start">
        <div className="inline-flex p-1.5 bg-gray-50 dark:bg-gray-800/50 rounded-[1.5rem] border border-gray-100 dark:border-gray-800 shadow-inner">
          {[
            { key: 'all', label: 'All Updates', count: allNotifications.length },
            { key: 'unread', label: 'Unread', count: unreadCount },
            { key: 'read', label: 'Archived', count: allNotifications.length - unreadCount },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`relative px-6 py-3 rounded-[1.25rem] text-[11px] font-black uppercase tracking-widest transition-all duration-300
                ${filter === tab.key 
                  ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-white shadow-md border border-gray-100 dark:border-gray-600' 
                  : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-800/50 border border-transparent'}`}
            >
              <span className="relative flex items-center gap-2">
                {tab.label}
                {tab.count > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-[9px] ${filter === tab.key ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}`}>
                    {tab.count}
                  </span>
                )}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Notifications Cards Container */}
      <div className="space-y-4">
        {isLoading ? (
          // Skeletons
          [...Array(4)].map((_, i) => (
            <div key={i} className="flex items-start gap-4 p-6 bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 animate-pulse">
              <div className="w-14 h-14 rounded-[1.25rem] bg-gray-100 dark:bg-gray-800 shrink-0" />
              <div className="flex-1 space-y-3 mt-1">
                <div className="h-4 w-1/3 bg-gray-200 dark:bg-gray-700 rounded-full" />
                <div className="h-3 w-3/4 bg-gray-100 dark:bg-gray-800 rounded-full" />
                <div className="h-2 w-24 bg-gray-100 dark:bg-gray-800 rounded-full" />
              </div>
            </div>
          ))
        ) : filtered.length === 0 ? (
          // Empty State
          <div className="p-16 text-center space-y-6 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2.5rem] shadow-sm">
            <div className="w-24 h-24 bg-gray-50 dark:bg-gray-800/50 rounded-full flex items-center justify-center mx-auto border border-gray-100 dark:border-gray-800">
              <Bell size={40} className="text-gray-300 dark:text-gray-600" />
            </div>
            <div>
              <p className="text-lg font-black text-gray-900 dark:text-white">Nothing to see here</p>
              <p className="text-sm font-medium text-gray-500 mt-1">You are completely caught up with {filter !== 'all' ? filter : 'all'} alerts.</p>
            </div>
          </div>
        ) : (
          filtered.map(n => {
            const { icon: Icon, gradient, color } = getNotificationIcon(n.type);
            return (
              <div
                key={n.id || n._id}
                onClick={() => handleNotificationClick(n)}
                className={`group relative overflow-hidden flex items-start sm:items-center gap-5 p-6 rounded-[2rem] cursor-pointer transition-all duration-300 
                  ${!n.isRead 
                    ? 'bg-white dark:bg-gray-900 border-2 border-indigo-100 dark:border-indigo-500/30 shadow-[0_8px_30px_rgb(0,0,0,0.08)] scale-[1.01]' 
                    : 'bg-white/80 dark:bg-gray-900/80 border border-gray-100 dark:border-gray-800 hover:bg-white dark:hover:bg-gray-900 hover:shadow-lg hover:border-gray-200 dark:hover:border-gray-700'}`}
              >
                
                {/* Active Indicator Strip */}
                {!n.isRead && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-indigo-500 to-violet-500" />}

                {/* Icon Object */}
                <div className={`w-14 h-14shrink-0 flex items-center justify-center rounded-[1.25rem] bg-gradient-to-br ${gradient} ${color} shadow-lg shrink-0 transform transition-transform group-hover:scale-110 duration-300`}>
                  <Icon size={24} strokeWidth={2} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pr-10">
                  <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                    <p className={`text-[15px] leading-tight ${!n.isRead ? 'font-black text-gray-900 dark:text-white' : 'font-bold text-gray-700 dark:text-gray-300'}`}>
                      {n.title}
                    </p>
                    {n.priority && (
                      <span className={`px-2 py-0.5 rounded-md border text-[9px] font-black uppercase tracking-widest ${priorityBadge[n.priority] || priorityBadge.low}`}>
                        {n.priority}
                      </span>
                    )}
                    {!n.isRead && <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400 text-[9px] font-black uppercase tracking-widest">New</span>}
                  </div>
                  
                  <p className={`text-sm leading-relaxed mb-2 ${!n.isRead ? 'text-gray-600 dark:text-gray-300' : 'text-gray-500 dark:text-gray-400'}`}>
                    {n.desc}
                  </p>
                  
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    <Clock size={12} />
                    <span>{n.time}</span>
                  </div>
                </div>

                {/* Actions */}
                <button
                  onClick={(e) => { e.stopPropagation(); deleteNotification(n.id || n._id); }}
                  className="absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100"
                  title="Remove"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
