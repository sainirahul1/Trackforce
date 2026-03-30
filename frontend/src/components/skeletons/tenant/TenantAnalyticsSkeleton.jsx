import React from 'react';
import Skeleton from '../../ui/Skeleton';

/**
 * TenantAnalyticsSkeleton
 * 1:1 Structural Mirror of Tenant/Analytics.jsx
 */
const TenantAnalyticsSkeleton = () => (
  <div className="space-y-8 animate-in fade-in duration-500 pb-12">
    {/* Page Header */}
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="space-y-2">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-32 rounded-xl" />
        <Skeleton variant="rounded" className="w-10 h-10 rounded-xl" />
      </div>
    </div>

    {/* Metric Cards Grid (3 Columns) */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <Skeleton variant="rounded" className="w-12 h-12 rounded-xl" />
            <Skeleton className="h-2 w-16 uppercase tracking-widest opacity-50" />
          </div>
          <div className="space-y-2">
             <Skeleton className="h-4 w-40" />
             <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-4 w-12 rounded-lg" />
             </div>
          </div>
        </div>
      ))}
    </div>

    {/* Charts Grid (2 columns: 66%, 33%) */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 2/3: Performance Trends Line Chart */}
      <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col min-h-[450px] space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-3 w-64" />
          </div>
          <div className="flex items-center gap-2 p-1.5 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-700">
             {[1, 2, 3].map(i => <Skeleton key={i} className="h-8 w-24 rounded-lg" />)}
          </div>
        </div>
        
        {/* Main Chart Placeholder */}
        <div className="flex-1 w-full bg-gray-50/50 dark:bg-gray-950/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800 flex items-center justify-center p-8">
           <Skeleton className="h-full w-full opacity-5" />
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-gray-50 dark:border-gray-800">
           <div className="flex gap-8">
              <div className="text-center space-y-2">
                 <Skeleton className="h-8 w-16 mx-auto" />
                 <Skeleton className="h-2 w-12 mx-auto uppercase tracking-widest" />
              </div>
              <div className="text-center space-y-2">
                 <Skeleton className="h-8 w-16 mx-auto" />
                 <Skeleton className="h-2 w-12 mx-auto uppercase tracking-widest" />
              </div>
           </div>
           <Skeleton className="h-10 w-32 rounded-xl" />
        </div>
      </div>

      {/* 1/3: Zone Analytics / Progress Bars */}
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-8 flex flex-col">
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-3 w-64" />
          </div>
          
          <div className="space-y-8 flex-1 py-4">
             {[1, 2, 3, 4].map(i => (
               <div key={i} className="space-y-3">
                  <div className="flex justify-between items-center">
                     <Skeleton className="h-2 w-32 uppercase tracking-widest" />
                     <Skeleton className="h-4 w-12" />
                  </div>
                  <Skeleton className="h-2 w-full rounded-full" />
               </div>
             ))}
          </div>

          <div className="pt-8 border-t border-gray-50 dark:border-gray-800">
             <div className="p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl space-y-4">
                 <div className="flex justify-between">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton variant="circle" className="w-5 h-5" />
                 </div>
                 <div className="space-y-2">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-3 w-48" />
                 </div>
             </div>
          </div>
      </div>
    </div>

    {/* Table Mirror: Manager Performance Analysis */}
    <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-8">
        <div className="flex justify-between items-center">
           <div className="space-y-2">
              <Skeleton className="h-6 w-64" />
              <Skeleton className="h-3 w-96" />
           </div>
           <Skeleton className="h-6 w-32 rounded-lg" />
        </div>

        {/* Table Skeleton Markup */}
        <div className="rounded-2xl border border-gray-50 dark:border-gray-800 overflow-hidden">
           <div className="grid grid-cols-5 gap-4 p-5 bg-gray-50/50 dark:bg-gray-900/30 border-b border-gray-50 dark:border-gray-800">
              {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-3 w-24 uppercase tracking-widest" />)}
           </div>
           <div className="divide-y divide-gray-50 dark:divide-gray-800">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="grid grid-cols-5 gap-4 p-5 items-center">
                   <div className="flex items-center gap-3">
                      <Skeleton variant="rounded" className="w-8 h-8 rounded-full" />
                      <Skeleton className="h-4 w-24" />
                   </div>
                   <Skeleton className="h-4 w-32" />
                   <Skeleton className="h-4 w-20" />
                   <Skeleton className="h-4 w-20" />
                   <Skeleton className="h-5 w-16 rounded-lg" />
                </div>
              ))}
           </div>
        </div>

        {/* Pagination Skeleton */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-50 dark:border-gray-800">
           <Skeleton className="h-3 w-64" />
           <div className="flex items-center gap-2">
              <Skeleton variant="rounded" className="w-10 h-10 rounded-xl" />
              {[1, 2].map(i => <Skeleton key={i} className="w-10 h-10 rounded-xl" />)}
              <Skeleton variant="rounded" className="w-10 h-10 rounded-xl" />
           </div>
        </div>
    </div>
  </div>
);

export default TenantAnalyticsSkeleton;
