// modification of the code
import React, { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Clock,
  AlertCircle,
  Calendar,
  MapPin,
  ChevronRight,
  Filter,
  Search,
  LayoutGrid,
  List as ListIcon,
  Map as MapIcon,
  Zap,
  MoreVertical,
  Navigation,
  Trophy,
  Megaphone,
  CreditCard,
  Wifi,
  WifiOff,
  Play,
  Pause,
  Power,
  ChevronUp,
  X,
  Send,
  Camera,
  ShoppingBag,
  FileText,
  Bell,
  Settings,
  User,
  HelpCircle,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon
} from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import Button from '../../components/Button';

// --- Sub-components (Consolidated & Styled) ---

const WorkStatusPanel = ({ status, onStatusChange }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'Active': return 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950 shadow-[0_0_20px_rgba(16,185,129,0.1)]';
      case 'Paused': return 'text-orange-500 bg-orange-50 dark:bg-orange-950';
      default: return 'text-gray-400 bg-gray-50 dark:bg-gray-900/50';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-8 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-8">
      <div className="flex items-center gap-8">
        <div className={`w-20 h-20 rounded-[2.5rem] flex items-center justify-center transition-all duration-500 shadow-inner ${getStatusColor()}`}>
          <MapPin size={32} className={status === 'Active' ? 'animate-bounce' : ''} />
        </div>
        <div>
          <div className="flex items-center gap-3">
            <span className={`w-3 h-3 rounded-full ${status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-gray-300'}`} />
            <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">
              {status} Mode
            </h2>
          </div>
          <p className="text-gray-400 text-sm font-bold mt-1">
            {status === 'Active' ? 'Live GPS Tracking Active' : 'Location Tracking Paused'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 w-full lg:w-auto">
        {status === 'Offline' ? (
          <button
            onClick={() => onStatusChange('Active')}
            className="flex-1 lg:flex-none flex items-center justify-center gap-3 px-10 py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-indigo-200 dark:shadow-none"
          >
            <Play size={18} fill="currentColor" />
            Start Day
          </button>
        ) : (
          <>
            <button
              onClick={() => onStatusChange(status === 'Active' ? 'Paused' : 'Active')}
              className={`flex-1 lg:flex-none flex items-center justify-center gap-3 px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest transition-all ${status === 'Active'
                ? 'bg-orange-50 text-orange-600 hover:bg-orange-100 dark:bg-orange-950/30'
                : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-950/30'
                }`}
            >
              {status === 'Active' ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
              {status === 'Active' ? 'Pause' : 'Resume'}
            </button>
            <button
              onClick={() => onStatusChange('Offline')}
              className="flex-1 lg:flex-none flex items-center justify-center gap-3 px-10 py-5 bg-gray-900 text-white dark:bg-gray-800 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-black transition-all"
            >
              <Power size={18} />
              End Day
            </button>
          </>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, trend, trendType, color, bg, sparklinePath }) => {
  return (
    <div className="group relative bg-white dark:bg-gray-900 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm transition-all hover:shadow-2xl hover:-translate-y-1 overflow-hidden cursor-pointer">
      {/* Historical Data Hover Reveal */}
      <div className="absolute inset-x-0 bottom-0 bg-indigo-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-20 p-5 flex flex-col justify-end text-white h-full">
        <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1 leading-none">Contextual Insight</p>
        <p className="text-xl font-black tracking-tight mb-1">
          {trendType === 'up' ? 'Ahead of Schedule' : 'Slightly Behind'}
        </p>
        <p className="text-[10px] font-bold opacity-60 leading-tight">
          Performing at {trendType === 'up' ? '115%' : '85%'} of previous shift average.
        </p>
      </div>

      <div className="relative z-10 flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${bg} ${color} transition-transform group-hover:scale-110`}>
          <Icon size={18} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black transition-all group-hover:bg-white/10 ${trendType === 'up' ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40' : 'text-red-600 bg-red-50 dark:bg-red-950/40'
            }`}>
            {trendType === 'up' ? <TrendingUpIcon size={10} /> : <TrendingDownIcon size={10} />}
            {trend}
          </div>
        )}
      </div>

      <div className="relative z-10">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.1em] leading-none mb-1.5">{label}</p>
        <p className="text-3xl font-black text-gray-900 dark:text-white tabular-nums tracking-tighter leading-none">{value}</p>
      </div>

      {/* Mini Dynamic Sparkline Overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-12 opacity-10 pointer-events-none group-hover:opacity-20 transition-all duration-700">
        <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
          <path
            d={sparklinePath || "M0 35 Q 25 30, 50 35 T 100 25 V 40 H 0 Z"}
            fill="currentColor"
            className={color.replace('text', 'fill')}
          />
        </svg>
      </div>
    </div>
  );
};

const PerformanceStatsOverview = () => {
  const stats = [
    {
      label: 'Visits Completed',
      value: '08',
      trend: '+15%',
      trendType: 'up',
      color: 'text-blue-500',
      bg: 'bg-blue-50 dark:bg-blue-950/30',
      icon: MapPin,
      sparklinePath: "M0 30 Q 20 15, 40 25 T 80 10 T 100 20 V 40 H 0 Z"
    },
    {
      label: 'Distance Covered',
      value: '42 km',
      trend: '+8%',
      trendType: 'up',
      color: 'text-indigo-500',
      bg: 'bg-indigo-50 dark:bg-indigo-950/30',
      icon: Zap,
      sparklinePath: "M0 25 Q 15 35, 30 20 T 60 25 T 100 15 V 40 H 0 Z"
    },
    {
      label: 'Orders Processed',
      value: '05',
      trend: '+2%',
      trendType: 'up',
      color: 'text-pink-500',
      bg: 'bg-pink-50 dark:bg-pink-950/30',
      icon: ShoppingBag,
      sparklinePath: "M0 35 Q 25 30, 50 35 T 100 25 V 40 H 0 Z"
    },
    {
      label: 'Daily Revenue',
      value: '₹42K',
      trend: '+12%',
      trendType: 'up',
      color: 'text-amber-500',
      bg: 'bg-amber-50 dark:bg-amber-950/30',
      icon: TrendingUpIcon,
      sparklinePath: "M0 35 Q 30 20, 60 30 T 100 10 V 40 H 0 Z"
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, i) => (
        <StatCard key={i} {...stat} />
      ))}
    </div>
  );
};

const ProgressCircle = ({ label, current, target, unit = '', color }) => {
  const percentage = Math.min(Math.round((current / target) * 100), 100);
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center text-center group p-2 rounded-xl transition-all hover:bg-gray-50 dark:hover:bg-gray-800/50">
      <div className="relative mb-2 transform transition-transform group-hover:scale-110">
        <svg className="w-12 h-12 -rotate-90 transform">
          <circle
            cx="24"
            cy="24"
            r={radius}
            stroke="currentColor"
            strokeWidth="5"
            fill="transparent"
            className="text-gray-100 dark:text-gray-800"
          />
          <circle
            cx="24"
            cy="24"
            r={radius}
            stroke="currentColor"
            strokeWidth="5"
            fill="transparent"
            strokeDasharray={circumference}
            style={{ strokeDashoffset, transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
            strokeLinecap="round"
            className={`${color}`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[10px] font-black text-gray-900 dark:text-white leading-none">{percentage}%</span>
        </div>
      </div>
      <p className="text-[9px] font-black text-gray-900 dark:text-white uppercase tracking-widest leading-none mb-1">{label}</p>
      <p className="text-[8px] font-bold text-gray-400 tabular-nums">{current}{unit} / {target}{unit}</p>
    </div>
  );
};

const DailyTargetProgress = () => {
  return (
    <div className="bg-white dark:bg-gray-900 p-4 rounded-[1.5rem] border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden h-full group">
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div>
          <h3 className="text-[10px] font-black text-gray-900 dark:text-white tracking-widest uppercase">Performance Goals</h3>
          <p className="text-[8px] font-bold text-gray-400 mt-0.5 uppercase tracking-tighter">Due <span className="text-indigo-600">05:40 PM</span></p>
        </div>
        <div className="p-1.5 bg-amber-50 dark:bg-amber-950/30 rounded-lg">
          <Trophy size={14} className="text-amber-500" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-1 mb-2 relative z-10">
        <ProgressCircle label="Visits" current={8} target={12} color="text-indigo-600" />
        <ProgressCircle label="Orders" current={5} target={8} color="text-pink-600" />
        <ProgressCircle label="Revenue" current={42} target={60} unit="K" color="text-amber-600" />
      </div>



      {/* Background Accent */}
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-amber-500/10 transition-all duration-700" />
    </div>
  );
};





// --- Main Component ---

const EmployeeTasks = () => {
  const [view, setView] = useState('grid');
  const [activeTab, setActiveTab] = useState('hub');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [sortBy, setSortBy] = useState('nearest');
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const context = useOutletContext() || {};
  const { workStatus = 'Offline', setWorkStatus = () => { } } = context;
  const [isOnline, setIsOnline] = useState(true);

  // Mock User Data
  const user = { name: 'Abhiram', role: 'Senior Field Executive' };

  const handleSetView = (newView) => {
    setView(newView);
    if (newView === 'map') {
      setActiveTab('map');
    } else {
      setActiveTab('hub');
    }
  };

  const tasks = [
    {
      id: 1,
      title: 'Store Inventory Audit',
      store: 'Big Bazaar Central',
      address: 'MG Road, Bengaluru',
      distance: '1.2 km',
      distanceVal: 1.2,
      eta: '20 mins',
      priority: 'high',
      status: 'pending',
      dueDate: 'Today, 05:00 PM',
      type: 'Audit',
      incentive: '₹250',
      incentiveVal: 250,
      difficulty: 'Medium',
      coords: { x: 45, y: 30 }
    },
    {
      id: 2,
      title: 'Merchandise Display',
      store: 'Reliance Fresh',
      address: 'Indiranagar, Bengaluru',
      distance: '3.4 km',
      distanceVal: 3.4,
      eta: '25 mins',
      priority: 'medium',
      status: 'in-progress',
      dueDate: 'Today, 07:00 PM',
      type: 'Retail',
      incentive: '₹150',
      incentiveVal: 150,
      difficulty: 'Hard',
      coords: { x: 70, y: 50 }
    },
    {
      id: 3,
      title: 'Payment Collection',
      store: 'More Megamart',
      address: 'Koramangala, Bengaluru',
      distance: '0.8 km',
      distanceVal: 0.8,
      eta: '10 mins',
      priority: 'low',
      status: 'delayed',
      dueDate: 'Yesterday',
      type: 'Finance',
      incentive: '₹100',
      incentiveVal: 100,
      difficulty: 'Easy',
      coords: { x: 30, y: 80 }
    },
    {
      id: 4,
      title: 'Feedback Survey',
      store: 'Spar Hyper',
      address: 'Bannerghatta, Bengaluru',
      distance: '5.6 km',
      distanceVal: 5.6,
      eta: '45 mins',
      priority: 'medium',
      status: 'pending',
      dueDate: 'Today, 10:00 AM',
      type: 'Survey',
      incentive: '₹50',
      incentiveVal: 50,
      difficulty: 'Easy',
      coords: { x: 20, y: 40 }
    }
  ];

  const filteredTasks = tasks
    .filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.store.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
      return matchesSearch && matchesPriority;
    })
    .sort((a, b) => {
      if (sortBy === 'nearest') return a.distanceVal - b.distanceVal;
      if (sortBy === 'highest_pay') return b.incentiveVal - a.incentiveVal;
      if (sortBy === 'priority') {
        const pMap = { high: 3, medium: 2, low: 1 };
        return pMap[b.priority] - pMap[a.priority];
      }
      return 0;
    });

  const nearbyStores = [
    { name: 'Spar Hypermarket', distance: '1.2 km', category: 'Retail' },
    { name: 'Reliance Digital', distance: '2.5 km', category: 'Electronics' },
    { name: 'More Megamart', distance: '0.8 km', category: 'Grocery' }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-50 text-red-600 border-red-100 dark:bg-red-950/30';
      case 'medium': return 'bg-orange-50 text-orange-600 border-orange-100 dark:bg-orange-950/30';
      case 'low': return 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/30';
      default: return 'bg-gray-50 text-gray-500 border-gray-100 dark:bg-gray-800/30';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="text-emerald-500" size={14} />;
      case 'in-progress': return <Clock className="text-orange-500 animate-pulse" size={14} />;
      case 'follow-up': return <AlertCircle className="text-purple-500" size={14} />;
      case 'delayed': return <AlertCircle className="text-red-500" size={14} />;
      default: return <Circle className="text-gray-300" size={14} />;
    }
  };

  const getCategoryIcon = (type) => {
    switch (type) {
      case 'Audit': return <FileText size={14} />;
      case 'Retail': return <ShoppingBag size={14} />;
      case 'Finance': return <CreditCard size={14} />;
      default: return <Zap size={14} />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-40 px-4 md:px-0">
      <PerformanceStatsOverview />
      <style>{`
        @keyframes dash {
          to { stroke-dashoffset: -20; }
        }
        @keyframes pulse-soft {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.8; }
        }
        .animate-dash {
          stroke-dasharray: 10;
          animation: dash 5s linear infinite;
        }
        .animate-pulse-soft {
          animation: pulse-soft 3s ease-in-out infinite;
        }
      `}</style>

      {/* Top Row: Dashboard & Goals Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Compressed Operations Header Hub */}
        <div className="lg:col-span-8 relative group">
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl p-4 md:p-5 rounded-[1.5rem] border border-white/20 dark:border-gray-800/50 shadow-[0_8px_32px_rgba(0,0,0,0.05)] flex flex-col justify-center gap-4 relative overflow-hidden h-full">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[9px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em]">Operations Center</span>
                  <span className="w-1 h-1 rounded-full bg-gray-300" />
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tighter leading-tight">
                  Good Morning, {user.name}
                </h1>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center gap-2 px-2.5 py-1 bg-gray-50 dark:bg-gray-800 rounded-full border border-gray-100 dark:border-gray-700">
                    <MapPin size={10} className="text-indigo-500" />
                    <span className="text-[9px] font-black uppercase text-gray-600 dark:text-gray-400">Bengaluru</span>
                  </div>
                  <div className={`flex items-center gap-2 px-2.5 py-1 rounded-full border ${isOnline ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-red-50 border-red-100 text-red-600'}`}>
                    <div className={`w-1 h-1 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                    <span className="text-[9px] font-black uppercase tracking-widest">{isOnline ? 'Live' : 'Offline'}</span>
                  </div>
                </div>
              </div>

              <div className="h-10 w-px bg-gray-100 dark:bg-gray-800 hidden md:block" />

              {/* Attendance Quick Action */}
              <div className="flex items-center gap-4">
                {workStatus === 'Offline' ? (
                  <button
                    onClick={() => setWorkStatus('Active')}
                    className="group/btn relative flex items-center gap-3 px-6 py-3.5 bg-indigo-600 text-white rounded-[1rem] font-black text-[10px] uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-xl shadow-indigo-100 dark:shadow-none overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                    <Play size={10} fill="currentColor" />
                    Start Day
                  </button>
                ) : (
                  <div className="flex items-center bg-gray-50/50 dark:bg-gray-800/50 p-1.5 rounded-xl border border-gray-100 dark:border-gray-700">
                    <div className="px-3 border-r border-gray-200 dark:border-gray-700 mr-2">
                      <p className="text-[7px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Shift</p>
                      <p className="text-xs font-black text-gray-900 dark:text-white tabular-nums leading-none">04:22:15</p>
                    </div>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => setWorkStatus(workStatus === 'Active' ? 'Paused' : 'Active')}
                        className={`p-2 rounded-lg transition-all ${workStatus === 'Active' ? 'bg-orange-100 text-orange-600' : 'bg-emerald-100 text-emerald-600'}`}
                      >
                        {workStatus === 'Active' ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
                      </button>
                      <button
                        onClick={() => setWorkStatus('Offline')}
                        className="p-2 bg-gray-900 text-white rounded-lg hover:bg-black transition-all"
                      >
                        <Power size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Decorative Accents */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-[80px] pointer-events-none group-hover:bg-indigo-600/10 transition-all duration-1000" />
          </div>
        </div>

        {/* Performance Goals Integrated Beside */}
        <div className="lg:col-span-4 h-full">
          <DailyTargetProgress />
        </div>
      </div>

      <div className="space-y-10">
        {/* Tab Navigation Switcher */}
        <div className="flex bg-gray-50 dark:bg-gray-900/50 p-2 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-inner w-full">
          <button
            onClick={() => setActiveTab('hub')}
            className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'hub'
              ? 'bg-white dark:bg-gray-800 text-indigo-600 shadow-xl'
              : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
              }`}
          >
            <LayoutGrid size={18} />
            Assignment Hub
          </button>
          <button
            onClick={() => setActiveTab('map')}
            className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'map'
              ? 'bg-white dark:bg-gray-800 text-indigo-600 shadow-xl'
              : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
              }`}
          >
            <MapIcon size={18} />
            Live Route Map
          </button>
        </div>

        {activeTab === 'map' ? (
          /* Map View - Interactive Route */
          <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-6 md:p-10 border border-gray-100 dark:border-gray-800 shadow-sm group animate-in slide-in-from-left-4 duration-500 overflow-hidden relative">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 relative z-10">
              <div>
                <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter uppercase">Live Route Map</h2>
                <p className="text-gray-400 text-sm font-bold mt-1 tracking-tight">
                  Optimized logistics path for <span className="text-indigo-600">12.4 km</span> travel
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-100 dark:border-emerald-800/50">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  GPS Active
                </div>
                <button className="flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-indigo-200 dark:shadow-none">
                  <Navigation size={18} className="animate-pulse" />
                  Optimize Route
                </button>
              </div>
            </div>

            <div className="relative h-[550px] bg-gray-50 dark:bg-gray-950 rounded-[3rem] border border-gray-200 dark:border-gray-800 overflow-hidden shadow-2xl">
              {/* SVG Route Visualization */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40" preserveAspectRatio="none">
                <path
                  d="M 30 80 Q 30 55, 45 30 T 70 50"
                  stroke="url(#route-gradient)"
                  strokeWidth="4"
                  fill="none"
                  className="animate-dash"
                />
                <defs>
                  <linearGradient id="route-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6366F1" />
                    <stop offset="100%" stopColor="#EC4899" />
                  </linearGradient>
                </defs>
              </svg>

              <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#6366F1 1.5px, transparent 1.5px)', backgroundSize: '40px 40px' }} />

              {tasks.map((task) => (
                <div key={task.id} className="absolute transition-all hover:scale-110 cursor-pointer z-10 group/marker" style={{ left: `${task.coords.x}%`, top: `${task.coords.y}%` }}>
                  <div className="relative">
                    {/* Ripple Effect */}
                    <div className={`absolute inset-0 scale-[2.5] opacity-20 animate-ping rounded-full ${task.priority === 'high' ? 'bg-red-500' : 'bg-indigo-500'
                      }`} />

                    <div className={`p-3 rounded-2xl shadow-2xl ring-4 ring-white dark:ring-gray-900 ${getPriorityColor(task.priority)} flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 transition-all group-hover/marker:shadow-indigo-200 group-hover/marker:-translate-y-2/3`}>
                      <MapPin size={24} className="fill-current" />

                      {/* Rich Tooltip */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 opacity-0 group-hover/marker:opacity-100 transition-all pointer-events-none p-4 bg-white dark:bg-gray-900 rounded-[1.5rem] shadow-2xl border border-gray-100 dark:border-gray-700 min-w-[200px]">
                        <p className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">{task.type} • {task.distance}</p>
                        <h4 className="text-xs font-black text-gray-900 dark:text-white mt-1 leading-tight">{task.store}</h4>
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50 dark:border-gray-800">
                          <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${getPriorityColor(task.priority)}`}>{task.priority}</span>
                          <span className="text-[10px] font-black text-emerald-600">{task.incentive}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Floating Map Intel */}
              <div className="absolute top-8 right-8 bg-white/90 dark:bg-gray-900/90 backdrop-blur-3xl p-5 rounded-[2rem] border border-white/20 shadow-2xl flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-600">
                    <TrendingUpIcon size={16} />
                  </div>
                  <div>
                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Efficiency</p>
                    <p className="text-sm font-black text-gray-900 dark:text-white leading-none">94% Optimal</p>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-8 left-8 bg-white/90 dark:bg-gray-900/90 backdrop-blur-3xl p-5 rounded-[2rem] border border-white/20 shadow-2xl flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg">
                    <Navigation size={20} />
                  </div>
                  <div>
                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Next Best Step</p>
                    <p className="text-xs font-black text-gray-900 dark:text-white leading-none">Head to {tasks[0].store}</p>
                  </div>
                </div>
                <div className="w-px h-10 bg-gray-200 dark:bg-gray-700" />
                <div>
                  <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Travel Time</p>
                  <p className="text-xs font-black text-emerald-600 leading-none">~12 mins</p>
                </div>
              </div>
            </div>

            {/* Decorative Background Glows */}
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none" />
          </div>
        ) : (
          /* Task Hub Grid - Ultra-Compact High-Density */
          <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-6 md:p-8 border border-gray-100 dark:border-gray-800 shadow-sm space-y-8 animate-in slide-in-from-right-4 duration-500">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div>
                <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-widest uppercase">Assignment Hub</h2>
                <p className="text-[9px] font-bold text-gray-400 mt-0.5 uppercase tracking-tighter">Queue filtered by <span className="text-indigo-600">{sortBy.replace('_', ' ')}</span></p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="relative group/search">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within/search:text-indigo-600 transition-colors" size={16} />
                  <input
                    type="text"
                    placeholder="Search tasks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-xl text-[10px] font-bold outline-none border border-transparent focus:border-indigo-100 dark:focus:border-indigo-900/30 w-full md:w-48 lg:w-64 transition-all"
                  />
                </div>

                <div className="flex bg-gray-50 dark:bg-gray-800 p-1 rounded-xl border border-gray-100 dark:border-gray-700">
                  <select
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value)}
                    className="bg-transparent text-[9px] font-black uppercase tracking-widest px-3 py-1 outline-none border-none cursor-pointer text-gray-600 dark:text-gray-400"
                  >
                    <option value="all">Priority: All</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                  <div className="w-px h-4 bg-gray-200 dark:bg-gray-700 self-center" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-transparent text-[9px] font-black uppercase tracking-widest px-3 py-1 outline-none border-none cursor-pointer text-gray-600 dark:text-gray-400"
                  >
                    <option value="nearest">Sort: Nearest</option>
                    <option value="highest_pay">Payout</option>
                    <option value="priority">Priority</option>
                  </select>
                </div>

                <button className="p-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-400 hover:text-indigo-600 border border-gray-100 dark:border-gray-700 transition-all shadow-sm">
                  <Filter size={14} />
                </button>
              </div>
            </div>

            <div className={view === 'list' ? "space-y-4" : "grid grid-cols-1 lg:grid-cols-2 gap-5"}>
              {filteredTasks.map((task) => (
                <div key={task.id} className="group relative bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden transition-all hover:shadow-2xl hover:border-indigo-100 dark:hover:border-indigo-900/40 flex flex-col">
                  {/* Left Priority Strip */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${task.priority === 'high' ? 'bg-red-500' :
                    task.priority === 'medium' ? 'bg-orange-500' : 'bg-emerald-500'
                    }`} />

                  <div className="p-5 flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-lg ${getPriorityColor(task.priority)}`}>
                          {getCategoryIcon(task.type)}
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase text-gray-400 leading-none">{task.type}</p>
                          <p className={`text-[8px] font-bold uppercase tracking-widest mt-1 ${task.status === 'in-progress' ? 'text-orange-500 animate-pulse' :
                            task.status === 'delayed' ? 'text-red-500' : 'text-gray-500'
                            }`}>
                            {task.status.replace('-', ' ')}
                          </p>
                        </div>
                      </div>
                      <button className="p-2 text-gray-300 hover:text-gray-600 dark:hover:text-gray-400 transition-colors">
                        <MoreVertical size={16} />
                      </button>
                    </div>

                    <h3 className="text-base font-black text-gray-900 dark:text-white mb-2 leading-tight group-hover:text-indigo-600 transition-colors">
                      {task.title}
                    </h3>

                    <div className="space-y-2.5">
                      <div className="flex items-start gap-2">
                        <MapPin size={14} className="text-gray-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-[11px] font-bold text-gray-600 dark:text-gray-400 leading-snug">
                            {task.store} • <span className="text-gray-400 font-medium">{task.address}</span>
                          </p>
                          <p className="text-[9px] font-bold text-indigo-500/80 mt-1 uppercase tracking-tighter">
                            Due {task.dueDate}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800/50 p-2.5 rounded-xl border border-gray-100 dark:border-gray-700/50">
                        <div className="flex items-center gap-1.5 flex-1">
                          <Navigation size={12} className="text-indigo-500" />
                          <div>
                            <p className="text-[8px] font-black text-gray-400 uppercase tracking-tighter">Distance</p>
                            <p className="text-[10px] font-black text-gray-900 dark:text-white leading-none">{task.distance}</p>
                          </div>
                        </div>
                        <div className="w-px h-6 bg-gray-200 dark:bg-gray-700" />
                        <div className="flex items-center gap-1.5 flex-1">
                          <Clock size={12} className="text-pink-500" />
                          <div>
                            <p className="text-[8px] font-black text-gray-400 uppercase tracking-tighter">Est. Time</p>
                            <p className="text-[10px] font-black text-gray-900 dark:text-white leading-none">{task.eta}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-0 mt-auto">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Incentive</p>
                        <p className="text-xl font-black text-emerald-600 tabular-nums leading-none tracking-tight">{task.incentive}</p>
                      </div>
                      <div className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${getPriorityColor(task.priority)}`}>
                        {task.priority} Priority
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <button className="flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-indigo-200 dark:shadow-none">
                        Start Task
                      </button>
                      <button className="flex items-center justify-center gap-2 py-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-300 rounded-xl font-black text-[10px] uppercase tracking-widest hover:border-indigo-200 transition-all">
                        <Navigation size={12} />
                        Navigate
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeTasks;
