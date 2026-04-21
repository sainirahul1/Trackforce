import React, { useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDialog } from '../context/DialogContext';
import { useSocket } from '../context/SocketContext';
import apiClient from '../services/apiClient';
import storage from '../utils/storage';
import { getDashboardStats, startTracking, stopTracking, getTrackingStatus, getTargetHistory } from '../services/trackingService';
import { getActivities } from '../services/activityService';
import { getTasks } from '../services/taskService';

import {
  MapPin, Calendar, TrendingUp, Clock, ClipboardList,
  Map as MapIcon, ShoppingBag, ChevronRight, Activity,
  CheckCircle2, Navigation2, IndianRupee, Smartphone, GraduationCap, PackageCheck, Target
} from 'lucide-react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, Tooltip, Legend, Filler, RadialLinearScale
} from 'chart.js';
import { Line, Radar } from 'react-chartjs-2';
import { getSyncCachedData } from '../utils/cacheHelper';

// Register Chart.js components
ChartJS.register(
  CategoryScale, LinearScale, PointElement,
  LineElement, Tooltip, Legend, Filler, RadialLinearScale
);

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
 * ProgressRing Component
 * A compact circular progress indicator for key performance metrics.
 */
const ProgressRing = ({ label, current, target, color, loading }) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center text-center animate-pulse p-2">
        <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-800 mb-3" />
        <div className="h-2 w-10 bg-gray-200 dark:bg-gray-800 rounded mb-2" />
        <div className="h-4 w-12 bg-gray-100 dark:bg-gray-800 rounded-lg" />
      </div>
    );
  }
  const percentage = Math.min(Math.round((current / (target || 1)) * 100), 100);
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center text-center group p-2 rounded-2xl transition-all hover:bg-gray-50/80">
      <div className="relative mb-3 transform transition-transform group-hover:scale-110">
        <svg className="w-16 h-16 -rotate-90 transform">
          <circle
            cx="32" cy="32" r={radius}
            stroke="currentColor" strokeWidth="5" fill="transparent"
            className="text-gray-200/50"
          />
          <circle
            cx="32" cy="32" r={radius}
            stroke="currentColor" strokeWidth="5" fill="transparent"
            strokeDasharray={circumference}
            style={{
              strokeDashoffset,
              transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
              filter: `drop-shadow(0 0 3px currentColor)`
            }}
            strokeLinecap="round"
            className={`${color}`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-black text-gray-900 leading-none">{percentage}%</span>
        </div>
      </div>
      <p className="text-[11px] font-black text-gray-500 uppercase tracking-[0.15em] leading-none mb-2">{label}</p>
      <div className="px-3 py-1 bg-gray-100 rounded-lg border border-gray-200/50">
        <p className="text-xs font-black text-gray-800 tabular-nums">{current}<span className="text-gray-400 mx-0.5">/</span>{target}</p>
      </div>
    </div>
  );
};


/**
 * RevenueCard Component
 * Displays a weekly revenue visualization inspired by the Orders page.
 */
const RevenueCard = ({ revenueData, loading }) => {
  if (loading) {
    return (
      <div className="w-full max-w-[320px] aspect-square bg-white dark:bg-slate-900 p-7 rounded-[3rem] shadow-xl border border-gray-100 dark:border-slate-800 animate-pulse">
        <div className="flex flex-col h-full justify-between items-center">
          <div className="w-12 h-12 bg-gray-200 dark:bg-gray-800 rounded-2xl mb-4" />
          <div className="w-24 h-4 bg-gray-200 dark:bg-gray-800 rounded mb-2" />
          <div className="w-full h-24 bg-gray-100 dark:bg-gray-800/50 rounded-2xl" />
          <div className="w-20 h-6 bg-gray-200 dark:bg-gray-800 rounded mt-4" />
        </div>
      </div>
    );
  }
  const weeklyData = revenueData?.weeklyData || [0, 0, 0, 0, 0, 0, 0];
  const totalWeekly = revenueData?.totalWeekly || 0;

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const labels = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    labels.push(days[date.getDay()]);
  }

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Revenue',
        data: weeklyData,
        borderColor: '#10b981',
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return null;
          const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
          gradient.addColorStop(0, 'rgba(16, 185, 129, 0)');
          gradient.addColorStop(1, 'rgba(16, 185, 129, 0.1)');
          return gradient;
        },
        fill: true,
        tension: 0.5,
        pointRadius: 4,
        pointBackgroundColor: '#10b981',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointHoverRadius: 6,
        borderWidth: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#fff',
        titleColor: '#1e293b',
        bodyColor: '#1e293b',
        titleFont: { size: 12, weight: 'bold' },
        bodyFont: { size: 12 },
        padding: 10,
        borderRadius: 8,
        displayColors: false,
        borderColor: '#e2e8f0',
        borderWidth: 1
      },
    },
    scales: {
      x: { display: false },
      y: { display: false },
    },
  };

  return (
    <Link
      to="/employee/orders"
      className="w-full max-w-[320px] aspect-square bg-white dark:bg-slate-900 text-gray-900 dark:text-white p-7 rounded-[3rem] shadow-xl relative overflow-hidden group transition-all duration-700 border border-gray-100 dark:border-slate-800 hover:border-emerald-500/30 block hover:-translate-y-1 active:scale-[0.98]"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[60px] -mr-20 -mt-20 pointer-events-none group-hover:scale-125 transition-transform duration-1000" />

      <div className="flex flex-col h-full justify-between items-center relative z-10 text-center">
        <div className="space-y-1.5">
          <div className="inline-flex p-3 bg-emerald-50 rounded-2xl mb-1 text-emerald-600 shadow-sm border border-emerald-100">
            <IndianRupee size={24} />
          </div>
          <h3 className="text-2xl font-black tracking-tight leading-none group-hover:text-emerald-600 transition-colors">Revenue</h3>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-[0.25em]">Monthly Overview</p>
        </div>

        <div className="w-full h-28 min-h-[112px] my-2 group-hover:scale-105 transition-transform duration-700">
          <Line data={data} options={options} />
        </div>

        <div className="space-y-1 w-full relative z-20">
          <p className="text-3xl font-black text-slate-800 dark:text-white">₹{((revenueData?.monthlyRevenue) || totalWeekly * 4).toLocaleString('en-IN')}</p>
          <div className="flex justify-between items-center w-full pt-3 mt-2 border-t border-gray-100 dark:border-slate-800/50">
             <div className="flex flex-col text-left">
                <span className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Daily Rev</span>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">₹{((revenueData?.dailyRevenue) || Math.round(totalWeekly / 7)).toLocaleString('en-IN')}</span>
             </div>
             <div className="flex flex-col text-right">
                <span className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Conv. Rate</span>
                <span className="text-xs font-bold text-indigo-500 dark:text-indigo-400">{revenueData?.conversionRate || 68}%</span>
             </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

/**
 * CapabilitiesCard Component
 * Displays a radar chart of the employee's "Capabilities and Power".
 */
const CapabilitiesCard = ({ capabilities, loading }) => {
  if (loading) {
    return (
      <div className="w-full max-w-[320px] aspect-square bg-white dark:bg-slate-900 p-7 rounded-[3rem] shadow-xl border border-gray-100 dark:border-slate-800 animate-pulse">
        <div className="flex flex-col h-full justify-between items-center">
          <div className="w-12 h-12 bg-gray-200 dark:bg-gray-800 rounded-2xl mb-4" />
          <div className="w-24 h-4 bg-gray-200 dark:bg-gray-800 rounded mb-2" />
          <div className="w-32 h-32 bg-gray-100 dark:bg-gray-800/50 rounded-full" />
          <div className="w-12 h-1 bg-gray-200 dark:bg-gray-800 rounded mt-4" />
        </div>
      </div>
    );
  }
  const radarData = (capabilities && capabilities.length === 5) ? capabilities : [0, 0, 0, 0, 0];

  const data = {
    labels: ['Efficiency', 'Reliability', 'Speed', 'Accuracy', 'Engagement'],
    datasets: [
      {
        label: 'Capabilities',
        data: radarData,
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        borderColor: '#6366f1',
        borderWidth: 3,
        pointBackgroundColor: '#6366f1',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#6366f1'
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#fff',
        titleColor: '#1e293b',
        bodyColor: '#1e293b',
        borderColor: '#e2e8f0',
        borderWidth: 1,
        padding: 10,
        displayColors: false
      }
    },
    scales: {
      r: {
        angleLines: { color: '#f1f5f9' },
        grid: { color: '#f1f5f9' },
        pointLabels: {
          color: '#64748b',
          font: { size: 10, weight: 'bold', family: 'Inter' }
        },
        ticks: { display: false },
        suggestedMin: 0,
        suggestedMax: 100
      }
    }
  };

  const isDataEmpty = radarData.every(v => v === 0);

  return (
    <div className="w-full max-w-[320px] aspect-square bg-white dark:bg-slate-900 text-gray-900 dark:text-white p-7 rounded-[3rem] shadow-xl relative overflow-hidden group transition-all duration-700 border border-gray-100 dark:border-slate-800 hover:border-indigo-500/30">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-[60px] -mr-20 -mt-20 pointer-events-none group-hover:scale-125 transition-transform duration-1000" />

      <div className="flex flex-col h-full justify-between items-center relative z-10 text-center">
        <div className="space-y-1">
          <div className="inline-flex p-3 bg-indigo-50 rounded-2xl mb-1 text-indigo-600 shadow-sm border border-indigo-100">
            <TrendingUp size={24} />
          </div>
          <h3 className="text-2xl font-black tracking-tight leading-none group-hover:text-indigo-600 transition-colors">Field Mastery</h3>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-[0.25em]">Capabilities</p>
        </div>

        <div className="w-full h-36 min-h-[144px] my-1 group-hover:scale-105 transition-transform duration-700 relative">
          <Radar data={data} options={options} />
          {isDataEmpty && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-slate-900/50 backdrop-blur-[2px] rounded-full">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-white dark:bg-slate-800 px-3 py-1 rounded-full shadow-sm border border-gray-100 dark:border-slate-700">No Data Found</span>
            </div>
          )}
        </div>

        <div className="w-12 h-1 bg-indigo-100 rounded-full" />
      </div>
    </div>
  );
};


/**
 * ActivityItem Component
 * Renders a sophisticated card for each entry in the Recent Activity timeline.
 */
const ActivityItem = ({ activity, isLast }) => (
  <Link to="/employee/activity" className="flex gap-6 relative group/item">
    {/* Refined Timeline Connector */}
    {!isLast && (
      <div className="absolute left-[23px] top-[50px] bottom-[-30px] w-px bg-gradient-to-b from-indigo-200 via-indigo-100 to-transparent dark:from-indigo-900 dark:via-indigo-950 dark:to-transparent opacity-50 group-hover/item:opacity-100 transition-opacity duration-700" />
    )}

    {/* Floating Icon with Ring Glow */}
    <div className="relative">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 z-10 transition-all duration-700 group-hover/item:scale-110 group-hover/item:rotate-6 relative shadow-lg ${activity.type === 'success' ? 'bg-emerald-50 text-emerald-600 shadow-emerald-500/10' :
        activity.type === 'info' ? 'bg-blue-50 text-blue-600 shadow-blue-500/10' :
          'bg-slate-50 text-slate-600 shadow-slate-500/10'
        }`}>
        {activity.type === 'success' ? <CheckCircle2 size={22} /> :
          activity.type === 'info' ? <ShoppingBag size={22} /> :
            <Activity size={22} />}

        {/* Pulsing ring for the icon when hovered */}
        <div className={`absolute inset-0 rounded-2xl animate-pulse opacity-0 group-hover/item:opacity-20 transition-opacity duration-700 ${activity.type === 'success' ? 'bg-emerald-400' :
          activity.type === 'info' ? 'bg-blue-400' : 'bg-slate-400'
          }`} />
      </div>
    </div>

    {/* Activity Content Card */}
    <div className="flex-1 bg-white/50 dark:bg-gray-800/30 p-4 rounded-2xl border border-gray-100 dark:border-gray-800/50 hover:bg-white dark:hover:bg-gray-800 transition-all duration-500 hover:shadow-xl hover:-translate-y-1 group/content">
      <div className="flex justify-between items-start mb-1.5">
        <h4 className="text-[15px] font-black text-gray-900 dark:text-white group-hover/content:text-indigo-600 dark:group-hover/content:text-indigo-400 transition-colors">
          {activity.title}
        </h4>
        <div className="flex items-center space-x-1.5 opacity-60 group-hover/content:opacity-100 transition-opacity">
          <Clock size={10} className="text-gray-400" />
          <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
            {activity.time}
          </span>
        </div>
      </div>
      <p className="text-xs font-bold text-gray-500 dark:text-gray-400 leading-relaxed uppercase tracking-wider">
        {activity.desc}
      </p>
    </div>
  </Link>
);

// =============================================================================
// MILESTONES CARD COMPONENT
// =============================================================================

const MilestonesCard = ({ statsData, loading }) => {
  const milestones = [
    {
      id: 'appInstalled',
      icon: Smartphone,
      label: 'App Installed',
      sublabel: 'Verified on owner device',
      value: statsData?.appInstalled || 0,
      color: 'text-violet-600',
      bg: 'bg-violet-50 dark:bg-violet-900/20',
      border: 'border-violet-100 dark:border-violet-500/10',
      glow: 'from-violet-500/10',
    },
    {
      id: 'trainingCompleted',
      icon: GraduationCap,
      label: 'Training Completed',
      sublabel: 'Owner understands ordering flow',
      value: statsData?.trainingCompleted || 0,
      color: 'text-amber-600',
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      border: 'border-amber-100 dark:border-amber-500/10',
      glow: 'from-amber-500/10',
    },
    {
      id: 'firstOrderPlaced',
      icon: PackageCheck,
      label: 'First Order Placed',
      sublabel: 'Transaction initiated',
      value: statsData?.firstOrderPlaced || 0,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50 dark:bg-emerald-900/20',
      border: 'border-emerald-100 dark:border-emerald-500/10',
      glow: 'from-emerald-500/10',
    },
  ];
  return (
    <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
      <div className="px-7 pt-7 pb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-black text-gray-900 dark:text-white tracking-tight">Field Milestones</h3>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-0.5">Today's task count</p>
        </div>
        <CheckCircle2 size={22} className="text-indigo-400" />
      </div>
      <div className="grid grid-cols-3 divide-x divide-gray-100 dark:divide-gray-800 border-t border-gray-100 dark:border-gray-800">
        {milestones.map((m) => (
          <div key={m.id} className={`relative flex flex-col items-center text-center p-5 md:p-7 group hover:bg-gradient-to-b ${m.glow} to-transparent transition-all duration-500`}>
            <div className={`p-3 rounded-2xl ${m.bg} border ${m.border} mb-3 transition-transform duration-500 group-hover:scale-110`}>
              <m.icon size={20} className={m.color} />
            </div>
            {loading ? (
              <div className="h-9 w-12 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse mb-2" />
            ) : (
              <span className={`text-4xl font-black tabular-nums ${m.color} leading-none`}>{m.value}</span>
            )}
            <span className="text-[10px] font-black text-gray-700 dark:text-gray-200 uppercase tracking-widest mt-2 leading-tight">{m.label}</span>
            <span className="text-[9px] text-gray-400 font-medium mt-1 leading-tight px-1">{m.sublabel}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// =============================================================================
// MOTIVATIONAL QUOTES - rotates daily
// =============================================================================
const MOTIVATIONAL_QUOTES = [
  { text: "Every visit you make today brings you one step closer to your goal.", author: "Field Champion" },
  { text: "The harder you work, the luckier you get. Go make it happen!", author: "Field Champion" },
  { text: "Your effort today is someone's solution tomorrow.", author: "Field Champion" },
  { text: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier" },
  { text: "Don't watch the clock; do what it does — keep going!", author: "Sam Levenson" },
  { text: "Champions keep playing until they get it right. You're a champion.", author: "Field Champion" },
  { text: "Great things never come from comfort zones. Step out and shine!", author: "Field Champion" },
  { text: "Every order you close is a story of trust. Keep building it.", author: "Field Champion" },
  { text: "You are the bridge between a product and its perfect customer.", author: "Field Champion" },
  { text: "Push yourself, because no one else is going to do it for you.", author: "Field Champion" },
  { text: "A journey of a thousand miles begins with a single visit.", author: "Field Champion" },
  { text: "The field is your kingdom. Conquer it one store at a time!", author: "Field Champion" },
  { text: "Discipline is choosing between what you want now and what you want most.", author: "Field Champion" },
  { text: "Your positive energy today will unlock tomorrow's opportunities.", author: "Field Champion" },
  { text: "Believe in yourself, the numbers follow those who believe.", author: "Field Champion" },
  { text: "Today's preparation determines tomorrow's achievement.", author: "Field Champion" },
  { text: "Energy and persistence conquer all things. You have both!", author: "Benjamin Franklin" },
  { text: "Excellence is not a skill. It's an attitude. Show yours today!", author: "Ralph Marston" },
  { text: "Your consistency is your superpower. Never stop showing up.", author: "Field Champion" },
  { text: "Turn every 'no' into a lesson, every 'yes' into momentum.", author: "Field Champion" },
  { text: "The field is full of possibilities. Go find them!", author: "Field Champion" },
  { text: "Small daily improvements over time create stunning results.", author: "Field Champion" },
  { text: "You were born to do great things — today is the day to do them.", author: "Field Champion" },
  { text: "Make today so amazing that yesterday gets jealous.", author: "Field Champion" },
  { text: "Your sweat today is someone's smile tomorrow.", author: "Field Champion" },
  { text: "Winners are not people who never fail, but people who never quit.", author: "Field Champion" },
  { text: "Hustle in silence, let the results speak for you.", author: "Field Champion" },
  { text: "Go the extra mile — it's never crowded there!", author: "Wayne Dyer" },
  { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
  { text: "Every single day you make a difference. Don't forget that.", author: "Field Champion" },
  { text: "You are closer than you think. Keep going!", author: "Field Champion" },
];




const EmployeeDashboard = () => {
  // --- Auth Context ---
  const { user, setUser } = useAuth();
  const { setPageLoading } = useOutletContext();
  const { showAlert } = useDialog();
  // --- State Hooks ---
  // const [isOnDuty, setIsOnDuty] = useState(false);
  const [statsData, setStatsData] = useState({
    visitsToday: 0, ordersToday: 0, tasksToday: 0,
    revenueData: { weeklyData: [], totalWeekly: 0 },
    capabilities: [],
    nextTarget: null
  });
  // const [statsData, setStatsData] = useState({ visitsToday: 0, ordersToday: 0, tasksToday: 0 });
  const [activities, setActivities] = useState([]);
  const [nextTask, setNextTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOnDuty, setIsOnDuty] = useState(false);
  const socket = useSocket();
  const socketRef = React.useRef(socket);
  const watchIdRef = React.useRef(null);
  const heartbeatRef = React.useRef(null);
  const [watchId, setWatchId] = useState(null); // Keep for UI indicators if needed

  useEffect(() => {
    socketRef.current = socket;
  }, [socket]);

  // --- Cleanup on Unmount ---
  useEffect(() => {
    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      if (heartbeatRef.current) {
        clearInterval(heartbeatRef.current);
      }
    };
  }, []);

  // --- Start Geo Tracking (Enhanced with full device telemetry) ---
  const lastEmitRef = React.useRef(0);
  const batteryRef = React.useRef(-1);
  const deviceIdRef = React.useRef('unknown');

  // Generate stable device fingerprint on mount
  React.useEffect(() => {
    const ua = navigator.userAgent || '';
    let hash = 0;
    for (let i = 0; i < ua.length; i++) {
      const ch = ua.charCodeAt(i);
      hash = ((hash << 5) - hash) + ch;
      hash |= 0;
    }
    deviceIdRef.current = `DEV-${Math.abs(hash).toString(36).toUpperCase()}`;

    // Attempt to read battery (graceful degradation for unsupported browsers)
    if (navigator.getBattery) {
      navigator.getBattery().then(batt => {
        batteryRef.current = Math.round(batt.level * 100);
        batt.addEventListener('levelchange', () => {
          batteryRef.current = Math.round(batt.level * 100);
        });
      }).catch(() => { batteryRef.current = -1; });
    }
  }, []);

  const emitPosition = React.useCallback((position) => {
    // ENFORCE 10-SECOND MINIMUM INTERVAL between emissions to avoid flooding
    const now = Date.now();
    if (now - lastEmitRef.current < 10000) return;
    lastEmitRef.current = now;

    const { latitude, longitude, accuracy, speed, heading } = position.coords;
    const currentSocket = socketRef.current;
    const currentUser = storage.getUser() || {};

    if (currentSocket && currentSocket.connected) {
      const updateData = {
        employeeId: currentUser._id,
        employeeName: currentUser.name,
        managerId: currentUser.manager,
        tenantId: currentUser.tenant,
        role: currentUser.role,
        location: { lat: latitude, lng: longitude },
        timestamp: new Date().toISOString(),
        // Device Telemetry
        accuracy: accuracy || -1,
        speed: speed != null ? speed : -1,        // m/s from device
        heading: heading != null ? heading : -1,   // degrees
        battery: batteryRef.current,
        deviceId: deviceIdRef.current,
      };
      console.log(`[GPS] Emitting telemetry (${accuracy?.toFixed(1)}m, ${speed?.toFixed(1)}m/s)`);
      currentSocket.emit('tracking:update', updateData);
      
      // Persistence for form reflection
      localStorage.setItem('last_telemetry', JSON.stringify({
        latitude, longitude, accuracy, battery: batteryRef.current, timestamp: new Date().toISOString()
      }));
    } else {
      console.warn('Socket not ready for emission');
    }
  }, []);

  const startGeoTracking = React.useCallback(() => {
    if (!navigator.geolocation) {
      showAlert('Error', 'Geolocation is not supported by your browser', 'error');
      return;
    }

    // Clear existing watch/heartbeat if any
    if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current);
    if (heartbeatRef.current) clearInterval(heartbeatRef.current);

    // 1. DYNAMIC WATCH: OS-triggered updates for movement (responsive)
    const id = navigator.geolocation.watchPosition(
      (pos) => emitPosition(pos),
      (error) => {
        if (error.code !== 1 && error.code !== 3) console.error('[GPS] Watch Error:', error);
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 20000 }
    );
    watchIdRef.current = id;
    setWatchId(id);

    // 2. RIGID HEARTBEAT: Periodic scan every 15s (as per user request 10-20s) 
    // to ensure dynamic reflection even if the OS doesn't trigger watchPosition.
    heartbeatRef.current = setInterval(() => {
      navigator.geolocation.getCurrentPosition(
        (pos) => emitPosition(pos),
        (err) => console.warn('[GPS] Heartbeat scan failed:', err.message),
        { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
      );
    }, 15000); 

    console.log('[GPS] Tracking started with Watch + 15s Heartbeat');
  }, [emitPosition, showAlert]);

  // Handle starting/stopping tracking when duty status changes
  useEffect(() => {
    const currentUser = storage.getUser() || {};
    if (isOnDuty && socket && !watchIdRef.current) {
      console.log('Starting geo tracking watcher');
      startGeoTracking();
    } else if (!isOnDuty && watchIdRef.current) {
      console.log('Stopping geo tracking watcher');
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
      setWatchId(null);
    }
  }, [isOnDuty, socket, startGeoTracking]);

  // --- Initial Data Fetch & Profile Sync ---
  const fetchData = async (isBackground = false) => {
    try {
      if (!isBackground) setLoading(true);

      const [stats, logs, allTasks] = await Promise.all([
        getDashboardStats(isBackground),
        getActivities(),
        getTasks(isBackground)
      ]);
      setStatsData(stats);
      
      // Real-time synchronization of user details from tenant.users
      if (stats.user) {
        setUser(prev => {
          const updated = { ...prev, ...stats.user };
          // Persist to storage to avoid flicker on reload
          storage.setItem('user', JSON.stringify(updated));
          return updated;
        });
      }

      setActivities(logs.map(log => {
        const logDate = new Date(log.timestamp || log.createdAt);
        const isValidDate = !isNaN(logDate.getTime());
        const type = log.type || '';

        return {
          title: log.title || type.replace(/_/g, ' ').toUpperCase(),
          desc: log.details || '',
          time: isValidDate ? logDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '---',
          type: (type.includes('start') || type.includes('placed') || type.includes('completed') || type.includes('success')) ? 'success' : 
                (type.includes('end') || type.includes('stop') || type.includes('rejected') || type.includes('cancel')) ? 'warning' : 'default'
        };
      }));

      const pendingTask = allTasks.find(t => t.status === 'pending') || allTasks[0];
      setNextTask(pendingTask);

      // Sync user data and tracking status from server
      let trackingStatus;
      try {
        trackingStatus = await getTrackingStatus();
      } catch (statusErr) {
        console.warn('[DASHBOARD] Could not fetch tracking status - using existing session:', statusErr.message);
        // Fallback or handle appropriately
      }

      const trackingActive = trackingStatus?.isTracking || false;
      setIsOnDuty(trackingActive);

      // Auto-heal local user object with server-side identity data (critical for managerId/tenantId consistency)
      const currentUser = storage.getUser() || {};
      const updatedUser = {
        ...currentUser,
        ...(trackingStatus?.user || {}),
        isTracking: trackingActive
      };
      storage.setItem('user', JSON.stringify(updatedUser));

      if (trackingActive) {
        startGeoTracking();
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
      if (setPageLoading) setPageLoading(false);
    }
  };

  useEffect(() => {
    // 1. Initial Hydration from Cache (0s Loading)
    const cachedStats = getSyncCachedData('tenant_dashboard_stats');
    const cachedLogs = getSyncCachedData('activities'); // Check key in activityService
    // Note: getActivities uses fetchDataWithCache('activities', ...)

    if (cachedStats) {
      setStatsData(cachedStats);
      setLoading(false);
      if (setPageLoading) setPageLoading(false);
      fetchData(true); // Silent background update
    } else {
      fetchData();
    }
  }, []);
  
  // --- REAL-TIME SYNCHRONIZATION ---
  useEffect(() => {
    if (!socket) return;
    
    // Function to silently refresh data when real-time events occur
    const handleSync = () => {
      console.log('[DASHBOARD] Real-time activity/visit detected. Syncing metrics...');
      fetchData(true); // Silent background refresh
    };

    socket.on('activity:new', handleSync);
    socket.on('visit:new', handleSync);
    socket.on('order:new', handleSync);

    return () => {
      socket.off('activity:new', handleSync);
      socket.off('visit:new', handleSync);
      socket.off('order:new', handleSync);
    };
  }, [socket]);

  const handleToggleShift = async () => {
    // Re-read user from localStorage to get the auto-healed manager/tenant data
    const currentUser = storage.getUser() || {};

    // Prevent non-logged in users (sanity check)
    if (!currentUser.role) {
      showAlert('Error', 'No user role found. Please re-login.', 'error');
      return;
    }

    try {
      if (isOnDuty) {
        try {
          await stopTracking();
        } catch (err) {
          if (err.message.includes('not active')) {
            console.log('Tracking not active on backend, syncing UI...');
          } else {
            throw err;
          }
        }
        if (watchIdRef.current) {
          navigator.geolocation.clearWatch(watchIdRef.current);
          watchIdRef.current = null;
          setWatchId(null);
        }
        if (heartbeatRef.current) {
          clearInterval(heartbeatRef.current);
          heartbeatRef.current = null;
        }
      } else {
        try {
          await startTracking();
        } catch (err) {
          // If already active on backend, just proceed (sync issue)
          if (err.message.includes('already active')) {
            console.log('Tracking already active on backend, syncing UI...');
          }
        }
        startGeoTracking();
        // Emit an immediate point for zero-latency visibility on the manager side
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((pos) => {
            const currentSocket = socketRef.current;
            const u = storage.getUser() || {};
            if (currentSocket?.connected) {
              currentSocket.emit('tracking:update', {
                employeeId: u._id,
                employeeName: u.name,
                managerId: u.manager,
                tenantId: u.tenant,
                role: u.role,
                location: { lat: pos.coords.latitude, lng: pos.coords.longitude },
                timestamp: new Date().toISOString()
              });
            }
          });
        }
      }
      setIsOnDuty(!isOnDuty);

      // Update local user object tracking status
      const updatedUser = { ...currentUser, isTracking: !isOnDuty };
      storage.setItem('user', JSON.stringify(updatedUser));
    } catch (err) {
      console.error('Error toggling tracking:', err);
      showAlert('Error', `Failed to update tracking status: ${err.message}`, 'error');
    }
  };

  // --- Header Stats ---
  const stats = [
    { label: "Visits", value: loading ? '...' : statsData?.visitsToday?.toString() || "0", color: 'from-blue-500 to-cyan-400', link: '/employee/visits' },
    { label: "Duty", value: isOnDuty ? 'ON' : 'OFF', color: 'from-emerald-500 to-teal-400' },
    { label: "Orders", value: loading ? '...' : statsData?.ordersToday?.toString() || "0", color: 'from-purple-500 to-indigo-400', link: '/employee/orders' }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10 px-4 md:px-0">

      {/* 1. Header Section: Greeting & Profile/Shift Control */}
      <header className="relative overflow-hidden rounded-[2rem] p-6 md:p-10 shadow-xl bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 shadow-slate-900/40 transition-all duration-700">

        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          {/* Greeting Text */}
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-1">
              <Calendar size={12} className="text-white/80" />
              <span className="text-xs font-black text-white/90 tracking-wide uppercase">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
              Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'},<br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-emerald-200 drop-shadow-sm">{user.name || 'User'}</span>
            </h1>
            <div className="mt-3 max-w-xl">
              <p className="text-white/95 font-black text-base md:text-lg italic leading-snug tracking-tight drop-shadow-sm">
                <span className="text-yellow-300 mr-1.5 text-xl not-italic">✦</span>
                {(() => {
                  const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
                  const q = MOTIVATIONAL_QUOTES[dayOfYear % MOTIVATIONAL_QUOTES.length];
                  return `"${q.text}"`;
                })()}
              </p>
              <p className="text-white/50 font-bold text-[11px] uppercase tracking-[0.2em] mt-1.5 ml-6">
                {(() => {
                  const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
                  return `— ${MOTIVATIONAL_QUOTES[dayOfYear % MOTIVATIONAL_QUOTES.length].author}`;
                })()}
              </p>
            </div>
          </div>


          {/* Header Controls (Stats Grid with Integrated Shift Toggle) */}
          <div className="flex flex-col items-end gap-6 w-full lg:w-auto">
            <div className="grid grid-cols-3 gap-4 w-full sm:w-auto">
              {stats.map((stat, idx) => {
                const CardWrapper = stat.label === "Duty" ? 'div' : Link;
                const wrapperProps = stat.label === "Duty" ? {} : { to: stat.label === 'Visits' ? '/employee/visits' : '/employee/orders' };

                return (
                  <CardWrapper
                    key={idx}
                    {...wrapperProps}
                    className={`flex flex-col items-center justify-center p-4 md:p-6 bg-white/10 backdrop-blur-xl rounded-[2rem] border border-white/10 hover:bg-white/20 transition-all duration-300 min-w-[120px] md:min-w-[160px] shadow-lg group relative overflow-hidden cursor-pointer ${loading ? 'animate-pulse' : ''}`}
                  >
                    <span className="text-[11px] font-black text-white/40 uppercase tracking-[0.2em] mb-2 group-hover:text-white/60 transition-colors">{stat.label}</span>
                    <div className="flex flex-col items-center">
                      <span className={`text-3xl md:text-4xl font-black text-white mb-1 ${loading ? 'opacity-20' : ''}`}>{stat.value}</span>
                      {stat.trend && !loading && (
                        <span className="text-[9px] font-black text-indigo-300 uppercase tracking-wider opacity-80">{stat.trend}</span>
                      )}

                      {stat.label === "Duty" && (
                        <div className="mt-4 flex flex-col items-center space-y-3 pt-4 border-t border-white/10 w-full animate-in fade-in slide-in-from-top-2 duration-500">
                          <div className="flex flex-col items-center">
                            <span className={`text-[10px] font-black uppercase tracking-widest leading-none mb-1 ${isOnDuty ? 'text-green-300 shadow-green-500/50' : 'text-slate-400'}`}>
                              {isOnDuty ? (watchId ? 'GPS Emitting' : 'GPS Scanning...') : 'Tracking Off'}
                            </span>
                            {isOnDuty && (
                              <div className="absolute top-2 right-2 flex h-2 w-2">
                                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${watchId ? 'bg-green-400' : 'bg-yellow-400'} opacity-75`}></span>
                                <span className={`relative inline-flex rounded-full h-2 w-2 ${watchId ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                              </div>
                            )}
                          </div>
                          <button
                            onClick={handleToggleShift}
                            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 scale-90 ${isOnDuty ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-slate-700'}`}
                            role="switch"
                            aria-checked={isOnDuty}
                          >
                            <span className="sr-only">Toggle shift</span>
                            <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-xl transition-all duration-500 ${isOnDuty ? 'translate-x-[1.3rem]' : 'translate-x-1'}`} />
                          </button>
                        </div>
                      )}
                    </div>
                  </CardWrapper>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      {/* Daily Progress Section */}
      <section className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-100/50 dark:shadow-none overflow-hidden group">
        <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-100 dark:divide-gray-800">
          <div className="p-8 space-y-4 md:col-span-1 bg-gradient-to-br from-indigo-50/50 to-transparent dark:from-indigo-900/10">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg rotate-3 group-hover:rotate-6 transition-transform">
                <Target size={24} />
              </div>
              <div>
                <h3 className="text-lg font-black text-gray-900 dark:text-white tracking-tight">Daily Mission</h3>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mt-1">Today's Quota</p>
              </div>
            </div>
          </div>
          
          <div className="p-8 md:col-span-3 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 w-full space-y-3">
              <div className="flex justify-between items-end">
                <div>
                  <span className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">
                    {loading ? '---' : statsData?.visitsCompleted || 0}
                  </span>
                  <span className="text-sm font-black text-gray-400 ml-1">/ {loading ? '---' : statsData?.monthlyTarget || 0} Visits</span>
                </div>
                <span className={`text-sm font-black uppercase tracking-widest ${loading ? 'text-gray-300' : (statsData?.visitsCompleted >= statsData?.monthlyTarget ? 'text-emerald-500' : 'text-indigo-500')}`}>
                  {loading ? 'Calculating...' : (statsData?.monthlyTarget > 0 ? Math.round((statsData.visitsCompleted / statsData.monthlyTarget) * 100) : 0)}% Complete
                </span>
              </div>
              <div className="w-full h-4 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden p-1 shadow-inner">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 shadow-lg ${statsData?.visitsCompleted >= statsData?.monthlyTarget ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-gradient-to-r from-indigo-500 to-blue-500'}`}
                  style={{ width: `${loading ? 0 : Math.min(100, Math.round((statsData?.visitsCompleted / (statsData?.monthlyTarget || 1)) * 100))}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pt-1">
                <span>Shift Start ({new Date().toLocaleDateString('default', { day: 'numeric', month: 'short' })})</span>
                <span>Quota Milestone ({statsData?.monthlyTarget || 0})</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4 shrink-0 px-8 py-4 bg-gray-50/50 dark:bg-gray-800/50 rounded-3xl border border-gray-100 dark:border-gray-800 group-hover:scale-105 transition-transform">
              <div className="text-right">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Duty Status</p>
                <p className={`font-black uppercase tracking-tighter ${statsData?.visitsCompleted >= statsData?.monthlyTarget ? 'text-emerald-600' : 'text-indigo-600'}`}>
                  {loading ? 'Scanning' : (statsData?.visitsCompleted >= statsData?.monthlyTarget ? 'Quota Met' : 'In Progress')}
                </p>
              </div>
              <div className={`p-2.5 rounded-xl ${statsData?.visitsCompleted >= statsData?.monthlyTarget ? 'bg-emerald-100 text-emerald-600' : 'bg-indigo-100 text-indigo-600'}`}>
                {statsData?.visitsCompleted >= statsData?.monthlyTarget ? <CheckCircle2 size={20} /> : <Activity size={20} className="animate-pulse" />}
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* 2. Metrics Row: 3 compact horizontal stat cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Revenue Card */}
        <Link to="/employee/orders" className="group relative bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl overflow-hidden transition-all duration-500 hover:-translate-y-1 p-6 block">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/60 to-transparent dark:from-emerald-900/10 pointer-events-none" />
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-emerald-100/40 dark:bg-emerald-900/20 rounded-full blur-2xl pointer-events-none group-hover:scale-150 transition-transform duration-700" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl border border-emerald-100 dark:border-emerald-800">
                <IndianRupee size={18} className="text-emerald-600" />
              </div>
              <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-2.5 py-1 rounded-full uppercase tracking-widest border border-emerald-100 dark:border-emerald-800">Monthly</span>
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Revenue</p>
            {loading ? <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mb-3" /> : (
              <p className="text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-3">₹{((statsData?.revenueData?.monthlyRevenue) || 0).toLocaleString('en-IN')}</p>
            )}
            <div className="flex items-center gap-4 pt-3 border-t border-gray-100 dark:border-gray-800">
              <div>
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Daily</p>
                <p className="text-sm font-black text-emerald-600">₹{((statsData?.revenueData?.dailyRevenue) || 0).toLocaleString('en-IN')}</p>
              </div>
              <div className="w-px h-6 bg-gray-100 dark:bg-gray-800" />
              <div>
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Conv. Rate</p>
                <p className="text-sm font-black text-indigo-500">{statsData?.revenueData?.conversionRate || 68}%</p>
              </div>
              <div className="ml-auto">
                <svg viewBox="0 0 60 24" width="60" height="24" className="text-emerald-400">
                  <polyline points="0,20 12,14 24,16 36,8 48,12 60,5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </div>
        </Link>

        {/* Performance Card */}
        <Link to="/employee/visits" className="group relative bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl overflow-hidden transition-all duration-500 hover:-translate-y-1 p-6 block">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/60 to-transparent dark:from-indigo-900/10 pointer-events-none" />
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-indigo-100/40 dark:bg-indigo-900/20 rounded-full blur-2xl pointer-events-none group-hover:scale-150 transition-transform duration-700" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl border border-indigo-100 dark:border-indigo-800">
                <Activity size={18} className="text-indigo-600" />
              </div>
              <span className="text-[9px] font-black text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 px-2.5 py-1 rounded-full uppercase tracking-widest border border-indigo-100 dark:border-indigo-800">Today</span>
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Performance</p>
            {loading ? <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mb-3" /> : (
              <p className="text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-3">
                {Math.round(((statsData?.visitsCompleted || 0) / (statsData?.visitsToday || 1)) * 100)}%
              </p>
            )}
            <div className="flex items-center gap-4 pt-3 border-t border-gray-100 dark:border-gray-800">
              <div>
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Visits</p>
                <p className="text-sm font-black text-indigo-600">{statsData?.visitsCompleted || 0}<span className="text-gray-400 font-normal">/{statsData?.visitsToday || 0}</span></p>
              </div>
              <div className="w-px h-6 bg-gray-100 dark:bg-gray-800" />
              <div>
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Tasks</p>
                <p className="text-sm font-black text-blue-600">{statsData?.tasksCompleted || 0}<span className="text-gray-400 font-normal">/{statsData?.tasksToday || 0}</span></p>
              </div>
              <div className="ml-auto flex-1 max-w-[60px]">
                <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-indigo-500 to-blue-400 rounded-full transition-all duration-1000"
                    style={{ width: `${Math.min(Math.round(((statsData?.visitsCompleted||0)/(statsData?.visitsToday||1))*100),100)}%` }} />
                </div>
                <p className="text-[9px] text-gray-400 mt-1 font-bold uppercase tracking-widest text-right">Done</p>
              </div>
            </div>
          </div>
        </Link>

        {/* Field Mastery Card */}
        <div className="group relative bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl overflow-hidden transition-all duration-500 hover:-translate-y-1 p-6">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-50/60 to-transparent dark:from-violet-900/10 pointer-events-none" />
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-violet-100/40 dark:bg-violet-900/20 rounded-full blur-2xl pointer-events-none group-hover:scale-150 transition-transform duration-700" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 bg-violet-50 dark:bg-violet-900/30 rounded-2xl border border-violet-100 dark:border-violet-800">
                <TrendingUp size={18} className="text-violet-600" />
              </div>
              <span className="text-[9px] font-black text-violet-600 bg-violet-50 dark:bg-violet-900/30 px-2.5 py-1 rounded-full uppercase tracking-widest border border-violet-100 dark:border-violet-800">Mastery</span>
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Field Mastery</p>
            <p className="text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-3">
              {loading ? '...' : `${Math.round((statsData?.capabilities||[0]).reduce((a,b)=>a+b,0)/Math.max((statsData?.capabilities||[1]).length,1))}%`}
            </p>
            <div className="flex items-end gap-1.5 pt-3 border-t border-gray-100 dark:border-gray-800">
              {['Eff','Rel','Spd','Acc','Eng'].map((lbl, i) => (
                <div key={lbl} className="flex flex-col items-center gap-1 flex-1">
                  <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-sm overflow-hidden" style={{height:'32px', display:'flex', alignItems:'flex-end'}}>
                    <div className="w-full bg-gradient-to-t from-violet-500 to-violet-300 rounded-sm transition-all duration-1000"
                      style={{height:`${statsData?.capabilities?.[i]||0}%`}} />
                  </div>
                  <span className="text-[8px] font-black text-gray-400 uppercase">{lbl}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Milestones Card */}
      <MilestonesCard statsData={statsData} loading={loading} />

      {/* 4. Operational Log - Premium compact design */}
      <section className="bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-900/20">
              <Clock size={16} className="text-indigo-500" />
            </div>
            <div>
              <span className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">Operational Log</span>
              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Recent activity</p>
            </div>
          </div>
          <Link to="/employee/activity" className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 transition-colors px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800">
            History <ChevronRight size={11} />
          </Link>
        </div>

        <div>
          {loading ? (
            <div className="divide-y divide-gray-50 dark:divide-gray-800/60">
              {[1,2,3,4].map(i => (
                <div key={i} className="flex gap-4 px-5 py-4 animate-pulse">
                  <div className="w-9 h-9 bg-gray-100 dark:bg-gray-800 rounded-2xl shrink-0" />
                  <div className="flex-1 space-y-2 pt-1">
                    <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full w-2/3" />
                    <div className="h-2 bg-gray-50 dark:bg-gray-800/60 rounded-full w-1/2" />
                  </div>
                  <div className="h-3 w-12 bg-gray-100 dark:bg-gray-800 rounded-full mt-1 shrink-0" />
                </div>
              ))}
            </div>
          ) : activities.length > 0 ? (
            <div className="divide-y divide-gray-50 dark:divide-gray-800/40">
              {activities.slice(0, 5).map((activity, i) => {
                const isSuccess = activity.type === 'success';
                const isInfo = activity.type === 'info';
                return (
                  <Link to="/employee/activity" key={i} className="flex items-center gap-4 px-5 py-4 hover:bg-indigo-50/40 dark:hover:bg-indigo-900/10 transition-colors group cursor-pointer">
                    <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110 shadow-sm ${
                      isSuccess ? 'bg-emerald-50 dark:bg-emerald-900/20' :
                      isInfo ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-slate-100 dark:bg-gray-800'
                    }`}>
                      {isSuccess ? (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="text-emerald-500"><path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      ) : isInfo ? (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="text-blue-500"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/><path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                      ) : (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="text-slate-400"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/><path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-black text-gray-800 dark:text-gray-100 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{activity.title}</p>
                      <p className="text-[10px] text-gray-400 truncate mt-0.5">{activity.desc}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">{activity.time}</span>
                      <div className={`w-1.5 h-1.5 rounded-full ${isSuccess ? 'bg-emerald-400' : isInfo ? 'bg-blue-400' : 'bg-gray-300'}`} />
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="py-14 flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-gray-300 dark:text-gray-600">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No recent operations</p>
            </div>
          )}
        </div>

        <div className="px-5 py-3 bg-gradient-to-r from-gray-50/80 to-transparent dark:from-gray-800/30 dark:to-transparent flex items-center justify-between border-t border-gray-100 dark:border-gray-800/50">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Auto-updating live</span>
          </div>
          <span className="text-[9px] font-bold text-gray-300 dark:text-gray-600 uppercase tracking-widest">{activities.length} events</span>
        </div>
      </section>
    </div>
  );
};

export default EmployeeDashboard;
// shdjzxfgxjdh