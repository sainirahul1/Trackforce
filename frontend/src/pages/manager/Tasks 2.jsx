import React, { useState } from 'react';
import { Plus, Search, Filter, MoreHorizontal, Clock, CheckCircle2, AlertCircle, Calendar, UserPlus, ArrowRight } from 'lucide-react';

/**
 * Tasks Component
 * Jira-style task management for the Manager Portal.
 */
const ManagerTasks = () => {
  const [activeTab, setActiveTab] = useState('board'); // 'board' or 'list'

  const tasks = [
    { id: 'TSK-102', title: 'Onboard New Supplier in Sector 4', assignee: 'John Doe', priority: 'High', status: 'In Progress', deadline: 'Today, 5:00 PM' },
    { id: 'TSK-105', title: 'Route Optimization for North Zone', assignee: 'Sarah Wilson', priority: 'Medium', status: 'Pending', deadline: 'Tomorrow' },
    { id: 'TSK-101', title: 'Monthly Inventory Audit - Warehouse B', assignee: 'Mike Johnson', priority: 'Critical', status: 'In Progress', deadline: 'Mar 18' },
    { id: 'TSK-108', title: 'Store Visit: Global Tech Solutions', assignee: 'Jane Smith', priority: 'Low', status: 'Completed', deadline: 'Mar 14' },
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical': return 'text-rose-600 bg-rose-50 border-rose-100';
      case 'High': return 'text-orange-600 bg-orange-50 border-orange-100';
      case 'Medium': return 'text-blue-600 bg-blue-50 border-blue-100';
      default: return 'text-gray-600 bg-gray-50 border-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed': return <CheckCircle2 size={14} className="text-emerald-500" />;
      case 'In Progress': return <Clock size={14} className="text-blue-500 animate-pulse" />;
      default: return <AlertCircle size={14} className="text-gray-400" />;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Mission Board</h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">Assign, monitor, and optimize team operations</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white rounded-2xl font-black text-sm transition-all shadow-xl shadow-indigo-500/20">
          <Plus size={18} />
          CREATE TASK
        </button>
      </div>

      {/* Filters & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 bg-gray-100/50 dark:bg-gray-900/50 p-1.5 rounded-2xl border border-gray-200/50 dark:border-gray-800/50">
          <button 
            onClick={() => setActiveTab('board')}
            className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'board' ? 'bg-white dark:bg-gray-800 text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
          >
            Board
          </button>
          <button 
            onClick={() => setActiveTab('list')}
            className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'list' ? 'bg-white dark:bg-gray-800 text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
          >
            List view
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Filter tasks..." 
              className="pl-10 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl text-xs outline-none focus:ring-2 focus:ring-indigo-500/10 w-64"
            />
          </div>
          <button className="p-2.5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl text-gray-400 hover:text-indigo-600 transition-all">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* Jira-style Kanban Board Mock */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {['Backlog', 'In Progress', 'Done'].map((col) => (
          <div key={col} className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-[0.2em] flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${col === 'In Progress' ? 'bg-blue-500' : col === 'Done' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                {col}
                <span className="text-gray-400 ml-1 font-bold">({tasks.filter(t => col === 'Backlog' ? t.status === 'Pending' : t.status === col).length})</span>
              </h3>
              <MoreHorizontal size={18} className="text-gray-300" />
            </div>

            <div className="space-y-4 min-h-[400px] p-2 rounded-[2rem] bg-gray-50/50 dark:bg-gray-950/20 border-2 border-dashed border-gray-200/50 dark:border-gray-800/50">
              {tasks
                .filter(t => col === 'Backlog' ? t.status === 'Pending' : t.status === col)
                .map((task) => (
                <div key={task.id} className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-grab active:cursor-grabbing group">
                  <div className="flex justify-between items-start mb-4">
                    <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                    <span className="text-[10px] font-black text-gray-400 tracking-tighter">{task.id}</span>
                  </div>
                  
                  <h4 className="text-[15px] font-black text-gray-800 dark:text-white leading-tight mb-4 group-hover:text-indigo-600 transition-colors">
                    {task.title}
                  </h4>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-gray-800">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-indigo-50 flex items-center justify-center text-[10px] font-bold text-indigo-600 border border-indigo-100">
                        {task.assignee.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="text-[10px] font-bold text-gray-500">{task.assignee}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                      <Clock size={10} />
                      {task.deadline}
                    </div>
                  </div>
                </div>
              ))}
              
              <button className="w-full py-4 rounded-3xl border-2 border-dashed border-gray-100 dark:border-gray-800 flex items-center justify-center text-gray-300 hover:text-indigo-500 hover:border-indigo-500/30 hover:bg-indigo-50/10 transition-all font-bold text-xs uppercase tracking-widest">
                <Plus size={16} className="mr-2" />
                Drop Task Here
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Stats Summary Footer */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-8">
        {[
          { label: 'Completed Missions', value: '1,284', icon: CheckCircle2, color: 'text-emerald-500' },
          { label: 'Active Tasks', value: '42', icon: Clock, color: 'text-blue-500' },
          { label: 'Avg. Turnaround', value: '4h 12m', icon: Calendar, color: 'text-indigo-500' },
          { label: 'Resource Load', value: '82%', icon: UserPlus, color: 'text-purple-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-4">
            <div className={`p-3 rounded-2xl bg-gray-50 dark:bg-gray-800 ${stat.color}`}>
              <stat.icon size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
              <p className="text-xl font-black text-gray-900 dark:text-white leading-none mt-1">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManagerTasks;
