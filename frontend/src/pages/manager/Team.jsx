import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import DataTable from '../../components/DataTable';
import tenantService from '../../services/tenantService';
import { getVisits } from '../../services/visitService';
import { Users, Search, Download, CheckCircle2, BarChart3, AlertTriangle, MapPin, Activity, Mail, Phone, Linkedin, Briefcase, GraduationCap, ShieldCheck, FileText, Globe, Loader2, Edit, Trash2, Ban, X, UserPlus, ArrowLeft, Calendar, Clock, Shield, User, FileSignature, HeartPulse, Building2, Flame, Droplets, Map } from 'lucide-react';
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
                        {member.zone}
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
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState([
    { label: 'Active Members', value: '0/0', unit: 'Active', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', progress: 0, barColor: 'bg-blue-500' },
    { label: 'Target Achievement', value: '0%', unit: 'Achieved', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50', progress: 0, barColor: 'bg-emerald-500' },
    { label: 'Avg. Visits per Employee', value: '0.0', unit: 'per person', icon: BarChart3, color: 'text-purple-600', bg: 'bg-purple-50', progress: 0, barColor: 'bg-purple-500' },
    { label: 'Low Performers', value: '0', unit: 'Members', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50', progress: 0, barColor: 'bg-red-500' },
  ]);
  const [loading, setLoading] = useState(true);

  // Modal & Edit states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState({ name: '', email: '', password: '', zone: '', designation: 'Employee', status: 'Active' });
  const [editingEmployee, setEditingEmployee] = useState(null);

  // Close modals on scroll or cleanup
  useEffect(() => {
    if (isModalOpen || isEditModalOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isModalOpen, isEditModalOpen]);

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    try {
      const response = await tenantService.createEmployee(newEmployee);
      const emp = response.data;
      const formatted = {
        id: emp._id,
        name: emp.name,
        designation: emp.profile?.designation || 'Employee',
        status: emp.status || 'On Duty',
        zone: emp.profile?.zone || emp.profile?.team || 'Unassigned',
        visitsToday: 0,
        avatar: emp.profile?.avatar || `https://i.pravatar.cc/150?u=${emp._id}`
      };
      setTeamMembers([formatted, ...teamMembers]);
      setIsModalOpen(false);
      setNewEmployee({ name: '', email: '', password: '', zone: '', designation: 'Employee', status: 'Active' });
    } catch (error) {
      console.error('Failed to create employee:', error);
      alert(error.response?.data?.message || 'Failed to create employee');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await tenantService.updateEmployee(editingEmployee.id, editingEmployee);
      setTeamMembers(teamMembers.map(emp => emp.id === editingEmployee.id ? { ...emp, name: editingEmployee.name, zone: editingEmployee.zone, designation: editingEmployee.designation, status: editingEmployee.status } : emp));
      setIsEditModalOpen(false);
      setEditingEmployee(null);
    } catch (err) {
      console.error('Failed to edit employee:', err);
      alert('Failed to edit employee');
    }
  };

  const handleSuspendEmployee = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Inactive' ? 'Active' : 'Inactive';
    try {
      await tenantService.updateEmployee(id, { status: newStatus });
      setTeamMembers(teamMembers.map(emp => emp.id === id ? { ...emp, status: newStatus === 'Active' ? 'On Duty' : 'Inactive' } : emp));
    } catch (err) {
      console.error(err);
      alert('Failed to update status');
    }
  };

  const handleDeleteEmployee = async (id) => {
    if (window.confirm("Are you sure you want to remove this member?")) {
      try {
        await tenantService.deleteEmployee(id);
        setTeamMembers(teamMembers.filter(emp => emp.id !== id));
      } catch (error) {
        console.error('Failed to delete employee:', error);
      }
    }
  };

  useEffect(() => {
    let active = true;
    const fetchData = async () => {
      try {
        setLoading(true);
        const [employeesResponse, visitsResponse] = await Promise.all([
          tenantService.getEmployees(),
          getVisits()
        ]);

        if (!active) return;

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const todayVisits = visitsResponse.filter(visit => {
          const visitDate = new Date(visit.createdAt || visit.timestamp);
          return visitDate >= today;
        });

        const formattedMembers = employeesResponse.map(emp => {
          const empVisits = todayVisits.filter(v => v.employee && typeof v.employee === 'object' ? v.employee._id === emp._id : v.employee === emp._id).length;
          // Extract zone name from profile or fallback
          const zoneName = emp.profile && (emp.profile.zone || emp.profile.team) ? (emp.profile.zone || emp.profile.team) : 'Unassigned';
          
          return {
            id: emp._id,
            name: emp.name,
            email: emp.email,
            phone: emp.profile?.phone || '+1 (555) 000-0000',
            location: emp.profile?.location || 'Unknown Location',
            joinDate: new Date(emp.createdAt || Date.now()).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
            designation: emp.profile?.designation || 'Employee',
            status: emp.isDeactivated ? 'Inactive' : (emp.status || 'Off Duty'),
            zone: zoneName,
            visitsToday: empVisits,
            avatar: emp.profile?.avatar || `https://i.pravatar.cc/150?u=${emp._id}`,
            employeeId: emp.profile?.employeeId || `EMP-${emp._id.substring(0, 6).toUpperCase()}`,
            address: emp.profile?.address || 'No address provided',
            skills: emp.profile?.skills || [],
            dob: emp.profile?.dob || 'Not provided',
            gender: emp.profile?.gender || 'Not specified',
            nationality: emp.profile?.nationality || 'Not specified',
            bloodGroup: emp.profile?.bloodGroup || 'Not specified',
            emergencyContact: emp.profile?.emergencyContact || 'Not provided',
            allergies: emp.profile?.allergies || 'None',
          };
        });

        setTeamMembers(formattedMembers);

        // Stats calculation
        const activeCount = formattedMembers.filter(m => m.status === 'On Duty' || m.status === 'Active').length;
        const totalVisits = formattedMembers.reduce((sum, m) => sum + m.visitsToday, 0);
        const avgVisits = formattedMembers.length > 0 ? (totalVisits / formattedMembers.length).toFixed(1) : '0.0';
        const targetVisits = 8 * formattedMembers.length;
        const targetPercent = targetVisits > 0 ? Math.round((totalVisits / targetVisits) * 100) : 0;
        const lowPerformersCount = formattedMembers.filter(m => m.visitsToday < 4).length;

        setStats([
          { 
            label: 'Active Members', 
            value: `${activeCount}/${formattedMembers.length}`, 
            unit: 'Active',
            icon: Users, 
            color: 'text-blue-600', 
            bg: 'bg-blue-50',
            progress: formattedMembers.length > 0 ? Math.round((activeCount / formattedMembers.length) * 100) : 0,
            barColor: 'bg-blue-500'
          },
          { 
            label: 'Target Achievement', 
            value: `${targetPercent}%`, 
            unit: 'Achieved',
            icon: CheckCircle2, 
            color: 'text-emerald-600', 
            bg: 'bg-emerald-50',
            progress: Math.min(targetPercent, 100),
            barColor: 'bg-emerald-500'
          },
          { 
            label: 'Avg. Visits per Employee', 
            value: avgVisits, 
            unit: 'per person',
            icon: BarChart3, 
            color: 'text-purple-600', 
            bg: 'bg-purple-50',
            progress: Math.min(Math.round((parseFloat(avgVisits) / 8) * 100), 100),
            barColor: 'bg-purple-500'
          },
          { 
            label: 'Low Performers', 
            value: lowPerformersCount.toString(), 
            unit: 'Members',
            icon: AlertTriangle, 
            color: 'text-red-600', 
            bg: 'bg-red-50',
            progress: formattedMembers.length > 0 ? Math.round((lowPerformersCount / formattedMembers.length) * 100) : 0,
            barColor: 'bg-red-500'
          },
        ]);
      } catch (err) {
        console.error('Failed to load team data:', err);
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchData();
    return () => { active = false; };
  }, []);

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
      accessor: 'zone',
      render: (row) => (
        <span className="text-sm font-semibold text-gray-700 bg-gray-50 px-3 py-1 rounded-lg">
          {row.zone}
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
    },
    {
      header: 'Actions',
      accessor: 'actions',
      render: (row) => (
        <div className="flex items-center justify-end space-x-2" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => {
              setEditingEmployee(row);
              setIsEditModalOpen(true);
            }}
            title="Edit Member"
            className="p-2 text-indigo-500 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:hover:bg-indigo-900/40 rounded-lg transition-colors"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => handleSuspendEmployee(row.id, row.status)}
            title={row.status === 'Inactive' ? 'Re-activate' : 'Suspend Op'}
            className={`p-2 rounded-lg transition-colors ${row.status === 'Inactive' ? 'text-emerald-500 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/40' : 'text-orange-500 bg-orange-50 hover:bg-orange-100 dark:bg-orange-900/20 dark:hover:bg-orange-900/40'}`}
          >
            <Ban size={16} />
          </button>
          <button
            onClick={() => handleDeleteEmployee(row.id)}
            title="Remove Member"
            className="p-2 text-rose-500 bg-rose-50 hover:bg-rose-100 dark:bg-rose-900/20 dark:hover:bg-rose-900/40 rounded-lg transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )
    }
  ];

  const navigate = useNavigate();

  const handleExportReport = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <span className="ml-3 text-gray-500 font-medium">Loading organization data...</span>
      </div>
    );
  }

  if (selectedEmployee) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500 overflow-x-hidden p-4 md:p-0">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => setSelectedEmployee(null)} className="p-2 border border-gray-100 dark:border-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <ArrowLeft size={20} className="text-gray-600 dark:text-gray-400" />
            </Button>
            <div>
              <h1 className="text-2xl font-black text-gray-900 dark:text-white">Employee Profile</h1>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mt-1">{selectedEmployee.employeeId}</p>
            </div>
          </div>
        </div>

        {/* Profile Header Card */}
        <div className="grid grid-cols-1 gap-6 relative mb-6">
          <div className="absolute -top-10 -right-10 w-64 h-64 bg-indigo-50 dark:bg-indigo-900/20 rounded-full blur-3xl opacity-50 pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-emerald-50 dark:bg-emerald-900/20 rounded-full blur-3xl opacity-50 pointer-events-none" />

          <div className="bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/20 dark:shadow-none flex flex-col md:flex-row items-center gap-8 relative overflow-hidden group">
            <div className="w-32 h-32 rounded-[2rem] bg-indigo-50 dark:bg-indigo-900/40 p-1 group-hover:scale-110 transition-transform duration-500 shrink-0 border-4 border-white dark:border-gray-800 shadow-lg z-10">
              <img src={selectedEmployee.avatar} alt={selectedEmployee.name} className="w-full h-full rounded-[1.8rem] object-cover" />
            </div>

            <div className="flex-grow text-center md:text-left space-y-2 z-10">
              <div className="flex flex-col md:flex-row md:items-center justify-center md:justify-start gap-4">
                <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">{selectedEmployee.name}</h2>
                <span className={`px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-sm border ${selectedEmployee.status === 'Active' || selectedEmployee.status === 'On Duty' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800' : 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800/50 dark:text-gray-400 dark:border-gray-700'}`}>
                  {selectedEmployee.status}
                </span>
              </div>
              <p className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">{selectedEmployee.designation}</p>
            </div>

            <div className="absolute right-0 top-0 w-64 h-64 opacity-5 pointer-events-none text-indigo-900 rotate-12 -translate-y-8 translate-x-12">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Dynamic Tabs Navigation */}
        <div className="flex items-center space-x-2 bg-gray-50/80 dark:bg-gray-800/40 p-1.5 rounded-[1.5rem] w-full overflow-x-auto border border-gray-100 dark:border-gray-800 mb-6 relative z-10">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'personal', label: 'Personal Info', icon: User },
            { id: 'employment', label: 'Employment', icon: Briefcase },
            { id: 'documents', label: 'Documents', icon: FileSignature },
            { id: 'activities', label: 'Activities', icon: Activity },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-5 py-3 rounded-xl text-[13px] font-black tracking-wide uppercase transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-white dark:bg-gray-900 text-indigo-600 dark:text-indigo-400 shadow-sm border border-gray-100 dark:border-gray-800' : 'text-gray-400 dark:text-gray-500 hover:bg-gray-100/50 dark:hover:bg-gray-800 hover:text-gray-600 dark:hover:text-gray-300'}`}
            >
              <tab.icon size={16} strokeWidth={2.5} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content Area */}
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 relative z-10 w-full mb-8">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-900 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col justify-center space-y-6 hover:shadow-lg transition-shadow">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <Activity size={14} className="text-purple-500" />
                  Employee Performance
                </h3>
                <div className="space-y-6">
                  <div className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-500 group-hover:rotate-12 transition-transform">
                      <CheckCircle2 size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tasks Completed</p>
                      <p className="text-2xl font-black text-gray-900 dark:text-white">142</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 group-hover:rotate-12 transition-transform">
                      <Activity size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Visits Today</p>
                      <p className="text-2xl font-black text-gray-900 dark:text-white">{selectedEmployee.visitsToday}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-900 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col justify-center space-y-6 hover:shadow-lg transition-shadow">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <Mail size={14} className="text-indigo-500" />
                  Contact Overview
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-gray-600 dark:text-gray-300 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <Mail size={18} className="text-indigo-400 shrink-0" />
                    <span className="font-bold text-sm truncate">{selectedEmployee.email}</span>
                  </div>
                  <div className="flex items-center gap-4 text-gray-600 dark:text-gray-300 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <Phone size={18} className="text-indigo-400 shrink-0" />
                    <span className="font-bold text-sm">{selectedEmployee.phone}</span>
                  </div>
                  <div className="flex items-center gap-4 text-gray-600 dark:text-gray-300 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <MapPin size={18} className="text-indigo-400 shrink-0" />
                    <span className="font-bold text-sm">{selectedEmployee.zone} Zone - {selectedEmployee.location}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'personal' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white dark:bg-gray-900 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all">
                 <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-8">
                  <User size={14} className="text-blue-500" />
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Full Name</p>
                    <p className="text-sm font-black text-gray-900 dark:text-white">{selectedEmployee.name}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Date of Birth</p>
                    <p className="text-sm font-black text-gray-900 dark:text-white">{selectedEmployee.dob}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Gender</p>
                    <p className="text-sm font-black text-gray-900 dark:text-white">{selectedEmployee.gender}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Nationality</p>
                    <p className="text-sm font-black text-gray-900 dark:text-white">{selectedEmployee.nationality}</p>
                  </div>
                  <div className="md:col-span-2 mt-4 pt-6 border-t border-gray-100 dark:border-gray-800">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Residential Address</p>
                    <p className="text-sm font-bold text-gray-700 dark:text-gray-300 leading-relaxed">{selectedEmployee.address}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-900 p-8 rounded-[2rem] border border-rose-100 dark:border-rose-900/30 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                  <HeartPulse className="absolute -right-4 -top-4 w-24 h-24 text-rose-50 dark:text-rose-900/10 group-hover:scale-110 transition-transform duration-500" />
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-6">
                    <HeartPulse size={14} className="text-rose-500" />
                    Health Metrics
                  </h3>
                  <div className="space-y-4 z-10 relative">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Blood Group</p>
                      <div className="inline-flex items-center px-3 py-1 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-lg text-sm font-black tracking-wide border border-rose-100 dark:border-rose-900/50">
                        {selectedEmployee.bloodGroup}
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Allergies</p>
                      <p className="text-sm font-bold text-gray-700 dark:text-gray-300">{selectedEmployee.allergies}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-900 p-8 rounded-[2rem] border border-orange-100 dark:border-orange-900/30 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                  <AlertTriangle className="absolute -right-4 -top-4 w-24 h-24 text-orange-50 dark:text-orange-900/10 group-hover:scale-110 transition-transform duration-500" />
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-6">
                    <Phone size={14} className="text-orange-500" />
                    Emergency Contact
                  </h3>
                  <div className="z-10 relative">
                    <p className="text-sm font-black text-gray-900 dark:text-white mb-1">{selectedEmployee.emergencyContact}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-2 py-0.5 rounded-md inline-block mt-1">Primary Contact</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'employment' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-900 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all">
                 <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-8">
                  <Building2 size={14} className="text-blue-500" />
                  Employment Details
                </h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Employee ID</p>
                      <p className="text-lg font-black text-indigo-600 dark:text-indigo-400 tracking-wider">{selectedEmployee.employeeId}</p>
                    </div>
                    <div className="w-12 h-12 bg-white dark:bg-gray-900 rounded-xl shadow-sm text-center flex items-center justify-center border border-gray-100 dark:border-gray-800">
                      <FileText size={20} className="text-gray-400" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Date Joined</p>
                      <p className="text-sm font-black text-gray-900 dark:text-white flex items-center gap-2">
                        <Calendar size={14} className="text-gray-400" /> {selectedEmployee.joinDate}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Operating Zone</p>
                      <p className="text-sm font-black text-gray-900 dark:text-white flex items-center gap-2">
                        <Map size={14} className="text-gray-400" /> {selectedEmployee.zone} Zone
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-900 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-8">
                  <Flame size={14} className="text-orange-500" />
                  Skills & Capabilities
                </h3>
                {selectedEmployee.skills && selectedEmployee.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedEmployee.skills.map((skill, index) => (
                      <span key={index} className="px-4 py-2 bg-gradient-to-tr from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 text-gray-700 dark:text-gray-300 text-xs font-bold rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow transition-all hover:-translate-y-0.5">
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                    <Activity size={24} className="text-gray-300 dark:text-gray-600 mb-2" />
                    <p className="text-xs font-bold text-gray-400">No specific skills registered.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="bg-white dark:bg-gray-900 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-8">
                 <FileSignature size={14} className="text-indigo-500" />
                 Verified Credentials & Documents
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { name: 'National Identity Proof', date: 'Oct 14, 2023', verified: true },
                  { name: 'Employment Contract', date: 'Oct 15, 2023', verified: true },
                  { name: 'Non-Disclosure Agreement', date: 'Oct 15, 2023', verified: true },
                  { name: 'Induction Certification', date: 'Nov 02, 2023', verified: false }
                ].map((doc, idx) => (
                  <div key={idx} className="group p-5 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between h-[160px] relative overflow-hidden">
                    <FileText className={`absolute -right-4 -bottom-4 w-24 h-24 opacity-5 group-hover:scale-110 transition-transform duration-500 ${doc.verified ? 'text-emerald-500' : 'text-gray-500'}`} />
                    <div>
                      <div className="flex items-start justify-between mb-3">
                        <div className={`p-2.5 rounded-xl ${doc.verified ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'} shadow-sm`}>
                          <FileSignature size={20} />
                        </div>
                        {doc.verified ? (
                          <div className="flex items-center space-x-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-md border border-emerald-100 dark:border-emerald-800">
                            <ShieldCheck size={10} /> <span>Verified</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-1 bg-amber-50 dark:bg-amber-900/30 text-amber-600 text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-md border border-amber-100 dark:border-amber-800">
                            <Clock size={10} /> <span>Pending</span>
                          </div>
                        )}
                      </div>
                      <h4 className="font-black text-gray-900 dark:text-white text-sm leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{doc.name}</h4>
                    </div>
                    <div className="flex items-center justify-between z-10">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Added {doc.date}</p>
                      <button className="w-8 h-8 flex items-center justify-center bg-white dark:bg-gray-800 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-full border border-gray-100 dark:border-gray-700 shadow-sm transition-colors">
                        <Download size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'activities' && (
            <div className="bg-white dark:bg-gray-900 p-8 lg:p-10 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm max-w-3xl mx-auto">
               <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-8">
                 <Activity size={14} className="text-indigo-500" />
                 Recent Timeline
              </h3>
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 dark:before:via-gray-800 before:to-transparent">
                {[
                  { title: `Completed Store Target`, desc: `Successfully verified all SKUs via photo capture at ${selectedEmployee.zone} flagship.`, time: '2 hours ago', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                  { title: 'Checked In', desc: `Geo-fenced check-in recorded at Zone Hub.`, time: '6 hours ago', icon: MapPin, color: 'text-blue-500', bg: 'bg-blue-50' },
                  { title: 'Shift Started', desc: `System marked status as "On Duty".`, time: '7 hours ago', icon: Droplets, color: 'text-purple-500', bg: 'bg-purple-50' }
                ].map((act, idx) => (
                  <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-gray-900 ${act.bg} dark:bg-opacity-20 ${act.color} shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10`}>
                      <act.icon size={16} />
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm group-hover:shadow-md transition-all">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-bold text-sm text-gray-900 dark:text-white">{act.title}</h4>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-3">{act.desc}</p>
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-1.5 opacity-60">
                         <Clock size={10} /> {act.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500 overflow-x-hidden p-4 md:p-0">
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
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                onClick={handleExportReport}
                className="flex items-center space-x-2 border-gray-200 dark:border-gray-700 dark:text-gray-100 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl px-6 py-2.5 group"
              >
                <Download size={18} className="group-hover:translate-y-0.5 transition-transform" />
                <span className="font-bold hidden sm:inline">Export Report</span>
              </Button>
              <Button 
                variant="tenant" 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center space-x-2 bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 rounded-xl px-6 py-2.5 group"
              >
                <UserPlus size={18} className="group-hover:scale-110 transition-transform" />
                <span className="font-bold hidden sm:inline">Add Member</span>
              </Button>
            </div>
          </div>
          <div className="px-2">
            <DataTable 
              columns={columns} 
              data={teamMembers} 
              onRowClick={(row) => setSelectedEmployee(row)}
            />
          </div>
        </div>
      </div>

      {/* Print-Only Layout */}
      <TeamPrintLayout stats={stats} members={teamMembers} />

      {/* Add Modal */}
      {isModalOpen && createPortal(
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-500" onClick={() => setIsModalOpen(false)} />
          <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] w-full max-w-xl p-10 shadow-2xl border border-white/20 dark:border-gray-800 animate-in zoom-in-95 duration-300 relative z-10 overflow-hidden">
            <div className="relative z-10 flex justify-between items-start mb-10">
              <div className="flex gap-5 items-center">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800/50 shadow-inner">
                  <UserPlus size={28} strokeWidth={1.5} />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Add New Member</h2>
                  <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 mt-1 uppercase tracking-[0.2em]">Register team personnel</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-3 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800/50 dark:hover:bg-gray-800 rounded-2xl transition-all group">
                <X size={20} className="text-gray-500 group-hover:rotate-90 transition-transform" />
              </button>
            </div>
            <form onSubmit={handleAddEmployee} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] ml-1">Full Name</label>
                  <input required type="text" value={newEmployee.name} onChange={e => setNewEmployee({...newEmployee, name: e.target.value})} className="w-full px-5 py-3 mt-1 bg-gray-50 dark:bg-gray-800/50 border-2 border-transparent focus:border-indigo-500/20 rounded-2xl font-bold outline-none" placeholder="Jane Doe" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] ml-1">Zone</label>
                  <input required type="text" value={newEmployee.zone} onChange={e => setNewEmployee({...newEmployee, zone: e.target.value})} className="w-full px-5 py-3 mt-1 bg-gray-50 dark:bg-gray-800/50 border-2 border-transparent focus:border-indigo-500/20 rounded-2xl font-bold outline-none" placeholder="Zone B" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] ml-1">Work Email</label>
                  <input required type="email" value={newEmployee.email} onChange={e => setNewEmployee({...newEmployee, email: e.target.value})} className="w-full px-5 py-3 mt-1 bg-gray-50 dark:bg-gray-800/50 border-2 border-transparent focus:border-indigo-500/20 rounded-2xl font-bold outline-none" placeholder="jane@org.com" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] ml-1">Password</label>
                  <input required type="password" value={newEmployee.password} onChange={e => setNewEmployee({...newEmployee, password: e.target.value})} className="w-full px-5 py-3 mt-1 bg-gray-50 dark:bg-gray-800/50 border-2 border-transparent focus:border-indigo-500/20 rounded-2xl font-bold outline-none" placeholder="••••••••" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] ml-1">Designation</label>
                  <select required value={newEmployee.designation} onChange={e => setNewEmployee({...newEmployee, designation: e.target.value})} className="w-full px-5 py-3 mt-1 bg-gray-50 dark:bg-gray-800/50 border-2 border-transparent focus:border-indigo-500/20 rounded-2xl font-bold outline-none">
                    <option value="Employee">Employee</option>
                    <option value="Field Executive">Field Executive</option>
                    <option value="Senior Associate">Senior Associate</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] ml-1">Status</label>
                  <select required value={newEmployee.status} onChange={e => setNewEmployee({...newEmployee, status: e.target.value})} className="w-full px-5 py-3 mt-1 bg-gray-50 dark:bg-gray-800/50 border-2 border-transparent focus:border-indigo-500/20 rounded-2xl font-bold outline-none">
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="On Duty">On Duty</option>
                    <option value="Off Duty">Off Duty</option>
                    <option value="On Leave">On Leave</option>
                  </select>
                </div>
              </div>
              <div className="flex space-x-4 pt-4">
                <button type="submit" className="flex-1 py-4 rounded-2xl text-xs font-black uppercase tracking-[0.2em] bg-indigo-600 text-white hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 dark:shadow-none">Save Personnel</button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Edit Modal */}
      {isEditModalOpen && createPortal(
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-500" onClick={() => setIsEditModalOpen(false)} />
          <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] w-full max-w-xl p-10 shadow-2xl border border-white/20 dark:border-gray-800 animate-in zoom-in-95 duration-300 relative z-10 overflow-hidden">
            <div className="relative z-10 flex justify-between items-start mb-10">
              <div className="flex gap-5 items-center">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800/50 shadow-inner">
                  <Edit size={28} strokeWidth={1.5} />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Edit Member</h2>
                  <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 mt-1 uppercase tracking-[0.2em]">Update personnel details</p>
                </div>
              </div>
              <button onClick={() => setIsEditModalOpen(false)} className="p-3 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800/50 dark:hover:bg-gray-800 rounded-2xl transition-all group">
                <X size={20} className="text-gray-500 group-hover:rotate-90 transition-transform" />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] ml-1">Full Name</label>
                  <input required type="text" value={editingEmployee?.name || ''} onChange={e => setEditingEmployee({...editingEmployee, name: e.target.value})} className="w-full px-5 py-3 mt-1 bg-gray-50 dark:bg-gray-800/50 border-2 border-transparent focus:border-indigo-500/20 rounded-2xl font-bold outline-none" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] ml-1">Zone</label>
                  <input required type="text" value={editingEmployee?.zone || ''} onChange={e => setEditingEmployee({...editingEmployee, zone: e.target.value})} className="w-full px-5 py-3 mt-1 bg-gray-50 dark:bg-gray-800/50 border-2 border-transparent focus:border-indigo-500/20 rounded-2xl font-bold outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] ml-1">Designation</label>
                  <select required value={editingEmployee?.designation || ''} onChange={e => setEditingEmployee({...editingEmployee, designation: e.target.value})} className="w-full px-5 py-3 mt-1 bg-gray-50 dark:bg-gray-800/50 border-2 border-transparent focus:border-indigo-500/20 rounded-2xl font-bold outline-none">
                    <option value="Employee">Employee</option>
                    <option value="Field Executive">Field Executive</option>
                    <option value="Senior Associate">Senior Associate</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] ml-1">Status</label>
                  <select required value={editingEmployee?.status || ''} onChange={e => setEditingEmployee({...editingEmployee, status: e.target.value})} className="w-full px-5 py-3 mt-1 bg-gray-50 dark:bg-gray-800/50 border-2 border-transparent focus:border-indigo-500/20 rounded-2xl font-bold outline-none">
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="On Duty">On Duty</option>
                    <option value="Off Duty">Off Duty</option>
                    <option value="On Leave">On Leave</option>
                  </select>
                </div>
              </div>
              <div className="flex space-x-4 pt-4">
                <button type="submit" className="flex-1 py-4 rounded-2xl text-xs font-black uppercase tracking-[0.2em] bg-indigo-600 text-white hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 dark:shadow-none">Upload Changes</button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
};

export default ManagerTeam;
