import React from 'react';
import Skeleton from '../ui/Skeleton';

/**
 * EmployeeProfileSkeleton
 * 1:1 Structural Mirror of Employee/Profile.jsx
 */
const EmployeeProfileSkeleton = () => (
  <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-500 pb-20">
    {/* Identity Card Mirror */}
    <div className="relative rounded-[2.5rem] bg-white/40 dark:bg-slate-950/40 p-8 border-2 border-slate-200 dark:border-slate-800 backdrop-blur-2xl shadow-xl flex flex-col sm:flex-row sm:items-center gap-8">
      <Skeleton variant="rounded" className="h-24 w-24 sm:h-32 sm:w-32 rounded-2xl sm:rounded-3xl shrink-0" />
      <div className="flex-1 space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-4 w-40 opacity-40 uppercase tracking-widest" />
        </div>
        <div className="flex flex-wrap gap-4 pt-2">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-8 w-32 rounded-xl opacity-20" />)}
        </div>
      </div>
      <div className="shrink-0 flex gap-3">
         <Skeleton variant="rounded" className="w-12 h-12 rounded-2xl" />
         <Skeleton className="h-12 w-32 rounded-2xl" />
      </div>
    </div>

    {/* Section Title Mirror */}
    <div className="space-y-2 px-2">
      <Skeleton className="h-10 w-72" />
      <Skeleton className="h-4 w-96 opacity-40" />
    </div>

    {/* Information Grid Mirror (3 Large Cards) */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[1, 2, 3].map(i => (
        <div key={i} className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm space-y-8">
          <div className="flex items-center gap-3">
            <Skeleton variant="rounded" className="w-12 h-12 rounded-2xl" />
            <Skeleton className="h-6 w-40" />
          </div>
          <div className="space-y-6">
            {[1, 2, 3, 4].map(j => (
              <div key={j} className="flex items-center justify-between gap-4 py-3 border-b border-gray-50 dark:border-gray-800/50 last:border-0">
                <div className="flex items-center gap-2.5">
                  <Skeleton variant="rounded" className="w-6 h-6 rounded-lg opacity-20" />
                  <Skeleton className="h-2 w-20 opacity-40 uppercase tracking-widest" />
                </div>
                <Skeleton className="h-4 w-32" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default EmployeeProfileSkeleton;
