import React, { useState, useEffect } from 'react';
import { 
  RotateCcw, Calendar, Phone, Store, User, MapPin, 
  MessageSquare, CheckCircle, XCircle, Clock, Plus, Activity, AlertCircle, ArrowLeft
} from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { getFollowUps, updateFollowUp, addFollowUpHistory } from '../services/followUpService';
import { useDialog } from '../context/DialogContext';

const FollowUps = () => {
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

  const handleUpdateStatus = async (id, status) => {
    try {
      await updateFollowUp(id, { status });
      setFollowUps(prev => prev.map(f => f._id === id ? { ...f, status } : f));
      if (selectedFollowUp?._id === id) {
        setSelectedFollowUp(prev => ({ ...prev, status }));
      }
      showAlert(`Follow-up marked as ${status}`, 'success');
    } catch (err) {
      showAlert('Failed to update status', 'error');
    }
  };

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
      showAlert('History added successfully', 'success');
    } catch (err) {
      showAlert('Failed to add history', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const statusConfig = {
    'pending': { color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-500/10', border: 'border-amber-100', icon: Clock, label: 'Pending' },
    'in_progress': { color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-500/10', border: 'border-blue-100', icon: Activity, label: 'In Progress' },
    'converted': { color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-500/10', border: 'border-emerald-100', icon: CheckCircle, label: 'Converted' },
    'lost': { color: 'text-rose-600', bg: 'bg-rose-50 dark:bg-rose-500/10', border: 'border-rose-100', icon: XCircle, label: 'Lost' }
  };

  const filteredFollowUps = filter === 'All' 
    ? followUps 
    : followUps.filter(f => f.status === filter.toLowerCase() || (filter === 'In Progress' && f.status === 'in_progress'));

  const activeStats = {
    pending: followUps.filter(f => f.status === 'pending').length,
    inProgress: followUps.filter(f => f.status === 'in_progress').length,
    converted: followUps.filter(f => f.status === 'converted').length,
    lost: followUps.filter(f => f.status === 'lost').length,
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 max-w-[1400px] mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
            <span className="text-[10px] font-black text-violet-500 uppercase tracking-[0.2em]">Growth Pipeline</span>
          </div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Follow-ups Command Center</h1>
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mt-2">Manage ongoing relations, reschedules, and client conversions.</p>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => fetchFollowUps(true)}
            className={`flex items-center gap-2 px-4 py-3 bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 font-bold rounded-2xl transition-all shadow-sm hover:shadow-md hover:bg-violet-100 dark:hover:bg-violet-900/50 ${refreshing ? 'opacity-50' : ''}`}
          >
            <Activity size={18} className={refreshing ? 'animate-spin' : ''} />
            <span className="text-sm uppercase tracking-widest">{refreshing ? 'Syncing...' : 'Live Sync'}</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 animate-pulse">
           <div className="w-12 h-12 rounded-full border-4 border-violet-100 border-t-violet-600 animate-spin mb-4" />
           <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Loading Pipeline...</p>
        </div>
      ) : selectedFollowUp ? (
        <div className="animate-in slide-in-from-bottom-12 duration-700 flex flex-col min-h-[80vh] relative">
          <button 
            onClick={() => setSelectedFollowUp(null)}
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-violet-600 mb-6 bg-white dark:bg-gray-900 px-4 py-2 w-fit rounded-full shadow-sm"
          >
            <ArrowLeft size={14} /> Back to Pipeline
          </button>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Column: Details & Actions */}
            <div className="w-full lg:w-[40%] space-y-6">
              <div className="bg-white dark:bg-gray-950 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-6 opacity-[0.03]">
                    <Store size={150} />
                 </div>
                 <div className="relative z-10">
                   <div className="flex items-center gap-3 mb-6">
                      <div className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${statusConfig[selectedFollowUp.status].bg} ${statusConfig[selectedFollowUp.status].color} ${statusConfig[selectedFollowUp.status].border}`}>
                        {statusConfig[selectedFollowUp.status].label}
                      </div>
                      <div className="px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-gray-50 text-gray-500 border border-gray-100">
                        Priority: {selectedFollowUp.priority}
                      </div>
                   </div>

                   <h2 className="text-3xl font-black text-gray-900 dark:text-white leading-tight tracking-tight mb-2">
                     {selectedFollowUp.storeName}
                   </h2>
                   <p className="text-sm font-bold text-gray-500 mb-8 max-w-[90%]">
                     {selectedFollowUp.reason}
                   </p>

                   <div className="space-y-4">
                     <div className="flex flex-col gap-1">
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Client / Owner</span>
                        <div className="flex items-center gap-3">
                           <User size={16} className="text-violet-500" />
                           <span className="text-sm font-bold text-gray-900 dark:text-white">{selectedFollowUp.ownerName || 'Not Provided'}</span>
                        </div>
                     </div>
                     <div className="flex flex-col gap-1">
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Contact</span>
                        <div className="flex items-center gap-3">
                           <Phone size={16} className="text-violet-500" />
                           <span className="text-sm font-bold text-gray-900 dark:text-white">{selectedFollowUp.mobileNumber || 'Not Provided'}</span>
                        </div>
                     </div>
                     <div className="flex flex-col gap-1">
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Location</span>
                        <div className="flex items-center gap-3">
                           <MapPin size={16} className="text-violet-500" />
                           <span className="text-sm font-bold text-gray-900 dark:text-white">{selectedFollowUp.city || selectedFollowUp.address || 'Unknown'}</span>
                        </div>
                     </div>
                   </div>

                   {/* Resolve Actions */}
                   <div className="mt-10 pt-8 border-t border-gray-100 dark:border-gray-800 grid grid-cols-2 gap-3">
                      <button 
                        onClick={() => handleUpdateStatus(selectedFollowUp._id, 'converted')}
                        className="flex flex-col items-center justify-center p-4 rounded-3xl bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-100 transition-all font-black text-[10px] uppercase tracking-widest gap-2"
                      >
                         <CheckCircle size={24} />
                         Mark Converted
                      </button>
                      <button 
                        onClick={() => handleUpdateStatus(selectedFollowUp._id, 'lost')}
                        className="flex flex-col items-center justify-center p-4 rounded-3xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 transition-all font-black text-[10px] uppercase tracking-widest gap-2"
                      >
                         <XCircle size={24} />
                         Mark Lost
                      </button>
                   </div>
                 </div>
              </div>
            </div>

            {/* Right Column: Embedded History Timeline */}
            <div className="w-full lg:w-[60%] flex flex-col gap-6 h-[80vh]">
              {/* Log Observation / Interaction Form Redesign (White Theme) */}
              <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl shadow-indigo-500/5 shrink-0 relative overflow-hidden group/form">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl -mr-16 -mt-16 rounded-full group-hover/form:bg-indigo-500/10 transition-colors duration-700" />
                
                <h3 className="text-[12px] font-black uppercase tracking-[0.2em] mb-8 flex items-center gap-3 text-gray-900 dark:text-white relative z-10">
                  <Plus size={18} className="text-indigo-600" /> Log Observation / Interaction
                </h3>

                <form onSubmit={handleAddHistory} className="space-y-6 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 ml-1">Action Taken</label>
                      <select 
                        value={newAction} 
                        onChange={e => setNewAction(e.target.value)}
                        className="w-full bg-gray-50 dark:bg-gray-800/50 border-2 border-transparent focus:border-indigo-500/20 rounded-2xl px-5 py-3.5 text-sm font-bold shadow-sm outline-none transition-all text-gray-900 dark:text-white appearance-none"
                      >
                        <option value="called">Phone Call</option>
                        <option value="visited">Field Visit</option>
                        <option value="rescheduled">Rescheduled</option>
                        <option value="created">Created manually</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 ml-1">Response / Outcome</label>
                      <select 
                        value={newOutcome} 
                        onChange={e => setNewOutcome(e.target.value)}
                        className="w-full bg-gray-50 dark:bg-gray-800/50 border-2 border-transparent focus:border-indigo-500/20 rounded-2xl px-5 py-3.5 text-sm font-bold shadow-sm outline-none transition-all text-gray-900 dark:text-white appearance-none"
                      >
                        <option value="interested">Positive / Interested</option>
                        <option value="not_reachable">Not Reachable</option>
                        <option value="callback">Asked to call back</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 ml-1">Interaction Notes</label>
                    <textarea 
                      value={newNote}
                      onChange={e => setNewNote(e.target.value)}
                      placeholder="What was discussed?"
                      className="w-full bg-gray-50 dark:bg-gray-800/50 border-2 border-transparent focus:border-indigo-500/20 rounded-2xl px-5 py-4 text-sm font-medium shadow-sm outline-none transition-all text-gray-900 dark:text-white placeholder:text-gray-400 resize-none h-28 custom-scrollbar"
                      required
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row items-end justify-between gap-6 pt-2">
                    <div className="w-full sm:flex-1 space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 ml-1">Schedule Next Follow-up (Optional)</label>
                      <input 
                        type="date" 
                        value={newSchedule}
                        onChange={e => setNewSchedule(e.target.value)}
                        className="w-full bg-gray-50 dark:bg-gray-800/50 border-2 border-transparent focus:border-indigo-500/20 rounded-2xl px-5 py-3.5 text-sm font-bold shadow-sm outline-none transition-all text-gray-900 dark:text-white"
                      />
                    </div>
                    <button 
                      type="submit" 
                      disabled={submitting}
                      className="w-full sm:w-auto px-10 py-4 bg-indigo-600 text-white hover:bg-indigo-700 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-indigo-500/20 disabled:opacity-70 active:scale-95"
                    >
                      {submitting ? 'Saving Intelligence...' : 'Log Entry'}
                    </button>
                  </div>
                </form>
              </div>

              {/* History Timeline feed */}
              <div className="flex-1 bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-[2.5rem] p-8 overflow-y-auto custom-scrollbar shadow-sm">
                <h3 className="text-[12px] font-black text-gray-900 dark:text-white uppercase tracking-[0.2em] mb-8 sticky top-0 bg-white dark:bg-gray-950 pb-4 z-10 border-b border-gray-50 dark:border-gray-800">Complete Historical Intelligence</h3>
                
                <div className="relative pl-6">
                  {/* Vertical Line */}
                  <div className="absolute top-0 bottom-0 left-6 w-0.5 bg-gray-100 dark:bg-gray-800" />

                  {selectedFollowUp.history?.slice().reverse().map((entry, idx) => (
                    <div key={idx} className="relative mb-10 last:mb-0">
                      {/* Node Bullet */}
                      <div className="absolute -left-[5px] top-1 w-3 h-3 rounded-full border-2 border-white dark:border-gray-950 bg-violet-500 shadow-[0_0_0_4px_rgba(139,92,246,0.1)]" />
                      
                      <div className="pl-8 -mt-1.5">
                        <div className="flex items-center gap-3 flex-wrap mb-2">
                          <span className="px-3 py-1 bg-violet-50 dark:bg-violet-500/10 text-violet-600 text-[9px] font-black uppercase tracking-widest rounded-lg border border-violet-100 dark:border-violet-500/20">
                            {entry.action}
                          </span>
                          {entry.outcome && (
                            <span className="px-3 py-1 bg-gray-50 dark:bg-gray-800 text-gray-500 text-[9px] font-black uppercase tracking-widest rounded-lg border border-gray-100 dark:border-gray-700">
                              Outcome: {entry.outcome.replace('_', ' ')}
                            </span>
                          )}
                          <span className="text-[9px] font-bold text-gray-400 tabular-nums ml-auto w-full sm:w-auto">
                            {new Date(entry.timestamp).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                          </span>
                        </div>

                        <div className="p-4 bg-gray-50/50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800 inline-block w-full">
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 italic">"{entry.note}"</p>
                        </div>
                        <p className="text-[10px] font-bold text-gray-400 mt-3 flex items-center gap-2">
                          <User size={12} /> Logged by: {entry.performedByName || 'System'}
                        </p>
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
          {/* Dashboard KPI / Filters */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-8">
            <button
              onClick={() => setFilter('All')}
              className={`p-4 rounded-2xl border text-left transition-all ${filter === 'All' ? 'border-violet-500 ring-2 ring-violet-500/20 scale-[1.02] shadow-md bg-white dark:bg-gray-900' : 'border-gray-100 bg-white dark:bg-gray-900 hover:bg-gray-50'}`}
            >
               <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-2">Total Pipeline</span>
               <span className="text-2xl font-black text-gray-900 dark:text-white tabular-nums leading-none">{followUps.length}</span>
            </button>
            
            <button
              onClick={() => setFilter('Pending')}
              className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3 ${filter === 'Pending' ? 'border-amber-500 ring-2 ring-amber-500/20 scale-[1.02] shadow-md bg-white dark:bg-gray-900' : 'border-gray-100 bg-white dark:bg-gray-900 hover:bg-gray-50'}`}
            >
               <Clock className="text-amber-500 mt-0.5" size={16} />
               <div>
                 <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-2">Pending</span>
                 <span className="text-2xl font-black text-gray-900 dark:text-white tabular-nums leading-none">{activeStats.pending}</span>
               </div>
            </button>
            <button
              onClick={() => setFilter('In Progress')}
              className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3 ${filter === 'In Progress' ? 'border-blue-500 ring-2 ring-blue-500/20 scale-[1.02] shadow-md bg-white dark:bg-gray-900' : 'border-gray-100 bg-white dark:bg-gray-900 hover:bg-gray-50'}`}
            >
               <Activity className="text-blue-500 mt-0.5" size={16} />
               <div>
                 <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-2">In Progress</span>
                 <span className="text-2xl font-black text-gray-900 dark:text-white tabular-nums leading-none">{activeStats.inProgress}</span>
               </div>
            </button>
            <button
              onClick={() => setFilter('Converted')}
              className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3 ${filter === 'Converted' ? 'border-emerald-500 ring-2 ring-emerald-500/20 scale-[1.02] shadow-md bg-white dark:bg-gray-900' : 'border-gray-100 bg-white dark:bg-gray-900 hover:bg-gray-50'}`}
            >
               <CheckCircle className="text-emerald-500 mt-0.5" size={16} />
               <div>
                 <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-2">Converted</span>
                 <span className="text-2xl font-black text-gray-900 dark:text-white tabular-nums leading-none">{activeStats.converted}</span>
               </div>
            </button>
            <button
              onClick={() => setFilter('Lost')}
              className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3 ${filter === 'Lost' ? 'border-rose-500 ring-2 ring-rose-500/20 scale-[1.02] shadow-md bg-white dark:bg-gray-900' : 'border-gray-100 bg-white dark:bg-gray-900 hover:bg-gray-50'}`}
            >
               <XCircle className="text-rose-500 mt-0.5" size={16} />
               <div>
                 <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-2">Lost</span>
                 <span className="text-2xl font-black text-gray-900 dark:text-white tabular-nums leading-none">{activeStats.lost}</span>
               </div>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 content-start">
            {filteredFollowUps.map(fu => {
              const statusInfo = statusConfig[fu.status] || statusConfig['pending'];
              const SIcon = statusInfo.icon;
              return (
                <div 
                  key={fu._id} 
                  onClick={() => setSelectedFollowUp(fu)}
                  className="bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 p-6 flex flex-col cursor-pointer hover:shadow-2xl hover:shadow-violet-500/10 hover:border-violet-200 hover:-translate-y-1 transition-all duration-500 group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border ${statusInfo.bg} ${statusInfo.color} ${statusInfo.border} flex items-center gap-1.5`}>
                      <SIcon size={10} />
                      {statusInfo.label}
                    </div>
                    <div className={`w-2 h-2 rounded-full ${fu.priority === 'high' || fu.priority === 'critical' ? 'bg-rose-500 animate-pulse' : 'bg-gray-200'}`} title={`Priority: ${fu.priority}`} />
                  </div>

                  <h3 className="text-lg font-black text-gray-900 dark:text-white tracking-tight mb-2 truncate group-hover:text-violet-600 transition-colors">
                    {fu.storeName}
                  </h3>
                  
                  <div className="space-y-2 mb-6 flex-1">
                    <div className="flex items-center gap-2 text-[11px] font-bold text-gray-500 truncate">
                      <User size={12} className="shrink-0" /> {fu.ownerName || 'Unknown Owner'}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] font-bold text-gray-500 truncate">
                      <Phone size={12} className="shrink-0" /> {fu.mobileNumber || 'No number'}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-50 dark:border-gray-800 flex flex-col gap-2">
                     <span className="text-[8px] font-black uppercase tracking-widest text-gray-400">Next Target</span>
                     <div className="flex items-center gap-2 text-xs font-black text-violet-600 bg-violet-50 dark:bg-violet-900/20 px-3 py-2 rounded-xl group-hover:bg-violet-600 group-hover:text-white transition-colors">
                        <Calendar size={14} /> 
                        {fu.nextFollowUpDate ? new Date(fu.nextFollowUpDate).toLocaleDateString() : 'Unscheduled'}
                     </div>
                  </div>
                </div>
              );
            })}
            
            {filteredFollowUps.length === 0 && (
              <div className="col-span-full py-32 flex flex-col items-center justify-center border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-[3rem] bg-white/50">
                <RotateCcw size={48} className="text-gray-200 mb-6" />
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">No follow-ups found in this view</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default FollowUps;
