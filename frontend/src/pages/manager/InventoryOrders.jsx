import React from 'react';
import { 
  ShoppingBag, IndianRupee, TrendingUp, TrendingDown, 
  ArrowUpRight, Package, Truck, CheckCircle2, 
  Filter, Search, Download, MoreVertical,
  BarChart3, PieChart, Clock, CreditCard,
  Zap, ArrowRight, ShieldCheck, Tag
} from 'lucide-react';
import { Chart as ChartJS, registerables } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(...registerables);

/**
 * InventoryOrders Component
 * Team revenue tracking and order collection monitoring.
 */
const InventoryOrders = () => {
  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Daily Revenue',
        data: [42000, 58000, 39000, 72000, 61000, 85000, 78000],
        backgroundColor: '#6366f1',
        borderRadius: 12,
        barThickness: 16,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { display: false },
      x: { grid: { display: false }, border: { display: false } }
    }
  };

  const recentOrders = [
    { id: 'ORD-5521', store: 'Global Tech HQ', executive: 'John Doe', amount: '₹14,500', status: 'Approved', items: 12 },
    { id: 'ORD-5522', store: 'North Star Retail', executive: 'Sarah Wilson', amount: '₹8,900', status: 'Pending', items: 5 },
    { id: 'ORD-5523', store: 'Prime Logistics', executive: 'Mike Johnson', amount: '₹22,400', status: 'Shipped', items: 18 },
    { id: 'ORD-5524', store: 'City Square Mall', executive: 'Jane Smith', amount: '₹6,200', status: 'Approved', items: 3 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Financial Hub</h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">Cross-team revenue tracking and inventory collection analysis</p>
        </div>
        <div className="flex items-center gap-3">
           <button className="flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-black text-sm hover:scale-105 active:scale-95 transition-all shadow-xl">
             <Download size={18} />
             EXPORT LEDGER
           </button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Weekly Revenue', value: '₹4,35,600', trend: '+12.5%', isUp: true, icon: IndianRupee, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Orders Collected', value: '142', trend: '+8.2%', isUp: true, icon: ShoppingBag, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Avg. Ticket Size', value: '₹3,067', trend: '-2.4%', isUp: false, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Pending Approval', value: '28', trend: 'Critical', isUp: false, icon: Clock, color: 'text-rose-600', bg: 'bg-rose-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-gray-900 p-7 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden group">
             <div className="flex justify-between items-start mb-6">
                <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} dark:bg-opacity-10 transition-transform group-hover:scale-110`}>
                  <stat.icon size={26} />
                </div>
                <div className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-widest ${stat.isUp ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {stat.isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {stat.trend}
                </div>
             </div>
             <div>
                <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                <p className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">{stat.value}</p>
             </div>
             
             {/* Decorative mini bar at bottom */}
             <div className={`absolute bottom-0 left-0 h-1 w-full opacity-20 ${stat.isUp ? 'bg-emerald-500' : 'bg-rose-500'}`} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Visualization */}
        <div className="lg:col-span-1 bg-white dark:bg-gray-900 p-8 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col">
           <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Revenue Stream</h3>
              <BarChart3 size={20} className="text-gray-300" />
           </div>
           
           <div className="flex-1 min-h-[250px] relative">
              <Bar data={chartData} options={chartOptions} />
           </div>

           <div className="mt-8 pt-6 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Expected Close</p>
                <p className="text-lg font-black text-gray-900 dark:text-white">₹8,40,000</p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl text-indigo-600 text-[10px] font-black uppercase tracking-widest">
                Analytics <ArrowUpRight size={14} />
              </div>
           </div>
        </div>

        {/* Recent Order Collection */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 p-8 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-sm">
           <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Order Collection</h3>
              <div className="flex items-center gap-3">
                 <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input 
                      type="text" 
                      placeholder="Search ID..." 
                      className="pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-[10px] outline-none w-40"
                    />
                 </div>
                 <button className="p-2 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-400 hover:text-indigo-600">
                    <Filter size={18} />
                 </button>
              </div>
           </div>

           <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-50 dark:border-gray-800">
                    <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Order Ref</th>
                    <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Executive</th>
                    <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Items</th>
                    <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Value</th>
                    <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                    <th className="pb-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                      <td className="py-5">
                         <p className="text-sm font-black text-gray-900 dark:text-white uppercase">{order.id}</p>
                         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest truncate max-w-[120px]">{order.store}</p>
                      </td>
                      <td className="py-5">
                         <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-[10px] font-bold text-indigo-600">
                              {order.executive.split(' ').map(n=>n[0]).join('')}
                            </div>
                            <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{order.executive}</span>
                         </div>
                      </td>
                      <td className="py-5 text-sm font-bold text-gray-600 dark:text-gray-400">{order.items} SKU</td>
                      <td className="py-5 text-sm font-black text-gray-900 dark:text-white">{order.amount}</td>
                      <td className="py-5">
                         <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                           order.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10' :
                           order.status === 'Shipped' ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10' :
                           'bg-orange-50 text-orange-600 dark:bg-orange-500/10'
                         }`}>
                           {order.status}
                         </span>
                      </td>
                      <td className="py-5 text-right">
                         <button className="p-1 text-gray-300 hover:text-indigo-600">
                            <MoreVertical size={16} />
                         </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
           </div>
           
           <button className="w-full mt-8 py-4 bg-gray-50 dark:bg-gray-800 rounded-2xl text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] hover:bg-gray-100 dark:hover:bg-gray-750 transition-all">
             View Full Transaction History
           </button>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800 group cursor-pointer hover:bg-white dark:hover:bg-slate-800 transition-all shadow-sm">
                 <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white dark:bg-gray-900 rounded-xl shadow-sm text-indigo-600">
                       <Zap size={20} />
                    </div>
                    <ArrowUpRight size={16} className="text-gray-300 group-hover:text-indigo-600 transition-colors" />
                 </div>
                 <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">Financial Pipeline</h4>
                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Sector 4 - FMCG Division Over-performance</p>
              </div>
              <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800 group cursor-pointer hover:bg-white dark:hover:bg-slate-800 transition-all shadow-sm">
                 <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white dark:bg-gray-900 rounded-xl shadow-sm text-emerald-600">
                       <ShieldCheck size={20} />
                    </div>
                    <ArrowUpRight size={16} className="text-gray-300 group-hover:text-emerald-600 transition-colors" />
                 </div>
                 <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">Audit Integrity</h4>
                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">99.2% Verified Collection Rate</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryOrders;
