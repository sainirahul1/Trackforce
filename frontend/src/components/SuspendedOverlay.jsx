import React from 'react';
import { ShieldAlert, Mail, Phone, Lock } from 'lucide-react';

const SuspendedOverlay = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6 bg-gray-900/60 backdrop-blur-2xl animate-in fade-in duration-700">
      <div className="bg-white dark:bg-gray-900 w-full max-w-xl rounded-[3.5rem] shadow-[0_32px_128px_-16px_rgba(0,0,0,0.5)] overflow-hidden border border-white/10 relative group">
        
        {/* Decorative corner glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-rose-500/20 blur-[80px] rounded-full group-hover:bg-rose-500/30 transition-colors duration-1000" />
        
        <div className="p-12 text-center relative z-10">
          <div className="w-24 h-24 bg-rose-50/50 dark:bg-rose-500/10 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-rose-100 dark:border-rose-500/20 shadow-inner">
            <Lock className="text-rose-600 w-10 h-10" strokeWidth={1.5} />
          </div>

          <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight mb-4 uppercase italic">
            Account <span className="text-rose-600">Suspended</span>
          </h1>
          
          <p className="text-gray-500 dark:text-gray-400 font-medium text-lg leading-relaxed mb-10 px-4">
            Access to your organization's infrastructure has been temporarily restricted by the system administrator.
          </p>

          <div className="grid grid-cols-1 gap-4 mb-10">
            <div className="flex items-center gap-4 p-5 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border border-gray-100 dark:border-gray-800 hover:scale-[1.02] transition-transform cursor-pointer group/item">
              <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center text-gray-400 group-hover/item:text-indigo-500 transition-colors shadow-sm">
                <Mail size={20} />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Support Email</p>
                <p className="font-bold text-gray-900 dark:text-gray-100">admin@trackforce.com</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-xs font-black text-rose-500/60 uppercase tracking-[0.3em] animate-pulse">
              Restricted Access Environment
            </p>
            <div className="h-1.5 w-32 bg-gray-100 dark:bg-gray-800 rounded-full mx-auto overflow-hidden">
              <div className="h-full bg-rose-500 w-1/3 animate-progress" />
            </div>
          </div>
        </div>
        
        {/* Footer info */}
        <div className="px-12 py-6 bg-gray-50/50 dark:bg-gray-800/20 border-t border-gray-50 dark:border-gray-800 flex justify-center">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Infrastructure Security Protocol v4.0.2
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuspendedOverlay;
