import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin, Calendar, TrendingUp, Clock, User, ClipboardList,
  Map as MapIcon, Bell, Camera, ShoppingBag, ChevronRight, Activity,
  CheckCircle2, ArrowRight, Navigation2
} from 'lucide-react';

// =============================================================================
// STYLE TOKENS & CONSTANTS
// Shared styling strings to ensure consistency and easier maintenance.
// =============================================================================

const UI_TOKENS = {
  // Main Card Wrapper: includes base styles, dark mode adjustments, and premium hover effects
  cardBase: `
    group relative overflow-hidden transition-all duration-500 
    bg-white dark:bg-gray-900 
    border border-gray-100 dark:border-gray-800 
    shadow-sm hover:shadow-xl 
    hover:bg-gradient-to-br hover:from-white hover:to-indigo-50/50 
    dark:hover:from-gray-900 dark:hover:to-indigo-950/20
  `,
  // Inner container hover effect (lift and shadow)
  innerHover: `
    transition-all duration-500 hover:shadow-md hover:-translate-y-0.5
  `,
  // Section Title styling
  sectionTitle: "text-xl font-black text-gray-900 dark:text-white tracking-tight flex items-center",
}

// =============================================================================
// SUB-COMPONENTS
// These smaller components help keep the main Dashboard logic clean and readable.
// =============================================================================

/**
 * QuickActionItem Component
 * Renders a single icon-based action button for the top grid.
 */
const QuickActionItem = ({ action, index }) => (
  <Link
    to={action.path}
    className={`${UI_TOKENS.cardBase} flex flex-col items-center justify-center p-6 md:p-8 rounded-[2rem] hover:-translate-y-1`}
    style={{ transitionDelay: `${index * 30}ms` }}
  >
    <div className={`p-4 rounded-2xl ${action.bg} mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 ring-4 ring-transparent group-hover:ring-gray-50 dark:group-hover:ring-gray-800`}>
      <action.icon size={28} className={action.text} />
    </div>
    <span className="text-[11px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
      {action.name}
    </span>
  </Link>
);

/**
 * StatCard Component
 * Displays key metrics like visits, hours, or tasks with trend indicators.
 */
const StatCard = ({ stat }) => (
  <div className={`${UI_TOKENS.cardBase} p-6 rounded-3xl flex flex-col justify-between hover:border-indigo-100 dark:hover:border-indigo-900/50`}>
    <div className={`absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-5 group-hover:opacity-10 rounded-full group-hover:scale-150 transition-all duration-500 ease-out`} />
    <div className="relative z-10 w-full mb-3">
      <div className="flex justify-between items-start mb-4 w-full">
        <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">{stat.label}</p>
        <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-xl group-hover:bg-white dark:group-hover:bg-gray-700 transition-colors">
          <stat.icon size={18} className="text-gray-400 dark:text-gray-500 group-hover:text-indigo-500 transition-colors" />
        </div>
      </div>
      <p className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white mb-1 tracking-tight">{stat.value}</p>
    </div>
    <div className="relative z-10">
      <div className={`flex items-center text-[10px] font-bold px-2 py-1 rounded-lg inline-flex ${stat.trendUp ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'}`}>
        {stat.trendUp ? <TrendingUp size={12} className="mr-1.5" /> : <Activity size={12} className="mr-1.5" />}
        <span>{stat.trend}</span>
      </div>
    </div>
  </div>
);

/**
 * ActivityItem Component
 * Renders an entry in the Recent Activity timeline.
 */
const ActivityItem = ({ activity, isLast }) => (
  <div className="flex gap-5 relative group/item p-3 -mx-3 rounded-2xl cursor-default transition-all duration-500 hover:shadow-md hover:bg-gradient-to-br hover:from-white hover:to-indigo-50/50 dark:hover:from-gray-900/40 dark:hover:to-indigo-950/20 hover:-translate-y-0.5">
    {/* Connecting Line for Timeline */}
    {!isLast && (
      <div className="absolute left-[33px] top-[52px] bottom-[-24px] w-[2px] bg-gradient-to-b from-gray-200 to-transparent dark:from-gray-700 dark:to-transparent group-hover/item:from-indigo-200 dark:group-hover/item:from-indigo-800 transition-colors duration-500" />
    )}

    {/* Activity Icon */}
    <div className="relative">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 z-10 transition-transform duration-500 group-hover/item:scale-110 group-hover/item:rotate-3 relative shadow-lg border border-white/50 dark:border-white/5 ${
        activity.type === 'success' ? 'bg-gradient-to-br from-emerald-100 to-emerald-50 text-emerald-600 dark:from-emerald-900/40 dark:to-emerald-800/20 dark:text-emerald-400' :
        activity.type === 'info' ? 'bg-gradient-to-br from-blue-100 to-blue-50 text-blue-600 dark:from-blue-900/40 dark:to-blue-800/20 dark:text-blue-400' :
        'bg-gradient-to-br from-gray-100 to-gray-50 text-gray-600 dark:from-gray-800 dark:to-gray-900 dark:text-gray-400'
      }`}>
        {activity.type === 'success' ? <CheckCircle2 size={22} className="drop-shadow-sm" /> :
          activity.type === 'info' ? <ShoppingBag size={22} className="drop-shadow-sm" /> :
            <Activity size={22} className="drop-shadow-sm" />}
      </div>
    </div>

    {/* Activity Content */}
    <div className="flex-1 pt-1 pb-1">
      <div className="flex justify-between items-start mb-1">
        <p className="text-base font-bold text-gray-900 dark:text-white group-hover/item:text-indigo-600 dark:group-hover/item:text-indigo-400 transition-colors">
          {activity.title}
        </p>
        <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 px-2.5 py-1 rounded-lg shadow-sm whitespace-nowrap ml-3">
          {activity.time}
        </span>
      </div>
      <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 flex items-center">
        <span className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600 mr-2"></span>
        {activity.desc}
      </p>
    </div>
  </div>
);

// =============================================================================
// MAIN COMPONENT: EmployeeDashboard
// =============================================================================

const EmployeeDashboard = () => {
  // --- State Hooks ---
  const [isOnDuty, setIsOnDuty] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // --- Effects ---
  // Real-time clock update (every minute)
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // --- Utilities ---
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  // --- Mock Data ---
  const stats = [
    { label: "Today's Visits", value: '12', trend: '+2', trendUp: true, icon: MapIcon, color: 'from-blue-500 to-cyan-400' },
    { label: "Hours Active", value: isOnDuty ? '6.5h' : '0h', trend: isOnDuty ? 'Shift Active' : 'Off Duty', trendUp: isOnDuty, icon: Clock, color: 'from-emerald-500 to-teal-400' },
    { label: "Active Tasks", value: '04', trend: '2 High Priority', trendUp: false, icon: ClipboardList, color: 'from-purple-500 to-indigo-400' }
  ];

  const quickActions = [
    { name: 'Tasks', icon: ClipboardList, path: '/employee/tasks', bg: 'bg-indigo-50 dark:bg-indigo-500/10', text: 'text-indigo-600 dark:text-indigo-400' },
    { name: 'Visits', icon: MapIcon, path: '/employee/visits', bg: 'bg-emerald-50 dark:bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400' },
    { name: 'Orders', icon: ShoppingBag, path: '/employee/orders', bg: 'bg-blue-50 dark:bg-blue-500/10', text: 'text-blue-600 dark:text-blue-400' },
    { name: 'Proof', icon: Camera, path: '/employee/upload-proof', bg: 'bg-purple-50 dark:bg-purple-500/10', text: 'text-purple-600 dark:text-purple-400' },
    { name: 'Activity', icon: Activity, path: '/employee/activity', bg: 'bg-orange-50 dark:bg-orange-500/10', text: 'text-orange-600 dark:text-orange-400' },
    { name: 'Alerts', icon: Bell, path: '/employee/notifications', bg: 'bg-rose-50 dark:bg-rose-500/10', text: 'text-rose-600 dark:text-rose-400' },
  ];

  const recentActivities = [
    { title: 'Visit Completed', desc: 'Global Tech HQ', time: '10 mins ago', type: 'success' },
    { title: 'Order Placed', desc: '#ORD-7829', time: '1 hour ago', type: 'info' },
    { title: 'Started Shift', desc: 'Location verified', time: '6.5 hours ago', type: 'default' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10 px-4 md:px-0">
      
      {/* 1. Header Section: Greeting & Profile/Shift Control */}
      <header className="relative overflow-hidden rounded-[2.5rem] p-8 md:p-12 shadow-2xl bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 shadow-slate-900/40 transition-all duration-700">
        {/* Background Decorative Shapes */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl -mr-40 -mt-40 pointer-events-none transition-transform duration-1000 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
          {/* Greeting Text */}
          <div className="space-y-3">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-2">
              <Clock size={14} className="text-white/80" />
              <span className="text-sm font-semibold text-white/90 tracking-wide">
                {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
              {getGreeting()}, <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-indigo-100 drop-shadow-sm">Abhiram</span>
            </h1>
            <p className="flex items-center text-indigo-100/90 font-medium text-lg md:text-xl mt-4">
              <span className="bg-white/20 px-3 py-1 rounded-lg mr-3 text-sm font-bold backdrop-blur-sm border border-white/10 shadow-sm">#TX402</span>
              Senior Field Executive
            </p>
          </div>

          {/* Header Controls (Avatar & Shift Toggle) */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-4 w-full lg:w-auto">
            <Link
              to="/employee/profile"
              className="relative lg:right-[50px] hidden lg:flex p-5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-300 group shadow-lg"
            >
              <User className="text-white group-hover:text-blue-200 transition-colors" size={80} />
            </Link>

            <div className="w-full sm:w-auto p-4 bg-white/10 backdrop-blur-xl rounded-[2rem] border border-white/20 flex flex-col sm:flex-row items-start sm:items-center justify-between sm:justify-start gap-3 sm:gap-6 shadow-inner">
              <div className="flex items-center space-x-3">
                <div className="relative flex h-3 w-3">
                  {isOnDuty && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>}
                  <span className={`relative inline-flex rounded-full h-3 w-3 ${isOnDuty ? 'bg-green-500' : 'bg-slate-400'}`}></span>
                </div>
                <div className="flex flex-col">
                  <span className={`text-sm font-bold uppercase tracking-widest ${isOnDuty ? 'text-green-300' : 'text-slate-300'}`}>
                    {isOnDuty ? 'On Duty' : 'Off Duty'}
                  </span>
                  <span className="text-[10px] text-white/50">{isOnDuty ? 'Shift Started 8:00 AM' : 'Shift Not Started'}</span>
                </div>
              </div>
              <button
                onClick={() => setIsOnDuty(!isOnDuty)}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isOnDuty ? 'bg-green-500' : 'bg-slate-600'}`}
                role="switch"
                aria-checked={isOnDuty}
              >
                <span className="sr-only">Toggle shift</span>
                <span className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform duration-300 ease-in-out ${isOnDuty ? 'translate-x-7' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Quick Actions Grid: Accessible on mobile as a 2x3 grid, desktop 6x1 */}
      <nav className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
        {quickActions.map((action, i) => (
          <QuickActionItem key={i} action={action} index={i} />
        ))}
      </nav>

      {/* 3. Metrics Row: Combination of Stats and Daily Progress */}
      <section className="space-y-6 md:space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          
          {/* Stats Sub-grid (Left 2 Columns on Desktop) */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {stats.map((stat, i) => (
              <StatCard key={i} stat={stat} />
            ))}
          </div>

          {/* Daily Progress Card (Right Column on Desktop) */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6 rounded-3xl shadow-xl relative overflow-hidden group h-full transition-all duration-500 hover:shadow-indigo-500/10 hover:from-gray-800 hover:to-slate-900 border border-gray-100 dark:border-gray-800">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none group-hover:scale-110 transition-transform duration-700" />
            <h3 className="text-base font-black tracking-tight mb-6 relative z-10 flex items-center">
              <Activity className="mr-3 text-indigo-400" size={20} />
              Daily Progress
            </h3>
            <div className="space-y-6 relative z-10">
              {/* Completed Visits Progress */}
              <div>
                <div className="flex justify-between text-[11px] font-bold mb-2">
                  <span className="text-gray-300 uppercase tracking-wider">Visits Completed</span>
                  <span className="text-white bg-white/10 px-2 py-0.5 rounded-md backdrop-blur-sm">12/15</span>
                </div>
                <div className="h-2.5 w-full bg-gray-700/50 rounded-full overflow-hidden border border-gray-600/50">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full relative transition-all duration-1000 ease-out" style={{ width: '80%' }}>
                    <div className="absolute inset-0 bg-white/20 w-full h-full animate-pulse" />
                  </div>
                </div>
              </div>
              {/* Completed Tasks Progress */}
              <div>
                <div className="flex justify-between text-[11px] font-bold mb-2">
                  <span className="text-gray-300 uppercase tracking-wider">Tasks Done</span>
                  <span className="text-white bg-white/10 px-2 py-0.5 rounded-md backdrop-blur-sm">8/10</span>
                </div>
                <div className="h-2.5 w-full bg-gray-700/50 rounded-full overflow-hidden border border-gray-600/50">
                  <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all duration-1000 ease-out" style={{ width: '80%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Operations Row: Next Target and Activity Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-start">
          
          {/* Next Target Destination Card */}
          <div className={`${UI_TOKENS.cardBase} p-6 md:p-8 rounded-[2rem]`}>
            <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-50 dark:bg-indigo-900/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none transition-transform duration-700 group-hover:scale-110" />
            <div className="flex justify-between items-center mb-8 relative z-10">
              <h2 className={UI_TOKENS.sectionTitle}>
                <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl mr-3 text-indigo-600 dark:text-indigo-400">
                  <Navigation2 size={22} />
                </div>
                Next Target
              </h2>
              <span className="px-3 py-1 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[10px] font-black uppercase tracking-widest rounded-full animate-pulse border border-rose-100 dark:border-rose-500/20">
                High Priority
              </span>
            </div>
            {/* Target Address and Action Card */}
            <div className={`p-5 sm:p-6 bg-gray-50/80 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700/50 relative z-10 ${UI_TOKENS.innerHover} group/inner flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6`}>
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-indigo-500/30 group-hover:scale-105 group-hover:rotate-3 transition-transform duration-500">
                <MapPin size={28} className="drop-shadow-md" />
              </div>
              <div className="flex-1 w-full">
                <p className="text-lg md:text-xl font-black text-gray-900 dark:text-white mb-1">Global Tech Solutions HQ</p>
                <p className="text-gray-500 dark:text-gray-400 font-medium flex items-center text-xs sm:text-sm">
                  <MapIcon size={14} className="mr-1.5 opacity-50" />
                  Sector 4, North Zone
                </p>
                <div className="mt-5 flex flex-wrap gap-3 w-full">
                  <button className="flex-1 sm:flex-none px-6 py-3 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-md hover:bg-indigo-700 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center group/btn">
                    Directions
                    <ArrowRight size={14} className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                  <button className="flex-1 sm:flex-none px-6 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-gray-700 hover:-translate-y-0.5 transition-all duration-300 text-center">
                    Details
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity Feed Card */}
          <div className={`${UI_TOKENS.cardBase} p-6 md:p-8 rounded-[2rem] h-full`}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 dark:bg-indigo-900/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none group-hover:scale-110 transition-transform duration-700" />
            <div className="flex justify-between items-center mb-8 relative z-10">
              <h3 className={UI_TOKENS.sectionTitle}>
                <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl mr-3 text-indigo-500">
                  <Clock size={22} />
                </div>
                Recent Activity
              </h3>
              <Link to="/employee/activity" className="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center group/link transition-colors bg-indigo-50/50 dark:bg-indigo-900/20 px-3 py-1 rounded-lg">
                View All
                <ChevronRight size={14} className="ml-1 group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </div>
            {/* Timeline List */}
            <div className="space-y-6 relative z-10">
              {recentActivities.map((activity, i) => (
                <ActivityItem 
                  key={i} 
                  activity={activity} 
                  isLast={i === recentActivities.length - 1} 
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EmployeeDashboard;


