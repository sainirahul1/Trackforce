import React, { useState, useMemo, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import ReactDOM from 'react-dom';
import {
  Plus, Search, Filter, MoreHorizontal, Clock, CheckCircle2,
  AlertCircle, Calendar, UserPlus, X, ChevronDown,
  ClipboardList, PlayCircle, ShieldCheck, Ban, CheckCircle,
  LayoutGrid, List as ListIcon, MoreVertical, RotateCcw,
  Target, User, Hash, Info, FileText, BarChart3, Tag,
  Edit2, Trash2, ArrowRightCircle, ChevronRight,
  Layout, LayoutPanelLeft, Columns, Settings, Trello
} from 'lucide-react';
import { getTasks, createTask, updateTask, deleteTask } from '../../employee/services/taskService';
import { useDialog } from '../context/DialogContext';
import tenantService from '../services/core/tenantService';
import { getSyncCachedData } from '../utils/cacheHelper';
import { logActivity } from '../../employee/services/activityService';

const ManagerTasks = () => {
  const { setPageLoading } = useOutletContext();
  const [activeTab, setActiveTab] = useState('board'); // 'board' or 'list'
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isReassigning, setIsReassigning] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [openColumnMenuId, setOpenColumnMenuId] = useState(null);
  const [showNewSectionModal, setShowNewSectionModal] = useState(false);
  const [newSectionName, setNewSectionName] = useState('');
  const { showAlert, showConfirm } = useDialog();

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  // Dynamic Categories (Sections/Columns)
  const [categories, setCategories] = useState([
    { id: 'pending', label: 'Pending', icon: ClipboardList, color: 'bg-slate-500', lightColor: 'text-slate-600', bgColor: 'bg-slate-50', theme: 'slate' },
    { id: 'rejected', label: 'Rejected', icon: AlertCircle, color: 'bg-rose-500', lightColor: 'text-rose-600', bgColor: 'bg-rose-50', theme: 'rose' },
    { id: 'in-progress', label: 'In Progress', icon: PlayCircle, color: 'bg-blue-600', lightColor: 'text-blue-600', bgColor: 'bg-blue-50', theme: 'blue' },
    { id: 'delayed', label: 'Delayed', icon: ShieldCheck, color: 'bg-amber-600', lightColor: 'text-amber-600', bgColor: 'bg-amber-50', theme: 'amber' },
    { id: 'cancelled', label: 'Cancelled', icon: Ban, color: 'bg-rose-600', lightColor: 'text-rose-600', bgColor: 'bg-rose-50', theme: 'rose' },
    { id: 'completed', label: 'Completed', icon: CheckCircle, color: 'bg-emerald-600', lightColor: 'text-emerald-600', bgColor: 'bg-emerald-50', theme: 'emerald' },
  ]);

  const [tasks, setTasks] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const processTaskData = (fetchedTasks, fetchedEmployees) => {
    setTasks(fetchedTasks.map(t => ({
      ...t,
      id: t._id,
      assignee: t.employee?.name || 'Unassigned',
      deadline: t.date ? new Date(t.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'No Date',
      category: t.type || 'General'
    })));
    setTeamMembers(fetchedEmployees || []);
  };

  // Fetch data
  const fetchData = async (isBackground = false) => {
    if (!isBackground) setLoading(true);
    try {
      const [fetchedTasks, fetchedEmployees] = await Promise.all([
        getTasks(isBackground),
        tenantService.getEmployees()
      ]);

      processTaskData(fetchedTasks, fetchedEmployees);
      setError(null);
    } catch (err) {
      console.error('Error fetching data:', err);
      if (!isBackground) setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
      if (setPageLoading) setPageLoading(false);
    }
  };

  useEffect(() => {
    // 1. Initial Hydration from Cache (0s Loading)
    const cachedTasks = getSyncCachedData('tasks');
    const cachedEmps = getSyncCachedData('employees');
    if (cachedTasks && cachedEmps) {
      processTaskData(cachedTasks, cachedEmps);
      setLoading(false);
      if (setPageLoading) setPageLoading(false);
      fetchData(true); // Silent background update
    } else {
      fetchData();
    }
  }, []);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = () => {
      setOpenDropdownId(null);
      setOpenColumnMenuId(null);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Advanced Filtering Logic
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const titleMatch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
      const idMatch = task.id.toLowerCase().includes(searchQuery.toLowerCase());
      const assigneeMatch = task.assignee.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSearch = titleMatch || idMatch || assigneeMatch;

      const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || task.priority.toLowerCase() === priorityFilter.toLowerCase();

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tasks, searchQuery, statusFilter, priorityFilter]);

  const isFiltered = searchQuery !== '' || statusFilter !== 'all' || priorityFilter !== 'all';

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setPriorityFilter('all');
  };

  const [form, setForm] = useState({
    title: '',
    description: '',
    employee: '',
    priority: 'medium',
    status: 'pending',
    date: '',
    type: '',
    store: '',
  });
  const [errors, setErrors] = useState({});

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'critical': return 'text-rose-600 bg-rose-50 border-rose-100 dark:bg-rose-900/20 dark:border-rose-800/50';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-100 dark:bg-orange-900/20 dark:border-orange-800/50';
      case 'medium': return 'text-blue-600 bg-blue-50 border-blue-100 dark:bg-blue-900/20 dark:border-blue-800/50';
      case 'low': return 'text-gray-600 bg-gray-50 border-gray-100 dark:bg-gray-800 dark:border-gray-700';
      default: return 'text-gray-600 bg-gray-50 border-gray-100 dark:bg-gray-800 dark:border-gray-700';
    }
  };

  const getStatusBadge = (statusId) => {
    const category = categories.find(c => c.id === statusId);
    if (!category) return null;
    return (
      <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${category.color.replace('bg-', 'bg-opacity-10 text-').replace('text-', '')} ${category.color.replace('bg-', 'bg-opacity-20 ')}`}>
        <category.icon size={12} />
        {category.label}
      </div>
    );
  };

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = 'Task title is required.';
    if (!form.employee) newErrors.employee = 'Please assign this task to a team member.';
    if (!form.date) newErrors.date = 'A date is required.';
    if (!form.type.trim()) newErrors.type = 'Mission type is required.';
    if (!form.store.trim()) newErrors.store = 'Store name is required.';
    return newErrors;
  };

  const handleDeleteTask = async (id) => {
    const isConfirmed = await showConfirm(
      "Delete Mission",
      "Are you sure you want to delete this mission?",
      "Delete",
      "Cancel",
      "danger"
    );
    if (isConfirmed) {
      try {
        const task = tasks.find(t => t.id === id);
        await deleteTask(id);
        setTasks(prev => prev.filter(t => t.id !== id));

        // Log task deletion
        try {
          logActivity('task_deleted', `Deleted mission: "${task?.title || 'Unknown'}" (ID: ${id})`);
        } catch (e) {
          console.error('Failed to log task deletion:', e);
        }

        setOpenDropdownId(null);
      } catch (err) {
        showAlert('Error', err.message, 'error');
      }
    }
  };

  const handleReassignTask = async (taskId, newEmployeeId) => {
    try {
      const updated = await updateTask(taskId, { employee: newEmployeeId });
      const formatted = {
        ...updated,
        id: updated._id,
        assignee: updated.employee?.name || teamMembers.find(m => m._id === newEmployeeId)?.name || 'Unassigned',
        deadline: updated.date ? new Date(updated.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'No Date',
        category: updated.type || 'General'
      };
      setTasks(prev => prev.map(t => t.id === taskId ? formatted : t));

      // Log task reassignment
      try {
        logActivity('task_reassigned', `Reassigned task: "${formatted.title}" to ${formatted.assignee}`);
      } catch (e) {
        console.error('Failed to log task reassignment:', e);
      }

      if (selectedTask && selectedTask.id === taskId) {
        setSelectedTask(formatted);
      }
      setIsReassigning(false);
    } catch (err) {
      showAlert('Error', err.message, 'error');
    }
  };

  const handleMoveTask = async (id, newStatus) => {
    try {
      await updateTask(id, { status: newStatus });
      setTasks(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
      setOpenDropdownId(null);
    } catch (err) {
      showAlert('Error', err.message, 'error');
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setForm({
      title: task.title,
      description: task.description || '',
      employee: task.employee?._id || task.employee,
      priority: task.priority || 'medium',
      status: task.status || 'pending',
      date: task.date ? new Date(task.date).toISOString().split('T')[0] : '',
      type: task.type || '',
      store: task.store || '',
    });
    setShowModal(true);
    setOpenDropdownId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      if (editingTask) {
        const updated = await updateTask(editingTask.id, form);
        const employeeName = updated.employee?.name || teamMembers.find(m => m._id === updated.employee || m._id === updated.employee?._id || m._id === form.employee)?.name || 'Unassigned';
        setTasks(prev => prev.map(t => t.id === editingTask.id ? {
          ...t,
          ...updated,
          id: updated._id,
          assignee: employeeName,
          deadline: new Date(updated.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
          category: updated.type || 'General'
        } : t));
      } else {
        const created = await createTask(form);
        const employeeName = created.employee?.name || teamMembers.find(m => m._id === created.employee || m._id === created.employee?._id || m._id === form.employee)?.name || 'Unassigned';
        setTasks(prev => [
          {
            ...created,
            id: created._id,
            assignee: employeeName,
            deadline: new Date(created.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
            category: created.type || 'General'
          },
          ...prev,
        ]);

        // Log new task assignment
        try {
          const taskTitle = created.title || form.title;
          logActivity('task_assigned', `Assigned new task: "${taskTitle}" to ${employeeName}`);
        } catch (e) {
          console.error('Failed to log task assignment:', e);
        }
      }
      closeModal();
    } catch (err) {
      showAlert('Error', err.message, 'error');
    }
  };

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTask(null);
    setErrors({});
    setForm({ title: '', description: '', employee: '', priority: 'medium', status: 'pending', date: '', type: '', store: '' });
  };

  // ──── COLUMN MANAGEMENT ────
  const handleAddSection = () => {
    if (!newSectionName.trim()) return;
    const newId = newSectionName.toLowerCase().replace(/\s+/g, '-');
    const themes = ['indigo', 'purple', 'fuchsia', 'pink', 'rose', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal', 'cyan', 'sky', 'blue'];
    const randomTheme = themes[Math.floor(Math.random() * themes.length)];

    setCategories(prev => [...prev, {
      id: newId,
      label: newSectionName,
      icon: LayoutPanelLeft,
      color: `bg-${randomTheme}-600`,
      lightColor: `text-${randomTheme}-600`,
      bgColor: `bg-${randomTheme}-50`,
      theme: randomTheme
    }]);

    setNewSectionName('');
    setShowNewSectionModal(false);
  };

  const handleDeleteSection = (statusId) => {
    // Prevent deleting 'pending' as a safety default
    if (statusId === 'pending') return;

    // Logic for Orphaned Tasks: Move to 'pending'
    setTasks(prev => prev.map(t => t.status === statusId ? { ...t, status: 'pending' } : t));
    setCategories(prev => prev.filter(c => c.id !== statusId));
    setOpenColumnMenuId(null);
  };

  // ──── ACTION DROPDOWN COMPONENT ────
  const TaskActionsDropdown = ({ task, isRight = false }) => {
    if (openDropdownId !== task.id) return null;

    return (
      <div className={`absolute ${isRight ? 'right-0' : 'left-0'} top-full mt-2 w-52 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 z-[100] p-2 animate-in fade-in zoom-in-95 duration-200 overflow-visible`} onClick={e => e.stopPropagation()}>
        <button onClick={() => handleEditTask(task)} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 transition-all text-left">
          <Edit2 size={14} /> Edit Mission
        </button>

        <div className="group/move relative">
          <button className="w-full flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-left">
            <div className="flex items-center gap-3"><ArrowRightCircle size={14} /> Move to...</div>
            <ChevronRight size={12} className="text-gray-400" />
          </button>
          <div className="absolute left-full top-0 ml-1 w-48 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 p-2 hidden group-hover/move:block hover:block z-[110]">
            {categories.filter(c => c.id !== task.status).map(c => (
              <button key={c.id} onClick={() => handleMoveTask(task.id, c.id)} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 transition-all text-left"><c.icon size={12} /> {c.label}</button>
            ))}
          </div>
        </div>
        <div className="h-px bg-gray-50 dark:bg-gray-800 my-1 mx-2"></div>
        <button onClick={() => handleDeleteTask(task.id)} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all text-left"><Trash2 size={14} /> Delete Mission</button>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Mission Board</h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">Assign, monitor, and optimize team operations</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowNewSectionModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-gray-600 dark:text-white rounded-2xl font-black text-sm transition-all hover:border-indigo-200 shadow-sm"
          >
            <Columns size={18} />
            NEW SECTION
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white rounded-2xl font-black text-sm transition-all shadow-xl shadow-indigo-500/20"
          >
            <Plus size={18} />
            CREATE TASK
          </button>
        </div>
      </div>

      {/* Stats Summary Panel */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-1">
        {[
          { label: 'Completed Missions', value: tasks.filter(t => t.status === 'completed').length.toString(), icon: CheckCircle2, color: 'text-emerald-500' },
          { label: 'Active Tasks', value: tasks.filter(t => t.status === 'in-progress').length.toString(), icon: Clock, color: 'text-blue-500' },
          { label: 'Avg. Turnaround', value: '4h 12m', icon: Calendar, color: 'text-indigo-500' },
          { label: 'Resource Load', value: '82%', icon: UserPlus, color: 'text-purple-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-4 hover:scale-105 transition-transform">
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

      {/* Advanced Filters & Controls */}
      <div className="bg-gray-50/50 dark:bg-gray-950/20 p-6 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-2 bg-white dark:bg-gray-900 p-1.5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <button onClick={() => setActiveTab('board')} className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'board' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}><LayoutGrid size={14} /> Board</button>
            <button onClick={() => setActiveTab('list')} className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'list' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}><ListIcon size={14} /> List</button>
          </div>
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search by mission title, ID, or assignee..." className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl text-sm font-bold placeholder-gray-300 outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all shadow-sm" />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-indigo-600 mr-1" />
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Quick Filters:</span>
          </div>
          <div className="relative">
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="appearance-none pl-4 pr-10 py-2.5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl text-[11px] font-black uppercase tracking-widest text-gray-600 dark:text-gray-300 outline-none focus:ring-2 focus:ring-indigo-500/10 cursor-pointer shadow-sm">
              <option value="all">Status: All</option>
              {categories.map(c => (<option key={c.id} value={c.id}>{c.label}</option>))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          <div className="relative">
            <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)} className="appearance-none pl-4 pr-10 py-2.5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl text-[11px] font-black uppercase tracking-widest text-gray-600 dark:text-gray-300 outline-none focus:ring-2 focus:ring-indigo-500/10 cursor-pointer shadow-sm">
              <option value="all">Priority: All</option>
              {['Critical', 'High', 'Medium', 'Low'].map(p => (<option key={p} value={p}>{p}</option>))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          {isFiltered && (<button onClick={clearFilters} className="flex items-center gap-2 px-4 py-2.5 bg-rose-50 dark:bg-rose-900/10 text-rose-600 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-rose-100 transition-all border border-rose-100 dark:border-rose-900/20"><RotateCcw size={14} /> Clear</button>)}
          <div className="ml-auto text-[11px] font-bold text-gray-400 uppercase tracking-wider">Displaying <span className="text-indigo-600">{filteredTasks.length}</span> missions</div>
        </div>
      </div>

      {/* Kanban Board with New Section Logic */}
      {activeTab === 'board' ? (
        <div className="flex overflow-x-auto pb-4 -mx-4 px-4 gap-6 custom-scrollbar">
          {categories.map((col) => (
            <div key={col.id} className="min-w-[320px] flex-shrink-0 space-y-6">
              <div className="flex items-center justify-between px-2 relative">
                <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-[0.2em] flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg shadow-sm ${col.color} flex items-center justify-center`}><col.icon size={13} className="text-white" /></div>
                  {col.label}
                  <span className="text-gray-400 ml-1 font-bold">({filteredTasks.filter(t => t.status === col.id).length})</span>
                </h3>
                <button
                  className="p-1 px-2 text-gray-300 hover:text-indigo-600 transition-all rounded-md"
                  onClick={(e) => { e.stopPropagation(); setOpenColumnMenuId(openColumnMenuId === col.id ? null : col.id); }}
                >
                  <MoreHorizontal size={18} />
                </button>

                {/* Column Action Menu */}
                {openColumnMenuId === col.id && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 z-[110] p-2 animate-in fade-in zoom-in-95" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => { setForm(prev => ({ ...prev, status: col.id })); setShowModal(true); setOpenColumnMenuId(null); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-indigo-600 transition-all text-left"
                    >
                      <Plus size={14} /> Add Mission
                    </button>

                    {col.id !== 'pending' && (
                      <div className="mt-1 pt-1 border-t border-gray-50 dark:border-gray-800">
                        <button
                          onClick={() => handleDeleteSection(col.id)}
                          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all text-left"
                        >
                          <Trash2 size={14} /> Delete Column
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-4 min-h-[500px] p-2 rounded-[2.5rem] bg-gray-50/50 dark:bg-gray-950/20 border-2 border-dashed border-gray-100 dark:border-gray-800/50">
                {filteredTasks.filter(t => t.status === col.id).map((task) => (
                  <div key={task.id} onClick={() => setSelectedTask(task)} className="bg-white dark:bg-gray-900 px-4 py-3.5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer group border-l-[4px]" style={{ borderLeftColor: col.id === 'blocked' ? '#f43f5e' : col.id === 'completed' ? '#10b981' : col.id === 'in-progress' ? '#3b82f6' : col.id === 'in-review' ? '#f59e0b' : '#64748b' }}>
                    <div className="flex justify-between items-start mb-2.5 relative">
                      <span className="text-[9px] font-black text-gray-400 dark:text-gray-500 tracking-tighter uppercase">{task.id}</span>
                      <div className="flex items-center gap-1">
                        <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider border ${getPriorityColor(task.priority)}`}>{task.priority}</span>
                        <button className="p-1 text-gray-300 hover:text-indigo-600 transition-all rounded-md" onClick={(e) => { e.stopPropagation(); setOpenDropdownId(openDropdownId === task.id ? null : task.id); }}><MoreVertical size={14} /></button>
                      </div>
                      <TaskActionsDropdown task={task} isRight={true} />
                    </div>
                    <h4 className="text-[13px] font-bold text-gray-800 dark:text-white leading-snug mb-3 group-hover:text-indigo-600 transition-colors line-clamp-2">{task.title}</h4>
                    <div className="flex items-center justify-between pt-3 border-t border-gray-50 dark:border-gray-800">
                      <div className="flex items-center gap-2"><div className="w-5 h-5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-[8px] font-bold text-indigo-600 border border-indigo-100 dark:border-indigo-800/50">{(task.assignee || '').split(' ').filter(Boolean).map(n => n[0]).join('')}</div><span className="text-[9px] font-bold text-gray-500 dark:text-gray-400">{task.assignee}</span></div>
                      <div className={`flex items-center gap-1 text-[8px] font-black uppercase tracking-widest ${task.status === 'blocked' ? 'text-rose-500' : 'text-gray-400 dark:text-gray-500'}`}><Clock size={10} /> {task.deadline}</div>
                    </div>
                  </div>
                ))}
                <button onClick={(e) => { e.stopPropagation(); setForm(prev => ({ ...prev, status: col.id })); setShowModal(true); }} className="w-full py-4 rounded-3xl border-2 border-dashed border-gray-100 dark:border-gray-800 flex items-center justify-center text-gray-300 hover:text-indigo-500 hover:border-indigo-500/30 hover:bg-indigo-50/10 transition-all font-bold text-[10px] uppercase tracking-widest"><Plus size={14} className="mr-2" /> Add Mission</button>
              </div>
            </div>
          ))}

          {/* Add New Section Dropzone/Button */}
          <div className="min-w-[320px] flex-shrink-0 flex items-center justify-center">
            <button
              onClick={() => setShowNewSectionModal(true)}
              className="w-full h-full min-h-[500px] rounded-[2.5rem] border-2 border-dashed border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center gap-4 text-gray-300 hover:text-indigo-500 hover:border-indigo-500/30 hover:bg-indigo-50/5 transition-all group"
            >
              <div className="p-4 rounded-3xl bg-gray-50 dark:bg-gray-800 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20 transition-all">
                <Trello size={32} />
              </div>
              <div className="text-center">
                <p className="text-xs font-black uppercase tracking-widest">Add New Section</p>
                <p className="text-[10px] font-bold opacity-60 mt-1">Create custom operation flow</p>
              </div>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden animate-in fade-in slide-in-from-top-4">
          <div className="overflow-x-auto"><table className="w-full border-collapse"><thead><tr className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800"><th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Task ID</th><th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Mission Title</th><th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Assignee</th><th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Priority</th><th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th><th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Deadline</th><th className="px-8 py-5 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Action</th></tr></thead><tbody className="divide-y divide-gray-50 dark:divide-gray-800">{filteredTasks.map((task) => (<tr key={task.id} onClick={() => setSelectedTask(task)} className="group hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 transition-all cursor-pointer"><td className="px-8 py-5"><span className="text-[11px] font-black text-gray-400 dark:text-gray-500 tracking-tighter uppercase">{task.id}</span></td><td className="px-6 py-5"><div><p className="text-sm font-bold text-gray-800 dark:text-white group-hover:text-indigo-600 transition-colors">{task.title}</p><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">{task.category}</p></div></td><td className="px-6 py-5"><div className="flex items-center gap-2.5"><div className="w-7 h-7 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-[10px] font-black text-indigo-600 border border-indigo-100 dark:border-indigo-800/50 shadow-sm">{task.assignee.split(' ').map(n => n[0]).join('')}</div><span className="text-xs font-bold text-gray-600 dark:text-gray-400">{task.assignee}</span></div></td><td className="px-6 py-5"><span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${getPriorityColor(task.priority)}`}>{task.priority}</span></td><td className="px-6 py-5">{getStatusBadge(task.status)}</td><td className="px-6 py-5"><div className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest ${task.status === 'blocked' ? 'text-rose-500' : 'text-gray-500 dark:text-gray-400'}`}><Calendar size={12} className="opacity-60" /> {task.deadline}</div></td><td className="px-8 py-5 text-right relative"><button onClick={(e) => { e.stopPropagation(); setOpenDropdownId(openDropdownId === task.id ? null : task.id); }} className="p-2.5 rounded-xl hover:bg-white dark:hover:bg-gray-800 text-gray-300 hover:text-indigo-600 transition-all shadow-none hover:shadow-sm"><MoreVertical size={16} /></button><TaskActionsDropdown task={task} isRight={true} /></td></tr>))}</tbody></table></div>
          {filteredTasks.length === 0 && (<div className="py-20 text-center"><div className="mx-auto w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-300 mb-4"><ClipboardList size={32} /></div><p className="text-sm font-bold text-gray-400 uppercase tracking-widest">No missions match your search</p><button onClick={clearFilters} className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-500/20 active:scale-95 transition-all">Reset Filters</button></div>)}
        </div>
      )}

      {/* ── MISSION DETAIL MODAL ── */}
      {selectedTask && ReactDOM.createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-[8px]" onClick={(e) => { if (e.target === e.currentTarget) setSelectedTask(null); }}>
          <div className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden animate-in fade-in zoom-in-95 duration-400 flex flex-col md:flex-row">
            <div className="md:w-24 py-8 flex md:flex-col items-center justify-start gap-8 bg-slate-700 dark:bg-slate-700 border-r border-white/5"><div className="bg-white/5 p-4 rounded-[1.5rem] border border-white/10 shadow-inner">{React.createElement(categories.find(c => c.id === selectedTask.status)?.icon || Info, { size: 24, className: "text-indigo-400" })}</div><div className="hidden md:flex flex-col items-center gap-6 py-2"><div className="h-16 w-px bg-gradient-to-b from-white/0 via-white/10 to-white/0"></div><div className="text-white/30 text-[8px] font-black uppercase tracking-[0.4em] [writing-mode:vertical-lr] rotate-180 text-center">MISSION LOG • {selectedTask.id.slice(-6)}</div><div className="h-16 w-px bg-gradient-to-b from-white/0 via-white/10 to-white/0"></div></div></div>
            <div className="flex-1 p-8 md:p-10 space-y-8">
              <div className="flex justify-between items-start"><div className="space-y-1"><div className="flex items-center gap-2"><span className={`px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${getPriorityColor(selectedTask.priority)}`}>{selectedTask.priority}</span><span className="text-[9px] font-bold text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider">{selectedTask.category}</span></div><h2 className="text-2xl font-black text-gray-900 dark:text-white leading-tight">{selectedTask.title}</h2></div><button onClick={() => setSelectedTask(null)} className="p-2 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-400 hover:text-rose-500 transition-all active:scale-95"><X size={20} /></button></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-5">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">Mission Lead</label>
                      <button onClick={() => setIsReassigning(!isReassigning)} className="text-[9px] font-black text-indigo-600 hover:text-indigo-700 uppercase tracking-widest transition-all">
                        {isReassigning ? 'Cancel' : 'Reassign'}
                      </button>
                    </div>
                    {isReassigning ? (
                      <div className="relative animate-in slide-in-from-top-1 duration-300">
                        <select
                          onChange={(e) => handleReassignTask(selectedTask.id, e.target.value)}
                          className="w-full appearance-none px-4 py-3 bg-indigo-50/50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/50 rounded-2xl text-[11px] font-bold text-indigo-600 outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
                          defaultValue=""
                        >
                          <option value="" disabled>Select new assignee...</option>
                          {teamMembers.map(member => (
                            <option key={member._id} value={member._id}>{member.name}</option>
                          ))}
                        </select>
                        <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-400 pointer-events-none" />
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                        <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-[10px] font-black text-white shadow-lg shadow-indigo-500/20">{(selectedTask.assignee || '').split(' ').filter(Boolean).map(n => n[0]).join('')}</div>
                        <div><p className="text-xs font-black text-gray-900 dark:text-white">{selectedTask.assignee}</p><p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Operational Specialist</p></div>
                      </div>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">Compliance Deadline</label>
                    <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                      <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/20"><Clock size={16} /></div>
                      <div><p className="text-xs font-black text-gray-900 dark:text-white">{selectedTask.deadline}</p><p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Before End of Day</p></div>
                    </div>
                  </div>
                </div>
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">Mission Intelligence</label>
                    <p className="text-xs font-bold text-gray-600 dark:text-gray-400 leading-relaxed bg-gray-50 dark:bg-gray-800/30 p-4 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800 line-clamp-4">{selectedTask.description || "No specific mission intelligence provided."}</p>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <div className="space-y-1">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Status</p>
                      {getStatusBadge(selectedTask.status)}
                    </div>
                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-indigo-500/20 active:scale-95 transition-all" onClick={() => handleEditTask(selectedTask)}>Edit</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ── CREATE/EDIT TASK MODAL ── */}
      {showModal && ReactDOM.createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-[10px]" onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
          <div className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between px-10 pt-10 pb-6 border-b border-gray-100 dark:border-gray-800"><div><h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{editingTask ? 'Edit Mission' : 'Create New Task'}</h2><p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Fill in the mission details below</p></div><button onClick={closeModal} className="p-2.5 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"><X size={20} /></button></div>
            <form onSubmit={handleSubmit} className="px-10 py-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div><label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Task Title <span className="text-rose-500">*</span></label><input type="text" value={form.title} onChange={e => handleChange('title', e.target.value)} placeholder="e.g. Quarterly Route Audit – North Zone" className={`w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-800 border rounded-2xl text-sm font-bold text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all ${errors.title ? 'border-rose-400' : 'border-gray-100 dark:border-gray-700'}`} />{errors.title && <p className="mt-1.5 text-[10px] font-bold text-rose-500">{errors.title}</p>}</div>
              <div><label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Description</label><textarea rows={3} value={form.description} onChange={e => handleChange('description', e.target.value)} placeholder="Describe the objective, scope, and expected deliverables…" className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl text-sm font-bold text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none" /></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div><label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Mission Type <span className="text-rose-500">*</span></label><input type="text" value={form.type} onChange={e => handleChange('type', e.target.value)} placeholder="Audit, Retail, etc." className={`w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-800 border rounded-2xl text-sm font-bold text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all ${errors.type ? 'border-rose-400' : 'border-gray-100 dark:border-gray-700'}`} />{errors.type && <p className="mt-1.5 text-[10px] font-bold text-rose-500">{errors.type}</p>}</div>
                <div><label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Store Name <span className="text-rose-500">*</span></label><input type="text" value={form.store} onChange={e => handleChange('store', e.target.value)} placeholder="Location name" className={`w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-800 border rounded-2xl text-sm font-bold text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all ${errors.store ? 'border-rose-400' : 'border-gray-100 dark:border-gray-700'}`} />{errors.store && <p className="mt-1.5 text-[10px] font-bold text-rose-500">{errors.store}</p>}</div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5"><div><label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Assign To <span className="text-rose-500">*</span></label><div className="relative"><select value={form.employee} onChange={e => handleChange('employee', e.target.value)} className={`w-full appearance-none px-5 py-3.5 bg-gray-50 dark:bg-gray-800 border rounded-2xl text-sm font-bold text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all cursor-pointer ${errors.employee ? 'border-rose-400' : 'border-gray-100 dark:border-gray-700'} ${!form.employee ? 'text-gray-300' : ''}`}><option value="" disabled>Select team member</option>{teamMembers.map(member => (<option key={member._id} value={member._id}>{member.name}</option>))}</select><ChevronDown size={15} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" /></div>{errors.employee && <p className="mt-1.5 text-[10px] font-bold text-rose-500">{errors.employee}</p>}</div><div><label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Date <span className="text-rose-500">*</span></label><input type="date" value={form.date} onChange={e => handleChange('date', e.target.value)} className={`w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-800 border rounded-2xl text-sm font-bold text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all ${errors.date ? 'border-rose-400' : 'border-gray-100 dark:border-gray-700'}`} />{errors.date && <p className="mt-1.5 text-[10px] font-bold text-rose-500">{errors.date}</p>}</div></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5"><div><label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Priority</label><div className="flex gap-2 flex-wrap">{['low', 'medium', 'high'].map(p => (<button key={p} type="button" onClick={() => handleChange('priority', p)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${form.priority === p ? getPriorityColor(p) + ' shadow-sm' : 'border-gray-100 dark:border-gray-700 text-gray-400 bg-gray-50 dark:bg-gray-800 hover:border-gray-300'}`}>{p}</button>))}</div></div><div><label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Status</label><div className="grid grid-cols-2 gap-2">{categories.map(s => (<button key={s.id} type="button" onClick={() => handleChange('status', s.id)} className={`px-3 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all flex items-center justify-center gap-2 ${form.status === s.id ? `${s.bgColor} ${s.lightColor} border-${s.theme}-200 dark:bg-${s.theme}-900/20 dark:text-${s.theme}-400 dark:border-${s.theme}-800/50 shadow-sm shadow-${s.theme}-500/10` : 'border-gray-50 dark:border-gray-800 text-gray-400 bg-gray-50 dark:bg-gray-800 hover:border-gray-200'}`}><s.icon size={14} className={form.status === s.id ? s.lightColor : 'text-gray-400'} /> {s.label}</button>))}</div></div></div>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800"><button type="button" onClick={closeModal} className="px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all">Cancel</button><button type="submit" className="flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-indigo-500/25">{editingTask ? <Edit2 size={16} /> : <Plus size={16} />} {editingTask ? 'Update Mission' : 'Create Task'}</button></div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* ── NEW SECTION MODAL ── */}
      {showNewSectionModal && ReactDOM.createPortal(
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-[10px]" onClick={(e) => { if (e.target === e.currentTarget) setShowNewSectionModal(false); }}>
          <div className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden animate-in fade-in zoom-in-95 duration-300 p-10">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Add New Section</h2>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-2 mb-8">Define a new stage for your operation flow</p>

            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Section Name</label>
                <input
                  type="text"
                  value={newSectionName}
                  onChange={e => setNewSectionName(e.target.value)}
                  placeholder="e.g. Testing, Production, Archive..."
                  className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl text-sm font-bold text-gray-800 dark:text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  autoFocus
                />
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button
                  onClick={() => { setShowNewSectionModal(false); setNewSectionName(''); }}
                  className="flex-1 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddSection}
                  className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-indigo-500/25"
                >
                  Create Section
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default ManagerTasks;
