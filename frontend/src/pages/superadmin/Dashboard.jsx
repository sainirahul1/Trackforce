import React, { useState, useEffect } from 'react';
import { Building2, Users, MonitorSmartphone, Activity, TrendingUp, Globe, ShieldCheck, Zap, PieChart as PieChartIcon, Download } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import DashboardCard from '../../components/DashboardCard';
import DataTable from '../../components/DataTable';
import superadminService from '../../services/superadminService';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-lg font-black text-indigo-600">{payload[0].value}</p>
        <p className="text-[10px] text-gray-400 font-medium">tenants onboarded</p>
      </div>
    );
  }
  return null;
};

const SuperAdminDashboard = () => {
  const [statsData, setStatsData] = useState(null);
  const [growthData, setGrowthData] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [stats, growth, comps] = await Promise.all([
        superadminService.getAnalyticsStats(),
        superadminService.getGrowthData(),
        superadminService.getCompanies()
      ]);
      setStatsData(stats);
      setGrowthData(growth);
      setCompanies((comps.data || []).slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Transform growth data into recharts format
  const defaultLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const defaultData = [30, 45, 35, 60, 50, 85, 70, 90, 65, 80, 95, 100];
  const chartData = (growthData?.labels || defaultLabels).map((label, i) => ({
    month: label,
    tenants: (growthData?.data || defaultData)[i] || 0,
  }));

  const pieData = [
    { name: 'Basic', value: 45, color: '#6366f1' },
    { name: 'Premium', value: 35, color: '#10b981' },
    { name: 'Enterprise', value: 20, color: '#f59e0b' },
  ];

  const stats = [
    { title: 'Total Companies', value: statsData?.totalTenants || '0', icon: Building2, trend: 'up', trendValue: 12, color: 'text-indigo-600' },
    { title: 'Platform Users', value: statsData?.totalUsers?.toLocaleString() || '0', icon: Users, trend: 'up', trendValue: 8, color: 'text-blue-600' },
    { title: 'Global Visits', value: statsData?.totalVisits?.toLocaleString() || '0', icon: MonitorSmartphone, color: 'text-emerald-600', trend: 'up', trendValue: 5 },
    { title: 'Est. Revenue', value: `$${statsData?.totalMRR?.toLocaleString() || '0'}`, icon: Activity, color: 'text-rose-600' },
  ];

  const columns = [
    {
      header: 'Company',
      accessor: 'name',
      render: (r) => (
        <div className="flex items-center space-x-3">
          <img src={r.settings?.logo || `https://ui-avatars.com/api/?name=${r.name}&background=random`} className="w-8 h-8 rounded-lg object-cover border border-gray-100 dark:border-gray-800" />
          <span className="font-bold text-gray-900 dark:text-gray-100">{r.name}</span>
        </div>
      ),
    },
    {
      header: 'Industry',
      accessor: 'industry',
      render: (r) => (
        <span className="text-gray-600 dark:text-gray-300 font-medium">{r.industry || 'Technology'}</span>
      ),
    },
    {
      header: 'Status',
      accessor: 'onboardingStatus',
      render: (r) => (
        <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
          r.onboardingStatus === 'active' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' :
          r.onboardingStatus === 'pending' ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400' :
          'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400'
        }`}>
          {r.onboardingStatus}
        </span>
      ),
    },
    {
      header: 'Usage',
      accessor: 'subscription',
      render: (r) => (
        <div className="flex items-center space-x-2">
          <div className="flex-1 h-1.5 w-16 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 rounded-full" style={{ width: '70%' }} />
          </div>
          <span className="text-xs font-bold text-gray-500 dark:text-gray-400">{r.subscription?.employeeLimit?.toLocaleString() || '1,000'}</span>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Platform Intelligence</h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">Multi-tenant infrastructure &amp; performance metrics</p>
        </div>
        <div className="hidden md:flex items-center space-x-3">
          <select className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-700 dark:text-gray-300 outline-none shadow-sm cursor-pointer appearance-none">
            <option>Today</option>
            <option>Yesterday</option>
            <option>Last Week</option>
            <option>Last 30 Days</option>
          </select>
          <button className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl transition-colors font-bold text-sm shadow-sm opacity-90 hover:opacity-100">
            <Download size={16} />
            <span>Export</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <DashboardCard key={i} {...s} colorClass={s.color} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Platform Growth Chart */}
        <div className="bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 p-8 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black text-gray-900 dark:text-white">Platform Growth</h2>
            <div className="flex space-x-2">
              <select className="bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-xs font-bold px-3 py-2 outline-none dark:text-gray-300">
                <option>New Tenants</option>
                <option>Active Users</option>
              </select>
            </div>
          </div>
          <div className="h-64 flex-grow">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTenants" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.4} vertical={false} />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#9ca3af' }} 
                  axisLine={false} 
                  tickLine={false} 
                />
                <YAxis 
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#9ca3af' }} 
                  axisLine={false} 
                  tickLine={false} 
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#6366f1', strokeWidth: 1, strokeDasharray: '4 4' }} />
                <Area
                  type="monotone"
                  dataKey="tenants"
                  stroke="#6366f1"
                  strokeWidth={3}
                  fill="url(#colorTenants)"
                  dot={{ r: 4, fill: '#6366f1', stroke: '#fff', strokeWidth: 2 }}
                  activeDot={{ r: 7, fill: '#6366f1', stroke: '#fff', strokeWidth: 3 }}
                  animationDuration={1500}
                  animationEasing="ease-in-out"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subscription Distribution */}
        <div className="bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 p-8 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
              <PieChartIcon size={20} className="text-emerald-500" />
              Subscription Distribution
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-around gap-8 py-2 flex-grow">
            <div className="w-56 h-56 xl:w-64 xl:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white dark:bg-gray-900 p-3 rounded-xl border border-gray-100 dark:border-gray-800 shadow-xl">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{payload[0].name}</p>
                            <p className="text-lg font-black text-gray-900 dark:text-white">{payload[0].value}% Share</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-4">
              {pieData.map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: item.color }}></div>
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest">{item.name} Plan</span>
                    <span className="text-xs text-gray-400 font-bold">{item.value}%</span>
                  </div>
                </div>
              ))}
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
        <DataTable columns={columns} data={companies} loading={loading} />
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
