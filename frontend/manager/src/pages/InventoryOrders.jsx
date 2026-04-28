import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  ShoppingBag, IndianRupee, TrendingUp, TrendingDown,
  ArrowUpRight, Package, Truck, CheckCircle2,
  Filter, Search, Download, MoreVertical,
  BarChart3, PieChart, Clock, CreditCard,
  Zap, ArrowRight, ShieldCheck, Tag, AlertCircle,
  RotateCw, ChevronLeft, ChevronRight, X, MapPin, Calendar, ExternalLink
} from 'lucide-react';
import { getSyncCachedData } from '../utils/cacheHelper';
import { Chart as ChartJS, registerables } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';
import storage from '../utils/storage';
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
  const [selectedOrder, setSelectedOrder] = useState(null);

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
      const token = storage.getToken();
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
          <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight mb-2">Order Intelligence</h1>
          <p className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.3em]">
            {loading && !hasFetched ? 'Syncing Backend Records...' : 'Cross-team revenue tracking and order collection throughput'}
          </p>
          {errorMsg && <p className="text-xs text-rose-500 font-bold mt-2 flex items-center gap-1 animate-bounce"><AlertCircle size={12} /> {errorMsg}</p>}
        </div>
        <button onClick={handleExport} disabled={loading} className="flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-black text-sm hover:scale-105 active:scale-95 transition-all shadow-xl disabled:opacity-50">
          <Download size={18} /> EXPORT LEDGER
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {loading && !hasFetched ? Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />) : [
          { id: 'revenue', label: 'Weekly Revenue', value: `₹${(stats.weeklyRevenue || 0).toLocaleString()}`, trend: stats.revenueTrend || '+0%', isUp: (stats.revenueTrend || '').startsWith('+'), icon: IndianRupee, color: 'text-indigo-600', bg: 'bg-indigo-50', desc: 'Total Sales this week' },
          { id: 'orders', label: 'Orders Collected', value: (stats.ordersCollected || 0).toString(), trend: stats.ordersTrend || '+0%', isUp: (stats.ordersTrend || '').startsWith('+'), icon: ShoppingBag, color: 'text-emerald-600', bg: 'bg-emerald-50', desc: 'Direct order captures' },
          { id: 'inventory', label: 'Avg. Ticket Size', value: `₹${(stats.avgTicketSize || 0).toLocaleString()}`, trend: stats.ticketTrend || '+0%', isUp: (stats.ticketTrend || '').startsWith('+'), icon: Package, color: 'text-blue-600', bg: 'bg-blue-50', desc: 'Per order efficiency' },
          { id: 'pending', label: 'Pending Approval', value: (stats.pendingApproval || 0).toString(), trend: stats.pendingApproval > 0 ? 'Review Needed' : 'Verified', isUp: !stats.pendingApproval, icon: ShieldCheck, color: 'text-rose-600', bg: 'bg-rose-50', desc: 'Awaiting validation' },
        ].map((stat, i) => {
          const isPending = stat.id === 'pending';
          const Component = isPending ? 'button' : 'div';
          return (
            <Component 
              key={i} 
              onClick={isPending ? () => { setSearchTerm('Pending'); document.getElementById('order-collection')?.scrollIntoView({ behavior: 'smooth' }); } : undefined} 
              className={`bg-white dark:bg-gray-900 p-8 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none relative overflow-hidden group text-left transition-all hover:shadow-2xl hover:border-indigo-100 dark:hover:border-indigo-500/20 transform hover:-translate-y-1 active:scale-[0.98] ${isPending ? 'cursor-pointer' : ''}`}
            >
               <div className="flex justify-between items-start mb-8">
                  <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} dark:bg-opacity-10 transition-transform group-hover:scale-110 shadow-sm`}><stat.icon size={26} /></div>
                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${stat.isUp ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10' : 'text-rose-600 bg-rose-50 dark:bg-rose-500/10'}`}>
                    {stat.isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {stat.trend}
                  </div>
               </div>
               <div className="relative z-10">
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1.5">{stat.label}</p>
                 <p className="text-4xl font-black text-gray-950 dark:text-white tracking-tighter">{stat.value}</p>
                 <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-2">{stat.desc}</p>
               </div>
               <div className={`absolute -right-4 -bottom-4 w-32 h-32 opacity-[0.03] group-hover:scale-125 transition-transform duration-1000`}>
                  <stat.icon size={128} />
               </div>
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
                 <thead>
                   <tr className="border-b border-gray-100 dark:border-gray-800">
                     <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Order Intelligence</th>
                     <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Field Executive</th>
                     <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Items Captured</th>
                     <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Revenue Impact</th>
                     <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Operational Status</th>
                     <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] text-right">Action</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                   {orders.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="py-24 text-center">
                        <div className="flex flex-col items-center">
                          <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800/50 rounded-full flex items-center justify-center mb-6">
                             <ShoppingBag size={40} className="text-gray-200 dark:text-gray-700" />
                          </div>
                          <p className="text-gray-400 font-black uppercase tracking-[0.3em] text-[10px]">No active orders captured</p>
                          <p className="text-[8px] font-bold text-gray-300 uppercase tracking-widest mt-2">Team field activity will appear here in real-time</p>
                        </div>
                      </td>
                    </tr>
                   ) : orders.map((order) => (
                      <tr 
                        key={order.id} 
                        onClick={() => setSelectedOrder(order)}
                        className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-all duration-300 cursor-pointer"
                      >
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-1.5 h-10 bg-indigo-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div>
                              <p className="text-[12px] font-black text-gray-950 dark:text-white uppercase tracking-wider">{order.id}</p>
                              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest truncate max-w-[150px]">{order.store}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-500/10 dark:to-transparent flex items-center justify-center text-[10px] font-black text-indigo-600 border border-indigo-100 dark:border-indigo-500/20 shadow-sm">
                              {order.executive.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <span className="text-xs font-black text-gray-900 dark:text-gray-100 block">{order.executive}</span>
                              <span className="text-[8px] font-black text-indigo-500 uppercase tracking-widest">Field Fleet</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4">
                           <div className="flex items-center gap-2">
                              <Package size={14} className="text-gray-300" />
                              <span className="text-xs font-black text-gray-700 dark:text-gray-300">{Array.isArray(order.items) ? order.items.length : order.items} <span className="text-gray-400 font-bold ml-1">SKU</span></span>
                           </div>
                        </td>
                        <td className="py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-black text-gray-950 dark:text-white">{order.amount}</span>
                            <span className="text-[8px] font-bold text-emerald-500 uppercase tracking-widest">Gross Value</span>
                          </div>
                        </td>
                        <td className="py-4">
                          <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                            order.status === 'Approved' || order.status === 'Completed' || order.status === 'Delivered'
                              ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:border-emerald-500/20 shadow-sm shadow-emerald-500/10' 
                              : order.status === 'Shipped' || order.status === 'Processing' 
                              ? 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-500/10 dark:border-blue-500/20' 
                              : 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/10 dark:border-amber-500/20 animate-pulse'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-6 text-right">
                          <button 
                            onClick={(e) => { e.stopPropagation(); setSelectedOrder(order); }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-indigo-500/20 group/btn"
                          >
                            VIEW <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                          </button>
                        </td>
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

      {/* --- ORDER DETAILS MODAL --- */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-gray-950/60 backdrop-blur-xl" onClick={() => setSelectedOrder(null)} />
          
          <div className="relative w-full max-w-3xl bg-white dark:bg-gray-950 rounded-[2.5rem] shadow-2xl border border-white/20 dark:border-gray-800 overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-500">
            {/* Modal Header */}
            <div className="p-6 pb-0 flex items-center justify-between relative z-10">
              <div className="flex items-center gap-5">
                 <div className="w-14 h-14 rounded-[1.5rem] bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-500/20">
                    <ShoppingBag size={24} />
                 </div>
                 <div>
                    <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tighter flex items-center gap-3">
                       Digital Order Ledger
                       <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg text-[8px] font-black text-gray-500 uppercase tracking-widest border border-gray-200 dark:border-gray-700">
                          #{selectedOrder.id}
                       </span>
                    </h2>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] mt-0.5">Field Intelligence Verification Protocol</p>
                 </div>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-900 flex items-center justify-center text-gray-400 hover:text-rose-500 hover:rotate-90 transition-all duration-500"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                
                {/* Left Column: Order Summary & Meta */}
                <div className="lg:col-span-4 space-y-8">
                   {/* Status Badge Block */}
                   <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-black border border-gray-100 dark:border-gray-800 shadow-sm">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-4">Operational Status</p>
                      <div className={`inline-flex items-center gap-2 px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest border ${
                        selectedOrder.status === 'Approved' || selectedOrder.status === 'Completed' || selectedOrder.status === 'Delivered'
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                          : 'bg-amber-50 text-amber-600 border-amber-100'
                      }`}>
                         <div className={`w-2 h-2 rounded-full ${selectedOrder.status === 'Completed' ? 'bg-emerald-500' : 'bg-amber-500'} animate-pulse`} />
                         {selectedOrder.status}
                      </div>
                      
                      <div className="mt-8 space-y-6">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600"><Calendar size={18} /></div>
                           <div>
                              <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Transaction Date</p>
                              <p className="text-[13px] font-black text-gray-900 dark:text-white uppercase">
                                 {selectedOrder.date && !selectedOrder.date.includes('T') 
                                    ? selectedOrder.date 
                                    : new Date(selectedOrder.timestamp || selectedOrder.createdAt || selectedOrder.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
                                 }
                              </p>
                           </div>
                        </div>
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600"><CreditCard size={18} /></div>
                           <div>
                              <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Payment Protocol</p>
                              <p className="text-[13px] font-black text-gray-900 dark:text-white uppercase">{selectedOrder.paymentMethod || 'Cash on Delivery'}</p>
                           </div>
                        </div>
                      </div>
                   </div>

                   {/* Store & Executive Info */}
                   <div className="p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 space-y-8">
                      <div>
                         <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <MapPin size={12} className="text-indigo-500" /> Target Outlet
                         </h5>
                         <p className="text-lg font-black text-gray-950 dark:text-white tracking-tight uppercase leading-tight">{selectedOrder.store}</p>
                         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Authorized Distribution Point</p>
                      </div>
                      <div className="pt-8 border-t border-gray-100 dark:border-gray-800">
                         <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <ShieldCheck size={12} className="text-emerald-500" /> Capturing Officer
                         </h5>
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-black text-sm flex items-center justify-center shadow-lg shadow-indigo-500/20">
                               {selectedOrder.executive.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                               <p className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tighter">{selectedOrder.executive}</p>
                               <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Field Operational Lead</p>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>

                {/* Right Column: Itemized Ledger */}
                <div className="lg:col-span-8 flex flex-col">
                   <div className="flex items-center justify-between mb-6">
                      <h5 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] flex items-center gap-3">
                         <Package size={14} className="text-indigo-500" /> Itemized Ledger Consumption
                      </h5>
                      <span className="px-4 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 rounded-full text-[10px] font-black text-indigo-600 uppercase tracking-widest border border-indigo-100 dark:border-indigo-500/20">
                         {Array.isArray(selectedOrder.items) ? selectedOrder.items.length : selectedOrder.items} Active SKUs
                      </span>
                   </div>

                   <div className="bg-gray-50/50 dark:bg-gray-900/50 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 overflow-hidden flex-1">
                      <table className="w-full text-left">
                         <thead className="bg-white dark:bg-gray-900">
                            <tr>
                               <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-gray-800">Product Specification</th>
                               <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-gray-800">Quantity</th>
                               <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-gray-800 text-right">Value</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {Array.isArray(selectedOrder.items) && selectedOrder.items.length > 0 ? selectedOrder.items.map((item, idx) => (
                               <tr key={idx} className="group hover:bg-white dark:hover:bg-gray-800 transition-colors">
                                  <td className="px-6 py-4">
                                     <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 group-hover:text-indigo-500 transition-colors"><Tag size={14} /></div>
                                        <div>
                                           <p className="text-[12px] font-black text-gray-900 dark:text-white uppercase tracking-tight">{item.name || `SKU Item ${idx + 1}`}</p>
                                           <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Inventory Asset</p>
                                        </div>
                                     </div>
                                  </td>
                                  <td className="px-6 py-4">
                                     <span className="px-3 py-1 bg-white dark:bg-gray-950 rounded-lg text-xs font-black text-gray-700 dark:text-gray-300 border border-gray-100 dark:border-gray-800 shadow-sm">
                                        {item.quantity || 1} Units
                                     </span>
                                  </td>
                                  <td className="px-6 py-4 text-right font-black text-sm text-gray-900 dark:text-white">
                                     ₹{(item.price || 0).toLocaleString()}
                                  </td>
                               </tr>
                            )) : (typeof selectedOrder.items === 'number' || !isNaN(selectedOrder.items)) && Number(selectedOrder.items) > 0 ? (
                               <tr className="group hover:bg-white dark:hover:bg-gray-800 transition-colors">
                                  <td className="px-8 py-5">
                                     <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 group-hover:text-indigo-500 transition-colors"><Tag size={14} /></div>
                                        <div>
                                           <p className="text-[12px] font-black text-gray-900 dark:text-white uppercase tracking-tight">Consolidated Batch</p>
                                           <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Inventory Asset</p>
                                        </div>
                                     </div>
                                  </td>
                                  <td className="px-8 py-5">
                                     <span className="px-3 py-1 bg-white dark:bg-gray-950 rounded-lg text-xs font-black text-gray-700 dark:text-gray-300 border border-gray-100 dark:border-gray-800 shadow-sm">
                                        {selectedOrder.items} Units
                                     </span>
                                  </td>
                                  <td className="px-8 py-5 text-right font-black text-sm text-gray-900 dark:text-white">
                                     ₹{Number(selectedOrder.amount.replace(/[^0-9.-]+/g,"")).toLocaleString()}
                                  </td>
                               </tr>
                            ) : (
                               <tr>
                                  <td colSpan="3" className="px-8 py-12 text-center">
                                     <div className="flex flex-col items-center">
                                        <Zap size={32} className="text-gray-100 mb-4" />
                                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Consolidated Order Metrics Only</p>
                                        <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-1">Item-level detail unavailable for legacy records</p>
                                     </div>
                                  </td>
                               </tr>
                            )}
                         </tbody>
                      </table>
                   </div>

                   {/* Total Calculation Grid */}
                   <div className="mt-6 p-6 bg-gray-950 rounded-[2rem] shadow-xl relative overflow-hidden group/total">
                      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover/total:scale-125 transition-transform duration-1000"><IndianRupee size={100} className="text-white" /></div>
                      <div className="flex items-end justify-between relative z-10">
                         <div>
                            <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em] mb-1">Total Financial Impact</p>
                            <h4 className="text-3xl font-black text-white tracking-tighter flex items-start">
                               <span className="text-lg mt-1 mr-1 opacity-60">₹</span>
                               {selectedOrder.amount.replace('₹', '')}
                            </h4>
                         </div>
                         <div className="text-right">
                            <p className="text-[8px] font-black text-emerald-400 uppercase tracking-widest mb-0.5 flex items-center justify-end gap-2">
                               <ShieldCheck size={12} /> Legally Verified
                            </p>
                            <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Authenticated Transaction</p>
                         </div>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryOrders;
