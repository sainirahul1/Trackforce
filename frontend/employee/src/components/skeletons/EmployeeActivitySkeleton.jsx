import React from 'react';
import Skeleton from '../ui/Skeleton';

const EmployeeActivitySkeleton = () => {
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

      {/* Timeline Card Skeleton */}
      <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 p-10 space-y-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="w-8 h-8 rounded-lg" />
            <Skeleton className="h-8 w-40 rounded-xl" />
          </div>
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>

        {/* Timeline Items */}
        <div className="space-y-12">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="flex items-center gap-10">
              <Skeleton className="w-12 h-12 rounded-2xl shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-6 w-32 rounded-md" />
                  <div className="flex gap-4">
                    <Skeleton className="h-4 w-16 rounded-md" />
                    <Skeleton className="h-4 w-16 rounded-md" />
                  </div>
                </div>
                <Skeleton className="h-4 w-full rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmployeeActivitySkeleton;
