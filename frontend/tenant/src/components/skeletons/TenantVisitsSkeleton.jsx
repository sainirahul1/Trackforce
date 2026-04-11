import React from 'react';
import Skeleton from '../ui/Skeleton';

/**
 * TenantVisitsSkeleton
 * 1:1 Structural Mirror of Tenant/Visits.jsx
 */
const TenantVisitsSkeleton = () => (
  <div className="space-y-6 animate-in fade-in duration-500">
    {/* Page Header */}
    <div className="space-y-2">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-72" />
    </div>

    {/* Metric Cards Grid */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
          <Skeleton className="h-3 w-32 uppercase tracking-widest" />
          <div className="flex items-end gap-2">
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-4 w-12 mb-1.5" />
          </div>
        </div>
      ))}
    </div>

    {/* Activity Table/List Container */}
    <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
      <div className="p-6 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
           <Skeleton variant="rounded" className="w-5 h-5 rounded-md" />
           <Skeleton className="h-5 w-40" />
        </div>
        <Skeleton className="h-4 w-20" />
      </div>
      <div className="divide-y divide-gray-50 dark:divide-gray-800">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Skeleton variant="rounded" className="w-12 h-12 rounded-2xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>
            
            <div className="hidden md:block space-y-1 text-right pr-20">
              <Skeleton className="h-4 w-32 ml-auto" />
              <Skeleton className="h-2 w-20 ml-auto" />
            </div>

            <div className="flex items-center gap-6">
              <Skeleton className="h-8 w-24 rounded-full" />
              <Skeleton variant="circle" className="w-5 h-5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default TenantVisitsSkeleton;
