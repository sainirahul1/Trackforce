import React from 'react';
import Skeleton from '../../ui/Skeleton';

/**
 * ManagerActivitySkeleton
 * 1:1 Structural Mirror of Manager/ActivityLog.jsx (Default View)
 */
const ManagerActivitySkeleton = () => (
  <div className="space-y-6 animate-in fade-in duration-700 pb-12 flex flex-col h-full min-h-screen">
    {/* 1. HEADER MIRROR */}
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <Skeleton variant="circle" className="w-10 h-10" />
          <Skeleton className="h-9 w-64" />
        </div>
        <Skeleton className="h-4 w-96 ml-13" />
      </div>
    </div>

    {/* 2. MAIN CONTAINER MIRROR (Initial View) */}
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
      {/* Field Executives List Mirror */}
      <div className="lg:col-span-8 flex flex-col space-y-6">
        <div className="bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm p-6 flex-1 flex flex-col h-[600px]">
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-3 w-32" />
            </div>
            <Skeleton className="h-10 w-48 rounded-xl" />
          </div>

          <div className="space-y-5 overflow-hidden flex-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="p-4 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center gap-4 bg-white dark:bg-gray-900">
                <Skeleton variant="rounded" className="w-12 h-12 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-2 w-16" />
                  </div>
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Notifications Panel Mirror */}
      <div className="lg:col-span-4 flex flex-col space-y-6">
        <div className="bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm p-6 flex flex-col h-fit">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100 dark:border-gray-800">
             <Skeleton className="h-5 w-40" />
             <Skeleton className="h-6 w-20 rounded-lg" />
          </div>
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="w-10 h-10 rounded-lg shrink-0" />
                <div className="flex-1 space-y-2">
                   <div className="flex justify-between">
                     <Skeleton className="h-4 w-32" />
                     <Skeleton className="h-2 w-12" />
                   </div>
                   <Skeleton className="h-3 w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default ManagerActivitySkeleton;
