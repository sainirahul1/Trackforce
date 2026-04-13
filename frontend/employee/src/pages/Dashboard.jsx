import React, { useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import {
  MapPin, Calendar, TrendingUp, Clock, ClipboardList,
  Map as MapIcon, ShoppingBag, ShoppingBasket, ChevronRight, Activity,
  CheckCircle2, ArrowRight, Navigation2, Camera, Bell, IndianRupee, Loader2
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
          <p className="text-xs text-gray-400 font-bold uppercase tracking-[0.25em]">Weekly Growth</p>
        </div>

        <div className="w-full h-28 min-h-[112px] my-2 group-hover:scale-105 transition-transform duration-700">
          <Line data={data} options={options} />
        </div>

        <div className="space-y-1">
          <p className="text-3xl font-black text-slate-800">₹{totalWeekly.toLocaleString('en-IN')}</p>
          <div className="h-4" /> {/* Spacer for symmetry after removing button */}
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
// MAIN COMPONENT: EmployeeDashboard
// =============================================================================

import { useSocket } from '../context/SocketContext';
import apiClient from '../services/apiClient';
import storage from '../utils/storage';
const EmployeeDashboard = () => {
  // --- Auth Context ---
  const { user } = useAuth();

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
    };
  }, []);

  // --- Start Geo Tracking ---
  const startGeoTracking = React.useCallback(() => {
    // UPDATED: Allow all roles that reach this dashboard to emit GPS (for testing/multi-role users)
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

    if (!navigator.geolocation) {
      showAlert('Error', 'Geolocation is not supported by your browser', 'error');
      return;
    }

    // Clear existing watch if any
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }

    const id = navigator.geolocation.watchPosition(
      (position) => {
        const currentUser = storage.getUser() || {};

        if (currentSocket && currentSocket.connected) {
          const updateData = {
            employeeId: currentUser._id,
            employeeName: currentUser.name,
            managerId: currentUser.manager,
            tenantId: currentUser.tenant,
            role: currentUser.role,
            location: { lat: latitude, lng: longitude },
            timestamp: new Date().toISOString()
          };
          console.log('Emitting location update:', updateData);
          currentSocket.emit('tracking:update', updateData);
        } else {
          console.warn('Socket not ready for emission');
        }
      },
      (error) => console.error('Error getting location:', error),
      { enableHighAccuracy: true }
    );
    setWatchId(id);
    watchIdRef.current = id;
  }, []);

  // Handle starting/stopping tracking when duty status changes
  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
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
      setActivities(logs.map(log => {
        const logDate = new Date(log.timestamp || log.createdAt);
        const isValidDate = !isNaN(logDate.getTime());

        return {
          title: log.type.replace('_', ' ').toUpperCase(),
          desc: log.details,
          time: isValidDate ? logDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '---',
          type: log.type.includes('start') ? 'success' : 'default'
        };
      }));

      const pendingTask = allTasks.find(t => t.status === 'pending') || allTasks[0];
      setNextTask(pendingTask);

      // Sync user data and tracking status from server
      const statusResponse = await apiClient.get('/reatchall/employee/tracking/status');
      const trackingStatus = statusResponse.data;

      const trackingActive = trackingStatus.isTracking || false;
      setIsOnDuty(trackingActive);

      // Auto-heal local user object
      const currentUser = storage.getUser() || {};
      const updatedUser = {
        ...currentUser,
        ...trackingStatus.user,
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

  const handleToggleShift = async () => {
    // Re-read user from localStorage to get the auto-healed manager/tenant data
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

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
      } else {
        try {
          await startTracking();
        } catch (err) {
          // If already active on backend, just proceed (sync issue)
          if (err.message.includes('already active')) {
            console.log('Tracking already active on backend, syncing UI...');
          } else {
            throw err;
          }
        }
        startGeoTracking();
      }
      setIsOnDuty(!isOnDuty);

      // Update local user object tracking status
      const updatedUser = { ...currentUser, isTracking: !isOnDuty };
      localStorage.setItem('user', JSON.stringify(updatedUser));
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
            <p className="flex items-center text-indigo-100/90 font-medium text-base md:text-lg mt-2 uppercase tracking-widest text-[10px]">
              {user.role} Portal - {user.company}
            </p>
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

      {/* 2. Metrics Row: Revenue, Performance, and Capabilities Cards */}
      <section className="flex flex-col lg:flex-row justify-end items-center gap-6 md:gap-8">
        <RevenueCard revenueData={statsData?.revenueData} loading={loading} />
        <CapabilitiesCard capabilities={statsData?.capabilities} loading={loading} />
        <Link
          to="/employee/tasks"
          className={`w-full max-w-[320px] aspect-square bg-white dark:bg-slate-900 text-gray-900 dark:text-white p-7 rounded-[3rem] shadow-xl relative overflow-hidden group transition-all duration-700 border border-gray-100 dark:border-slate-800 hover:border-indigo-500/30 block hover:-translate-y-1 active:scale-[0.98] ${loading ? 'animate-pulse' : ''}`}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
          {!loading && <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-[60px] -mr-20 -mt-20 pointer-events-none group-hover:scale-125 transition-transform duration-1000" />}

          <div className="flex flex-col h-full justify-between items-center relative z-10 text-center">
            <div className="space-y-1.5">
              <div className="inline-flex p-3 bg-indigo-50 rounded-2xl mb-1 text-indigo-600 shadow-sm border border-indigo-100">
                <Activity size={24} />
              </div>
              <h3 className="text-2xl font-black tracking-tight leading-none group-hover:text-indigo-600 transition-colors">Performance</h3>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-[0.25em]">Daily Overview</p>
            </div>

            <div className="grid grid-cols-2 gap-6 w-full px-2">
              <ProgressRing
                label="Visits"
                current={statsData?.visitsCompleted || 0}
                target={statsData?.visitsToday || 1}
                color="text-blue-500"
                loading={loading}
              />
              <ProgressRing
                label="Tasks"
                current={statsData?.tasksCompleted || 0}
                target={statsData?.tasksToday || 1}
                color="text-emerald-500"
                loading={loading}
              />
            </div>

            <div className="mt-3 w-16 h-1 bg-gray-100 rounded-full" />
          </div>
        </Link>
      </section>

      {/* 3. Operations Row: Next Target and Activity Timeline */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-start">
        {/* Next Target Destination Card */}
        <div className="relative group">
          <Link
            to="/employee/tasks?priority=high"
            className={`${UI_TOKENS.cardBase} p-8 md:p-10 rounded-[3rem] shadow-2xl block transition-all duration-700 hover:shadow-indigo-500/10 hover:-translate-y-1 active:scale-[0.98] outline-none group-hover:border-indigo-500/30 overflow-hidden`}
          >
            {/* Soft background accents */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none transition-transform duration-1000 group-hover:scale-110" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-50/30 dark:bg-emerald-900/5 rounded-full blur-[60px] -ml-20 -mb-20 pointer-events-none" />

            <div className="flex justify-between items-center mb-10 relative z-10">
              <h2 className={UI_TOKENS.sectionTitle}>
                <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl mr-4 text-indigo-600 dark:text-indigo-400 shadow-sm border border-indigo-100/50 dark:border-indigo-500/10">
                  <Navigation2 size={24} />
                </div>
                <span className="text-2xl tracking-tighter">Next Target</span>
              </h2>
              {loading ? (
                <div className="w-20 h-6 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse" />
              ) : (
                <div className="inline-flex items-center px-4 py-1.5 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-rose-100 dark:border-rose-500/20 shadow-sm">
                  {(statsData?.nextTarget?.priority || 'Standard').toUpperCase()}
                </div>
              )}
            </div>

            <div className="relative z-10 space-y-8">
              {/* Target Address and Stylized Mini-Map */}
              <div className="flex flex-col md:flex-row gap-8 items-stretch">
                <div className="flex-1 space-y-6">
                  {loading ? (
                    <div className="space-y-4 animate-pulse">
                      <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded" />
                      <div className="h-4 w-32 bg-gray-100 dark:bg-gray-800 rounded" />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <h3 className="text-3xl font-black text-gray-900 dark:text-white leading-none tracking-tight group-hover:text-indigo-600 transition-colors">
                        {statsData?.nextTarget?.store || nextTask?.store || 'No Pending Targets'}
                      </h3>
                      <div className="flex items-center text-gray-500 dark:text-gray-400">
                        <MapIcon size={16} className="mr-2 text-indigo-500 opacity-70" />
                        <span className="text-sm font-bold uppercase tracking-widest opacity-80">{statsData?.nextTarget?.address || nextTask?.address || 'Operational queue clear'}</span>
                      </div>
                    </div>
                  )}

                  {/* Dispatch Context */}
                  <div className="flex items-center gap-6 py-4 border-y border-gray-100 dark:border-gray-800/50">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Travel</span>
                      {loading ? (
                        <div className="h-6 w-12 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
                      ) : (
                        <span className="text-lg font-black text-slate-800 dark:text-white">{statsData?.nextTarget?.travelTime || nextTask?.eta || '---'}</span>
                      )}
                    </div>
                    <div className="w-px h-8 bg-gray-100 dark:bg-gray-800" />
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Distance</span>
                      {loading ? (
                        <div className="h-6 w-12 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
                      ) : (
                        <span className="text-lg font-black text-slate-800 dark:text-white">{statsData?.nextTarget?.distance || nextTask?.distance || '---'}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Stylized Mini-Map SVG */}
                <div className="w-full md:w-48 h-48 bg-slate-50 dark:bg-indigo-950/20 rounded-[2rem] border-2 border-white dark:border-gray-800 shadow-xl overflow-hidden relative">
                  <svg className="absolute inset-0 w-full h-full text-indigo-200 dark:text-indigo-900/40" viewBox="0 0 100 100" fill="none">
                    <path d="M0 20 H100 M0 50 H100 M0 80 H100 M20 0 V100 M50 0 V100 M80 0 V100" stroke="currentColor" strokeWidth="0.5" />
                    <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 4" />
                    <path d="M20 20 L80 80 M80 20 L20 80" stroke="currentColor" strokeWidth="0.2" />
                    <circle cx="50" cy="50" r="4" fill="#6366f1" className="animate-pulse" />
                    <path d="M50 50 L75 30" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeDasharray="1 4" />
                  </svg>
                  <div className="absolute bottom-3 left-3 right-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md py-1.5 px-3 rounded-xl border border-white/50 dark:border-gray-800 shadow-sm">
                    <p className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest text-center">Tap to View</p>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Activity Feed Card */}
        <div className={`${UI_TOKENS.cardBase} p-8 md:p-10 rounded-[3rem] shadow-2xl h-full relative overflow-hidden`}>
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none group-hover:scale-110 transition-transform duration-1000" />
          <div className="flex justify-between items-center mb-10 relative z-10">
            <h3 className={UI_TOKENS.sectionTitle}>
              <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl mr-4 text-indigo-500 shadow-sm border border-indigo-100/50 dark:border-indigo-500/10">
                <Clock size={24} />
              </div>
              <span className="text-2xl tracking-tighter">Operational Log</span>
            </h3>
            <Link to="/employee/activity" className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center group/link transition-all border-b-2 border-transparent hover:border-indigo-600/30 pb-0.5">
              History
              <ChevronRight size={14} className="ml-1.5 group-hover/link:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Timeline List */}
          <div className="space-y-8 relative z-10 px-1">
            {loading ? (
              [1, 2, 3].map(i => (
                <div key={i} className="flex gap-6 animate-pulse">
                  <div className="w-12 h-12 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
                  <div className="flex-1 space-y-3 py-1">
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-1/2" />
                  </div>
                </div>
              ))
            ) : activities.length > 0 ? (
              activities.slice(0, 6).map((activity, i, arr) => (
                <ActivityItem
                  key={i}
                  activity={activity}
                  isLast={i === arr.length - 1}
                />
              ))
            ) : (
              <div className="text-center py-10">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No recent operations</p>
              </div>
            )}
          </div>

          {/* Mini Insights Footer */}
          <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800/50 flex items-center justify-between opacity-60">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Auto-updating live</p>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
              <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Active Intel</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EmployeeDashboard;
// shdjzxfgxjdh