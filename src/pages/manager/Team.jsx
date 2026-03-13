import React from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from '../../components/DataTable';
import { mockEmployees } from '../../utils/mockData';
import { Users, Search, Download, Shield, MapPin, Activity } from 'lucide-react';
import Button from '../../components/Button';

const ManagerTeam = () => {
  const stats = [
    { label: 'Total Members', value: '12', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'In Field', value: '8', icon: MapPin, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Avg. Visits', value: '5.2', icon: Activity, color: 'text-purple-600', bg: 'bg-purple-50' },
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
        <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
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
        <div className="flex flex-col space-y-1">
          <div className="flex items-center justify-between text-[10px] font-bold text-gray-400">
            <span>{row.visitsToday} visits</span>
            <span>Target: 8</span>
          </div>
          <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 rounded-full" 
              style={{ width: `${(row.visitsToday / 8) * 100}%` }}
            />
          </div>
        </div>
      )
    }
  ];

  // Filter only relevant team members for this manager (Mock logic)
  const teamMembers = mockEmployees.slice(0, 5);
  const navigate = useNavigate();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Team Management</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Direct oversight of your assigned field personnel</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" className="flex items-center space-x-2 dark:border-gray-700 dark:text-gray-300">
            <Download size={18} />
            <span>Export Report</span>
          </Button>
        </div>
      </div>

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

      <div className="bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
            <input 
              type="text" 
              placeholder="Search team members..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/10 outline-none transition-all"
            />
          </div>
        </div>
        <DataTable 
          columns={columns} 
          data={teamMembers} 
          onRowClick={(row) => navigate(`/manager/team/${row.id}`)}
        />
      </div>
    </div>
  );
};

export default ManagerTeam;
