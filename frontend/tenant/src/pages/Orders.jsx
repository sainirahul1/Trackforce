import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { ShoppingBag, TrendingUp, DollarSign, ArrowUpRight, ArrowDownRight, Package, Search, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { getOrders, getOrderStats } from '../../employee/services/orderService';

const Orders = () => {
  const { setPageLoading } = useOutletContext();
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [ordersData, statsData] = await Promise.all([
        getOrders(),
        getOrderStats()
      ]);
      setOrders(ordersData);
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
      if (setPageLoading) setPageLoading(false);
    }
  };

  const handleExportReport = () => {
    const headers = ['Order ID', 'Store', 'Employee', 'Date', 'Amount', 'Status'];
    const csvData = filteredOrders.map(order => [
      order._id,
      order.storeName,
      order.employee?.name || 'N/A',
      new Date(order.timestamp).toLocaleDateString(),
      `₹${order.totalAmount.toFixed(2)}`,
      order.status
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `orders_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredOrders = orders.filter(order =>
    order._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.storeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.employee?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  ).filter(order =>
    statusFilter === 'all' || order.status.toLowerCase() === statusFilter.toLowerCase()
  );

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getStatusStyles = (status) => {
    const s = status.toLowerCase();
    if (s === 'delivered' || s === 'completed') return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30';
    if (s === 'pending') return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30';
    if (s === 'canceled') return 'bg-rose-100 text-rose-700 dark:bg-rose-900/30';
    if (['processing', 'shipped'].includes(s)) return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30';
    return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30';
  };

  if (loading) return null; // Let the layout's skeleton handle this
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
              placeholder="Filter by Order ID or Store..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none w-64 transition-all"
            />
          </div>
          <button
            onClick={handleExportReport}
            className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20"
          >
            Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Revenue', value: stats ? `₹${stats.totalRevenue.value.toLocaleString()}` : '₹0', change: stats?.totalRevenue.change || '0%', icon: DollarSign, color: 'indigo' },
          { label: 'Active Orders', value: stats ? stats.activeOrders.value.toLocaleString() : '0', change: stats?.activeOrders.change || '0%', icon: ShoppingBag, color: 'emerald' },
          { label: 'Conversion Rate', value: stats ? stats.conversionRate.value : '0%', change: stats?.conversionRate.change || '0%', icon: TrendingUp, color: 'blue' },
          { label: 'Avg Order Value', value: stats ? `₹${stats.avgOrderValue.value}` : '₹0', change: stats?.avgOrderValue.change || '0%', icon: Package, color: 'purple' },
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
        <div className="p-6 border-b border-gray-50 dark:border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="font-bold text-gray-900 dark:text-white">Recent Transactions</h3>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            {['all', 'pending', 'processing', 'shipped', 'delivered', 'completed', 'canceled'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${statusFilter === status
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-indigo-900/20'
                  : 'bg-gray-50 text-gray-400 hover:bg-gray-100 dark:bg-gray-800/50 dark:hover:bg-gray-800'
                  }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/30 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-50 dark:border-gray-800">
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Store / Customer</th>
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {paginatedOrders.length > 0 ? paginatedOrders.map((order, i) => (
                <tr key={order._id || i} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-900 dark:text-white text-sm">#{order._id?.slice(-6) || 'N/A'}</td>
                  <td className="px-6 py-4 font-medium text-gray-600 dark:text-gray-400 text-sm">{order.storeName}</td>
                  <td className="px-6 py-4 font-medium text-gray-600 dark:text-gray-400 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600">
                        <User size={14} />
                      </div>
                      <span>{order.employee?.name || 'Unknown'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-gray-400">{new Date(order.timestamp).toLocaleDateString()}</td>
                  <td className="px-6 py-4 font-black text-gray-900 dark:text-white text-sm">₹{order.totalAmount.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${getStatusStyles(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500 font-medium">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-6 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredOrders.length)} of {filteredOrders.length}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 transition-colors"
              >
                <ChevronLeft size={18} className="text-gray-600 dark:text-gray-400" />
              </button>

              <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, i) => {
                  const page = i + 1;
                  // Show current page, first, last, and one on each side
                  if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${currentPage === page
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-indigo-900/20'
                          : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                          }`}
                      >
                        {page}
                      </button>
                    );
                  }
                  if (page === currentPage - 2 || page === currentPage + 2) {
                    return <span key={page} className="text-gray-400 px-1">...</span>;
                  }
                  return null;
                })}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 transition-colors"
              >
                <ChevronRight size={18} className="text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
