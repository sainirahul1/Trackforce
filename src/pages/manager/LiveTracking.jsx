import React, { useState, useMemo } from 'react';
import { MapPin, Users, Activity, Navigation, Search, Filter, Shield, Info, Battery, Zap, Clock, X, ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * LiveTracking Component
 * Provides a professional, real-time monitoring interface for field personnel.
 */
const LiveTracking = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [showInsights, setShowInsights] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const activeEmployees = useMemo(() => [
    { id: 1, name: 'John Doe', status: 'On Duty', lastSeen: 'Just now', battery: '85%', speed: '12 km/h', location: 'Sector 4, North Zone', x: 35, y: 35 },
    { id: 2, name: 'Jane Smith', status: 'On Duty', lastSeen: '2 mins ago', battery: '42%', speed: '0 km/h', location: 'Downtown Mall', x: 60, y: 45 },
    { id: 3, name: 'Mike Johnson', status: 'Away', lastSeen: '15 mins ago', battery: '12%', speed: '-', location: 'Warehouse B', x: 25, y: 70 },
    { id: 4, name: 'Sarah Wilson', status: 'On Duty', lastSeen: 'Just now', battery: '98%', speed: '45 km/h', location: 'Highway 12', x: 75, y: 65 },
    { id: 5, name: 'Aryan Raj', status: 'On Duty', lastSeen: 'Syncing', battery: '76%', speed: '22 km/h', location: 'Electronic City', x: 45, y: 80 },
    { id: 6, name: 'Priya Verma', status: 'On Duty', lastSeen: '1 min ago', battery: '55%', speed: '5 km/h', location: 'Koramangala 5th Block', x: 50, y: 25 },
    { id: 7, name: 'Vikram Singh', status: 'On Duty', lastSeen: 'Just now', battery: '92%', speed: '30 km/h', location: 'Whitefield', x: 80, y: 30 },
    { id: 8, name: 'Ananya Rao', status: 'Away', lastSeen: '45 mins ago', battery: '5%', speed: '-', location: 'Hebbal Flyover', x: 15, y: 15 },
    { id: 9, name: 'Rohan Gupta', status: 'On Duty', lastSeen: '3 mins ago', battery: '60%', speed: '15 km/h', location: 'Indiranagar 100ft Rd', x: 65, y: 20 },
    { id: 10, name: 'Sneha Kapur', status: 'On Duty', lastSeen: 'Just now', battery: '88%', speed: '10 km/h', location: 'MG Road Metro', x: 40, y: 55 },
  ], []);

  const filteredEmployees = activeEmployees.filter(emp => 
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination Logic
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const selectedEmployee = activeEmployees.find(e => e.id === selectedId);

  return (
    <div className="space-y-6 animate-in fade-in duration-700 h-full flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Live Fleet Tracking</h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">Real-time geospatial monitoring of all active field executives</p>
        </div>
        <div className="flex items-center space-x-3">
           <div className="flex -space-x-2">
             {[1,2,3].map(i => (
               <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-950 bg-gray-200 dark:bg-gray-800" />
             ))}
             <div className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-950 bg-indigo-600 flex items-center justify-center text-[10px] font-bold text-white">
               +{activeEmployees.length > 3 ? activeEmployees.length - 3 : 0}
             </div>
           </div>
           <span className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-2">{activeEmployees.length} Active Now</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
        {/* Sidebar: Legend & List */}
        <div className="lg:col-span-1 flex flex-col space-y-4 h-full min-h-0">
          <div className="bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 p-6 shadow-sm flex-1 flex flex-col min-h-0 overflow-hidden">
            <div className="flex items-center justify-between mb-6 shrink-0">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-indigo-600" size={16} />
                <input 
                  type="text" 
                  placeholder="Search fleet..." 
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl text-[10px] font-bold outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-inner"
                />
              </div>
              <div className="ml-3">
                <select 
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-[10px] font-black uppercase tracking-widest px-2 py-3 outline-none focus:ring-2 focus:ring-indigo-500/20 text-indigo-600 cursor-pointer"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                </select>
              </div>
            </div>

            <div className="space-y-3 overflow-y-auto flex-1 pr-1 custom-scrollbar">
              {paginatedEmployees.length > 0 ? (
                paginatedEmployees.map((emp) => (
                  <div 
                    key={emp.id} 
                    onClick={() => setSelectedId(emp.id === selectedId ? null : emp.id)}
                    className={`group p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                      selectedId === emp.id 
                      ? 'border-indigo-500 bg-indigo-50/30 dark:bg-indigo-900/10 shadow-lg shadow-indigo-500/5 translate-x-1' 
                      : 'border-gray-50 dark:border-gray-800 hover:border-indigo-500/30 hover:bg-gray-50/50 dark:hover:bg-gray-800/30'
                    }`}
                  >
                    <div className="flex items-start justify-between relative z-10">
                      <div>
                        <h4 className={`font-black text-sm transition-colors ${selectedId === emp.id ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-900 dark:text-white'}`}>{emp.name}</h4>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5 flex items-center gap-1">
                          <MapPin size={10} className="shrink-0" />
                          <span className="truncate">{emp.location}</span>
                        </p>
                      </div>
                      <div className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${emp.status === 'On Duty' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-gray-400'}`} />
                    </div>
                    
                    <div className="mt-3 flex items-center justify-between text-[10px] font-black text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <Navigation size={10} className="text-indigo-500" />
                        <span>{emp.speed !== '-' ? emp.speed : 'Idle'}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Activity size={10} className="text-indigo-400" />
                        <span>{emp.lastSeen}</span>
                      </div>
                    </div>

                    <div className="absolute bottom-0 left-0 h-1 bg-gray-100 dark:bg-gray-800 w-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-1000 ${
                          parseInt(emp.battery) < 20 ? 'bg-rose-500' : 'bg-emerald-500'
                        }`} 
                        style={{ width: emp.battery }} 
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center p-10 text-center space-y-3">
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl text-gray-400">
                    <Search size={32} />
                  </div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-relaxed">No matching fleet found</p>
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-50 dark:border-gray-800 shrink-0">
                <button 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-400 hover:text-indigo-600 disabled:opacity-30 transition-all active:scale-90"
                >
                  <ChevronLeft size={16} />
                </button>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Page</span>
                  <span className="text-xs font-black text-gray-900 dark:text-white px-2 py-1 bg-gray-50 dark:bg-gray-800 rounded-lg">{currentPage}</span>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">of {totalPages}</span>
                </div>
                <button 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-400 hover:text-indigo-600 disabled:opacity-30 transition-all active:scale-90"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>

          <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-[2rem] p-6 text-white shadow-xl shadow-indigo-600/20 shrink-0">
            <h5 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-4">Command Center</h5>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold">Signal Health</span>
                <span className="text-xs font-black">98.4%</span>
              </div>
              <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white w-[98.4%] animate-shimmer" />
              </div>
              <div className="flex items-center justify-between pt-2">
                <div className="flex flex-col gap-0.5">
                  <p className="text-[8px] opacity-60 font-black uppercase tracking-widest">Active Links</p>
                  <p className="text-sm font-black tracking-tight">{filteredEmployees.length} Devices</p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <Shield size={16} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main: Dynamic Map View */}
        <div className="lg:col-span-3 bg-slate-50 dark:bg-gray-950 rounded-[3rem] border-4 border-white dark:border-gray-900 shadow-2xl relative overflow-hidden group">
          {/* Grid Background */}
          <div className="absolute inset-0 opacity-[0.2]" style={{ 
            backgroundImage: 'radial-gradient(#6366f1 1.5px, transparent 1.5px), radial-gradient(#6366f1 1.5px, #f8fafc 1.5px)',
            backgroundSize: '40px 40px',
            backgroundPosition: '0 0, 20px 20px'
          }} />

          {/* User Markers - Showing all filtered employees to maintain contextual awareness on map */}
          {filteredEmployees.map((emp) => (
            <div 
              key={emp.id} 
              className={`absolute transition-all duration-700 cursor-pointer ${
                selectedId === emp.id ? 'z-50 scale-125' : 'z-10 hover:z-20'
              }`} 
              style={{ left: `${emp.x}%`, top: `${emp.y}%`, transitionDelay: `${emp.id * 50}ms` }}
              onClick={() => setSelectedId(emp.id)}
            >
              <div className="relative group/marker">
                {(selectedId === emp.id || emp.status === 'On Duty') && (
                  <div className={`absolute inset-0 scale-[2.5] rounded-full opacity-20 animate-ping ${
                    selectedId === emp.id ? 'bg-indigo-600' : 'bg-emerald-500'
                  }`} />
                )}

                <div className={`w-10 h-10 bg-white dark:bg-gray-900 rounded-2xl shadow-xl flex items-center justify-center border-2 transition-all duration-300 ${
                  selectedId === emp.id 
                  ? 'border-indigo-600 rotate-0 translate-y-[-4px] shadow-indigo-600/20' 
                  : 'border-white dark:border-gray-800 rotate-6 hover:rotate-0'
                }`}>
                  <Users size={20} className={selectedId === emp.id ? 'text-indigo-600' : 'text-gray-400'} />
                  <div className={`absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-black text-white border-2 border-white dark:border-gray-900 ${
                    emp.status === 'On Duty' ? 'bg-emerald-500' : 'bg-gray-400'
                  }`}>
                    {emp.name.charAt(0)}
                  </div>
                </div>

                <div className={`absolute left-1/2 -translate-x-1/2 transition-all duration-300 pointer-events-none p-4 bg-white dark:bg-gray-900 rounded-[1.5rem] shadow-2xl border border-gray-100 dark:border-gray-800 min-w-[180px] z-[100] ${
                  emp.y < 35 ? 'top-full mt-4' : 'bottom-full mb-4'
                } ${
                  selectedId === emp.id ? 'opacity-100 translate-y-0 visible shadow-indigo-500/10' : 'opacity-0 translate-y-2 invisible group-hover/marker:opacity-100 group-hover/marker:translate-y-0 group-hover/marker:visible'
                }`}>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${
                      emp.status === 'On Duty' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-50 text-gray-500'
                    }`}>
                      {emp.status}
                    </span>
                    <Battery size={14} className={parseInt(emp.battery) < 20 ? 'text-rose-500' : 'text-emerald-500'} />
                  </div>
                  <h4 className="text-xs font-black text-gray-900 dark:text-white leading-tight">{emp.name}</h4>
                  <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-tighter">{emp.location}</p>
                  
                  <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-gray-50 dark:border-gray-800">
                    <div>
                      <p className="text-[7px] font-black text-gray-400 uppercase tracking-widest">Speed</p>
                      <p className="text-[10px] font-black text-gray-900 dark:text-white">{emp.speed}</p>
                    </div>
                    <div>
                      <p className="text-[7px] font-black text-gray-400 uppercase tracking-widest">Last Seen</p>
                      <p className="text-[10px] font-black text-gray-900 dark:text-white">{emp.lastSeen}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Map Controls */}
          <div className="absolute bottom-10 right-10 flex flex-col gap-3 z-30">
             <button 
               onClick={() => setSelectedId(null)}
               className="p-4 bg-white dark:bg-gray-900 rounded-2xl shadow-xl text-gray-400 hover:text-indigo-600 transition-all active:scale-90 group"
               title="Reset Focus"
             >
               <Activity size={20} className="group-hover:animate-pulse" />
             </button>
             <button className="p-4 bg-white dark:bg-gray-900 rounded-2xl shadow-xl text-gray-400 hover:text-indigo-600 transition-all active:scale-90">
               <Navigation size={20} />
             </button>
          </div>

          {/* Floating Global Insights - Collapsible */}
          <div className={`absolute top-10 left-10 transition-all duration-500 z-30 ${
            showInsights 
            ? 'p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-[2rem] border border-white/50 dark:border-gray-800 shadow-2xl max-w-[280px]' 
            : 'p-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl w-12 h-12 flex items-center justify-center cursor-pointer hover:scale-110 active:scale-95'
          }`}
          onClick={() => !showInsights && setShowInsights(true)}
          >
             {showInsights ? (
               <>
                 <div className="flex items-center justify-between gap-4 mb-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
                        <Activity size={24} />
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-gray-900 dark:text-white tracking-tighter leading-none">Global Insights</h3>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-1.5">Live Zone Status</p>
                      </div>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowInsights(false);
                      }}
                      className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 transition-colors"
                    >
                      <X size={16} />
                    </button>
                 </div>
                 <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-500">
                    <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100/50 dark:border-gray-800/50">
                       <div className="flex justify-between items-center mb-1">
                          <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Coverage</span>
                          <span className="text-xs font-black text-indigo-600">85% Area</span>
                       </div>
                       <div className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-500 w-[85%]" />
                       </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 pb-2">
                       <div className="flex flex-col gap-1">
                          <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">In Transit</p>
                          <p className="text-sm font-black text-gray-900 dark:text-white">
                            {filteredEmployees.filter(e => e.speed !== '-' && e.speed !== '0 km/h').length}
                          </p>
                       </div>
                       <div className="flex flex-col gap-1 text-right">
                          <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Stationary</p>
                          <p className="text-sm font-black text-gray-900 dark:text-white">
                            {filteredEmployees.filter(e => e.speed === '-' || e.speed === '0 km/h').length}
                          </p>
                       </div>
                    </div>
                 </div>
               </>
             ) : (
               <Activity size={20} className="text-indigo-600" />
             )}
          </div>

          {/* Footer Legend */}
          <div className="absolute bottom-0 left-0 right-0 p-10 bg-gradient-to-t from-gray-900/60 via-gray-900/20 to-transparent pointer-events-none z-20">
             <div className="flex gap-8 items-center justify-center">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                  <span className="text-[9px] font-black text-white uppercase tracking-[0.2em]">Live Tracking</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                  <span className="text-[9px] font-black text-white uppercase tracking-[0.2em]">On Duty</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-400" />
                  <span className="text-[9px] font-black text-white uppercase tracking-[0.2em]">Away / Idle</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveTracking;
