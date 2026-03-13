import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  AlertCircle, 
  Calendar, 
  MapPin, 
  ChevronRight, 
  Filter, 
  Search,
  LayoutGrid,
  List as ListIcon,
  Map as MapIcon,
  Zap,
  MoreVertical,
  Navigation
} from 'lucide-react';

const EmployeeTasks = () => {
  const [view, setView] = useState('list'); // 'list', 'grid', or 'map'
  
  const tasks = [
    {
      id: 1,
      title: 'Monthly Inventory Audit',
      store: 'Big Bazaar Central',
      address: 'MG Road, Bengaluru',
      priority: 'high',
      status: 'pending',
      dueDate: 'Today, 05:00 PM',
      type: 'Audit',
      incentive: '₹250',
      difficulty: 'Medium',
      coords: { x: 45, y: 30 }
    },
    {
      id: 2,
      title: 'New Launch Display Setup',
      store: 'Reliance Fresh',
      address: 'Indiranagar, Bengaluru',
      priority: 'medium',
      status: 'in-progress',
      dueDate: 'Today, 07:00 PM',
      type: 'Merchandising',
      incentive: '₹150',
      difficulty: 'Hard',
      coords: { x: 70, y: 50 }
    },
    {
      id: 3,
      title: 'Payment Collection Follow-up',
      store: 'More Megamart',
      address: 'Koramangala, Bengaluru',
      priority: 'low',
      status: 'follow-up',
      dueDate: 'Yesterday',
      type: 'Finance',
      incentive: '₹100',
      difficulty: 'Easy',
      coords: { x: 30, y: 80 }
    },
    {
      id: 4,
      title: 'Store Feedback Survey',
      store: 'Spar Hypermarket',
      address: 'Bannerghatta Road, Bengaluru',
      priority: 'medium',
      status: 'incomplete',
      dueDate: 'Today, 10:00 AM',
      type: 'Survey',
      incentive: '₹50',
      difficulty: 'Easy',
      coords: { x: 20, y: 40 }
    }
  ];

  const analytics = [
    { label: 'Completed', value: '12', color: 'text-emerald-500', bg: 'bg-emerald-50', icon: CheckCircle2 },
    { label: 'Pending', value: '04', color: 'text-orange-500', bg: 'bg-orange-50', icon: Clock },
    { label: 'Follow-up', value: '02', color: 'text-purple-500', bg: 'bg-purple-50', icon: AlertCircle },
    { label: 'Incomplete', value: '01', color: 'text-red-500', bg: 'bg-red-50', icon: Circle },
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-50 text-red-600 border-red-100';
      case 'medium': return 'bg-orange-50 text-orange-600 border-orange-100';
      case 'low': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      default: return 'bg-gray-50 text-gray-500 border-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="text-emerald-500" size={18} />;
      case 'in-progress': return <Clock className="text-orange-500 animate-pulse" size={18} />;
      case 'follow-up': return <AlertCircle className="text-purple-500" size={18} />;
      case 'incomplete': return <Circle className="text-red-500" size={18} />;
      default: return <Circle className="text-gray-300" size={18} />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4 md:px-0">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Task Performance Hub</h1>
          <p className="text-gray-500 font-medium">Real-time field analytics and assignments</p>
        </div>
        
        <div className="flex bg-gray-100/50 dark:bg-gray-800/50 p-1.5 rounded-2xl border border-gray-100 dark:border-gray-800">
            <button 
              onClick={() => setView('list')}
              className={`p-2.5 rounded-xl transition-all ${view === 'list' ? 'bg-white dark:bg-gray-700 text-indigo-600 shadow-sm' : 'text-gray-400'}`}
            >
              <ListIcon size={18} />
            </button>
            <button 
              onClick={() => setView('grid')}
              className={`p-2.5 rounded-xl transition-all ${view === 'grid' ? 'bg-white dark:bg-gray-700 text-indigo-600 shadow-sm' : 'text-gray-400'}`}
            >
              <LayoutGrid size={18} />
            </button>
            <button 
              onClick={() => setView('map')}
              className={`p-2.5 rounded-xl transition-all ${view === 'map' ? 'bg-white dark:bg-gray-700 text-indigo-600 shadow-sm' : 'text-gray-400'}`}
            >
              <MapIcon size={18} />
            </button>
        </div>
      </div>

      {/* Analytics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {analytics.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-gray-900 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} w-fit mb-4`}>
              <stat.icon size={20} />
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
            <p className="text-3xl font-black text-gray-900 dark:text-white mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* View Content */}
      {view === 'map' ? (
        <div className="relative h-[600px] bg-gray-50 dark:bg-gray-950 rounded-[3rem] border border-gray-100 dark:border-gray-800 overflow-hidden shadow-inner">
          <div className="absolute inset-0 opacity-20 dark:opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#6366F1 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          
          {tasks.map((task) => (
            <div 
              key={task.id}
              className="absolute transition-all hover:scale-110 cursor-pointer group"
              style={{ left: `${task.coords.x}%`, top: `${task.coords.y}%` }}
            >
              <div className={`p-3 rounded-2xl shadow-2xl ring-8 ring-white dark:ring-gray-900 ${getPriorityColor(task.priority)} flex items-center justify-center`}>
                <MapPin size={24} />
              </div>
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-white dark:bg-gray-900 p-3 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                <p className="text-sm font-black text-gray-900 dark:text-white truncate">{task.title}</p>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight">{task.store}</p>
              </div>
            </div>
          ))}
          
          <div className="absolute bottom-8 right-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-4 rounded-3xl border border-white/20 shadow-2xl space-y-3">
             <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)] animate-pulse" />
                <span className="text-xs font-black uppercase text-gray-900 dark:text-white">Live Tracking Active</span>
             </div>
             <p className="text-[10px] text-gray-500 font-bold max-w-[150px]">Current Location: MG Road Cluster, Bengaluru</p>
          </div>
        </div>
      ) : (
        <div className="space-y-10">
          {/* Filters Bar */}
          <div className="flex flex-wrap items-center gap-4 bg-white dark:bg-gray-900 p-4 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm transition-all animate-in slide-in-from-top-4">
            <div className="flex-1 min-w-[240px] relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search tasks, stores or types..." 
                className="w-full pl-12 pr-4 py-3 bg-gray-50/50 dark:bg-gray-800/50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-100 transition-all outline-none"
              />
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-gray-800">
                <Filter size={16} />
                Priority
              </button>
              <button className="flex items-center gap-2 px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-gray-800">
                <Calendar size={16} />
                Date Range
              </button>
            </div>
          </div>

          {/* Tasks List/Grid */}
          <div className={view === 'list' ? "space-y-4" : "grid grid-cols-1 md:grid-cols-2 gap-6"}>
            {tasks.map((task) => (
              <div 
                key={task.id} 
                className={`group bg-white dark:bg-gray-900 border rounded-[2.5rem] transition-all hover:shadow-xl ${
                  task.status === 'completed' ? 'border-emerald-100 dark:border-emerald-900/30' : 'border-gray-100 dark:border-gray-800'
                } ${view === 'list' ? 'p-6 md:p-8' : 'p-8 flex flex-col h-full'}`}
              >
                <div className={`flex ${view === 'list' ? 'flex-row items-center gap-8' : 'flex-col gap-6'}`}>
                  <div className={`${view === 'list' ? 'flex-1' : 'flex-1 space-y-4'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(task.status)}
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${getPriorityColor(task.priority)}`}>
                          {task.priority} Priority
                        </span>
                      </div>
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 dark:bg-gray-800 px-3 py-1 rounded-lg">
                        {task.type}
                      </span>
                    </div>

                    <h3 className={`text-xl font-black text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors ${task.status === 'completed' ? 'line-through opacity-50' : ''}`}>
                      {task.title}
                    </h3>

                    <div className="mt-4 flex flex-wrap items-center gap-6">
                      <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <MapPin size={16} className="text-indigo-500" />
                        <span className="font-medium">{task.store}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <Clock size={16} className="text-orange-500" />
                        <span className="font-medium">{task.dueDate}</span>
                      </div>
                    </div>
                  </div>

                  <div className={`flex items-center gap-4 ${view === 'list' ? '' : 'mt-6 border-t border-gray-50 dark:border-gray-800 pt-6'}`}>
                    <div className="text-right flex-1">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Incentive</p>
                      <p className="text-lg font-black text-emerald-600">{task.incentive}</p>
                    </div>
                    <button className={`p-4 rounded-3xl transition-all ${
                      task.status === 'completed' 
                      ? 'bg-emerald-50 text-emerald-600' 
                      : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white'
                    }`}>
                      <Navigation size={20} />
                    </button>
                    <button className="p-4 text-gray-300 hover:text-gray-600 dark:hover:text-gray-100">
                      <MoreVertical size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Incentives Banner */}
      <div className="bg-gradient-to-r from-gray-900 to-indigo-900 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-black tracking-tight mb-2">Performance Bonus Pending!</h2>
            <p className="text-indigo-100/70 font-medium">Complete all 4 tasks today to unlock a ₹500 streak bonus.</p>
          </div>
          <div className="flex items-center gap-6">
             <div className="text-center">
                <p className="text-4xl font-black">75%</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200">Daily Goal</p>
             </div>
             <button className="px-8 py-4 bg-white text-indigo-900 rounded-3xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-all">
                View Rank
             </button>
          </div>
        </div>
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-indigo-600/20 rounded-full blur-[100px]" />
      </div>
    </div>
  );
};

export default EmployeeTasks;
