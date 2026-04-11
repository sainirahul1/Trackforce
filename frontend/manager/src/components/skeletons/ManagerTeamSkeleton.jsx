import React from 'react';
import Skeleton from '../ui/Skeleton';

/**
 * ManagerTeamSkeleton
 * 1:1 Structural Mirror of Manager/Team.jsx
 */
const ManagerTeamSkeleton = () => (
  <div className="space-y-8 animate-in fade-in duration-500 relative pb-12">
    {/* Page Header Mirror */}
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div className="space-y-2">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>
      <div className="flex flex-wrap gap-3">
         <Skeleton className="h-12 w-32 rounded-xl" />
         <Skeleton className="h-12 w-48 rounded-xl" />
         <Skeleton className="h-12 w-40 rounded-xl bg-blue-50/50" />
      </div>
    </div>

    {/* KPI Stats Grid Mirror (4 Cards) */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
          <div className="flex justify-between items-start">
             <div className="space-y-2">
                <Skeleton className="h-2 w-24 uppercase tracking-widest opacity-50" />
                <Skeleton className="h-8 w-20" />
             </div>
             <Skeleton variant="rounded" className="w-10 h-10 rounded-xl" />
          </div>
          <div className="space-y-2">
             <div className="flex justify-between items-center text-[10px]">
                <Skeleton className="h-2 w-16" />
                <Skeleton className="h-2 w-12" />
             </div>
             <Skeleton className="h-1.5 w-full rounded-full" />
          </div>
        </div>
      ))}
    </div>

    {/* Search & Filter Bar Mirror */}
    <div className="bg-white dark:bg-gray-800 rounded-[2rem] p-4 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
       <div className="relative w-full sm:w-96">
          <Skeleton className="h-11 w-full rounded-2xl" />
       </div>
       <div className="flex items-center gap-3 w-full sm:w-auto">
          <Skeleton className="h-11 w-40 rounded-2xl" />
          <div className="flex bg-gray-50 dark:bg-gray-900 p-1 rounded-xl border border-gray-100 dark:border-gray-800">
             {[1, 2].map(i => <Skeleton key={i} className="h-8 w-24 rounded-lg" />)}
          </div>
       </div>
    </div>

    {/* Team Directory Table Mirror */}
    <div className="bg-white dark:bg-gray-800 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
       <div className="grid grid-cols-[1.5fr_1fr_1fr_2fr_1fr] gap-4 p-6 bg-gray-50/50 dark:bg-gray-900/30 border-b border-gray-50 dark:border-gray-800">
          {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-3 w-32 uppercase tracking-widest" />)}
       </div>
       <div className="divide-y divide-gray-50 dark:divide-gray-800">
          {[1, 2, 3, 4, 5, 6, 7].map(i => (
            <div key={i} className="grid grid-cols-[1.5fr_1fr_1fr_2fr_1fr] gap-4 p-6 items-center">
               <div className="flex items-center gap-3">
                  <Skeleton variant="rounded" className="w-10 h-10 rounded-full" />
                  <div className="space-y-1">
                     <Skeleton className="h-4 w-32" />
                     <Skeleton className="h-2 w-24 opacity-60" />
                  </div>
               </div>
               <div>
                  <Skeleton className="h-6 w-24 rounded-lg px-3" />
               </div>
               <div>
                  <Skeleton className="h-6 w-20 rounded-full" />
               </div>
               <div className="space-y-2 pr-8">
                  <div className="flex justify-between items-center">
                     <Skeleton className="h-2 w-16" />
                     <Skeleton className="h-2 w-12" />
                  </div>
                  <Skeleton className="h-1.5 w-full rounded-full" />
               </div>
               <div className="flex justify-end gap-2">
                  {[1, 2, 3].map(j => <Skeleton key={j} variant="rounded" className="w-8 h-8 rounded-lg" />)}
               </div>
            </div>
          ))}
       </div>
    </div>

    {/* Pagination Mirror */}
    <div className="flex justify-center items-center gap-2 pt-4">
       <Skeleton variant="rounded" className="w-10 h-10 rounded-xl" />
       <div className="flex gap-1">
          {[1, 2, 3].map(i => <Skeleton key={i} className="w-10 h-10 rounded-xl" />)}
       </div>
       <Skeleton variant="rounded" className="w-10 h-10 rounded-xl" />
    </div>
  </div>
);

export default ManagerTeamSkeleton;
