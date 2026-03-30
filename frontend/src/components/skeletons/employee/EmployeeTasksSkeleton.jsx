import React from 'react';
import Skeleton from '../../ui/Skeleton';

/**
 * EmployeeTasksSkeleton
 * 1:1 Structural Mirror of Employee/Tasks.jsx
 */
const EmployeeTasksSkeleton = () => (
  <div className="space-y-8 animate-in fade-in duration-500 pb-20 max-w-6xl mx-auto px-4 md:px-0">
    
    {/* 1. WorkStatusPanel Mirror (Large Status Card) */}
    <div className="bg-white dark:bg-gray-900 p-8 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-8">
      <div className="flex items-center gap-8">
         <Skeleton variant="rounded" className="w-20 h-20 rounded-[2.5rem]" />
         <div className="space-y-3">
            <div className="flex items-center gap-3">
               <Skeleton variant="circle" className="w-3 h-3" />
               <Skeleton className="h-8 w-48" />
            </div>
            <Skeleton className="h-4 w-64 opacity-40" />
         </div>
      </div>
      <div className="flex items-center gap-4 w-full lg:w-auto">
         <Skeleton className="h-14 w-full lg:w-48 rounded-[2rem] bg-indigo-600/20" />
      </div>
    </div>

    {/* 2. StatCard Grid Mirror (4 Cards with Sparklines) */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
       {[1, 2, 3, 4].map(i => (
         <div key={i} className="bg-white dark:bg-gray-900 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm space-y-4 relative overflow-hidden">
            <div className="flex justify-between items-center relative z-10">
               <Skeleton variant="rounded" className="w-10 h-10 rounded-xl" />
               <Skeleton className="h-4 w-12 rounded-full opacity-20" />
            </div>
            <div className="space-y-2 relative z-10">
               <Skeleton className="h-2 w-24 opacity-40 uppercase tracking-widest" />
               <Skeleton className="h-10 w-20" />
            </div>
            {/* Sparkline Placeholder */}
            <div className="absolute bottom-0 left-0 right-0 h-12 opacity-5">
               <Skeleton className="h-full w-full" />
            </div>
         </div>
       ))}
    </div>

    {/* 3. Search & Filter Controls Mirror */}
    <div className="bg-gray-50/50 dark:bg-gray-950/20 p-6 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 space-y-6">
       <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-2 bg-white dark:bg-gray-900 p-1.5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
             <Skeleton className="h-10 w-28 rounded-xl" />
             <Skeleton className="h-10 w-28 rounded-xl opacity-40 ml-1" />
          </div>
          <div className="relative flex-1 min-w-[300px]">
             <Skeleton className="h-14 w-full rounded-2xl" />
          </div>
       </div>
       <div className="flex flex-wrap items-center gap-4">
          <Skeleton className="h-4 w-32 uppercase tracking-widest opacity-40 md:mr-4" />
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-10 w-40 rounded-xl" />)}
       </div>
    </div>

    {/* 4. Task Feed Mirror */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
       {[1, 2, 3, 4, 5, 6].map(i => (
         <div key={i} className="bg-white dark:bg-gray-900 p-6 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
            <div className="flex justify-between items-start">
               <div className="space-y-2">
                  <Skeleton className="h-2 w-16 opacity-40 uppercase tracking-widest" />
                  <Skeleton className="h-8 w-48" />
               </div>
               <Skeleton variant="circle" className="w-10 h-10" />
            </div>
            
            <div className="space-y-3">
               <div className="flex items-center gap-2">
                  <Skeleton variant="circle" className="w-4 h-4 opacity-20" />
                  <Skeleton className="h-4 w-40" />
               </div>
               <div className="flex items-center gap-2">
                  <Skeleton variant="circle" className="w-4 h-4 opacity-20" />
                  <Skeleton className="h-4 w-32 opacity-60" />
               </div>
            </div>

            <div className="pt-6 border-t border-gray-50 dark:border-gray-800 flex justify-between items-center">
               <div className="space-y-1">
                  <Skeleton className="h-2 w-16" />
                  <Skeleton className="h-6 w-20" />
               </div>
               <Skeleton className="h-10 w-28 rounded-xl bg-indigo-600/20" />
            </div>
         </div>
       ))}
    </div>
  </div>
);

export default EmployeeTasksSkeleton;
