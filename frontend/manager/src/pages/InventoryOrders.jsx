import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  ShoppingBag, IndianRupee, TrendingUp, TrendingDown,
  ArrowUpRight, Package, Truck, CheckCircle2,
  Filter, Search, Download, MoreVertical,
  BarChart3, PieChart, Clock, CreditCard,
  Zap, ArrowRight, ShieldCheck, Tag, AlertCircle,
  RotateCw, ChevronLeft, ChevronRight
} from 'lucide-react';
import { getSyncCachedData } from '../utils/cacheHelper';
import { Chart as ChartJS, registerables } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';
import { getManagerStats, getRevenueChartData, getRecentOrders } from '../services/managerOrderService';
import { useDialog } from '../context/DialogContext';
import { getApiBaseUrl } from '../services/apiClient';

ChartJS.register(...registerables);



/**
 * InventoryOrders Component
 * Team revenue tracking and order collection monitoring.
 */
const InventoryOrders = () => {
  const { showAlert } = useDialog();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    weeklyRevenue: 0,
    ordersCollected: 0,
    avgTicketSize: 0,
    pendingApproval: 0,
    revenueTrend: '+0%',
    ordersTrend: '+0%',
    ticketTrend: '+0%'
  });
  const [chartDataState, setChartDataState] = useState({
    labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    datasets: [{
      label: 'Daily Revenue',
      data: [0, 0, 0, 0, 0, 0, 0],
      backgroundColor: '#6366f1',
      borderRadius: 12,
      barPercentage: 0.5,
      categoryPercentage: 0.8,
      maxBarThickness: 40,
    }]
  });
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
  const [errorMsg, setErrorMsg] = useState(null);
  const [hasFetched, setHasFetched] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const processInventoryData = (statsRes, chartRes, ordersRes) => {
    if (statsRes && statsRes.success) setStats(statsRes.data);
    if (chartRes && chartRes.success) {
      setChartDataState({
        labels: chartRes.data.labels,
        datasets: [{
          label: 'Daily Revenue',
          data: chartRes.data.data,
          backgroundColor: '#6366f1',
          borderRadius: 12,
          barPercentage: 0.5,
          categoryPercentage: 0.8,
          maxBarThickness: 40,
        }]
      });
    }
    if (ordersRes && ordersRes.success) {
      setOrders(ordersRes.data);
      setPagination({
          currentPage: ordersRes.pagination.currentPage,
          totalPages: ordersRes.pagination.totalPages
      });
    }
  };

  const fetchData = async (search = '', page = 1, isBackground = false) => {
    try {
      if (!isBackground && (!hasFetched || !search)) setLoading(true);
      if (isRefreshing) setLoading(false); 

      const [statsRes, chartRes, ordersRes] = await Promise.all([
        getManagerStats(),
        getRevenueChartData(),
        getRecentOrders(search, page)
      ]);

      processInventoryData(statsRes, chartRes, ordersRes);
      setErrorMsg(null);
    } catch (error) {
      console.error('Error fetching inventory data:', error);
      if (!isBackground) setErrorMsg(error.message || 'Failed to sync with backend');
    } finally {
      setLoading(false);
      setHasFetched(true);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    // 1. Initial Hydration from Cache (0s Loading)
    const cachedStats = getSyncCachedData('manager_stats');
    const cachedChart = getSyncCachedData('revenue_chart');
    const cachedOrders = getSyncCachedData('recent_orders__1_5'); // Default key
    
    if (cachedStats && cachedChart && cachedOrders) {
      processInventoryData(cachedStats, cachedChart, cachedOrders);
      setLoading(false);
      setHasFetched(true);
      fetchData('', 1, true); // Silent background update
    } else {
      fetchData();
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (hasFetched) fetchData(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleExport = async () => {
    try {
      const token = localStorage.getItem('token');
      const base = getApiBaseUrl();
      const response = await fetch(`${base}/api/manager/inventory-orders/export`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Export failed');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ledger_export.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      showAlert('Ledger export started.', 'Export Success', 'success');
    } catch (err) {
      showAlert('Export Error: ' + err.message, 'Export Failed', 'error');
    }
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1e293b',
        titleFont: { size: 12, weight: 'bold' },
        bodyFont: { size: 11 },
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: (context) => `Revenue: ₹${context.parsed.y.toLocaleString()}`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(226, 232, 240, 0.4)', drawBorder: false, borderDash: [4, 4] },
        ticks: { color: '#94a3b8', font: { size: 10, weight: '600' }, padding: 12, maxTicksLimit: 6,
          callback: (value) => value >= 1000 ? `₹${(value / 1000).toFixed(1)}k` : `₹${value}`
        }
      },
      x: { grid: { display: false }, ticks: { color: '#94a3b8', font: { size: 10, weight: '600' } } }
    }
  };

  const SkeletonCard = () => (
    <div className="bg-white dark:bg-gray-900 p-7 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden animate-pulse">
      <div className="flex justify-between items-start mb-6">
        <div className="p-4 rounded-2xl bg-gray-100 dark:bg-gray-800 w-12 h-12" />
        <div className="w-16 h-1 w-24 bg-gray-100 dark:bg-gray-800 rounded" />
      </div>
      <div>
        <div className="w-24 h-3 bg-gray-100 dark:bg-gray-800 rounded mb-2" />
        <div className="w-32 h-8 bg-gray-100 dark:bg-gray-800 rounded" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-black p-4 lg:p-10 font-[Inter]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight mb-2">Inventory & Orders</h1>
          <p className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.3em]">
            {loading && !hasFetched ? 'Syncing Backend Records...' : 'Cross-team revenue tracking and inventory analysis'}
          </p>
          {errorMsg && <p className="text-xs text-rose-500 font-bold mt-2 flex items-center gap-1 animate-bounce"><AlertCircle size={12} /> {errorMsg}</p>}
        </div>
        <button onClick={handleExport} disabled={loading} className="flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-black text-sm hover:scale-105 active:scale-95 transition-all shadow-xl disabled:opacity-50">
          <Download size={18} /> EXPORT LEDGER
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {loading && !hasFetched ? Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />) : [
          { id: 'revenue', label: 'Weekly Revenue', value: `₹${(stats.weeklyRevenue || 0).toLocaleString()}`, trend: stats.revenueTrend || '+0%', isUp: (stats.revenueTrend || '').startsWith('+'), icon: IndianRupee, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { id: 'orders', label: 'Orders Collected', value: (stats.ordersCollected || 0).toString(), trend: stats.ordersTrend || '+0%', isUp: (stats.ordersTrend || '').startsWith('+'), icon: ShoppingBag, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { id: 'inventory', label: 'Avg. Ticket Size', value: `₹${(stats.avgTicketSize || 0).toLocaleString()}`, trend: stats.ticketTrend || '+0%', isUp: (stats.ticketTrend || '').startsWith('+'), icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
          { id: 'pending', label: 'Pending Approval', value: (stats.pendingApproval || 0).toString(), trend: stats.pendingApproval > 0 ? 'Action Needed' : 'All Clear', isUp: !stats.pendingApproval, icon: Clock, color: 'text-rose-600', bg: 'bg-rose-50' },
        ].map((stat, i) => {
          const isPending = stat.id === 'pending';
          const Component = isPending ? 'button' : 'div';
          return (
            <Component key={i} onClick={isPending ? () => { setSearchTerm('Pending'); document.getElementById('order-collection')?.scrollIntoView({ behavior: 'smooth' }); } : undefined} className={`bg-white dark:bg-gray-900 p-7 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden group text-left transition-all ${isPending ? 'hover:shadow-xl hover:border-rose-100 transform hover:-translate-y-1 active:scale-[0.98] cursor-pointer' : ''}`}>
               <div className="flex justify-between items-start mb-6">
                  <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} dark:bg-opacity-10 ${isPending ? 'transition-transform group-hover:scale-110' : ''}`}><stat.icon size={26} /></div>
                  <div className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-widest ${stat.isUp ? 'text-emerald-600' : 'text-rose-600'}`}>{stat.isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}{stat.trend}</div>
               </div>
               <div><p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-1">{stat.label}</p><p className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">{stat.value}</p></div>
               <div className={`absolute bottom-0 left-0 h-1 w-full opacity-20 ${stat.isUp ? 'bg-emerald-500' : 'bg-rose-500'}`} />
            </Component>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-1 bg-white dark:bg-gray-900 p-8 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col h-[520px]">
          <div className="flex items-center justify-between mb-8"><h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Revenue Stream</h3><BarChart3 size={20} className="text-gray-300" /></div>
          <div className="flex-1 min-h-0">{loading && !hasFetched ? <div className="w-full h-full bg-gray-50 dark:bg-gray-800/50 rounded-2xl animate-pulse" /> : <Bar data={chartDataState} options={chartOptions} />}</div>
          <div className="mt-8 pt-6 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between">
            <div><p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Revenue Tracking</p><p className="text-lg font-black text-gray-900 dark:text-white">Active Growth</p></div>
            <button onClick={() => navigate('/manager/analytics')} className="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl text-indigo-600 text-[10px] font-black uppercase tracking-widest cursor-pointer hover:bg-indigo-100 transition-colors">Analytics <ArrowUpRight size={14} /></button>
          </div>
        </div>

        <div id="order-collection" className="lg:col-span-2 bg-white dark:bg-gray-900 p-8 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-sm scroll-mt-24 min-h-[520px] flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
               <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Order Collection</h3>
               <button 
                 onClick={() => { setIsRefreshing(true); fetchData(searchTerm, pagination.currentPage); }}
                 className={`p-1.5 bg-gray-50 dark:bg-gray-800 rounded-lg text-gray-400 hover:text-indigo-600 transition-all ${isRefreshing ? 'animate-spin text-indigo-600' : ''}`}
                 title="Refresh Data"
               >
                 <RotateCw size={16} />
               </button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input type="text" placeholder="Search ID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-[10px] outline-none w-40 focus:ring-1 ring-indigo-500" />
            </div>
          </div>
          <div className="overflow-x-auto">
            {loading && !hasFetched ? <div className="space-y-4">{Array(5).fill(0).map((_, i) => <div key={i} className="h-12 w-full bg-gray-50 dark:bg-gray-800/50 rounded-xl animate-pulse" />)}</div> : (
               <table className="w-full text-left">
                 <thead><tr className="border-b border-gray-50 dark:border-gray-800"><th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Order Ref</th><th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Executive</th><th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Items</th><th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Value</th><th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th></tr></thead>
                 <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                   {orders.length === 0 ? <tr><td colSpan="5" className="py-20 text-center"><ShoppingBag size={40} className="mx-auto text-gray-200 mb-4" /><p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No orders found</p></td></tr> : orders.map((order) => (
                      <tr key={order.id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                        <td className="py-5"><p className="text-sm font-black text-gray-900 dark:text-white uppercase">{order.id}</p><p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest truncate max-w-[120px]">{order.store}</p></td>
                        <td className="py-5"><div className="flex items-center gap-2"><div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-[10px] font-bold text-indigo-600">{order.executive.split(' ').map(n => n[0]).join('')}</div><span className="text-xs font-bold text-gray-700 dark:text-gray-300">{order.executive}</span></div></td>
                        <td className="py-5 text-sm font-bold text-gray-600 dark:text-gray-400">{order.items} SKU</td>
                        <td className="py-5 text-sm font-black text-gray-900 dark:text-white">{order.amount}</td>
                        <td className="py-5"><span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${order.status === 'Approved' || order.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10' : order.status === 'Shipped' || order.status === 'Processing' ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10' : 'bg-orange-50 text-orange-600 dark:bg-orange-500/10'}`}>{order.status}</span></td>
                      </tr>
                    ))}
                 </tbody>
               </table>
            )}
          </div>
          
          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="mt-8 pt-8 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Page {pagination.currentPage} of {pagination.totalPages}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => fetchData(searchTerm, pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1 || loading}
                  className="p-2 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-400 hover:text-indigo-600 disabled:opacity-30 disabled:hover:text-gray-400 transition-all"
                >
                  <ChevronLeft size={16} />
                </button>
                
                {[...Array(pagination.totalPages)].map((_, i) => {
                  const pageNum = i + 1;
                  // Show current page, first, last, and one around current
                  if (pageNum === 1 || pageNum === pagination.totalPages || Math.abs(pageNum - pagination.currentPage) <= 1) {
                    return (
                      <button
                        key={pageNum}
                        onClick={() => fetchData(searchTerm, pageNum)}
                        className={`w-8 h-8 rounded-xl text-[10px] font-black transition-all ${
                          pagination.currentPage === pageNum 
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none' 
                            : 'bg-gray-50 dark:bg-gray-800 text-gray-400 hover:bg-gray-100'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  }
                  if (pageNum === pagination.currentPage - 2 || pageNum === pagination.currentPage + 2) {
                    return <span key={pageNum} className="text-gray-300">...</span>;
                  }
                  return null;
                })}

                <button
                  onClick={() => fetchData(searchTerm, pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages || loading}
                  className="p-2 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-400 hover:text-indigo-600 disabled:opacity-30 disabled:hover:text-gray-400 transition-all"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InventoryOrders;
