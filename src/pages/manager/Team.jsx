import React from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from '../../components/DataTable';
import { mockEmployees } from '../../utils/mockData';
import { Users, Search, Download, CheckCircle2, BarChart3, AlertTriangle, MapPin, Activity, Mail, Phone, Linkedin, Briefcase, GraduationCap, ShieldCheck, FileText, Globe } from 'lucide-react';
import Button from '../../components/Button';

// --- Print-Only Consolidated Layout (Team Operation Application) ---
const TeamPrintLayout = ({ stats, members }) => (
  <div className="hidden print:block w-full text-gray-900 bg-white p-12">
    <style>{`
      @media print {
        @page { size: A4; margin: 1cm; }
        body { -webkit-print-color-adjust: exact; }
      }
    `}</style>

    {/* Header Section */}
    <div className="border-b-[6px] border-gray-900 pb-8 mb-10 flex justify-between items-start">
      <div className="space-y-2">
        <h1 className="text-5xl font-black uppercase tracking-tighter">Team Operations</h1>
        <p className="text-xl font-bold text-gray-500 uppercase tracking-[0.2em]">Management Intelligence Report</p>
      </div>
      <div className="text-right border-l-4 border-gray-100 pl-8">
        <div className="mb-4">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Generated Date</p>
          <p className="font-bold text-lg">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </div>
        <div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Status</p>
          <p className="text-emerald-600 font-black uppercase">Official Access Only</p>
        </div>
      </div>
    </div>

    <div className="space-y-10">

      {/* 1. Performance Overview (KPI Blocks) */}
      <section>
        <h2 className="text-sm font-black uppercase tracking-[0.3em] text-blue-600 mb-5 border-b-2 border-blue-600 pb-2 inline-block">
          Performance Overview
        </h2>
        <div className="grid grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div key={i} className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2 leading-none">{stat.label}</p>
              <p className="text-2xl font-black text-gray-900 mb-2">{stat.value}</p>
              <div className="w-full h-1 bg-white rounded-full overflow-hidden">
                <div className={`h-full ${stat.barColor}`} style={{ width: `${stat.progress}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Zone Distribution */}
      <section>
        <h2 className="text-sm font-black uppercase tracking-[0.3em] text-purple-600 mb-5 border-b-2 border-purple-600 pb-2 inline-block">
          Zone Distribution
        </h2>
        <div className="border-2 border-gray-100 rounded-2xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-900 text-white">
              <tr>
                <th className="px-5 py-3 text-[10px] font-black uppercase tracking-widest">Zone</th>
                <th className="px-5 py-3 text-[10px] font-black uppercase tracking-widest">Personnel</th>
                <th className="px-5 py-3 text-[10px] font-black uppercase tracking-widest">Designation</th>
                <th className="px-5 py-3 text-[10px] font-black uppercase tracking-widest text-center">Coverage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {members.map((member, i) => {
                const totalMembers = members.length;
                const coveragePct = Math.round((1 / totalMembers) * 100);
                return (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/60'}>
                    <td className="px-5 py-3">
                      <span className="text-[10px] font-black text-purple-700 border border-purple-200 px-3 py-1 rounded-full bg-purple-50 uppercase tracking-widest">
                        {member.team}
                      </span>
                    </td>
                    <td className="px-5 py-3 font-bold text-sm text-gray-900">{member.name}</td>
                    <td className="px-5 py-3 text-[10px] text-gray-500 font-semibold uppercase tracking-wide">{member.designation}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-purple-500 rounded-full" style={{ width: `${Math.min(coveragePct * (i + 1), 100)}%` }}></div>
                        </div>
                        <span className="text-[10px] font-black text-gray-400 w-8 text-right">{coveragePct}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* 3. Performance Breakdown */}
      <section>
        <h2 className="text-sm font-black uppercase tracking-[0.3em] text-emerald-600 mb-5 border-b-2 border-emerald-600 pb-2 inline-block">
          Performance Breakdown
        </h2>
        <div className="border-2 border-gray-100 rounded-2xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-900 text-white">
              <tr>
                <th className="px-5 py-3 text-[10px] font-black uppercase tracking-widest">Member</th>
                <th className="px-5 py-3 text-[10px] font-black uppercase tracking-widest text-center">Visits Today</th>
                <th className="px-5 py-3 text-[10px] font-black uppercase tracking-widest text-center">Target</th>
                <th className="px-5 py-3 text-[10px] font-black uppercase tracking-widest">Achievement</th>
                <th className="px-5 py-3 text-[10px] font-black uppercase tracking-widest text-right">Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {members.map((member, i) => {
                const target = 8;
                const pct = Math.min((member.visitsToday / target) * 100, 100);
                const isHigh = pct >= 80;
                const isMid = pct >= 40 && pct < 80;
                const barColor = isHigh ? 'bg-emerald-500' : isMid ? 'bg-yellow-400' : 'bg-red-400';
                const scoreColor = isHigh ? 'text-emerald-600' : isMid ? 'text-yellow-600' : 'text-red-500';
                return (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/60'}>
                    <td className="px-5 py-3">
                      <p className="font-black text-sm text-gray-900">{member.name}</p>
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">{member.designation}</p>
                    </td>
                    <td className="px-5 py-3 text-center font-black text-sm">{member.visitsToday}</td>
                    <td className="px-5 py-3 text-center text-[10px] text-gray-400 font-bold">{target}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full ${barColor} rounded-full`} style={{ width: `${pct}%` }}></div>
                        </div>
                        <span className="text-[10px] font-black text-gray-400 w-8 text-right">{pct.toFixed(0)}%</span>
                      </div>
                    </td>
                    <td className={`px-5 py-3 text-right font-black text-sm ${scoreColor}`}>
                      {pct >= 80 ? 'A' : pct >= 60 ? 'B' : pct >= 40 ? 'C' : 'D'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* 4. Status Summary */}
      <section>
        <h2 className="text-sm font-black uppercase tracking-[0.3em] text-gray-900 mb-5 border-b-2 border-gray-900 pb-2 inline-block">
          Status Summary
        </h2>
        <div className="grid grid-cols-3 gap-5">
          {[
            {
              label: 'On Duty',
              count: members.filter(m => m.status === 'On Duty').length,
              names: members.filter(m => m.status === 'On Duty').map(m => m.name),
              dot: 'bg-emerald-500',
              border: 'border-emerald-200',
              bg: 'bg-emerald-50',
              text: 'text-emerald-700',
              badge: 'bg-emerald-100 text-emerald-700',
            },
            {
              label: 'Off Duty',
              count: members.filter(m => m.status === 'Off Duty').length,
              names: members.filter(m => m.status === 'Off Duty').map(m => m.name),
              dot: 'bg-gray-400',
              border: 'border-gray-200',
              bg: 'bg-gray-50',
              text: 'text-gray-600',
              badge: 'bg-gray-100 text-gray-600',
            },
            {
              label: 'On Leave',
              count: members.filter(m => m.status === 'On Leave').length,
              names: members.filter(m => m.status === 'On Leave').map(m => m.name),
              dot: 'bg-orange-400',
              border: 'border-orange-200',
              bg: 'bg-orange-50',
              text: 'text-orange-700',
              badge: 'bg-orange-100 text-orange-700',
            },
          ].map((group, i) => (
            <div key={i} className={`p-5 rounded-2xl border ${group.border} ${group.bg}`}>
              <div className="flex items-center gap-2 mb-3">
                <span className={`w-2.5 h-2.5 rounded-full ${group.dot}`}></span>
                <p className={`text-[10px] font-black uppercase tracking-widest ${group.text}`}>{group.label}</p>
              </div>
              <p className={`text-4xl font-black mb-3 ${group.text}`}>{group.count}</p>
              <div className="flex flex-wrap gap-1">
                {group.names.length > 0 ? group.names.map((name, j) => (
                  <span key={j} className={`text-[9px] font-bold px-2 py-0.5 rounded ${group.badge}`}>
                    {name}
                  </span>
                )) : (
                  <p className="text-[9px] text-gray-400 italic font-medium">No members</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Authentication & Compliance */}
      <section className="grid grid-cols-2 gap-8">
        <div className="bg-gray-50/50 p-8 rounded-[2rem] border border-dashed border-gray-300">
           <p className="flex items-center gap-2 mb-4 font-black text-gray-400 uppercase tracking-widest text-[10px]"><Activity size={12} /> System Status</p>
           <p className="text-xs text-gray-600 font-medium leading-relaxed">
             All listed personnel are verified through biometric check-ins and GPS-stamped site visits. This registry is synchronized in real-time with hub operations.
           </p>
        </div>
        <div className="flex flex-col justify-end items-end gap-2 text-right opacity-30">
          <p className="text-[9px] font-bold uppercase tracking-widest">Digital Authentication</p>
          <ShieldCheck size={32} className="text-gray-900" />
          <p className="text-[8px] font-mono">0x7F4A...B9E1</p>
        </div>
      </section>
    </div>

    {/* Footer */}
    <div className="mt-16 pt-8 border-t border-gray-100 text-center">
       <p className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-300">Internal Administration • Confidential Documentation</p>
    </div>
  </div>
);

const ManagerTeam = () => {
  const stats = [
    { 
      label: 'Active Members', 
      value: '8/12', 
      unit: 'Active',
      icon: Users, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50',
      progress: 66,
      barColor: 'bg-blue-500'
    },
    { 
      label: 'Target Achievement', 
      value: '65%', 
      unit: 'Achieved',
      trend: '+12%',
      icon: CheckCircle2, 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-50',
      progress: 65,
      barColor: 'bg-emerald-500'
    },
    { 
      label: 'Avg. Visits per Employee', 
      value: '5.2', 
      unit: 'per person',
      trend: '+15%',
      icon: BarChart3, 
      color: 'text-purple-600', 
      bg: 'bg-purple-50',
      progress: 52,
      barColor: 'bg-purple-500'
    },
    { 
      label: 'Low Performers', 
      value: '3', 
      unit: 'Members',
      trend: '+8%',
      trendColor: 'text-red-500',
      icon: AlertTriangle, 
      color: 'text-red-600', 
      bg: 'bg-red-50',
      progress: 30,
      barColor: 'bg-red-500'
    },
  ];

  const columns = [
    { 
      header: 'Member', 
      accessor: 'name',
      render: (row) => (
        <div className="flex items-center space-x-3">
          <img src={row.avatar} alt={row.name} className="w-10 h-10 rounded-full border border-gray-100 dark:border-gray-800 shadow-sm" />
          <div>
            <p className="font-bold text-gray-900 dark:text-gray-100 leading-none">{row.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{row.designation}</p>
          </div>
        </div>
      )
    },
    { 
      header: 'Zone', 
      accessor: 'team',
      render: (row) => (
        <span className="text-sm font-semibold text-gray-700 bg-gray-50 px-3 py-1 rounded-lg">
          {row.team}
        </span>
      )
    },
    { 
      header: 'Status', 
      accessor: 'status',
      render: (row) => (
        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
          row.status === 'On Duty' ? 'bg-green-100 text-green-700' : 
          row.status === 'Off Duty' ? 'bg-gray-100 text-gray-700' : 'bg-orange-100 text-orange-700'
        }`}>
          {row.status}
        </span>
      )
    },
    {
      header: 'Performance',
      accessor: 'visitsToday',
      render: (row) => (
        <div className="flex items-center space-x-4">
          <div className="flex flex-col space-y-1">
            <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 min-w-40">
              <span>{row.visitsToday} visits</span>
              <span>Target: 8</span>
            </div>
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 rounded-full" 
                style={{ width: `${(row.visitsToday / 8) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )
    }
  ];

  const teamMembers = mockEmployees.slice(0, 5);
  const navigate = useNavigate();

  const handleExportReport = () => {
    window.print();
  };

  return (
    <div className="animate-in fade-in duration-500 p-4 md:p-0">
      <div className="space-y-8 print:hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">Team Management</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Direct oversight of your assigned field personnel</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white dark:bg-gray-900 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all group">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} dark:bg-opacity-10 transition-transform group-hover:scale-110`}>
                  <stat.icon size={24} strokeWidth={2.5} />
                </div>
                {stat.trend && (
                  <div className={`text-xs font-bold px-2 py-1 rounded-lg bg-emerald-50 text-emerald-600 flex items-center ${stat.trendColor || ''}`}>
                    {stat.trend}
                  </div>
                )}
              </div>
              
              <div className="space-y-3">
                <div className="flex items-baseline space-x-1">
                  <p className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">{stat.value}</p>
                  <p className="text-sm font-bold text-gray-400">{stat.unit}</p>
                </div>
                
                <div className="w-full h-1.5 bg-gray-50 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${stat.barColor} rounded-full transition-all duration-1000 ease-out`}
                    style={{ width: `${stat.progress}%` }}
                  />
                </div>
                
                <p className="text-sm font-bold text-gray-500 dark:text-gray-400 tracking-wide uppercase">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-gray-50 dark:border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
              <input 
                type="text" 
                placeholder="Search team members..." 
                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/10 outline-none transition-all font-semibold"
              />
            </div>
            <Button 
              variant="outline" 
              onClick={handleExportReport}
              className="flex items-center space-x-2 border-gray-200 dark:border-gray-700 dark:text-gray-100 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl px-6 py-2.5 group"
            >
              <Download size={18} className="group-hover:translate-y-0.5 transition-transform" />
              <span className="font-bold">Export Report</span>
            </Button>
          </div>
          <div className="px-2">
            <DataTable 
              columns={columns} 
              data={teamMembers} 
              onRowClick={(row) => navigate(`/manager/team/${row.id}`)}
            />
          </div>
        </div>
      </div>

      {/* Print-Only Layout */}
      <TeamPrintLayout stats={stats} members={teamMembers} />
    </div>
  );
};

export default ManagerTeam;
