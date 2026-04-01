import React from 'react';
import {
  DashboardSkeleton,
  ListSkeleton,
  AnalyticsSkeleton,
  ProfileSkeleton,
  SettingsSkeleton
} from './SkeletonVariants';

/**
 * Maps route pathnames to high-fidelity skeleton components.
 * Supports exact matches and pattern matching for dynamic routes.
 */
const getSkeletonForPath = (pathname) => {
  const path = pathname.toLowerCase();

  // DASHBOARDS
  if (path.includes('/dashboard')) return <DashboardSkeleton />;

  // ANALYTICS
  if (path.includes('/analytics')) return <AnalyticsSkeleton />;

  // LISTS / TABLES / GRIDS
  if (
    path.includes('/visits') ||
    path.includes('/orders') ||
    path.includes('/employees') ||
    path.includes('/team') ||
    path.includes('/tasks') ||
    path.includes('/notifications') ||
    path.includes('/issues') ||
    path.includes('/inventory') ||
    path.includes('/activity')
  ) {
    return <ListSkeleton />;
  }

  // PROFILES / DETAILS (incl. Dynamic IDs)
  if (
    path.includes('/profile') ||
    path.includes('/details/') ||
    path.includes('/manager/') ||
    path.includes('/employee/')
  ) {
    // Check if it's explicitly settings within profile
    if (path.includes('/settings')) return <SettingsSkeleton />;
    return <ProfileSkeleton />;
  }

  // SETTINGS / SUBSCRIPTION
  if (path.includes('/settings') || path.includes('/subscription')) {
    return <SettingsSkeleton />;
  }

  // DEFAULT (Catch-all for layout pages)
  return <DashboardSkeleton />;
};

export default getSkeletonForPath;
