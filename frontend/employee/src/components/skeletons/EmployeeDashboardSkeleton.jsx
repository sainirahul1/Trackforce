import React from 'react';
import Skeleton from '../ui/Skeleton';

/**
 * EmployeeDashboardSkeleton
 * 1:1 Structural Mirror of Employee/Dashboard.jsx
 */
const EmployeeDashboardSkeleton = () => (
  <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700 pb-10 px-4 md:px-0">
    {/* 1. Header Section Mirror (Dark Gradient Card) */}
    <div className="relative overflow-hidden rounded-[2rem] p-6 md:p-10 shadow-xl bg-slate-800">
       <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-4">
             <Skeleton className="h-6 w-32 rounded-full opacity-20" />
             <div className="space-y-2">
                <Skeleton className="h-12 w-80 opacity-40" />
                <Skeleton className="h-12 w-64 opacity-40" />
             </div>
             <Skeleton className="h-4 w-48 opacity-20 uppercase tracking-widest" />
          </div>

          <div className="grid grid-cols-3 gap-4 w-full sm:w-auto">
             {[1, 2, 3].map(i => (
               <div key={i} className="flex flex-col items-center justify-center p-4 md:p-6 bg-white/5 rounded-[2rem] border border-white/10 min-w-[120px] md:min-w-[160px] space-y-3">
                  <Skeleton className="h-2 w-16 opacity-20 uppercase tracking-widest" />
                  <Skeleton className="h-10 w-12 opacity-40" />
                  {i === 2 && (
                    <div className="pt-4 border-t border-white/10 w-full flex flex-col items-center gap-2">
                       <Skeleton className="h-2 w-20 opacity-20" />
                       <Skeleton className="h-6 w-10 rounded-full opacity-30" />
                    </div>
                  )}
               </div>
             ))}
          </div>
       </div>
    </div>

    {/* 2. Metrics Row Mirror (3 Square Cards) */}
    <div className="flex flex-col lg:flex-row justify-end items-center gap-6 md:gap-8">
       {[1, 2, 3].map(i => (
         <div key={i} className="w-full max-w-[320px] aspect-square bg-white dark:bg-slate-900 p-7 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-xl flex flex-col items-center justify-between">
            <div className="space-y-3 flex flex-col items-center w-full">
               <Skeleton variant="rounded" className="w-12 h-12 rounded-2xl" />
               <Skeleton className="h-6 w-32" />
               <Skeleton className="h-2 w-24 opacity-40" />
            </div>
            
            {/* Chart/Graphic Placeholder */}
            <div className="w-full flex-1 flex items-center justify-center p-4">
               {i === 1 && <Skeleton className="h-20 w-full opacity-10" /> /* Line Chart */}
               {i === 2 && <Skeleton variant="circle" className="w-32 h-32 opacity-10" /> /* Radar */}
               {i === 3 && (
                 <div className="grid grid-cols-2 gap-6 w-full">
                    <Skeleton variant="circle" className="w-20 h-20 opacity-20" />
                    <Skeleton variant="circle" className="w-20 h-20 opacity-20" />
                 </div>
               )}
            </div>

            <Skeleton className="h-1 w-16 rounded-full opacity-20" />
         </div>
       ))}
    </div>

    {/* 3. Operations Row Mirror */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-start">
       {/* Next Target Card Mirror */}
       <div className="bg-white dark:bg-gray-900 p-8 md:p-10 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-2xl space-y-8">
          <div className="flex justify-between items-center">
             <div className="flex items-center gap-4">
                <Skeleton variant="rounded" className="w-12 h-12 rounded-2xl" />
                <Skeleton className="h-8 w-40" />
             </div>
             <Skeleton className="h-6 w-24 rounded-full opacity-40" />
          </div>
          <div className="flex flex-col md:flex-row gap-8 items-stretch">
             <div className="flex-1 space-y-6">
                <div className="space-y-3">
                   <Skeleton className="h-8 w-full" />
                   <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 w-48" />
                   </div>
                </div>
                <div className="flex items-center gap-6 py-6 border-y border-gray-50 dark:border-gray-800">
                   <div className="space-y-2">
                      <Skeleton className="h-2 w-12" />
                      <Skeleton className="h-6 w-20" />
                   </div>
                   <div className="space-y-2">
                      <Skeleton className="h-2 w-12" />
                      <Skeleton className="h-6 w-20" />
                   </div>
                </div>
             </div>
             <Skeleton variant="rounded" className="w-full md:w-48 h-48 rounded-[2rem]" />
          </div>
       </div>

       {/* Operational Log Mirror */}
       <div className="bg-white dark:bg-gray-900 p-8 md:p-10 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-2xl space-y-10">
          <div className="flex justify-between items-center">
             <div className="flex items-center gap-4">
                <Skeleton variant="rounded" className="w-12 h-12 rounded-2xl" />
                <Skeleton className="h-8 w-48" />
             </div>
             <Skeleton className="h-4 w-20" />
          </div>
          <div className="space-y-8 relative">
             {[1, 2, 3].map(i => (
               <div key={i} className="flex gap-6 relative">
                  <Skeleton variant="circle" className="w-12 h-12 shrink-0" />
                  <div className="flex-1 space-y-3 p-4 bg-gray-50 dark:bg-gray-800/30 rounded-2xl border border-gray-100 dark:border-gray-800/50">
                     <div className="flex justify-between">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-16" />
                     </div>
                     <Skeleton className="h-3 w-full opacity-60" />
                  </div>
               </div>
             ))}
          </div>
          <div className="flex justify-between items-center pt-8 border-t border-gray-50 dark:border-gray-800 opacity-40">
             <Skeleton className="h-2 w-32" />
             <div className="flex items-center gap-2">
                <Skeleton variant="circle" className="w-2 h-2" />
                <Skeleton className="h-2 w-24" />
             </div>
          </div>
       </div>
    </div>
  </div>
);

export default EmployeeDashboardSkeleton;
