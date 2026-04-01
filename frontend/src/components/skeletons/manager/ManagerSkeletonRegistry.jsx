import React from 'react';
import ManagerAnalyticsSkeleton from './ManagerAnalyticsSkeleton';
import ManagerTeamSkeleton from './ManagerTeamSkeleton';
import ManagerTasksSkeleton from './ManagerTasksSkeleton';
import ManagerVisitsSkeleton from './ManagerVisitsSkeleton';
import ManagerActivitySkeleton from './ManagerActivitySkeleton';
import Skeleton from '../../ui/Skeleton';

/**
 * ManagerSkeletonRegistry
 * Maps Manager portal routes to high-fidelity skeletons.
 */
const ManagerSkeletonRegistry = ({ pathname }) => {
  // Normalize pathname
  const path = (pathname || '').toString().toLowerCase();

  if (path.includes('/manager/analytics')) return <ManagerAnalyticsSkeleton />;
  if (path.includes('/manager/team')) return <ManagerTeamSkeleton />;
  if (path.includes('/manager/tasks')) return <ManagerTasksSkeleton />;
  if (path.includes('/manager/activity')) return <ManagerActivitySkeleton />;
  if (path.includes('/manager/visits')) return <ManagerVisitsSkeleton />;
  
  // Fallback for unknown manager pages
  return (
    <div className="p-8 space-y-8 animate-pulse">
      <div className="flex justify-between items-center">
        <Skeleton className="h-10 w-64 rounded-2xl" />
        <Skeleton className="h-10 w-48 rounded-2xl" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => <Skeleton key={i} className="h-32 rounded-2xl" />)}
      </div>
      <Skeleton className="h-[400px] w-full rounded-2xl" />
    </div>
  );
};

export default ManagerSkeletonRegistry;
