import React from 'react';
import Skeleton from '../../ui/Skeleton';

/**
 * ManagerTasksSkeleton
 * 1:1 Structural Mirror of Manager/Tasks.jsx
 */
const ManagerTasksSkeleton = () => (
  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
    {/* Page Header Mirror */}
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div className="space-y-2">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>
      <div className="flex items-center gap-3">
         <Skeleton className="h-12 w-40 rounded-2xl" />
         <Skeleton className="h-12 w-48 rounded-2xl bg-indigo-600/20 shadow-xl shadow-indigo-500/10" />
      </div>
    </div>

    {/* Stats Summary Panel Mirror (4 Cards) */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-1">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-4">
          <Skeleton variant="rounded" className="w-11 h-11 rounded-2xl" />
          <div className="space-y-2">
            <Skeleton className="h-2 w-24 uppercase tracking-widest opacity-50" />
            <Skeleton className="h-6 w-16" />
          </div>
        </div>
      ))}
    </div>

    {/* Filters & Tabs Bar Mirror */}
    <div className="bg-gray-50/50 dark:bg-gray-950/20 p-6 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <div className="flex bg-white dark:bg-gray-900 p-1.5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
           <Skeleton className="h-10 w-28 rounded-xl" />
           <Skeleton className="h-10 w-28 rounded-xl opacity-40 ml-1" />
        </div>
        <div className="relative flex-1 min-w-[300px]">
           <Skeleton className="h-14 w-full rounded-2xl" />
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-4">
         <Skeleton className="h-4 w-32 uppercase tracking-widest opacity-40" />
         {[1, 2].map(i => <Skeleton key={i} className="h-10 w-40 rounded-xl" />)}
         <div className="ml-auto">
            <Skeleton className="h-3 w-48 uppercase tracking-wider opacity-40" />
         </div>
      </div>
    </div>

    {/* Kanban Board Mirror */}
    <div className="flex overflow-x-auto pb-4 gap-6 custom-scrollbar">
       {[1, 2, 3, 4, 5].map(col => (
         <div key={col} className="min-w-[320px] flex-shrink-0 space-y-6">
            {/* Column Header */}
            <div className="flex items-center justify-between px-2">
               <div className="flex items-center gap-2">
                  <Skeleton variant="rounded" className="w-7 h-7 rounded-lg" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-8 opacity-40" />
               </div>
               <Skeleton variant="rounded" className="w-6 h-6 rounded-md opacity-20" />
            </div>

            {/* Column Content Dropzone */}
            <div className="space-y-4 min-h-[500px] p-2 rounded-[2.5rem] bg-gray-50/50 dark:bg-gray-950/20 border-2 border-dashed border-gray-100 dark:border-gray-800/50">
               {[1, 2, 3].map(card => (
                 <div key={card} className="bg-white dark:bg-gray-900 px-4 py-3.5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-4 border-l-4 border-l-gray-300">
                    <div className="flex justify-between items-start">
                       <Skeleton className="h-2 w-16" />
                       <div className="flex gap-1">
                          <Skeleton className="h-4 w-12 rounded-md" />
                          <Skeleton variant="rounded" className="w-5 h-5 rounded-md opacity-20" />
                       </div>
                    </div>
                    <Skeleton className="h-10 w-full" />
                    <div className="flex justify-between items-center pt-3 border-t border-gray-50 dark:border-gray-800">
                       <div className="flex items-center gap-2">
                          <Skeleton variant="circle" className="w-5 h-5" />
                          <Skeleton className="h-2 w-20" />
                       </div>
                       <Skeleton className="h-2 w-16" />
                    </div>
                 </div>
               ))}
               <Skeleton className="h-12 w-full rounded-3xl" />
            </div>
         </div>
       ))}
       {/* Add Section Placeholder */}
       <div className="min-w-[320px] h-[580px] rounded-[2.5rem] border-2 border-dashed border-gray-100 dark:border-gray-800/10 flex items-center justify-center">
          <Skeleton className="h-full w-full" />
       </div>
    </div>
  </div>
);

export default ManagerTasksSkeleton;
