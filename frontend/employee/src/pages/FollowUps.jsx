import React, { useState, useEffect } from 'react';
import { 
  RotateCcw, Calendar, Phone, Store, User, MapPin, 
  MessageSquare, CheckCircle, XCircle, Clock, Plus, Activity, AlertCircle, ArrowLeft,
  Navigation
} from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { getFollowUps, addFollowUpHistory } from '../services/followUpService';
import { useDialog } from '../context/DialogContext';

const EmployeeFollowUps = () => {
  const [followUps, setFollowUps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFollowUp, setSelectedFollowUp] = useState(null);
  const [filter, setFilter] = useState('All');
  
  // New entry state
  const [newAction, setNewAction] = useState('called');
  const [newNote, setNewNote] = useState('');
  const [newOutcome, setNewOutcome] = useState('interested');
  const [newSchedule, setNewSchedule] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { setPageLoading } = useOutletContext() || {};
  const { showAlert } = useDialog();

  const fetchFollowUps = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const data = await getFollowUps();
      setFollowUps(data);
    } catch (err) {
      console.error('Failed to fetch follow-ups:', err);
      showAlert('Failed to load follow-ups', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
      if (setPageLoading) setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchFollowUps();
  }, []);

  const handleAddHistory = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return showAlert('Note is required', 'warning');
    
    setSubmitting(true);
    try {
      const payload = {
        action: newAction,
        note: newNote,
        outcome: newOutcome,
      };
      if (newSchedule) payload.scheduledDate = new Date(newSchedule);

      const updated = await addFollowUpHistory(selectedFollowUp._id, payload);
      
      // Update local state
      setFollowUps(prev => prev.map(f => f._id === updated._id ? updated : f));
      setSelectedFollowUp(updated);
      
      // Reset form
      setNewNote('');
      setNewSchedule('');
      showAlert('Interaction logged successfully', 'success');
    } catch (err) {
      showAlert('Failed to log interaction', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const statusConfig = {
    'pending': { color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-500/10', border: 'border-amber-100 dark:border-amber-500/20', icon: Clock, label: 'Pending' },
    'in_progress': { color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-500/10', border: 'border-blue-100 dark:border-blue-500/20', icon: Activity, label: 'In Progress' },
    'converted': { color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-500/10', border: 'border-emerald-100 dark:border-emerald-500/20', icon: CheckCircle, label: 'Converted' },
    'lost': { color: 'text-rose-600', bg: 'bg-rose-50 dark:bg-rose-500/10', border: 'border-rose-100 dark:border-rose-500/20', icon: XCircle, label: 'Lost' }
  };

  const filteredFollowUps = filter === 'All' 
    ? followUps 
    : followUps.filter(f => f.status === filter.toLowerCase() || (filter === 'In Progress' && f.status === 'in_progress'));

  const activeStats = {
    pending: followUps.filter(f => f.status === 'pending').length,
    inProgress: followUps.filter(f => f.status === 'in_progress').length,
    converted: followUps.filter(f => f.status === 'converted').length,
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 px-4 md:px-8 pb-24 pt-10">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">Client Pipeline</span>
            </div>
            <h1 className="text-4xl font-black text-gray-950 dark:text-white tracking-tighter">Follow-ups</h1>
            <p className="text-xs font-bold text-gray-500 mt-2 uppercase tracking-widest">Manage your assigned continuations and reschedules.</p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => fetchFollowUps(true)}
              className={`flex items-center gap-2 px-4 py-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-gray-500 dark:text-gray-400 font-bold rounded-2xl transition-all shadow-sm hover:shadow-md hover:text-blue-600 hover:border-blue-100 dark:hover:border-blue-500/30 ${refreshing ? 'opacity-50' : ''}`}
            >
              <Activity size={18} className={refreshing ? 'animate-spin' : ''} />
              <span className="text-sm uppercase tracking-widest">{refreshing ? 'Syncing...' : 'Live Sync'}</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 animate-pulse text-gray-300">
             <RotateCcw size={64} className="mb-4 opacity-10" />
             <p className="text-[10px] font-black uppercase tracking-[0.4em]">Loading Pipeline...</p>
          </div>
        ) : selectedFollowUp ? (
          <div className="animate-in slide-in-from-bottom-12 duration-700 flex flex-col relative">
            <button 
              onClick={() => setSelectedFollowUp(null)}
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-blue-600 mb-6 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 px-4 py-2 w-fit rounded-full shadow-sm"
            >
              <ArrowLeft size={14} /> Back to Pipeline
            </button>

            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left Column: Details */}
              <div className="w-full lg:w-[40%] space-y-6">
                <div className="bg-white dark:bg-gray-900 p-8 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-xl relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
                      <Store size={150} />
                   </div>
                   <div className="relative z-10">
                     <div className="flex items-center gap-3 mb-8">
                        <div className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${statusConfig[selectedFollowUp.status].bg} ${statusConfig[selectedFollowUp.status].color} ${statusConfig[selectedFollowUp.status].border} shadow-sm`}>
                          {statusConfig[selectedFollowUp.status].label}
                        </div>
                        <div className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${selectedFollowUp.priority === 'high' || selectedFollowUp.priority === 'critical' ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-gray-50 text-gray-500 border-gray-100'} border shadow-sm`}>
                          Priority: {selectedFollowUp.priority}
                        </div>
                     </div>

                     <h2 className="text-3xl font-black text-gray-900 dark:text-white leading-tight tracking-tight mb-3">
                       {selectedFollowUp.storeName}
                     </h2>
                     <p className="text-sm font-bold text-gray-500 mb-8 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800">
                       <span className="block text-[9px] font-black uppercase tracking-[0.2em] text-blue-500 mb-1">Reason for Follow-up</span>
                       "{selectedFollowUp.reason}"
                     </p>

                     <div className="space-y-6">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-50 dark:bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 shrink-0">
                             <User size={20} />
                          </div>
                          <div>
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Client / Owner</span>
                            <p className="text-sm font-bold text-gray-900 dark:text-white">{selectedFollowUp.ownerName || 'Not Provided'}</p>
                          </div>
                       </div>
                       
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 shrink-0">
                             <Phone size={20} />
                          </div>
                          <div>
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Mobile Contact</span>
                            <p className="text-sm font-bold text-gray-900 dark:text-white">{selectedFollowUp.mobileNumber || 'Not Provided'}</p>
                          </div>
                       </div>
                       
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-500 shrink-0">
                             <MapPin size={20} />
                          </div>
                          <div>
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Target Location</span>
                            <p className="text-sm font-bold text-gray-900 dark:text-white">{selectedFollowUp.city || selectedFollowUp.address || 'Unknown'}</p>
                          </div>
                       </div>
                     </div>

                     <div className="mt-8 flex gap-3">
                        <button className="flex-1 flex items-center justify-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-emerald-100 transition-all">
                          <Phone size={14} /> Call Client
                        </button>
                        <button className="flex-1 flex items-center justify-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-indigo-100 transition-all">
                          <Navigation size={14} /> Navigate
                        </button>
                     </div>
                   </div>
                </div>
              </div>

              {/* Right Column: Embedded History + Entry Form */}
              <div className="w-full lg:w-[60%] flex flex-col gap-8 h-[80vh]">
                {/* Add New History Card */}
                {selectedFollowUp.status !== 'converted' && selectedFollowUp.status !== 'lost' && (
                  <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-8 rounded-[3rem] shadow-sm shrink-0 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 opacity-[0.03] transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-700 text-indigo-500">
                       <MessageSquare size={140} />
                    </div>
                    <div className="relative z-10">
                      <h3 className="text-[12px] font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
                        <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center"><Plus size={16} /></div>
                        Log Ongoing Action
                      </h3>
                      <form onSubmit={handleAddHistory} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 ml-1 mb-2 block">Action Taken</label>
                            <select 
                              value={newAction} 
                              onChange={e => setNewAction(e.target.value)}
                              className="w-full bg-gray-50 dark:bg-gray-800/50 border-2 border-gray-100 dark:border-gray-800 rounded-2xl px-5 py-3.5 text-sm font-bold outline-none ring-offset-0 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 text-gray-900 dark:text-white transition-all cursor-pointer"
                            >
                              <option value="called">Phone Call Made</option>
                              <option value="visited">Field Visit Executed</option>
                              <option value="rescheduled">Rescheduled Appointment</option>
                              <option value="converted">Mission Converted (Won)</option>
                              <option value="lost">Mission Lost (Rejected)</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 ml-1 mb-2 block">Client Response</label>
                            <select 
                              value={newOutcome} 
                              onChange={e => setNewOutcome(e.target.value)}
                              className="w-full bg-gray-50 dark:bg-gray-800/50 border-2 border-gray-100 dark:border-gray-800 rounded-2xl px-5 py-3.5 text-sm font-bold outline-none ring-offset-0 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 text-gray-900 dark:text-white transition-all cursor-pointer"
                            >
                              <option value="interested">Positive / Showing Interest</option>
                              <option value="not_reachable">Not Reachable / Busy</option>
                              <option value="callback">Asked to call back later</option>
                            </select>
                          </div>
                        </div>
                        
                        <div>
                          <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 ml-1 mb-2 block">Interaction Synthesis</label>
                          <textarea 
                            value={newNote}
                            onChange={e => setNewNote(e.target.value)}
                            placeholder="Provide detailed notes regarding the client's current stance..."
                            className="w-full bg-gray-50 dark:bg-gray-800/50 border-2 border-gray-100 dark:border-gray-800 rounded-2xl px-5 py-4 text-sm font-medium outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 resize-none h-28 custom-scrollbar transition-all"
                            required
                          />
                        </div>

                        <div className="flex flex-col md:flex-row items-end justify-between gap-6 pt-2">
                          <div className="flex-1 w-full relative">
                            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 ml-1 mb-2 block">Next Target Follow-up</label>
                            <input 
                              type="date" 
                              value={newSchedule}
                              onChange={e => setNewSchedule(e.target.value)}
                              className="w-full bg-gray-50 dark:bg-gray-800/50 border-2 border-gray-100 dark:border-gray-800 rounded-2xl px-5 py-3.5 text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 text-gray-900 dark:text-white transition-all"
                            />
                          </div>
                          <button 
                            type="submit" 
                            disabled={submitting}
                            className="w-full md:w-auto px-8 py-4 bg-indigo-600 text-white hover:bg-indigo-700 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shrink-0 shadow-lg shadow-indigo-600/20 disabled:opacity-70 active:scale-95 border-2 border-indigo-600"
                          >
                            {submitting ? 'Saving...' : 'Commit Intelligence'}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

                {/* History Timeline */}
                <div className="flex-1 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[3rem] p-8 overflow-y-auto no-scrollbar shadow-sm relative">
                  <div className="sticky top-0 bg-white dark:bg-gray-900 pb-6 z-10 border-b border-gray-50 dark:border-gray-800 mb-6 flex justify-between items-center">
                    <h3 className="text-[12px] font-black text-gray-900 dark:text-white uppercase tracking-[0.2em]">Operational Timeline</h3>
                    <div className="px-3 py-1 bg-gray-50 dark:bg-gray-800 rounded-full text-[9px] font-black uppercase tracking-widest text-gray-400 border border-gray-100 dark:border-gray-700">
                      {selectedFollowUp.history?.length || 0} Entries
                    </div>
                  </div>
                  
                  <div className="relative pl-6">
                    {/* Vertical Line */}
                    <div className="absolute top-0 bottom-0 left-6 w-1 bg-gray-50 dark:bg-gray-800 rounded-full" />

                    {selectedFollowUp.history?.slice().reverse().map((entry, idx) => (
                      <div key={idx} className="relative mb-12 last:mb-0 group">
                        {/* Node Bullet */}
                        <div className="absolute -left-[5.5px] top-1.5 w-4 h-4 rounded-full border-4 border-white dark:border-gray-900 bg-blue-500 shadow-[0_0_0_4px_rgba(59,130,246,0.1)] group-hover:scale-125 transition-transform" />
                        
                        <div className="pl-8 -mt-1.5">
                          <div className="flex items-center gap-3 flex-wrap mb-3">
                            <span className="px-3 py-1.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[9px] font-black uppercase tracking-widest rounded-xl border border-blue-100 dark:border-blue-500/20 shadow-sm">
                              {entry.action.replace('_', ' ')}
                            </span>
                            {entry.outcome && (
                              <span className="px-3 py-1.5 bg-gray-50 dark:bg-gray-800 text-gray-500 text-[9px] font-black uppercase tracking-widest rounded-xl border border-gray-100 dark:border-gray-700">
                                {entry.outcome.replace('_', ' ')}
                              </span>
                            )}
                            <span className="text-[10px] font-bold text-gray-400 tabular-nums ml-auto w-full sm:w-auto">
                              {new Date(entry.timestamp).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                            </span>
                          </div>

                          <div className="p-5 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800 inline-block w-full shadow-sm group-hover:border-blue-200 dark:group-hover:border-blue-500/30 transition-colors">
                            <p className="text-sm font-bold text-gray-700 dark:text-gray-300 italic">"{entry.note}"</p>
                          </div>
                          <div className="flex items-center gap-2 mt-3">
                            <div className="w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-[10px] font-black text-gray-500">
                              {(entry.performedByName || 'S')[0].toUpperCase()}
                            </div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                              {entry.performedByName || 'System Auto-Generated'}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* KPI Filters */}
            <div className="flex flex-wrap items-center gap-3 mb-8">
              <button
                onClick={() => setFilter('All')}
                className={`flex-1 min-w-[120px] p-4 rounded-[2rem] border text-left transition-all ${filter === 'All' ? 'border-gray-900 dark:border-gray-500 ring-2 ring-gray-900/10 dark:ring-gray-500/20 shadow-md bg-white dark:bg-gray-900 scale-105 z-10' : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/50 opacity-70 hover:opacity-100'}`}
              >
                 <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-2">Total Assigned</span>
                 <span className="text-3xl font-black text-gray-900 dark:text-white tabular-nums leading-none">{followUps.length}</span>
              </button>
              
              <button
                onClick={() => setFilter('Pending')}
                className={`flex-1 min-w-[140px] p-4 rounded-[2rem] border text-left transition-all flex items-start justify-between gap-3 ${filter === 'Pending' ? 'border-amber-500 ring-2 ring-amber-500/20 shadow-md bg-amber-50/30 dark:bg-amber-500/5 scale-105 z-10' : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:bg-amber-50/10 opacity-70 hover:opacity-100'}`}
              >
                 <div>
                   <span className="text-[9px] font-black text-amber-600 uppercase tracking-widest block mb-1">To Do</span>
                   <span className="text-3xl font-black text-amber-600 tabular-nums leading-none">{activeStats.pending}</span>
                 </div>
                 <div className="p-2 bg-amber-100 dark:bg-amber-500/20 text-amber-600 rounded-xl"><Clock size={20} /></div>
              </button>

              <button
                onClick={() => setFilter('In Progress')}
                className={`flex-1 min-w-[140px] p-4 rounded-[2rem] border text-left transition-all flex items-start justify-between gap-3 ${filter === 'In Progress' ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-md bg-blue-50/30 dark:bg-blue-500/5 scale-105 z-10' : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:bg-blue-50/10 opacity-70 hover:opacity-100'}`}
              >
                 <div>
                   <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest block mb-1">Ongoing</span>
                   <span className="text-3xl font-black text-blue-600 tabular-nums leading-none">{activeStats.inProgress}</span>
                 </div>
                 <div className="p-2 bg-blue-100 dark:bg-blue-500/20 text-blue-600 rounded-xl"><Activity size={20} /></div>
              </button>

              <button
                onClick={() => setFilter('Converted')}
                className={`flex-1 min-w-[140px] p-4 rounded-[2rem] border text-left transition-all flex items-start justify-between gap-3 ${filter === 'Converted' ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-md bg-emerald-50/30 dark:bg-emerald-500/5 scale-105 z-10' : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:bg-emerald-50/10 opacity-70 hover:opacity-100'}`}
              >
                 <div>
                   <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest block mb-1">Won</span>
                   <span className="text-3xl font-black text-emerald-600 tabular-nums leading-none">{activeStats.converted}</span>
                 </div>
                 <div className="p-2 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 rounded-xl"><CheckCircle size={20} /></div>
              </button>
            </div>

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 content-start animate-in slide-in-from-bottom-8 duration-700">
              {filteredFollowUps.map(fu => {
                const statusInfo = statusConfig[fu.status] || statusConfig['pending'];
                const SIcon = statusInfo.icon;
                return (
                  <div 
                    key={fu._id} 
                    onClick={() => setSelectedFollowUp(fu)}
                    className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 p-6 flex flex-col cursor-pointer hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-200 dark:hover:border-blue-500/30 hover:-translate-y-2 transition-all duration-500 group"
                  >
                    <div className="flex items-center justify-between mb-5">
                      <div className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${statusInfo.bg} ${statusInfo.color} ${statusInfo.border} flex items-center gap-1.5 shadow-sm`}>
                        <SIcon size={12} />
                        {statusInfo.label}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[8px] font-black uppercase text-gray-400">Pri</span>
                        <div className={`w-2.5 h-2.5 rounded-full ${fu.priority === 'high' || fu.priority === 'critical' ? 'bg-rose-500 shadow-[0_0_0_3px_rgba(244,63,94,0.2)] animate-pulse' : 'bg-gray-200 dark:bg-gray-700'}`} title={`Priority: ${fu.priority}`} />
                      </div>
                    </div>

                    <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight mb-3 truncate group-hover:text-blue-600 transition-colors">
                      {fu.storeName}
                    </h3>
                    
                    <div className="space-y-3 mb-6 p-4 bg-gray-50/80 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800 flex-1 group-hover:bg-blue-50/50 dark:group-hover:bg-blue-500/5 group-hover:border-blue-100 dark:group-hover:border-blue-500/10 transition-colors">
                      <div className="flex items-center gap-3 text-[11px] font-bold text-gray-600 dark:text-gray-300 truncate">
                        <div className="w-6 h-6 rounded-lg bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center shrink-0"><User size={12} className="text-blue-500"/></div>
                        {fu.ownerName || 'Unknown Owner'}
                      </div>
                      <div className="flex items-center gap-3 text-[11px] font-bold text-gray-600 dark:text-gray-300 truncate">
                        <div className="w-6 h-6 rounded-lg bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center shrink-0"><MapPin size={12} className="text-rose-500"/></div>
                        {fu.city || 'No Location Data'}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-auto">
                       <div className="flex flex-col gap-0.5">
                          <span className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-400">Next Action</span>
                          <span className="text-xs font-black text-gray-900 dark:text-gray-200">
                             {fu.nextFollowUpDate ? new Date(fu.nextFollowUpDate).toLocaleDateString() : 'ASAP'}
                          </span>
                       </div>
                       <div className="w-10 h-10 rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-400 group-hover:bg-blue-600 group-hover:text-white group-hover:-rotate-12 transition-all shadow-sm">
                         <MessageSquare size={16} />
                       </div>
                    </div>
                  </div>
                );
              })}
              
              {filteredFollowUps.length === 0 && (
                <div className="col-span-full py-40 flex flex-col items-center justify-center border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-[3rem] bg-white/50 dark:bg-gray-900/50">
                  <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
                    <RotateCcw size={32} className="text-gray-300 dark:text-gray-600" />
                  </div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Pipeline Empty</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EmployeeFollowUps;
