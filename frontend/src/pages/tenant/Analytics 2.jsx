import React from 'react';
import { BarChart3, PieChart, LineChart, TrendingUp, Calendar, Download } from 'lucide-react';

const Analytics = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Analytics & Reports</h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Deep dive into performance data and visual insights.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-2 flex items-center gap-2 cursor-pointer hover:border-indigo-500 transition-all">
            <Calendar size={18} className="text-gray-400" />
            <span className="text-sm font-bold text-gray-900 dark:text-white">Last 30 Days</span>
          </div>
          <button className="p-2 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 transition-all">
            <Download size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart Placeholder */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col min-h-[400px]">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <TrendingUp size={18} className="text-indigo-600" />
              Growth Velocity
            </h3>
            <div className="flex gap-2">
              {['Visits', 'Orders', 'Revenue'].map(t => (
                <span key={t} className="px-3 py-1 bg-gray-50 dark:bg-gray-800 rounded-lg text-[10px] font-black uppercase text-gray-400 cursor-pointer hover:text-indigo-600 transition-all">{t}</span>
              ))}
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center relative">
            <div className="absolute inset-0 opacity-10 flex items-end justify-between px-4 pb-2">
              {[60, 40, 70, 90, 50, 80, 100].map((h, i) => (
                <div key={i} className="w-12 bg-indigo-600 rounded-t-xl" style={{ height: `${h}%` }}></div>
              ))}
            </div>
            <div className="z-10 text-center">
              <LineChart size={48} className="text-indigo-600/20 mx-auto mb-4" />
              <p className="font-bold text-gray-400">Interactive Data Visualization Platform</p>
            </div>
          </div>
        </div>

        {/* Breakdown Panel */}
        <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-8">
          <h3 className="font-bold text-gray-900 dark:text-white">Segment Analysis</h3>
          
          <div className="space-y-6">
            {[
              { label: 'Direct Sales', value: 65, color: 'bg-indigo-500' },
              { label: 'Field Marketing', value: 25, color: 'bg-emerald-500' },
              { label: 'Others', value: 10, color: 'bg-gray-200' },
            ].map((item, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest">
                  <span className="text-gray-400">{item.label}</span>
                  <span className="text-gray-900 dark:text-white">{item.value}%</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color}`} style={{ width: `${item.value}%` }}></div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-gray-50 dark:border-gray-800">
            <div className="flex items-center gap-4 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl">
              <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600">
                <BarChart3 size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Top Performer</p>
                <p className="text-sm font-black text-gray-900 dark:text-white">Zone 4 (East Coast)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
