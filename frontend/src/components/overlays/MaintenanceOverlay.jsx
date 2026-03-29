import React from 'react';
import { Settings, AlertTriangle } from 'lucide-react';

const MaintenanceOverlay = () => {
  return (
    <div className="fixed inset-0 z-[999] bg-gray-50/50 dark:bg-gray-950/80 backdrop-blur-xl flex flex-col justify-center items-center text-center p-6 animate-in fade-in duration-500">
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-2xl rounded-[3rem] p-12 max-w-lg w-full relative overflow-hidden group">
        <div className="absolute -top-12 -right-12 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
           <Settings size={200} className="text-amber-500 animate-[spin_10s_linear_infinite] rotate-12" />
        </div>
        <div className="w-24 h-24 bg-amber-50 dark:bg-amber-500/10 rounded-[2rem] flex items-center justify-center text-amber-500 mx-auto mb-8 shadow-inner border border-amber-100 dark:border-amber-500/20 rotate-3 group-hover:rotate-0 transition-transform">
          <AlertTriangle size={48} strokeWidth={1.5} />
        </div>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-4">
          Under Maintenance
        </h1>
        <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed mb-8 text-sm">
          The server is currently under maintenance mode to perform essential upgrades and improvements. Please try again later. We apologize for any inconvenience.
        </p>
        <div className="space-y-3">
          <button 
            onClick={() => window.location.reload()}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-xl shadow-indigo-100 dark:shadow-none transition-all text-sm"
          >
            Check Again
          </button>
          <button 
            onClick={() => {
              localStorage.clear();
              window.location.href = '/login';
            }}
            className="w-full bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold py-4 rounded-2xl border border-gray-200 dark:border-gray-700 transition-all text-sm shadow-sm"
          >
            Exit to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceOverlay;
