import React from 'react';
import TenantDashboardSkeleton from './TenantDashboardSkeleton';
import TenantVisitsSkeleton from './TenantVisitsSkeleton';
import TenantAnalyticsSkeleton from './TenantAnalyticsSkeleton';
import TenantEmployeesSkeleton from './TenantEmployeesSkeleton';

/**
 * TenantSkeletonRegistry
 * Maps Tenant portal routes to high-fidelity skeletons.
 * Destructures 'pathname' from props to fix object conversion error.
 */
const TenantSkeletonRegistry = ({ pathname }) => {
  // Ensure pathname is highly safe string
  const path = (pathname || '').toString().toLowerCase();

  if (path.includes('/tenant/dashboard')) return <TenantDashboardSkeleton />;
  if (path.includes('/tenant/visits')) return <TenantVisitsSkeleton />;
  if (path.includes('/tenant/analytics')) return <TenantAnalyticsSkeleton />;
  if (path.includes('/tenant/employees') || path.includes('/tenant/directory')) return <TenantEmployeesSkeleton />;
  
  // Default to Dashboard for unknown tenant pages
  return <TenantDashboardSkeleton />;
};

export default TenantSkeletonRegistry;
