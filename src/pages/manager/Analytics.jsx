import React from 'react';
import { 
  TrendingUp, Users, Target, Zap, 
  ArrowUpRight, ArrowDownRight, 
  BarChart3, PieChart as PieChartIcon, 
  Activity, Calendar, Filter, Share2
} from 'lucide-react';
import { Chart as ChartJS, registerables } from 'chart.js';
import { Line, Bar, Radar, Doughnut } from 'react-chartjs-2';

ChartJS.register(...registerables);

/**
 * Analytics Component
 * Deep-dive performance metrics and visual intelligence for the manager.
 */
const ManagerAnalytics = () => {
  const lineData = {
    labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
    datasets: [
      {
        label: 'Team Performance',
        data: [65, 78, 72, 90, 85, 95, 88],
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 6,
        borderWidth: 4,
      },
    ],
  };

  const radarData = {
    labels: ['Visits', 'Revenue', 'Punctuality', 'Accuracy', 'Engagement'],
    datasets: [
      {
        label: 'Current Week',
        data: [85, 70, 95, 80, 75],
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        borderColor: '#10b981',
        borderWidth: 3,
      },
      {
        label: 'Target',
        data: [100, 100, 100, 100, 100],
        backgroundColor: 'rgba(124, 58, 237, 0.05)',
        borderColor: 'rgba(124, 58, 237, 0.3)',
        borderWidth: 1,
        borderDash: [5, 5],
      }
    ],
  };

  const doughnutData = {
    labels: ['On Route', 'Stationary', 'Idle', 'Maintenance'],
    datasets: [
      {
        data: [65, 20, 10, 5],
        backgroundColor: ['#6366f1', '#10b981', '#f59e0b', '#ef4444'],
        borderWidth: 0,
        hoverOffset: 10,
      },
    ],
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Intelligence Suite</h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">Multi-dimensional performance analysis and growth forecasting</p>
        </div>
        <div className="flex items-center gap-3">
           <button className="p-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl text-gray-400 hover:text-indigo-600 transition-all">
             <Calendar size={20} />
           </button>
           <button className="p-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl text-gray-400 hover:text-indigo-600 transition-all">
             <Share2 size={20} />
           </button>
           <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black text-xs hover:bg-indigo-700 active:scale-95 transition-all shadow-xl shadow-indigo-600/20">
             <Filter size={18} />
             PRECISE FILTERS
           </button>
        </div>
      </div>

      {/* Top Level KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: 'Unit Efficiency', value: '94.2%', sub: '+3.1% vs last week', icon: Zap, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Target Completion', value: '88%', sub: 'Target: 90% (On track)', icon: Target, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Market Penetration', value: '12%', sub: '+0.5% this month', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
        ].map((kpi, i) => (
          <div key={i} className="bg-white dark:bg-gray-900 p-8 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-sm group">
            <div className={`w-14 h-14 rounded-2xl ${kpi.bg} ${kpi.color} dark:bg-opacity-10 flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform`}>
              <kpi.icon size={28} />
            </div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-1">{kpi.label}</p>
            <h3 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">{kpi.value}</h3>
            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mt-3 flex items-center gap-1">
              <ArrowUpRight size={12} />
              {kpi.sub}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Growth Chart */}
        <div className="bg-white dark:bg-gray-900 p-10 rounded-[4rem] border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none" />
           <div className="flex items-center justify-between mb-10 relative z-10">
              <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
                 <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl text-indigo-600">
                    <TrendingUp size={24} />
                 </div>
                 Growth Momentum
              </h3>
              <div className="flex gap-2">
                 <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-lg">Week</span>
                 <span className="px-3 py-1 text-gray-400 text-[10px] font-black uppercase tracking-widest hover:text-indigo-600 cursor-pointer transition-all">Month</span>
              </div>
           </div>
           
           <div className="h-72 relative z-10">
              <Line data={lineData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { display: false }, x: { grid: { display: false }, border: { display: false } } } }} />
           </div>
        </div>

        {/* Radar Capabilities */}
        <div className="bg-white dark:bg-gray-900 p-10 rounded-[4rem] border border-gray-100 dark:border-gray-800 shadow-sm group">
           <div className="flex items-center justify-between mb-10 relative z-10">
              <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
                 <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl text-emerald-600">
                    <Activity size={24} />
                 </div>
                 Capability Balance
              </h3>
              <BarChart3 size={20} className="text-gray-300" />
           </div>
           
           <div className="h-72 flex items-center justify-center">
              <Radar data={radarData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { r: { grid: { color: 'rgba(0,0,0,0.05)' }, angleLines: { display: false }, ticks: { display: false }, pointLabels: { font: { size: 10, weight: 'bold', family: 'Inter' } } } } }} />
           </div>
        </div>

        {/* Small Analytics Grid */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className="bg-white dark:bg-gray-900 p-8 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col items-center text-center">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Fleet Allocation</h4>
              <div className="w-48 h-48">
                 <Doughnut data={doughnutData} options={{ cutout: '75%', plugins: { legend: { display: false } } }} />
              </div>
              <div className="mt-6 flex flex-wrap justify-center gap-4">
                 {['Route', 'Stat', 'Idle'].map((l, i) => (
                   <div key={i} className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-gray-500">
                      <div className={`w-2 h-2 rounded-full ${i===0?'bg-indigo-500':i===1?'bg-emerald-500':'bg-amber-500'}`} />
                      {l}
                   </div>
                 ))}
              </div>
           </div>

           <div className="md:col-span-2 bg-indigo-600 p-10 rounded-[3rem] text-white flex flex-col justify-between shadow-2xl shadow-indigo-600/20 relative overflow-hidden">
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-32 -mb-32 blur-3xl" />
              <div className="relative z-10">
                 <h3 className="text-2xl font-black tracking-tight leading-tight mb-4">You're outperforming 82% of units in South Zone.</h3>
                 <p className="text-sm opacity-70 leading-relaxed font-medium">Monthly efficiency has increased by 14.5% compared to the project average. Continue optimizing route patterns for Sector 4 to hit the Q1 Milestone.</p>
              </div>
              <div className="relative z-10 flex gap-4 mt-8">
                 <button className="px-6 py-3 bg-white text-indigo-600 rounded-2xl font-black text-xs hover:scale-105 active:scale-95 transition-all">GENERATE REPORT</button>
                 <button className="px-6 py-3 bg-indigo-500 text-white rounded-2xl font-black text-xs border border-indigo-400 hover:bg-indigo-400 transition-all">VIEW CONTEXT</button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerAnalytics;
