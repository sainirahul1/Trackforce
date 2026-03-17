import React, { useState, useEffect } from 'react';
import IssueStats from '../../components/issues/IssueStats';
import IssueFilters from '../../components/issues/IssueFilters';
import { mockIssues as initialIssues } from '../../utils/mockData';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  MessageSquare, 
  Paperclip, 
  User, 
  MoreVertical, 
  ChevronLeft,
  ChevronRight,
  Reply,
  CheckCircle,
  Layers,
  Flame,
  Send,
  ShieldAlert,
  ArrowUpRight,
  Maximize2,
  Trash2,
  History,
  X
} from 'lucide-react';

const ImageModal = ({ src, onClose }) => {
  if (!src) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 animate-in fade-in duration-300 backdrop-blur-sm">
      <button 
        onClick={onClose}
        className="absolute top-8 right-8 p-3 bg-white/10 hover:bg-rose-500 text-white rounded-2xl transition-all hover:rotate-90"
      >
        <X size={24} />
      </button>
      <img 
        src={src} 
        className="max-w-full max-h-[85vh] rounded-3xl shadow-2xl animate-in zoom-in-95 duration-300 ring-1 ring-white/20" 
        alt="Enlarged proof" 
      />
    </div>
  );
};

const IssueCard = ({ issue, onClick, onStatusUpdate }) => {
  const getPriorityStyles = (priority) => {
    switch (priority) {
      case 'Critical': return 'bg-rose-500/10 text-rose-600 border-rose-200 dark:border-rose-500/30';
      case 'High': return 'bg-orange-500/10 text-orange-600 border-orange-200 dark:border-orange-500/30';
      case 'Medium': return 'bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-500/30';
      default: return 'bg-gray-500/10 text-gray-600 border-gray-200 dark:border-gray-500/30';
    }
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case 'Resolved': return 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/10 dark:text-emerald-400 dark:border-emerald-500/20';
      case 'In Progress': return 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/10 dark:text-amber-400 dark:border-amber-500/20';
      case 'Escalated': return 'bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-900/10 dark:text-purple-400 dark:border-purple-500/20';
      default: return 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-900/10 dark:text-rose-400 dark:border-rose-500/20';
    }
  };

  return (
    <div 
      onClick={() => onClick(issue)}
      className="group relative bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2rem] p-6 transition-all duration-500 hover:shadow-xl hover:-translate-y-1 overflow-hidden cursor-pointer"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-indigo-500/10 transition-all duration-700"></div>
      
      {/* Top Section */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter hover:text-indigo-600 transition-colors">
            [ {issue.subject} ]
          </h3>
          <div className="flex items-center gap-1.5">
            <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${getPriorityStyles(issue.priority)}`}>
              🔴 {issue.priority}
            </span>
            <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${getStatusStyles(issue.status)}`}>
              • {issue.status}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-gray-400">
          <Clock size={12} className="text-rose-500" />
          <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest">2h left</span>
        </div>
      </div>

      {/* Meta Info */}
      <div className="relative z-10 flex items-center gap-3 mb-4 text-[10px] font-bold text-gray-400">
        <div className="flex items-center gap-2">
          <img src={`https://i.pravatar.cc/100?u=${issue.id}`} className="w-5 h-5 rounded-lg shadow-sm" alt="user" />
          <span className="opacity-60">Assigned to:</span>
          <span className="text-gray-900 dark:text-gray-200 font-black">{issue.from}</span>
        </div>
        <span>•</span>
        <div className="flex items-center gap-2">
          <span>Updated 2h ago</span>
        </div>
      </div>

      {/* Description */}
      <p className="relative z-10 text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mb-6 font-medium leading-relaxed italic pr-8">
        {issue.subject === 'Device Malfunction' 
          ? "System encountered a critical error. User reported a significant performance lag."
          : "Unable to login after update. User is stuck on the splash screen."}
      </p>

      {/* Footer: Progress & Actions */}
      <div className="relative z-10 flex items-center gap-6">
        <div className="flex-1">
          <div className="flex justify-between items-center mb-1.5">
            <div className="flex items-center gap-1.5">
              <Layers size={12} className="text-indigo-500" />
              <span className="text-[8px] font-black text-gray-400 uppercase tracking-wider">Resolution</span>
            </div>
            <span className="text-[8px] font-black text-indigo-500">60%</span>
          </div>
          <div className="w-full h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div 
              className={`h-full bg-gradient-to-r ${issue.status === 'Resolved' ? 'from-emerald-500 to-teal-500' : 'from-indigo-500 to-indigo-600'} transition-all duration-1000`}
              style={{ width: issue.status === 'Resolved' ? '100%' : (issue.status === 'In Progress' ? '60%' : '15%') }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={(e) => { e.stopPropagation(); /* Logic for more vertical if needed */ }}
            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl transition-all"
          >
            <MoreVertical size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};




const IssueDetails = ({ issue, onBack, onStatusUpdate, onUpdatePriority, onDelete }) => {
  const [localStatus, setLocalStatus] = useState(issue.status);
  const [localPriority, setLocalPriority] = useState(issue.priority);
  const [escalatedTo, setEscalatedTo] = useState(issue.status === 'Escalated' ? (issue.escalatedTo || 'Super Admin') : null);
  const [previewImage, setPreviewImage] = useState(null);
  const [showEscalateModal, setShowEscalateModal] = useState(false);
  const [selectedEscalateTarget, setSelectedEscalateTarget] = useState('Super Admin');

  // Sync state when issue changes
  useEffect(() => {
    setLocalStatus(issue.status);
    setLocalPriority(issue.priority);
    setEscalatedTo(issue.status === 'Escalated' ? (issue.escalatedTo || 'Super Admin') : null);
  }, [issue]);

  const handleStatusChange = (s) => {
    setLocalStatus(s);
    if (s !== 'Escalated') setEscalatedTo(null);
    onStatusUpdate(issue.id, s);
  };

  const handlePriorityUpdate = (p) => {
    setLocalPriority(p);
    onUpdatePriority(issue.id, p);
  };

  const handleEscalateConfirm = () => {
    setLocalStatus('Escalated');
    setEscalatedTo(selectedEscalateTarget);
    onStatusUpdate(issue.id, 'Escalated', selectedEscalateTarget);
    setShowEscalateModal(false);
    onBack(); // Return to dashboard after escalation
  };

  const handleDelete = () => {
    onDelete(issue.id);
  };

  const handleExit = () => {
    if (localStatus === 'Escalated') {
      onStatusUpdate(issue.id, 'In Progress');
    }
    onBack();
  };

  const fileInputRef = React.useRef(null);

  const handleRequestProofClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('File selected:', file.name);
    }
  };

  return (
    <div className="animate-in slide-in-from-right duration-700">
      <ImageModal src={previewImage} onClose={() => setPreviewImage(null)} />
      
      {/* Escalation Confirmation Modal */}
      {showEscalateModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl border border-gray-100 dark:border-gray-800 animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6">
                <ShieldAlert size={32} className="text-purple-600" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-2">Escalate Case</h3>
              <p className="text-sm text-gray-500 font-bold mb-10 leading-relaxed uppercase tracking-widest text-[10px]">
                Are you sure you want to escalate this to <span className="text-purple-600 font-black">Super Admin</span>?
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <button 
                  onClick={() => setShowEscalateModal(false)}
                  className="py-4 bg-gray-50 dark:bg-gray-800 text-gray-500 hover:text-gray-900 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleEscalateConfirm}
                  className="py-4 bg-purple-600 text-white hover:bg-purple-700 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-purple-500/30 transition-all active:scale-95"
                >
                  Confirm
                </button>
              </div>
              <button 
                onClick={onBack}
                className="w-full py-4 bg-rose-50/50 dark:bg-rose-900/10 text-rose-500 hover:bg-rose-500 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-rose-100 dark:border-rose-500/20"
              >
                [ Abort & Exit to Dashboard ]
              </button>
           </div>
        </div>
      )}

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept="image/*,.pdf,.doc,.docx"
      />
      
      {/* Detail Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-10">
        <button 
          onClick={handleExit}
          className="group flex items-center gap-3 text-gray-500 hover:text-indigo-600 transition-all font-black"
        >
          <div className="p-3 bg-white dark:bg-gray-800 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white group-hover:scale-110 shadow-sm transition-all duration-300 ring-1 ring-gray-100 dark:ring-gray-700">
            <ChevronLeft size={20} />
          </div>
          <span className="font-black text-xs uppercase tracking-[0.2em]">{localStatus === 'Escalated' ? 'Return to Dashboard' : 'Back to Dashboard'}</span>
        </button>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-col gap-1.5">
             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</label>
             <div className="relative">
                <select 
                  value={localStatus}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className={`appearance-none bg-white dark:bg-gray-900 px-6 py-3.5 pr-12 rounded-2xl text-xs font-black uppercase tracking-widest border-2 transition-all outline-none cursor-pointer focus:ring-4 focus:ring-indigo-500/10 ${localStatus === 'Resolved' ? 'border-emerald-500 text-emerald-600' : (localStatus === 'Escalated' ? 'border-purple-500 text-purple-600' : 'border-indigo-500 text-indigo-600')}`}
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Escalated">Escalated</option>
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <ArrowUpRight size={14} className="rotate-90" />
                </div>
             </div>
          </div>

          <div className="flex items-center gap-3 mt-5">
            {localStatus === 'Escalated' && (
              <button 
                onClick={() => {
                  onStatusUpdate(issue.id, 'In Progress');
                  onBack();
                }}
                className="px-6 py-3.5 bg-purple-600 text-white hover:bg-purple-700 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-purple-500/30 active:scale-95 flex items-center gap-2"
              >
                <Reply size={14} /> [ Return back ]
              </button>
            )}
            
            <button 
              onClick={handleExit}
              className="px-8 py-3.5 bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-gray-900 rounded-2xl text-xs font-black uppercase tracking-widest transition-all border border-gray-200 dark:border-gray-700 active:scale-95"
            >
              [ Exit ]
            </button>

            {localStatus !== 'Escalated' && (
              <button 
                onClick={() => setShowEscalateModal(true)}
                className="flex items-center gap-2 px-8 py-3.5 rounded-2xl text-xs font-black transition-all border outline-none bg-purple-500/10 hover:bg-purple-600 text-purple-600 hover:text-white border-purple-200 hover:border-purple-600 shadow-lg shadow-purple-500/5 hover:scale-105 active:scale-95"
              >
                <ShieldAlert size={16} /> [ Escalate ]
              </button>
            )}
          </div>
        </div>

        {localStatus === 'Escalated' && (
          <div className="w-full flex items-center gap-3 text-purple-600 font-black text-xs uppercase tracking-widest bg-purple-50 dark:bg-purple-900/20 px-8 py-4 rounded-2xl border border-purple-100 dark:border-purple-500/30 shadow-lg shadow-purple-500/5 mt-2 transition-all animate-in slide-in-from-top-2">
            <ShieldAlert size={18} /> ⚠ Escalated to Super Admin
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: Info */}
        <div className="lg:col-span-2 space-y-10">
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[3rem] p-12 overflow-hidden relative shadow-2xl shadow-indigo-500/5 ring-1 ring-gray-100/50 dark:ring-gray-800">
            <div className="absolute top-0 right-0 p-10 opacity-5">
              <History size={180} />
            </div>

            <div className="mb-10">
              <div className="flex items-center gap-2 mb-6">
                 <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-gray-100 dark:border-gray-800 flex items-center gap-2 ${localStatus === 'Resolved' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-50 text-rose-600'}`}>
                    <span className={`w-2 h-2 rounded-full animate-ping ${localStatus === 'Resolved' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                    {localStatus}
                 </div>
              </div>
              <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-6 uppercase tracking-tighter">[ {issue.subject} ]</h1>
              <div className="flex flex-wrap items-center gap-6 text-xs font-bold text-gray-400">
                <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800/50 px-4 py-2.5 rounded-2xl border border-gray-100 dark:border-gray-700">
                  <User size={16} className="text-indigo-500" /> 
                  <span className="text-gray-400">Raised by:</span>
                  <span className="text-gray-900 dark:text-white uppercase tracking-widest ml-1">{issue.from}</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700 font-black text-[10px] uppercase">
                  <Clock size={16} className="text-indigo-500" /> March 12, 2024 • 10:30 AM
                </div>
              </div>
            </div>

            <div className="space-y-10">
              <div className="group">
                <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                   <div className="w-6 h-[2px] bg-indigo-500"></div> Problem Context
                </h4>
                <div className="p-8 bg-gray-50/50 dark:bg-gray-800/50 rounded-3xl border border-gray-100 dark:border-gray-800 group-hover:bg-white dark:group-hover:bg-gray-900 group-hover:shadow-xl transition-all duration-500">
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-semibold italic text-base">
                    "{issue.subject === 'Device Malfunction' 
                      ? "The employee portal app crashes immediately upon opening on Android 13 devices. We've tried clearing cache and re-installing but the issue persists. This is affecting multiple staff members during clock-in."
                      : "I am unable to login after the latest app update. It just hangs on the splash screen. No error message is shown, it just stays stuck on the logo."}"
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                   <div className="w-6 h-[2px] bg-indigo-500"></div> Proofs & Attachments
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                  {[1, 2].map(img => (
                    <div 
                      key={img} 
                      onClick={() => setPreviewImage(`https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?w=1000&id=${img}`)}
                      className="group relative aspect-video rounded-3xl overflow-hidden border-2 border-white dark:border-gray-800 hover:border-indigo-500 shadow-lg hover:shadow-indigo-500/20 transition-all cursor-pointer"
                    >
                      <img 
                        src={`https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?w=600&id=${img}`} 
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                        alt="attachment proof" 
                      />
                      <div className="absolute inset-0 bg-indigo-600/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-500 backdrop-blur-[2px]">
                        <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                          <Maximize2 className="text-white" size={24} />
                        </div>
                      </div>
                    </div>
                  ))}
                  <div 
                    onClick={handleRequestProofClick}
                    className="aspect-video rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20 flex flex-col items-center justify-center text-gray-400 hover:text-indigo-500 hover:border-indigo-500 transition-all cursor-pointer group"
                  >
                    <Paperclip size={28} className="mb-2 group-hover:rotate-12 transition-transform" />
                    <span className="text-[9px] font-black tracking-widest uppercase">Request More Proof</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Controls */}
        <div className="space-y-10">
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[3rem] p-10 shadow-2xl shadow-indigo-500/5 ring-1 ring-gray-100/50 dark:ring-gray-800">
            <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] mb-8">Management Center</h4>
            
            <div className="space-y-8">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-4">Urgency Level</label>
                <div className="grid grid-cols-2 gap-3">
                  {['Low', 'Medium', 'High', 'Critical'].map(level => (
                    <button 
                      key={level}
                      onClick={() => handlePriorityUpdate(level)}
                      className={`px-3 py-3 rounded-2xl text-[10px] font-black uppercase tracking-tighter border-2 transition-all duration-300 ${localPriority === level ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-500/20 scale-105' : 'bg-transparent border-gray-50 dark:border-gray-800 text-gray-500 hover:border-indigo-500/30 font-black'}`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-8 border-t border-gray-50 dark:border-gray-800">
                <button 
                  onClick={handleDelete}
                  className="w-full py-5 text-[11px] font-black uppercase tracking-widest text-rose-500 bg-rose-50/50 dark:bg-rose-900/10 hover:bg-rose-500 hover:text-white rounded-3xl transition-all duration-500 flex items-center justify-center gap-3 border border-rose-100 dark:border-rose-500/20 group font-black shadow-lg shadow-rose-500/5"
                >
                  <Trash2 size={18} className="group-hover:rotate-12 transition-transform" /> Permanently Delete Case
                </button>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-indigo-500/20 ring-1 ring-white/10">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <ShieldAlert size={140} />
            </div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-6 text-indigo-200">Session Logs</h4>
            <div className="space-y-6 relative z-10">
              {/* Always show Issue Logged */}
              <div className="flex items-start gap-4 group">
                <div className="w-1.5 h-1.5 rounded-full bg-white mt-1.5 shrink-0 shadow-[0_0_10px_white]"></div>
                <div>
                  <p className="text-[10px] font-black leading-tight uppercase tracking-wide">Issue Logged • Root Source</p>
                  <p className="text-[9px] text-indigo-200 uppercase mt-1 tracking-widest">2h 15m Ago</p>
                </div>
              </div>

              {/* Show Manager Verification if In Progress or beyond */}
              {['In Progress', 'Resolved', 'Escalated'].includes(localStatus) && (
                <div className="flex items-start gap-4 animate-in slide-in-from-left duration-500">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-300 mt-1.5 shrink-0 ring-4 ring-white/10"></div>
                  <div>
                    <p className="text-[10px] font-black leading-tight uppercase tracking-wide">Manager Verification</p>
                    <p className="text-[9px] text-indigo-200 uppercase mt-1 tracking-widest">Active Session</p>
                  </div>
                </div>
              )}

              {/* Show Escalation Log if Escalated */}
              {localStatus === 'Escalated' && (
                <div className="flex items-start gap-4 animate-in slide-in-from-left duration-500">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 shrink-0 shadow-[0_0_10px_rgba(168,85,247,0.5)]"></div>
                  <div>
                    <p className="text-[10px] font-black leading-tight uppercase tracking-wide">Escalation Triggered</p>
                    <p className="text-[9px] text-indigo-200 uppercase mt-1 tracking-widest">Sent to {escalatedTo}</p>
                  </div>
                </div>
              )}

              {/* Show Resolution Log if Resolved */}
              {localStatus === 'Resolved' && (
                <div className="flex items-start gap-4 animate-in slide-in-from-left duration-500">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0 shadow-[0_0_10px_rgba(52,211,153,0.8)]"></div>
                  <div>
                    <p className="text-[10px] font-black leading-tight uppercase tracking-wide">Resolution Confirmed</p>
                    <p className="text-[9px] text-indigo-200 uppercase mt-1 tracking-widest">Just Now</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Issues = () => {
  const role = 'manager';
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [issuesList, setIssuesList] = useState(initialIssues);

  // Persistence Logic
  const handleStatusUpdate = (id, newStatus, escalatedTo = null) => {
    setIssuesList(prev => prev.map(issue => 
      issue.id === id ? { ...issue, status: newStatus, escalatedTo } : issue
    ));
    // Sync current detail view if open
    if (selectedIssue && selectedIssue.id === id) {
      setSelectedIssue(prev => ({ ...prev, status: newStatus, escalatedTo }));
    }
  };

  const handlePriorityUpdate = (id, newPriority) => {
    setIssuesList(prev => prev.map(issue => 
      issue.id === id ? { ...issue, priority: newPriority } : issue
    ));
  };

  const handleDelete = (id) => {
    setIssuesList(prev => prev.filter(issue => issue.id !== id));
    if (selectedIssue && selectedIssue.id === id) {
      setSelectedIssue(null);
    }
  };

  const filteredIssues = issuesList.filter(issue => {
    const isForMe = issue.to === role;
    const matchesStatus = filterStatus === 'All' || issue.status === filterStatus;
    const matchesSearch = issue.subject.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          issue.from.toLowerCase().includes(searchTerm.toLowerCase());
    return isForMe && matchesStatus && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-1000 pb-24 px-4 sm:px-6">
      {!selectedIssue ? (
        <>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
            <div className="space-y-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-1 bg-indigo-600 rounded-full"></div>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-600">SaaS Command Center</span>
              </div>
              <h1 className="text-5xl font-black text-gray-900 dark:text-white tracking-tighter leading-[0.9] bg-gradient-to-r from-gray-900 via-indigo-950 to-gray-600 dark:from-white dark:via-indigo-200 dark:to-gray-400 bg-clip-text text-transparent">
                Issues <br className="hidden sm:block" /> Management
              </h1>
            </div>
          </div>

          <IssueStats issues={issuesList.filter(i => i.to === role)} />

          <div className="relative group">
             <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-[2.5rem] blur opacity-0 group-hover:opacity-100 transition duration-1000"></div>
             <div className="relative text-gray-900">
                <IssueFilters 
                  filterStatus={filterStatus} 
                  setFilterStatus={setFilterStatus}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                />
             </div>
          </div>

          <div className="grid grid-cols-1 gap-12">
            {filteredIssues.length > 0 ? (
              filteredIssues.map((issue) => (
                <IssueCard 
                  key={issue.id} 
                  issue={issue} 
                  onStatusUpdate={handleStatusUpdate}
                  onClick={() => setSelectedIssue(issue)} 
                />
              ))
            ) : (
              <div className="bg-white dark:bg-gray-900 rounded-[4rem] border-2 border-dashed border-gray-100 dark:border-gray-800 p-32 text-center transition-all">
                <div className="w-24 h-24 bg-indigo-50 dark:bg-indigo-900/10 rounded-full flex items-center justify-center mx-auto mb-8 text-indigo-500 shadow-inner">
                  <CheckCircle2 size={48} />
                </div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3 uppercase tracking-tighter">Everything Sorted</h3>
                <p className="text-gray-500 font-bold uppercase text-xs tracking-widest opacity-60">No pending issues in this sector</p>
              </div>
            )}
          </div>
        </>
      ) : (
        <IssueDetails 
          issue={selectedIssue} 
          onBack={() => setSelectedIssue(null)} 
          onStatusUpdate={handleStatusUpdate}
          onUpdatePriority={handlePriorityUpdate}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default Issues;
