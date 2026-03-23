import React, { useState } from 'react';
import { 
  BarChart3, 
  PieChart, 
  LineChart, 
  TrendingUp, 
  Calendar, 
  Download, 
  Users, 
  DollarSign, 
  Map, 
  AlertTriangle, 
  Trophy, 
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  ChevronDown,
  ChevronUp,
  Info,
  Layers,
  MousePointer2,
  Store,
  Briefcase,
  Target,
  Award,
  CheckCircle
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import DashboardCard from '../../components/DashboardCard';
import DataTable from '../../components/DataTable';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Analytics = () => {
  const [selectedMetric, setSelectedMetric] = useState(null);
  const [showTrendData, setShowTrendData] = useState(false);
  const [activeMetric, setActiveMetric] = useState('Revenue');
  const [selectedManager, setSelectedManager] = useState(null);
  
  const [timeRange, setTimeRange] = useState('Last Quarter');
  const [showTimeRangeDropdown, setShowTimeRangeDropdown] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadReport = () => {
    if (isDownloading) return;
    setIsDownloading(true);
    setTimeout(() => {
      const csvContent = "data:text/csv;charset=utf-8,Metric,Value,Trend\nRevenue,94.2%,+12.5%\nManagers,4.8/5.0,+0.3%\nEfficiency,88.5%,+5.1%\n";
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `trackforce_analytics_${timeRange.replace(/\s+/g, '_').toLowerCase()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setIsDownloading(false);
    }, 1500);
  };

  // Chart Data
  const chartData = {
    Revenue: [40, 60, 45, 80, 55, 90, 75, 100, 85, 95, 70, 110],
    Visits: [120, 150, 140, 180, 210, 190, 230, 250, 240, 280, 260, 300],
    Orders: [15, 22, 18, 25, 30, 28, 35, 40, 38, 45, 42, 50]
  };

  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const data = {
    labels,
    datasets: [
      {
        fill: true,
        label: activeMetric,
        data: chartData[activeMetric],
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#6366f1',
        pointBorderColor: '#fff',
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#1e293b',
        titleFont: { size: 12, weight: 'bold' },
        bodyFont: { size: 12 },
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#94a3b8', font: { size: 10, weight: '600' } }
      },
      y: {
        grid: { color: 'rgba(148, 163, 184, 0.1)' },
        ticks: { color: '#94a3b8', font: { size: 10, weight: '600' } }
      },
    },
  };

  // Mock Data
  const managerPerformance = [
    { id: 1, name: 'Alex Johnson', team: 'Field Sales A', targets: '92%', rating: 4.8, status: 'Top Performer' },
    { id: 2, name: 'Sarah Williams', team: 'Operations East', targets: '88%', rating: 4.5, status: 'On Track' },
    { id: 3, name: 'Michael Chen', team: 'Direct Marketing', targets: '75%', rating: 3.9, status: 'Under Review' },
    { id: 4, name: 'Emma Davis', team: 'Field Sales B', targets: '95%', rating: 4.9, status: 'Top Performer' },
  ];

  const managerColumns = [
    { header: 'Manager', accessor: 'name', render: (row) => (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 font-bold text-xs">
          {row.name.charAt(0)}
        </div>
        <span className="font-bold">{row.name}</span>
      </div>
    )},
    { header: 'Team', accessor: 'team' },
    { header: 'Goal Attain.', accessor: 'targets' },
    { header: 'Rating', accessor: 'rating', render: (row) => (
      <div className="flex items-center gap-1 text-amber-500">
        <Trophy size={14} />
        <span>{row.rating}</span>
      </div>
    )},
    { header: 'Status', accessor: 'status', render: (row) => (
      <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase ${
        row.status === 'Top Performer' ? 'bg-emerald-100 text-emerald-600' : 
        row.status === 'Under Review' ? 'bg-rose-100 text-rose-600' : 'bg-blue-100 text-blue-600'
      }`}>
        {row.status}
      </span>
    )},
  ];

  const risks = [
    { title: 'Delayed Shipments', impact: 'High', zone: 'North Region', icon: AlertTriangle, color: 'text-rose-500', details: '3 shipments stuck in transit due to weather. ETA +48h.' },
    { title: 'Resource Shortage', impact: 'Medium', zone: 'West Coast', icon: Activity, color: 'text-amber-500', details: '2 field executives on leave. Regional backup requested.' },
    { title: 'Compliance Gap', impact: 'High', zone: 'All Zones', icon: AlertTriangle, color: 'text-rose-500', details: 'Quarterly safety training pending for 15% of staff.' },
  ];

  const overviewMetrics = [
    { 
      id: 'biz', 
      title: 'Business Performance', 
      value: '94.2%', 
      icon: Briefcase, 
      color: 'text-indigo-600',
      trend: 'up',
      trendValue: '4.2',
      details: [
        { label: 'Revenue vs Target', value: '+12.5%' },
        { label: 'Operating Margin', value: '28.4%' },
        { label: 'Profit Growth', value: '+8.2%' }
      ]
    },
    { 
      id: 'mgr', 
      title: 'Manager Performance', 
      value: '4.8/5.0', 
      icon: Trophy, 
      color: 'text-emerald-600',
      trend: 'up',
      trendValue: '0.3',
      details: [
        { label: 'Avg Rating', value: '4.8' },
        { label: 'Goal Attainment', value: '92%' },
        { label: 'Retention Rate', value: '96%' }
      ]
    },
    { 
      id: 'workforce', 
      title: 'Workforce Efficiency', 
      value: '88.5%', 
      icon: Users, 
      color: 'text-blue-600',
      trend: 'up',
      trendValue: '5.1',
      details: [
        { label: 'Utilization', value: '88.5%' },
        { label: 'Tasks/Day', value: '14.2' },
        { label: 'Avg Journey', value: '32km' }
      ]
    },
    { 
      id: 'territory', 
      title: 'Territory Profitability', 
      value: '+$420k', 
      icon: Map, 
      color: 'text-amber-600',
      trend: 'up',
      trendValue: '12.4',
      details: [
        { label: 'Top Region', value: 'North' },
        { label: 'Cost/Territory', value: '$12k' },
        { label: 'ROI', value: '3.4x' }
      ]
    },
    { 
      id: 'store', 
      title: 'Store Profitability', 
      value: '$12.4k', 
      icon: Store, 
      color: 'text-rose-600',
      trend: 'down',
      trendValue: '2.1',
      details: [
        { label: 'Sales/Store', value: '$12.4k' },
        { label: 'Footfall Conv.', value: '18%' },
        { label: 'Overheads', value: '14%' }
      ]
    },
    { 
      id: 'growth', 
      title: 'Growth Analysis', 
      value: '+12.5%', 
      icon: TrendingUp, 
      color: 'text-indigo-600',
      trend: 'up',
      trendValue: '8.4',
      details: [
        { label: 'YoY Growth', value: '+12.5%' },
        { label: 'New Markets', value: '3' },
        { label: 'Churn Rate', value: '1.2%' }
      ]
    }
  ];

  const getMetricById = (id) => overviewMetrics.find(m => m.id === id);

  const DetailOverlay = ({ metric, onClose }) => {
    if (!metric) return null;
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 md:p-8 animate-in fade-in duration-300">
        <div 
          className="absolute inset-0 bg-gray-900/60 backdrop-blur-md"
          onClick={onClose}
        ></div>
        <div className="relative bg-white dark:bg-gray-900 w-full max-w-lg rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-500">
          <div className="p-8 space-y-8">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-5">
                <div className={`w-16 h-16 rounded-3xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center ${metric.color} shadow-sm`}>
                  <metric.icon size={32} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{metric.title}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-3xl font-black text-gray-900 dark:text-white">{metric.value}</span>
                    <span className={`flex items-center gap-0.5 text-xs font-black uppercase px-2 py-0.5 rounded-lg ${metric.trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                      {metric.trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                      {metric.trendValue}%
                    </span>
                  </div>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-400 hover:text-gray-600"
              >
                <ChevronDown size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {metric.details.map((detail, idx) => (
                <div key={idx} className="p-5 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center justify-between group hover:border-indigo-500 transition-all">
                  <span className="text-sm font-bold text-gray-500 dark:text-gray-400">{detail.label}</span>
                  <span className={`text-lg font-black ${metric.color}`}>{detail.value}</span>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <button className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 transition-all">
                Download Detailed Report
              </button>
            </div>
          </div>
          <div className="h-2 w-full bg-indigo-600"></div>
        </div>
      </div>
    );
  };

  const ManagerDetailOverlay = ({ manager, onClose }) => {
    if (!manager) return null;
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 md:p-8 animate-in fade-in duration-300">
        <div 
          className="absolute inset-0 bg-gray-900/60 backdrop-blur-md"
          onClick={onClose}
        ></div>
        <div className="relative bg-white dark:bg-gray-900 w-full max-w-2xl rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-500 flex flex-col max-h-[90vh]">
          
          <div className="p-8 pb-6 border-b border-gray-50 dark:border-gray-800 flex flex-shrink-0 items-start justify-between bg-white dark:bg-gray-900 z-10">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-[2rem] bg-indigo-50 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-600 font-black text-2xl shadow-inner border border-indigo-100 dark:border-indigo-800/50">
                {manager.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">{manager.name}</h2>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="text-sm font-bold text-indigo-600 uppercase tracking-widest">{manager.team}</span>
                  <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase ${
                    manager.status === 'Top Performer' ? 'bg-emerald-100 text-emerald-600' : 
                    manager.status === 'Under Review' ? 'bg-rose-100 text-rose-600' : 'bg-blue-100 text-blue-600'
                  }`}>
                    {manager.status}
                  </span>
                </div>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-400 hover:text-gray-600"
            >
              <ChevronDown size={24} />
            </button>
          </div>

          <div className="p-8 overflow-y-auto flex-1 bg-gray-50/50 dark:bg-gray-900">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-4 text-emerald-600">
                  <Trophy size={20} />
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Rating</span>
                </div>
                <p className="text-3xl font-black text-gray-900 dark:text-white">{manager.rating}<span className="text-lg text-gray-400">/5.0</span></p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-4 text-indigo-600">
                  <Target size={20} />
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Attainment</span>
                </div>
                <p className="text-3xl font-black text-gray-900 dark:text-white">{manager.targets}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-4 text-blue-600">
                  <Users size={20} />
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Team Size</span>
                </div>
                <p className="text-3xl font-black text-gray-900 dark:text-white">24<span className="text-sm tracking-normal font-medium text-gray-400 block mt-1">Active Members</span></p>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-sm font-black text-gray-900 dark:text-white tracking-widest uppercase border-b border-gray-200 dark:border-gray-800 pb-2">Recent Performance Highlights</h3>
              <div className="space-y-4">
                <div className="flex gap-4 p-4 bg-white dark:bg-gray-800 rounded-2xl border border-emerald-100 dark:border-emerald-900/30">
                  <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-xl h-fit">
                    <CheckCircle size={16} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">Q3 Targets Exceeded</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Team achieved 112% of quarterly revenue goals.</p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 bg-white dark:bg-gray-800 rounded-2xl border border-indigo-100 dark:border-indigo-900/30">
                  <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-xl h-fit">
                    <Award size={16} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">Lowest Churn Rate</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Maintained 98% employee retention over 6 months.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-6 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3 bg-white dark:bg-gray-900">
            <button 
              onClick={onClose}
              className="px-6 py-3 font-bold text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
            >
              Close
            </button>
            <button className="px-6 py-3 bg-indigo-600 text-white font-black rounded-2xl shadow-lg shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 transition-all flex items-center gap-2">
              <Download size={16} /> Download Full Report
            </button>
          </div>

        </div>
      </div>
    );
  };

  return (
    <>
      <div className="space-y-8 animate-in fade-in duration-500 pb-12">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-50">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Enterprise Analytics</h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Comprehensive performance metrics and operational insights.</p>
        </div>
        <div className="flex items-center gap-3 relative">
          <div className="relative">
            <button 
              onClick={() => setShowTimeRangeDropdown(!showTimeRangeDropdown)}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-2 flex items-center gap-2 cursor-pointer hover:border-indigo-500 transition-all"
            >
              <Calendar size={18} className="text-gray-400" />
              <span className="text-sm font-bold text-gray-900 dark:text-white min-w-[90px] text-left">{timeRange}</span>
              <ChevronDown size={14} className="text-gray-400 opacity-50" />
            </button>

            {showTimeRangeDropdown && (
              <>
                <div 
                  className="fixed inset-0 z-40"
                  onClick={() => setShowTimeRangeDropdown(false)}
                ></div>
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  {['Last 7 Days', 'Last Month', 'Last Quarter', 'Year to Date'].map((range) => (
                    <button
                      key={range}
                      onClick={() => {
                        setTimeRange(range);
                        setShowTimeRangeDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-3 text-sm font-bold transition-colors ${
                        timeRange === range 
                          ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' 
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <button 
            onClick={handleDownloadReport}
            disabled={isDownloading}
            className="p-2 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 transition-all group overflow-hidden relative w-10 h-10 flex items-center justify-center disabled:opacity-70"
            title="Download CSV Report"
          >
            {isDownloading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <Download size={20} className="group-hover:-translate-y-0.5 transition-transform" />
            )}
          </button>
        </div>
      </div>

      {/* REFINED OVERVIEW CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {overviewMetrics.map((metric) => (
          <DashboardCard 
            key={metric.id}
            title={metric.title} 
            value={metric.value} 
            icon={metric.icon} 
            trend={metric.trend} 
            trendValue={metric.trendValue} 
            colorClass={metric.color}
            onClick={() => setSelectedMetric(metric.id)}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Trends - Real Graph */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col min-h-[450px]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div className="space-y-1">
              <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <TrendingUp size={18} className="text-indigo-600" />
                Performance Trends
              </h3>
              <p className="text-xs text-gray-400 font-medium">Interactive data visualization of key metrics</p>
            </div>
            
            <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 p-1.5 rounded-xl border border-gray-100 dark:border-gray-700">
              {['Revenue', 'Visits', 'Orders'].map(m => (
                <button
                  key={m}
                  onClick={() => setActiveMetric(m)}
                  className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${
                    activeMetric === m 
                      ? 'bg-white dark:bg-gray-700 text-indigo-600 shadow-sm' 
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {m === 'Revenue' && <DollarSign size={12} className="inline mr-1 mb-0.5" />}
                  {m === 'Visits' && <MousePointer2 size={12} className="inline mr-1 mb-0.5" />}
                  {m === 'Orders' && <Layers size={12} className="inline mr-1 mb-0.5" />}
                  {m}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex-1 min-h-[300px] relative">
            <Line data={data} options={options} />
          </div>

          <div className="mt-6 flex items-center justify-between pt-6 border-t border-gray-50 dark:border-gray-800">
            <div className="flex gap-8">
              <div className="text-center">
                <p className="text-2xl font-black text-gray-900 dark:text-white">+24%</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Growth</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-black text-gray-900 dark:text-white">98.2%</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Efficiency</p>
              </div>
            </div>
            <button 
              onClick={() => setShowTrendData(!showTrendData)}
              className="flex items-center gap-2 text-[10px] font-black uppercase text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 px-4 py-2 rounded-xl transition-all border border-indigo-100 dark:border-indigo-900/30"
            >
              <BarChart3 size={14} />
              {showTrendData ? 'Hide Summary' : 'Raw Data'}
            </button>
          </div>

          {showTrendData && (
            <div className="mt-6 p-4 bg-indigo-50/30 dark:bg-indigo-900/10 rounded-2xl animate-in fade-in zoom-in duration-300">
               <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-indigo-100/50 dark:border-indigo-900/30">
                    <th className="pb-3">Month</th>
                    <th className="pb-3 text-right">{activeMetric}</th>
                    <th className="pb-3 text-right">Trend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-indigo-50/50 dark:divide-indigo-900/20 font-bold text-sm">
                  {chartData[activeMetric].slice(-3).map((val, i) => (
                    <tr key={i} className="text-gray-700 dark:text-gray-300">
                      <td className="py-3">{labels[9+i]}</td>
                      <td className="py-3 text-right text-gray-900 dark:text-white">
                        {activeMetric === 'Revenue' ? `$${val/10}M` : val}
                      </td>
                      <td className="py-3 text-right text-emerald-500">
                        <ArrowUpRight size={14} className="inline mr-1" />
                        {Math.floor(Math.random() * 15) + 5}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Zone Analytics / Revenue Analysis */}
        <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-8">
          <div className="space-y-1">
            <h3 className="font-bold text-gray-900 dark:text-white">Zone & Revenue Analysis</h3>
            <p className="text-xs text-gray-400 font-medium">Geographic revenue distribution</p>
          </div>
          
          <div className="space-y-6">
            {[
              { label: 'North Region', value: 42, color: 'bg-indigo-500', revenue: '$1.7M' },
              { label: 'South Region', value: 28, color: 'bg-emerald-500', revenue: '$1.2M' },
              { label: 'West Coast', value: 18, color: 'bg-blue-500', revenue: '$0.8M' },
              { label: 'East Coast', value: 12, color: 'bg-gray-200', revenue: '$0.5M' },
            ].map((item, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">{item.label}</span>
                    <span className="text-gray-900 dark:text-white">{item.value}%</span>
                  </div>
                  <span className="text-indigo-600 dark:text-indigo-400">{item.revenue}</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} transition-all duration-1000`} style={{ width: `${item.value}%` }}></div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-gray-50 dark:border-gray-800">
            <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Top Zone</p>
                <ArrowUpRight size={14} className="text-indigo-600" />
              </div>
              <div>
                <p className="text-lg font-black text-gray-900 dark:text-white">North Region</p>
                <p className="text-xs text-gray-500 font-medium">Outperforming targets by 15%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Manager Performance & Risk Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Manager Performance Analysis */}
        <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div className="space-y-1">
              <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                Manager Performance Analysis
              </h3>
              <p className="text-xs text-gray-400 font-medium">Individual leadership efficiency metrics</p>
            </div>
            <button className="text-indigo-600 text-xs font-black uppercase tracking-widest hover:underline">View All</button>
          </div>
          
          <DataTable columns={managerColumns} data={managerPerformance} onRowClick={(row) => setSelectedManager(row)} />
        </div>

        {/* Exception and Risk Analysis */}
        <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="space-y-1">
              <h3 className="font-bold text-gray-900 dark:text-white">Exception & Risk Analysis</h3>
              <p className="text-xs text-gray-400 font-medium">Operational flags and risk assessment</p>
            </div>
            <span className="px-3 py-1 bg-rose-50 dark:bg-rose-900/20 text-rose-600 rounded-lg text-[10px] font-black uppercase">3 Active Issues</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {risks.map((risk, i) => (
              <div 
                key={i} 
                className={`flex flex-col p-4 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-indigo-500 transition-all group`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center ${risk.color} group-hover:scale-110 transition-transform`}>
                      <risk.icon size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white">{risk.title}</h4>
                      <p className="text-xs text-gray-400 font-medium">{risk.zone}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-xs font-black uppercase tracking-widest ${risk.impact === 'High' ? 'text-rose-600' : 'text-amber-600'}`}>{risk.impact} Impact</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Priority</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-6 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-3xl text-white relative overflow-hidden group">
            <div className="relative z-10 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-bold opacity-80 uppercase tracking-widest">System Health</p>
                <h3 className="text-3xl font-black">94.8%</h3>
                <p className="text-xs font-medium opacity-80">All operations within safe threshold</p>
              </div>
              <Activity size={40} className="opacity-20 group-hover:scale-125 transition-transform duration-500" />
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-white/20 transition-all duration-500"></div>
          </div>
        </div>
      </div>
      </div>
      
      {/* Overlays */}
      {selectedMetric && (
        <DetailOverlay 
          metric={getMetricById(selectedMetric)} 
          onClose={() => setSelectedMetric(null)} 
        />
      )}
      {selectedManager && (
        <ManagerDetailOverlay 
           manager={selectedManager}
           onClose={() => setSelectedManager(null)}
        />
      )}
    </>
  );
};

export default Analytics;
