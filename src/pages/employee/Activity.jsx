import React, { useState } from 'react';
import { MapPin, ShoppingBag, LogIn, Navigation, Store, Download, Clock, XCircle } from 'lucide-react';

const EmployeeActivity = () => {
  const [showMore, setShowMore] = useState(false);

  const activities = [
    { 
      type: 'CHECKIN', 
      title: 'Current Visit: Big Bazaar Central', 
      time: 'Just Now', 
      desc: 'Processing stock inventory and order placement.', 
      icon: Store, 
      bg: 'bg-red-100 text-red-600' 
    },
    { 
      type: 'TRAVEL', 
      title: 'Navigation End: North Zone Park', 
      time: '12:30 PM', 
      desc: 'Travelled 2.5km via Electronic City route.', 
      icon: Navigation, 
      bg: 'bg-blue-100 text-blue-600' 
    },
    { 
      type: 'ORDER', 
      title: 'Order Placed: Fresh Mart #402', 
      time: '11:15 AM', 
      desc: 'Order value: ₹12,400 (Verified).', 
      icon: ShoppingBag, 
      bg: 'bg-purple-100 text-purple-600' 
    },
    { 
      type: 'LOGIN', 
      title: 'Shift Started', 
      time: '08:00 AM', 
      desc: 'Selfie verification successful at Home Office.', 
      icon: LogIn, 
      bg: 'bg-emerald-100 text-emerald-600' 
    },
    { 
      type: 'VISIT_COMPLETE', 
      title: 'Visit Finished: More Megamart', 
      time: 'Yesterday', 
      desc: 'All 15 SKUs updated and proof uploaded.', 
      icon: Store, 
      bg: 'bg-gray-100 text-gray-600' 
    },
  ];

  const extraActivities = [
    { 
      type: 'ORDER', 
      title: 'Order Placed: Reliance Smart', 
      time: 'Yesterday', 
      desc: 'Order value: ₹8,200 (Pending).', 
      icon: ShoppingBag, 
      bg: 'bg-purple-100 text-purple-600' 
    },
    { 
      type: 'TRAVEL', 
      title: 'Route Completed: South Extension', 
      time: '2 Days Ago', 
      desc: 'Total distance covered: 45km.', 
      icon: Navigation, 
      bg: 'bg-blue-100 text-blue-600' 
    },
    { 
      type: 'LOGIN', 
      title: 'Meeting: Weekly Review', 
      time: '2 Days Ago', 
      desc: 'Discussed North Zone targets.', 
      icon: LogIn, 
      bg: 'bg-emerald-100 text-emerald-600' 
    },
  ];

  const displayActivities = showMore ? [...activities, ...extraActivities] : activities;

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
            Today's Timeline
          </h3>
          <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-indigo-100 dark:border-indigo-500/20 shadow-sm">
            {displayActivities.length} Activities
          </span>
        </div>
        
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
                    <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">{activity.time}</span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{activity.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center pt-8 border-t border-gray-50 dark:border-gray-800/50">
          <button 
            onClick={() => setShowMore(!showMore)}
            className="text-xs font-black text-gray-400 hover:text-indigo-600 transition-all uppercase tracking-[0.2em] flex items-center gap-2 mx-auto group"
          >
            {showMore ? (
              <>
                <XCircle size={16} className="text-red-500 group-hover:scale-110 transition-transform" />
                Close Activity
              </>
            ) : (
              'Load More Activity'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeActivity;
