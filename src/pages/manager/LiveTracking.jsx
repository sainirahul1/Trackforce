import React from 'react';
import { MapPin, Users, Activity, Navigation, Search, Filter, Shield, Info } from 'lucide-react';

/**
 * LiveTracking Component
 * Provides a professional, real-time monitoring interface for field personnel.
 */
const LiveTracking = () => {
  const activeEmployees = [
    { id: 1, name: 'John Doe', status: 'On Duty', lastSeen: 'Just now', battery: '85%', speed: '12 km/h', location: 'Sector 4, North Zone', lat: 28.6139, lng: 77.2090 },
    { id: 2, name: 'Jane Smith', status: 'On Duty', lastSeen: '2 mins ago', battery: '42%', speed: '0 km/h', location: 'Downtown Mall', lat: 28.5355, lng: 77.3910 },
    { id: 3, name: 'Mike Johnson', status: 'Away', lastSeen: '15 mins ago', battery: '12%', speed: '-', location: 'Warehouse B', lat: 28.4595, lng: 77.0266 },
    { id: 4, name: 'Sarah Wilson', status: 'On Duty', lastSeen: 'Just now', battery: '98%', speed: '45 km/h', location: 'Highway 12', lat: 28.7041, lng: 77.1025 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
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
               +8
             </div>
           </div>
           <span className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-2">Active Now</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[700px]">
        {/* Sidebar: Legend & List */}
        <div className="lg:col-span-1 flex flex-col space-y-4 h-full">
          <div className="bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 p-6 shadow-sm flex-1 overflow-y-auto">
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="Search fleet..." 
                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div className="space-y-4">
              {activeEmployees.map((emp) => (
                <div key={emp.id} className="group p-4 rounded-2xl border border-gray-50 dark:border-gray-800 hover:border-indigo-500/30 hover:bg-indigo-50/10 transition-all cursor-pointer relative overflow-hidden">
                  <div className="flex items-start justify-between relative z-10">
                    <div>
                      <h4 className="font-black text-gray-900 dark:text-white text-sm">{emp.name}</h4>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{emp.location}</p>
                    </div>
                    <div className={`w-2 h-2 rounded-full mt-1.5 ${emp.status === 'On Duty' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-gray-400'}`} />
                  </div>
                  
                  <div className="mt-3 flex items-center justify-between text-[10px] font-black text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <Navigation size={10} className="text-indigo-500" />
                      <span>{emp.speed}</span>
                    </div>
                    <span>{emp.lastSeen}</span>
                  </div>

                  {/* Battery mini indicator */}
                  <div className="absolute bottom-0 left-0 h-0.5 bg-indigo-500/20 w-full">
                    <div className="h-full bg-indigo-500" style={{ width: emp.battery }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-indigo-600 rounded-[2rem] p-6 text-white shadow-lg shadow-indigo-600/20">
            <h5 className="text-xs font-black uppercase tracking-[0.2em] opacity-60 mb-4">Command Center</h5>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold">Signal Health</span>
                <span className="text-sm font-black">98%</span>
              </div>
              <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white w-[98%]" />
              </div>
              <p className="text-[10px] opacity-70 leading-relaxed uppercase tracking-wider font-bold">
                Last encrypted sync successful at 09:42:23
              </p>
            </div>
          </div>
        </div>

        {/* Main: Mock Interactive Map */}
        <div className="lg:col-span-3 bg-slate-100 dark:bg-gray-950 rounded-[3rem] border-4 border-white dark:border-gray-900 shadow-2xl relative overflow-hidden group">
          {/* Grid Background Mock */}
          <div className="absolute inset-0 opacity-[0.2]" style={{ 
            backgroundImage: 'radial-gradient(#6366f1 1.5px, transparent 1.5px), radial-gradient(#6366f1 1.5px, #f8fafc 1.5px)',
            backgroundSize: '40px 40px',
            backgroundPosition: '0 0, 20px 20px'
          }} />

          {/* User Markers (Mock) */}
          <div className="absolute top-1/4 left-1/3 group/marker">
            <div className="relative">
              <div className="w-10 h-10 bg-white dark:bg-gray-900 rounded-2xl shadow-xl flex items-center justify-center border-2 border-indigo-500 animate-bounce cursor-pointer">
                <Users size={20} className="text-indigo-600" />
              </div>
              <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-black px-3 py-1.5 rounded-xl whitespace-nowrap opacity-0 group-hover/marker:opacity-100 transition-opacity">
                JOHN DOE (MOVING)
              </div>
              <div className="absolute inset-0 w-10 h-10 rounded-2xl animate-ping border-2 border-indigo-500 opacity-20" />
            </div>
          </div>

          <div className="absolute top-2/3 right-1/4 group/marker">
            <div className="relative">
              <div className="w-10 h-10 bg-white dark:bg-gray-900 rounded-2xl shadow-xl flex items-center justify-center border-2 border-emerald-500 cursor-pointer hover:scale-110 transition-transform">
                <Users size={20} className="text-emerald-600" />
              </div>
              <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-black px-3 py-1.5 rounded-xl whitespace-nowrap opacity-0 group-hover/marker:opacity-100 transition-opacity">
                SARAH WILSON (STALE)
              </div>
            </div>
          </div>

          {/* Map Controls Overlay */}
          <div className="absolute bottom-10 right-10 flex flex-col gap-3">
             <button className="p-4 bg-white dark:bg-gray-900 rounded-2xl shadow-xl text-gray-600 dark:text-gray-400 hover:text-indigo-600 transition-all active:scale-90">
               <Navigation size={20} />
             </button>
             <button className="p-4 bg-white dark:bg-gray-900 rounded-2xl shadow-xl text-gray-600 dark:text-gray-400 hover:text-indigo-600 transition-all active:scale-90">
               <Shield size={20} />
             </button>
          </div>

          {/* Map Details Overlay */}
          <div className="absolute top-10 left-10 p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-[2rem] border border-white/50 dark:border-gray-800 shadow-2xl max-w-xs">
             <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600">
                  <Activity size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-gray-900 dark:text-white leading-none">Global Insights</h3>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Live Zone Coverage</p>
                </div>
             </div>
             <div className="space-y-3">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-gray-500">North Zone</span>
                  <span className="text-indigo-600">High Activity</span>
                </div>
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-gray-500">South Zone</span>
                  <span className="text-emerald-600">Normal</span>
                </div>
             </div>
          </div>

          {/* Footer Legend */}
          <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/20 to-transparent pointer-events-none">
             <div className="flex gap-6 items-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-indigo-500" />
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">Active Movement</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">Stationary</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gray-400" />
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">Signal Lost</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveTracking;
