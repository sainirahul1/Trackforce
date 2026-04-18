import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  MapPin, Navigation, Clock, CheckCircle2, ChevronRight, 
  Calendar, AlertCircle, Phone, Image as ImageIcon, 
  Camera, Map, X, Users, Store, FileText, MessageSquare,
  Building2, Briefcase, ShieldCheck, Smartphone, Target
} from 'lucide-react';
import Button from '../components/ui/Button';

import { getVisits, getVisitById } from '../services/visitService';
import { getSyncCachedData } from '../utils/cacheHelper';

// High-Fidelity Image Modal (External to main component for cleaner structure)
const ImageModal = ({ src, onClose }) => {
  if (!src) return null;
  return (
    <div 
      className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-gray-950/90 backdrop-blur-2xl animate-in fade-in duration-300"
      onClick={onClose}
    >
      <button 
        onClick={onClose}
        className="absolute top-8 right-8 p-4 bg-white/10 hover:bg-white/20 text-white rounded-3xl transition-all z-[310]"
      >
        <X size={32} />
      </button>
      <div className="relative max-w-5xl w-full h-full flex items-center justify-center p-4 md:p-12 animate-in zoom-in-95 duration-500">
        <img 
          src={src} 
          alt="Evidence Detail" 
          className="max-w-full max-h-full object-contain rounded-[3rem] shadow-[0_32px_128px_rgba(0,0,0,0.5)] border-4 border-white/10"
          onClick={(e) => e.stopPropagation()} 
        />
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 px-8 py-4 bg-white/10 backdrop-blur-3xl rounded-3xl border border-white/20 shadow-2xl flex items-center gap-4">
          <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white">
            <ShieldCheck size={20} />
          </div>
          <div>
            <p className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Security-Encrypted Asset</p>
            <p className="text-[8px] font-bold text-gray-300 uppercase tracking-widest mt-0.5">Verified Intelligence Proof</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const EmployeeVisits = ({ defaultFilter = 'All', pageTitle = 'Visit History' }) => {
  const { setPageLoading } = useOutletContext();
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [selectedVisitLoading, setSelectedVisitLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('Overview'); // Tab options: 'Overview', 'Evidence', 'Mission'
  const [filterStatus, setFilterStatus] = useState(defaultFilter);
  const [filterDate, setFilterDate] = useState('');
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState(null);
  const dateInputRef = React.useRef(null);

  const transformVisits = (data) => {
    return data.map(v => {
      const visitDate = new Date(v.timestamp || v.createdAt);
      const isValidDate = !isNaN(visitDate.getTime());

      let statusLabel = v.status ? v.status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Unknown';
      if (v.status === 'not_interested') statusLabel = 'Rejected';

      return {
        ...v,
        store: v.storeName,
        visitType: v.visitType || 'mission', 
        time: isValidDate ? visitDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '---',
        date: isValidDate ? visitDate.toISOString().split('T')[0] : '---',
        address: v.address || 'Location data not available',
        distance: v.distance || '---',
        eta: v.eta || '---',
        status: statusLabel,
        reviewStatus: v.reviewStatus || 'pending',
        rejectionReason: v.rejectionReason || null,
        companyDescription: 'Organization Partner',
        feedback: v.notes || 'No specific feedback recorded.',
        uploadedImages: v.photos || [],
        taskTitle: v.taskTitle,
        taskType: v.taskType,
        checklist: v.checklist || [],
        rejectionIntelligence: v.visitForm?.notInterestedReason || null,
        nextFollowUp: v.visitForm?.followUpDate || null
      };
    });
  };

  const fetchVisits = async (isBackground = false) => {
    try {
      if (!isBackground) setLoading(true);
      const data = await getVisits(isBackground);
      setVisits(transformVisits(data));
    } catch (err) {
      console.error('Error fetching visits:', err);
    } finally {
      setLoading(false);
      if (setPageLoading) setPageLoading(false);
    }
  };

  useEffect(() => {
    const cachedData = getSyncCachedData('visits');
    if (cachedData) {
      setVisits(transformVisits(cachedData));
      setLoading(false);
      if (setPageLoading) setPageLoading(false);
      fetchVisits(true);
    } else {
      fetchVisits();
    }
  }, []);

  const handleVisitClick = async (visit) => {
    try {
      setSelectedVisitLoading(true);
      setSelectedVisit(visit); 
      const fullVisit = await getVisitById(visit._id);
      const visitDate = new Date(fullVisit.timestamp || fullVisit.createdAt);
      const isValidDate = !isNaN(visitDate.getTime());

      let statusLabel = fullVisit.status ? fullVisit.status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Unknown';
      if (fullVisit.status === 'not_interested') statusLabel = 'Rejected';

      setSelectedVisit({
        ...fullVisit,
        store: fullVisit.storeName,
        time: isValidDate ? visitDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '---',
        date: isValidDate ? visitDate.toISOString().split('T')[0] : '---',
        status: statusLabel,
        reviewStatus: fullVisit.reviewStatus || 'pending',
        rejectionReason: fullVisit.rejectionReason || null,
        feedback: fullVisit.notes || 'No specific feedback recorded.',
        uploadedImages: fullVisit.photos || [],
        rejectionIntelligence: fullVisit.visitForm?.notInterestedReason || null,
        nextFollowUp: fullVisit.visitForm?.followUpDate || null
      });
    } catch (err) {
      console.error('Error fetching visit details:', err);
    } finally {
      setSelectedVisitLoading(false);
    }
  };

  const filteredVisits = visits.filter(visit => {
    const matchesStatus = filterStatus === 'All' || visit.status === filterStatus;
    const matchesDate = !filterDate || visit.date === filterDate;
    return matchesStatus && matchesDate;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 px-4 md:px-8 pb-24 pt-10">
      {previewImage && <ImageModal src={previewImage} onClose={() => setPreviewImage(null)} />}

      <div className="max-w-7xl mx-auto space-y-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em]">{pageTitle}</span>
            </div>
            <h1 className="text-4xl font-black text-gray-950 dark:text-white tracking-tighter">Field Intelligence</h1>
            <p className="text-xs font-bold text-gray-500 mt-2 uppercase tracking-widest">Audit Logs & Verification Archives</p>
          </div>
          <div className="flex items-center gap-3">
             <button
               onClick={() => {
                 setFilterStatus('All');
                 setFilterDate('');
               }}
               className="p-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm text-gray-400 hover:text-indigo-600 hover:border-indigo-100 transition-all active:scale-95"
             >
                <RotateCcw size={20} />
             </button>
             <div className="relative group">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-indigo-500 transition-colors" size={18} />
                <input 
                  type="date" 
                  ref={dateInputRef}
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="pl-12 pr-6 py-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl shadow-sm text-xs font-black uppercase tracking-widest text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all" 
                />
             </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar">
          {['All', 'Completed', 'Partial', 'Rejected', 'Follow-up'].map((stat) => (
            <button
              key={stat}
              onClick={() => setFilterStatus(stat)}
              className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border-2
                ${filterStatus === stat 
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-600/30' 
                  : 'bg-white dark:bg-gray-900 text-gray-400 border-gray-100 dark:border-gray-800 hover:border-indigo-100'}`}
            >
              {stat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 animate-pulse text-gray-300">
            <Camera size={64} className="mb-4 opacity-10" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em]">Decrypting Records...</p>
          </div>
        ) : filteredVisits.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-8 duration-700">
            {filteredVisits.map((visit) => (
              <div 
                key={visit._id}
                onClick={() => handleVisitClick(visit)}
                className="group bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-2xl hover:border-indigo-100 dark:hover:border-indigo-500/30 transition-all cursor-pointer relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/[0.03] rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                
                <div className="flex items-center justify-between mb-8">
                  <div className={`p-4 rounded-2xl shadow-sm
                    ${visit.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 
                      visit.status === 'Rejected' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'}`}>
                    {visit.status === 'Completed' ? <CheckCircle2 size={24} /> : 
                     visit.status === 'Rejected' ? <AlertCircle size={24} /> : <Clock size={24} />}
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{visit.time}</p>
                    <p className={`text-[10px] font-black uppercase tracking-widest
                      ${visit.status === 'Completed' ? 'text-emerald-500' : 
                        visit.status === 'Rejected' ? 'text-rose-500' : 'text-amber-500'}`}>
                      {visit.status}
                    </p>
                  </div>
                </div>

                <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight mb-2 uppercase italic">{visit.store}</h3>
                <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest line-clamp-1 mb-6">
                   <MapPin size={12} className="text-indigo-400" /> {visit.address}
                </div>

                <div className="pt-6 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-3">
                      {visit.uploadedImages.slice(0, 3).map((img, i) => (
                        <div key={i} className="w-8 h-8 rounded-lg border-2 border-white dark:border-gray-900 bg-gray-100 overflow-hidden shadow-sm hover:-translate-y-1 transition-all">
                          <img src={img} alt="proof" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                    {visit.uploadedImages.length > 3 && (
                      <span className="text-[9px] font-black text-gray-400 tracking-widest">+{visit.uploadedImages.length - 3} MORE</span>
                    )}
                  </div>
                  <ChevronRight size={20} className="text-gray-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-40 text-center bg-white dark:bg-gray-900 rounded-[3rem] border-2 border-dashed border-gray-100 dark:border-gray-800">
             <div className="mx-auto w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6 text-gray-200">
                <ImageIcon size={32} />
             </div>
             <p className="text-sm font-black text-gray-400 uppercase tracking-widest">No matching field intelligence</p>
          </div>
        )}
      </div>

      {/* DETAIL DRAWER / MODAL */}
      {selectedVisit && (
        <div className="fixed inset-0 z-[250] flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-500">
           <div className="absolute inset-0 bg-gray-950/80 backdrop-blur-md" onClick={() => setSelectedVisit(null)}></div>
           
           <div className="bg-white dark:bg-gray-900 w-full max-w-4xl h-[92vh] sm:h-auto sm:max-h-[85vh] rounded-t-[3rem] sm:rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col animate-in slide-in-from-bottom-20 duration-500">
              
              {selectedVisitLoading && (
                <div className="absolute inset-0 z-50 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm flex flex-col items-center justify-center">
                   <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-4" />
                   <p className="text-[10px] font-black uppercase text-indigo-600 tracking-widest">Syncing Evidence...</p>
                </div>
              )}

              <div className="p-8 pb-4 shrink-0 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between bg-white dark:bg-gray-900">
                 <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg
                      ${selectedVisit.status === 'Completed' ? 'bg-emerald-500' : 
                        selectedVisit.status === 'Rejected' ? 'bg-rose-500' : 'bg-amber-500'}`}>
                      {selectedVisit.status === 'Completed' ? <CheckCircle2 size={24} /> : 
                       selectedVisit.status === 'Rejected' ? <AlertCircle size={24} /> : <Clock size={24} />}
                    </div>
                    <div>
                       <h3 className="text-2xl font-black text-gray-950 dark:text-white tracking-tight uppercase italic">{selectedVisit.store}</h3>
                       <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{selectedVisit.date}</span>
                          <span className="w-1 h-1 rounded-full bg-gray-300" />
                          <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{selectedVisit.status}</span>
                       </div>
                    </div>
                 </div>
                 <button 
                  onClick={() => setSelectedVisit(null)}
                  className="p-4 text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-2xl transition-all"
                 >
                    <X size={24} />
                 </button>
              </div>

              <div className="flex-1 overflow-y-auto no-scrollbar">
                <div className="p-8 space-y-10">
                  <div className="flex border-b border-gray-100 dark:border-gray-800">
                    {['Overview', 'Evidence', 'Mission'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-8 py-4 text-[10px] font-black uppercase tracking-widest relative transition-all
                          ${activeTab === tab ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
                      >
                        {tab}
                        {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-t-full" />}
                      </button>
                    ))}
                  </div>

                  {activeTab === 'Overview' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-8 bg-gray-50/50 dark:bg-white/5 rounded-[2.5rem] border border-gray-100 dark:border-white/5 group">
                           <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6 flex items-center gap-2">
                             <MapPin size={14} className="text-rose-500" /> Geolocation Intel
                           </h4>
                           <p className="text-sm font-bold text-gray-900 dark:text-gray-100 leading-relaxed">{selectedVisit.address}</p>
                           <div className="mt-6 flex gap-4 pt-6 border-t border-gray-100 dark:border-white/5">
                              <button className="flex-1 flex items-center justify-center gap-2 bg-white dark:bg-white/10 text-gray-900 dark:text-white py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:shadow-lg transition-all active:scale-95">
                                <Navigation size={14} /> Directions
                              </button>
                              <button className="flex-1 flex items-center justify-center gap-2 bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-200 dark:hover:bg-white/20 transition-all">
                                <Phone size={14} className="text-emerald-500" /> Call
                              </button>
                           </div>
                        </div>

                        <div className="bg-blue-50/50 dark:bg-blue-500/5 p-8 rounded-[2.5rem] border border-blue-100 dark:border-blue-500/10 relative overflow-hidden group">
                           <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                              <MessageSquare size={120} />
                           </div>
                           <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400 mb-4 flex items-center gap-2">
                              <MessageSquare size={14} /> Reporter Remarks
                           </h4>
                           <p className="text-base font-bold text-gray-700 dark:text-gray-300 leading-relaxed italic relative z-10">
                             "{selectedVisit.feedback || "The field executive has not provided any specific notes for this mission."}"
                           </p>
                        </div>
                      </div>

                      <div className="flex gap-4 p-6 bg-gray-50/50 dark:bg-white/5 rounded-[2rem] border border-gray-100 dark:border-white/5">
                        <div className="flex-1 flex flex-col items-center gap-1 border-r border-gray-100 dark:border-white/10">
                           <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Entry Time</span>
                           <span className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">{selectedVisit.time}</span>
                        </div>
                        <div className="flex-1 flex flex-col items-center gap-1">
                           <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Calculated Dist</span>
                           <span className="text-sm font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-tight">{selectedVisit.distance}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'Evidence' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-1.5 h-6 bg-indigo-600 rounded-full shadow-lg shadow-indigo-500/20" />
                          <h4 className="text-[11px] font-black uppercase tracking-[0.22em] text-gray-900 dark:text-white flex items-center gap-2">
                            <ShieldCheck size={14} className="text-indigo-600" /> Security-Encrypted Evidence Gallery
                          </h4>
                        </div>
                      </div>
                      
                      {selectedVisit.uploadedImages && selectedVisit.uploadedImages.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                          {selectedVisit.uploadedImages.map((img, idx) => (
                            <div 
                              key={idx} 
                              className="relative aspect-square group cursor-zoom-in"
                              onClick={() => setPreviewImage(img)}
                            >
                              <div className="absolute inset-0 bg-indigo-600 translate-x-2 translate-y-2 rounded-[2.5rem] opacity-0 group-hover:opacity-10 transition-all duration-300"></div>
                              <div className="relative h-full w-full rounded-[2.5rem] overflow-hidden border-2 border-white dark:border-gray-800 shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-1">
                                <img src={img} alt={`Proof ${idx + 1}`} className="h-full w-full object-cover transition-transform duration-[2s] group-hover:scale-110" />
                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-gray-950 px-6 py-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <span className="inline-block px-3 py-1.5 rounded-xl bg-indigo-600 text-[9px] font-black text-white uppercase tracking-widest shadow-xl">
                                    Mission Proof {idx + 1}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-24 rounded-[3rem] border-4 border-dashed border-gray-100 dark:border-white/5 text-gray-300 dark:text-white/10 gap-4">
                          <Camera size={64} className="opacity-10" />
                          <p className="text-xs font-black uppercase tracking-[0.3em]">No Visual Evidence Recorded</p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'Mission' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
                       <div className="bg-indigo-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-indigo-600/20 flex items-center justify-between overflow-hidden relative group">
                          <div className="relative z-10">
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-100/60 mb-2">Authenticated Logic</p>
                            <h3 className="text-xl font-black tracking-tight">{selectedVisit.taskTitle || "General Field Activity"}</h3>
                            <p className="text-xs font-bold text-indigo-100 mt-1 opacity-80">{selectedVisit.taskType || "Standard"} Mission Template</p>
                          </div>
                          <Target size={120} className="absolute -right-8 -bottom-8 opacity-10 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-700" />
                       </div>

                       {(selectedVisit.reviewStatus === 'rejected' || selectedVisit.status === 'Rejected') && (
                        <div className="bg-rose-50/80 dark:bg-rose-500/10 p-6 rounded-[2.5rem] border border-rose-100 dark:border-rose-500/20 animate-bounce-short">
                          <div className="flex items-center gap-3 mb-4 text-rose-600">
                            <AlertCircle size={20} />
                            <h4 className="text-[11px] font-black uppercase tracking-[0.2em]">Audit Denial Logic</h4>
                          </div>
                          <blockquote className="text-sm font-black text-rose-800 dark:text-rose-300 italic border-l-4 border-rose-300 dark:border-rose-500/40 pl-6 py-1">
                            "{selectedVisit.rejectionReason || selectedVisit.rejectionIntelligence || "No specific denial intelligence synchronized."}"
                          </blockquote>
                        </div>
                      )}

                      {selectedVisit.checklist && selectedVisit.checklist.length > 0 && (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                             <h4 className="text-[11px] font-black uppercase tracking-[0.25em] text-gray-400">Milestone Synchronization</h4>
                             <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-100 active:scale-95 transition-all">
                                {selectedVisit.checklist.filter(c => c.completed).length} / {selectedVisit.checklist.length} Passed
                             </span>
                          </div>
                          <div className="grid grid-cols-1 gap-3">
                            {selectedVisit.checklist.map((item, idx) => (
                              <div key={idx} className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 group hover:border-emerald-200 transition-all">
                                <div className="flex items-center gap-4">
                                   <div className={`w-8 h-8 rounded-xl flex items-center justify-center
                                     ${item.completed ? 'bg-emerald-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
                                      <CheckCircle2 size={16} />
                                   </div>
                                   <span className={`text-[11px] font-black uppercase tracking-widest ${item.completed ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
                                      {item.label}
                                   </span>
                                </div>
                                {item.completed && <Check size={14} className="text-emerald-500" />}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="p-8 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between shrink-0 bg-white dark:bg-gray-900">
                 <div className="flex flex-col">
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Audit Engine Signature</span>
                    <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Protocol Version 4.2.alpha</span>
                 </div>
                 <button 
                  onClick={() => setSelectedVisit(null)}
                  className="px-8 py-4 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-3xl hover:bg-indigo-700 shadow-xl shadow-indigo-600/20 active:scale-95 transition-all"
                 >
                    Close Protocol
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeVisits;
