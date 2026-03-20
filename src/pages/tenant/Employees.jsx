import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import DataTable from '../../components/DataTable';
import { mockEmployees } from '../../utils/mockData';
import Button from '../../components/Button';
import { UserPlus, Search, Download, Shield, Users, Activity, CheckCircle2, X } from 'lucide-react';

const EmployeeList = () => {
  const [employees, setEmployees] = useState(mockEmployees);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newManager, setNewManager] = useState({ name: '', team: '', designation: 'Operations Manager' });
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showSuccess, setShowSuccess] = useState(false);
  const [addedManagerName, setAddedManagerName] = useState('');

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  const stats = [
    { label: 'Total Managers', value: employees.length.toString(), icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50', filter: 'All' },
    { label: 'Active Managers', value: employees.filter(e => e.status === 'On Duty').length.toString(), icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50', filter: 'On Duty' },
    { label: 'Inactive Managers', value: employees.filter(e => e.status !== 'On Duty').length.toString(), icon: Shield, color: 'text-rose-600', bg: 'bg-rose-50', filter: 'Inactive' },
    { label: 'Total Teams', value: new Set(employees.map(e => e.team)).size.toString(), icon: Activity, color: 'text-blue-600', bg: 'bg-blue-50', filter: 'All' },
  ];

  const handleAddManager = (e) => {
    e.preventDefault();
    const manager = {
      id: Date.now(),
      name: newManager.name,
      designation: newManager.designation,
      status: 'On Duty',
      team: newManager.team,
      visitsToday: 0,
      avatar: `https://i.pravatar.cc/150?u=${Date.now()}`
    };
    setEmployees([manager, ...employees]);
    setAddedManagerName(newManager.name);
    setIsModalOpen(false);
    setNewManager({ name: '', team: '', designation: 'Operations Manager' });
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleExportCSV = () => {
    const headers = ['Name', 'Designation', 'Team', 'Status'];
    const rows = employees.map(emp => [
      `"${emp.name}"`,
      `"${emp.designation}"`,
      `"${emp.team}"`,
      `"${emp.status}"`
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'managers_directory.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.team.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' ||
      (statusFilter === 'Inactive' ? emp.status !== 'On Duty' : emp.status === statusFilter);
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      header: 'Manager',
      accessor: 'name',
      render: (row) => (
        <div className="flex items-center space-x-4">
          <div className="relative group/avatar">
            <img src={row.avatar} alt={row.name} className="w-12 h-12 rounded-2xl object-cover border-2 border-white dark:border-gray-800 shadow-md transition-transform group-hover/avatar:scale-110 duration-300" />
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-gray-900 shadow-sm ${row.status === 'On Duty' ? 'bg-emerald-500' : row.status === 'Off Duty' ? 'bg-gray-400' : 'bg-orange-500'}`} />
          </div>
          <div>
            <p className="font-black text-gray-900 dark:text-white text-base leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{row.name}</p>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-0.5">{row.designation}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Team',
      accessor: 'team',
      render: (row) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs border border-indigo-100 dark:border-indigo-800/50">
            {row.team.charAt(0)}
          </div>
          <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
            {row.team}
          </span>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider border backdrop-blur-sm shadow-sm ${row.status === 'On Duty' ? 'bg-emerald-50/80 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800' :
            row.status === 'Off Duty' ? 'bg-gray-50/80 text-gray-700 border-gray-200 dark:bg-gray-800/50 dark:text-gray-400 dark:border-gray-700' :
              'bg-orange-50/80 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800'
          }`}>
          {row.status}
        </span>
      ),
    },
    {
      header: 'Security',
      accessor: 'id',
      render: () => (
        <div className="flex items-center space-x-2 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-xl w-max border border-emerald-100 dark:border-emerald-800/50 backdrop-blur-sm shadow-sm">
          <Shield size={14} className="text-emerald-500 dark:text-emerald-400" />
          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">Encrypted</span>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Manager Directory</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage and monitor your team leadership</p>
        </div>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            className="flex items-center space-x-2 dark:border-gray-700 dark:text-gray-300"
            onClick={handleExportCSV}
          >
            <Download size={18} />
            <span>Export</span>
          </Button>
          <Button
            variant="tenant"
            className="flex items-center space-x-2 shadow-lg shadow-indigo-200 dark:shadow-none"
            onClick={() => setIsModalOpen(true)}
          >
            <UserPlus size={18} />
            <span>Add Manager</span>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div
            key={i}
            onClick={() => setStatusFilter(stat.filter)}
            className={`bg-white dark:bg-gray-900 p-4 rounded-[2rem] border transition-all group relative overflow-hidden cursor-pointer ${statusFilter === stat.filter ? 'border-indigo-500 shadow-lg shadow-indigo-100 dark:shadow-none translate-y-[-4px]' : 'border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md'
              }`}
          >
            <div className={`absolute -right-4 -top-4 w-16 h-16 rounded-full ${stat.bg} opacity-20 dark:opacity-10 group-hover:scale-150 transition-transform duration-700`} />
            <div className="flex items-center space-x-4 relative">
              <div className={`w-11 h-11 rounded-2xl ${stat.bg} ${stat.color} dark:bg-opacity-20 flex items-center justify-center group-hover:rotate-[10deg] transition-transform duration-500 shadow-inner`}>
                <stat.icon size={20} />
              </div>
              <div>
                <p className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-0.5">{stat.label}</p>
                <p className="text-2xl font-black text-gray-900 dark:text-white leading-none">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Table with search */}
      <div className="bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Search managers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500/10 outline-none transition-all"
            />
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center bg-gray-50 dark:bg-gray-800 rounded-xl px-3 py-2 border border-transparent focus-within:border-indigo-500/20 transition-all shadow-sm hover:bg-gray-100 dark:hover:bg-gray-750">
              <Activity size={16} className="text-emerald-500 dark:text-emerald-400 mr-2" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent border-none text-xs font-black outline-none text-gray-700 dark:text-gray-100 cursor-pointer min-w-[110px] appearance-none [&>option]:bg-white [&>option]:dark:bg-gray-900 [&>option]:text-gray-700 [&>option]:dark:text-white"
              >
                <option value="All">All Status</option>
                <option value="On Duty">On Duty</option>
                <option value="Inactive">Inactive</option>
                <option value="Off Duty">Off Duty</option>
                <option value="On Leave">On Leave</option>
              </select>
            </div>
          </div>
        </div>
        <DataTable columns={columns} data={filteredEmployees} />
      </div>

      {/* Modal */}
      {isModalOpen && createPortal(
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-500"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] w-full max-w-xl p-10 shadow-2xl border border-white/20 dark:border-gray-800 animate-in zoom-in-95 duration-300 relative z-10">
            <div className="flex justify-between items-start mb-10">
              <div>
                <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Add New Manager</h2>
                <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 mt-1 uppercase tracking-[0.2em]">Register a new team leader</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-2xl transition-all duration-300 group"
              >
                <X size={24} className="text-gray-400 group-hover:rotate-90 transition-transform duration-300" />
              </button>
            </div>

            <form onSubmit={handleAddManager} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.25em] ml-1">Manager Name</label>
                  <input
                    required
                    type="text"
                    value={newManager.name}
                    onChange={(e) => setNewManager({ ...newManager, name: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-50/50 dark:bg-gray-800/50 border-2 border-transparent focus:border-emerald-500/20 rounded-2xl text-gray-900 dark:text-white font-bold transition-all outline-none placeholder:text-gray-300"
                    placeholder="e.g. John Doe"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.25em] ml-1">Team Name</label>
                  <input
                    required
                    type="text"
                    value={newManager.team}
                    onChange={(e) => setNewManager({ ...newManager, team: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-50/50 dark:bg-gray-800/50 border-2 border-transparent focus:border-emerald-500/20 rounded-2xl text-gray-900 dark:text-white font-bold transition-all outline-none placeholder:text-gray-300"
                    placeholder="e.g. Team Alpha"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.25em] ml-1">Designated Role</label>
                <div className="relative group">
                  <select
                    required
                    value={newManager.designation}
                    onChange={(e) => setNewManager({ ...newManager, designation: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-50/50 dark:bg-gray-800/50 border-2 border-transparent focus:border-emerald-500/20 rounded-2xl text-gray-900 dark:text-white font-bold transition-all outline-none appearance-none cursor-pointer"
                  >
                    <option value="Operations Manager">Operations Manager</option>
                    <option value="Regional Manager">Regional Manager</option>
                    <option value="Team Lead">Team Lead</option>
                    <option value="Project Manager">Project Manager</option>
                  </select>
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <Users size={18} />
                  </div>
                </div>
              </div>
              <div className="flex space-x-4 pt-6">
                <button
                  type="button"
                  className="flex-1 py-5 rounded-2xl text-xs font-black uppercase tracking-[0.2em] border border-gray-100 dark:border-gray-800 text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all active:scale-95"
                  onClick={() => setIsModalOpen(false)}
                >
                  Discard
                </button>
                <button
                  type="submit"
                  className="flex-1 py-5 rounded-2xl text-xs font-black uppercase tracking-[0.2em] bg-[#00966d] text-white shadow-xl shadow-emerald-100 dark:shadow-none transition-all hover:bg-[#007b5a] hover:scale-[1.02] active:scale-95"
                >
                  Save Manager
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Success Toast */}
      {showSuccess && createPortal(
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[160] animate-in slide-in-from-top-5 duration-300">
          <div className="bg-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center space-x-3 border-2 border-emerald-500/50 backdrop-blur-md">
            <CheckCircle2 size={20} className="text-emerald-100" />
            <p className="font-bold tracking-tight">Manager "{addedManagerName}" added successfully!</p>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default EmployeeList;
