import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Activity, Eye, MapPin, Briefcase, Store, 
  ClipboardList, CheckCircle2, Clock, Ban, TrendingUp,
  Fingerprint, Users, ChevronRight, Search, Moon, Sun, Bell, ExternalLink,
  Loader2, Check
} from 'lucide-react';
import { 
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Filler, Tooltip 
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Filler, Tooltip);

const IntelligenceSuite = () => {
  const navigate = useNavigate();
  const [view, setView] = useState('list');
  const [statusFilter, setStatusFilter] = useState('All');
  const [timeFilter, setTimeFilter] = useState('Daily');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [visitingId, setVisitingId] = useState(null);
  
  const handleViewVisit = (id) => {
    setVisitingId(id);
    setTimeout(() => {
      navigate('/manager/visits');
      setVisitingId(null);
    }, 400);
  };

  const employees = [
    { id: 1, name: 'Arjun Mehta', task: 'Beverage Delivery', success: 94, efficiency: '94%', revenue: '₹4200', initial: 'AM', role: 'Senior Field Lead', zone: 'South', status: 'Online' },
    { id: 2, name: 'Sanya Iyer', task: 'Shelf Audit', success: 88, efficiency: '88%', revenue: '₹3850', initial: 'SI', role: 'Field Executive', zone: 'North', status: 'Online' },
    { id: 3, name: 'Rahul Verma', task: 'Client Meeting', success: 91, efficiency: '91%', revenue: '₹5100', initial: 'RV', role: 'Account Manager', zone: 'West', status: 'Offline' },
    { id: 4, name: 'Priya Sharma', task: 'Payment Collection', success: 82, efficiency: '82%', revenue: '₹2900', initial: 'PS', role: 'Field Executive', zone: 'East', status: 'Online' },
  ];

  const taskLogs = [
    { id: 101, title: 'Inventory Stock Check', client: 'City Mart', status: 'Completed', date: '10:30 AM', brief: 'Verified warehouse levels against digital records and updated ERP.' },
    { id: 102, title: 'Shelf Visibility Audit', client: 'Grand Plaza', status: 'Ongoing', date: '01:15 PM', brief: 'Monitoring brand shelf share and competitor placement in the main aisle.' },
    { id: 103, title: 'Promotional Setup', client: 'Metro Store', status: 'Pending', date: '04:00 PM', brief: 'Installing seasonal marketing banners and end-cap displays.' },
    { id: 104, title: 'Safety Inspection', client: 'Quick Shop', status: 'Rejected', date: 'Yesterday', brief: 'Compliance check for outlet storage safety and fire exit accessibility.' },
  ];

  const chartOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { x: { display: false }, y: { display: false } },
    elements: { line: { tension: 0.4 }, point: { radius: 0 } }
  };

  const dashboardStats = {
    Daily: {
      revenue: { val: '₹22,500', data: [30, 45, 40, 70, 50, 85, 95] },
      tasks: { val: '42', data: [20, 35, 25, 45, 30, 50, 42] },
      success: { val: '91.4%', data: [60, 75, 70, 85, 80, 92, 91.4] },
      performance: { val: '85%', data: [65, 70, 75, 72, 80, 85, 85] }
    },
    Weekly: {
      revenue: { val: '₹142,000', data: [85, 95, 110, 105, 130, 150, 142] },
      tasks: { val: '284', data: [240, 260, 290, 275, 310, 295, 284] },
      success: { val: '89.2%', data: [85, 87, 86, 90, 88, 89, 89.2] },
      performance: { val: '82%', data: [80, 81, 80, 83, 82, 82, 82] }
    },
    Monthly: {
      revenue: { val: '₹512,400', data: [420, 450, 480, 460, 500, 530, 512] },
      tasks: { val: '1,120', data: [980, 1020, 1050, 1080, 1150, 1100, 1120] },
      success: { val: '90.5%', data: [88, 89, 90, 89, 91, 90, 90.5] },
      performance: { val: '88%', data: [85, 86, 87, 86, 88, 89, 88] }
    }
  };

  const currentStats = dashboardStats[timeFilter];

  const revenueData = {
    labels: ['', '', '', '', '', '', ''],
    datasets: [{ 
      data: currentStats.revenue.data, 
      borderColor: '#0ea5e9', 
      backgroundColor: 'rgba(14, 165, 233, 0.2)', 
      fill: true, 
      borderWidth: 3 
    }]
  };

  const tasksData = {
    labels: ['', '', '', '', '', '', ''],
    datasets: [{ 
      data: currentStats.tasks.data, 
      backgroundColor: 'rgba(168, 85, 247, 0.8)', 
      borderRadius: 6, 
      barThickness: 12 
    }]
  };

  const successData = {
    labels: ['', '', '', '', '', '', ''],
    datasets: [{ 
      data: currentStats.success.data, 
      borderColor: '#10b981', 
      backgroundColor: 'rgba(16, 185, 129, 0.2)', 
      fill: true, 
      borderWidth: 3, 
      tension: 0.5 
    }]
  };

  const performanceData = {
    labels: ['', '', '', '', '', '', ''],
    datasets: [{ 
      data: currentStats.performance.data, 
      borderColor: '#f43f5e', 
      backgroundColor: 'rgba(244, 63, 94, 0.1)',
      fill: true,
      borderWidth: 3, 
      stepped: true 
    }]
  };

  const ListView = () => (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0b0d11] p-6 transition-all duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Activity className="text-blue-600" /> Performance Suite
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">Fleet Executive Management</p>
        </div>
        <div className="flex bg-white dark:bg-[#16191f] p-1 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
          {['Daily', 'Weekly', 'Monthly'].map(f => (
            <button key={f} onClick={() => setTimeFilter(f)} className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${timeFilter === f ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-blue-500'}`}>{f}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Revenue', val: currentStats.revenue.val, data: revenueData, type: 'line' },
          { label: 'Active Tasks', val: currentStats.tasks.val, data: tasksData, type: 'bar' },
          { label: 'Avg Success', val: currentStats.success.val, data: successData, type: 'line' },
          { label: 'Total Performance', val: currentStats.performance.val, data: performanceData, type: 'line' }
        ].map((card, i) => (
          <div key={i} className="group relative bg-white dark:bg-[#16191f] border-2 border-transparent p-6 rounded-[2rem] shadow-sm hover:border-blue-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all overflow-hidden cursor-default min-h-[140px]">
            <div className="relative z-10">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{card.label}</p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">{card.val}</h3>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-24 opacity-40 group-hover:opacity-60 transition-opacity">
              {card.type === 'line' ? (
                <Line data={card.data} options={chartOptions} />
              ) : (
                <Bar data={card.data} options={chartOptions} />
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-[#16191f] border border-slate-200 dark:border-slate-800 rounded-[2rem] overflow-hidden shadow-xl transition-all">
        <div className="grid grid-cols-5 p-6 border-b border-slate-100 dark:border-slate-800 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
          <span>Executive</span>
          <span>Current Status</span>
          <span className="text-center">Efficiency</span>
          <span className="text-center">Revenue</span>
          <span className="text-right">Action</span>
        </div>
        <div className="p-4 space-y-2">
          {employees.map((exec) => (
            <div 
              key={exec.id}
              onClick={() => { setSelectedEmployee(exec); setStatusFilter('All'); setView('profile'); }}
              className="grid grid-cols-5 p-6 items-center border-2 border-transparent hover:border-blue-500 hover:bg-slate-50 dark:hover:bg-slate-800/30 rounded-2xl transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-sm font-black text-white shadow-lg group-hover:shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                  {exec.initial}
                </div>
                <span className="font-black text-slate-900 dark:text-white tracking-tight">{exec.name}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-600 dark:text-slate-300">{exec.task}</span>
                <span className="text-[9px] font-black text-blue-500 uppercase">{exec.status} Now</span>
              </div>
              <div className="text-center text-lg font-black text-emerald-500 italic">{exec.efficiency}</div>
              <div className="text-center text-lg font-black text-slate-900 dark:text-white tracking-tighter">{exec.revenue}</div>
              <div className="flex justify-end">
                <span className="text-[10px] font-black uppercase text-blue-500 group-hover:underline tracking-widest">Profile</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const ProfileView = () => {
    if (!selectedEmployee) return null;

    const radius = 24;
    const circumference = 2 * Math.PI * radius;
    const successPercentage = selectedEmployee.success;
    const strokeDashoffset = circumference - (successPercentage / 100) * circumference;

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0b0d11] p-6 transition-colors duration-500">
        <button onClick={() => setView('list')} className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 hover:text-blue-600 mb-4 tracking-wider transition-colors">
          <ArrowLeft size={14}/> Back to Fleet
        </button>

        {/* COMPACT PROFILE GRID */}
        <div className="bg-white dark:bg-[#16191f] border border-slate-200 dark:border-slate-800 p-6 rounded-[2rem] shadow-sm flex flex-col md:flex-row items-center justify-between mb-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-2xl font-black shadow-lg">
                {selectedEmployee.initial}
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-white dark:border-[#16191f] rounded-full"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
              <div className="col-span-2">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-none">{selectedEmployee.name}</h2>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                <Briefcase size={12} className="text-blue-500"/> {selectedEmployee.role}
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                <Fingerprint size={12} className="text-blue-500"/> ID: TF-2026-{selectedEmployee.id || '88'}
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <MapPin size={12} className="text-blue-500"/> {selectedEmployee.zone} Zone
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <Users size={12} className="text-blue-500"/> Field Ops Dept.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-10 mt-6 md:mt-0 pr-4">
            {/* PERCENTAGE OUTSIDE BELOW CIRCLE */}
              <div className="relative flex items-center justify-center">
                <svg className="w-14 h-14 transform -rotate-90">
                  <circle cx="28" cy="28" r={radius} stroke="currentColor" strokeWidth="5" fill="transparent" className="text-slate-100 dark:text-slate-800" />
                  <circle
                    cx="28" cy="28" r={radius} stroke="currentColor" strokeWidth="5" fill="transparent"
                    strokeDasharray={circumference}
                    style={{ strokeDashoffset, transition: 'stroke-dashoffset 1.5s ease' }}
                    strokeLinecap="round"
                    className="text-blue-600"
                  />
                </svg>
              </div>

            {/* UPDATED SUCCESS RATE (GREEN COLOR) */}
            {/* THICK BLUE LINE SEPARATOR */}
            <div className="flex flex-col border-l-4 border-blue-600 pl-10 h-16 justify-center">
            <h4 className="text-4xl font-black text-blue-600 italic tracking-tighter leading-none">
              {successPercentage}%
            </h4>
            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] mt-2">
              Success Rate
            </p>
          </div>
          </div>
        </div>

        {/* KPI FILTERS */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          {[
            { label: 'Assigned', count: 12, filter: 'All', icon: <ClipboardList size={18}/>, color: 'text-blue-500' },
            { label: 'Completed', count: 8, filter: 'Completed', icon: <CheckCircle2 size={18}/>, color: 'text-emerald-500' },
            { label: 'Pending', count: 2, filter: 'Pending', icon: <Clock size={18}/>, color: 'text-amber-500' },
            { label: 'Ongoing', count: 1, filter: 'Ongoing', icon: <Activity size={18}/>, color: 'text-indigo-500' },
            { label: 'Rejected', count: 1, filter: 'Rejected', icon: <Ban size={18}/>, color: 'text-rose-500' }
          ].map((stat, i) => (
            <div 
              key={i} 
              onClick={() => setStatusFilter(stat.filter)}
              className={`bg-white dark:bg-[#16191f] p-4 rounded-2xl shadow-sm border-2 transition-all cursor-pointer ${statusFilter === stat.filter ? 'border-blue-500 bg-blue-50/20 shadow-[0_0_15px_rgba(59,130,246,0.2)]' : 'border-transparent hover:border-blue-500 hover:shadow-[0_0_15px_rgba(59,130,246,0.2)]'}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`${stat.color}`}>{stat.icon}</span>
                <h4 className="text-xl font-black text-slate-900 dark:text-white italic">{stat.count}</h4>
              </div>
              <p className="text-[8px] font-black text-slate-500 uppercase tracking-tighter">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* ACTIVITY LOG WITH BRIEF DESCRIPTION */}
        <div className="bg-white dark:bg-[#16191f] border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b dark:border-slate-800/50">
            <h3 className="text-[12px] font-black uppercase tracking-widest text-blue-600">Executive Activity</h3>
            <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[9px] font-black text-slate-500 uppercase tracking-tighter">
              Showing: {statusFilter}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {taskLogs
              .filter(t => statusFilter === 'All' || t.status === statusFilter)
              .map(log => (
              <div 
                key={log.id} 
                onClick={() => handleViewVisit(log.id)}
                className={`group bg-slate-50 dark:bg-[#1a1d23] p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                  visitingId === log.id 
                    ? 'border-emerald-500 bg-emerald-50/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]' 
                    : 'border-transparent hover:border-blue-500 hover:shadow-[0_0_15px_rgba(59,130,246,0.1)]'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="mt-1 p-2.5 bg-white dark:bg-slate-800 text-blue-500 rounded-lg shadow-sm">
                      <ClipboardList size={16}/>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-black text-slate-900 dark:text-white text-sm tracking-tight">{log.title}</h4>
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter bg-slate-200/50 dark:bg-slate-700 px-1.5 py-0.5 rounded">
                          {log.id}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400 text-[8px] font-bold uppercase tracking-tighter mt-0.5 mb-2">
                         <Store size={10} className="text-blue-500"/> <span>{log.client}</span> • <Clock size={10} className="text-blue-500"/> <span>{log.date}</span>
                      </div>
                      {/* ADDED BRIEF DESCRIPTION */}
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl italic">
                        "{log.brief}"
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded-lg border transition-all ${
                      log.status === 'Completed' ? 'border-emerald-500/20 text-emerald-500 bg-emerald-500/5' :
                      log.status === 'Ongoing' ? 'border-indigo-500/20 text-indigo-500 bg-indigo-500/5' :
                      log.status === 'Rejected' ? 'border-rose-500/20 text-rose-500 bg-rose-500/5' : 'border-amber-500/20 text-amber-500 bg-amber-500/5'
                    }`}>
                      {log.status === 'Completed' && <CheckCircle2 size={14} />}
                      {log.status === 'Ongoing' && <Activity size={14} />}
                      {log.status === 'Rejected' && <Ban size={14} />}
                      {log.status === 'Pending' && <Clock size={14} />}
                    </div>
                    
                    <button 
                      onClick={() => handleViewVisit(log.id)}
                      disabled={visitingId === log.id}
                      className={`p-2 rounded-full transition-all shadow-lg ${
                        visitingId === log.id 
                          ? 'bg-emerald-500 scale-95' 
                          : 'bg-blue-600 hover:scale-110 active:scale-95 hover:shadow-blue-500/40'
                      } text-white`}
                      title="View Visit"
                    >
                      {visitingId === log.id ? (
                        <Check size={16} strokeWidth={4} className="animate-in zoom-in duration-300" />
                      ) : (
                        <ChevronRight size={16} strokeWidth={3} />
                      )}
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

  return (
    <div className="dark:bg-[#0b0d11] min-h-screen transition-colors duration-500">
      {view === 'list' ? <ListView /> : <ProfileView />}
    </div>
  );
};

export default IntelligenceSuite;