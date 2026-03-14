import React, { useState } from 'react';
import { Bell, MessageSquare, AlertCircle, Info, CheckCircle2, MoreHorizontal, Users, Briefcase, Filter, GripVertical, Search, X, ChevronDown } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';

const EmployeeNotifications = () => {
  const { 
    executiveList, setExecutiveList, 
    managerList, setManagerList, 
    markAllAsRead 
  } = useNotifications();

  const [activeCategory, setActiveCategory] = useState('executive');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [draggedItemIndex, setDraggedItemIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isPriorityExpanded, setIsPriorityExpanded] = useState(false);

  const onDragStart = (e, index) => {
    setDraggedItemIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index);
  };

  const onDragOver = (e, index) => {
    e.preventDefault();
  };

  const onDrop = (e, targetIndex) => {
    e.preventDefault();
    if (draggedItemIndex === null || draggedItemIndex === targetIndex) return;

    const list = activeCategory === 'executive' ? [...executiveList] : [...managerList];
    const draggedItem = list[draggedItemIndex];
    
    list.splice(draggedItemIndex, 1);
    list.splice(targetIndex, 0, draggedItem);

    if (activeCategory === 'executive') {
      setExecutiveList(list);
    } else {
      setManagerList(list);
    }
    setDraggedItemIndex(null);
  };

  const currentCategoryData = activeCategory === 'executive' ? executiveList : managerList;
  
  const filteredNotifications = currentCategoryData.filter(n => {
    const matchesPriority = priorityFilter === 'all' || n.priority === priorityFilter;
    const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         n.desc.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesPriority && matchesSearch;
  });

  const getIcon = (type) => {
    switch (type) {
      case 'alert': return <AlertCircle size={18} />;
      case 'success': return <CheckCircle2 size={18} />;
      case 'message': return <MessageSquare size={18} />;
      default: return <Info size={18} />;
    }
  };

  const getColor = (type) => {
    switch (type) {
      case 'alert': return 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400';
      case 'success': return 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400';
      case 'message': return 'bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400';
      default: return 'bg-slate-50 text-slate-500 dark:bg-slate-800 dark:text-slate-400';
    }
  };

  return (
    <div className="w-full space-y-10 pb-20 px-6 max-w-[1600px] mx-auto">
      {/* Header with Search */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 pt-6 select-none">
        <div className="space-y-1">
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Notifications</h1>
          <p className="text-sm text-slate-400 font-medium">Real-time alerts and activity updates</p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto">
          <div className="relative group flex-1 sm:min-w-[300px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={18} />
            <input 
              type="text"
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-10 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl text-sm font-semibold focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none"
            />
            {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-900 dark:hover:text-white">
                    <X size={16} />
                </button>
            )}
          </div>
          
          <button 
            onClick={() => markAllAsRead(activeCategory)}
            className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 px-6 py-3 rounded-xl transition-all uppercase tracking-wider"
          >
              Mark all as read
          </button>
        </div>
      </div>

      {/* Filter Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="inline-flex p-1 bg-slate-100/50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setActiveCategory('executive')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
                activeCategory === 'executive'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
            >
              <Briefcase size={16} />
              Sales Executive
              <span className={`ml-1 text-[10px] px-1.5 py-0.5 rounded-md ${activeCategory === 'executive' ? 'bg-indigo-50 text-indigo-600 font-black' : 'bg-slate-200/50 text-slate-400 font-bold'}`}>
                {executiveList.length}
              </span>
            </button>
            <button
              onClick={() => setActiveCategory('manager')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
                activeCategory === 'manager'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
            >
              <Users size={16} />
              Team Manager
              <span className={`ml-1 text-[10px] px-1.5 py-0.5 rounded-md ${activeCategory === 'manager' ? 'bg-emerald-50 text-emerald-600 font-black' : 'bg-slate-200/50 text-slate-400 font-bold'}`}>
                {managerList.length}
              </span>
            </button>
          </div>

          <div className="relative">
            <button 
              onClick={() => setIsPriorityExpanded(!isPriorityExpanded)}
              className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-bold text-sm transition-all bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-indigo-200 shadow-sm ${
                isPriorityExpanded ? 'ring-2 ring-indigo-500/20 border-indigo-500' : 'text-slate-600'
              }`}
            >
              <Filter size={16} className={isPriorityExpanded ? 'text-indigo-600' : 'text-slate-400'} />
              <span className="min-w-[80px] text-left">
                {priorityFilter === 'all' ? 'All Alerts' : `${priorityFilter.charAt(0).toUpperCase() + priorityFilter.slice(1)} Alerts`}
              </span>
              <ChevronDown size={16} className={`transition-transform duration-300 ${isPriorityExpanded ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isPriorityExpanded && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-1.5 flex flex-col gap-1">
                  {['all', 'high', 'low'].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => {
                        setPriorityFilter(filter);
                        setIsPriorityExpanded(false);
                      }}
                      className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                        priorityFilter === filter
                          ? 'bg-indigo-600 text-white'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      {filter === 'all' ? 'All Alerts' : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Alerts`}
                      {priorityFilter === filter && <CheckCircle2 size={14} className="text-white" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((n, index) => (
            <div 
              key={n.id} 
              draggable={priorityFilter === 'all' && searchQuery === ''}
              onDragStart={(e) => onDragStart(e, index)}
              onDragOver={(e) => onDragOver(e, index)}
              onDrop={(e) => onDrop(e, index)}
              onDragEnd={() => setDraggedItemIndex(null)}
              className={`group flex items-start gap-4 p-5 rounded-2xl border transition-all duration-300 relative ${
                  priorityFilter === 'all' && searchQuery === '' ? 'cursor-move' : 'cursor-default'
              } ${
                  draggedItemIndex === index ? 'opacity-30 scale-[0.99] border-dashed border-indigo-400 bg-slate-50/50' : ''
              } ${
                  n.isRead 
                  ? 'bg-white/50 dark:bg-slate-900/30 border-slate-100 dark:border-slate-800/50' 
                  : 'bg-white dark:bg-slate-900 border-indigo-100/50 dark:border-indigo-500/10 shadow-sm hover:shadow-md'
              }`}
            >
              {/* Grip Handle */}
              {priorityFilter === 'all' && searchQuery === '' && (
                <div className="text-slate-200 group-hover:text-indigo-400 transition-colors shrink-0 pt-1.5 opacity-40 group-hover:opacity-100">
                  <GripVertical size={20} />
                </div>
              )}

              {/* Smaller Ribbon */}
              <div className={`absolute top-0 right-10 px-3 py-1 rounded-b-lg text-[7px] font-black uppercase tracking-widest ${
                n.priority === 'high' 
                  ? 'bg-rose-500 text-white' 
                  : 'bg-sky-500 text-white'
              }`}>
                {n.priority}
              </div>

              {/* Icon Container */}
              <div className={`p-3.5 rounded-xl shrink-0 ${getColor(n.type)} transition-transform group-hover:scale-110 shadow-sm`}>
                {getIcon(n.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-4 mb-1">
                  <h3 className={`font-bold tracking-tight text-base ${n.isRead ? 'text-slate-500 dark:text-slate-400' : 'text-slate-900 dark:text-white'} group-hover:text-indigo-600 transition-colors`}>
                      {n.title}
                  </h3>
                  <span className="shrink-0 text-[10px] font-bold text-slate-400 pt-1 uppercase tracking-tighter">{n.time}</span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed max-w-3xl line-clamp-2 group-hover:line-clamp-none transition-all">
                    {n.desc}
                </p>
                
                {!n.isRead && (
                  <div className="mt-2 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-tighter">New Alert</span>
                  </div>
                )}
              </div>

              <button className="p-2 text-slate-200 group-hover:text-slate-600 dark:group-hover:text-slate-300 opacity-0 group-hover:opacity-100 transition-all hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                  <MoreHorizontal size={18} />
              </button>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-slate-50/50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
            <Bell size={32} className="mx-auto text-slate-200 dark:text-slate-800 mb-4" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">No alerts found</h3>
            <p className="text-slate-400 text-sm">Try adjusting your search or priority filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeNotifications;
