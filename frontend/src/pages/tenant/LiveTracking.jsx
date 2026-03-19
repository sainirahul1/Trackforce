import React from 'react';
import { Map as MapIcon, Users, Search, Filter, Navigation } from 'lucide-react';

const LiveTracking = () => {
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

        {/* Map Placeholder */}
        <div className="lg:col-span-3 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 relative overflow-hidden flex items-center justify-center group">
          <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800/30 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:20px_20px]"></div>
          <div className="z-10 text-center space-y-4">
            <div className="w-16 h-16 bg-indigo-600/10 rounded-2xl flex items-center justify-center mx-auto text-indigo-600">
              <MapIcon size={32} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Interactive Map View</h2>
              <p className="text-gray-500 dark:text-gray-400">Loading geospatial data layers...</p>
            </div>
          </div>
          <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between pointer-events-none">
            <div className="px-4 py-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-xl border border-white/20 shadow-lg pointer-events-auto">
              <p className="text-xs font-bold text-gray-900 dark:text-white">Central Hub: Sector 45, HQ</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveTracking;
