import React from 'react';
import Skeleton from '../ui/Skeleton';

/**
 * High-Fidelity Dashboard Skeleton
 * Mirrors: Tenant Dashboard, Manager Overview, Employee Summary
 */
export const DashboardSkeleton = () => (
  <div className="space-y-8 animate-in fade-in duration-500">
    <div className="space-y-2">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-4 w-96 opacity-50" />
    </div>

    {/* 4-Stat Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-white dark:bg-gray-900 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
          <Skeleton variant="rounded" className="w-12 h-12 rounded-2xl" />
          <Skeleton className="h-2 w-24" />
          <div className="flex justify-between items-end">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-12 rounded-lg opacity-50" />
          </div>
        </div>
      ))}
    </div>

    {/* 2-Column Main Content */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 border border-gray-100 dark:border-gray-800 shadow-sm space-y-8">
        <div className="flex justify-between items-center">
           <Skeleton className="h-6 w-48" />
           <Skeleton className="h-10 w-32 rounded-xl" />
        </div>
        <Skeleton variant="rounded" className="h-[350px] w-full rounded-3xl" />
      </div>
      <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
        <Skeleton className="h-6 w-32" />
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton variant="circle" className="w-10 h-10" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-2 w-1/4 opacity-50" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/**
 * High-Fidelity Table/List Skeleton
 * Mirrors: Visits, Orders, Employees, Team, Tasks
 */
export const ListSkeleton = () => (
  <div className="space-y-6 animate-in fade-in duration-500">
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
       <div className="space-y-2">
         <Skeleton className="h-8 w-48" />
         <Skeleton className="h-4 w-72 opacity-50" />
       </div>
       <div className="flex items-center gap-3">
         <Skeleton className="h-11 w-64 rounded-xl" />
         <Skeleton className="h-11 w-11 rounded-xl" />
       </div>
    </div>

    <div className="bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
       <div className="p-6 border-b border-gray-50 dark:border-gray-800 flex justify-between">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-6 w-16" />
       </div>
       <div className="p-6 space-y-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-gray-800/30 rounded-2xl border border-transparent">
               <div className="flex items-center gap-4 flex-1">
                  <Skeleton variant="rounded" className="w-12 h-12 rounded-2xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-2 w-24 opacity-50" />
                  </div>
               </div>
               <div className="flex-1 hidden md:block">
                  <Skeleton className="h-3 w-20 ml-auto" />
               </div>
               <div className="flex-1 flex justify-end gap-3 items-center">
                  <Skeleton className="h-8 w-24 rounded-xl" />
                  <Skeleton className="h-10 w-10 rounded-lg opacity-30" />
               </div>
            </div>
          ))}
       </div>
    </div>
  </div>
);

/**
 * High-Fidelity Analytics Skeleton
 */
export const AnalyticsSkeleton = () => (
   <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
         <div className="space-y-2">
           <Skeleton className="h-8 w-64" />
           <Skeleton className="h-4 w-96 opacity-50" />
         </div>
         <Skeleton className="h-11 w-40 rounded-xl" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {[1, 2, 3].map(i => (
           <div key={i} className="bg-white dark:bg-gray-900 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
              <Skeleton className="h-3 w-24 opacity-50" />
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-1.5 w-full rounded-full" />
           </div>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 bg-white dark:bg-gray-900 p-10 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-sm h-[450px]">
            <div className="flex justify-between mb-10">
               <Skeleton className="h-6 w-48" />
               <Skeleton className="h-10 w-48 rounded-xl" />
            </div>
            <Skeleton className="w-full h-64 rounded-2xl opacity-20" />
         </div>
         <div className="bg-white dark:bg-gray-900 p-10 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-sm space-y-8">
            <Skeleton className="h-6 w-40" />
            <div className="space-y-6">
               {[1, 2, 3, 4].map(i => (
                 <div key={i} className="space-y-2">
                    <div className="flex justify-between">
                       <Skeleton className="h-2 w-20" />
                       <Skeleton className="h-2 w-10" />
                    </div>
                    <Skeleton className="h-1.5 w-full rounded-full" />
                 </div>
               ))}
            </div>
         </div>
      </div>
   </div>
);

/**
 * High-Fidelity Profile Skeleton
 */
export const ProfileSkeleton = () => (
  <div className="space-y-8 animate-in fade-in duration-500">
    <div className="bg-indigo-600/5 dark:bg-indigo-900/20 rounded-[3rem] p-10 border border-indigo-100 dark:border-indigo-800/50 flex flex-col md:flex-row items-center gap-10">
       <Skeleton variant="circle" className="w-32 h-32 shrink-0 border-4 border-white dark:border-gray-800 shadow-xl" />
       <div className="flex-1 space-y-4 text-center md:text-left">
          <Skeleton className="h-10 w-64 mx-auto md:mx-0" />
          <Skeleton className="h-4 w-40 mx-auto md:mx-0 opacity-50" />
          <div className="flex justify-center md:justify-start gap-3 pt-2">
             <Skeleton className="h-8 w-24 rounded-xl" />
             <Skeleton className="h-8 w-24 rounded-xl" />
          </div>
       </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
       {[1, 2, 3].map(i => (
         <div key={i} className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
            <Skeleton className="h-4 w-32 mb-2" />
            {[1, 2, 3].map(j => (
              <div key={j} className="flex item-start gap-4">
                 <Skeleton variant="rounded" className="w-10 h-10 rounded-xl" />
                 <div className="space-y-2 pt-1">
                    <Skeleton className="h-2 w-16 opacity-50" />
                    <Skeleton className="h-3 w-32" />
                 </div>
              </div>
            ))}
         </div>
       ))}
    </div>
  </div>
);

/**
 * High-Fidelity Settings Skeleton
 */
export const SettingsSkeleton = () => (
  <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
    <div className="space-y-2">
      <Skeleton className="h-10 w-64" />
      <Skeleton className="h-4 w-96 opacity-50" />
    </div>
    {[1, 2, 3, 4].map(i => (
      <div key={i} className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
         <div className="flex items-center gap-4">
            <Skeleton variant="rounded" className="w-14 h-14 rounded-2xl" />
            <div className="space-y-2">
               <Skeleton className="h-5 w-48" />
               <Skeleton className="h-3 w-64 opacity-50" />
            </div>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <Skeleton className="h-14 w-full rounded-2xl" />
            <Skeleton className="h-14 w-full rounded-2xl" />
         </div>
         <div className="flex justify-end pt-2">
            <Skeleton className="h-12 w-40 rounded-2xl" />
         </div>
      </div>
    ))}
  </div>
);
