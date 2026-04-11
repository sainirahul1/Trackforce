import React from 'react';
import Skeleton from '../ui/Skeleton';

const EmployeeOrdersSkeleton = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center px-4 md:px-0">
        <div className="space-y-2">
          <Skeleton className="h-10 w-48 rounded-2xl" />
          <Skeleton className="h-5 w-64 rounded-xl" />
        </div>
        <Skeleton className="h-12 w-32 rounded-2xl" />
      </div>

      {/* Tabs Skeleton */}
      <div className="flex bg-white dark:bg-gray-900 p-2 rounded-[2rem] border border-gray-100 dark:border-gray-800">
        {[1, 2, 3].map(i => (
          <Skeleton key={i} className="h-12 flex-1 rounded-[1.5rem] mx-1" />
        ))}
      </div>

      {/* Orders Grid/List Skeleton */}
      <div className="space-y-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 p-8 space-y-6">
            <div className="flex justify-between items-start">
              <div className="flex gap-4">
                <Skeleton className="w-14 h-14 rounded-2xl" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-40 rounded-lg" />
                  <Skeleton className="h-4 w-24 rounded-md" />
                </div>
              </div>
              <Skeleton className="h-8 w-24 rounded-full" />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-gray-50 dark:border-gray-800">
              {[1, 2, 3, 4].map(j => (
                <div key={j} className="space-y-2">
                  <Skeleton className="h-3 w-16 rounded-sm" />
                  <Skeleton className="h-5 w-24 rounded-md" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeeOrdersSkeleton;
