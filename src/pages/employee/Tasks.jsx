// modification of the code
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
  Shield,
  List as ListIcon,
  Map as MapIcon,
  Zap,
  MoreVertical,
  Navigation,
  Trophy,
  Megaphone,
  CreditCard,
  Wifi,
  WifiOff,
  Play,
  Pause,
  Power,
  ChevronUp,
  ChevronDown,
  X,
  User,
  LogOut,
  Camera,
  Check,
  ShoppingBag,
  Upload,
  Image as ImageIcon,
  FileText,
  Bell,
  Settings,
  HelpCircle,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Info,
  ExternalLink
} from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import Button from '../../components/Button';

// --- Sub-components (Consolidated & Styled) ---

const WorkStatusPanel = ({ status, onStatusChange }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'Active': return 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950 shadow-[0_0_20px_rgba(16,185,129,0.1)]';
      case 'Paused': return 'text-orange-500 bg-orange-50 dark:bg-orange-950';
      default: return 'text-gray-400 bg-gray-50 dark:bg-gray-900/50';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-8 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-8">
      <div className="flex items-center gap-8">
        <div className={`w-20 h-20 rounded-[2.5rem] flex items-center justify-center transition-all duration-500 shadow-inner ${getStatusColor()}`}>
          <MapPin size={32} className={status === 'Active' ? 'animate-bounce' : ''} />
        </div>
        <div>
          <div className="flex items-center gap-3">
            <span className={`w-3 h-3 rounded-full ${status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-gray-300'}`} />
            <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">
              {status} Mode
            </h2>
          </div>
          <p className="text-gray-400 text-sm font-bold mt-1">
            {status === 'Active' ? 'Live GPS Tracking Active' : 'Location Tracking Paused'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 w-full lg:w-auto">
        {status === 'Offline' ? (
          <button
            onClick={() => onStatusChange('Active')}
            className="flex-1 lg:flex-none flex items-center justify-center gap-3 px-10 py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-indigo-200 dark:shadow-none"
          >
            <Play size={18} fill="currentColor" />
            Start Day
          </button>
        ) : (
          <>
            <button
              onClick={() => onStatusChange(status === 'Active' ? 'Paused' : 'Active')}
              className={`flex-1 lg:flex-none flex items-center justify-center gap-3 px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest transition-all ${status === 'Active'
                ? 'bg-orange-50 text-orange-600 hover:bg-orange-100 dark:bg-orange-950/30'
                : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-950/30'
                }`}
            >
              {status === 'Active' ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
              {status === 'Active' ? 'Pause' : 'Resume'}
            </button>
            <button
              onClick={() => onStatusChange('Offline')}
              className="flex-1 lg:flex-none flex items-center justify-center gap-3 px-10 py-5 bg-gray-900 text-white dark:bg-gray-800 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-black transition-all"
            >
              <Power size={18} />
              End Day
            </button>
          </>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, trend, trendType, color, bg, sparklinePath }) => {
  return (
    <div className="group relative bg-white dark:bg-gray-900 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm transition-all hover:shadow-2xl hover:-translate-y-1 overflow-hidden cursor-pointer">
      {/* Historical Data Hover Reveal */}
      <div className="absolute inset-x-0 bottom-0 bg-indigo-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-20 p-5 flex flex-col justify-end text-white h-full">
        <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1 leading-none">Contextual Insight</p>
        <p className="text-xl font-black tracking-tight mb-1">
          {trendType === 'up' ? 'Ahead of Schedule' : 'Slightly Behind'}
        </p>
        <p className="text-[10px] font-bold opacity-60 leading-tight">
          Performing at {trendType === 'up' ? '115%' : '85%'} of previous shift average.
        </p>
      </div>

      <div className="relative z-10 flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${bg} ${color} transition-transform group-hover:scale-110`}>
          <Icon size={18} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black transition-all group-hover:bg-white/10 ${trendType === 'up' ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40' : 'text-red-600 bg-red-50 dark:bg-red-950/40'
            }`}>
            {trendType === 'up' ? <TrendingUpIcon size={10} /> : <TrendingDownIcon size={10} />}
            {trend}
          </div>
        )}
      </div>

      <div className="relative z-10">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.1em] leading-none mb-1.5">{label}</p>
        <p className="text-3xl font-black text-gray-900 dark:text-white tabular-nums tracking-tighter leading-none">{value}</p>
      </div>

      {/* Mini Dynamic Sparkline Overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-12 opacity-10 pointer-events-none group-hover:opacity-20 transition-all duration-700">
        <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
          <path
            d={sparklinePath || "M0 35 Q 25 30, 50 35 T 100 25 V 40 H 0 Z"}
            fill="currentColor"
            className={color.replace('text', 'fill')}
          />
        </svg>
      </div>
    </div>
  );
};

// const PerformanceStatsOverview = () => {
//   const stats = [
//     {
//       label: 'Visits Completed',
//       value: '08',
//       trend: '+15%',
//       trendType: 'up',
//       color: 'text-blue-500',
//       bg: 'bg-blue-50 dark:bg-blue-950/30',
//       icon: MapPin,
//       sparklinePath: "M0 30 Q 20 15, 40 25 T 80 10 T 100 20 V 40 H 0 Z"
//     },
//     {
//       label: 'Distance Covered',
//       value: '42 km',
//       trend: '+8%',
//       trendType: 'up',
//       color: 'text-indigo-500',
//       bg: 'bg-indigo-50 dark:bg-indigo-950/30',
//       icon: Zap,
//       sparklinePath: "M0 25 Q 15 35, 30 20 T 60 25 T 100 15 V 40 H 0 Z"
//     },
//     {
//       label: 'Orders Processed',
//       value: '05',
//       trend: '+2%',
//       trendType: 'up',
//       color: 'text-pink-500',
//       bg: 'bg-pink-50 dark:bg-pink-950/30',
//       icon: ShoppingBag,
//       sparklinePath: "M0 35 Q 25 30, 50 35 T 100 25 V 40 H 0 Z"
//     },
//     {
//       label: 'Daily Revenue',
//       value: '₹42K',
//       trend: '+12%',
//       trendType: 'up',
//       color: 'text-amber-500',
//       bg: 'bg-amber-50 dark:bg-amber-950/30',
//       icon: TrendingUpIcon,
//       sparklinePath: "M0 35 Q 30 20, 60 30 T 100 10 V 40 H 0 Z"
//     },
//   ];

//   return (
//     <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
//       {stats.map((stat, i) => (
//         <StatCard key={i} {...stat} />
//       ))}
//     </div>
//   );
// };

const ProgressCircle = ({ label, current, target, unit = '', color }) => {
  const percentage = Math.min(Math.round((current / target) * 100), 100);
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center text-center group p-2 rounded-xl transition-all hover:bg-gray-50 dark:hover:bg-gray-800/50">
      <div className="relative mb-2 transform transition-transform group-hover:scale-110">
        <svg className="w-12 h-12 -rotate-90 transform">
          <circle
            cx="24"
            cy="24"
            r={radius}
            stroke="currentColor"
            strokeWidth="5"
            fill="transparent"
            className="text-gray-100 dark:text-gray-800"
          />
          <circle
            cx="24"
            cy="24"
            r={radius}
            stroke="currentColor"
            strokeWidth="5"
            fill="transparent"
            strokeDasharray={circumference}
            style={{ strokeDashoffset, transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
            strokeLinecap="round"
            className={`${color}`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[10px] font-black text-gray-900 dark:text-white leading-none">{percentage}%</span>
        </div>
      </div>
      <p className="text-[9px] font-black text-gray-900 dark:text-white uppercase tracking-widest leading-none mb-1">{label}</p>
      <p className="text-[8px] font-bold text-gray-400 tabular-nums">{current}{unit} / {target}{unit}</p>
    </div>
  );
};

// const DailyTargetProgress = () => {
//   return (
//     <div className="bg-white dark:bg-gray-900 p-4 rounded-[1.5rem] border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden h-full group">
//       <div className="flex items-center justify-between mb-4 relative z-10">
//         <div>
//           <h3 className="text-[10px] font-black text-gray-900 dark:text-white tracking-widest uppercase">Performance Goals</h3>
//           <p className="text-[8px] font-bold text-gray-400 mt-0.5 uppercase tracking-tighter">Due <span className="text-indigo-600">05:40 PM</span></p>
//         </div>
//         <div className="p-1.5 bg-amber-50 dark:bg-amber-950/30 rounded-lg">
//           <Trophy size={14} className="text-amber-500" />
//         </div>
//       </div>

//       <div className="grid grid-cols-3 gap-1 mb-2 relative z-10">
//         <ProgressCircle label="Visits" current={8} target={12} color="text-indigo-600" />
//         <ProgressCircle label="Orders" current={5} target={8} color="text-pink-600" />
//         <ProgressCircle label="Revenue" current={42} target={60} unit="K" color="text-amber-600" />
//       </div>



//       {/* Background Accent */}
//       <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-amber-500/10 transition-all duration-700" />
//     </div>
//   );
// };





const TaskDetailOverlay = ({ task, onClose, onUpdateOperationalData, onStartTask, onFileUpload }) => {
  if (!task) return null;

  const handleOpenMaps = () => {
    if (!task.address) return;
    const encodedAddress = encodeURIComponent(`${task.store}, ${task.address}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
      <div
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-md"
        onClick={onClose}
      />

      <div className="relative bg-white dark:bg-gray-900 w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 slide-in-from-bottom-10 duration-500">
        {/* Left Side: Map & Info */}
        <div className="md:w-5/12 bg-gray-50 dark:bg-gray-950 relative overflow-hidden group">
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#6366F1 1.5px, transparent 1.5px)', backgroundSize: '30px 30px' }} />
          <div className="h-full w-full flex flex-col p-8 relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
                <MapPin className="text-indigo-600" size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest leading-none mb-1">Operational Site</p>
                <h4 className="text-lg font-black text-gray-900 dark:text-white leading-tight">{task.store}</h4>
              </div>
            </div>

            <div className="flex-1 bg-white/50 dark:bg-gray-800/30 backdrop-blur-sm rounded-[2rem] border border-gray-100 dark:border-gray-800/50 p-6 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center mb-4">
                <Navigation className="text-indigo-600 animate-pulse" size={32} />
              </div>
              <p className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-tight">Navigation Active</p>
              <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase">{task.distance} Away • {task.eta} Est.</p>
              <button
                onClick={handleOpenMaps}
                className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-indigo-100 dark:shadow-none hover:scale-105 transition-all"
              >
                Open Maps
              </button>
            </div>

            <div className="mt-8 space-y-4">
              <div className="p-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm group/client transition-all duration-300 relative overflow-visible">
                {/* Floating Overlay Company Description on Hover */}
                <div className="absolute left-0 right-0 bottom-full mb-2 opacity-0 pointer-events-none group-hover/client:opacity-100 group-hover/client:pointer-events-auto transition-all duration-300 z-[60]">
                  <div className="bg-gray-900 dark:bg-gray-950 p-5 rounded-2xl shadow-2xl border border-gray-800 text-left">
                    <div className="flex items-start gap-3 text-gray-300 mb-4">
                      <Info size={16} className="mt-0.5 shrink-0 text-indigo-400" />
                      <p className="text-xs font-medium leading-relaxed">
                        {task.companyDescription || 'Strategic partner for retail execution covering primary aisles and billing counters.'}
                      </p>
                    </div>
                    <a
                      href={`https://www.google.com/search?q=${encodeURIComponent(task.companyName)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-colors shadow-lg"
                    >
                      Company Profile <ExternalLink size={14} />
                    </a>
                  </div>
                  {/* Tooltip Triangle */}
                  <div className="w-4 h-4 bg-gray-900 border-r border-b border-gray-800 transform rotate-45 absolute -bottom-2 left-6"></div>
                </div>

                <p className="text-[10px] font-black uppercase text-indigo-600 dark:text-indigo-400 tracking-widest mb-3 flex items-center justify-between">
                  Client Profile
                  <span className="opacity-0 group-hover/client:opacity-100 transition-opacity text-gray-300 dark:text-gray-600">Hover for Insights</span>
                </p>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-950 flex items-center justify-center border border-gray-100 dark:border-gray-800">
                    <User size={20} className="text-gray-400" />
                  </div>
                  <div>
                    <h5 className="text-xs font-black text-gray-900 dark:text-white leading-tight">{task.companyName}</h5>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{task.companyInsight}</p>
                  </div>
                </div>
                <div className="space-y-2 border-t border-gray-50 dark:border-gray-800 pt-3">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-bold text-gray-400 uppercase">POC</span>
                    <span className="font-black text-gray-700 dark:text-gray-300">{task.companyContact}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-bold text-gray-400 uppercase">Email</span>
                    <span className="font-black text-indigo-500">{task.companyEmail}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Operational Workflow */}
        <div className="md:w-7/12 p-8 md:p-12 overflow-y-auto bg-white dark:bg-gray-900">
          <div className="flex items-center justify-end mb-10">
            <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all text-gray-400 hover:text-gray-900 dark:hover:text-white">
              <X size={24} />
            </button>
          </div>

          <p className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.3em] leading-none mb-3">{task.type}</p>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter leading-tight mb-4">
            {task.title}
          </h2>
          <p className="text-sm font-medium text-gray-500 leading-relaxed mb-8">
            {task.description || `Complete a thorough ${task.type.toLowerCase()} of ${task.store}'s inventory. Ensure all field protocols are followed and evidence is recorded accurately.`}
          </p>

          {!task.isTaskStarted ? (
            <div className="py-12 flex flex-col items-center justify-center border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-[2rem] bg-gray-50/50 dark:bg-gray-950/30">
              <div className="w-20 h-20 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-xl mb-6">
                <Play className="text-indigo-600 fill-indigo-600 ml-1" size={32} />
              </div>
              <h3 className="text-lg font-black text-gray-900 dark:text-white mb-2">Ready to Start Operation?</h3>
              <p className="text-xs text-gray-500 mb-8">Click below to unlock the operational checklist and status updates.</p>
              <button
                onClick={() => onStartTask(task.id)}
                className="px-12 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-100 dark:shadow-none hover:scale-105 transition-all"
              >
                Start Task Now
              </button>
            </div>
          ) : (
            <div className="space-y-8 animate-in slide-in-from-bottom-5 duration-500">
              {/* Dual Dropdowns */}
              <div className={`grid grid-cols-1 ${task.visitStatus !== 'Unavailable' ? 'sm:grid-cols-2' : ''} gap-4`}>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Visit Status</label>
                  <select
                    value={task.visitStatus}
                    onChange={(e) => onUpdateOperationalData(task.id, { visitStatus: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-gray-800 border border-transparent dark:border-gray-700 rounded-2xl px-5 py-4 text-xs font-black uppercase tracking-widest focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                  >
                    <option>Reached Client</option>
                    <option>Unavailable</option>
                    <option>Discussing</option>
                    <option>Delayed</option>
                  </select>
                </div>
                {task.visitStatus !== 'Unavailable' && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Mission Update</label>
                    <select
                      value={task.missionStatus}
                      onChange={(e) => onUpdateOperationalData(task.id, { missionStatus: e.target.value })}
                      className="w-full bg-gray-50 dark:bg-gray-800 border border-transparent dark:border-gray-700 rounded-2xl px-5 py-4 text-xs font-black uppercase tracking-widest focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                    >
                      <option>In Progress</option>
                      <option>Complete</option>
                      <option>Rejected</option>
                      <option>Follow Up</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Evidence Grid */}
              <div className="space-y-4 text-center sm:text-left">
                <h5 className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-widest border-b border-gray-100 dark:border-gray-800 pb-3">Evidence Collection</h5>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Store Front', key: 'storeFront', icon: <ImageIcon size={18} /> },
                    { label: 'Selfie at Visit', key: 'selfie', icon: <User size={18} /> },
                    { label: 'Product Display', key: 'productDisplay', icon: <Zap size={18} /> },
                    { label: 'Official Doc', key: 'officialDoc', icon: <FileText size={18} /> }
                  ].map((item, idx) => {
                    const isUploaded = task.evidence?.[item.key];
                    return (
                      <div
                        key={idx}
                        onClick={() => document.getElementById(`upload-${item.key}`).click()}
                        className={`group/upload relative p-4 bg-gray-50 dark:bg-gray-800 border-2 border-dashed ${isUploaded ? 'border-emerald-500 bg-emerald-50/30' : 'border-gray-100 dark:border-gray-700 hover:border-indigo-400'} rounded-2xl flex flex-col items-center justify-center text-center transition-all cursor-pointer`}
                      >
                        <input
                          id={`upload-${item.key}`}
                          type="file"
                          className="hidden"
                          onChange={(e) => onFileUpload(task.id, item.key, e.target.files[0])}
                        />
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 transition-colors shadow-sm ${isUploaded ? 'bg-emerald-500 text-white' : 'bg-white dark:bg-gray-700 text-gray-400 group-hover/upload:text-indigo-600'}`}>
                          {isUploaded ? <Check size={18} strokeWidth={3} /> : item.icon}
                        </div>
                        <p className={`text-[10px] font-black uppercase ${isUploaded ? 'text-emerald-700' : 'text-gray-500 dark:text-gray-400'}`}>
                          {isUploaded ? 'Verified' : item.label}
                        </p>
                        <div className="absolute top-2 right-2">
                          {isUploaded ? <Check size={10} className="text-emerald-500" /> : <Upload size={12} className="text-gray-300" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Task Description / Notes Field */}
              <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Visit Notes & Observations</label>
                </div>
                <textarea
                  value={task.visitNotes || ''}
                  onChange={(e) => onUpdateOperationalData(task.id, { visitNotes: e.target.value })}
                  placeholder="Enter any specific observations, client feedback, or issues faced during the visit..."
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-transparent dark:border-gray-700 rounded-2xl px-5 py-4 text-xs font-medium focus:ring-2 focus:ring-indigo-500 transition-all outline-none resize-none h-24 shadow-inner"
                />
              </div>

              <div className="pt-4">
                <button
                  onClick={onClose}
                  className="w-full py-5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl hover:scale-[1.01] active:scale-95 transition-all"
                >
                  Done & Update Mission
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Main Component ---
const EmployeeTasks = () => {
  const [view, setView] = useState('grid');
  const [activeTab, setActiveTab] = useState('hub');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterDate, setFilterDate] = useState('all');
  const [sortBy, setSortBy] = useState('nearest');
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [collapsedCategories, setCollapsedCategories] = useState({});

  const toggleCategory = (category) => {
    setCollapsedCategories(prev => ({ ...prev, [category]: !prev[category] }));
  };

  const context = useOutletContext() || {};
  const { workStatus = 'Offline', setWorkStatus = () => { } } = context;
  const [isOnline, setIsOnline] = useState(true);

  // Mock User Data
  const user = { name: 'Abhiram', role: 'Senior Field Executive' };

  const handleSetView = (newView) => {
    setView(newView);
    if (newView === 'map') {
      setActiveTab('map');
    } else {
      setActiveTab('hub');
    }
  };

  const initialTasks = [
    {
      id: 1,
      title: 'Store Inventory Audit',
      store: 'Big Bazaar Central',
      companyName: 'Future Group Retail',
      companyContact: 'Rajesh Kumar',
      companyEmail: 'ops@futuregroup.in',
      companyInsight: 'Premium Partner • 12 Months',
      companyDescription: 'Flagship hypermarket location with high daily footfall. Focus intensely on premium product placement and end-cap visibility tracking.',
      address: 'MG Road, Bengaluru',
      distance: '1.2 km',
      distanceVal: 1.2,
      eta: '20 mins',
      priority: 'high',
      status: 'pending',
      visitStatus: 'Reached Client',
      missionStatus: 'Pending',
      isTaskStarted: false,
      dueDate: 'Today, 05:00 PM',
      date: new Date(), // Today
      type: 'Audit',
      incentive: '₹250',
      incentiveVal: 250,
      difficulty: 'Medium',
      coords: { x: 45, y: 30 },
      evidence: { storeFront: null, selfie: null, productDisplay: null, officialDoc: null },
      checklist: [
        { id: 1, text: 'Verify store check-in with GPS verification', completed: false },
        { id: 2, text: 'Upload 4 photos of main aisle displays', completed: false },
        { id: 3, text: 'Log stock count for Tier 1 SKUs', completed: false },
        { id: 4, text: 'Collect manager digital signature', completed: false }
      ]
    },
    {
      id: 2,
      title: 'Merchandise Display',
      store: 'Reliance Fresh',
      companyName: 'Reliance Retail Ltd',
      companyContact: 'Anjali Sharma',
      companyEmail: 'store.support@reliance.com',
      companyInsight: 'Top Tier Client • High Volume',
      companyDescription: 'Core retail partner for daily essentials. Ensure correct pricing tags and promotional banners are prominently displayed and unblocked.',
      address: 'Indiranagar, Bengaluru',
      distance: '3.4 km',
      distanceVal: 3.4,
      eta: '25 mins',
      priority: 'medium',
      status: 'in-progress',
      visitStatus: 'Discussing',
      missionStatus: 'In Progress',
      isTaskStarted: true,
      dueDate: 'Today, 07:00 PM',
      date: new Date(), // Today
      type: 'Retail',
      incentive: '₹150',
      incentiveVal: 150,
      difficulty: 'Hard',
      coords: { x: 70, y: 50 },
      evidence: { storeFront: 'mock-file.jpg', selfie: null, productDisplay: null, officialDoc: null },
      checklist: [
        { id: 1, text: 'Clean primary display shelf', completed: true },
        { id: 2, text: 'Arrange promotional banners', completed: false },
        { id: 3, text: 'Verify price tag accuracy', completed: false }
      ]
    },
    {
      id: 3,
      title: 'Payment Collection',
      store: 'More Megamart',
      companyName: 'Aditya Birla Fashion',
      companyContact: 'Suresh Raina',
      companyEmail: 'finance@adityabirla.com',
      companyInsight: 'Enterprise Account • Active',
      companyDescription: 'A major enterprise account requiring strict compliance with our latest merchandising guidelines and payment collection protocols.',
      address: 'Koramangala, Bengaluru',
      distance: '0.8 km',
      distanceVal: 0.8,
      eta: '10 mins',
      priority: 'low',
      status: 'delayed',
      visitStatus: 'Delayed',
      missionStatus: 'Pending',
      isTaskStarted: false,
      dueDate: 'Yesterday',
      date: new Date(Date.now() - 86400000), // Yesterday
      type: 'Finance',
      incentive: '₹100',
      incentiveVal: 100,
      difficulty: 'Easy',
      coords: { x: 30, y: 80 },
      evidence: { storeFront: null, selfie: null, productDisplay: null, officialDoc: null },
      checklist: [
        { id: 1, text: 'Collect signed invoice copy', completed: false },
        { id: 2, text: 'Verify payment mode (Cheque/NEFT)', completed: false }
      ]
    },
    // --- Additional Yesterday Tasks ---
    {
      id: 11,
      title: 'Store Inspection Audit',
      store: 'Reliance Digital',
      companyName: 'Reliance Retail Ltd',
      companyContact: 'Kavita Reddy',
      companyEmail: 'kavita@reliance.com',
      companyInsight: 'Key Electronics Partner',
      address: 'Jayanagar, Bengaluru',
      distance: '4.2 km',
      distanceVal: 4.2,
      eta: '30 mins',
      priority: 'high',
      status: 'pending',
      visitStatus: 'Delayed',
      missionStatus: 'Pending',
      isTaskStarted: false,
      dueDate: 'Yesterday, 02:00 PM',
      date: new Date(Date.now() - 86400000), // Yesterday
      type: 'Audit',
      incentive: '₹200',
      incentiveVal: 200,
      difficulty: 'Medium',
      coords: { x: 35, y: 45 },
      evidence: { storeFront: null, selfie: null, productDisplay: null, officialDoc: null },
      checklist: [
        { id: 1, text: 'Check electronic displays for defects', completed: false },
        { id: 2, text: 'Verify staff uniform compliance', completed: false }
      ]
    },
    {
      id: 12,
      title: 'Hardware Maintenance',
      store: 'Star Bazaar',
      companyName: 'Trent Hypermarket',
      companyContact: 'Anil Kumar',
      companyEmail: 'anil@trent.in',
      companyInsight: 'Standard Account',
      address: 'Hebbal, Bengaluru',
      distance: '9.5 km',
      distanceVal: 9.5,
      eta: '45 mins',
      priority: 'medium',
      status: 'delayed',
      visitStatus: 'Missed',
      missionStatus: 'Overdue',
      isTaskStarted: false,
      dueDate: 'Yesterday, 11:30 AM',
      date: new Date(Date.now() - 86400000), // Yesterday
      type: 'Retail',
      incentive: '₹150',
      incentiveVal: 150,
      difficulty: 'Hard',
      coords: { x: 45, y: 75 },
      evidence: { storeFront: null, selfie: null, productDisplay: null, officialDoc: null },
      checklist: [
        { id: 1, text: 'Fix POS barcode scanner', completed: false },
        { id: 2, text: 'Update firmware on backend terminal', completed: false }
      ]
    },
    {
      id: 4,
      title: 'Feedback Survey',
      store: 'Spar Hyper',
      companyName: 'Spar International',
      companyContact: 'Vikram Singh',
      companyEmail: 'quality@spar.com',
      companyInsight: 'New Client • Pilot Phase',
      address: 'Bannerghatta, Bengaluru',
      distance: '5.6 km',
      distanceVal: 5.6,
      eta: '45 mins',
      priority: 'medium',
      status: 'pending',
      visitStatus: 'Reached Client',
      missionStatus: 'Pending',
      isTaskStarted: false,
      dueDate: 'Today, 10:00 AM',
      date: new Date(), // Today
      type: 'Survey',
      incentive: '₹50',
      incentiveVal: 50,
      difficulty: 'Easy',
      coords: { x: 20, y: 40 },
      evidence: { storeFront: null, selfie: null, productDisplay: null, officialDoc: null },
      checklist: [
        { id: 1, text: 'Interview 5 random customers', completed: false },
        { id: 2, text: 'Score customer service level', completed: false },
        { id: 3, text: 'Submit final report draft', completed: false }
      ]
    },
    // --- This Week Tasks ---
    {
      id: 5,
      title: 'Display Unit Setup',
      store: 'Nike Factory Store',
      companyName: 'Nike India',
      companyContact: 'Rahul Dravid',
      companyEmail: 'rahul@nike.com',
      companyInsight: 'Premium Partner',
      address: 'Whitefield, Bengaluru',
      distance: '8.2 km',
      distanceVal: 8.2,
      eta: '50 mins',
      priority: 'high',
      status: 'pending',
      visitStatus: 'Reached Client',
      missionStatus: 'Pending',
      isTaskStarted: false,
      dueDate: 'This Week',
      date: new Date(Date.now() + 3 * 86400000),
      type: 'Retail',
      incentive: '₹300',
      incentiveVal: 300,
      difficulty: 'Hard',
      coords: { x: 85, y: 20 },
      evidence: { storeFront: null, selfie: null, productDisplay: null, officialDoc: null },
      checklist: []
    },
    {
      id: 7,
      title: 'Market Competitor Analysis',
      store: 'D-Mart Sarjapur',
      companyName: 'Avenue Supermarts',
      companyContact: 'Priya Patel',
      companyEmail: 'priya@dmart.in',
      companyInsight: 'Tier 1 Account • High Frequency',
      address: 'Sarjapur Road, Bengaluru',
      distance: '6.1 km',
      distanceVal: 6.1,
      eta: '35 mins',
      priority: 'medium',
      status: 'pending',
      visitStatus: 'Reached Client',
      missionStatus: 'Pending',
      isTaskStarted: false,
      dueDate: 'This Week',
      date: new Date(Date.now() + 2 * 86400000),
      type: 'Survey',
      incentive: '₹180',
      incentiveVal: 180,
      difficulty: 'Medium',
      coords: { x: 55, y: 65 },
      evidence: { storeFront: null, selfie: null, productDisplay: null, officialDoc: null },
      checklist: [
        { id: 1, text: 'Visit 3 competitor outlets', completed: false },
        { id: 2, text: 'Record pricing data for key SKUs', completed: false },
        { id: 3, text: 'Photograph competitor display setups', completed: false },
      ]
    },
    {
      id: 8,
      title: 'Promotional Campaign Setup',
      store: 'Lifestyle Store',
      companyName: 'Landmark Group',
      companyContact: 'Sumanth Rao',
      companyEmail: 's.rao@landmark.in',
      companyInsight: 'Premium Partner • Event Client',
      address: 'Orion Mall, Bengaluru',
      distance: '10.3 km',
      distanceVal: 10.3,
      eta: '55 mins',
      priority: 'high',
      status: 'pending',
      visitStatus: 'Reached Client',
      missionStatus: 'Pending',
      isTaskStarted: false,
      dueDate: 'This Week',
      date: new Date(Date.now() + 4 * 86400000),
      type: 'Retail',
      incentive: '₹350',
      incentiveVal: 350,
      difficulty: 'Hard',
      coords: { x: 25, y: 70 },
      evidence: { storeFront: null, selfie: null, productDisplay: null, officialDoc: null },
      checklist: [
        { id: 1, text: 'Set up 2 promotional kiosks', completed: false },
        { id: 2, text: 'Brief store staff on campaign rules', completed: false },
      ]
    },
    // --- This Month Tasks ---
    {
      id: 6,
      title: 'Audit Report Filing',
      store: 'Zudio Indiranagar',
      companyName: 'Tata Retail',
      companyContact: 'Mahesh Babu',
      companyEmail: 'mahesh@tata.com',
      companyInsight: 'Key Account',
      address: 'Indiranagar, Bengaluru',
      distance: '2.8 km',
      distanceVal: 2.8,
      eta: '15 mins',
      priority: 'low',
      status: 'pending',
      visitStatus: 'Reached Client',
      missionStatus: 'Pending',
      isTaskStarted: false,
      dueDate: 'This Month',
      date: new Date(Date.now() + 20 * 86400000),
      type: 'Audit',
      incentive: '₹120',
      incentiveVal: 120,
      difficulty: 'Easy',
      coords: { x: 65, y: 45 },
      evidence: { storeFront: null, selfie: null, productDisplay: null, officialDoc: null },
      checklist: []
    },
    {
      id: 9,
      title: 'Annual Stock Reconciliation',
      store: 'Croma Electronics',
      companyName: 'Infiniti Retail',
      companyContact: 'Deepak Menon',
      companyEmail: 'deepak@croma.com',
      companyInsight: 'Enterprise Account • 3 Years',
      address: 'Phoenix Marketcity, Bengaluru',
      distance: '7.5 km',
      distanceVal: 7.5,
      eta: '40 mins',
      priority: 'high',
      status: 'pending',
      visitStatus: 'Reached Client',
      missionStatus: 'Pending',
      isTaskStarted: false,
      dueDate: 'This Month',
      date: new Date(Date.now() + 12 * 86400000),
      type: 'Finance',
      incentive: '₹400',
      incentiveVal: 400,
      difficulty: 'Hard',
      coords: { x: 40, y: 55 },
      evidence: { storeFront: null, selfie: null, productDisplay: null, officialDoc: null },
      checklist: [
        { id: 1, text: 'Cross-check invoices with physical stock', completed: false },
        { id: 2, text: 'Flag discrepancies in ERP system', completed: false },
        { id: 3, text: 'Submit signed reconciliation sheet', completed: false },
      ]
    },
    {
      id: 10,
      title: 'Customer Loyalty Drive',
      store: 'Shoppers Stop',
      companyName: 'K Raheja Corp',
      companyContact: 'Meena Iyer',
      companyEmail: 'm.iyer@shoppersstop.com',
      companyInsight: 'Long-term Partner • High Footfall',
      address: 'Koramangala, Bengaluru',
      distance: '3.9 km',
      distanceVal: 3.9,
      eta: '25 mins',
      priority: 'medium',
      status: 'pending',
      visitStatus: 'Reached Client',
      missionStatus: 'Pending',
      isTaskStarted: false,
      dueDate: 'This Month',
      date: new Date(Date.now() + 18 * 86400000),
      type: 'Survey',
      incentive: '₹200',
      incentiveVal: 200,
      difficulty: 'Medium',
      coords: { x: 60, y: 30 },
      evidence: { storeFront: null, selfie: null, productDisplay: null, officialDoc: null },
      checklist: [
        { id: 1, text: 'Enrol 20 customers in loyalty programme', completed: false },
        { id: 2, text: 'Distribute welcome kit packs', completed: false },
      ]
    }
  ];

  const [taskList, setTaskList] = useState(initialTasks);

  const updateTaskStatus = (taskId, newStatus) => {
    setTaskList(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    // Also update selected task if it's open to reflect change immediately
    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask(prev => ({ ...prev, status: newStatus }));
    }
  };

  const updateTaskOperationalData = (taskId, data) => {
    setTaskList(prev => prev.map(t => t.id === taskId ? { ...t, ...data } : t));
    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask(prev => ({ ...prev, ...data }));
    }
  };

  const handleStartTask = (taskId) => {
    updateTaskOperationalData(taskId, { isTaskStarted: true, status: 'in-progress' });
  };

  const handleFileUpload = (taskId, evidenceType, file) => {
    // In a real app, you'd upload the file here. 
    // For now, we'll store the filename or a dummy value.
    if (file) {
      updateTaskOperationalData(taskId, {
        evidence: {
          ...taskList.find(t => t.id === taskId).evidence,
          [evidenceType]: file.name
        }
      });
    }
  };

  const toggleChecklistItem = (taskId, itemId) => {
    setTaskList(prev => prev.map(t =>
      t.id === taskId
        ? { ...t, checklist: t.checklist.map(item => item.id === itemId ? { ...item, completed: !item.completed } : item) }
        : t
    ));
    // Update selectedTask as well
    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask(prev => ({
        ...prev,
        checklist: prev.checklist.map(item => item.id === itemId ? { ...item, completed: !item.completed } : item)
      }));
    }
  };

  const filteredTasks = taskList
    .filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.store.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;

      // Date Filtering Logic
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const endOfWeek = new Date(today);
      endOfWeek.setDate(endOfWeek.getDate() + 7);
      const endOfMonth = new Date(today);
      endOfMonth.setDate(endOfMonth.getDate() + 30);

      const taskDate = new Date(task.date);
      const taskDay = new Date(taskDate.getFullYear(), taskDate.getMonth(), taskDate.getDate());

      let matchesDate = true;
      if (filterDate === 'today') {
        matchesDate = taskDay.getTime() === today.getTime();
      } else if (filterDate === 'yesterday') {
        matchesDate = taskDay.getTime() === yesterday.getTime();
      } else if (filterDate === 'this_week') {
        matchesDate = taskDay > today && taskDay <= endOfWeek;
      } else if (filterDate === 'this_month') {
        matchesDate = taskDay > today && taskDay <= endOfMonth;
      }

      return matchesSearch && matchesPriority && matchesDate;
    })
    .sort((a, b) => {
      if (sortBy === 'nearest') return a.distanceVal - b.distanceVal;
      if (sortBy === 'highest_pay') return b.incentiveVal - a.incentiveVal;
      if (sortBy === 'priority') {
        const pMap = { high: 3, medium: 2, low: 1 };
        return pMap[b.priority] - pMap[a.priority];
      }
      return 0;
    });

  const groupTasksByDate = (tasks) => {
    const groups = {
      'Today': [],
      'Yesterday': [],
      'This Week': [],
      'This Month': []
    };

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const endOfWeek = new Date(today);
    endOfWeek.setDate(endOfWeek.getDate() + 7);
    const endOfMonth = new Date(today);
    endOfMonth.setDate(endOfMonth.getDate() + 30);

    tasks.forEach(task => {
      const taskDate = new Date(task.date);
      const taskDay = new Date(taskDate.getFullYear(), taskDate.getMonth(), taskDate.getDate());

      if (taskDay.getTime() === today.getTime()) {
        groups['Today'].push(task);
      } else if (taskDay.getTime() === yesterday.getTime()) {
        groups['Yesterday'].push(task);
      } else if (taskDay > today && taskDay <= endOfWeek) {
        groups['This Week'].push(task);
      } else if (taskDay > today && taskDay <= endOfMonth) {
        groups['This Month'].push(task);
      }
    });

    return groups;
  };

  const groupedTasks = groupTasksByDate(filteredTasks);

  const nearbyStores = [
    { name: 'Spar Hypermarket', distance: '1.2 km', category: 'Retail' },
    { name: 'Reliance Digital', distance: '2.5 km', category: 'Electronics' },
    { name: 'More Megamart', distance: '0.8 km', category: 'Grocery' }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-50 text-red-600 border-red-100 dark:bg-red-950/30';
      case 'medium': return 'bg-orange-50 text-orange-600 border-orange-100 dark:bg-orange-950/30';
      case 'low': return 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/30';
      default: return 'bg-gray-50 text-gray-500 border-gray-100 dark:bg-gray-800/30';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="text-emerald-500" size={14} />;
      case 'in-progress': return <Clock className="text-orange-500 animate-pulse" size={14} />;
      case 'follow-up': return <AlertCircle className="text-purple-500" size={14} />;
      case 'delayed': return <AlertCircle className="text-red-500" size={14} />;
      default: return <Circle className="text-gray-300" size={14} />;
    }
  };

  const getCategoryIcon = (type) => {
    switch (type) {
      case 'Audit': return <FileText size={14} />;
      case 'Retail': return <ShoppingBag size={14} />;
      case 'Finance': return <CreditCard size={14} />;
      default: return <Zap size={14} />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-40 px-4 md:px-0">
      {/* <PerformanceStatsOverview /> */}
      <style>{`
        @keyframes dash {
          to { stroke-dashoffset: -20; }
        }
        @keyframes pulse-soft {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.8; }
        }
        .animate-dash {
          stroke-dasharray: 10;
          animation: dash 5s linear infinite;
        }
        .animate-pulse-soft {
          animation: pulse-soft 3s ease-in-out infinite;
        }
      `}</style>


      <div className="space-y-10">
        {/* Master Page Header */}
        <div className="flex-1 space-y-3 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20">
            <LayoutGrid size={14} className="text-indigo-600 dark:text-indigo-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Assignment Hub</span>
          </div>
          <div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-none mb-2 mt-1">
              Active <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">Tasks</span>
            </h2>
            <p className="text-sm font-bold text-gray-500 dark:text-gray-400 flex items-center gap-2">
              Manage your operational queue
              <span className="hidden sm:inline w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700" />
              <span className="text-xs uppercase tracking-widest">
                Sorted by <span className="text-indigo-600 dark:text-indigo-400 font-black">{sortBy.replace('_', ' ')}</span>
              </span>
            </p>
          </div>
        </div>

        {/* Tab Navigation Switcher */}
        <div className="flex bg-gray-50 dark:bg-gray-900/50 p-2 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-inner w-full">
          <button
            onClick={() => setActiveTab('hub')}
            className={`flex-1 flex items-center justify-center gap-3 py-3 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'hub'
              ? 'bg-white dark:bg-gray-800 text-indigo-600 shadow-xl'
              : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
              }`}
          >
            <LayoutGrid size={18} />
            Assignment Hub
          </button>
          <button
            onClick={() => setActiveTab('map')}
            className={`flex-1 flex items-center justify-center gap-3 py-3 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'map'
              ? 'bg-white dark:bg-gray-800 text-indigo-600 shadow-xl'
              : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
              }`}
          >
            <MapIcon size={18} />
            Live Route Map
          </button>
        </div>

        {activeTab === 'map' ? (
          /* Map View - Interactive Route */
          <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-6 md:p-10 border border-gray-100 dark:border-gray-800 shadow-sm group animate-in slide-in-from-left-4 duration-500 overflow-hidden relative">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 relative z-10">
              <div>
                <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter uppercase">Live Route Map</h2>
                <p className="text-gray-400 text-sm font-bold mt-1 tracking-tight">
                  Optimized logistics path for <span className="text-indigo-600">12.4 km</span> travel
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-100 dark:border-emerald-800/50">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  GPS Active
                </div>
                <button className="flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-indigo-200 dark:shadow-none">
                  <Navigation size={18} className="animate-pulse" />
                  Optimize Route
                </button>
              </div>
            </div>

            <div className="relative h-[550px] bg-gray-50 dark:bg-gray-950 rounded-[3rem] border border-gray-200 dark:border-gray-800 overflow-hidden shadow-2xl">
              {/* SVG Route Visualization */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40" preserveAspectRatio="none">
                <path
                  d="M 30 80 Q 30 55, 45 30 T 70 50"
                  stroke="url(#route-gradient)"
                  strokeWidth="4"
                  fill="none"
                  className="animate-dash"
                />
                <defs>
                  <linearGradient id="route-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6366F1" />
                    <stop offset="100%" stopColor="#EC4899" />
                  </linearGradient>
                </defs>
              </svg>

              <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#6366F1 1.5px, transparent 1.5px)', backgroundSize: '40px 40px' }} />

              {taskList.map((task) => (
                <div key={task.id} className="absolute transition-all hover:scale-110 cursor-pointer z-10 group/marker" style={{ left: `${task.coords.x}%`, top: `${task.coords.y}%` }}>
                  <div className="relative">
                    {/* Ripple Effect */}
                    <div className={`absolute inset-0 scale-[2.5] opacity-20 animate-ping rounded-full ${task.priority === 'high' ? 'bg-red-500' : 'bg-indigo-500'
                      }`} />

                    <div className={`p-3 rounded-2xl shadow-2xl ring-4 ring-white dark:ring-gray-900 ${getPriorityColor(task.priority)} flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 transition-all group-hover/marker:shadow-indigo-200 group-hover/marker:-translate-y-2/3`}>
                      <MapPin size={24} className="fill-current" />

                      {/* Rich Tooltip */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 opacity-0 group-hover/marker:opacity-100 transition-all pointer-events-none p-4 bg-white dark:bg-gray-900 rounded-[1.5rem] shadow-2xl border border-gray-100 dark:border-gray-700 min-w-[200px]">
                        <p className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">{task.type} • {task.distance}</p>
                        <h4 className="text-xs font-black text-gray-900 dark:text-white mt-1 leading-tight">{task.store}</h4>
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50 dark:border-gray-800">
                          <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${getPriorityColor(task.priority)}`}>{task.priority}</span>
                          <span className="text-[10px] font-black text-emerald-600">{task.incentive}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Floating Map Intel */}
              <div className="absolute top-8 right-8 bg-white/90 dark:bg-gray-900/90 backdrop-blur-3xl p-5 rounded-[2rem] border border-white/20 shadow-2xl flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-600">
                    <TrendingUpIcon size={16} />
                  </div>
                  <div>
                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Efficiency</p>
                    <p className="text-sm font-black text-gray-900 dark:text-white leading-none">94% Optimal</p>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-8 left-8 bg-white/90 dark:bg-gray-900/90 backdrop-blur-3xl p-5 rounded-[2rem] border border-white/20 shadow-2xl flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg">
                    <Navigation size={20} />
                  </div>
                  <div>
                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Next Best Step</p>
                    <p className="text-xs font-black text-gray-900 dark:text-white leading-none">Head to {taskList[0]?.store}</p>
                  </div>
                </div>
                <div className="w-px h-10 bg-gray-200 dark:bg-gray-700" />
                <div>
                  <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Travel Time</p>
                  <p className="text-xs font-black text-emerald-600 leading-none">~12 mins</p>
                </div>
              </div>
            </div>

            {/* Decorative Background Glows */}
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none" />
          </div>
        ) : (
          /* Task Hub Grid - Ultra-Compact High-Density */
          <div className="bg-white dark:bg-gray-900 rounded-[3rem] p-8 md:p-14 border border-gray-100 dark:border-gray-800 shadow-xl space-y-12 animate-in slide-in-from-right-4 duration-500">
            <div className="flex flex-col lg:flex-row lg:items-center gap-8">
              {/* Header logic moved to top of page */}

              <div className="flex flex-col lg:flex-row items-center justify-end gap-4 ml-auto w-full">
                <div className="relative group/search w-full lg:flex-1 lg:max-w-xl">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within/search:text-indigo-600 transition-colors" size={18} />
                  <input
                    type="text"
                    placeholder="Search mission queue..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 pr-6 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-xs font-bold outline-none border border-transparent focus:border-indigo-100 dark:focus:border-indigo-900/30 w-full transition-all shadow-inner"
                  />
                </div>

                <div className="flex bg-gray-50 dark:bg-gray-800 p-1.5 rounded-xl border border-gray-100 dark:border-gray-700 w-full lg:w-auto overflow-x-auto shrink-0 shadow-sm text-gray-600 dark:text-gray-400 scrollbar-hide">
                  <select
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value)}
                    className="bg-transparent text-[10px] font-black uppercase tracking-widest px-3 py-1.5 outline-none border-none cursor-pointer hover:text-indigo-600 transition-colors"
                  >
                    <option value="all">Priority: All</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                  <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 self-center mx-1 shrink-0" />
                  <select
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    className="bg-transparent text-[10px] font-black uppercase tracking-widest px-3 py-1.5 outline-none border-none cursor-pointer hover:text-indigo-600 transition-colors"
                  >
                    <option value="all">Time: All</option>
                    <option value="today">Today</option>
                    <option value="yesterday">Yesterday</option>
                    <option value="this_week">This Week</option>
                    <option value="this_month">This Month</option>
                  </select>
                  <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 self-center mx-1 shrink-0" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-transparent text-[10px] font-black uppercase tracking-widest px-3 py-1.5 outline-none border-none cursor-pointer hover:text-indigo-600 transition-colors"
                  >
                    <option value="nearest">Sort: Nearest</option>
                    <option value="highest_pay">Payout</option>
                    <option value="priority">Priority</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {Object.entries(groupedTasks).map(([category, tasks]) => (
                tasks.length > 0 && (
                  <div key={category} className="space-y-3">
                    <div
                      className="flex items-center gap-4 border-b border-gray-100 dark:border-gray-800 pb-4 cursor-pointer select-none"
                      onClick={() => toggleCategory(category)}
                    >
                      <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-400">
                        {category === 'Today' ? <Clock size={18} className="text-indigo-600" /> :
                          category === 'Yesterday' ? <Calendar size={18} /> :
                            category === 'This Week' ? <LayoutGrid size={18} /> :
                              <TrendingUpIcon size={18} />}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-widest">{category}'s Missions</h3>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{tasks.length} Operational Targets</p>
                      </div>
                      <div className={`p-2 rounded-xl text-gray-400 transition-transform duration-300 ${collapsedCategories[category] ? 'rotate-180' : ''}`}>
                        <ChevronDown size={18} />
                      </div>
                    </div>

                    {!collapsedCategories[category] && (
                      <div className={view === 'list' ? "space-y-3" : "grid grid-cols-1 gap-3"}>
                        {tasks.map((task) => (
                          <div
                            key={task.id}
                            onClick={() => setSelectedTask(task)}
                            className="group relative bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2rem] overflow-hidden transition-all hover:shadow-3xl hover:border-indigo-100 dark:hover:border-indigo-900/40 flex flex-col md:flex-row md:items-center cursor-pointer"
                          >
                            {/* Left Priority Strip */}
                            <div className={`absolute left-0 top-0 bottom-0 w-2 ${task.priority === 'high' ? 'bg-red-500' :
                              task.priority === 'medium' ? 'bg-orange-500' : 'bg-emerald-500'
                              }`} />

                            {/* Info Section - Left */}
                            <div className="p-5 flex-1 flex items-start gap-4">
                              <div className={`p-3 rounded-xl shrink-0 ${getPriorityColor(task.priority)} shadow-sm group-hover:scale-110 transition-transform`}>
                                {getCategoryIcon(task.type)}
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-3 mb-2">
                                  <p className="text-xs font-black uppercase text-gray-400 tracking-wider leading-none">{task.type}</p>
                                  <span className="w-1.5 h-1.5 rounded-full bg-gray-200" />
                                  <p className={`text-xs font-bold uppercase tracking-widest ${task.status === 'in-progress' ? 'text-orange-500 animate-pulse' :
                                    task.status === 'delayed' ? 'text-red-500' : 'text-gray-500'
                                    }`}>
                                    {task.status.replace('-', ' ')}
                                  </p>
                                  <span className="w-1.5 h-1.5 rounded-full bg-gray-200" />
                                  <span className={`text-xs font-black uppercase px-3 py-1 rounded-full border ${task.priority === 'high' ? 'bg-red-50 text-red-600 border-red-100' :
                                    task.priority === 'medium' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                                      'bg-emerald-50 text-emerald-600 border-emerald-100'
                                    }`}>
                                    {task.priority}
                                  </span>
                                </div>
                                <h3 className="text-lg font-black text-gray-900 dark:text-white mb-1 tracking-tighter leading-tight group-hover:text-indigo-600 transition-colors truncate">
                                  {task.title}
                                </h3>
                                <div className="flex items-center gap-3">
                                  <MapPin size={16} className="text-gray-400 shrink-0" />
                                  <p className="text-xs font-bold text-gray-600 dark:text-gray-400 truncate">
                                    {task.store} • <span className="text-gray-400 font-medium">{task.address}</span>
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Action Section - Right */}
                            <div className="p-5 pl-5 md:w-[360px] flex flex-col justify-center items-end gap-3 bg-gray-50/30 dark:bg-gray-800/20 md:border-l md:border-gray-50 md:dark:border-gray-800/50">
                              <div className="flex items-center gap-8 w-full justify-end mb-2">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center shadow-inner">
                                    <Navigation size={18} className="text-indigo-600" />
                                  </div>
                                  <div>
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Distance</p>
                                    <p className="text-sm font-black text-gray-900 dark:text-white leading-none">{task.distance}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-xl bg-pink-50 dark:bg-pink-900/30 flex items-center justify-center shadow-inner">
                                    <Clock size={18} className="text-pink-600" />
                                  </div>
                                  <div>
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Arrival</p>
                                    <p className="text-sm font-black text-gray-900 dark:text-white leading-none">{task.eta}</p>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-3 w-full justify-end">
                                <button className="w-auto flex items-center justify-center gap-3 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-indigo-100 dark:shadow-none whitespace-nowrap hover:scale-[1.02] active:scale-95">
                                  Start Task
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Task Detail Overlay */}
      <TaskDetailOverlay
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
        onUpdateOperationalData={updateTaskOperationalData}
        onStartTask={handleStartTask}
        onFileUpload={handleFileUpload}
      />
    </div>
  );
};

export default EmployeeTasks;
