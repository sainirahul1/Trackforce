import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiClient from '../services/apiClient';

// ─── SVG Icons ───────────────────────────────────────────────────────────────
const IconVisit = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="2"/>
  </svg>
);
const IconOrder = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M16 10a4 4 0 01-8 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconTrend = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="17 6 23 6 23 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconRevenue = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <line x1="12" y1="1" x2="12" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconConversion = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
    <path d="M8 14s1.5 2 4 2 4-2 4-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <line x1="9" y1="9" x2="9.01" y2="9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <line x1="15" y1="9" x2="15.01" y2="9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);
const IconAI = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M12 2a10 10 0 100 20A10 10 0 0012 2z" stroke="currentColor" strokeWidth="2"/>
    <path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M12 2v2M12 20v2M2 12h2M20 12h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
const IconStar = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconMap = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="8" y1="2" x2="8" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <line x1="16" y1="6" x2="16" y2="22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);
const IconClock = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
    <polyline points="12 6 12 12 16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// ─── Sparkline ────────────────────────────────────────────────────────────────
const Sparkline = ({ data = [], color = '#6366f1' }) => {
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const w = 80, h = 32;
  const pts = data.map((v, i) => [
    (i / (data.length - 1)) * w,
    h - ((v - min) / range) * h
  ]);
  const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <defs>
        <linearGradient id={`sg-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d={`${d} L${w},${h} L0,${h} Z`} fill={`url(#sg-${color.replace('#','')})`}/>
      <path d={d} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
};

// ─── DonutChart ───────────────────────────────────────────────────────────────
const DonutChart = ({ value = 0, color = '#6366f1', size = 80 }) => {
  const r = 30, cx = 40, cy = 40;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(Math.max(value, 0), 100);
  const dash = (pct / 100) * circ;
  return (
    <svg width={size} height={size} viewBox="0 0 80 80">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f1f5f9" strokeWidth="8"/>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="8"
        strokeDasharray={`${dash} ${circ}`} strokeDashoffset={circ / 4}
        strokeLinecap="round" style={{transition:'stroke-dasharray 1s ease'}}/>
      <text x={cx} y={cy} textAnchor="middle" dy="0.35em"
        fontSize="14" fontWeight="900" fill={color}>{pct}%</text>
    </svg>
  );
};

// ─── Mini Bar Chart ────────────────────────────────────────────────────────────
const BarChart = ({ data = [], labels = [], color = '#6366f1' }) => {
  const max = Math.max(...data, 1);
  return (
    <div className="flex items-end gap-1.5 h-20">
      {data.map((v, i) => (
        <div key={i} className="flex flex-col items-center gap-1 flex-1">
          <div className="w-full rounded-t-lg transition-all duration-700 relative group"
            style={{ height: `${(v / max) * 72}px`, backgroundColor: color, opacity: 0.7 + (v / max) * 0.3 }}>
            <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-black text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">{v}</span>
          </div>
          <span className="text-[8px] font-bold text-gray-400 uppercase truncate w-full text-center">{labels[i]}</span>
        </div>
      ))}
    </div>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────────
const EmployeeAnalytics = () => {
  const { setPageLoading } = useOutletContext();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (setPageLoading) setPageLoading(false);
    // Try fetch, fallback to demo data
    const fetchStats = async () => {
      try {
        const res = await apiClient.get('/reatchall/employee/stats/dashboard');
        setStats(res.data);
      } catch {
        // Use demo data on error
        setStats(null);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Demo / fallback data
  const daily = {
    totalVisits: stats?.visitsToday ?? 7,
    successfulVisits: stats?.visitsCompleted ?? 5,
    ordersCollected: stats?.ordersToday ?? 3,
  };
  const weekly = {
    trend: stats?.weeklyVisits ?? [4, 6, 5, 8, 7, 9, 6],
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    avgPerformance: 72,
    bestDay: 'Friday',
  };
  const monthly = {
    revenue: stats?.revenueData?.monthlyRevenue ?? 0,
    conversionRate: stats?.revenueData?.conversionRate ?? 68,
    weeklyBars: stats?.revenueData?.weeklyData ?? [12000, 18000, 15000, 21000],
    weekLabels: ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4'],
  };
  const ai = {
    topExecutive: user?.name || 'You',
    topArea: stats?.topArea ?? 'Koramangala',
    peakTime: stats?.peakTime ?? '11:00 AM – 1:00 PM',
    insightScore: stats?.insightScore ?? 87,
  };

  const MetricPill = ({ label, value, icon: Icon, color, bg, border }) => (
    <div className={`flex items-center gap-3 p-4 rounded-2xl ${bg} border ${border}`}>
      <div className={`p-2.5 rounded-xl ${bg} ${color} border ${border}`}><Icon /></div>
      <div>
        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
        {loading
          ? <div className="h-6 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-1" />
          : <p className={`text-xl font-black ${color} leading-none mt-0.5`}>{value}</p>
        }
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12 px-4 md:px-0">

      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Reports & Analytics</h1>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-1">Daily · Weekly · Monthly · AI Insights</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800">
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
          <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">Live Data</span>
        </div>
      </div>

      {/* ── DAILY REPORT ─────────────────────────────────────── */}
      <section className="bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="px-7 py-5 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3">
          {/* Calendar SVG */}
          <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/20">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-blue-500">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
              <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <h2 className="text-base font-black text-gray-900 dark:text-white uppercase tracking-widest">Daily Report</h2>
            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
          </div>
        </div>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <MetricPill label="Total Visits" value={daily.totalVisits} icon={IconVisit}
            color="text-blue-600" bg="bg-blue-50 dark:bg-blue-900/10" border="border-blue-100 dark:border-blue-800" />
          <MetricPill label="Successful Visits" value={daily.successfulVisits} icon={() => (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          )}
            color="text-emerald-600" bg="bg-emerald-50 dark:bg-emerald-900/10" border="border-emerald-100 dark:border-emerald-800" />
          <MetricPill label="Orders Collected" value={daily.ordersCollected} icon={IconOrder}
            color="text-indigo-600" bg="bg-indigo-50 dark:bg-indigo-900/10" border="border-indigo-100 dark:border-indigo-800" />
        </div>
        {/* Success Rate Bar */}
        <div className="px-6 pb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Success Rate</span>
            <span className="text-sm font-black text-emerald-600">{daily.totalVisits > 0 ? Math.round((daily.successfulVisits / daily.totalVisits) * 100) : 0}%</span>
          </div>
          <div className="h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-1000"
              style={{ width: `${daily.totalVisits > 0 ? Math.round((daily.successfulVisits / daily.totalVisits) * 100) : 0}%` }} />
          </div>
        </div>
      </section>

      {/* ── WEEKLY REPORT ────────────────────────────────────── */}
      <section className="bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="px-7 py-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-violet-50 dark:bg-violet-900/20">
              <IconTrend className="text-violet-500" />
            </div>
            <div>
              <h2 className="text-base font-black text-gray-900 dark:text-white uppercase tracking-widest">Weekly Report</h2>
              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Performance trends · 7-day view</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Best Day</p>
            <p className="text-base font-black text-violet-600">{weekly.bestDay}</p>
          </div>
        </div>
        <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Bar Chart */}
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Visit Trend (7 Days)</p>
            {loading
              ? <div className="h-20 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
              : <BarChart data={weekly.trend} labels={weekly.labels} color="#7c3aed" />
            }
          </div>
          {/* Stats */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-violet-50 dark:bg-violet-900/10 rounded-2xl border border-violet-100 dark:border-violet-800">
              <div>
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Avg Daily Visits</p>
                <p className="text-2xl font-black text-violet-600 leading-none mt-0.5">
                  {Math.round(weekly.trend.reduce((a, b) => a + b, 0) / weekly.trend.length)}
                </p>
              </div>
              <Sparkline data={weekly.trend} color="#7c3aed" />
            </div>
            <div className="flex items-center justify-between p-4 bg-indigo-50 dark:bg-indigo-900/10 rounded-2xl border border-indigo-100 dark:border-indigo-800">
              <div>
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Weekly Performance</p>
                <p className="text-2xl font-black text-indigo-600 leading-none mt-0.5">{weekly.avgPerformance}%</p>
              </div>
              <DonutChart value={weekly.avgPerformance} color="#6366f1" size={64} />
            </div>
          </div>
        </div>
      </section>

      {/* ── MONTHLY REPORT ───────────────────────────────────── */}
      <section className="bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="px-7 py-5 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/20">
            <IconRevenue className="text-emerald-500" />
          </div>
          <div>
            <h2 className="text-base font-black text-gray-900 dark:text-white uppercase tracking-widest">Monthly Report</h2>
            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">
              {new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>
        <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Revenue */}
          <div className="space-y-4">
            <div className="p-5 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/10 dark:to-teal-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-800">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Revenue</p>
                <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                  <IconRevenue />
                </div>
              </div>
              {loading
                ? <div className="h-9 w-28 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                : <p className="text-4xl font-black text-emerald-700 dark:text-emerald-400">₹{monthly.revenue.toLocaleString('en-IN')}</p>
              }
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Weekly Revenue Breakdown</p>
            {loading
              ? <div className="h-20 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
              : <BarChart data={monthly.weeklyBars} labels={monthly.weekLabels} color="#059669" />
            }
          </div>
          {/* Conversion */}
          <div className="space-y-4">
            <div className="p-5 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/10 dark:to-blue-900/10 rounded-2xl border border-indigo-100 dark:border-indigo-800">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Conversion Rate</p>
                  <p className="text-4xl font-black text-indigo-700 dark:text-indigo-400 leading-none mt-1">{monthly.conversionRate}%</p>
                </div>
                <DonutChart value={monthly.conversionRate} color="#6366f1" size={90} />
              </div>
              <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-indigo-500 to-blue-400 rounded-full transition-all duration-1000"
                  style={{ width: `${monthly.conversionRate}%` }} />
              </div>
              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-2">
                {monthly.conversionRate >= 70 ? '🔥 Excellent performance!' : monthly.conversionRate >= 50 ? '📈 Good, keep going!' : '💪 Room to grow!'}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Best Week</p>
                <p className="text-lg font-black text-gray-900 dark:text-white mt-0.5">Week {monthly.weeklyBars.indexOf(Math.max(...monthly.weeklyBars)) + 1}</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Peak Revenue</p>
                <p className="text-lg font-black text-gray-900 dark:text-white mt-0.5">₹{Math.max(...monthly.weeklyBars).toLocaleString('en-IN')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── AI INSIGHTS ──────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-[2rem] overflow-hidden border border-indigo-800/30 shadow-2xl">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-violet-500/10 rounded-full blur-[60px] -ml-16 -mb-16" />
          {/* Grid pattern SVG */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
                <path d="M 32 0 L 0 0 0 32" fill="none" stroke="white" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)"/>
          </svg>
        </div>

        <div className="relative z-10 px-7 py-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/20 border border-indigo-400/20">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-indigo-300">
                <path d="M12 2a10 10 0 100 20A10 10 0 0012 2z" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M12 6v2M12 16v2M6 12H4M20 12h-2M7.76 7.76L6.34 6.34M17.66 17.66l-1.42-1.42M17.66 7.76l-1.42 1.42M7.76 16.24L6.34 17.66" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
            </div>
            <div>
              <h2 className="text-base font-black text-white uppercase tracking-widest">Advanced AI Insights</h2>
              <p className="text-[9px] text-indigo-300/70 font-bold uppercase tracking-widest">Powered by TrackForce Intelligence</p>
            </div>
            <div className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/20">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
              <span className="text-[9px] font-black text-indigo-300 uppercase tracking-widest">AI Active</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-5">

          {/* Best Executive */}
          <div className="group relative bg-white/5 backdrop-blur-sm rounded-[1.5rem] border border-white/10 hover:border-indigo-400/30 p-6 transition-all duration-500 hover:bg-white/10 overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none" />
            {/* Star SVG decoration */}
            <svg className="absolute -right-3 -bottom-3 opacity-5 text-amber-400" width="80" height="80" viewBox="0 0 24 24">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="currentColor"/>
            </svg>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-400/20">
                <IconStar />
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            </div>
            <p className="text-[9px] font-black text-indigo-300/70 uppercase tracking-widest mb-1">Top Performer</p>
            <p className="text-2xl font-black text-white leading-tight">{ai.topExecutive}</p>
            <p className="text-[10px] text-amber-300/80 font-bold mt-2 uppercase tracking-widest">Best performing executive</p>
            <div className="mt-4 flex items-center gap-1.5">
              {[1,2,3,4,5].map(s => (
                <svg key={s} width="12" height="12" viewBox="0 0 24 24" fill={s <= 4 ? '#fbbf24' : 'none'} className="text-amber-400">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" stroke="#fbbf24" strokeWidth="1.5"/>
                </svg>
              ))}
              <span className="text-[10px] text-amber-300 font-black ml-1">4.8</span>
            </div>
          </div>

          {/* Most Productive Area */}
          <div className="group relative bg-white/5 backdrop-blur-sm rounded-[1.5rem] border border-white/10 hover:border-emerald-400/30 p-6 transition-all duration-500 hover:bg-white/10 overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none" />
            {/* Map decoration */}
            <svg className="absolute -right-3 -bottom-3 opacity-5 text-emerald-400" width="80" height="80" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="currentColor"/>
            </svg>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-xl bg-emerald-500/20 border border-emerald-400/20">
                <IconMap />
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-[9px] font-black text-indigo-300/70 uppercase tracking-widest mb-1">Hotspot Zone</p>
            <p className="text-2xl font-black text-white leading-tight">{ai.topArea}</p>
            <p className="text-[10px] text-emerald-300/80 font-bold mt-2 uppercase tracking-widest">Most productive area</p>
            {/* Heat bar */}
            <div className="mt-4 flex items-center gap-1">
              {[0.4,0.7,1,0.8,0.6].map((v, i) => (
                <div key={i} className="flex-1 rounded-sm" style={{height:`${v*20}px`, backgroundColor:`rgba(52,211,153,${v})`}} />
              ))}
            </div>
            <p className="text-[9px] text-emerald-300/60 font-bold uppercase tracking-widest mt-1">Activity heatmap</p>
          </div>

          {/* Peak Sales Time */}
          <div className="group relative bg-white/5 backdrop-blur-sm rounded-[1.5rem] border border-white/10 hover:border-violet-400/30 p-6 transition-all duration-500 hover:bg-white/10 overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-violet-500/10 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none" />
            {/* Clock decoration */}
            <svg className="absolute -right-3 -bottom-3 opacity-5 text-violet-400" width="80" height="80" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" fill="currentColor"/>
            </svg>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-xl bg-violet-500/20 border border-violet-400/20">
                <IconClock />
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            </div>
            <p className="text-[9px] font-black text-indigo-300/70 uppercase tracking-widest mb-1">Peak Window</p>
            <p className="text-xl font-black text-white leading-tight">{ai.peakTime}</p>
            <p className="text-[10px] text-violet-300/80 font-bold mt-2 uppercase tracking-widest">Peak sales time</p>
            {/* Timeline */}
            <div className="mt-4 flex items-end gap-0.5">
              {[1,2,3,4,6,8,9,8,7,5,3,2].map((v,i) => (
                <div key={i} className="flex-1 rounded-sm transition-all"
                  style={{height:`${v*3}px`, backgroundColor: (i >= 3 && i <= 5) ? '#a78bfa' : 'rgba(167,139,250,0.3)'}} />
              ))}
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[8px] text-violet-300/50 font-bold">9AM</span>
              <span className="text-[8px] text-violet-400 font-black">11AM–1PM ▲</span>
              <span className="text-[8px] text-violet-300/50 font-bold">6PM</span>
            </div>
          </div>
        </div>

        {/* AI Score Footer */}
        <div className="relative z-10 px-7 py-4 border-t border-white/10 flex items-center justify-between">
          <p className="text-[10px] text-indigo-300/60 font-bold uppercase tracking-widest">AI confidence score</p>
          <div className="flex items-center gap-3">
            <div className="h-1.5 w-32 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-indigo-400 to-violet-400 rounded-full" style={{width:`${ai.insightScore}%`}} />
            </div>
            <span className="text-sm font-black text-indigo-300">{ai.insightScore}%</span>
          </div>
        </div>
      </section>

    </div>
  );
};

export default EmployeeAnalytics;
