import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Globe, 
  Download, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Layout,
  PieChart,
  Activity
} from 'lucide-react';
import Button from '../../components/Button';
import superadminService from '../../services/superadminService';

const Analytics = () => {
  const [statsData, setStatsData] = useState(null);
  const [growthData, setGrowthData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const [stats, growth] = await Promise.all([
        superadminService.getAnalyticsStats(),
        superadminService.getGrowthData()
      ]);
      setStatsData(stats);
      setGrowthData(growth);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { label: 'Total Companies', value: statsData?.totalTenants || '0', change: statsData?.growth || '+0%', isUp: true, icon: Globe, color: 'blue' },
    { label: 'Platform Users', value: statsData?.totalUsers?.toLocaleString() || '0', change: '+5.2%', isUp: true, icon: Users, color: 'indigo' },
    { label: 'Monthly Revenue', value: `$${statsData?.totalMRR?.toLocaleString() || '0'}`, change: '+15.3%', isUp: true, icon: TrendingUp, color: 'emerald' },
    { label: 'Global Visits', value: statsData?.totalVisits?.toLocaleString() || '0', change: '-2.4%', isUp: false, icon: Activity, color: 'amber' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Platform Analytics</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium">Global cross-tenant performance metrics and growth insights.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-2xl py-3 px-6 flex items-center gap-2">
            <Calendar size={18} />
            <span className="font-bold">Last 30 Days</span>
          </Button>
          <Button variant="primary" className="rounded-2xl py-3 px-6 shadow-xl shadow-indigo-100 dark:shadow-none flex items-center gap-2">
            <Download size={18} />
            <span className="font-bold">Export Report</span>
          </Button>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-gray-900 p-6 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-4 rounded-2xl bg-${stat.color}-50 dark:bg-${stat.color}-500/10 text-${stat.color}-600 dark:text-${stat.color}-400`}>
                <stat.icon size={24} />
              </div>
              <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                stat.isUp ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10' : 'text-red-600 bg-red-50 dark:bg-red-500/10'
              }`}>
                {stat.isUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {stat.change}
              </div>
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Charts Placeholder Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Growth Chart Placeholder */}
        <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden group">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
              <BarChart3 size={20} className="text-indigo-500" />
              Company Onboarding Growth
            </h3>
            <select className="bg-gray-50 dark:bg-gray-800 border-none rounded-xl px-3 py-1.5 text-xs font-bold outline-none text-gray-500">
              <option>Monthly</option>
              <option>Quarterly</option>
            </select>
          </div>
          
          <div className="h-64 flex items-end justify-between gap-4 mt-4 px-2">
            {[45, 62, 58, 75, 90, 82, 95, 110, 105, 128, 135, 142].map((height, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div 
                  className="w-full bg-gradient-to-t from-indigo-600/80 to-indigo-400 rounded-t-lg transition-all duration-700 group-hover:opacity-100 opacity-70"
                  style={{ height: `${(height / 150) * 100}%` }}
                ></div>
                <span className="text-[9px] font-bold text-gray-400 uppercase">{['J','F','M','A','M','J','J','A','S','O','N','D'][i]}</span>
              </div>
            ))}
          </div>
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <Zap size={120} className="text-indigo-500 rotate-12" />
          </div>
        </div>

        {/* Distribution Chart Placeholder */}
        <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden group">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
              <PieChart size={20} className="text-emerald-500" />
              Subscription Distribution
            </h3>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-around gap-8 py-8">
            <div className="relative w-48 h-48 rounded-full border-[16px] border-indigo-500 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-[16px] border-emerald-500 border-t-transparent border-r-transparent border-b-transparent -rotate-45 shrink-0"></div>
              <div className="absolute inset-0 rounded-full border-[16px] border-amber-500 border-t-transparent border-l-transparent border-b-transparent rotate-90 shrink-0"></div>
              <div className="text-center">
                <span className="block text-2xl font-black text-gray-900 dark:text-white">142</span>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tenants</span>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { label: 'Basic Plan', color: 'indigo', percent: '45%' },
                { label: 'Premium Plan', color: 'emerald', percent: '35%' },
                { label: 'Enterprise', color: 'amber', percent: '20%' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full bg-${item.color}-500 shadow-lg shadow-${item.color}-200 dark:shadow-none`}></div>
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest">{item.label}</span>
                    <span className="text-xs text-gray-400 font-bold">{item.percent}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Mini Table */}
      <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden group">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
            <Layout size={20} className="text-purple-500" />
            Recently Onboarded Companies
          </h3>
          <Button variant="outline" className="text-xs py-2 px-4 rounded-xl font-black uppercase tracking-widest border-gray-100 hover:border-gray-200">
            View All
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-50 dark:border-gray-800">
                <th className="py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">Organization</th>
                <th className="py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">Plan Type</th>
                <th className="py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest px-4 text-center">Executives</th>
                <th className="py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {(statsData?.recentCompanies || []).map((comp, i) => (
                <tr key={comp._id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors">
                  <td className="py-5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center font-black text-gray-400">
                        {comp.name.charAt(0)}
                      </div>
                      <span className="text-sm font-black text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors">{comp.name}</span>
                    </div>
                  </td>
                  <td className="py-5 px-4">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                      comp.subscription?.plan === 'enterprise' ? 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-100' :
                      comp.subscription?.plan === 'premium' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100' :
                      'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-100'
                    } border`}>
                      {comp.subscription?.plan}
                    </span>
                  </td>
                  <td className="py-5 px-4 text-center">
                    <span className="text-sm font-black text-gray-900 dark:text-white italic">{comp.subscription?.employeeLimit?.toLocaleString() || '1,000'}</span>
                  </td>
                  <td className="py-5 px-4">
                    <span className="text-xs font-bold text-gray-400">{new Date(comp.createdAt).toLocaleDateString()}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
