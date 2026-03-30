import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { MapPin, ShoppingBag, LogIn, Navigation, Store, Download, Clock, XCircle, Activity, Loader2 } from 'lucide-react';
import { getActivities } from '../../services/employee/activityService';
import { useSocket } from '../../context/SocketContext';

const mapActivity = (log) => {
  const logDate = new Date(log.timestamp || log.createdAt);
  const isValidDate = !isNaN(logDate.getTime());
  
  let icon = Activity;
  let bg = 'bg-gray-100 text-gray-600';
  
  if (log.type.includes('visit')) { icon = Store; bg = 'bg-blue-100 text-blue-600'; }
  else if (log.type.includes('order')) { icon = ShoppingBag; bg = 'bg-purple-100 text-purple-600'; }
  else if (log.type.includes('tracking') || log.type.includes('shift')) { icon = Navigation; bg = 'bg-emerald-100 text-emerald-600'; }
  else if (log.type.includes('login') || log.type.includes('auth')) { icon = LogIn; bg = 'bg-indigo-100 text-indigo-600'; }
  else if (log.type.includes('task')) { icon = Activity; bg = 'bg-amber-100 text-amber-600'; }

  return {
    ...log,
    title: log.title || log.type.replace('_', ' ').toUpperCase(),
    time: isValidDate ? logDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '---',
    date: isValidDate ? logDate.toLocaleDateString() : '---',
    desc: log.details,
    icon,
    bg
  };
};

const EmployeeActivity = () => {
  const { setPageLoading } = useOutletContext();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMore, setShowMore] = useState(false);
  const socket = useSocket();

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const data = await getActivities();
        const mapped = data.map(mapActivity);
        setActivities(mapped);
      } catch (err) {
        console.error('Error fetching activities:', err);
      } finally {
        setLoading(false);
        if (setPageLoading) setPageLoading(false);
      }
    };
    fetchActivities();
  }, []);

  // Socket Listener
  useEffect(() => {
    if (socket) {
      const handleNewActivity = (newLog) => {
        console.log('[SOCKET] New activity received:', newLog);
        const mapped = mapActivity(newLog);
        setActivities(prev => [mapped, ...prev]);
      };

      socket.on('activity:new', handleNewActivity);
      return () => socket.off('activity:new', handleNewActivity);
    }
  }, [socket]);

  const displayActivities = showMore ? activities : activities.slice(0, 10);

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in">
      <div className="flex justify-between items-center px-4 md:px-0">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">Activity Log</h1>
          <p className="text-gray-500 font-medium">Your chronological field performance history</p>
        </div>
        <button className="p-3 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-800 text-gray-500 hover:text-indigo-600 transition-all flex items-center gap-2 font-bold text-sm">
          <Download size={18} />
          Export Log
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 p-10">
        <div className="flex items-center justify-between mb-10">
          <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
            <Clock className="text-indigo-600" />
            Timeline History
          </h3>
          <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-indigo-100 dark:border-indigo-500/20 shadow-sm">
            {activities.length} total
          </span>
        </div>
        
        {activities.length > 0 ? (
          <div className="relative space-y-12 before:absolute before:inset-0 before:ml-5 lg:before:ml-6 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-indigo-500 before:via-blue-500 before:to-transparent">
            {displayActivities.map((activity, i) => (
              <div key={i} className="relative flex items-center justify-between gap-6 lg:gap-10 group transition-all duration-300">
                <div className="flex items-center gap-6 lg:gap-10 grow">
                  <div className={`relative flex items-center justify-center shrink-0 w-10 lg:w-12 h-10 lg:h-12 rounded-2xl shadow-lg ring-4 ring-white dark:ring-gray-900 ${activity.bg} z-10 transition-transform group-hover:scale-110`}>
                    <activity.icon size={20} />
                  </div>
                  
                  <div className="grow">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-1">
                      <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors">{activity.title}</h4>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{activity.date}</span>
                        <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">{activity.time}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{activity.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 font-bold">No activities recorded yet.</p>
          </div>
        )}
        
        {activities.length > 10 && (
          <div className="mt-12 text-center pt-8 border-t border-gray-50 dark:border-gray-800/50">
            <button 
              onClick={() => setShowMore(!showMore)}
              className="text-xs font-black text-gray-400 hover:text-indigo-600 transition-all uppercase tracking-[0.2em] flex items-center gap-2 mx-auto group"
            >
              {showMore ? (
                <>
                  <XCircle size={16} className="text-red-500 group-hover:scale-110 transition-transform" />
                  Show Less
                </>
              ) : (
                'Load All Activities'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeActivity;
