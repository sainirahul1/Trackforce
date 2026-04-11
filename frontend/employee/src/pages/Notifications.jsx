import React, { useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Bell, MessageSquare, AlertCircle, Info, CheckCircle2, MoreHorizontal, Trash2 } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';

const EmployeeNotifications = () => {
  const { setPageLoading } = useOutletContext();
  const { notifications, isLoading, markAsRead, markAllAsRead, deleteNotification } = useNotifications();

  useEffect(() => {
    if (setPageLoading) setPageLoading(false);
  }, [setPageLoading]);

  const getIcon = (type) => {
    switch (type) {
      case 'alert': return <AlertCircle size={20} />;
      case 'success': return <CheckCircle2 size={20} />;
      case 'message': return <MessageSquare size={20} />;
      case 'task': return <Bell size={20} />;
      default: return <Info size={20} />;
    }
  };

  const getColor = (type) => {

    switch (type) {
      case 'alert': return 'bg-orange-50 text-orange-600';
      case 'success': return 'bg-emerald-50 text-emerald-600';
      case 'message': return 'bg-indigo-50 text-indigo-600';
      case 'task': return 'bg-blue-50 text-blue-600';
      default: return 'bg-gray-100 text-gray-500';
    }
  };

  if (isLoading && notifications.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-500">
      <div className="flex justify-between items-center px-4 md:px-0">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">Notification Hub</h1>
          <p className="text-gray-500 font-medium tracking-tight">Personalized alerts and performance updates</p>
        </div>
        <button 
          onClick={markAllAsRead}
          className="text-[10px] font-black text-indigo-600 hover:scale-105 transition-all underline underline-offset-8 uppercase tracking-widest decoration-2"
        >
          Mark all read
        </button>
      </div>

      <div className="space-y-4">
        {notifications.length > 0 ? (
          notifications.map((n) => (
            <div 
              key={n.id} 
              onClick={() => !n.isRead && markAsRead(n.id)}
              className={`group flex items-start gap-6 p-8 rounded-[2.5rem] border transition-all cursor-pointer ${
                  n.isRead 
                  ? 'bg-white/50 dark:bg-gray-900/30 border-gray-100 dark:border-gray-800 opacity-70' 
                  : 'bg-white dark:bg-gray-900 border-indigo-100 dark:border-indigo-900/40 border-l-4 shadow-sm hover:shadow-md'
              }`}
            >
              <div className={`p-4 rounded-2xl shrink-0 ${getColor(n.type)} transition-transform group-hover:scale-110`}>
                {getIcon(n.type)}
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between flex-wrap gap-2 mb-2">
                  <h3 className={`font-black tracking-tight ${n.isRead ? 'text-gray-600 dark:text-gray-400' : 'text-gray-900 dark:text-white'} text-lg`}>
                      {n.title}
                  </h3>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{n.time}</span>
                    {!n.isRead && <div className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />}
                  </div>
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{n.desc}</p>
              </div>

              <div className="flex flex-col gap-2">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNotification(n.id);
                  }}
                  className="p-2 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                >
                    <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-gray-50/50 dark:bg-gray-800/20 rounded-[3rem] border-2 border-dashed border-gray-100 dark:border-gray-800">
            <Bell size={48} className="mx-auto text-gray-200 mb-4" />
            <h3 className="text-xl font-black text-gray-400 uppercase tracking-widest">Inbox Zero</h3>
            <p className="text-gray-400 text-sm font-medium mt-2">No new notifications for you right now.</p>
          </div>
        )}
      </div>

      {notifications.length > 10 && (
        <div className="text-center pt-8">
          <button className="text-[10px] font-black text-gray-300 uppercase tracking-widest hover:text-indigo-600 transition-colors">
              Load Older Notifications
          </button>
        </div>
      )}
    </div>
  );
};

export default EmployeeNotifications;
