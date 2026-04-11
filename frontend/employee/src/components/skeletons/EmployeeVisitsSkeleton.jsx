import React from 'react';
import Skeleton from '../ui/Skeleton';

/**
 * EmployeeVisitsSkeleton
 * 1:1 Structural Mirror of Employee/Visits.jsx
 */
const EmployeeVisitsSkeleton = () => (
  <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 h-full animate-in fade-in duration-500">
    <div className="space-y-6 sm:space-y-8">
      {/* Page Heading Mirror */}
      <div className="px-2 mb-5">
        <Skeleton className="h-10 w-48" />
      </div>

      {/* Filters & Results Count Mirror */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 bg-white dark:bg-gray-900 p-4 sm:p-5 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm mb-6 sm:mb-8">
        <div className="flex items-center gap-3 w-full xl:w-auto">
          {[1, 2, 3, 4, 5].map(i => (
            <Skeleton key={i} className="h-8 w-24 rounded-xl" />
          ))}
          <Skeleton variant="rounded" className="w-10 h-10 rounded-xl ml-2 shrink-0" />
        </div>
        <div className="flex items-center gap-3 bg-indigo-50 dark:bg-indigo-500/10 px-4 py-2.5 rounded-xl border border-indigo-100 dark:border-indigo-500/20 shadow-sm shrink-0 ml-auto xl:ml-0">
          <Skeleton variant="circle" className="w-2.5 h-2.5" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Visits List Mirror */}
        <div className="lg:col-span-2 space-y-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white dark:bg-gray-900 p-4 sm:p-5 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
               <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 space-y-2">
                     <Skeleton className="h-6 w-64" />
                     <div className="flex items-center gap-2">
                        <Skeleton variant="circle" className="w-3 h-3 opacity-20" />
                        <Skeleton className="h-3 w-40" />
                     </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                     <Skeleton className="h-6 w-20 rounded-lg" />
                     <Skeleton className="h-4 w-24 rounded" />
                  </div>
               </div>

               <div className="flex items-center gap-3">
                  <Skeleton className="h-6 w-20 rounded-lg opacity-40" />
               </div>

               <div className="flex flex-wrap items-end justify-between gap-3 mt-1 pt-4 border-t border-gray-50 dark:border-gray-800">
                  <div className="flex items-center gap-2">
                     <Skeleton className="h-8 w-20 rounded-lg" />
                     <Skeleton className="h-8 w-20 rounded-lg" />
                  </div>
                  <div className="flex items-center gap-2">
                     <Skeleton className="h-8 w-24 rounded-lg bg-indigo-600/10" />
                     <Skeleton className="h-8 w-24 rounded-lg bg-green-600/10" />
                  </div>
               </div>
            </div>
          ))}
        </div>

        {/* Sidebar Mirror */}
        <div className="space-y-6 sm:space-y-8 mt-4 lg:mt-0">
           <div className="bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm">
              <div className="flex items-center gap-2.5 mb-6">
                 <Skeleton variant="rounded" className="w-10 h-10 rounded-xl" />
                 <Skeleton className="h-6 w-40" />
              </div>
              <div className="space-y-3">
                 {[1, 2, 3, 4].map(i => (
                   <div key={i} className="flex justify-between items-center p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50">
                      <div className="flex items-center gap-3">
                         <Skeleton variant="circle" className="w-4 h-4 opacity-40" />
                         <Skeleton className="h-4 w-24" />
                      </div>
                      <Skeleton className="h-6 w-6" />
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  </div>
);

export default EmployeeVisitsSkeleton;
