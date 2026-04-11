import React from 'react';
import { Bell, CheckCheck, Trash2, AlertTriangle, CheckCircle2, Info, AlertCircle, User, RefreshCw } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';

const getNotificationIcon = (type) => {
  switch (type) {
    case 'success': return { icon: CheckCircle2, color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400' };
    case 'alert': return { icon: AlertTriangle, color: 'bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400' };
    case 'task': return { icon: CheckCheck, color: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400' };
    case 'reminder': return { icon: AlertCircle, color: 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400' };
    case 'account': return { icon: User, color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' };
    case 'system': return { icon: Info, color: 'bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-400' };
    case 'message': return { icon: Info, color: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400' };
    default: return { icon: Info, color: 'bg-gray-50 text-gray-600' };
  }
};

const priorityBadge = {
  high: 'bg-rose-50 text-rose-600 border border-rose-100 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800/50',
  medium: 'bg-orange-50 text-orange-600 border border-orange-100 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800/50',
  low: 'bg-gray-50 text-gray-500 border border-gray-100 dark:bg-gray-800/50 dark:text-gray-400 dark:border-gray-700',
};

const NotificationsPage = () => {
  const { allNotifications, unreadCount, markAsRead, markAllAsRead, deleteNotification, isLoading, refetch } = useNotifications();
  const [filter, setFilter] = React.useState('all');

  const filtered = allNotifications.filter(n => {
    if (filter === 'unread') return !n.isRead;
    if (filter === 'read') return n.isRead;
    return true;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 dark:bg-indigo-900/5 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />
        <div className="flex items-center gap-6 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800/50 shadow-inner">
            <Bell size={32} strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Notifications</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium">
              {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <button
            onClick={refetch}
            className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-800 text-gray-400 hover:text-indigo-600 transition-colors"
            title="Refresh"
          >
            <RefreshCw size={18} className={isLoading ? 'animate-spin text-indigo-500' : ''} />
          </button>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 dark:shadow-none"
            >
              <CheckCheck size={16} />
              Mark All Read
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 bg-white dark:bg-gray-900 p-2 rounded-2xl border border-gray-100 dark:border-gray-800 w-max shadow-sm">
        {[
          { key: 'all', label: `All (${allNotifications.length})` },
          { key: 'unread', label: `Unread (${unreadCount})` },
          { key: 'read', label: 'Read' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === tab.key ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-start gap-4 p-4 bg-gray-50/50 dark:bg-gray-800/20 rounded-2xl animate-pulse">
                <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-gray-700 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                  <div className="h-3 w-80 bg-gray-100 dark:bg-gray-800 rounded-lg" />
                  <div className="h-2 w-24 bg-gray-100 dark:bg-gray-800 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center space-y-4">
            <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-3xl flex items-center justify-center mx-auto">
              <Bell size={36} className="text-gray-200 dark:text-gray-700" />
            </div>
            <p className="text-sm font-bold text-gray-400">No {filter !== 'all' ? filter : ''} notifications</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50 dark:divide-gray-800">
            {filtered.map(n => {
              const { icon: Icon, color } = getNotificationIcon(n.type);
              return (
                <div
                  key={n.id || n._id}
                  onClick={() => markAsRead(n.id || n._id)}
                  className={`flex items-start gap-4 p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors group ${!n.isRead ? 'bg-indigo-50/20 dark:bg-indigo-900/5' : ''}`}
                >
                  <div className={`p-2.5 rounded-xl shrink-0 ${color}`}>
                    <Icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3 flex-wrap">
                        <p className={`font-bold ${!n.isRead ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>{n.title}</p>
                        {n.priority && (
                          <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${priorityBadge[n.priority] || priorityBadge.low}`}>
                            {n.priority}
                          </span>
                        )}
                        {!n.isRead && <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />}
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteNotification(n.id || n._id); }}
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/20 text-gray-300 hover:text-rose-500 transition-all shrink-0"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{n.desc}</p>
                    <span className="text-[10px] text-gray-400 mt-2 block font-medium">{n.time}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
