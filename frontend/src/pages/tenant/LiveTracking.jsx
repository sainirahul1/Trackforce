import React, { useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Map as MapIcon, Users, Search, Filter, Navigation } from 'lucide-react';

const LiveTracking = () => {
  const { setPageLoading } = useOutletContext();

  useEffect(() => {
    if (setPageLoading) setPageLoading(false);
  }, [setPageLoading]);
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Live Tracking</h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Monitor your field executives in real-time.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search employee..."
              className="pl-10 pr-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none w-64 transition-all"
            />
          </div>
          <button className="p-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-500 hover:text-indigo-600 transition-colors">
            <Filter size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-250px)]">
        {/* Sidebar Info */}
        <div className="lg:col-span-1 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-6 flex flex-col gap-4 overflow-y-auto custom-scrollbar">
          <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Users size={18} className="text-indigo-600" />
            Active Force (12)
          </h3>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/50 hover:ring-2 hover:ring-indigo-500 transition-all cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 font-bold">
                    JD
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 dark:text-white truncate">John Doe</p>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Moving • 45 km/h</p>
                    </div>
                  </div>
                  <Navigation size={14} className="text-gray-400 rotate-45" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Map View - Rendered Immediately (0s) */}
        <div className="lg:col-span-3 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 relative overflow-hidden flex items-center justify-center group shadow-inner">
          {/* Scientific Grid Pattern for Map Feel */}
          <div className="absolute inset-0 bg-gray-50 dark:bg-gray-800/20 bg-[radial-gradient(#e5e7eb_1.5px,transparent_1.5px)] dark:bg-[radial-gradient(#1f2937_1.5px,transparent_1.5px)] [background-size:32px_32px]"></div>
          
          {/* Simulated Active Map Path */}
          <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" viewBox="0 0 800 600">
            <path d="M100,500 L300,400 L450,450 L700,200" fill="none" stroke="currentColor" strokeWidth="4" className="text-indigo-500" strokeDasharray="10,10" />
            <circle cx="100" cy="500" r="8" className="fill-emerald-500" />
            <circle cx="700" cy="200" r="8" className="fill-rose-500" />
          </svg>

          {/* Interactive Legend Overlays */}
          <div className="z-10 text-center space-y-6">
            <div className="relative">
              <div className="w-24 h-24 bg-white dark:bg-gray-900 rounded-[2.5rem] flex items-center justify-center text-indigo-600 shadow-2xl border-4 border-indigo-50 dark:border-indigo-900/30 group-hover:scale-110 transition-transform duration-500">
                <MapIcon size={40} className="animate-pulse" />
              </div>
              {/* Floating Signal Ring */}
              <div className="absolute inset-0 border-4 border-indigo-400 rounded-[2.5rem] animate-ping opacity-20" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Command Map Ready</h2>
              <div className="flex items-center justify-center gap-3">
                <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  Live Sync Active
                </span>
                <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">12 Units Tracked</span>
              </div>
            </div>
          </div>

          {/* Map Controls Mockup */}
          <div className="absolute top-6 right-6 flex flex-col gap-2">
            {[Navigation, Search, Filter].map((Icon, i) => (
              <button key={i} className="p-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl text-gray-400 hover:text-indigo-600 transition-all hover:scale-110">
                <Icon size={18} />
              </button>
            ))}
          </div>

          <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between pointer-events-none">
            <div className="px-5 py-2.5 bg-indigo-600 text-white rounded-2xl shadow-2xl shadow-indigo-500/20 pointer-events-auto flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              <p className="text-xs font-black uppercase tracking-widest">Active Hub: Sector 45</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveTracking;
