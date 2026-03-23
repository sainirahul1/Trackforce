import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Clock, CheckCircle2, ChevronRight, Calendar, AlertCircle, Phone, Image as ImageIcon, Camera, Map, X, Users, Store, FileText, MessageSquare } from 'lucide-react';
import Button from '../../components/Button';

import { getVisits } from '../../services/visitService';

const EmployeeVisits = () => {
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterDate, setFilterDate] = useState('');
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const dateInputRef = React.useRef(null);

  useEffect(() => {
    const fetchVisits = async () => {
      try {
        const data = await getVisits();
        setVisits(data.map(v => {
          const visitDate = new Date(v.timestamp || v.createdAt);
          const isValidDate = !isNaN(visitDate.getTime());
          
          let statusLabel = v.status ? v.status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Unknown';
          if (v.status === 'not_interested') statusLabel = 'Rejected';
          
          return {
            ...v,
            store: v.storeName,
            time: isValidDate ? visitDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '---',
            date: isValidDate ? visitDate.toISOString().split('T')[0] : '---',
            address: v.address || 'Location data not available',
            distance: v.distance || '---', 
            eta: v.eta || '---',
            status: statusLabel,
            companyDescription: 'Organization Partner',
            feedback: v.notes || 'No specific feedback recorded.',
            uploadedImages: v.photos || []
          };
        }));
      } catch (err) {
        console.error('Error fetching visits:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchVisits();
  }, []);

  const statuses = ['All', 'Completed', 'In Progress', 'Rejected', 'Follow Up'];

  const filteredVisits = visits.filter(v => {
    const matchStatus = filterStatus === 'All' || v.status === filterStatus;
    const matchDate = !filterDate || v.date === filterDate;
    return matchStatus && matchDate;
  });

  const getStatusStyles = (status) => {
    switch (status) {
      case 'Completed':
        return {
          icon: 'bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400',
          badge: 'text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-500/20',
          border: 'border-green-200 dark:border-green-500/30'
        };
      case 'In Progress':
        return {
          icon: 'bg-blue-100/50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 animate-pulse',
          badge: 'text-blue-700 bg-blue-100/50 dark:text-blue-400 dark:bg-blue-500/10',
          border: 'border-blue-200 dark:border-blue-500/30'
        };
      case 'Rejected':
        return {
          icon: 'bg-red-100/50 text-red-600 dark:bg-red-500/10 dark:text-red-400',
          badge: 'text-red-700 bg-red-100/50 dark:text-red-400 dark:bg-red-500/10',
          border: 'border-red-100 dark:border-red-500/20'
        };
      case 'Follow Up':
        return {
          icon: 'bg-amber-100/50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400',
          badge: 'text-amber-700 bg-amber-100/50 dark:text-amber-400 dark:bg-amber-500/10',
          border: 'border-amber-100 dark:border-amber-500/20'
        };
      default:
        return {
          icon: 'bg-gray-100/50 text-gray-500 dark:bg-gray-800 dark:text-gray-400',
          badge: 'text-gray-600 bg-gray-100/50 dark:text-gray-400 dark:bg-gray-800',
          border: 'border-gray-100 dark:border-gray-800'
        };
    }
  };

  const statusCounts = {
    'Completed': visits.filter(v => v.status === 'Completed').length,
    'In Progress': visits.filter(v => v.status === 'In Progress').length,
    'Rejected': visits.filter(v => v.status === 'Rejected').length,
    'Follow Up': visits.filter(v => v.status === 'Follow Up').length,
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 h-full">
      <div className="space-y-6 sm:space-y-8 animate-in duration-500">
      {/* Page Heading */}
      <div className="px-2 mb-5">
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">Store Visits</h1>
      </div>

      {/* Filters & Results Count Section */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 bg-white dark:bg-gray-900 p-4 sm:p-5 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm mb-6 sm:mb-8">
        <div className="flex items-center gap-3 overflow-x-auto custom-scrollbar pb-2 sm:pb-0 w-full xl:w-auto pr-2 sm:pr-0">
          {statuses.map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-300 ${filterStatus === status
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-none'
                  : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
            >
              {status}
            </button>
          ))}

          <div className="flex items-center shrink-0 ml-2 gap-2">
            {filterDate && (
              <div className="flex items-center gap-1.5 text-indigo-700 dark:text-indigo-400 px-3 py-2 rounded-xl text-xs font-bold bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/30 shadow-sm animate-in fade-in">
                {filterDate.split('-').reverse().join('/')}
                <button onClick={() => setFilterDate('')} className="hover:bg-indigo-100 dark:hover:bg-indigo-500/30 rounded-md transition-colors p-0.5 ml-1">
                  <X size={14} />
                </button>
              </div>
            )}
            <button
              onClick={() => dateInputRef.current?.showPicker()}
              className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors shadow-sm border border-gray-200 dark:border-gray-700 shrink-0"
            >
              <Calendar size={18} />
              <input
                ref={dateInputRef}
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="absolute w-[1px] h-[1px] opacity-0 -z-10 pointer-events-none"
                title="Select Date"
              />
            </button>
          </div>
        </div>

        {/* Results Count (Right side) */}
        <div className="flex items-center gap-3 bg-indigo-50 dark:bg-indigo-500/10 px-4 py-2.5 rounded-xl border border-indigo-100 dark:border-indigo-500/20 shadow-sm shrink-0 ml-auto xl:ml-0">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500"></span>
          </span>
          <span className="text-xs font-black text-indigo-700 dark:text-indigo-400 uppercase tracking-widest">{filteredVisits.length} Locations</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Visits List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="space-y-4">
            {filteredVisits.length > 0 ? filteredVisits.map((visit, idx) => {
              const styles = getStatusStyles(visit.status);
              return (
                <div
                  key={visit._id || idx}
                  onClick={() => setSelectedVisit(visit)}
                  className={`bg-white dark:bg-gray-900 p-4 sm:p-5 rounded-[2rem] border ${styles.border} shadow-sm hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-500/30 transition-all duration-300 group relative overflow-hidden cursor-pointer`}
                >
                  <div className="flex flex-col gap-3">
                    {/* Top Row: Store Info & Status */}
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 dark:text-white text-base sm:text-lg truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {idx + 1}. {visit.store}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5 mt-1">
                          <MapPin size={12} className="shrink-0 text-gray-400" />
                          <span className="truncate">{visit.address}</span>
                        </p>
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg shrink-0 ${styles.badge} ${styles.border} border`}>
                        {visit.status}
                      </span>
                    </div>

                    {/* Bottom Row: Details & Actions */}
                    <div className="flex flex-wrap items-end justify-between gap-3 mt-1">
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1.5 text-[11px] font-bold text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 px-2 py-1.5 rounded-lg">
                          <Clock size={12} className="text-indigo-500" />
                          {visit.time}
                        </span>
                        <span className="flex items-center gap-1.5 text-[11px] font-bold text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 px-2 py-1.5 rounded-lg">
                          <Map size={12} className="text-emerald-500" />
                          {visit.distance}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button onClick={(e) => { e.stopPropagation(); window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(visit.address)}`, '_blank'); }} className="flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-colors">
                          <Navigation size={12} /> Directions
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); /* phone logic */ }} className="flex items-center gap-1.5 bg-green-50 hover:bg-green-100 text-green-700 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-colors">
                          <Phone size={12} /> Call Store
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }) : (
              <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm">
                <div className="p-4 bg-gray-50 dark:bg-gray-800/80 rounded-full w-max mx-auto mb-4">
                  <Calendar size={24} className="text-gray-400" />
                </div>
                <p className="text-gray-500 font-bold mb-1">No visits found</p>
                <p className="text-sm text-gray-400">Try adjusting your date or status filters.</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6 sm:space-y-8 mt-4 lg:mt-0">
          <div className="bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden">
            <h3 className="font-black text-gray-900 dark:text-white mb-6 text-xl flex items-center gap-2.5">
              <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl">
                <MapPin className="text-indigo-500" size={20} />
              </div>
              Today's Summary
            </h3>

            <div className="space-y-3">
              <div className="flex gap-4 p-3 sm:p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 transition-colors duration-300 group border border-transparent hover:border-emerald-100 dark:hover:border-emerald-500/20">
                <div className="flex w-full justify-between items-center">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                    <span className="text-sm text-gray-600 dark:text-gray-300 font-bold">Completed</span>
                  </div>
                  <span className="font-black text-emerald-600 dark:text-emerald-400 text-base">{statusCounts['Completed']}</span>
                </div>
              </div>

              <div className="flex gap-4 p-3 sm:p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 transition-colors duration-300 group border border-transparent hover:border-blue-100 dark:hover:border-blue-500/20">
                <div className="flex w-full justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Navigation size={16} className="text-blue-500 shrink-0" />
                    <span className="text-sm text-gray-600 dark:text-gray-300 font-bold">In Progress</span>
                  </div>
                  <span className="font-black text-blue-600 dark:text-blue-400 text-base">{statusCounts['In Progress']}</span>
                </div>
              </div>

              <div className="flex gap-4 p-3 sm:p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 transition-colors duration-300 group border border-transparent hover:border-red-100 dark:hover:border-red-500/20">
                <div className="flex w-full justify-between items-center">
                  <div className="flex items-center gap-3">
                    <X size={16} className="text-red-500 shrink-0" />
                    <span className="text-sm text-gray-600 dark:text-gray-300 font-bold">Not Visit</span>
                  </div>
                  <span className="font-black text-red-600 dark:text-red-400 text-base">{statusCounts['Not Visit']}</span>
                </div>
              </div>

              <div className="flex gap-4 p-3 sm:p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 transition-colors duration-300 group border border-transparent hover:border-amber-100 dark:hover:border-amber-500/20">
                <div className="flex w-full justify-between items-center">
                  <div className="flex items-center gap-3">
                    <AlertCircle size={16} className="text-amber-500 shrink-0" />
                    <span className="text-sm text-gray-600 dark:text-gray-300 font-bold">Follow Up</span>
                  </div>
                  <span className="font-black text-amber-600 dark:text-amber-400 text-base">{statusCounts['Follow Up']}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      </div>

      {/* Floating Modal for Visit Details */}
      {selectedVisit && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setSelectedVisit(null)}></div>

          <div className="relative w-full max-w-4xl bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-300">
            {/* Ultra-Clean Professional Header (Compact & Reordered) */}
            <div className="relative bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 shrink-0 px-5 py-5 sm:px-6 sm:py-6">
              <button
                onClick={() => setSelectedVisit(null)}
                className="absolute top-4 sm:top-5 right-4 sm:right-5 z-20 p-2 rounded-full bg-gray-50/80 dark:bg-gray-800/80 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-all shadow-sm backdrop-blur-sm"
              >
                <X size={16} />
              </button>

              <div className="flex flex-col gap-4">
                
                {/* 1. Header Section: Title & Address */}
                <div className="flex flex-col gap-1 pr-10">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
                      {selectedVisit.store}
                    </h2>
                    {/* Status Badge Beside Title */}
                    <div className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 uppercase tracking-wider shrink-0 ${selectedVisit.status === 'Completed' ? 'text-emerald-700 bg-emerald-50 border border-emerald-100 dark:text-emerald-400 dark:bg-emerald-500/10 dark:border-emerald-500/20' : 'text-gray-700 bg-gray-50 border border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300'}`}>
                      {selectedVisit.status === 'Completed' && <CheckCircle2 size={10} className="text-emerald-600 dark:text-emerald-400" />}
                      {selectedVisit.status}
                    </div>
                  </div>
                  <p className="flex items-start gap-1.5 text-gray-500 dark:text-gray-400 text-sm font-medium">
                    <MapPin size={16} className="text-gray-400 shrink-0 mt-0.5" />
                    {selectedVisit.address}
                  </p>
                </div>

                {/* 2. Core Details & Actions Block */}
                <div className="flex flex-col gap-3">
                  
                  {/* Time, Distance, and Actions Row */}
                  <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-y-3 w-full">
                    {/* Left side: Time & Distance */}
                    <div className="flex items-center gap-x-3 shrink-0">
                      {/* Time */}
                      <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
                        <Clock size={12} className="text-gray-400" />
                        <span className="font-semibold text-[13px]">{selectedVisit.time}</span>
                      </div>

                      <div className="w-px h-3 bg-gray-200 dark:bg-gray-700"></div>

                      {/* Distance */}
                      <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
                        <Map size={12} className="text-gray-400" />
                        <span className="font-semibold text-[13px]">{selectedVisit.distance}</span>
                      </div>
                    </div>

                    {/* Right side: Actions (Far Right) */}
                    <div className="flex flex-row gap-2 shrink-0">
                      <button onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(selectedVisit.address)}`, '_blank')} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded px-3 py-1.5 flex items-center justify-center gap-1.5 transition-colors font-semibold text-[11px] shadow-sm shrink-0">
                        <Navigation size={12} className="shrink-0" />
                        <span>Directions</span>
                      </button>
                      <button className="bg-white hover:bg-gray-50 text-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-100 border border-gray-200 dark:border-gray-700 rounded px-3 py-1.5 flex items-center justify-center gap-1.5 transition-colors font-semibold text-[11px] shadow-sm shrink-0">
                        <Phone size={12} className="shrink-0 text-gray-500" />
                        <span>Call Store</span>
                      </button>
                    </div>
                  </div>

                </div>

              </div>
            </div>

            <div className="p-5 sm:p-8 overflow-y-auto custom-scrollbar flex-1 flex flex-col gap-6">

              {/* Company Description & Link */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <Store size={14} className="text-violet-500" />
                    Company Description
                  </h4>
                  {selectedVisit.companyLink && (
                    <a href={selectedVisit.companyLink} target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold text-indigo-500 hover:text-indigo-600 flex items-center gap-1 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-1 rounded-md transition-colors">
                      Visit Website <ChevronRight size={12} />
                    </a>
                  )}
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                  {selectedVisit.companyDescription}
                </p>
              </div>

              {/* Feedback and Notes */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
                  <MessageSquare size={14} className="text-blue-500" />
                  Task Feedback / Notes
                </h4>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed italic border-l-2 border-blue-300 dark:border-blue-500/50 pl-4 font-medium">
                  "{selectedVisit.feedback}"
                </p>
              </div>

              {/* Uploaded Images */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-2">
                  <ImageIcon size={14} className="text-emerald-500" />
                  Uploaded Images
                </h4>
                {selectedVisit.uploadedImages && selectedVisit.uploadedImages.length > 0 ? (
                  <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
                    {selectedVisit.uploadedImages.map((img, idx) => (
                      <div key={idx} className="shrink-0 relative group">
                        <img src={img} alt={`Proof ${idx + 1}`} className="w-28 h-28 object-cover rounded-2xl border-2 border-gray-50 dark:border-gray-800 shadow-md transition-transform duration-300 group-hover:scale-[1.02]" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm font-bold text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800/50 border border-dashed border-gray-200 dark:border-gray-700 rounded-2xl p-6 text-center">
                    No images uploaded yet.
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeVisits;
