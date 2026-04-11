import React from 'react';
import DashboardLayout from './DashboardLayout';

const SuperAdminLayout = () => {
  return <DashboardLayout allowedRole="superadmin" />;
};

export default SuperAdminLayout;
