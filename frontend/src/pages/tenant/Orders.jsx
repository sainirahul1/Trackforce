import React from 'react';
import { ShoppingBag, TrendingUp, DollarSign, ArrowUpRight, ArrowDownRight, Package, Search } from 'lucide-react';

const Orders = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Orders & Revenue</h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Track your sales performance and order fulfilment.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Filter by Order ID..." 
              className="pl-10 pr-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none w-64 transition-all"
            />
          </div>
          <button className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20">
            Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Revenue', value: '$45,230', change: '+12.5%', icon: DollarSign, color: 'indigo' },
          { label: 'Active Orders', value: '1,280', change: '+5.2%', icon: ShoppingBag, color: 'emerald' },
          { label: 'Conversion Rate', value: '3.45%', change: '-0.4%', icon: TrendingUp, color: 'blue' },
          { label: 'Avg Order Value', value: '$240', change: '+2.1%', icon: Package, color: 'purple' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden group">
            <div className={`absolute -right-4 -top-4 w-24 h-24 bg-${stat.color}-500/5 rounded-full group-hover:scale-150 transition-all duration-700`}></div>
            <div className={`w-12 h-12 rounded-2xl bg-${stat.color}-50 dark:bg-${stat.color}-900/20 flex items-center justify-center text-${stat.color}-600 mb-4`}>
              <stat.icon size={24} />
            </div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
            <div className="flex items-end justify-between mt-1">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white">{stat.value}</h2>
              <span className={`text-xs font-bold flex items-center gap-0.5 ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                {stat.change.startsWith('+') ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />} {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-50 dark:border-gray-800">
          <h3 className="font-bold text-gray-900 dark:text-white">Recent Transactions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/30 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-50 dark:border-gray-800">
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Store / Customer</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {[
                { id: '#ORD-9021', name: 'Reliance Digital', date: 'March 18, 2026', amount: '$450.00', status: 'Delivered' },
                { id: '#ORD-9022', name: 'Apple Store NYC', date: 'March 18, 2026', amount: '$1,240.00', status: 'Processing' },
                { id: '#ORD-9023', name: 'Best Buy Global', date: 'March 17, 2026', amount: '$780.00', status: 'Shipped' },
                { id: '#ORD-9024', name: 'Walmart Hub', date: 'March 17, 2026', amount: '$2,100.00', status: 'Delivered' },
              ].map((order, i) => (
                <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-900 dark:text-white text-sm">{order.id}</td>
                  <td className="px-6 py-4 font-medium text-gray-600 dark:text-gray-400 text-sm">{order.name}</td>
                  <td className="px-6 py-4 text-xs font-bold text-gray-400">{order.date}</td>
                  <td className="px-6 py-4 font-black text-gray-900 dark:text-white text-sm">{order.amount}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                      order.status === 'Delivered' ? 'bg-green-100 text-green-700 dark:bg-green-900/30' :
                      order.status === 'Processing' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30' :
                      'bg-gray-100 text-gray-700 dark:bg-gray-900/30'
                    }`}>
                      {order.status}
                    </span>
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

export default Orders;
