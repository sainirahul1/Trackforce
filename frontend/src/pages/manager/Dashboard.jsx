import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
   Users, MapPin, Activity, ClipboardList, TrendingUp,
   AlertCircle, CheckCircle2, ShoppingBag,
   ArrowRight, Shield, Zap, Target, Clock, Navigation2,
   ChevronRight, BarChart3, PieChart, IndianRupee
} from 'lucide-react';
import DashboardCard from '../../components/DashboardCard';
import tenantService from '../../services/tenantService';

/**
 * ManagerDashboard Component
 * Re-designed as a premium SaaS Command Center hub.
 */
const ManagerDashboard = () => {
   const [dashboardData, setDashboardData] = useState(null);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const fetchDashboardStats = async () => {
         try {
            const data = await tenantService.getManagerDashboardStats();
            setDashboardData(data);
         } catch (error) {
            console.error('Error fetching dashboard stats:', error);
         } finally {
            setLoading(false);
         }
      };

      fetchDashboardStats();
   }, []);

   const stats = [
      {
         title: 'Total Revenue',
         value: loading ? '...' : (dashboardData?.totalRevenue || '₹0'),
         icon: IndianRupee,
         color: 'text-indigo-600',
         bg: 'bg-indigo-50',
         trend: 'up',
         trendValue: 'This Month'
      },
      {
         title: 'Active Fleet',
         value: loading ? '...' : (dashboardData?.activeFleet || '0/0'),
         icon: MapPin,
         color: 'text-emerald-600',
         bg: 'bg-emerald-50',
         trend: 'up',
         trendValue: 'Active'
      },
      {
         title: 'Success Rate',
         value: loading ? '...' : (dashboardData?.successRate || '0%'),
         icon: Target,
         color: 'text-blue-600',
         bg: 'bg-blue-50',
         trend: 'up',
         trendValue: 'Metrics'
      },
   ];

   const quickActions = [
      { label: 'Live Tracking', icon: Navigation2, path: '/manager/live', color: 'bg-indigo-600', desc: 'Real-time fleet map' },
      { label: 'Mission Board', icon: ClipboardList, path: '/manager/tasks', color: 'bg-emerald-600', desc: 'Jira-style tasking' },
      { label: 'Financial Hub', icon: ShoppingBag, path: '/manager/inventory', color: 'bg-blue-600', desc: 'Revenue & orders' },
      { label: 'Visit Intelligence', icon: Activity, path: '/manager/visits', color: 'bg-purple-600', desc: 'Proof verification' },
      { label: 'Analytics', icon: BarChart3, path: '/manager/analytics', color: 'bg-rose-600', desc: 'Deep-dive metrics' },
   ];

   const mapUpdateType = (type) => {
      switch (type) {
         case 'alert': return { icon: AlertCircle, color: 'text-rose-500', bg: 'bg-rose-50' };
         case 'success': return { icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' };
         default: return { icon: Zap, color: 'text-blue-500', bg: 'bg-blue-50' };
      }
   };

   const formatTime = (isoString) => {
      if (!isoString) return 'Just now';
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' ' + date.toLocaleDateString();
   };

   const criticalUpdates = dashboardData?.criticalUpdates?.length > 0
      ? dashboardData.criticalUpdates.map(u => ({
         ...u,
         ...mapUpdateType(u.type),
         time: formatTime(u.time)
      })) : [
         loading
            ? { id: 'loading', type: 'info', message: 'Loading updates...', time: 'Please wait', icon: Zap, color: 'text-slate-500', bg: 'bg-slate-50' }
            : { id: 'empty', type: 'info', message: 'No critical updates available at the moment.', time: 'Just now', icon: CheckCircle2, color: 'text-blue-500', bg: 'bg-blue-50' }
      ];

   return (
      <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">

         {/* 1. Command Center Header */}
         <header className="relative overflow-hidden rounded-[3rem] p-10 md:p-14 shadow-2xl bg-gradient-to-br from-slate-800 via-slate-900 to-black text-white">
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] -mr-32 -mt-32 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px] -ml-32 -mb-32 pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10">
               <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full">
                     <Shield size={14} className="text-emerald-400" />
                     <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/90">SaaS Multi-Tenant Secured</span>
                  </div>
                  <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-none">
                     Management <br />
                     <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">Command Center</span>
                  </h1>
                  <p className="text-lg text-slate-400 font-medium max-w-xl leading-relaxed">
                     Orchestrating field operations with real-time geospatial intelligence and multi-layered performance metrics.
                  </p>
               </div>

               <div className="flex flex-col items-end gap-6 w-full lg:w-auto">
                  {/* <div className="grid grid-cols-2 md:grid-cols-2 gap-4 w-full sm:w-80">
                     <div className="bg-white/10 backdrop-blur-xl p-6 rounded-[2rem] border border-white/10 text-center group cursor-pointer hover:bg-white/20 transition-all">
                        <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Fleet Pulse</p>
                        <p className="text-3xl font-black text-white">{loading ? '...' : (dashboardData?.fleetActiveCount > 0 ? Math.round((dashboardData.fleetActiveCount / dashboardData.fleetTotalCount) * 100) + '%' : '0%')}</p>
                     </div>
                     <div className="bg-white/10 backdrop-blur-xl p-6 rounded-[2rem] border border-white/10 text-center group cursor-pointer hover:bg-white/20 transition-all">
                        <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Unit Load</p>
                        <p className="text-3xl font-black text-white">{loading ? '...' : (dashboardData?.successRate || '0%')}</p>
                     </div>
                  </div> */}
                  <Link
                     to="/manager/live"
                     className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-black text-sm rounded-2xl transition-all shadow-xl shadow-indigo-600/20"
                  >
                     LAUNCH LIVE TRACKER <ArrowRight size={20} />
                  </Link>
               </div>
            </div>
         </header>

         {/* 2. Core Operational Statistics */}
         <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((s, i) => (
               <div key={i} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
                  <div className="flex justify-between items-start mb-6">
                     <div className={`p-4 rounded-2xl ${s.bg} ${s.color} dark:bg-opacity-10 transition-transform group-hover:rotate-6`}>
                        <s.icon size={24} />
                     </div>
                     <div className="flex items-center gap-1 text-[10px] font-black uppercase text-emerald-600 tracking-widest bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-100 dark:border-emerald-500/20">
                        <TrendingUp size={12} /> {s.trendValue}
                     </div>
                  </div>
                  <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-1">{s.title}</p>
                  <h3 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">{s.value}</h3>

                  {/* Mini visual indicator */}
                  <div className="absolute bottom-0 right-0 w-24 h-24 bg-gray-50 dark:bg-gray-800/30 rounded-tl-full -mr-8 -mb-8 pointer-events-none" />
               </div>
            ))}
         </section>

         {/* 3. Operational Grid: Quick Actions & Log */}
         <section className="grid grid-cols-1 lg:grid-cols-3 gap-10">


            {/* Priority Monitoring Log */}
            <div className="space-y-8">
               <div className="flex items-center justify-between px-2">
                  <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">System Log</h2>
                  <Link to="/manager/activity" className="text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                     ALL ENTRIES <ChevronRight size={14} />
                  </Link>
               </div>

               <div className="bg-white dark:bg-gray-900 p-8 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-sm space-y-8">
                  {criticalUpdates.map((update) => (
                     <div key={update.id} className="flex gap-4 group/item">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border z-10 transition-all group-hover/item:scale-110 ${update.bg} ${update.color} dark:bg-opacity-10 border-transparent`}>
                           <update.icon size={20} />
                        </div>
                        <div>
                           <p className="text-sm font-black text-gray-900 dark:text-gray-100 leading-tight">{update.message}</p>
                           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1 opacity-60 flex items-center gap-1.5">
                              <Clock size={10} /> {update.time}
                           </p>
                        </div>
                     </div>
                  ))}

                  <div className="pt-6 border-t border-gray-50 dark:border-gray-800">
                     <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border border-slate-100 dark:border-slate-800">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Today's Highlight</p>
                        <p className="text-sm font-black text-slate-700 dark:text-slate-200 leading-relaxed italic">"Optimal route coverage achieved in South Zone for 3 consecutive days."</p>
                     </div>
                  </div>
               </div>
            </div>

         </section>

      </div>
   );
};

export default ManagerDashboard;
