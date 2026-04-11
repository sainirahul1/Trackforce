import React from 'react';
import Skeleton from '../ui/Skeleton';

/**
 * ManagerAnalyticsSkeleton
 * 1:1 Structural Mirror of Manager/Analytics.jsx
 */
const ManagerAnalyticsSkeleton = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-[#0b0d11] p-6 transition-all duration-500">
    {/* Page Header Mirror */}
    <div className="flex justify-between items-center mb-8">
      <div className="space-y-2">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-3 w-48 uppercase tracking-[0.2em]" />
      </div>

      <div className="flex flex-1 max-w-md mx-8">
        <Skeleton className="h-12 w-full rounded-2xl" />
      </div>

      <div className="flex bg-white dark:bg-[#16191f] p-1 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 space-x-1">
        {[1, 2, 3].map(i => <Skeleton key={i} className="h-8 w-20 rounded-lg" />)}
      </div>
    </div>

    {/* KPI Sparkline Cards Grid */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-white dark:bg-[#16191f] p-6 rounded-[2rem] shadow-sm min-h-[140px] flex flex-col justify-between overflow-hidden relative">
           <div className="space-y-2 relative z-10">
              <Skeleton className="h-2 w-24 uppercase tracking-widest opacity-50" />
              <Skeleton className="h-8 w-32" />
           </div>
           {/* Sparkline Placeholder */}
           <div className="absolute bottom-0 left-0 w-full h-16 bg-blue-500/5 border-t border-blue-500/10">
              <Skeleton className="h-full w-full opacity-10" />
           </div>
        </div>
      ))}
    </div>

    {/* Executive Status List Mirror */}
    <div className="bg-white dark:bg-[#16191f] border border-slate-200 dark:border-slate-800 rounded-[2rem] overflow-hidden shadow-xl">
       <div className="grid grid-cols-[2fr_2fr_1fr_1fr_0.5fr] p-6 border-b border-slate-100 dark:border-slate-800">
          {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-2 w-16 uppercase tracking-[0.2em] opacity-40" />)}
       </div>
       <div className="p-4 space-y-2">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="grid grid-cols-[2fr_2fr_1fr_1fr_0.5fr] p-6 items-center rounded-2xl bg-gray-50/30 dark:bg-slate-800/20">
               <div className="flex items-center gap-4">
                  <Skeleton variant="rounded" className="w-10 h-10 rounded-xl" />
                  <div className="space-y-2">
                     <Skeleton className="h-4 w-32" />
                     <Skeleton className="h-2 w-24 opacity-60" />
                  </div>
               </div>
               <div className="space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-2 w-24 opacity-50" />
               </div>
               <div className="flex justify-center">
                  <Skeleton className="h-6 w-12" />
               </div>
               <div className="flex justify-center">
                  <Skeleton className="h-6 w-16" />
               </div>
               <div className="flex justify-end">
                  <Skeleton className="h-3 w-12 opacity-50" />
               </div>
            </div>
          ))}
       </div>
    </div>
  </div>
);

export default ManagerAnalyticsSkeleton;
