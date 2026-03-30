import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import IssueStats from '../../components/issues/IssueStats';
import IssueFilters from '../../components/issues/IssueFilters';
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
  ShieldAlert,
  ArrowUpRight,
  Maximize2,
  Trash2,
  History,
  X,
  Plus
} from 'lucide-react';
import CreateIssueModal from '../../components/issues/CreateIssueModal';
import { getIssues, createIssue, updateIssue, deleteIssue, getIssueById } from '../../services/core/issueService';
import { useSocket } from '../../context/SocketContext';
import { useAuth } from '../../context/AuthContext';

const ImageModal = memo(({ src, onClose }) => {
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
});

const IssueCard = memo(({ issue, onClick }) => {
  const getPriorityStyles = (priority) => {
    switch (priority) {
      case 'Critical': return 'bg-rose-500/10 text-rose-600 border-rose-200 dark:border-rose-500/30 shadow-[0_4px_12px_-4px_rgba(244,63,94,0.3)]';
      case 'High': return 'bg-orange-500/10 text-orange-600 border-orange-200 dark:border-orange-500/30 shadow-[0_4px_12px_-4px_rgba(249,115,22,0.3)]';
      case 'Medium': return 'bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-500/30 shadow-[0_4px_12px_-4px_rgba(59,130,246,0.3)]';
      default: return 'bg-gray-500/10 text-gray-600 border-gray-200 dark:border-gray-500/30';
    }
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case 'Resolved': return 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-500/30';
      case 'In Progress': return 'bg-indigo-50 text-indigo-600 border-indigo-200 dark:bg-indigo-950/20 dark:text-indigo-400 dark:border-indigo-500/30';
      case 'Escalated': return 'bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-950/20 dark:text-purple-400 dark:border-purple-500/30';
      default: return 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-500/30';
    }
  };

  const getProfileImage = (issue) => {
    if (issue.from && typeof issue.from === 'object' && issue.from.profile && issue.from.profile.profileImage) {
      const dp = issue.from.profile.profileImage;
      if (dp.startsWith('data:') || dp.startsWith('http')) return dp;
      let url = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
      url = url.replace(/\/$/, '');
      if (!url.endsWith('/api')) url += '/api';
      return `${url.replace('/api', '')}${dp}`;
    }
    return `https://i.pravatar.cc/150?u=${issue.id || issue._id || 'default'}`;
  };

  const getFromName = (issue) => {
    if (issue.from && typeof issue.from === 'object' && issue.from.name) {
      return issue.from.name;
    }
    return issue.fromName || issue.from;
  };

  return (
    <div
      onClick={() => onClick(issue)}
      className="group relative bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2.5rem] p-8 transition-all duration-700 hover:shadow-[0_40px_80px_-20px_rgba(79,70,229,0.15)] hover:-translate-y-2 overflow-hidden cursor-pointer active:scale-[0.98]"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-500/10 to-transparent blur-3xl rounded-full -mr-32 -mt-32 group-hover:scale-110 transition-transform duration-1000"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/5 blur-2xl rounded-full -ml-16 -mb-16"></div>

      {/* Top Section */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 mb-4">
        <div className="flex flex-wrap items-center gap-4">
          <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter group-hover:text-indigo-600 transition-colors duration-300">
            [ {issue.subject} ]
          </h3>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest border-2 ${getPriorityStyles(issue.priority)} transform group-hover:scale-105 transition-transform`}>
              {issue.priority}
            </span>
            <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest border-2 ${getStatusStyles(issue.status)}`}>
              {issue.status}
            </span>
          </div>
        </div>
      </div>

      {/* Meta Info */}
      <div className="relative z-10 flex items-center gap-3 mb-4">
        <div className="flex items-center gap-2.5 bg-gray-50 dark:bg-gray-800/50 px-3 py-1.5 rounded-xl border border-gray-100 dark:border-gray-700">
          <div className="relative">
            <img src={getProfileImage(issue)} className="w-5 h-5 rounded-lg border border-white dark:border-gray-800 shadow-sm object-cover" alt="user" />
            <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-500 border border-white dark:border-gray-900 rounded-full"></div>
          </div>
          <p className="text-[10px] font-bold text-gray-400">
            Raised by: <span className="text-gray-900 dark:text-gray-100 font-black uppercase tracking-widest">{getFromName(issue)}</span>
          </p>
        </div>
        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest opacity-60 bg-gray-50/50 dark:bg-gray-800/40 px-3 py-2 rounded-xl">
          Ref: #TF-{String(issue._id || issue.id).slice(-6).toUpperCase()}
        </div>
      </div>

      {/* Description Summary (Deferred) */}
      <div className="relative z-10 p-4 bg-indigo-50/30 dark:bg-indigo-950/10 rounded-2xl border border-indigo-100/50 dark:border-indigo-500/10 mb-6 group-hover:bg-indigo-50/50 transition-colors duration-500">
        <p className="text-xs text-gray-600 dark:text-gray-400 font-medium leading-relaxed italic pr-2">
          {issue.description ? (
            `"${issue.description.substring(0, 120)}${issue.description.length > 120 ? '...' : ''}"`
          ) : (
            `"Click to view full ticket details and problem description."`
          )}
        </p>
      </div>

      {/* Footer: Progress & Actions */}
      <div className="relative z-10 flex items-center gap-8">
        <div className="flex-1 space-y-3">
          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
            <div className="flex items-center gap-2 text-indigo-500">
              <Layers size={14} />
              <span>Fix Progress</span>
            </div>
            <span className="text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 px-3 py-1 rounded-lg border border-indigo-100 dark:border-indigo-500/20">
              {issue.status === 'Resolved' ? '100%' : (issue.status === 'In Progress' ? '68%' : '12%')}
            </span>
          </div>
          <div className="w-full h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full p-0.5 overflow-hidden ring-1 ring-gray-100 dark:ring-gray-700">
            <div
              className={`h-full bg-gradient-to-r ${issue.status === 'Resolved' ? 'from-emerald-400 via-teal-500 to-emerald-600' : 'from-indigo-500 via-purple-500 to-indigo-600'} transition-all duration-1000 rounded-full relative overflow-hidden shadow-[0_0_15px_rgba(79,70,229,0.3)]`}
              style={{ width: issue.status === 'Resolved' ? '100%' : (issue.status === 'In Progress' ? '68%' : '12%') }}
            >
              <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-[length:250%_250%] animate-[shimmer_2s_infinite]"></div>
            </div>
          </div>
        </div>

        <button
          className="p-3 bg-gray-50 dark:bg-gray-800 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 rounded-xl transition-all duration-300 shadow-sm hover:shadow-indigo-500/30 active:scale-90 border border-gray-100 dark:border-gray-700"
        >
          <MoreVertical size={16} />
        </button>
      </div>
    </div>
  );
});




const IssueDetails = ({ issue, onBack, onStatusUpdate, onUpdatePriority, onDelete, triggerToast }) => {
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
    triggerToast('Issue escalated to Super Admin successfully', 'success');
  };

  const handleDelete = () => {
    onDelete(issue.id);
  };

  const handleExit = () => {
    // PRESERVE ESCALATION: Don't revert status when backing out
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
              [ Abort & Exit to Issues ]
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
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl px-8 py-4 rounded-[2.5rem] border border-white/20 dark:border-gray-800 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.1)] relative overflow-hidden group/header ring-1 ring-black/5">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-transparent opacity-0 group-hover/header:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

        <div className="flex flex-wrap items-center gap-6 relative z-10 w-full lg:w-auto">
          <button
            onClick={handleExit}
            className="group flex items-center gap-2.5 text-gray-500 hover:text-indigo-600 transition-all font-black"
          >
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
              <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
            </div>
            <span className="font-black text-[10px] uppercase tracking-[0.15em]">{localStatus === 'Escalated' ? 'Return' : 'Back to Issues'}</span>
          </button>

          <div className="h-8 w-[1.5px] bg-gray-100 dark:bg-gray-800 hidden md:block opacity-50"></div>

          <div className="flex items-center gap-4">
            <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Lifecycle</label>
            <div className="flex items-center gap-3">
              <div className="relative group/select">
                <select
                  value={localStatus}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className={`appearance-none bg-gray-50/50 dark:bg-gray-800/50 px-4 py-2 pr-10 rounded-xl text-[9px] font-black uppercase tracking-[0.1em] border-2 transition-all outline-none cursor-pointer focus:ring-8 focus:ring-indigo-500/5 ${localStatus === 'Resolved' ? 'border-emerald-500 text-emerald-600' : (localStatus === 'Escalated' ? 'border-purple-500 text-purple-600' : 'border-indigo-500 text-indigo-600')}`}
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Escalated">Escalated</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover/select:text-indigo-500 transition-colors">
                  <ArrowUpRight size={12} className="rotate-90" />
                </div>
              </div>

              {localStatus === 'Escalated' && (
                <button
                  onClick={() => {
                    onStatusUpdate(issue.id, 'In Progress');
                    triggerToast('Issue retrieved to Manager successfully');
                  }}
                  className="px-6 py-3 bg-purple-600 text-white hover:bg-purple-700 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] transition-all shadow-[0_15px_30px_-10px_rgba(168,85,247,0.4)] active:scale-95 flex items-center gap-3 border border-purple-400/30"
                >
                  <Reply size={14} /> [ Return back ]
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          {localStatus !== 'Escalated' && (
            <button
              onClick={handleExit}
              className="px-5 py-2.5 bg-white dark:bg-gray-800 text-gray-500 hover:text-gray-900 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border border-gray-100 dark:border-gray-700 active:scale-95 shadow-sm"
            >
              [ Exit ]
            </button>
          )}

          {localStatus !== 'Escalated' && (
            <button
              onClick={() => setShowEscalateModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-[9px] font-black transition-all border outline-none bg-purple-500/10 hover:bg-purple-600 text-purple-600 hover:text-white border-purple-200 hover:border-purple-600 shadow-lg shadow-purple-500/5 active:scale-95"
            >
              <ShieldAlert size={10} /> [ Escalate ]
            </button>
          )}
        </div>
      </div>

      {localStatus === 'Escalated' && (
        <div className="w-full flex items-center justify-between text-purple-600 font-black text-[10px] uppercase tracking-widest bg-purple-50 dark:bg-purple-900/20 px-8 py-4 rounded-2xl border border-purple-100 dark:border-purple-500/30 shadow-lg shadow-purple-500/5 mb-8 transition-all animate-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <ShieldAlert size={16} />
            <span>⚠ Escalated to</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="opacity-50">Target:</span>
            <span className="bg-purple-600 text-white px-3 py-1 rounded-lg shadow-md shadow-purple-500/20 font-black">Super Admin</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: Info */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2rem] p-8 overflow-hidden relative shadow-2xl shadow-indigo-500/5 ring-1 ring-gray-100/50 dark:ring-gray-800">
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
                  <span className="text-gray-900 dark:text-white uppercase tracking-widest ml-1">{issue.from && typeof issue.from === 'object' ? issue.from.name : (issue.fromName || issue.from)}</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700 font-black text-[10px] uppercase">
                  <Clock size={16} className="text-indigo-500" /> March 12, 2024 • 10:30 AM
                </div>
              </div>
            </div>

            <div className="space-y-10">
              <div className="group">
                <h4 className="text-[9px] font-black text-indigo-500 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                  <div className="w-5 h-[2px] bg-indigo-500"></div> Problem Context
                </h4>
                <div className="p-6 bg-gray-50/50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800 group-hover:bg-white dark:group-hover:bg-gray-900 group-hover:shadow-xl transition-all duration-500">
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-semibold italic text-sm">
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
        <div className="space-y-8">
          {/* <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2rem] p-6 shadow-2xl shadow-indigo-500/5 ring-1 ring-gray-100/50 dark:ring-gray-800">
            <h4 className="text-[9px] font-black text-indigo-500 uppercase tracking-[0.2em] mb-6">Management Center</h4>
            
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-4">Urgency Level</label>
                <div className="grid grid-cols-2 gap-4">
                  {['Low', 'Medium', 'High', 'Critical'].map(level => (
                    <button 
                      key={level}
                      onClick={() => handlePriorityUpdate(level)}
                      className={`px-3 py-4 rounded-3xl text-[10px] font-black uppercase tracking-tighter border-2 transition-all duration-500 transform active:scale-90 ${localPriority === level 
                        ? (level === 'Critical' ? 'bg-rose-600 border-rose-600 text-white shadow-[0_15px_30px_-10px_rgba(225,29,72,0.4)] scale-105' 
                          : level === 'High' ? 'bg-orange-600 border-orange-600 text-white shadow-[0_15px_30px_-10px_rgba(234,88,12,0.4)] scale-105'
                          : 'bg-indigo-600 border-indigo-600 text-white shadow-[0_15px_30px_-10px_rgba(79,70,229,0.4)] scale-105')
                        : 'bg-white dark:bg-gray-800/10 border-gray-100 dark:border-gray-800 text-gray-500 hover:border-indigo-500/50'}`}
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
          </div> */}

          <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-[2rem] p-6 text-white relative overflow-hidden shadow-2xl shadow-indigo-500/20 ring-1 ring-white/10">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <ShieldAlert size={100} />
            </div>
            <h4 className="text-[9px] font-black uppercase tracking-[0.2em] mb-4 text-indigo-200">Session Logs</h4>
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
  const { socket } = useSocket();
  const { user } = useAuth();
  const role = 'manager';
  
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [issuesList, setIssuesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showToast, setShowToast] = useState({ show: false, message: '', type: 'success' });
  const [selectedIssue, setSelectedIssue] = useState(null);

  const fetchIssues = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const data = await getIssues();
      setIssuesList(data);
    } catch (err) {
      console.error('Error fetching issues:', err);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  // Manage Real-time Subscriptions
  useEffect(() => {
    if (socket && user?.tenant) {
      // Join organizational role room
      socket.emit('join_tenant_role', { tenantId: user.tenant, role: 'manager' });
      
      const handleNewIssue = (newIssue) => {
        setIssuesList(prev => [newIssue, ...prev]);
        triggerToast(`New ticket: ${newIssue.subject}`, 'success');
      };

      socket.on('issue:new', handleNewIssue);
      return () => socket.off('issue:new', handleNewIssue);
    }
  }, [socket, user]);

  const triggerToast = (message, type = 'success') => {
    setShowToast({ show: true, message, type });
    if (type === 'success') {
      setTimeout(() => setShowToast({ show: false, message: '', type: 'success' }), 2000);
    }
  };

  const handleStatusUpdate = useCallback(async (id, newStatus, escalatedTo = null) => {
    // OPTIMISTIC UPDATE: Update UI immediately
    setIssuesList(prev => prev.map(issue =>
      issue._id === id ? { ...issue, status: newStatus, escalatedTo } : issue
    ));

    if (selectedIssue && (selectedIssue._id === id || selectedIssue.id === id)) {
      setSelectedIssue(prev => ({ ...prev, status: newStatus, escalatedTo }));
    }

    try {
      await updateIssue(id, { status: newStatus });
      triggerToast('Status updated successfully');
    } catch (err) {
      // Background sync on failure to recover state
      fetchIssues(false);
      triggerToast(err.message, 'error');
    }
  }, [issuesList, selectedIssue]);

  const handlePriorityUpdate = useCallback(async (id, newPriority) => {
    // OPTIMISTIC UPDATE
    setIssuesList(prev => prev.map(issue =>
      issue._id === id ? { ...issue, priority: newPriority } : issue
    ));

    try {
      await updateIssue(id, { priority: newPriority });
      triggerToast('Priority updated successfully');
    } catch (err) {
      fetchIssues(false);
      triggerToast(err.message, 'error');
    }
  }, [issuesList]);

  const handleDelete = useCallback(async (id) => {
    try {
      await deleteIssue(id);
      setIssuesList(prev => prev.filter(issue => issue._id !== id && issue.id !== id));
      if (selectedIssue && (selectedIssue._id === id || selectedIssue.id === id)) {
        setSelectedIssue(null);
      }
      triggerToast('Issue deleted');
    } catch (err) {
      triggerToast(err.message, 'error');
    }
  }, [selectedIssue]);

  const handleCreateIssue = useCallback(async (newData) => {
    try {
      const created = await createIssue({
        ...newData,
        to: 'superadmin' // Manager reports to superadmin
      });
      
      // OPTIMISTIC UPDATE
      setIssuesList(prev => [created, ...prev]);
      
      setShowCreateModal(false);
      triggerToast('Issue reported successfully to Super Admin');
      
      // Silent sync
      fetchIssues(false);
    } catch (err) {
      triggerToast(err.message, 'error');
    }
  }, []);

  const handleIssueSelect = async (issue) => {
    // If description is missing (due to data thinning), fetch full details
    if (!issue.description) {
      try {
        const fullIssue = await getIssueById(issue._id || issue.id);
        setSelectedIssue(fullIssue);
      } catch (err) {
        console.error('Failed to fetch issue details:', err);
        setSelectedIssue(issue); // Fallback to partial data
      }
    } else {
      setSelectedIssue(issue);
    }
  };

  const filteredIssues = useMemo(() => {
    return issuesList.filter(issue => {
      const isForMe = issue.to === role;
      const matchesStatus = filterStatus === 'All' || issue.status === filterStatus;
      const matchesSearch = 
        issue.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (issue.fromName || (typeof issue.from === 'object' ? issue.from.name : issue.from)).toLowerCase().includes(searchTerm.toLowerCase());
      return isForMe && matchesStatus && matchesSearch;
    });
  }, [issuesList, filterStatus, searchTerm, role]);

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
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-indigo-500/40 hover:bg-indigo-700 hover:-translate-y-1 transition-all active:scale-95 group"
            >
              <div className="p-1.5 bg-white/20 rounded-xl group-hover:rotate-90 transition-transform duration-500">
                <Plus size={16} />
              </div>
              Report New Issue
            </button>
          </div>

          {showCreateModal && (
            <CreateIssueModal
              onClose={() => setShowCreateModal(false)}
              onCreate={handleCreateIssue}
            />
          )}

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
            {loading ? (
              <div className="p-32 text-center animate-pulse">
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Synchronizing issue logs...</p>
              </div>
            ) : filteredIssues.length > 0 ? (
              filteredIssues.map((issue) => (
                <IssueCard
                  key={issue._id || issue.id}
                  issue={issue}
                  onStatusUpdate={handleStatusUpdate}
                  onClick={() => handleIssueSelect(issue)}
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
          triggerToast={triggerToast}
        />
      )}

      {/* Top-Center Compact Toast - GLOBAL - Ultra Compact */}
      {showToast.show && (
        <div className="fixed inset-x-0 top-4 z-[250] flex justify-center p-4 pointer-events-none animate-in slide-in-from-top-2 fade-in duration-700">
          <div className="bg-emerald-600/90 text-white px-4 py-2 rounded-2xl shadow-[0_10px_20px_-5px_rgba(16,185,129,0.3)] flex items-center gap-2.5 border border-emerald-400/20 backdrop-blur-2xl pointer-events-auto ring-4 ring-emerald-500/5 active:scale-95 transition-all scale-[0.85]">
            <div className="bg-white/20 p-1 rounded-lg">
              <CheckCircle size={12} className="text-white" />
            </div>
            <span className="text-[8px] font-black uppercase tracking-[0.3em]">{showToast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Issues;
