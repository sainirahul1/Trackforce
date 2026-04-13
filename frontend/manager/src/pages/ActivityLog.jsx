import React, { useState, useEffect } from 'react';
import {
  Clock, LogIn, MapPin, ClipboardList, ShoppingBag,
  AlertCircle, Search, Filter, Calendar,
  ChevronRight, Activity, Users, Bell, Navigation, Phone,
  Map, CheckCircle, XCircle, TrendingUp, MoreVertical,
  Mail, MessageSquare, X, ArrowLeft, LogOut, Plus, UserPlus
} from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { getExecutives, getLogsByUser, getActivities } from '../services/activityService';

const ManagerActivityLog = () => {
  const { setPageLoading } = useOutletContext();
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExecutive, setSelectedExecutive] = useState(null);
  const [selectedDateFilter, setSelectedDateFilter] = useState('Today');
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);

  // Dynamic data states
  const [executives, setExecutives] = useState([]);
  const [userLogs, setUserLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [logsLoading, setLogsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewType, setViewType] = useState('employee'); // 'employee' or 'my'
  const [managerLogs, setManagerLogs] = useState([]);

  // Fetch all executives on mount
  useEffect(() => {
    const fetchExecutives = async () => {
      setIsLoading(true);
      try {
        const data = await getExecutives();
        setExecutives(data.map(exec => ({
          ...exec,
          id: exec._id,
          avatar: exec.name ? exec.name.split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase() : 'NA',
          statusColor: exec.isTracking ? 'bg-emerald-500' : 'bg-gray-400',
          status: exec.isTracking ? 'Active' : 'Offline',
          location: exec.profile?.location || 'Unknown'
        })));
      } catch (err) {
        console.error('Error fetching executives:', err);
        setError('Failed to load executives');
      } finally {
        setIsLoading(false);
        if (setPageLoading) setPageLoading(false);
      }
    };
    fetchExecutives();
  }, []);

  // Fetch specific logs when an executive is selected
  useEffect(() => {
    const fetchUserLogs = async () => {
      if (!selectedExecutive) return;

      setLogsLoading(true);
      try {
        const logs = await getLogsByUser(selectedExecutive.id);
        setUserLogs(logs);
      } catch (err) {
        console.error('Error fetching user logs:', err);
      } finally {
        setLogsLoading(false);
      }
    };
    fetchUserLogs();
  }, [selectedExecutive]);

  // Fetch manager logs when 'my' view is active
  useEffect(() => {
    const fetchManagerLogs = async () => {
      if (viewType !== 'my') return;

      setLogsLoading(true);
      try {
        const logs = await getActivities();
        setManagerLogs(logs);
      } catch (err) {
        console.error('Error fetching manager logs:', err);
      } finally {
        setLogsLoading(false);
      }
    };
    fetchManagerLogs();
  }, [viewType]);

  const filteredExecutives = executives.filter(exec =>
    exec.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    exec.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Mock notifications for now (can be made dynamic later)
  const notifications = [
    { id: 1, title: 'Client Escalation', message: 'VIP Client XYZ requested immediate call back regarding order delay.', time: '10 mins ago', type: 'urgent' },
    { id: 2, title: 'Target Reached', message: 'Sarah Wilson completed daily visits target early.', time: '1 hour ago', type: 'success' },
    { id: 3, title: 'Route Deviation', message: 'Mike Johnson deviated from assigned route by 5km.', time: '2 hours ago', type: 'warning' },
  ];

  const getIcon = (type) => {
    const t = type?.toLowerCase() || '';
    if (t === 'visit_approved') return <CheckCircle size={18} />;
    if (t === 'visit_rejected') return <XCircle size={18} />;
    if (t.includes('visit')) return <ClipboardList size={18} />;
    if (t.includes('order')) return <ShoppingBag size={18} />;
    if (t === 'login' || t.includes('start')) return <LogIn size={18} />;
    if (t === 'logout') return <LogOut size={18} />;
    if (t === 'task_assigned') return <Plus size={18} />;
    if (t === 'task_reassigned') return <UserPlus size={18} />;
    if (t === 'team_member_added') return <Users size={18} />;
    if (t.includes('alert') || t.includes('warning') || t.includes('deviation')) return <AlertCircle size={18} />;
    return <Activity size={18} />;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:border-emerald-500/20';
      case 'warning': return 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-500/10 dark:border-rose-500/20';
      case 'info': return 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-500/10 dark:border-blue-500/20';
      case 'urgent': return 'bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-indigo-500/10 dark:border-indigo-500/20';
      case 'login': return 'bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-indigo-500/10 dark:border-indigo-500/20 shadow-sm';
      case 'logout': return 'bg-slate-50 text-slate-600 border-slate-100 dark:bg-slate-500/10 dark:border-slate-500/20';
      case 'task_assigned': return 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:border-emerald-500/20';
      case 'task_reassigned': return 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-500/10 dark:border-blue-500/20';
      default: return 'bg-gray-50 text-gray-600 border-gray-100 dark:bg-gray-800 dark:border-gray-700';
    }
  };

  const getStatusByType = (type) => {
    const t = type?.toLowerCase() || '';
    if (t === 'login') return 'login';
    if (t === 'logout') return 'logout';
    if (t === 'visit_approved' || t === 'task_assigned' || t === 'team_member_added' || t.includes('visit') || t.includes('order')) return 'success';
    if (t === 'visit_rejected') return 'warning';
    if (t === 'task_reassigned') return 'info';
    if (t.includes('alert') || t.includes('deviation')) return 'warning';
    return 'default';
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

          {/* View Toggle Buttons */}
          <div className="flex items-center gap-3 mt-6 p-1.5 bg-gray-100/50 dark:bg-gray-700/50 rounded-2xl w-fit border border-gray-100 dark:border-gray-800">
            <button
              onClick={() => { setViewType('my'); setSelectedExecutive(null); }}
              className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2.5 ${viewType === 'my' ? 'bg-white dark:bg-gray-800 text-indigo-600 shadow-md ring-1 ring-black/5 dark:ring-white/5' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
            >
              <Activity size={18} className={viewType === 'my' ? 'text-indigo-600' : 'text-gray-400'} /> My Activity
            </button>
            <button
              onClick={() => setViewType('employee')}
              className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2.5 ${viewType === 'employee' ? 'bg-white dark:bg-gray-800 text-indigo-600 shadow-md ring-1 ring-black/5 dark:ring-white/5' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
            >
              <Users size={18} className={viewType === 'employee' ? 'text-indigo-600' : 'text-gray-400'} /> Employee Activity
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      {(viewType === 'my' || (viewType === 'employee' && selectedExecutive)) ? (
        /* Timeline View (My Activity or Specific Executive) */
        <div className="bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm flex-1 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-300 w-full min-h-[600px]">
          {/* Log Header */}
          <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/50">
            <div className="flex items-center gap-4">
              {viewType === 'employee' && (
                <button
                  onClick={() => setSelectedExecutive(null)}
                  className="p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-indigo-600 rounded-xl hover:shadow-md transition-all group mr-2"
                >
                  <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                </button>
              )}
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/40 dark:to-purple-900/40 border border-indigo-50 dark:border-indigo-800/50 flex items-center justify-center text-xl font-black text-indigo-700 dark:text-indigo-300">
                  {viewType === 'my' ? 'MA' : selectedExecutive.avatar}
                </div>
                {viewType === 'employee' && (
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-gray-900 ${selectedExecutive.statusColor}`} />
                )}
              </div>
              <div>
                <h2 className="text-xl font-black text-gray-900 dark:text-white">
                  {viewType === 'my' ? 'My Performance Log' : selectedExecutive.name}
                </h2>
                <div className="flex items-center gap-3 text-xs font-bold text-gray-500 mt-1">
                  <span className="flex items-center gap-1">
                    <Navigation size={12} className="text-indigo-500" />
                    {viewType === 'my' ? 'Account Overview' : selectedExecutive.location}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700" />
                  <span className="text-indigo-600 dark:text-indigo-400">
                    {viewType === 'my' ? 'Managerial Role' : selectedExecutive.role}
                  </span>
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
                    </div>
                  </div>
                )}
              </div>
              <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1 border-r border-transparent"></div>
              {viewType === 'employee' && (
                <button className="px-4 py-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 rounded-xl text-xs font-black flex items-center justify-center gap-2 hover:bg-indigo-100 transition-colors">
                  <Phone size={14} /> Call
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-1 overflow-hidden">
            <div className="w-full flex flex-col">
              {/* Log Filters */}
              <div className="px-6 py-4 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between bg-white dark:bg-gray-900 z-10">
                <h3 className="text-sm font-black text-gray-900 dark:text-white">Activity Timeline</h3>
                <div className="flex gap-2">
                  {['All', 'Tasks', 'Visits', 'Teams', 'Orders', 'Alerts'].map((f) => (
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
                {logsLoading ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-indigo-500">
                    <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                    <p className="text-xs font-bold uppercase tracking-widest">Loading Timeline...</p>
                  </div>
                ) : (viewType === 'my' ? managerLogs : userLogs).filter(item => {
                  if (activeTab === 'All') return true;
                  if (activeTab === 'Visits') return item.type.includes('visit');
                  if (activeTab === 'Tasks') return item.type.includes('task');
                  if (activeTab === 'Orders') return item.type.includes('order');
                  if (activeTab === 'Teams') return item.type.includes('team');
                  if (activeTab === 'Alerts') return item.type.includes('alert') || item.type.includes('deviation');
                  return false;
                }).length === 0 ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                    <Filter size={32} className="mb-2 opacity-20" />
                    <p className="text-sm font-bold">No {activeTab.toLowerCase()} found</p>
                  </div>
                ) : (
                  (viewType === 'my' ? managerLogs : userLogs)
                    .filter(item => {
                      if (activeTab === 'All') return true;
                      if (activeTab === 'Visits') return item.type.includes('visit');
                      if (activeTab === 'Tasks') return item.type.includes('task');
                      if (activeTab === 'Orders') return item.type.includes('order');
                      if (activeTab === 'Teams') return item.type.includes('team');
                      if (activeTab === 'Alerts') return item.type.includes('alert') || item.type.includes('deviation');
                      return false;
                    })
                    .map((item, i, arr) => (
                      <div key={item._id} className="group flex gap-8 relative">
                        {/* Timeline Line */}
                        {i !== arr.length - 1 && (
                          <div className="absolute left-[27px] top-[56px] bottom-[-40px] w-px bg-gray-100 dark:bg-gray-800 group-hover:bg-indigo-200 transition-colors" />
                        )}

                        {/* Icon Circle */}
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border z-10 transition-all group-hover:scale-110 group-hover:rotate-3 ${getStatusColor(getStatusByType(item.type))}`}>
                          {getIcon(item.type)}
                        </div>

                        {/* Content Card */}
                        <div className="flex-1 pb-10">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                            <h4 className="text-lg font-black text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                              {item.title || item.type.replace('_', ' ').toUpperCase()}
                            </h4>
                            <div className="flex items-center gap-1.5 text-gray-400">
                              <Clock size={12} />
                              <div className="flex items-center gap-2">
                                <span className="text-[9px] font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-widest">{new Date(item.timestamp).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</span>
                                <span className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
                              </div>
                            </div>
                          </div>
                          <p className="text-sm font-bold text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl">
                            {item.details}
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
      ) : (
        /* Default Employee Directory View (Split Layout) */
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
      )}
    </div>
  );
};

export default ManagerActivityLog;
