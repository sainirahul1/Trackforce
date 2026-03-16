import React from 'react';
import { Bell, MessageSquare, AlertCircle, Info, CheckCircle2, MoreHorizontal } from 'lucide-react';

const EmployeeNotifications = () => {
  const notifications = [
    { 
        id: 1, 
        title: 'New Route Assigned', 
        desc: 'Manager Ananya has assigned North Zone 04 to you.', 
        time: '5m ago', 
        type: 'alert', 
        isRead: false,
        importance: 'high'
    },
    { 
        id: 2, 
        title: 'Order Confirmed', 
        desc: 'Order #ORD-892 for Reliance Fresh is now verified.', 
        time: '1h ago', 
        type: 'success', 
        isRead: false,
        importance: 'high'
    },
    { 
        id: 3, 
        title: 'Selfie Required', 
        desc: 'Please upload a selfie to verify your current visit.', 
        time: '12m ago', 
        type: 'alert', 
        isRead: false,
        importance: 'high'
    },
  ];

  const highImportanceOnly = notifications.filter(n => n.importance === 'high');

  const getIcon = (type) => {
    switch (type) {
      case 'alert': return <AlertCircle size={20} />;
      case 'success': return <CheckCircle2 size={20} />;
      case 'message': return <MessageSquare size={20} />;
      default: return <Info size={20} />;
    }
  };

  const getColor = (type) => {
    switch (type) {
      case 'alert': return 'bg-orange-50 text-orange-600';
      case 'success': return 'bg-emerald-50 text-emerald-600';
      case 'message': return 'bg-indigo-50 text-indigo-600';
      default: return 'bg-gray-100 text-gray-500';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div className="flex justify-between items-center px-4 md:px-0">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">Notification Hub</h1>
          <p className="text-gray-500 font-medium">Stay updated with team alerts and task assignments</p>
        </div>
        <button className="text-sm font-bold text-indigo-600 hover:scale-105 transition-all underline underline-offset-8 uppercase tracking-widest decoration-2">
            Mark all read
        </button>
      </div>

      <div className="space-y-4">
        {highImportanceOnly.map((n) => (
          <div 
            key={n.id} 
            className={`flex items-start gap-6 p-8 rounded-[2.5rem] border transition-all hover:translate-x-1 ${
                n.isRead 
                ? 'bg-white dark:bg-gray-900/50 border-gray-100 dark:border-gray-800' 
                : 'bg-white dark:bg-gray-900 border-indigo-100 border-l-4 shadow-md'
            }`}
          >
            <div className={`p-4 rounded-2xl shrink-0 ${getColor(n.type)}`}>
              {getIcon(n.type)}
            </div>
            
            <div className="flex-1">
              <div className="flex justify-between flex-wrap gap-2 mb-2">
                <h3 className={`font-black tracking-tight ${n.isRead ? 'text-gray-700 dark:text-gray-300' : 'text-gray-900 dark:text-white'} text-lg`}>
                    {n.title}
                </h3>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{n.time}</span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">{n.desc}</p>
            </div>

            <button className="p-2 text-gray-300 hover:text-gray-600 transition-colors">
                <MoreHorizontal size={20} />
            </button>
          </div>
        ))}
      </div>

      <div className="text-center pt-8">
        <button className="text-sm font-black text-gray-300 uppercase tracking-widest hover:text-gray-500 transition-colors">
            Load Older Notifications
        </button>
      </div>
    </div>
  );
};

export default EmployeeNotifications;
