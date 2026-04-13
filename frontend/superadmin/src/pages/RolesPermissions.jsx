import React, { useState, useEffect } from 'react';
import apiClient from '../services/apiClient';
import {
  Shield,
  Lock,
  Users,
  Eye,
  Edit3,
  ChevronRight,
  ChevronLeft,
  ArrowLeft,
  Search,
  CheckCircle2,
  XCircle,
  MoreVertical,
  Key
} from 'lucide-react';
import Button from '../components/ui/Button';
import Skeleton from '../components/ui/Skeleton';

const API_BASE = '/reatchall/superadmin/manage';

const RolesPermissions = () => {
  const [activeTab, setActiveTab] = useState('Roles');

  const [currentRole, setCurrentRole] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [permSearchQuery, setPermSearchQuery] = useState('');
  const [auditSearchQuery, setAuditSearchQuery] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // State for dynamic data
  const [roleCounts, setRoleCounts] = useState({ tenant: 0, manager: 0, employee: 0 });
  const [auditLog, setAuditLog] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [rolePeople, setRolePeople] = useState([]);
  const [isLoadingPeople, setIsLoadingPeople] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch all initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [countsRes, permsRes, logsRes] = await Promise.all([
          axios.get(`${API_BASE}/counts`),
          axios.get(`${API_BASE}/permissions`),
          axios.get(`${API_BASE}/audit-logs`)
        ]);

        setRoleCounts(countsRes.data);
        setPermissions(permsRes.data);
        
        // Format audit logs for display
        const formattedLogs = logsRes.data.map(log => ({
          ...log,
          date: new Date(log.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
          time: new Date(log.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
        }));
        setAuditLog(formattedLogs);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch users when a role is selected
  useEffect(() => {
    const fetchRoleUsers = async () => {
      if (!currentRole) {
        setRolePeople([]);
        return;
      }

      setIsLoadingPeople(true);
      try {
        const res = await apiClient.get(`${API_BASE}/users/${currentRole.name}`);
        setRolePeople(res.data);
      } catch (err) {
        console.error('Error fetching role users:', err);
        setRolePeople([]);
      } finally {
        setIsLoadingPeople(false);
      }
    };

    fetchRoleUsers();
  }, [currentRole]);

  const roles = [
    {
      id: 1,
      name: 'Tenant Admin',
      level: 'Organization',
      active: roleCounts.tenant.toLocaleString(),
      desc: 'Organization administrator managing their own company, employees, and settings.',
      color: 'indigo',
      icon: <Shield size={24} />
    },
    {
      id: 2,
      name: 'Manager',
      level: 'Team',
      active: roleCounts.manager.toLocaleString(),
      desc: 'Team lead managing field executive performance, routes, and tasks.',
      color: 'emerald',
      icon: <Users size={24} />
    },
    {
      id: 3,
      name: 'Employee',
      level: 'Individual',
      active: roleCounts.employee.toLocaleString(),
      desc: 'Field executive performing store visits, tracking movements, and collecting orders.',
      color: 'amber',
      icon: <Key size={24} />
    }
  ];

  const togglePermission = (moduleName, roleKey) => {
    setPermissions(prev => prev.map(p =>
      p.module === moduleName ? { ...p, [roleKey]: !p[roleKey] } : p
    ));
    setSaveSuccess(false);
  };

  const handleSavePermissions = async () => {
    setIsSaving(true);
    
    try {
      const actionDesc = currentRole
        ? `Updated permissions for ${currentRole.name}: Synced ${permissions.length} platform modules.`
        : `Platform-wide permission sync performed for all roles.`;

      for (const p of permissions) {
        await Promise.all([
          apiClient.put(`${API_BASE}/permissions`, { module: p.module, roleKey: 'tenant', allowed: p.tenant }),
          apiClient.put(`${API_BASE}/permissions`, { module: p.module, roleKey: 'manager', allowed: p.manager }),
          apiClient.put(`${API_BASE}/permissions`, { module: p.module, roleKey: 'employee', allowed: p.employee })
        ]);
      }

      const auditPayload = {
        user: 'Rahul Saini',
        email: 'superadmin@trackforce.com',
        userRole: 'Super Admin',
        type: 'PERMISSIONS UPDATED',
        action: actionDesc,
        role: currentRole ? `${currentRole.name} Access` : 'System-Wide Access',
        status: 'Success'
      };

      const logRes = await apiClient.post(`${API_BASE}/audit-logs`, auditPayload);
      
      const newEntry = {
        ...logRes.data,
        date: new Date(logRes.data.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        time: new Date(logRes.data.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
      };
      
      setAuditLog(prev => [newEntry, ...prev]);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save permissions:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportLog = () => {
    const headers = ['Date', 'Time', 'Type', 'Action', 'Target Role', 'Operator', 'Status'];
    const csvContent = [
      headers.join(','),
      ...auditLog.map(log => [
        `"${log.date}"`,
        `"${log.time}"`,
        `"${log.type}"`,
        `"${log.action.replace(/"/g, '""')}"`,
        `"${log.role}"`,
        `"${log.user} (${log.email})"`,
        `"${log.status}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `activity_log_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredPeople = rolePeople.filter(person =>
    (person.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
     person.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
     person.company?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredPermissions = permissions.filter(p =>
    p.module.toLowerCase().includes(permSearchQuery.toLowerCase())
  );

  const q = auditSearchQuery.toLowerCase();
  const filteredAuditLog = auditLog.filter(log =>
    !q ||
    log.action?.toLowerCase().includes(q) ||
    log.user?.toLowerCase().includes(q) ||
    log.email?.toLowerCase().includes(q) ||
    log.type?.toLowerCase().includes(q) ||
    log.role?.toLowerCase().includes(q) ||
    log.status?.toLowerCase().includes(q)
  );

  const renderRoles = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {loading ? (
        [1, 2, 3].map(i => (
          <div key={i} className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 p-10 space-y-8">
            <div className="flex justify-between items-start">
              <div className="space-y-3">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-10 w-24" />
              </div>
              <Skeleton variant="rounded" className="w-14 h-14" />
            </div>
            <div className="space-y-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-3 w-32" />
            </div>
            <Skeleton className="h-4 w-full" />
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(j => <Skeleton key={j} className="w-10 h-10 rounded-xl border-4 border-white dark:border-gray-900" />)}
              </div>
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-14 w-full rounded-2xl" />
          </div>
        ))
      ) : (
        roles.map((role) => (
          <div key={role.id} className="group relative bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
            {/* Top Visual Accent */}
            <div className={`absolute top-0 left-0 w-full h-2 bg-${role.color}-500 opacity-20 group-hover:opacity-100 transition-opacity`} />

            <div className="p-10 flex flex-col h-full">
              {/* Header: Status & Badge */}
              <div className="flex justify-between items-start mb-10">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Total Active</span>
                  <span className={`text-4xl font-black text-gray-900 dark:text-white tracking-tighter`}>{role.active}</span>
                </div>
                <div className={`p-4 rounded-2xl bg-${role.color}-50 dark:bg-${role.color}-900/30 text-${role.color}-600 shadow-inner group-hover:scale-110 transition-transform`}>
                  {role.icon}
                </div>
              </div>

              {/* Role Title & Level */}
              <div className="mb-6">
                <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight mb-1">{role.name}</h3>
                <p className={`text-[10px] font-black text-${role.color}-600 uppercase tracking-[0.3em]`}>{role.level}</p>
              </div>

              {/* Description */}
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 leading-relaxed mb-8 flex-grow">
                {role.desc}
              </p>

              {/* Avatar Stack: A, B, C, D, + */}
              <div className="flex items-center gap-4 mb-10">
                <div className="flex -space-x-3">
                  {['A', 'B', 'C', 'D'].map((initial, i) => (
                    <div key={i} className={`w-10 h-10 rounded-xl border-4 border-white dark:border-gray-900 bg-${role.color}-50 dark:bg-${role.color}-800 flex items-center justify-center text-[10px] font-black text-${role.color}-600 shadow-sm`}>
                      {initial}
                    </div>
                  ))}
                  <div className="w-10 h-10 rounded-xl border-4 border-white dark:border-gray-900 bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-[10px] font-black text-gray-400 shadow-sm">
                    +
                  </div>
                </div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Personnel Preview</span>
              </div>

              {/* Footer Action */}
              <Button
                variant="primary"
                onClick={() => setCurrentRole(role)}
                className={`w-full py-4 rounded-2xl bg-${role.color}-600 hover:bg-${role.color}-700 shadow-lg shadow-${role.color}-100 dark:shadow-none flex items-center justify-center gap-3 group/btn`}
              >
                <span className="font-black uppercase tracking-[0.2em] text-[10px] text-white">View Details</span>
                <ChevronRight size={14} className="text-white group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        ))
      )}
    </div>
  );

  const renderRoleDetail = () => (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
      {/* Detail Header */}
      <div className="bg-white dark:bg-gray-900 p-8 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-xl flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
        {loading ? (
          <>
            <div className="flex items-center gap-6 w-full md:w-auto flex-1">
              <Skeleton className="h-12 w-24 rounded-2xl" />
              <div className="space-y-3 flex-1">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-96" />
              </div>
            </div>
            <Skeleton className="h-12 w-48 rounded-2xl" />
          </>
        ) : (
          <>
            <div className={`absolute top-0 left-0 w-1 h-full bg-${currentRole.color}-500`} />
            <div className="flex items-center gap-6 w-full md:w-auto">
              <button
                onClick={() => setCurrentRole(null)}
                className="group flex items-center gap-2 p-3 pr-5 rounded-2xl bg-gray-50 dark:bg-gray-800 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all border border-transparent hover:border-indigo-100 shadow-sm"
              >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                <span className="text-xs font-black uppercase tracking-widest text-nowrap">Back</span>
              </button>
              <div className="truncate">
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tight truncate">{currentRole.name} Directory</h2>
                  <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest bg-${currentRole.color}-50 text-${currentRole.color}-600 border border-${currentRole.color}-100 hidden sm:inline-block`}>
                    {currentRole.level} Access
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium italic truncate">Associated records for {currentRole.name} profile.</p>
              </div>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
              <Button
                variant="primary"
                onClick={() => {
                  setActiveTab('Permissions');
                  setCurrentRole(null);
                  setPermSearchQuery('');
                }}
                className="rounded-2xl py-4 px-8 shadow-xl shadow-indigo-100 dark:shadow-none flex items-center gap-2 bg-indigo-600 text-white w-full md:w-auto justify-center"
              >
                <Shield size={18} />
                <span className="font-black uppercase tracking-widest text-xs">Manage Role Permissions</span>
              </Button>
            </div>
          </>
        )}
      </div>

      {/* People Table */}
      <div className="bg-white dark:bg-gray-900 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50/30">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Personnel Directory</h3>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="flex items-center gap-2 px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm w-full sm:w-80 focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
              <Search size={16} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none text-xs font-bold outline-none w-full"
              />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-50 dark:border-gray-800">
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Member Identity</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-x border-gray-50 dark:border-gray-800">Status / Activity</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Hierarchy & Region</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-l border-gray-50 dark:border-gray-800 text-right">Organization & Context</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {isLoadingPeople || loading ? (
                [1, 2, 3, 4, 5].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <Skeleton variant="rounded" className="w-12 h-12" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-48" />
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 border-x border-gray-50 dark:border-gray-800">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </td>
                    <td className="px-8 py-6 border-l border-gray-50 dark:border-gray-800">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </td>
                  </tr>
                ))
              ) : filteredPeople.map((person, i) => (
                <tr key={person._id || i} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl bg-${currentRole.color}-50 dark:bg-${currentRole.color}-900/30 flex items-center justify-center text-sm font-black text-${currentRole.color}-600 shadow-inner group-hover:scale-110 transition-transform`}>
                        {person.name?.split(' ').map(n => n[0]).join('') || '?'}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors">{person.name}</span>
                        <span className="text-[11px] text-gray-400 font-bold">{person.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 border-x border-gray-50 dark:border-gray-800">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${person.status === 'Active' || person.status === 'On Field' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                        <span className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-tighter">{person.status || 'Registered'}</span>
                      </div>
                      <span className="text-[10px] text-gray-400 font-bold italic">{person.lastActive || person.area || 'Platform User'}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-tight">{person.role || currentRole.name}</span>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">{person.area || person.team || 'National'}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 border-l border-gray-50 dark:border-gray-800">
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-gray-900 dark:text-white">{person.company || 'Not Assigned'}</span>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                        {person.type || person.performance || (person.todayVisits ? person.todayVisits + ' Visits Today' : 'Standard Access')}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
              {!isLoadingPeople && !loading && filteredPeople.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="p-4 rounded-full bg-gray-50 dark:bg-gray-800 text-gray-300">
                        <Search size={32} />
                      </div>
                      <p className="text-sm font-black text-gray-400 uppercase tracking-widest">No matching records found for "{searchQuery}"</p>
                      <button onClick={() => setSearchQuery('')} className="text-xs font-black text-indigo-600 hover:underline tracking-widest uppercase">Clear Search</button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-8 bg-gray-50/50 dark:bg-gray-800/20 flex justify-center border-t border-gray-100 dark:border-gray-800">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Total Results: {filteredPeople.length} Records</p>
        </div>
      </div>
    </div>
  );

  const renderPermissionsMatrix = () => (
    <div className="bg-white dark:bg-gray-900 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
      <div className="p-8 border-b border-gray-50 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-6 bg-gray-50/30">
        <div />
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="flex items-center gap-2 px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm w-full sm:w-80 focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
            <Search size={16} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search modules..."
              value={permSearchQuery}
              onChange={(e) => setPermSearchQuery(e.target.value)}
              className="bg-transparent border-none text-xs font-bold outline-none w-full"
            />
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50/50 dark:bg-gray-800/20 border-b border-gray-100 dark:border-gray-700">
              <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Platform Module</th>
              {['Tenant Admin', 'Manager', 'Employee'].map(role => (
                <th key={role} className="px-10 py-6 text-center text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-[0.2em] border-l border-gray-100 dark:border-gray-800">{role}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
            {loading ? (
              [1, 2, 3, 4, 5, 6].map(i => (
                <tr key={i} className="animate-pulse">
                  <td className="px-10 py-6">
                    <Skeleton className="h-5 w-48" />
                  </td>
                  {[1, 2, 3].map(j => (
                    <td key={j} className="px-10 py-6 border-l border-gray-50 dark:border-gray-800">
                      <Skeleton className="mx-auto w-10 h-10 rounded-2xl" />
                    </td>
                  ))}
                </tr>
              ))
            ) : filteredPermissions.map((row) => (
              <tr key={row.module} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-all group">
                <td className="px-10 py-6">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="text-sm font-black text-gray-900 dark:text-white tracking-tight group-hover:translate-x-1 transition-transform">{row.module}</span>
                  </div>
                </td>
                {['tenant', 'manager', 'employee'].map((roleKey, idx) => {
                  const allowed = row[roleKey];
                  return (
                    <td key={idx} className="px-10 py-6 text-center border-l border-gray-50 dark:border-gray-800">
                      <button
                        onClick={() => togglePermission(row.module, roleKey)}
                        className={`mx-auto w-10 h-10 rounded-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 ${allowed ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 shadow-inner' : 'bg-red-50 dark:bg-red-900/20 text-red-500 shadow-inner'}`}
                      >
                        {allowed ? <CheckCircle2 size={20} strokeWidth={3} /> : <XCircle size={20} strokeWidth={2.5} />}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
            {!loading && filteredPermissions.length === 0 && (
              <tr>
                <td colSpan="4" className="px-8 py-20 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="p-4 rounded-full bg-gray-50 dark:bg-gray-800 text-gray-300">
                      <Key size={32} />
                    </div>
                    <p className="text-sm font-black text-gray-400 uppercase tracking-widest">No matching modules found for "{permSearchQuery}"</p>
                    <button onClick={() => setPermSearchQuery('')} className="text-xs font-black text-indigo-600 hover:underline tracking-widest uppercase">Clear Search</button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="p-8 bg-gray-50/50 dark:bg-gray-800/20 border-t border-gray-100 dark:border-gray-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          {/* <div className="flex items-center gap-2 text-blue-500">
            <CheckCircle2 size={12} />
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tenant Admin Managed</span>
          </div> */}
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          {saveSuccess && (
            <div className="animate-in fade-in slide-in-from-right-4 flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-xl border border-emerald-100 text-[10px] font-black uppercase tracking-widest">
              <CheckCircle2 size={14} />
              Changes Committed Successfully
            </div>
          )}
          <Button
            variant="primary"
            onClick={handleSavePermissions}
            disabled={isSaving}
            className="rounded-2xl py-4 px-10 shadow-xl shadow-indigo-100 flex items-center gap-3 bg-indigo-600 text-white w-full md:w-auto justify-center"
          >
            {isSaving ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Key size={18} />
            )}
            <span className="font-black uppercase tracking-widest text-xs">
              {isSaving ? 'Processing...' : 'Save Matrix Changes'}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );

  const renderAuditLog = () => (
    <div className="bg-white dark:bg-gray-900 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
      {/* Activity Log Header */}
      <div className="p-10 border-b border-gray-50 dark:border-gray-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 bg-gray-50/20">
        {loading ? (
          <>
            <div className="space-y-3">
              <Skeleton className="h-9 w-52 uppercase tracking-tight" />
              <Skeleton className="h-4 w-72 font-medium" />
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto">
              <Skeleton className="h-12 w-56 rounded-2xl" />
              <Skeleton className="h-12 w-36 rounded-2xl" />
            </div>
          </>
        ) : (
          <>
            <div>
              <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight leading-none mb-2">AUDIT LOG</h3>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Your chronological field performance history</p>
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="p-3.5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-2 flex-grow focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
                <Search size={16} className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Search activities..."
                  value={auditSearchQuery}
                  onChange={(e) => setAuditSearchQuery(e.target.value)}
                  className="bg-transparent border-none text-xs font-black outline-none w-40"
                />
                {auditSearchQuery && (
                  <button
                    onClick={() => setAuditSearchQuery('')}
                    className="text-gray-300 hover:text-gray-500 transition-colors ml-1 shrink-0"
                    title="Clear search"
                  >
                    <XCircle size={14} />
                  </button>
                )}
              </div>
              <button
                onClick={handleExportLog}
                className="whitespace-nowrap px-8 py-3.5 rounded-2xl border-2 border-indigo-100 dark:border-indigo-900 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all shadow-sm flex items-center gap-2"
              >
                <ChevronRight size={14} className="rotate-90" />
                Export Log
              </button>
            </div>
          </>
        )}
      </div>

      {/* Timeline Section */}
      <div className="p-10 bg-white dark:bg-gray-900">
        <div className="flex items-center justify-between mb-10 pb-4 border-b border-gray-100 dark:border-gray-800">
          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
            {auditSearchQuery ? `Results for "${auditSearchQuery}"` : 'Timeline History'}
          </h4>
          <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-full">
            {filteredAuditLog.length}{auditSearchQuery ? ` / ${auditLog.length}` : ''} TOTAL
          </span>
        </div>

        <div className="space-y-6 relative before:absolute before:left-[11rem] before:top-2 before:bottom-0 before:w-0.5 before:bg-gray-100 dark:before:bg-gray-800">
          {loading ? (
            [1, 2, 3, 4].map(i => (
              <div key={i} className="flex gap-12 animate-pulse">
                <div className="w-[8rem] flex flex-col items-end shrink-0 pt-1 space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-3 w-12" />
                </div>
                <div className="relative z-10 shrink-0 mt-1.5 pt-1 bg-white dark:bg-gray-900">
                  <div className="w-4 h-4 rounded-full border-4 border-white dark:border-gray-900 bg-gray-200 shadow-lg" />
                </div>
                <div className="flex-grow pb-6 space-y-3">
                  <div className="flex gap-2">
                    <Skeleton className="h-5 w-24 rounded-lg" />
                    <Skeleton className="h-5 w-16 rounded-lg" />
                  </div>
                  <Skeleton className="h-5 w-3/4" />
                </div>
              </div>
            ))
          ) : filteredAuditLog.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-20">
              <div className="p-5 rounded-full bg-gray-50 dark:bg-gray-800 text-gray-300">
                <Search size={36} />
              </div>
              <p className="text-sm font-black text-gray-400 uppercase tracking-widest">No results for "{auditSearchQuery}"</p>
              <button
                onClick={() => setAuditSearchQuery('')}
                className="text-xs font-black text-indigo-600 hover:underline tracking-widest uppercase"
              >
                Clear Search
              </button>
            </div>
          ) : filteredAuditLog.map((log) => (
            <div key={log.id} className="flex gap-12 group animate-in fade-in slide-in-from-right-4 duration-500">
              {/* Date/Time Column */}
              <div className="w-[8rem] flex flex-col items-end shrink-0 pt-1">
                <span className="text-xs font-black text-gray-900 dark:text-white tracking-tight">{log.date}</span>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{log.time}</span>
              </div>

              {/* Vertical Indicator */}
              <div className="relative z-10 shrink-0 mt-1.5 pt-1 bg-white dark:bg-gray-900">
                <div className="w-4 h-4 rounded-full border-4 border-white dark:border-gray-900 bg-indigo-600 shadow-lg group-hover:scale-125 transition-transform" />
              </div>

              {/* Content Column */}
              <div className="flex-grow pb-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-3 py-1 rounded-lg bg-gray-50 dark:bg-gray-800 text-[9px] font-black text-gray-600 dark:text-gray-400 uppercase tracking-[0.15em] border border-gray-100 dark:border-gray-700">
                    {log.type}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[9px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 dark:bg-emerald-900/10 px-2 py-0.5 rounded-md border border-emerald-100/50">
                    <CheckCircle2 size={10} />
                    {log.status}
                  </span>
                </div>
                <h5 className="text-sm font-black text-gray-800 dark:text-gray-200 leading-relaxed mb-4">{log.action}</h5>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Page Header (Only show if not in detail view) */}
      {!currentRole && (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-gray-100 dark:border-gray-800 pb-8">
          {loading ? (
            <div className="space-y-3">
              <Skeleton className="h-9 w-72 uppercase tracking-tight" />
              <Skeleton className="h-4 w-[28rem] font-medium" />
            </div>
          ) : (
            <div>
              <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Roles & Permissions</h1>
              <p className="text-xs text-gray-400 mt-1 font-bold uppercase tracking-widest">Manage platform access & security levels</p>
            </div>
          )}

          <div className="flex items-center bg-gray-50 dark:bg-gray-800/50 p-2 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-inner">
            {loading ? (
              <div className="flex space-x-1">
                <Skeleton className="h-11 w-32 rounded-xl" />
                <Skeleton className="h-11 w-36 rounded-xl" />
                <Skeleton className="h-11 w-32 rounded-xl" />
              </div>
            ) : (
              ['Roles', 'Permissions', 'Audit Log'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-8 py-3.5 text-xs font-black uppercase tracking-widest transition-all rounded-xl ${activeTab === tab
                    ? 'bg-white dark:bg-gray-700 text-indigo-600 shadow-md border border-gray-100 dark:border-gray-600 scale-105'
                    : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
                    }`}
                >
                  {tab}
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'Roles' && (currentRole ? renderRoleDetail() : renderRoles())}

      {activeTab === 'Permissions' && renderPermissionsMatrix()}
      {activeTab === 'Audit Log' && renderAuditLog()}
    </div>
  );
};

export default RolesPermissions;
