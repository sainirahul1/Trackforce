import React from 'react';
import EmployeeDashboardSkeleton from './EmployeeDashboardSkeleton';
import EmployeeTasksSkeleton from './EmployeeTasksSkeleton';
import EmployeeVisitsSkeleton from './EmployeeVisitsSkeleton';
import EmployeeOrdersSkeleton from './EmployeeOrdersSkeleton';
import EmployeeActivitySkeleton from './EmployeeActivitySkeleton';
import EmployeeProfileSkeleton from './EmployeeProfileSkeleton';
import Skeleton from '../ui/Skeleton';

/**
 * EmployeeSkeletonRegistry
 * Maps Employee Portal routes to high-fidelity structural mirrors.
 */
const EmployeeSkeletonRegistry = ({ pathname }) => {
  // Normalize pathname to handle trailing slashes
  const route = pathname.replace(/\/$/, '') || '/employee';

  switch (route) {
    case '/employee':
    case '/employee/dashboard':
      return <EmployeeDashboardSkeleton />;
    
    case '/employee/tasks':
      return <EmployeeTasksSkeleton />;
      
    case '/employee/visits':
      return <EmployeeVisitsSkeleton />;

    case '/employee/orders':
      return <EmployeeOrdersSkeleton />;

    case '/employee/activity':
      return <EmployeeActivitySkeleton />;

    case '/employee/profile':
      return <EmployeeProfileSkeleton />;

    default:
      // High-fidelity fallback for unknown employee pages
      return (
        <div className="p-8 space-y-8 animate-pulse">
          <div className="flex justify-between items-center">
            <Skeleton className="h-12 w-64 rounded-2xl" />
            <Skeleton className="h-12 w-48 rounded-2xl" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map(i => <Skeleton key={i} className="h-64 rounded-[2rem]" />)}
          </div>
          <Skeleton className="h-[400px] w-full rounded-[2.5rem]" />
        </div>
      );
  }
};

export default EmployeeSkeletonRegistry;
