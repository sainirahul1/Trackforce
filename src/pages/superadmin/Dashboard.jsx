import React from 'react';
import { Building2, Users, MonitorSmartphone, Activity, TrendingUp, Globe, ShieldCheck, Zap } from 'lucide-react';
import DashboardCard from '../../components/DashboardCard';
import DataTable from '../../components/DataTable';
import { mockCompanies } from '../../utils/mockData';

const SuperAdminDashboard = () => {
  const stats = [
    { title: 'Total Companies', value: '124', icon: Building2, trend: 'up', trendValue: 12, color: 'text-indigo-600' },
    { title: 'Total Employees', value: '15,420', icon: Users, trend: 'up', trendValue: 8, color: 'text-blue-600' },
    { title: 'Active Sessions', value: '3,102', icon: MonitorSmartphone, color: 'text-emerald-600', trend: 'up', trendValue: 5 },
    { title: 'Platform Health', value: '99.9%', icon: Activity, color: 'text-rose-600' },
  ];

  const globalMetrics = [
    { label: 'Data Processed', value: '4.2 TB', icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Global Regions', value: '6', icon: Globe, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Security Score', value: 'A+', icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  const columns = [
    {
      header: 'Company',
      accessor: 'name',
      render: (r) => (
        <div className="flex items-center space-x-3">
          <img src={r.logo} className="w-8 h-8 rounded-lg object-cover border border-gray-100 dark:border-gray-800" />
          <span className="font-bold text-gray-900 dark:text-gray-100">{r.name}</span>
        </div>
      ),
    },
    {
      header: 'Industry',
      accessor: 'industry',
      render: (r) => (
        <span className="text-gray-600 dark:text-gray-300 font-medium">{r.industry}</span>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (r) => (
        <span className="px-2 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-wider">
          {r.status}
        </span>
      ),
    },
    {
      header: 'Usage',
      accessor: 'employees',
      render: (r) => (
        <div className="flex items-center space-x-2">
          <div className="flex-1 h-1.5 w-16 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 rounded-full" style={{ width: '70%' }} />
          </div>
          <span className="text-xs font-bold text-gray-500 dark:text-gray-400">{r.employees}</span>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Platform Intelligence</h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">Multi-tenant infrastructure &amp; global performance metrics</p>
        </div>
        <div className="hidden md:flex space-x-3">
          {globalMetrics.map((metric, i) => (
            <div key={i} className="flex items-center space-x-2 bg-white dark:bg-gray-900 px-4 py-2 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
              <metric.icon size={14} className={metric.color} />
              <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{metric.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <DashboardCard key={i} {...s} colorClass={s.color} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Platform Growth Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black text-gray-900 dark:text-white">Platform Growth</h2>
            <div className="flex space-x-2">
              <select className="bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-xs font-bold px-3 py-2 outline-none dark:text-gray-300">
                <option>New Tenants</option>
                <option>Active Users</option>
              </select>
            </div>
          </div>
          <div className="h-64 flex items-end justify-between space-x-3">
            {[30, 45, 35, 60, 50, 85, 70, 90, 65, 80, 95, 100].map((height, i) => (
              <div key={i} className="flex-1 flex flex-col items-center group">
                <div
                  className="w-full bg-indigo-50 dark:bg-indigo-900/20 group-hover:bg-indigo-500 transition-all rounded-t-lg relative"
                  style={{ height: `${height}%` }}
                />
                <span className="text-[8px] font-bold text-gray-400 dark:text-gray-500 mt-2">M{i + 1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* System Health */}
        <div className="bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 p-8 shadow-sm overflow-hidden">
          <h2 className="text-xl font-black text-gray-900 dark:text-white mb-8">System Health</h2>
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">API Gateway</span>
                <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-500">OPERATIONAL</span>
              </div>
              <div className="h-1 bg-emerald-200 dark:bg-emerald-900/30 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-full" />
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-blue-700 dark:text-blue-400">Storage Clusters</span>
                <span className="text-[10px] font-black text-blue-600 dark:text-blue-500">84% CAPACITY</span>
              </div>
              <div className="h-1 bg-blue-200 dark:bg-blue-900/30 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 w-[84%]" />
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-amber-700 dark:text-amber-400">Auth Services</span>
                <span className="text-[10px] font-black text-amber-600 dark:text-amber-500">STABLE</span>
              </div>
              <div className="h-1 bg-amber-200 dark:bg-amber-900/30 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Onboarding */}
      <div className="bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 p-8 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Recent Onboarding</h2>
          <button className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 transition-colors">View All Partners</button>
        </div>
        <DataTable columns={columns} data={mockCompanies} />
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
