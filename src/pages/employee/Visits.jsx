import React, { useState } from 'react';
import { MapPin, Navigation, Clock, CheckCircle2, ChevronRight, Calendar, AlertCircle, Phone, Image as ImageIcon, Camera, Map, X, Users, Store } from 'lucide-react';
import Button from '../../components/Button';

const EmployeeVisits = () => {
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [isMapOpen, setIsMapOpen] = useState(false);

  const visits = [
    { id: 1, store: 'Reliance Fresh - HSR', address: 'Sector 2, HSR Layout, BLR', time: '10:00 AM', status: 'Completed', distance: '1.2 km' },
    { id: 2, store: 'More Megamart - Koramangala', address: '8th Block, Koramangala, BLR', time: '12:30 PM', status: 'In Progress', distance: '3.5 km' },
    { id: 3, store: 'Big Bazaar - Central', address: 'MG Road, Bengaluru', time: '03:00 PM', status: 'Pending', distance: '5.0 km' },
    { id: 4, store: 'Star Bazar - Indiranagar', address: '100ft Road, Indiranagar, BLR', time: '05:30 PM', status: 'Upcoming', distance: '8.2 km' },
  ];

  const getStatusStyles = (status) => {
    switch (status) {
      case 'Completed':
        return {
          icon: 'bg-emerald-100/50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400',
          badge: 'text-emerald-700 bg-emerald-100/50 dark:text-emerald-400 dark:bg-emerald-500/10',
          border: 'border-emerald-100 dark:border-emerald-500/20'
        };
      case 'In Progress':
        return {
          icon: 'bg-blue-100/50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 animate-pulse',
          badge: 'text-blue-700 bg-blue-100/50 dark:text-blue-400 dark:bg-blue-500/10',
          border: 'border-blue-200 dark:border-blue-500/30'
        };
      case 'Pending':
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

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 h-full">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 dark:bg-indigo-900/20 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
        <div className="relative z-10 w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight">Store Visits</h1>
            <div className="flex items-center gap-2 mt-2 text-gray-500 dark:text-gray-400 font-medium">
              <Calendar size={18} className="text-indigo-500" />
              <p>Your schedule for <span className="text-indigo-600 dark:text-indigo-400 font-bold">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span></p>
            </div>
          </div>
          <Button onClick={() => setIsMapOpen(true)} className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 border-0 text-white rounded-xl shadow-[0_4px_14px_0_rgba(99,102,241,0.39)] hover:shadow-[0_6px_20px_rgba(99,102,241,0.23)] hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center py-3 sm:py-2.5">
            <MapPin size={18} className="mr-2" />
            View On Map
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Visits List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-4 px-2">
            <h2 className="text-xl font-black text-gray-900 dark:text-white">Today's Route</h2>
            <div className="flex items-center gap-2 bg-white dark:bg-gray-900 px-3 py-1.5 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
              <span className="text-sm font-bold text-gray-600 dark:text-gray-300">{visits.length} Locations</span>
            </div>
          </div>

          <div className="space-y-4">
            {visits.map((visit) => {
              const styles = getStatusStyles(visit.status);
              return (
                <div
                  key={visit.id}
                  onClick={() => setSelectedVisit(visit)}
                  className={`bg-white dark:bg-gray-900 p-5 sm:p-6 rounded-[2rem] border ${styles.border} shadow-sm hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-500/30 transition-all duration-300 group relative overflow-hidden cursor-pointer`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                    <div className="flex items-start sm:items-center gap-4 sm:gap-6 flex-1">
                      <div className={`p-4 rounded-2xl shrink-0 ${styles.icon} transition-colors duration-300`}>
                        <Navigation size={24} className={visit.status === 'In Progress' ? 'animate-pulse' : ''} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between sm:justify-start gap-3 mb-1.5">
                          <h3 className="font-bold text-gray-900 dark:text-white text-lg sm:text-xl truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{visit.store}</h3>
                          <span className={`sm:hidden text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg shrink-0 ${styles.badge}`}>
                            {visit.status}
                          </span>
                        </div>

                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate flex items-center gap-1.5 mb-3.5">
                          <MapPin size={14} className="shrink-0 text-gray-400" />
                          {visit.address}
                          <span className="hidden sm:inline mx-2 text-gray-300 dark:text-gray-700">•</span>
                          <span className="hidden sm:inline font-bold text-indigo-500 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded-md">{visit.distance}</span>
                        </p>

                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1.5 text-xs font-bold text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/80 px-3 py-1.5 rounded-lg border border-gray-100 dark:border-gray-700/50">
                            <Clock size={14} className="text-indigo-500 dark:text-indigo-400" />
                            {visit.time}
                          </span>
                          <span className={`hidden sm:inline-block text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border ${styles.border} ${styles.badge}`}>
                            {visit.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button className="hidden sm:flex items-center justify-center p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800 text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/10 transition-all duration-300 shrink-0 border border-transparent group-hover:border-indigo-100 dark:group-hover:border-indigo-500/20">
                      <ChevronRight size={20} />
                    </button>

                    {/* Mobile Action Button */}
                    <button className="sm:hidden w-full py-3 mt-2 rounded-xl bg-gray-50 dark:bg-gray-800 text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border border-gray-100 dark:border-gray-700">
                      View Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6 sm:space-y-8 mt-4 lg:mt-0">
          <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden">
            <h3 className="font-black text-gray-900 dark:text-white mb-6 text-xl flex items-center gap-2.5">
              <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl">
                <MapPin className="text-indigo-500" size={20} />
              </div>
              Today's Summary
            </h3>

            <div className="space-y-4">
              <div className="flex gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 transition-colors duration-300 group border border-transparent">
                <div className="flex w-full justify-between items-center">
                  <div className="flex items-center gap-3">
                    <MapPin size={18} className="text-indigo-500 shrink-0" />
                    <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">Total Scheduled</span>
                  </div>
                  <span className="font-bold text-gray-900 dark:text-white text-lg">8</span>
                </div>
              </div>

              <div className="flex gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 transition-colors duration-300 group border border-transparent">
                <div className="flex w-full justify-between items-center">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                    <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">Completed</span>
                  </div>
                  <span className="font-bold text-gray-900 dark:text-white text-lg">3</span>
                </div>
              </div>

              <div className="pt-4 mt-2 border-t border-gray-100 dark:border-gray-800">
                <div className="flex justify-between items-end mb-3">
                  <p className="text-xs text-gray-400 uppercase font-black tracking-widest">Completion Rate</p>
                  <span className="text-sm font-bold bg-indigo-50 dark:bg-indigo-500/10 px-2.5 py-1 rounded-md text-indigo-600 dark:text-indigo-400">37%</span>
                </div>
                <div className="w-full h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden shadow-inner">
                  <div className="h-full bg-indigo-500 dark:bg-indigo-500 w-[37%] rounded-full relative shadow-sm">
                    <div className="absolute top-0 right-0 bottom-0 w-3 bg-white/30 animate-pulse rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden">
            <h3 className="font-black text-gray-900 dark:text-white mb-6 text-xl flex items-center gap-2.5">
              <div className="p-2 bg-amber-50 dark:bg-amber-500/10 rounded-xl">
                <AlertCircle className="text-amber-500" size={20} />
              </div>
              Zone Guidelines
            </h3>
            <ul className="space-y-4">
              <li className="flex gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-colors duration-300 group border border-transparent hover:border-amber-100 dark:hover:border-amber-500/20">
                <CheckCircle2 size={20} className="text-amber-500 shrink-0 mt-0.5" />
                <span className="text-sm text-gray-600 dark:text-gray-300 font-medium leading-relaxed group-hover:text-amber-900 dark:group-hover:text-amber-100 transition-colors">
                  Always check-in before entering the store premises to ensure location accuracy.
                </span>
              </li>
              <li className="flex gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-colors duration-300 group border border-transparent hover:border-amber-100 dark:hover:border-amber-500/20">
                <CheckCircle2 size={20} className="text-amber-500 shrink-0 mt-0.5" />
                <span className="text-sm text-gray-600 dark:text-gray-300 font-medium leading-relaxed group-hover:text-amber-900 dark:group-hover:text-amber-100 transition-colors">
                  Upload a minimum of 2 photos for each store visit (Exterior & Interior).
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Floating Modal for Visit Details */}
      {selectedVisit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setSelectedVisit(null)}></div>

          <div className="relative w-full max-w-4xl bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-300">
            {/* Header Banner */}
            <div className="relative h-32 sm:h-40 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex items-start justify-between p-6 sm:p-8 overflow-hidden shrink-0 border-b border-blue-800">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none"></div>
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay pointer-events-none"></div>

              <div className="relative z-10 flex flex-col justify-end h-full w-full pr-12">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/40 backdrop-blur-md text-blue-50 text-[10px] font-black uppercase tracking-widest border border-blue-400/30 mb-3 w-max shadow-sm">
                  <Navigation size={12} strokeWidth={3} />
                  Visit Details
                </div>
                <h2 className="text-2xl sm:text-3xl font-black truncate text-white drop-shadow-md">
                  {selectedVisit.store}
                </h2>
              </div>

              <button
                onClick={() => setSelectedVisit(null)}
                className="absolute top-6 right-6 z-20 p-2.5 rounded-full bg-blue-800/80 hover:bg-blue-900 backdrop-blur-md text-white/90 hover:text-white transition-all duration-300 shadow-sm border border-blue-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-4 sm:p-5 overflow-y-auto custom-scrollbar flex-1 flex flex-col pt-5">
              <div className="flex items-center justify-between mb-1.5">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{selectedVisit.store}</h3>
                <span className="text-xs font-black uppercase tracking-widest px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shrink-0">
                  {selectedVisit.status}
                </span>
              </div>
              <p className="flex items-start gap-1.5 text-gray-600 dark:text-gray-400 text-sm font-medium mb-5">
                <MapPin size={16} className="shrink-0 mt-0.5 text-indigo-500" />
                {selectedVisit.address}
              </p>

              <div className="grid grid-cols-3 gap-2.5 flex-1 min-h-[140px] sm:min-h-[160px]">
                {/* Row 1 */}
                <div className="bg-gray-50 dark:bg-gray-800/60 rounded-2xl border border-gray-100 dark:border-gray-800 p-3 flex flex-col justify-center min-h-[70px]">
                  <div className="text-gray-500 dark:text-gray-400 text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-1.5">Scheduled</div>
                  <div className="flex items-center gap-1.5 text-gray-900 dark:text-white font-bold text-sm sm:text-base">
                    <Clock size={16} className="text-indigo-500 shrink-0" />
                    <span className="truncate">{selectedVisit.time}</span>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800/60 rounded-2xl border border-gray-100 dark:border-gray-800 p-3 flex flex-col justify-center min-h-[70px]">
                  <div className="text-gray-500 dark:text-gray-400 text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-1.5">Distance</div>
                  <div className="flex items-center gap-1.5 text-gray-900 dark:text-white font-bold text-sm sm:text-base">
                    <Map size={16} className="text-indigo-500 shrink-0" />
                    <span className="truncate">{selectedVisit.distance}</span>
                  </div>
                </div>

                <div className="border border-dashed border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30 rounded-2xl p-3 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors cursor-pointer group min-h-[70px]">
                  <Camera size={20} className="mb-1.5 sm:mb-2 text-indigo-500 dark:text-indigo-400 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] sm:text-xs font-bold text-center text-gray-700 dark:text-gray-300 uppercase tracking-wide">Take Exterior</span>
                </div>

                {/* Row 2 */}
                <button onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(selectedVisit.address)}`, '_blank')} className="relative overflow-hidden bg-gradient-to-b from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white rounded-2xl p-3 flex flex-col items-center justify-center gap-1.5 transition-all duration-300 shadow-[0_1px_2px_rgba(0,0,0,0.1),0_4px_12px_rgba(79,70,229,0.25)] hover:shadow-[0_1px_3px_rgba(0,0,0,0.1),0_6px_16px_rgba(79,70,229,0.35)] active:scale-[0.98] min-h-[70px] w-full group">
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <Map size={18} className="shrink-0 drop-shadow-sm group-hover:-translate-y-0.5 transition-transform duration-300" />
                  <span className="font-semibold text-[10px] sm:text-xs uppercase tracking-wider text-center text-indigo-50 drop-shadow-sm">Directions</span>
                </button>

                <button className="relative overflow-hidden bg-gradient-to-br from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white rounded-2xl p-3 flex flex-col items-center justify-center gap-1.5 transition-all duration-300 border border-emerald-400/50 shadow-[0_1px_2px_rgba(0,0,0,0.1),0_4px_12px_rgba(16,185,129,0.25)] hover:shadow-[0_1px_3px_rgba(0,0,0,0.1),0_6px_16px_rgba(16,185,129,0.35)] active:scale-[0.98] min-h-[70px] w-full group">
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Phone size={18} className="shrink-0 drop-shadow-sm group-hover:-translate-y-0.5 transition-transform duration-300" />
                  <span className="font-semibold text-[10px] sm:text-xs uppercase tracking-wider text-center text-emerald-50 drop-shadow-sm">Call Store</span>
                </button>

                <div className="bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-2xl p-3 flex flex-col items-center justify-center gap-1.5 transition-all duration-300 border border-gray-200/80 dark:border-gray-700 shadow-[0_1px_2px_rgba(0,0,0,0.05),0_2px_6px_rgba(0,0,0,0.02)] hover:shadow-[0_2px_4px_rgba(0,0,0,0.05),0_4px_12px_rgba(0,0,0,0.05)] hover:border-gray-300 dark:hover:border-gray-600 cursor-pointer active:scale-[0.98] min-h-[70px] w-full group">
                  <ImageIcon size={18} className="shrink-0 text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white group-hover:-translate-y-0.5 transition-all duration-300" />
                  <span className="font-semibold text-[10px] sm:text-xs uppercase tracking-wider text-center group-hover:text-gray-900 dark:group-hover:text-white transition-colors">Add Interior</span>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-5 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shrink-0">
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-3.5 shadow-lg shadow-indigo-200 dark:shadow-none flex items-center justify-center gap-2 font-bold text-base transition-colors">
                <CheckCircle2 size={20} />
                Check In to Store
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Modal for Live Map */}
      {isMapOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setIsMapOpen(false)}></div>

          <div className="relative w-full max-w-5xl h-[85vh] bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-300">
            {/* Header (Blue Theme) */}
            <div className="relative h-24 sm:h-28 bg-gradient-to-r from-blue-600 to-indigo-700 flex items-center justify-between px-6 sm:px-8 shrink-0 overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>

              <div className="relative z-10 flex flex-col">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 text-blue-50 bg-blue-500/40 backdrop-blur-md text-[10px] font-black uppercase tracking-widest rounded-lg mb-1 w-max border border-blue-400/30 shadow-sm">
                  <Navigation size={12} strokeWidth={3} />
                  Live Tracking
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white drop-shadow-sm">
                  Stores & Executives
                </h2>
              </div>

              <button
                onClick={() => setIsMapOpen(false)}
                className="relative z-20 p-2.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white/90 hover:text-white transition-all duration-300 shadow-sm"
              >
                <X size={20} />
              </button>
            </div>

            {/* Map Body Placeholder */}
            <div className="flex-1 relative bg-gray-100 dark:bg-gray-800 overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>
              <iframe
                title="Live Map Routing"
                className="w-full h-full border-0 absolute inset-0 z-10"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15551.989218206141!2d77.62536835000001!3d12.9333909!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1466ecf3918d%3A0xc6cb1c41fb7c268a!2sKoramangala%2C%20Bengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1714567890123!5m2!1sen!2sin"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
              
              {/* Overlay Mock Markers (Optional for visual effect above map, adjust pointer-events to not block interactions) */}
              <div className="absolute inset-0 z-20 pointer-events-none">
                <div className="absolute top-[25%] left-[30%] animate-bounce">
                  <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20 border border-emerald-100 dark:border-emerald-500/30">
                    <Store size={20} className="text-emerald-500" />
                  </div>
                </div>
                <div className="absolute bottom-[35%] right-[25%] animate-bounce" style={{ animationDelay: '0.2s' }}>
                  <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20 border border-emerald-100 dark:border-emerald-500/30">
                    <Store size={20} className="text-emerald-500" />
                  </div>
                </div>
                <div className="absolute top-[40%] left-[60%]">
                  <div className="relative">
                    <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center shadow-xl shadow-amber-500/40 z-10 relative">
                      <Users size={20} className="text-white" />
                    </div>
                    <div className="absolute inset-0 bg-amber-500 rounded-full animate-ping opacity-75"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 sm:p-5 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-6 text-sm font-medium text-gray-600 dark:text-gray-300">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500"></span> Stores
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-amber-500 animate-pulse"></span> Executives
                </div>
              </div>
              <Button onClick={() => setIsMapOpen(false)} className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl px-6 py-2.5 transition-colors font-semibold">
                Close Map
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeVisits;
