import React from 'react';
import Skeleton from '../ui/Skeleton';

/**
 * TenantSubscriptionSkeleton
 * 1:1 Structural Mirror of Tenant/Subscription.jsx
 */
const TenantSubscriptionSkeleton = () => (
  <div className="space-y-6 animate-in fade-in duration-500">
    {/* Page Header */}
    <div>
      <Skeleton className="h-8 w-64 mb-2" />
      <Skeleton className="h-4 w-96" />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left: Current Plan Card */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-3xl p-8 space-y-6">
          <div className="flex justify-between">
            <Skeleton className="h-6 w-24 rounded-lg" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <Skeleton className="h-12 w-48" />
          <Skeleton className="h-4 w-32" />
          
          <div className="pt-8 border-t border-gray-200 dark:border-gray-700 space-y-4">
            <div className="flex justify-between"><Skeleton className="h-4 w-24" /><Skeleton className="h-4 w-32" /></div>
            <div className="flex justify-between"><Skeleton className="h-4 w-24" /><Skeleton className="h-4 w-16" /></div>
            <Skeleton className="h-2 w-full rounded-full" />
          </div>

          <div className="pt-6 border-t border-gray-200 dark:border-gray-700 space-y-2">
            <Skeleton className="h-2 w-32 mb-4" />
            {[1, 2, 3].map(i => (
              <div key={i} className="flex gap-2"><Skeleton className="h-4 w-4" /><Skeleton className="h-4 w-40" /></div>
            ))}
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 space-y-4">
          <Skeleton className="h-6 w-40" />
          <div className="h-16 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center px-4 justify-between">
            <div className="flex gap-3"><Skeleton className="h-6 w-10" /><Skeleton className="h-4 w-32" /></div>
            <Skeleton className="h-4 w-8" />
          </div>
        </div>
      </div>

      {/* Right: Plan Options */}
      <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[1, 2, 3].map(i => (
          <div key={i} className="p-7 rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 space-y-6">
            <Skeleton className="h-12 w-12 rounded-2xl" />
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-10 w-24" />
            <div className="space-y-3">
              {[1, 2, 3, 4].map(j => (
                <div key={j} className="flex gap-2"><Skeleton className="h-4 w-4 rounded-full" /><Skeleton className="h-3 w-full" /></div>
              ))}
            </div>
            <Skeleton className="h-12 w-full rounded-2xl mt-8" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default TenantSubscriptionSkeleton;
