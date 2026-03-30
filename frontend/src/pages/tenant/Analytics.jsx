import React, { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
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
  ChevronLeft,
  ChevronRight,
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
import DashboardCard from '../../components/ui/DashboardCard';
import DataTable from '../../components/ui/DataTable';
import { getManagers } from '../../services/core/tenantService';

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
  const { setPageLoading } = useOutletContext();
  const [selectedMetric, setSelectedMetric] = useState(null);
  const [showTrendData, setShowTrendData] = useState(false);
  const [activeMetric, setActiveMetric] = useState('Revenue');
  const [selectedManager, setSelectedManager] = useState(null);

  const [timeRange, setTimeRange] = useState('Last Quarter');
  const [showTimeRangeDropdown, setShowTimeRangeDropdown] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // New states for real-time data and pagination
  const [managers, setManagers] = useState([]);
  const [isLoadingManagers, setIsLoadingManagers] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  React.useEffect(() => {
    const fetchManagers = async () => {
      try {
        setIsLoadingManagers(true);
        const data = await getManagers();
        setManagers(data);
      } catch (error) {
        console.error('Error fetching managers:', error);
      } finally {
        setIsLoadingManagers(false);
        if (setPageLoading) setPageLoading(false);
      }
    };
    fetchManagers();
  }, []);

  const totalPages = Math.ceil(managers.length / itemsPerPage);
  const paginatedManagers = managers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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

  // Manager columns definition moved below state

  const managerColumns = [
    {
      header: 'Manager', accessor: 'name', render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 font-bold text-xs">
            {row.name.charAt(0)}
          </div>
          <span className="font-bold">{row.name}</span>
        </div>
      )
    },
    {
      header: 'Organization', accessor: 'company', render: (row) => (
        <span className="font-bold text-indigo-600 dark:text-indigo-400">{row.company}</span>
      )
    },
    { header: 'Team', accessor: 'profile', render: (row) => row.profile?.team || 'N/A' },
    { header: 'Designation', accessor: 'profile', render: (row) => row.profile?.designation || 'N/A' },
    {
      header: 'Status', accessor: 'status', render: (row) => (
        <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase ${row.status === 'Active' ? 'bg-emerald-100 text-emerald-600' :
            row.status === 'Inactive' ? 'bg-rose-100 text-rose-600' : 'bg-blue-100 text-blue-600'
          }`}>
          {row.status}
        </span>
      )
    },
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
                  <span className="text-sm font-bold text-indigo-600 uppercase tracking-widest">{manager.company}</span>
                  <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase ${manager.status === 'Active' ? 'bg-emerald-100 text-emerald-600' :
                      manager.status === 'Inactive' ? 'bg-rose-100 text-rose-600' : 'bg-blue-100 text-blue-600'
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
                  <Briefcase size={20} />
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Designation</span>
                </div>
                <p className="text-xl font-black text-gray-900 dark:text-white">{manager.profile?.designation || 'N/A'}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-4 text-indigo-600">
                  <Users size={20} />
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Team</span>
                </div>
                <p className="text-xl font-black text-gray-900 dark:text-white">{manager.profile?.team || 'N/A'}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-4 text-blue-600">
                  <Calendar size={20} />
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Joined</span>
                </div>
                <p className="text-xl font-black text-gray-900 dark:text-white">{new Date(manager.createdAt).toLocaleDateString()}</p>
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
                        className={`w-full text-left px-4 py-3 text-sm font-bold transition-colors ${timeRange === range
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
                    className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${activeMetric === m
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
                        <td className="py-3">{labels[9 + i]}</td>
                        <td className="py-3 text-right text-gray-900 dark:text-white">
                          {activeMetric === 'Revenue' ? `$${val / 10}M` : val}
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

        {/* Manager Performance Analysis - Expanded */}
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div className="space-y-1">
                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  Manager Performance Analysis
                </h3>
                <p className="text-xs text-gray-400 font-medium">Individual leadership efficiency metrics and organization details</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-lg text-[10px] font-black uppercase">
                  {managers.length} Total Managers
                </span>
              </div>
            </div>

            <DataTable
              columns={managerColumns}
              data={paginatedManagers}
              isLoading={isLoadingManagers}
              onRowClick={(row) => setSelectedManager(row)}
            />

            {/* Pagination Controls */}
            <div className="mt-8 flex items-center justify-between pt-6 border-t border-gray-50 dark:border-gray-800">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Showing {Math.min(managers.length, (currentPage - 1) * itemsPerPage + 1)} to {Math.min(managers.length, currentPage * itemsPerPage)} of {managers.length}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="p-2 border border-gray-100 dark:border-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-30 transition-all"
                >
                  <ChevronLeft size={18} />
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-8 h-8 rounded-xl text-xs font-black transition-all ${currentPage === i + 1
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                        : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="p-2 border border-gray-100 dark:border-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-30 transition-all"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
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
