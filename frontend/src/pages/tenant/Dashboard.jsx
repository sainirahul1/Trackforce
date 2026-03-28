import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Activity, Globe, DollarSign,
  ChevronRight, ArrowUpRight, CheckCircle2, UserCheck,
  ShieldCheck, Briefcase, CreditCard,
  LayoutGrid, Settings, ExternalLink, History, Box, AlertCircle,
  TrendingUp, Clock, Plus, Filter, MoreHorizontal, Search
} from 'lucide-react';
import { 
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement 
} from 'chart.js';
import tenantService from '../../services/tenantService';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement);

const TenantDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [managers, setManagers] = useState([]);
  const [totalManagers, setTotalManagers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [totalPages, setTotalPages] = useState(0);
  const limit = 5;

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchManagers();
  }, [currentPage, searchQuery]);

  const fetchStats = async () => {
    try {
      const data = await tenantService.getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchManagers = async () => {
    try {
      const data = await tenantService.getDashboardManagers(currentPage, limit, searchQuery);
      setManagers(data.managers);
      setTotalManagers(data.total);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Failed to fetch managers:', error);
    }
  };

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const { tenantInfo, subscription, recentActions } = stats;
  const usagePercent = (subscription.usedSeats / subscription.totalSeats) * 100;

  const handleManagerClick = (manager) => {
    navigate(`/tenant/employees/${manager._id}`);
  };


  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-12">
      {/* 1. ENTERPRISE HUB HEADER (MANDATORY) */}
      <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] border-2 border-blue-500/30 p-8 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6 transition-all hover:border-blue-500/50">
        <div className="flex items-center gap-6 text-center md:text-left">
          <div className="w-16 h-16 rounded-3xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
             <Globe size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight leading-none uppercase">{tenantInfo.name}</h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-3 font-bold">
               <span className="text-xs text-gray-400 uppercase tracking-widest flex items-center gap-1">
                 <Box size={12} className="text-blue-500"/> {tenantInfo.domain}
               </span>
               <span className="text-gray-300 dark:text-gray-600 font-normal">|</span>
               <span className="text-xs text-gray-400 uppercase tracking-widest flex items-center gap-1">
                 <Settings size={12} className="text-blue-500"/> ID: {tenantInfo.tenantId}
               </span>
               <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-blue-500/20">
                 {tenantInfo.status}
               </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
           {/* Controls removed for cleaner profile grid */}
        </div>
      </div>

      {/* 4. PLAN LIMIT WARNING (REPOSITIONED BELOW HEADER) */}
      {usagePercent >= 90 && (
        <div className="bg-amber-50 dark:bg-amber-900/10 border-2 border-amber-500/30 p-6 rounded-[2rem] flex items-center gap-5 transition-transform hover:scale-[1.01]">
           <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
             <AlertCircle size={24} />
           </div>
           <div>
             <h4 className="text-sm font-black text-amber-700 dark:text-amber-400 tracking-tight leading-none uppercase">Utilization Threshold Alert</h4>
             <p className="text-[12px] font-bold text-amber-600 dark:text-amber-500/80 mt-1 leading-none tracking-tight">Your nexus plan has reached {usagePercent}% of the managed seat limit. Upgrade to maintain operational agility.</p>
           </div>
           <button className="ml-auto px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-[9px] font-black uppercase tracking-widest rounded-xl transition-shadow shadow-md">
             Expand Capacity
           </button>
        </div>
      )}

      {/* 2. & 3. SUBSCRIPTION & USAGE OVERVIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subscription Detail Card */}
        <div className="bg-white dark:bg-gray-800 rounded-[2rem] border-2 border-blue-500/20 p-6 shadow-sm transition-all hover:border-blue-500/40">
          <div className="flex items-center justify-between mb-6">
             <h2 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2 tracking-tight uppercase">
               <CreditCard size={18} className="text-blue-500"/> Subscription Summary
             </h2>
             <span className="text-[8px] font-black uppercase tracking-widest text-blue-500 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full">{tenantInfo.tier} Segment</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-1 p-3 border border-blue-500/10 bg-gray-50/30 dark:bg-gray-900/10 rounded-xl transition-all hover:border-blue-500/30">
               <p className="text-[8px] font-black text-gray-500 dark:text-gray-400/70 uppercase tracking-widest">Active Tier</p>
               <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase leading-none">{tenantInfo.plan}</h3>
             </div>
             <div className="space-y-1 p-3 border border-blue-500/10 bg-gray-50/30 dark:bg-gray-900/10 rounded-xl transition-all hover:border-blue-500/30">
               <p className="text-[8px] font-black text-gray-500 dark:text-gray-400/70 uppercase tracking-widest">Billing</p>
               <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase leading-none">{subscription.billingCycle}</h3>
             </div>
             <div className="space-y-1 p-3 border border-blue-500/10 bg-gray-50/30 dark:bg-gray-900/10 rounded-xl transition-all hover:border-blue-500/30">
               <p className="text-[8px] font-black text-gray-500 dark:text-gray-400/70 uppercase tracking-widest">Renewal</p>
               <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase leading-none">{subscription.renewalDate}</h3>
             </div>
             <div className="space-y-1 p-3 border border-amber-500/20 bg-amber-50/10 dark:bg-amber-900/5 rounded-xl text-amber-600 transition-all hover:border-amber-500/40">
               <p className="text-[8px] font-black text-gray-500 dark:text-gray-400/70 uppercase tracking-widest">Remaining</p>
               <h3 className="text-sm font-black leading-none italic">{subscription.daysLeft} Days</h3>
             </div>
          </div>
        </div>

        {/* Managed Personnel Usage Card */}
        <div className="bg-white dark:bg-gray-800 rounded-[2rem] border-2 border-blue-500/20 p-6 shadow-sm transition-all hover:border-blue-500/40">
          <div className="flex items-center justify-between mb-1.5">
             <h2 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2 tracking-tight uppercase">
               <Users size={18} className="text-blue-500"/> Employee Overview
             </h2>
             <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500 italic">Live Telemetry</span>
          </div>
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-6">Distribution: {usagePercent}%</p>
          
          
          <div className="space-y-6">
            <div className="relative h-4 bg-gray-100 dark:bg-gray-900/50 rounded-full overflow-hidden border border-gray-200 dark:border-gray-700">
               <div className="absolute inset-y-0 left-0 bg-blue-600 rounded-full transition-all duration-1000 ease-in-out" style={{ width: `${usagePercent}%` }}></div>
            </div>
            <div className="grid grid-cols-3 gap-4">
               <div className="text-center p-3 rounded-2xl bg-gray-50 dark:bg-gray-900/20 border-2 border-blue-500/20 transition-all hover:border-blue-500/40">
                 <h4 className="text-2xl font-black text-gray-900 dark:text-white leading-none tracking-tighter">{subscription.usedSeats}</h4>
                 <p className="text-[8px] font-black text-gray-500 dark:text-gray-400/80 uppercase tracking-widest mt-2 px-1">Managed</p>
               </div>
               <div className="text-center p-3 rounded-2xl bg-blue-50/30 dark:bg-blue-900/10 border-2 border-blue-600/30 transition-all hover:border-blue-600/50">
                 <h4 className="text-2xl font-black text-blue-600 leading-none tracking-tighter">{subscription.totalSeats}</h4>
                 <p className="text-[8px] font-black text-gray-500 dark:text-gray-400/80 uppercase tracking-widest mt-2 px-1">Nexus Limit</p>
               </div>
               <div className="text-center p-3 rounded-2xl bg-emerald-50/30 dark:bg-emerald-900/10 border-2 border-emerald-500/30 transition-all hover:border-emerald-500/50">
                 <h4 className="text-2xl font-black text-emerald-500 leading-none tracking-tighter">{subscription.available}</h4>
                 <p className="text-[8px] font-black text-gray-500 dark:text-gray-400/80 uppercase tracking-widest mt-2 px-1">Available</p>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* REFINED SPLIT LAYOUT (3:4 Ratio / lg:col-span-4 vs lg:col-span-8) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: MANAGER STRATEGIC COMMAND (67% Width) */}
        <div className="lg:col-span-8 space-y-5">
          <div className="flex items-center justify-between px-2 mb-1">
            <div>
              <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tighter leading-none uppercase italic underline decoration-blue-500/30 decoration-4 underline-offset-8">Manager Strategic Command</h2>
              <p className="text-[10px] font-black text-gray-500 dark:text-gray-400 tracking-widest mt-4 italic">Strategic organizational overview</p>
            </div>
            <div className="flex items-center gap-4">
               <div className="relative">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                 <input 
                    type="text"
                    placeholder="Search Nodes..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="pl-9 pr-4 py-2 bg-blue-50/50 dark:bg-blue-900/20 border-2 border-blue-500/10 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none focus:border-blue-500/30 transition-all w-48"
                 />
               </div>
               <div className="flex items-center gap-3 px-4 py-2 bg-blue-50/50 dark:bg-blue-900/20 border-2 border-blue-500/10 rounded-2xl shadow-sm group hover:border-blue-500/30 transition-all">
                  <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse shadow-[0_0_8px_rgba(37,99,235,0.4)]"></div>
                  <div className="flex flex-col">
                    <span className="text-[8px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest leading-none">Nodes</span>
                    <span className="text-lg font-black text-blue-600 tracking-tighter leading-none mt-1">{totalManagers}</span>
                  </div>
               </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 transition-all duration-500 ease-in-out min-h-[400px]">
            {managers.map((m) => (
              <div 
                key={m._id} 
                onClick={() => handleManagerClick(m)}
                className="group bg-white dark:bg-gray-800 rounded-full border-2 border-blue-500/20 p-4 pl-6 pr-8 shadow-sm transition-all hover:shadow-xl hover:border-blue-500/50 cursor-pointer flex items-center justify-between gap-6 relative overflow-hidden backdrop-blur-sm"
              >

                <div className="absolute inset-y-0 left-0 w-1.5 bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-black text-xs shadow-lg shadow-blue-500/20 group-hover:rotate-12 transition-transform flex-shrink-0">
                    {m.initial}
                  </div>
                  <div className="flex items-center gap-12 flex-1">
                    <div className="flex flex-col min-w-[200px]">
                      <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight group-hover:text-blue-600 transition-colors">{m.name}</h3>
                      <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-0.5">{m.region} Node</span>
                    </div>

                    <div className="flex items-center gap-10 border-l border-gray-100 dark:border-gray-700/50 pl-10">
                      <div className="flex items-center gap-2">
                        <span className="text-[8px] font-black text-gray-600 dark:text-gray-400 uppercase tracking-widest opacity-80">Span:</span>
                        <span className="text-sm font-black text-gray-900 dark:text-white tabular-nums underline decoration-blue-500/20">{m.employees}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[8px] font-black text-gray-600 dark:text-gray-400 uppercase tracking-widest opacity-80">Index:</span>
                        <span className="text-sm font-black text-emerald-500 italic tabular-nums underline decoration-emerald-500/20">{m.efficiency}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                   <div className="p-1 text-gray-300 dark:text-gray-600 group-hover:text-blue-500 transition-colors transform group-hover:translate-x-1">
                     <ChevronRight size={18}/>
                   </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center items-center gap-2 mt-8">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2.5 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-500 hover:border-blue-600 hover:text-blue-600 disabled:opacity-30 transition-all rounded-xl shadow-lg active:scale-95 group"
            >
              <ChevronRight size={14} className="rotate-180" />
            </button>
            
            <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-10 h-10 rounded-xl text-[10px] font-black transition-all ${currentPage === i + 1
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                      : 'bg-white dark:bg-gray-800 text-gray-400 hover:text-blue-600 border-2 border-transparent'
                    }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2.5 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-30 transition-all rounded-xl shadow-lg active:scale-95 group"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: RECENT OPERATIONS (33% Width) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] border-2 border-blue-500/30 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
               <div className="flex items-center gap-3">
                 <History size={20} className="text-blue-500" />
                 <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight uppercase">Recent Operations</h2>
               </div>
               <button className="text-gray-400 hover:text-blue-500 transition-colors"><MoreHorizontal size={18}/></button>
            </div>
            
            <div className="space-y-7">
              {recentActions.map((action, index) => (
                <div key={action._id || index} className="relative pl-7 group">
                   <div className="absolute left-0 top-1 w-2 h-2 rounded-full bg-blue-600 ring-4 ring-blue-50 dark:ring-blue-900/20 group-hover:scale-125 transition-transform shadow-[0_0_10px_rgba(37,99,235,0.4)]"></div>
                   {index !== recentActions.length - 1 && (
                     <div className="absolute left-0.75 top-3 bottom-[-1.75rem] w-[1px] bg-gray-100 dark:bg-gray-700 ml-[3.5px]"></div>
                   )}
                   <div className="space-y-1">
                      <div className="flex justify-between items-start">
                        <h4 className="text-sm font-black text-gray-900 dark:text-white tracking-tight leading-none uppercase">{action.title}</h4>
                        <span className="text-[10px] font-black text-gray-500 dark:text-gray-400 italic whitespace-nowrap ml-2">{action.time}</span>
                      </div>
                      <p className="text-xs font-bold text-gray-600 dark:text-gray-400/80 line-clamp-2">{action.desc}</p>
                      <p className="text-[9px] font-black text-blue-600 dark:text-blue-500 uppercase tracking-tighter italic">Initiated by {action.actor}</p>
                   </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-10 py-4 border-2 border-dashed border-gray-100 dark:border-gray-700 rounded-2xl text-[10px] font-black uppercase text-gray-400 hover:text-blue-600 hover:border-blue-500/40 transition-all tracking-widest">
              View Full Audit Log
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantDashboard;
