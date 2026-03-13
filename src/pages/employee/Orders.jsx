import React from 'react';
import { ShoppingBag, IndianRupee, TrendingUp, History, PlusCircle, Search } from 'lucide-react';
import Button from '../../components/Button';

const EmployeeOrders = () => {
  const orders = [
    { id: 'ORD-892', store: 'Reliance Fresh', items: 12, value: '₹14,200', date: 'Today, 11:45 AM', status: 'Confirmed' },
    { id: 'ORD-891', store: 'Global Mart', items: 5, value: '₹6,800', date: 'Today, 10:15 AM', status: 'Pending' },
    { id: 'ORD-890', store: 'Daily Needs', items: 23, value: '₹32,500', date: 'Yesterday', status: 'Confirmed' },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">Order Collection</h1>
          <p className="text-gray-500 font-medium">Manage your sales orders and revenue tracking</p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl shadow-lg shadow-emerald-500/20">
          <PlusCircle size={20} className="mr-2" />
          Create New Order
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
            <IndianRupee size={24} />
          </div>
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Total Sales (Today)</p>
          <p className="text-4xl font-black text-gray-900 dark:text-white mt-2">₹21,000</p>
          <div className="mt-4 flex items-center text-xs text-emerald-600 font-bold">
            <TrendingUp size={14} className="mr-1" />
            <span>+12% from target</span>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
            <ShoppingBag size={24} />
          </div>
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Orders Count</p>
          <p className="text-4xl font-black text-gray-900 dark:text-white mt-2">24</p>
          <p className="mt-4 text-xs text-gray-400 font-bold uppercase tracking-widest">Total confirmed items: 156</p>
        </div>
        <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col justify-center">
            <h4 className="font-bold text-gray-900 dark:text-white mb-4">Target Progress</h4>
            <div className="w-full h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-[65%]" />
            </div>
            <p className="mt-4 text-sm font-bold text-gray-500">₹21,000 / ₹35,000</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between flex-wrap gap-4">
          <h3 className="text-xl font-black text-gray-900 dark:text-white">Order History</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
                type="text" 
                placeholder="Search orders..." 
                className="pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
        </div>
        <div className="p-4 overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Store</th>
                <th className="px-6 py-4">Items</th>
                <th className="px-6 py-4">Value</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">{order.id}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-600 dark:text-gray-400">{order.store}</td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-700 dark:text-gray-300">{order.items} items</td>
                  <td className="px-6 py-4 text-sm font-black text-gray-900 dark:text-white">{order.value}</td>
                  <td className="px-6 py-4 text-sm font-bold">
                    <span className={`px-3 py-1 rounded-lg text-[10px] uppercase ${
                        order.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'
                    }`}>
                        {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-medium text-gray-400">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EmployeeOrders;
