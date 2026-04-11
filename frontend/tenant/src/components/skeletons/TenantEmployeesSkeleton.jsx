import React from 'react';
import Skeleton from '../ui/Skeleton';

/**
 * TenantEmployeesSkeleton
 * 1:1 Structural Mirror of Tenant/Employees.jsx
 */
const TenantEmployeesSkeleton = () => (
  <div className="space-y-8 animate-in fade-in duration-500 relative pb-12">
    {/* Enhanced Header Mirror */}
    <div className="relative bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 md:p-10 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div className="flex items-center gap-6">
        <Skeleton variant="rounded" className="w-16 h-16 rounded-2xl" />
        <div className="space-y-3">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-4 w-80" />
        </div>
      </div>
      <div className="flex space-x-3">
         <Skeleton className="h-12 w-32 rounded-xl" />
         <Skeleton className="h-12 w-40 rounded-xl bg-blue-50/50" />
      </div>
    </div>

    {/* Section Tabs & Stats Grid */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
       {[1, 2].map(i => (
         <div key={i} className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
            <Skeleton className="h-4 w-32 uppercase tracking-widest opacity-50" />
            <div className="grid grid-cols-3 gap-4 font-black">
               {[1, 2, 3].map(j => (
                 <div key={j} className="p-4 bg-gray-50 dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 flex items-center gap-4">
                    <Skeleton variant="rounded" className="w-11 h-11 rounded-2xl" />
                    <div className="space-y-1">
                       <Skeleton className="h-2 w-12 uppercase tracking-widest opacity-30" />
                       <Skeleton className="h-6 w-8" />
                    </div>
                 </div>
               ))}
            </div>
         </div>
       ))}
    </div>

    {/* Search & Filter Bar Mirror */}
    <div className="bg-white dark:bg-gray-800 rounded-[2rem] p-6 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
       <div className="relative w-full sm:w-96">
          <Skeleton className="h-12 w-full rounded-2xl" />
       </div>
       <div className="flex items-center gap-4 w-full sm:w-auto">
          <Skeleton className="h-12 w-48 rounded-2xl" />
          <Skeleton className="h-12 w-32 rounded-2xl" />
       </div>
    </div>

    {/* Directory Table Mirror */}
    <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
       <div className="grid grid-cols-5 gap-4 p-6 bg-gray-50/50 dark:bg-gray-900/30 border-b border-gray-50 dark:border-gray-800">
          {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-3 w-32 uppercase tracking-widest" />)}
       </div>
       <div className="divide-y divide-gray-50 dark:divide-gray-800">
          {[1, 2, 3, 4, 5, 6, 7].map(i => (
            <div key={i} className="grid grid-cols-5 gap-4 p-6 items-center">
               <div className="flex items-center gap-4">
                  <Skeleton variant="rounded" className="w-12 h-12 rounded-2xl" />
                  <div className="space-y-2">
                     <Skeleton className="h-4 w-32" />
                     <Skeleton className="h-3 w-24 opacity-60" />
                  </div>
               </div>
               <Skeleton className="h-5 w-24 rounded-lg" />
               <Skeleton className="h-8 w-24 rounded-xl" />
               <Skeleton className="h-8 w-24 rounded-xl" />
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

export default TenantEmployeesSkeleton;
