import React from 'react';
import { 
  Clock, LogIn, MapPin, ClipboardList, ShoppingBag, 
  CheckCircle2, AlertCircle, Search, Filter, Calendar,
  ChevronRight, ArrowRight, Activity
} from 'lucide-react';

/**
 * ActivityLog Component
 * Detailed operational history and team timeline for the Manager Portal.
 */
const ManagerActivityLog = () => {
  const activities = [
    { id: 1, type: 'visit', title: 'Store Visit Completed', executive: 'John Doe', desc: 'Global Tech Solutions HQ - Verified', time: '10:45 AM', status: 'success' },
    { id: 2, type: 'order', title: 'New Order Collected', executive: 'Sarah Wilson', desc: 'ORD-5522 - ₹8,900', time: '11:15 AM', status: 'info' },
    { id: 3, type: 'login', title: 'Shift Started', executive: 'Mike Johnson', desc: 'Sector 4 - GPS Active', time: '08:30 AM', status: 'default' },
    { id: 4, type: 'alert', title: 'Device Offline', executive: 'Jane Smith', desc: 'Signal lost for 15 mins', time: '09:12 AM', status: 'warning' },
    { id: 5, type: 'task', title: 'Task Assigned', executive: 'John Doe', desc: 'TSK-102: Onboard New Supplier', time: '09:00 AM', status: 'info' },
  ];

  const getIcon = (type) => {
    switch (type) {
      case 'visit': return <ClipboardList size={18} />;
      case 'order': return <ShoppingBag size={18} />;
      case 'login': return <LogIn size={18} />;
      case 'alert': return <AlertCircle size={18} />;
      default: return <Activity size={18} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:border-emerald-500/20';
      case 'warning': return 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-500/10 dark:border-rose-500/20';
      case 'info': return 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-500/10 dark:border-blue-500/20';
      default: return 'bg-gray-50 text-gray-600 border-gray-100 dark:bg-gray-800 dark:border-gray-700';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Operational Timeline</h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">Immutable record of all field activities and system events</p>
        </div>
        <div className="flex items-center gap-3">
           <button className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl font-black text-sm hover:shadow-xl transition-all">
             <Calendar size={18} className="text-gray-400" />
             <span>SELECT RANGE</span>
           </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden flex flex-col">
        {/* Log Filters */}
        <div className="p-8 border-b border-gray-50 dark:border-gray-800 flex flex-wrap items-center justify-between gap-4">
           <div className="flex items-center gap-4">
              <div className="relative">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                 <input 
                   type="text" 
                   placeholder="Search logs..." 
                   className="pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl text-sm outline-none w-64 focus:ring-2 focus:ring-indigo-500/10"
                 />
              </div>
              <button className="p-2.5 bg-gray-50 dark:bg-gray-800 rounded-2xl text-gray-400 hover:text-indigo-600 transition-all">
                 <Filter size={18} />
              </button>
           </div>
           
           <div className="flex gap-2">
              {['All', 'Visits', 'Orders', 'Alerts'].map((f) => (
                <button key={f} className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${f === 'All' ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900' : 'bg-gray-50 text-gray-400 hover:bg-gray-100 dark:bg-gray-800'}`}>
                  {f}
                </button>
              ))}
           </div>
        </div>

        {/* Timeline List */}
        <div className="p-8 space-y-0">
           {activities.map((item, i) => (
             <div key={item.id} className="group flex gap-8 relative">
                {/* Timeline Line */}
                {i !== activities.length - 1 && (
                  <div className="absolute left-[27px] top-[60px] bottom-[-40px] w-px bg-gray-100 dark:bg-gray-800 group-hover:bg-indigo-200 transition-colors" />
                )}

                {/* Icon Circle */}
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border z-10 transition-all group-hover:scale-110 group-hover:rotate-3 ${getStatusColor(item.status)}`}>
                   {getIcon(item.type)}
                </div>

                {/* Content Card */}
                <div className="flex-1 pb-12">
                   <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-3">
                        <h4 className="text-lg font-black text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                          {item.title}
                        </h4>
                        <span className="px-2 py-0.5 bg-gray-50 dark:bg-gray-800 rounded-md text-[9px] font-black text-gray-400 uppercase tracking-widest">
                          {item.executive}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-400">
                        <Clock size={12} />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">{item.time}</span>
                      </div>
                   </div>
                   <p className="text-sm font-bold text-gray-500 dark:text-gray-400 leading-relaxed max-w-2xl">
                     {item.desc}
                   </p>
                   
                   <div className="mt-4 flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all">
                        View Details <ChevronRight size={14} />
                      </button>
                      <button className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-gray-600">
                        Map Reference
                      </button>
                   </div>
                </div>
             </div>
           ))}
        </div>

        {/* Footer Persistence */}
        <div className="p-8 bg-gray-50/50 dark:bg-gray-900/50 border-t border-gray-50 dark:border-gray-800 flex items-center justify-center">
           <button className="flex items-center gap-2 text-xs font-black text-indigo-600 uppercase tracking-[0.2em] hover:scale-105 transition-all">
             Load More History <Activity size={16} className="animate-pulse" />
           </button>
        </div>
      </div>
    </div>
  );
};

export default ManagerActivityLog;
