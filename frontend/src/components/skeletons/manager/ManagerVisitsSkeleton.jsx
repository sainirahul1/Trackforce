import React from 'react';
import Skeleton from '../../ui/Skeleton';

/**
 * ManagerVisitsSkeleton
 * 1:1 Structural Mirror of Manager/Visits.jsx (Dashboard View)
 */
const ManagerVisitsSkeleton = () => (
  <div className="space-y-8 animate-in fade-in duration-700">
    {/* Page Header Mirror */}
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <Skeleton variant="circle" className="w-2 h-2" />
          <Skeleton className="h-3 w-48 uppercase tracking-[0.2em]" />
        </div>
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-3 w-[500px] uppercase tracking-[0.2em]" />
      </div>
    </div>

    {/* KPI Grid Mirror (4 Cards) */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-white dark:bg-gray-900 p-6 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm">
          <Skeleton variant="rounded" className="w-12 h-12 rounded-xl mb-4" />
          <Skeleton className="h-2 w-24 uppercase tracking-widest mb-2" />
          <Skeleton className="h-8 w-16" />
        </div>
      ))}
    </div>

    {/* Collapsible Sections Feed */}
    <div className="space-y-12">
      {/* 1. Awaiting Action Section Header */}
      <div className="space-y-4">
        <div className="w-full flex items-center justify-between p-6 bg-rose-50/50 dark:bg-rose-500/5 rounded-[2rem] border border-rose-100 dark:border-rose-500/10">
          <div className="flex items-center gap-3">
            <Skeleton variant="rounded" className="w-10 h-10 rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32 uppercase tracking-[0.2em]" />
              <Skeleton className="h-3 w-48 uppercase tracking-widest" />
            </div>
          </div>
          <Skeleton variant="rounded" className="p-2 w-10 h-10 rounded-xl" />
        </div>

        {/* Pending Rows Mirror */}
        <div className="flex flex-col gap-4">
          {[1, 2].map(i => (
            <div key={i} className="bg-white dark:bg-gray-900 px-4 py-2.5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col lg:flex-row items-center gap-4">
              <div className="flex items-center gap-3 w-full lg:w-[20%]">
                <Skeleton variant="rounded" className="w-10 h-10 rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-2 w-16" />
                </div>
              </div>
              <div className="flex items-center gap-5 w-full lg:w-[40%]">
                <div className="flex items-center gap-2">
                   <Skeleton className="h-4 w-4" />
                   <Skeleton className="h-4 w-32" />
                </div>
                <div className="flex gap-4">
                   <Skeleton className="h-6 w-20 rounded-md" />
                   <Skeleton className="h-4 w-12" />
                </div>
              </div>
              <div className="flex items-center justify-between lg:justify-end gap-5 w-full lg:flex-1">
                 <Skeleton className="h-8 w-24 rounded-lg" />
                 <div className="flex flex-col items-end gap-1.5">
                    <Skeleton className="h-4 w-20 rounded" />
                    <Skeleton className="h-6 w-32 rounded-lg" />
                 </div>
                 <Skeleton className="h-8 w-24 rounded-lg bg-indigo-600/20" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Operational History Section Header */}
      <div className="space-y-4">
        <div className="w-full flex items-center justify-between p-6 bg-indigo-50/50 dark:bg-indigo-500/5 rounded-[2rem] border border-indigo-100 dark:border-indigo-500/10">
          <div className="flex items-center gap-3">
            <Skeleton variant="rounded" className="w-10 h-10 rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-40 uppercase tracking-[0.2em]" />
              <Skeleton className="h-3 w-64 uppercase tracking-widest" />
            </div>
          </div>
          <Skeleton variant="rounded" className="p-2 w-10 h-10 rounded-xl" />
        </div>
        
        {/* History Rows Placeholder */}
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map(i => (
             <div key={i} className="bg-white dark:bg-gray-900 px-4 py-2.5 rounded-2xl border border-gray-50/50 dark:border-gray-800 shadow-sm h-14" />
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default ManagerVisitsSkeleton;
