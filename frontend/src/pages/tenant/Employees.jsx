import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import DataTable from '../../components/DataTable';
import tenantService from '../../services/tenantService';
import Button from '../../components/Button';
import { UserPlus, Search, Download, Shield, Users, Activity, CheckCircle2, X, ArrowLeft, Mail, Phone, MapPin, Briefcase, Calendar, User, Clock, Edit, Trash2, Ban } from 'lucide-react';

const getRelativeTime = (timestamp) => {
  const now = new Date();
  const past = new Date(timestamp);
  const diffMs = now - past;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hr${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  return past.toLocaleDateString();
};

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedManager, setSelectedManager] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newManager, setNewManager] = useState({ name: '', email: '', password: '', zone: '', designation: 'Operations Manager', status: 'Active' });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingManager, setEditingManager] = useState(null);
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
  }, [isModalOpen, isEditModalOpen]);

  useEffect(() => {
    fetchManagers();
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const data = await tenantService.getEmployees();
      const mapped = data.map(e => ({
        id: e._id,
        name: e.name,
        role: e.profile?.designation || 'Employee',
        status: e.isDeactivated ? 'Inactive' : 'Active',
        lastActivity: new Date().toISOString()
      }));
      setTeamMembers(mapped);
    } catch (error) {
      console.error('Failed to fetch team members:', error);
    }
  };

  const fetchManagers = async () => {
    try {
      const data = await tenantService.getManagers();
      const mapped = data.map(m => ({
        id: m._id,
        name: m.name,
        email: m.email,
        designation: m.profile?.designation || 'Manager',
        status: m.status || (m.isDeactivated ? 'Inactive' : 'On Duty'),
        zone: m.profile?.zone || m.profile?.team || 'N/A',
        avatar: `https://i.pravatar.cc/150?u=${m._id}`
      }));
      setEmployees(mapped);
    } catch (error) {
      console.error('Failed to fetch managers:', error);
    }
  };

  const stats = [
    { label: 'Total Managers', value: employees.length.toString(), icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50', filter: 'All' },
    { label: 'Active Managers', value: employees.filter(e => e.status === 'On Duty').length.toString(), icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50', filter: 'On Duty' },
    { label: 'Inactive Managers', value: employees.filter(e => e.status !== 'On Duty').length.toString(), icon: Shield, color: 'text-rose-600', bg: 'bg-rose-50', filter: 'Inactive' },
    { label: 'Total Zones', value: new Set(employees.map(e => e.zone)).size.toString(), icon: Activity, color: 'text-blue-600', bg: 'bg-blue-50', filter: 'All' },
  ];

  const handleAddManager = async (e) => {
    e.preventDefault();
    try {
      const response = await tenantService.createManager(newManager);
      const m = response.data;
      const manager = {
        id: m._id,
        name: m.name,
        email: m.email,
        designation: m.profile?.designation || 'Manager',
        status: m.status || 'On Duty',
        zone: m.profile?.zone || m.profile?.team || 'N/A',
        avatar: `https://i.pravatar.cc/150?u=${m._id}`
      };
      setEmployees([manager, ...employees]);
      setAddedManagerName(newManager.name);
      setIsModalOpen(false);
      setNewManager({ name: '', email: '', password: '', zone: '', designation: 'Operations Manager', status: 'Active' });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to create manager:', error);
      alert(error.response?.data?.message || 'Failed to create manager');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await tenantService.updateManager(editingManager.id, editingManager);
      setEmployees(employees.map(emp => emp.id === editingManager.id ? { ...emp, name: editingManager.name, zone: editingManager.zone, designation: editingManager.designation, status: editingManager.status } : emp));
      setIsEditModalOpen(false);
      setEditingManager(null);
      setShowSuccess(true);
      setAddedManagerName(editingManager.name);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to edit manager:', err);
      alert('Failed to edit manager');
    }
  };

  const handleSuspendManager = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Inactive' ? 'Active' : 'Inactive';
    try {
      await tenantService.updateManager(id, { status: newStatus });
      setEmployees(employees.map(emp => emp.id === id ? { ...emp, status: newStatus } : emp));
    } catch (err) {
      console.error(err);
      alert('Failed to update status');
    }
  };

  const handleDeleteManager = async (id) => {
    if (window.confirm("Are you sure you want to delete this manager?")) {
      try {
        await tenantService.deleteManager(id);
        const filtered = employees.filter(emp => emp.id !== id);
        setEmployees(filtered);
        setSelectedManager(null);
      } catch (error) {
        console.error('Failed to delete manager:', error);
        alert('Failed to delete manager');
      }
    }
  };

  const handleExportCSV = () => {
    const headers = ['Name', 'Designation', 'Zone', 'Status'];
    const rows = employees.map(emp => [
      `"${emp.name}"`,
      `"${emp.designation}"`,
      `"${emp.zone}"`,
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
      emp.zone.toLowerCase().includes(searchQuery.toLowerCase());
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
      header: 'Zone',
      accessor: 'zone',
      render: (row) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs border border-indigo-100 dark:border-indigo-800/50">
            {row.zone.charAt(0)}
          </div>
          <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
            {row.zone}
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
    {
      header: 'Actions',
      accessor: 'actions',
      render: (row) => (
        <div className="flex items-center justify-end space-x-2" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => {
              setEditingManager(row);
              setIsEditModalOpen(true);
            }}
            title="Edit Manager"
            className="p-2 text-indigo-500 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:hover:bg-indigo-900/40 rounded-lg transition-colors"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => handleSuspendManager(row.id, row.status)}
            title={row.status === 'Inactive' ? 'Re-activate' : 'Suspend Op'}
            className={`p-2 rounded-lg transition-colors ${row.status === 'Inactive' ? 'text-emerald-500 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/40' : 'text-orange-500 bg-orange-50 hover:bg-orange-100 dark:bg-orange-900/20 dark:hover:bg-orange-900/40'}`}
          >
            <Ban size={16} />
          </button>
          <button
            onClick={() => handleDeleteManager(row.id)}
            title="Delete Profile"
            className="p-2 text-rose-500 bg-rose-50 hover:bg-rose-100 dark:bg-rose-900/20 dark:hover:bg-rose-900/40 rounded-lg transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  if (selectedEmployee) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500 overflow-x-hidden">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => setSelectedEmployee(null)} className="p-2 border border-gray-100 dark:border-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <ArrowLeft size={20} className="text-gray-600 dark:text-gray-400" />
          </Button>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Employee Profile</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
          <div className="absolute -top-10 -right-10 w-64 h-64 bg-indigo-50 dark:bg-indigo-900/20 rounded-full blur-3xl opacity-50 pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-emerald-50 dark:bg-emerald-900/20 rounded-full blur-3xl opacity-50 pointer-events-none" />

          <div className="col-span-1 md:col-span-2 bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/20 dark:shadow-none flex flex-col md:flex-row items-center gap-8 relative overflow-hidden group">

            <div className="w-32 h-32 rounded-[2rem] bg-indigo-50 dark:bg-indigo-900/40 flex items-center justify-center border-4 border-white dark:border-gray-800 shadow-lg shrink-0 group-hover:scale-110 transition-transform duration-500">
              <svg viewBox="0 0 24 24" fill="none" className="w-16 h-16 text-indigo-500">
                <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="currentColor" />
              </svg>
            </div>

            <div className="flex-grow text-center md:text-left space-y-2 z-10">
              <div className="flex flex-col md:flex-row md:items-center justify-center md:justify-start gap-4">
                <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">{selectedEmployee.name}</h2>
                <span className={`px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-sm border ${selectedEmployee.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-400 dark:border-emerald-800' : 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800/40 dark:text-gray-400 dark:border-gray-700'
                  }`}>{selectedEmployee.status}</span>
              </div>
              <p className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">{selectedEmployee.role}</p>
            </div>

            <div className="absolute right-0 top-0 w-64 h-64 opacity-5 pointer-events-none text-indigo-900 rotate-12 -translate-y-8 translate-x-12">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" />
              </svg>
            </div>
          </div>

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
                  <Shield size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Trust Score</p>
                  <p className="text-2xl font-black text-gray-900 dark:text-white">99%</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col justify-center space-y-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <User size={14} className="text-indigo-500" />
              Basic Information
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-gray-600 dark:text-gray-300 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <Mail size={18} className="text-indigo-400 shrink-0" />
                <span className="font-bold text-sm truncate">{selectedEmployee.name.toLowerCase().replace(' ', '.')}@example.com</span>
              </div>
              <div className="flex items-center gap-4 text-gray-600 dark:text-gray-300 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <Phone size={18} className="text-indigo-400 shrink-0" />
                <span className="font-bold text-sm">+1 (555) 987-6543</span>
              </div>
              <div className="flex items-center gap-4 text-gray-600 dark:text-gray-300 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <MapPin size={18} className="text-indigo-400 shrink-0" />
                <span className="font-bold text-sm">Zone B Route, City Map</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }

  if (selectedManager) {
    const manager = {
      ...selectedManager,
      email: `${selectedManager.name.toLowerCase().replace(' ', '.')}@example.com`,
      phone: '+1 (555) 123-4567',
      location: 'New York, NY',
      joinDate: '15 Mar 2023',
    };

    return (
      <div className="space-y-6 animate-in fade-in duration-500 overflow-x-hidden">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => setSelectedManager(null)} className="p-2 border border-gray-100 dark:border-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <ArrowLeft size={20} className="text-gray-600 dark:text-gray-400" />
            </Button>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white">Manager Profile</h1>
          </div>
          <Button variant="ghost" onClick={() => handleDeleteManager(selectedManager.id)} className="p-2 border border-rose-100 text-rose-500 rounded-xl hover:bg-rose-50 dark:border-rose-900/40 dark:hover:bg-rose-900/20 transition-colors flex items-center">
            <X size={20} />
            <span className="ml-2 font-bold text-sm">Delete Manager</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
          <div className="absolute -top-10 -right-10 w-64 h-64 bg-indigo-50 dark:bg-indigo-900/20 rounded-full blur-3xl opacity-50 pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-emerald-50 dark:bg-emerald-900/20 rounded-full blur-3xl opacity-50 pointer-events-none" />

          {/* Profile Card */}
          <div className="relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-[2rem] p-8 border border-gray-100 dark:border-gray-800 flex flex-col items-center text-center shadow-xl shadow-gray-200/20 dark:shadow-none justify-center overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
            <div className="absolute right-0 top-0 w-32 h-32 opacity-5 pointer-events-none text-indigo-900 rotate-12 -translate-y-4 translate-x-4">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" /></svg>
            </div>

            <div className="w-28 h-28 rounded-[2rem] bg-indigo-50 dark:bg-indigo-900/40 p-1 mb-5 group-hover:scale-110 transition-transform duration-500 shrink-0">
              <img src={manager.avatar} alt={manager.name} className="w-full h-full rounded-[1.8rem] border-4 border-white dark:border-gray-800 shadow-md object-cover" />
            </div>

            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-1 tracking-tight">{manager.name}</h2>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-5">{manager.designation}</p>
            <span className={`inline-flex items-center px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-sm border ${manager.status === 'On Duty' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-400 dark:border-emerald-800' :
              manager.status === 'Off Duty' ? 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800/40 dark:text-gray-400 dark:border-gray-700' :
                'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/40 dark:text-orange-400 dark:border-orange-800'
              }`}>
              {manager.status}
            </span>
          </div>

          {/* Contact Info Card */}
          <div className="relative bg-white dark:bg-gray-900 rounded-[2rem] p-8 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col justify-center space-y-6 hover:shadow-lg transition-shadow overflow-hidden group">
            <div className="absolute right-0 bottom-0 w-32 h-32 opacity-5 pointer-events-none text-emerald-900 rotate-12 translate-y-4 translate-x-4">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" /></svg>
            </div>

            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <Mail size={14} className="text-emerald-500" />
              Contact Information
            </h3>
            <div className="space-y-4 relative z-10">
              <div className="flex items-center gap-4 text-gray-600 dark:text-gray-300 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-500 shrink-0 group-hover:rotate-12 transition-transform">
                  <Mail size={18} />
                </div>
                <span className="font-bold text-sm truncate">{manager.email}</span>
              </div>
              <div className="flex items-center gap-4 text-gray-600 dark:text-gray-300 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-500 shrink-0 group-hover:-rotate-12 transition-transform">
                  <Phone size={18} />
                </div>
                <span className="font-bold text-sm">{manager.phone}</span>
              </div>
              <div className="flex items-center gap-4 text-gray-600 dark:text-gray-300 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-500 shrink-0 group-hover:rotate-12 transition-transform">
                  <MapPin size={18} />
                </div>
                <span className="font-bold text-sm">{manager.location}</span>
              </div>
            </div>
          </div>

          {/* Work Overview Card */}
          <div className="relative bg-white dark:bg-gray-900 rounded-[2rem] p-8 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col justify-center space-y-6 hover:shadow-lg transition-shadow overflow-hidden group">
            <div className="absolute right-0 top-0 w-32 h-32 opacity-5 pointer-events-none text-purple-900 -rotate-12 -translate-y-4 translate-x-4">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><path d="M19 3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19ZM17 12H9V10H17V12ZM13 16H9V14H13V16ZM17 8H9V6H17V8Z" /></svg>
            </div>

            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <Briefcase size={14} className="text-purple-500" />
              Work Overview
            </h3>
            <div className="space-y-4 relative z-10">
              <div className="flex items-center gap-4 text-gray-600 dark:text-gray-300 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-500 shrink-0 group-hover:-rotate-12 transition-transform">
                  <Users size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Zone</p>
                  <p className="text-sm font-black text-gray-900 dark:text-white">{manager.zone}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-gray-600 dark:text-gray-300 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-500 shrink-0 group-hover:rotate-12 transition-transform">
                  <Activity size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Op Status</p>
                  <p className="text-sm font-black text-gray-900 dark:text-white">{manager.status}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-gray-600 dark:text-gray-300 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-500 shrink-0 group-hover:-rotate-12 transition-transform">
                  <Calendar size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Joined</p>
                  <p className="text-sm font-black text-gray-900 dark:text-white">{manager.joinDate}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Team Members</h3>
          <div className="overflow-hidden rounded-xl border border-gray-100 dark:border-gray-800">
            <DataTable
              columns={[
                { header: 'Employee', accessor: 'name', render: (r) => <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs border border-indigo-100 dark:border-indigo-800/50">{r.name.charAt(0)}</div><span className="font-bold text-sm text-gray-900 dark:text-white">{r.name}</span></div> },
                { header: 'Role', accessor: 'role', render: (r) => <span className="text-xs font-medium text-gray-500">{r.role}</span> },
                { header: 'Status', accessor: 'status', render: (r) => <span className={`inline-flex items-center px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${r.status === 'Active' ? 'bg-emerald-50/80 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' : 'bg-gray-50/80 text-gray-700 dark:bg-gray-800/50 dark:text-gray-400'}`}>{r.status}</span> },
                {
                  header: 'Last Activity',
                  accessor: 'lastActivity',
                  render: (r) => {
                    const relTime = getRelativeTime(r.lastActivity);
                    const isRecent = (new Date() - new Date(r.lastActivity)) < 30 * 60 * 1000;
                    return (
                      <div className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${isRecent ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500' : 'bg-gray-50 dark:bg-gray-800 text-gray-400'}`}>
                          <Clock size={14} />
                        </div>
                        <div className="flex items-center gap-1.5">
                          {isRecent && <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span></span>}
                          <span className={`text-xs font-bold ${isRecent ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-500 dark:text-gray-400'}`}>{relTime}</span>
                        </div>
                      </div>
                    );
                  }
                }
              ]}
              onRowClick={(row) => setSelectedEmployee(row)}
              data={teamMembers}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 relative overflow-x-hidden">
      {/* Decorative Background SVG */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-50/50 dark:bg-indigo-900/10 rounded-full blur-[100px] -mr-64 -mt-64 pointer-events-none" />

      {/* Enhanced Header with SVG illustration */}
      <div className="relative bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 md:p-10 border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 group">

        {/* Background SVG Graphic */}
        <div className="absolute right-0 bottom-0 opacity-5 dark:opacity-10 pointer-events-none translate-x-1/4 translate-y-1/4 group-hover:-translate-y-4 group-hover:-translate-x-4 transition-transform duration-700">
          <svg width="250" height="250" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16 11C17.66 11 18.99 9.66 18.99 8C18.99 6.34 17.66 5 16 5C14.34 5 13 6.34 13 8C13 9.66 14.34 11 16 11ZM8 11C9.66 11 10.99 9.66 10.99 8C10.99 6.34 9.66 5 8 5C6.34 5 5 6.34 5 8C5 9.66 6.34 11 8 11ZM8 13C5.67 13 1 14.17 1 16.5V19H15V16.5C15 14.17 10.33 13 8 13ZM16 13C15.71 13 15.38 13.05 15.03 13.12C16.19 14.04 17 15.19 17 16.5V19H23V16.5C23 14.17 18.33 13 16 13Z" />
          </svg>
        </div>

        <div className="relative z-10 flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800/50 shadow-inner">
            <Users size={32} strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">Manager Directory</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">Manage and monitor your team leadership</p>
          </div>
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
          <Button
            variant="outline"
            className="flex items-center justify-center space-x-2 dark:border-gray-700 dark:text-gray-300 rounded-xl px-5"
            onClick={handleExportCSV}
          >
            <Download size={18} />
            <span>Export</span>
          </Button>
          <Button
            variant="tenant"
            className="flex items-center justify-center space-x-2 shadow-lg shadow-indigo-200 dark:shadow-none rounded-xl px-6"
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
        <DataTable columns={columns} data={filteredEmployees} onRowClick={(row) => setSelectedManager(row)} />
      </div>

      {/* Modal */}
      {isModalOpen && createPortal(
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-500"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] w-full max-w-xl p-10 shadow-2xl border border-white/20 dark:border-gray-800 animate-in zoom-in-95 duration-300 relative z-10 overflow-hidden">
            {/* Decorative background blobs */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 dark:bg-indigo-900/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-50 dark:bg-emerald-900/10 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none" />

            <div className="relative z-10 flex justify-between items-start mb-10">
              <div className="flex gap-5 items-center">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800/50 shadow-inner">
                  <UserPlus size={28} strokeWidth={1.5} />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Add New Manager</h2>
                  <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 mt-1 uppercase tracking-[0.2em]">Register a new team leader</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-3 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-2xl transition-all duration-300 group shadow-sm border border-transparent dark:border-gray-700"
              >
                <X size={20} className="text-gray-500 dark:text-gray-400 group-hover:rotate-90 transition-transform duration-300" />
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
                  <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.25em] ml-1">Zone</label>
                  <input
                    required
                    type="text"
                    value={newManager.zone}
                    onChange={(e) => setNewManager({ ...newManager, zone: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-50/50 dark:bg-gray-800/50 border-2 border-transparent focus:border-emerald-500/20 rounded-2xl text-gray-900 dark:text-white font-bold transition-all outline-none placeholder:text-gray-300"
                    placeholder="e.g. Zone Alpha"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.25em] ml-1">Manager Email</label>
                  <input
                    required
                    type="email"
                    value={newManager.email}
                    onChange={(e) => setNewManager({ ...newManager, email: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-50/50 dark:bg-gray-800/50 border-2 border-transparent focus:border-emerald-500/20 rounded-2xl text-gray-900 dark:text-white font-bold transition-all outline-none placeholder:text-gray-300"
                    placeholder="e.g. john@example.com"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.25em] ml-1">Password</label>
                  <input
                    required
                    type="password"
                    value={newManager.password}
                    onChange={(e) => setNewManager({ ...newManager, password: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-50/50 dark:bg-gray-800/50 border-2 border-transparent focus:border-emerald-500/20 rounded-2xl text-gray-900 dark:text-white font-bold transition-all outline-none placeholder:text-gray-300"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.25em] ml-1">Manager Status</label>
                  <div className="relative group">
                    <select
                      required
                      value={newManager.status}
                      onChange={(e) => setNewManager({ ...newManager, status: e.target.value })}
                      className="w-full px-6 py-4 bg-gray-50/50 dark:bg-gray-800/50 border-2 border-transparent focus:border-emerald-500/20 rounded-2xl text-gray-900 dark:text-white font-bold transition-all outline-none appearance-none cursor-pointer"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="On Duty">On Duty</option>
                      <option value="Off Duty">Off Duty</option>
                      <option value="On Leave">On Leave</option>
                    </select>
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                      <Activity size={18} />
                    </div>
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

      {/* Edit Modal */}
      {isEditModalOpen && createPortal(
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-500"
            onClick={() => setIsEditModalOpen(false)}
          />
          <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] w-full max-w-xl p-10 shadow-2xl border border-white/20 dark:border-gray-800 animate-in zoom-in-95 duration-300 relative z-10 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 dark:bg-indigo-900/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-50 dark:bg-emerald-900/10 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none" />

            <div className="relative z-10 flex justify-between items-start mb-10">
              <div className="flex gap-5 items-center">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800/50 shadow-inner">
                  <Edit size={28} strokeWidth={1.5} />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Edit Manager</h2>
                  <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 mt-1 uppercase tracking-[0.2em]">Update manager details</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-3 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-2xl transition-all duration-300 group shadow-sm border border-transparent dark:border-gray-700"
              >
                <X size={20} className="text-gray-500 dark:text-gray-400 group-hover:rotate-90 transition-transform duration-300" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.25em] ml-1">Manager Name</label>
                  <input
                    required
                    type="text"
                    value={editingManager?.name || ''}
                    onChange={(e) => setEditingManager({ ...editingManager, name: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-50/50 dark:bg-gray-800/50 border-2 border-transparent focus:border-indigo-500/20 rounded-2xl text-gray-900 dark:text-white font-bold transition-all outline-none"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.25em] ml-1">Zone</label>
                  <input
                    required
                    type="text"
                    value={editingManager?.zone || ''}
                    onChange={(e) => setEditingManager({ ...editingManager, zone: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-50/50 dark:bg-gray-800/50 border-2 border-transparent focus:border-indigo-500/20 rounded-2xl text-gray-900 dark:text-white font-bold transition-all outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.25em] ml-1">Designated Role</label>
                  <div className="relative group">
                    <select
                      required
                      value={editingManager?.designation || 'Operations Manager'}
                      onChange={(e) => setEditingManager({ ...editingManager, designation: e.target.value })}
                      className="w-full px-6 py-4 bg-gray-50/50 dark:bg-gray-800/50 border-2 border-transparent focus:border-indigo-500/20 rounded-2xl text-gray-900 dark:text-white font-bold transition-all outline-none appearance-none cursor-pointer"
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
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.25em] ml-1">Manager Status</label>
                  <div className="relative group">
                    <select
                      required
                      value={editingManager?.status || 'Active'}
                      onChange={(e) => setEditingManager({ ...editingManager, status: e.target.value })}
                      className="w-full px-6 py-4 bg-gray-50/50 dark:bg-gray-800/50 border-2 border-transparent focus:border-indigo-500/20 rounded-2xl text-gray-900 dark:text-white font-bold transition-all outline-none appearance-none cursor-pointer"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="On Duty">On Duty</option>
                      <option value="Off Duty">Off Duty</option>
                      <option value="On Leave">On Leave</option>
                    </select>
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                      <Activity size={18} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex space-x-4 pt-6">
                <button
                  type="button"
                  className="flex-1 py-5 rounded-2xl text-xs font-black uppercase tracking-[0.2em] border border-gray-100 dark:border-gray-800 text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all active:scale-95"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Discard
                </button>
                <button
                  type="submit"
                  className="flex-1 py-5 rounded-2xl text-xs font-black uppercase tracking-[0.2em] bg-[#4f46e5] text-white shadow-xl shadow-indigo-100 dark:shadow-none transition-all hover:bg-[#4338ca] hover:scale-[1.02] active:scale-95"
                >
                  Update Manager
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
