// Import required React hooks and navigation
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Import UI icons from lucide-react library
import { 
  ArrowLeft, Activity, Eye, MapPin, Briefcase, Store, FileText, 
  ClipboardList, CheckCircle2, Clock, Ban, ChevronRight, TrendingUp 
} from 'lucide-react';

// Import Chart.js components and configuration
import { 
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip 
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register Chart.js components for use
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip);

// Main Analytics component with state management
const IntelligenceSuite = () => {
  // State hooks for managing view, filters, and selected employee
  const [view, setView] = useState('list');
  const [statusFilter, setStatusFilter] = useState('All');
  const [timeFilter, setTimeFilter] = useState('Daily');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const navigate = useNavigate();

  // Static data: Employee information with performance metrics
  const employees = [
    { id: 1, name: 'Arjun Mehta', task: 'Beverage Delivery', success: 94, efficiency: 94, revenue: 4200, initial: 'AM', role: 'Senior Field Lead', zone: 'South', status: 'Online' },
    { id: 2, name: 'Sanya Iyer', task: 'Shelf Audit', success: 88, efficiency: 88, revenue: 3850, initial: 'SI', role: 'Field Executive', zone: 'North', status: 'Online' },
    { id: 3, name: 'Rahul Verma', task: 'Client Meeting', success: 91, efficiency: 91, revenue: 5100, initial: 'RV', role: 'Account Manager', zone: 'West', status: 'Offline' },
    { id: 4, name: 'Priya Sharma', task: 'Payment Collection', success: 82, efficiency: 82, revenue: 2900, initial: 'PS', role: 'Field Executive', zone: 'East', status: 'Online' },
  ];

  // Static data: Task logs with status and details
  const taskLogs = [
    { id: 101, title: 'Inventory Stock Check', client: 'City Mart', status: 'Completed', date: '10:30 AM', brief: 'Verified warehouse levels against digital records for weekly reconciliation.' },
    { id: 102, title: 'Shelf Visibility Audit', client: 'Grand Plaza', status: 'Ongoing', date: '01:15 PM', brief: 'Monitoring brand shelf share and competitor placement in the dairy aisle.' },
    { id: 103, title: 'Promotional Setup', client: 'Metro Store', status: 'Pending', date: '04:00 PM', brief: 'Installing seasonal marketing banners and secondary display units.' },
    { id: 104, title: 'Safety Inspection', client: 'Quick Shop', status: 'Rejected', date: 'Yesterday', brief: 'Compliance check for outlet storage safety and fire protocols.' },
  ];

  // Chart configuration for sparkline visualization
  const chartOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { x: { display: false }, y: { display: false } },
    elements: { line: { tension: 0.4 }, point: { radius: 0 } }
  };

  // Sample data for sparkline charts
  const sparklineData = {
    labels: ['', '', '', '', '', '', ''],
    datasets: [{ data: [40, 55, 45, 80, 60, 95, 90], borderColor: '#3b82f6', backgroundColor: 'rgba(59, 130, 246, 0.1)', fill: true, borderWidth: 2 }]
  };

  // List View component: Shows employee performance overview
  const ListView = () => (
    // Main container with dark mode support and padding
    <div className="min-h-screen bg-gray-50 dark:bg-[#0b0d11] p-6 transition-colors duration-500">
      // Header section with title and time filter buttons
      <div className="flex justify-between items-center mb-8">
        <div>
          // Page title with activity icon and subtitle
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Activity className="text-blue-600" /> Performance Suite
          </h1>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">Fleet Executive Management</p>
        </div>
        // Time filter toggle buttons (Daily, Weekly, Monthly)
        <div className="flex bg-white dark:bg-[#16191f] p-1 rounded-xl shadow-sm border dark:border-slate-800">
          {['Daily', 'Weekly', 'Monthly'].map(f => (
            <button key={f} onClick={() => setTimeFilter(f)} className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${timeFilter === f ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-blue-500'}`}>{f}</button>
          ))}
        </div>
      </div>

      // Performance metrics cards grid
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Revenue', val: '$22,500' },
          { label: 'Active Tasks', val: '42' },
          { label: 'Avg Success', val: '91.4%' },
          { label: 'Total Performance', val: '85%' }
        ].map((card, i) => (
          // Individual metric card with hover effects and sparkline chart
          <div key={i} className="group relative bg-white dark:bg-[#16191f] border-2 border-transparent p-6 rounded-[2rem] shadow-sm hover:border-blue-500 transition-all overflow-hidden">
            <div className="relative z-10">
              // Metric label and value
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{card.label}</p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">{card.val}</h3>
            </div>
            // Sparkline chart background visualization
            <div className="absolute bottom-0 left-0 w-full h-10 opacity-20 group-hover:opacity-60 transition-opacity">
              <Line data={sparklineData} options={chartOptions} />
            </div>
          </div>
        ))}
      </div>

      // Employee list table with dark theme
      <div className="bg-[#16191f] border border-slate-800 rounded-[2rem] overflow-hidden shadow-xl">
        // Table header with column titles
        <div className="grid grid-cols-5 p-6 border-b border-slate-800 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
          <span>Executive</span>
          <span>Current Status</span>
          <span className="text-center">Efficiency</span>
          <span className="text-center">Revenue</span>
          <span className="text-right">Action</span>
        </div>

        // Employee rows with click handlers for navigation
        <div className="divide-y divide-slate-800/50">
          {employees.map((exec) => (
            <div 
              key={exec.id}
              onClick={() => {
                setSelectedEmployee(exec);
                setView('profile');
              }}
              className="grid grid-cols-5 p-6 items-center hover:bg-slate-800/30 transition-all cursor-pointer group"
            >
              // Employee info section with avatar and name
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-sm font-black text-white shadow-lg shadow-blue-600/20">
                  {exec.initial}
                </div>
                <span className="font-black text-white tracking-tight">{exec.name}</span>
              </div>
              // Task and status information
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-300">{exec.task}</span>
                <span className="text-[9px] font-black text-blue-500 uppercase tracking-tighter">{exec.status} Now</span>
              </div>
              // Efficiency percentage display
              <div className="text-center">
                <span className="text-lg font-black text-emerald-500 italic">{exec.efficiency}%</span>
              </div>
              // Revenue amount display
              <div className="text-center">
                <span className="text-lg font-black text-white tracking-tighter">${exec.revenue}</span>
              </div>
              // Profile action button
              <div className="flex justify-end">
                <button className="text-[10px] font-black uppercase text-blue-500 group-hover:text-blue-400 group-hover:underline tracking-widest">
                  Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Profile View component: Shows detailed employee information
  const ProfileView = () => {
    // Calculate circular progress indicator values
    const radius = 20;
    const circumference = 2 * Math.PI * radius;
    const successPercentage = selectedEmployee?.success || 0;
    const strokeDashoffset = circumference - (successPercentage / 100) * circumference;

    return (
      // Profile page container with dark mode support
      <div className="min-h-screen bg-gray-50 dark:bg-[#0b0d11] p-4 transition-colors duration-500">
        // Back navigation button
        <button
          onClick={() => setView('list')}
          className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 hover:text-blue-600 mb-4 transition-colors tracking-wider"
        >
          <ArrowLeft size={14}/> Back to Fleet
        </button>

        // Employee profile header card with avatar and success rate
        <div className="bg-white dark:bg-[#16191f] border-2 border-transparent hover:border-blue-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] p-6 rounded-[2rem] shadow-sm flex flex-col md:flex-row items-center justify-between mb-4 transition-all duration-300 group">
          // Employee avatar and basic information
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-2xl font-black shadow-lg shadow-blue-500/20">
              {selectedEmployee?.initial}
            </div>
            <div>
              // Employee name and role details
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
                {selectedEmployee?.name}
              </h2>
              <div className="flex gap-3 mt-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <span className="flex items-center gap-1"><Briefcase size={12}/> {selectedEmployee?.role}</span>
                <span className="flex items-center gap-1"><MapPin size={12}/> {selectedEmployee?.zone} Zone</span>
              </div>
            </div>
          </div>

          // Circular progress indicator and success rate
          <div className="flex items-center gap-6 mt-4 md:mt-0 pr-2">
            <div className="relative flex items-center justify-center">
              // SVG circular progress bar
              <svg className="w-16 h-16 transform -rotate-90">
                <circle cx="32" cy="32" r={radius} stroke="currentColor" strokeWidth="6" fill="transparent" className="text-slate-100 dark:text-slate-800" />
                <circle
                  cx="32" cy="32" r={radius} stroke="currentColor" strokeWidth="6" fill="transparent"
                  strokeDasharray={circumference}
                  style={{ strokeDashoffset, transition: 'stroke-dashoffset 1.5s ease-in-out' }}
                  strokeLinecap="round"
                  className="text-blue-600 drop-shadow-[0_0_5px_rgba(59,130,246,0.6)]"
                />
              </svg>
              <TrendingUp size={16} className="absolute text-blue-600 opacity-40" />
            </div>
            // Success rate percentage display
            <div className="flex flex-col border-l-2 border-slate-100 dark:border-slate-800 pl-6">
              <h4 className="text-3xl font-black text-blue-600 dark:text-blue-400 leading-none italic">{successPercentage}%</h4>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Success Rate</p>
            </div>
          </div>
        </div>

        // Task statistics grid showing different task statuses
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
          {[
            { label: 'Assigned Tasks', count: 12, icon: <ClipboardList size={16}/>, color: 'text-blue-500' },
            { label: 'Completed', count: 8, icon: <CheckCircle2 size={16}/>, color: 'text-emerald-500' },
            { label: 'Pending', count: 2, icon: <Clock size={16}/>, color: 'text-amber-500' },
            { label: 'Ongoing', count: 1, icon: <Activity size={16}/>, color: 'text-indigo-500' },
            { label: 'Rejected', count: 1, icon: <Ban size={16}/>, color: 'text-rose-500' }
          ].map((stat, i) => (
            // Individual task status card with icon and count
            <div key={i} className="bg-white dark:bg-[#16191f] p-5 rounded-[1.5rem] shadow-sm border-2 border-transparent hover:border-blue-500 transition-all duration-300 text-center">
              <div className={`${stat.color} flex justify-center mb-2`}>{stat.icon}</div>
              <h4 className="text-3xl font-black text-slate-900 dark:text-white leading-none italic">{stat.count}</h4>
              <p className="text-[10px] font-black text-slate-500 dark:text-slate-300 uppercase mt-2 tracking-wide whitespace-nowrap">{stat.label}</p>
            </div>
          ))}
        </div>

        // Task details section with filter and task list
        <div className="bg-white dark:bg-[#16191f] border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 shadow-sm">
          // Section header with title and status filter buttons
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 pb-4 border-b dark:border-slate-800/50 gap-4">
            <h3 className="text-[12px] font-black uppercase tracking-[0.25em] text-blue-600">About Tasks</h3>
            <div className="flex bg-slate-50 dark:bg-slate-900 p-1.5 rounded-xl gap-1">
              {['All', 'Completed', 'Ongoing', 'Pending', 'Rejected'].map(s => (
                // Status filter button
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all tracking-wider ${
                    statusFilter === s ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          // Task list container
          <div className="space-y-4">
            {taskLogs.filter(t => statusFilter === 'All' || t.status === statusFilter).map(log => (
              // Individual task card with details and actions
              <div key={log.id} className="group bg-slate-50 dark:bg-[#1a1d23] p-5 rounded-[1.5rem] border-2 border-transparent hover:border-blue-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] transition-all duration-300">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                  // Task information section
                  <div className="flex-1 min-w-0 w-full">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2.5 bg-blue-600 text-white rounded-xl shrink-0"><ClipboardList size={16}/></div>
                      <h4 className="font-black text-slate-900 dark:text-white text-lg truncate tracking-tight">{log.title}</h4>
                    </div>
                    // Client and date information
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase ml-12 mb-3 tracking-tight">
                      <Store size={12} className="text-blue-500"/> {log.client} • {log.date}
                    </div>
                    // Task brief description
                    <div className="ml-12 p-4 bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                      <p className="text-[12px] font-bold text-slate-600 dark:text-slate-300 leading-relaxed italic">"{log.brief}"</p>
                    </div>
                  </div>
                  // Task status and action buttons
                  <div className="flex md:flex-col items-center md:items-end gap-3 shrink-0 w-full md:w-auto mt-2 md:mt-0">
                    // Status badge with color coding
                    <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${
                      log.status === 'Completed' ? 'bg-emerald-500 text-white' :
                      log.status === 'Ongoing' ? 'bg-indigo-500 text-white' :
                      log.status === 'Rejected' ? 'bg-rose-500 text-white' : 'bg-amber-500 text-white'
                    }`}>{log.status}</span>
                    // View visit action button
                    <button onClick={() => navigate('/manager/visits')} className="flex items-center justify-center gap-2 px-6 py-2.5 bg-slate-900 dark:bg-blue-600 text-white text-[10px] font-black uppercase rounded-xl shadow-lg hover:scale-105 transition-all">
                      <Eye size={16}/> View Visit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Main render: Conditional rendering based on current view
  return (
    // Root container with dark mode background
    <div className="dark:bg-[#0b0d11] min-h-screen transition-colors duration-500">
      // Render either ListView or ProfileView based on current state
      {view === 'list' ? <ListView /> : <ProfileView />}
    </div>
  );
};

// Export component for use in other parts of the application
export default IntelligenceSuite;