import React from 'react';
import Skeleton from '../ui/Skeleton';

/**
 * TenantNotificationsSkeleton
 * 1:1 Structural Mirror of Tenant/Notifications.jsx
 */
const TenantNotificationsSkeleton = () => (
  <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
    <div className="flex items-center justify-between">
      <div>
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-96" />
      </div>
      <Skeleton className="h-4 w-32 rounded-lg" />
    </div>

    <div className="space-y-3">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="p-6 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 flex items-start gap-4">
          <Skeleton className="p-3 w-12 h-12 rounded-2xl shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="flex justify-between items-center">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-3 w-16" />
            </div>
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      ))}
    </div>

    <div className="flex flex-col items-center justify-center py-20 opacity-20">
      <Skeleton variant="circle" className="w-16 h-16 mb-4" />
      <Skeleton className="h-4 w-48 mx-auto" />
    </div>
  </div>
);

export default TenantNotificationsSkeleton;
