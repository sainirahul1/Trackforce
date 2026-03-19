import React, { useState } from 'react';
import { 
  Clock, LogIn, MapPin, ClipboardList, ShoppingBag, 
  AlertCircle, Search, Filter, Calendar,
  ChevronRight, Activity, Users, Bell, Navigation, Phone, 
  Map, CheckCircle, XCircle, TrendingUp, MoreVertical,
  Mail, MessageSquare, X, ArrowLeft
} from 'lucide-react';

const ManagerActivityLog = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExecutive, setSelectedExecutive] = useState(null);
  const [selectedDateFilter, setSelectedDateFilter] = useState('Today (17 Mar)');
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);

  const executives = [
    { id: 1, name: 'John Doe', role: 'Senior Executive', status: 'Active', location: 'Downtown Sector', lastActive: '2m ago', avatar: 'JD', statusColor: 'bg-emerald-500' },
    { id: 2, name: 'Sarah Wilson', role: 'Sales Lead', status: 'Active', location: 'North District', lastActive: '5m ago', avatar: 'SW', statusColor: 'bg-emerald-500' },
    { id: 3, name: 'Mike Johnson', role: 'Executive', status: 'Offline', location: 'West End', lastActive: '2h ago', avatar: 'MJ', statusColor: 'bg-gray-400' },
    { id: 4, name: 'Jane Smith', role: 'Executive', status: 'Busy', location: 'Client Meeting', lastActive: '10m ago', avatar: 'JS', statusColor: 'bg-amber-500' },
    { id: 5, name: 'Robert Fox', role: 'Junior Exec', status: 'Active', location: 'East Side Mall', lastActive: '1m ago', avatar: 'RF', statusColor: 'bg-emerald-500' },
  ];

  const filteredExecutives = executives.filter(exec => 
    exec.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    exec.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const notifications = [
    { id: 1, title: 'Client Escalation', message: 'VIP Client XYZ requested immediate call back regarding order delay.', time: '10 mins ago', type: 'urgent' },
    { id: 2, title: 'Target Reached', message: 'Sarah Wilson completed daily visits target early.', time: '1 hour ago', type: 'success' },
    { id: 3, title: 'Route Deviation', message: 'Mike Johnson deviated from assigned route by 5km.', time: '2 hours ago', type: 'warning' },
  ];

  const activities = [
    { id: 1, type: 'alert', title: 'Route Deviation Detected', executive: 'Mike Johnson', desc: 'Deviated >5km from assigned daily route in West End.', time: '10:45 AM', status: 'warning' },
    { id: 2, type: 'visit', title: 'Store Visit Completed', executive: 'John Doe', desc: 'Global Tech Solutions HQ - Inventory Checked & Verified.', time: '10:30 AM', status: 'success' },
    { id: 3, type: 'order', title: 'High-Value Order Collected', executive: 'Sarah Wilson', desc: 'ORD-5522 closed for ₹1.2L with premium client.', time: '10:15 AM', status: 'info' },
    { id: 4, type: 'login', title: 'Shift Started & GPS Locked', executive: 'Robert Fox', desc: 'East Side Mall - GPS Signal Active and Confirmed.', time: '09:00 AM', status: 'default' },
    { id: 5, type: 'task', title: 'Emergency Task Assigned', executive: 'Jane Smith', desc: 'TSK-102: Immediate meeting with disgruntled client.', time: '08:45 AM', status: 'info' },
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

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'urgent': return <AlertCircle size={16} className="text-rose-500" />;
      case 'success': return <CheckCircle size={16} className="text-emerald-500" />;
      case 'warning': return <Bell size={16} className="text-amber-500" />;
      default: return <Bell size={16} className="text-blue-500" />;
    }
  };

  const handleDateSelect = (e) => {
    const rawDate = e.target.value;
    if (rawDate) {
      const dateObj = new Date(rawDate);
      const formattedDate = dateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
      setSelectedDateFilter(formattedDate);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700 flex flex-col h-full min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
            <Activity className="text-indigo-600" size={32} />
            Command Center
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">Live tracking, notifications, and operational timeline</p>
        </div>
      </div>

      {/* Main Container */}
      {!selectedExecutive ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
          {/* Left Column: Field Executives (col-span-8) */}
          <div className="lg:col-span-8 flex flex-col space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm p-6 flex-1 flex flex-col h-[600px]">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                    <Navigation size={20} className="text-indigo-600" /> Field Executives
                  </h3>
                  <p className="text-xs font-bold text-gray-500 mt-1">Live status tracking & directory</p>
                </div>
                <div className="relative">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                   <input 
                     type="text" 
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     placeholder="Search executive..." 
                     className="pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-xs font-medium outline-none w-48 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                   />
                </div>
              </div>
              
              <div className="space-y-4 overflow-y-auto flex-1 pr-2 custom-scrollbar">
                {filteredExecutives.length === 0 ? (
                   <div className="flex flex-col items-center justify-center h-full text-gray-400">
                     <Search size={32} className="mb-2 opacity-20" />
                     <p className="text-sm font-bold">No executives found</p>
                   </div>
                ) : (
                  filteredExecutives.map(exec => (
                    <div 
                      key={exec.id} 
                      onClick={() => setSelectedExecutive(exec)}
                      className="group p-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-indigo-100 dark:hover:border-indigo-900 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all cursor-pointer shadow-sm hover:shadow-md"
                    >
                      <div className="flex items-center gap-4">
                        {/* Avatar */}
                        <div className="relative">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/40 dark:to-purple-900/40 border border-indigo-50 dark:border-indigo-800/50 flex items-center justify-center text-lg font-black text-indigo-700 dark:text-indigo-300">
                            {exec.avatar}
                          </div>
                          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-gray-900 ${exec.statusColor}`} />
                        </div>
                        
                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center mb-1">
                            <h4 className="text-base font-bold text-gray-900 dark:text-white truncate pr-2 group-hover:text-indigo-600 transition-colors">{exec.name}</h4>
                            <span className="text-[10px] font-black text-gray-400 whitespace-nowrap">{exec.lastActive}</span>
                          </div>
                          <div className="flex items-center gap-4 text-xs font-semibold text-gray-500">
                            <span className="flex items-center gap-1.5 truncate">
                              <MapPin size={12} className={exec.status === 'Offline' ? 'text-gray-400' : 'text-emerald-500'} />
                              {exec.location}
                            </span>
                            <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded font-bold text-gray-600 dark:text-gray-300">
                              {exec.role}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Hover Actions */}
                      <div className="mt-4 flex flex-wrap items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={(e) => { e.stopPropagation(); /* handle call */ }}
                          className="px-4 py-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 rounded-xl text-xs font-black flex items-center justify-center gap-2 hover:bg-indigo-100 transition-colors flex-1 sm:flex-none"
                        >
                          <Phone size={14} /> Call Executive
                        </button>
                        <button 
                          className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-black flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors flex-1 sm:flex-none"
                          onClick={() => setSelectedExecutive(exec)}
                        >
                          Activity Log <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Notifications & Support (col-span-4) */}
          <div className="lg:col-span-4 flex flex-col space-y-6">
            
            {/* Notifications Panel */}
            <div className="bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm p-6 flex flex-col h-fit">
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100 dark:border-gray-800">
                <h3 className="text-base font-black text-gray-900 dark:text-white flex items-center gap-2">
                  <Bell size={18} className="text-rose-500 animate-pulse" /> Action Required
                </h3>
                <span className="bg-rose-50 text-rose-600 border border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20 text-[10px] px-2.5 py-1 rounded-lg font-black tracking-widest uppercase">3 ISSUES</span>
              </div>
              
              <div className="-mx-2 px-2">
                <table className="w-full text-left">
                  <thead className="bg-white dark:bg-gray-900 z-10">
                    <tr className="border-b border-gray-100 dark:border-gray-800">
                      <th className="pb-3 text-[10px] font-black tracking-widest text-gray-400 uppercase">Alert Details</th>
                      <th className="pb-3 text-[10px] font-black tracking-widest text-gray-400 uppercase text-right w-24">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {notifications.map(note => (
                      <tr key={note.id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                        <td className="py-4 pr-4">
                          <div className="flex items-start gap-3">
                            <div className="mt-0.5 p-1.5 rounded-lg bg-gray-50 dark:bg-gray-800 shrink-0">
                              {getNotificationIcon(note.type)}
                            </div>
                            <div>
                              <div className="flex items-center justify-between gap-2 mb-1">
                                <h4 className="text-sm font-bold text-gray-900 dark:text-white">{note.title}</h4>
                                <span className="text-[9px] font-bold text-gray-400 whitespace-nowrap">{note.time}</span>
                              </div>
                              <p className="text-xs font-semibold text-gray-500 leading-relaxed max-w-[200px] xl:max-w-[250px]">
                                {note.message}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 align-middle text-right pl-2">
                          <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                alert(`Resolving: ${note.title}`);
                            }}
                            className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-wider hover:bg-indigo-100 hover:scale-105 active:scale-95 transition-all shadow-sm"
                          >
                            Resolve
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>          
          </div>
        </div>
      ) : (
        /* Selected Executive Activity Log View (Full Width) */
        <div className="bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm flex-1 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-300 w-full min-h-[600px]">
          {/* Log Header */}
          <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/50">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSelectedExecutive(null)}
                className="p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-indigo-600 rounded-xl hover:shadow-md transition-all group mr-2"
              >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              </button>
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/40 dark:to-purple-900/40 border border-indigo-50 dark:border-indigo-800/50 flex items-center justify-center text-xl font-black text-indigo-700 dark:text-indigo-300">
                  {selectedExecutive.avatar}
                </div>
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-gray-900 ${selectedExecutive.statusColor}`} />
              </div>
              <div>
                <h2 className="text-xl font-black text-gray-900 dark:text-white">{selectedExecutive.name}</h2>
                <div className="flex items-center gap-3 text-xs font-bold text-gray-500 mt-1">
                  <span className="flex items-center gap-1"><MapPin size={12}/> {selectedExecutive.location}</span>
                  <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700"/>
                  <span className="text-indigo-600 dark:text-indigo-400">{selectedExecutive.role}</span>
                </div>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-3">
              <div className="relative z-[100]">
                <button 
                  onClick={() => setIsDateDropdownOpen(!isDateDropdownOpen)}
                  className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-black flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm cursor-pointer"
                >
                  <Calendar size={14} className="text-indigo-500" /> {selectedDateFilter} <ChevronRight size={14} className={`${isDateDropdownOpen ? '-rotate-90' : 'rotate-90'} text-gray-400 transition-transform`} />
                </button>
                {/* Dropdown Menu */}
                {isDateDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 transition-all z-[110]">
                    <div className="p-2 space-y-1">
                      <button 
                        onClick={() => { setSelectedDateFilter('Today'); setIsDateDropdownOpen(false); }}
                        className="w-full text-left px-3 py-2 text-xs font-bold text-gray-600 hover:text-indigo-600 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-400 rounded-lg transition-colors"
                      >
                        Today
                      </button>
                      <button 
                        onClick={() => { setSelectedDateFilter('Yesterday'); setIsDateDropdownOpen(false); }}
                        className="w-full text-left px-3 py-2 text-xs font-bold text-gray-600 hover:text-indigo-600 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-400 rounded-lg transition-colors"
                      >
                        Yesterday
                      </button>
                      <button 
                        onClick={() => { setSelectedDateFilter('Last 7 Days'); setIsDateDropdownOpen(false); }}
                        className="w-full text-left px-3 py-2 text-xs font-bold text-gray-600 hover:text-indigo-600 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-400 rounded-lg transition-colors"
                      >
                        Last 7 Days
                      </button>
                      <div className="h-px bg-gray-100 dark:bg-gray-700 my-1"></div>
                      <div className="relative group/date">
                        <button className="w-full text-left px-3 py-2 text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center justify-between group-hover/date:text-indigo-600 dark:group-hover/date:text-indigo-400">
                          Custom Date <Calendar size={12} className="text-gray-400 group-hover/date:text-indigo-500 transition-colors pointer-events-none" />
                        </button>
                        <input 
                          type="date" 
                          title="Select a Custom Date"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          onChange={(e) => {
                            handleDateSelect(e);
                            setIsDateDropdownOpen(false);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1 border-r border-transparent"></div>
              <button className="px-4 py-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 rounded-xl text-xs font-black flex items-center justify-center gap-2 hover:bg-indigo-100 transition-colors">
                <Phone size={14} /> Call
              </button>
            </div>
          </div>

          <div className="flex flex-1 overflow-hidden">
            <div className="w-full flex flex-col">
              {/* Log Filters */}
              <div className="px-6 py-4 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between bg-white dark:bg-gray-900 z-10">
                 <h3 className="text-sm font-black text-gray-900 dark:text-white">Activity Timeline</h3>
                 <div className="flex gap-2">
                    {['All', 'Visits', 'Orders', 'Alerts'].map((f) => (
                      <button 
                        key={f} 
                        onClick={() => setActiveTab(f)}
                        className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === f ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-sm' : 'bg-gray-50 text-gray-400 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700'}`}
                      >
                        {f}
                      </button>
                    ))}
                 </div>
              </div>

              {/* Log Timeline List */}
              <div className="p-8 overflow-y-auto flex-1 custom-scrollbar space-y-0 relative">
                 {activities.filter(item => activeTab === 'All' || item.type === activeTab.toLowerCase().replace('s', '')).length === 0 ? (
                   <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                     <Filter size={32} className="mb-2 opacity-20" />
                     <p className="text-sm font-bold">No {activeTab.toLowerCase()} found</p>
                   </div>
                 ) : (
                   activities
                     .filter(item => activeTab === 'All' || item.type.toLowerCase() === activeTab.toLowerCase().replace(/s$/, ''))
                     .map((item, i, arr) => (
                   <div key={item.id} className="group flex gap-8 relative">
                      {/* Timeline Line */}
                      {i !== arr.length - 1 && (
                        <div className="absolute left-[27px] top-[56px] bottom-[-40px] w-px bg-gray-100 dark:bg-gray-800 group-hover:bg-indigo-200 transition-colors" />
                      )}

                      {/* Icon Circle */}
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border z-10 transition-all group-hover:scale-110 group-hover:rotate-3 ${getStatusColor(item.status)}`}>
                         {getIcon(item.type)}
                      </div>

                      {/* Content Card */}
                      <div className="flex-1 pb-10">
                         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                            <h4 className="text-lg font-black text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                              {item.title}
                            </h4>
                            <div className="flex items-center gap-1.5 text-gray-400">
                              <Clock size={12} />
                              <span className="text-[10px] font-black uppercase tracking-[0.2em]">{item.time}</span>
                            </div>
                         </div>
                         <p className="text-sm font-bold text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl">
                           {item.desc}
                         </p>
                        </div>
                     </div>
                   ))
                 )}
                 
                 {/* End of Timeline Marker */}
                 <div className="flex gap-8 relative mt-2 opacity-50">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border border-dashed border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-400">
                       <CheckCircle size={18} />
                    </div>
                    <div className="flex-1 flex items-center">
                       <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Start of the Day</p>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerActivityLog;
