import React from 'react';
import Skeleton from '../ui/Skeleton';

/**
 * TenantDashboardSkeleton
 * 1:1 Structural Mirror of Tenant/Dashboard.jsx
 */
const TenantDashboardSkeleton = () => (
  <div className="space-y-8 animate-in fade-in duration-700 pb-12">
    {/* 1. ENTERPRISE HUB HEADER MIRROR */}
    <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] border-2 border-blue-500/10 p-8 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
      <div className="flex items-center gap-6 text-center md:text-left">
        <Skeleton variant="rounded" className="w-16 h-16 rounded-3xl" />
        <div className="space-y-3">
          <Skeleton className="h-8 w-64" />
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-3">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
        </div>
      </div>
    </div>

    {/* 2. & 3. SUBSCRIPTION & USAGE MIRROR */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Subscription Detail Card */}
      <div className="bg-white dark:bg-gray-800 rounded-[2rem] border-2 border-blue-500/10 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
           <Skeleton className="h-6 w-48" />
           <Skeleton className="h-4 w-24 rounded-full" />
        </div>
        <div className="grid grid-cols-2 gap-4">
           {[1, 2, 3, 4].map((i) => (
             <div key={i} className="space-y-2 p-3 border border-blue-500/5 bg-gray-50/10 dark:bg-gray-900/10 rounded-xl">
               <Skeleton className="h-2 w-12" />
               <Skeleton className="h-4 w-20" />
             </div>
           ))}
        </div>
      </div>

      {/* Managed Personnel Usage Card */}
      <div className="bg-white dark:bg-gray-800 rounded-[2rem] border-2 border-blue-500/10 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-1.5">
           <Skeleton className="h-6 w-48" />
           <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="h-2 w-24 mb-6" />
        <div className="space-y-6">
          <Skeleton className="h-4 w-full rounded-full" />
          <div className="grid grid-cols-3 gap-4">
             {[1, 2, 3].map((i) => (
               <div key={i} className="text-center p-3 rounded-2xl bg-gray-50/50 dark:bg-gray-900/10 border-2 border-blue-500/5">
                 <Skeleton className="h-8 w-12 mx-auto" />
                 <Skeleton className="h-2 w-16 mx-auto mt-2" />
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>

    {/* SPLIT LAYOUT MIRROR */}
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* LEFT COLUMN: MANAGER STRATEGIC COMMAND */}
      <div className="lg:col-span-8 space-y-5">
        <div className="flex items-center justify-between px-2 mb-1">
          <div className="space-y-2">
            <Skeleton className="h-7 w-64" />
            <Skeleton className="h-3 w-40" />
          </div>
          <div className="flex items-center gap-4">
             <Skeleton className="h-10 w-48 rounded-2xl" />
             <Skeleton className="h-12 w-24 rounded-2xl" />
          </div>
        </div>

        <div className="flex flex-col gap-4 min-h-[400px]">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="group bg-white dark:bg-gray-800 rounded-full border-2 border-blue-500/10 p-4 pl-6 pr-8 shadow-sm flex items-center justify-between gap-6 relative overflow-hidden backdrop-blur-sm">
              <div className="flex items-center gap-4 flex-1">
                <Skeleton variant="circle" className="w-10 h-10" />
                <div className="flex items-center gap-12 flex-1">
                  <div className="flex flex-col min-w-[200px] space-y-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-2 w-24" />
                  </div>
                  <div className="flex items-center gap-10 border-l border-gray-100 dark:border-gray-700/50 pl-10">
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                </div>
              </div>
              <Skeleton className="h-5 w-5 rounded-full" />
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT COLUMN: RECENT OPERATIONS */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] border-2 border-blue-500/10 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
             <Skeleton className="h-6 w-48" />
             <Skeleton className="h-5 w-5 rounded-full" />
          </div>
          <div className="space-y-7">
            {[1, 2, 3].map((i) => (
              <div key={i} className="relative pl-7 space-y-2">
                 <div className="absolute left-0 top-1 w-2 h-2 rounded-full bg-gray-200 dark:bg-gray-900 shadow-sm opacity-50"></div>
                 <div className="flex justify-between items-start">
                   <Skeleton className="h-4 w-32" />
                   <Skeleton className="h-2 w-12" />
                 </div>
                 <Skeleton className="h-10 w-full" />
                 <Skeleton className="h-2 w-24" />
              </div>
            ))}
          </div>
          <Skeleton className="w-full mt-10 h-14 rounded-2xl" />
        </div>
      </div>
    </div>
  </div>
);

export default TenantDashboardSkeleton;
