import React from 'react';
import DataTable from '../../components/DataTable';
import { mockEmployees } from '../../utils/mockData';
import Button from '../../components/Button';
import { UserPlus, Search, Download, Shield, Users, Activity, CheckCircle2 } from 'lucide-react';

const EmployeeList = () => {
  const stats = [
    { label: 'Active Managers', value: '24', icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Total Teams', value: '12', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'System Compliance', value: '98%', icon: CheckCircle2, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  ];

  const columns = [
    {
      header: 'Manager',
      accessor: 'name',
      render: (row) => (
        <div className="flex items-center space-x-3">
          <img src={row.avatar} alt={row.name} className="w-10 h-10 rounded-full border border-gray-100 dark:border-gray-800 shadow-sm" />
          <div>
            <p className="font-bold text-gray-900 dark:text-gray-100 leading-none">{row.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{row.designation}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Team',
      accessor: 'team',
      render: (row) => (
        <span className="text-sm font-semibold text-gray-700 bg-gray-50 px-3 py-1 rounded-lg">
          {row.team}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
          row.status === 'On Duty' ? 'bg-green-100 text-green-700' :
          row.status === 'Off Duty' ? 'bg-gray-100 text-gray-700' : 'bg-orange-100 text-orange-700'
        }`}>
          {row.status}
        </span>
      ),
    },
    {
      header: 'Device Status',
      accessor: 'id',
      render: () => (
        <div className="flex items-center space-x-2 text-xs font-bold text-gray-500">
          <Shield size={14} className="text-emerald-500" />
          <span>Encrypted</span>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Manager Directory</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage and monitor your team leadership</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" className="flex items-center space-x-2 dark:border-gray-700 dark:text-gray-300">
            <Download size={18} />
            <span>Export</span>
          </Button>
          <Button variant="tenant" className="flex items-center space-x-2 shadow-lg shadow-indigo-200 dark:shadow-none">
            <UserPlus size={18} />
            <span>Add Manager</span>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center space-x-4">
            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} dark:bg-opacity-10`}>
              <stat.icon size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{stat.label}</p>
              <p className="text-xl font-black text-gray-900 dark:text-white">{stat.value}</p>
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
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500/10 outline-none transition-all"
            />
          </div>
          <div className="flex space-x-2">
            <select className="bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-xs font-bold px-3 py-2 outline-none text-gray-700 dark:text-gray-300">
              <option>All Teams</option>
              <option>A</option>
              <option>B</option>
            </select>
          </div>
        </div>
        <DataTable columns={columns} data={mockEmployees} />
      </div>
    </div>
  );
};

export default EmployeeList;
