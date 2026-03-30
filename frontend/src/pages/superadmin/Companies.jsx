import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from '../../components/ui/DataTable';
import Skeleton from '../../components/ui/Skeleton';
import Button from '../../components/ui/Button';
import superadminService from '../../services/superadmin/superadminService';
import { useAuth } from '../../context/AuthContext';
import {
  Plus,
  Search,
  Filter,
  Building2,
  Globe,
  ShieldCheck,
  PieChart,
  MoreVertical,
  X,
  Mail,
  Smartphone,
  CheckCircle2,
  RotateCcw,
  Users,
  ArrowRight,
  Edit,
  Trash2,
  UserPlus,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

const CompaniesList = () => {
  const navigate = useNavigate();
  const { login: globalLogin } = useAuth();
  const [impersonating, setImpersonating] = useState(null); // tenantId being impersonated
  const [companies, setCompanies] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [backendStats, setBackendStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isProvisioning, setIsProvisioning] = useState(false);
  const [success, setSuccess] = useState(false);
  const [editingTenant, setEditingTenant] = useState(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [industryFilter, setIndustryFilter] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [planFilter, setPlanFilter] = useState('');
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [activeMenuId, setActiveMenuId] = useState(null);

  // Global Scope State
  const [globalActiveTab, setGlobalActiveTab] = useState('organizations');
  const [globalUsers, setGlobalUsers] = useState([]);
  const [loadingGlobalUsers, setLoadingGlobalUsers] = useState(false);
  const [globalCurrentPage, setGlobalCurrentPage] = useState(1);
  const globalPageSize = 10;

  // Tenant Users Management State (Modal & Global)
  const [activeModalTab, setActiveModalTab] = useState('overview');
  const [tenantUsers, setTenantUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [provisionEntity, setProvisionEntity] = useState('organization'); // 'organization', 'manager', 'employee'
  const [userFormData, setUserFormData] = useState({ name: '', email: '', password: '', role: 'employee', tenantId: '' });

  // Modal Pagination State
  const [modalCurrentPage, setModalCurrentPage] = useState(1);
  const modalPageSize = 5;

  const [formData, setFormData] = useState({
    name: '',
    domain: '',
    adminEmail: '',
    password: '',
    plan: 'Premium',
    planId: '',
    industry: '',
    initialManagers: [], // [{ name, email, password }]
    initialEmployees: [] // [{ name, email, password }]
  });

  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    if (globalActiveTab !== 'organizations') {
      fetchGlobalUsers(globalActiveTab);
    }
    setGlobalCurrentPage(1);
  }, [globalActiveTab]);

  useEffect(() => {
    setGlobalCurrentPage(1);
  }, [searchQuery, industryFilter, statusFilter, planFilter]);

  useEffect(() => {
    setModalCurrentPage(1);
  }, [activeModalTab, selectedTenant]);

  const fetchGlobalUsers = async (role) => {
    setLoadingGlobalUsers(true);
    try {
      // Map globalActiveTab to backend role
      const dbRole = role === 'tenant admin' ? 'tenant' : role;
      const data = await superadminService.getGlobalUsersByRole(dbRole);
      setGlobalUsers(data);
    } catch (err) {
      console.error('Error fetching global users:', err);
    } finally {
      setLoadingGlobalUsers(false);
    }
  };

  const fetchCompanies = async () => {
    try {
      const [compResponse, subsResponse] = await Promise.all([
        superadminService.getCompanies(),
        superadminService.getSubscriptions()
      ]);
      setCompanies(compResponse.data || []);
      setSubscriptions(subsResponse || []);
      if (compResponse.stats) setBackendStats(compResponse.stats);
    } catch (error) {
      console.error('Error fetching companies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSuspend = async (id) => {
    try {
      await superadminService.toggleCompanySuspension(id);
      fetchCompanies();
    } catch (error) {
      console.error('Error toggling suspension:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this tenant and all its users?')) {
      try {
        await superadminService.deleteCompany(id);
        fetchCompanies();
      } catch (error) {
        console.error('Error deleting tenant:', error);
      }
    }
  };

  const handleImpersonate = async (tenantId, tenantName) => {
    setImpersonating(tenantId);
    
    try {
      const data = await superadminService.impersonateTenant(tenantId);

      // Write tenant credentials, then redirect in the current tab
      const tenantUrl = new URL(window.location.href);
      tenantUrl.pathname = '/tenant/dashboard';
      tenantUrl.search   = '';

      // Encode the impersonation payload in the URL so the tab can bootstrap itself
      const payload = encodeURIComponent(JSON.stringify(data));
      tenantUrl.searchParams.set('impersonate', payload);

      // Navigation in current tab
      window.location.href = tenantUrl.toString();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to impersonate tenant. Make sure the tenant has an admin user.');
    } finally {
      setImpersonating(null);
    }
  };

  const handlePlanChange = async (e) => {
    const newPlan = e.target.value.toLowerCase();

    // Optimistic UI Update locally on the modal
    const planLimits = { basic: 10, premium: 50, enterprise: 1000 };
    const newLimit = planLimits[newPlan] || 50;

    setSelectedTenant({
      ...selectedTenant,
      subscription: {
        ...selectedTenant.subscription,
        plan: newPlan,
        employeeLimit: newLimit
      }
    });

    try {
      await superadminService.updateCompany(selectedTenant._id, { plan: newPlan });
      fetchCompanies(); // Background resync for the main table
    } catch (error) {
      console.error('Error updating plan:', error);
      fetchCompanies(); // Revert on crash
    }
  };

  const fetchTenantUsers = async (tenantId) => {
    setLoadingUsers(true);
    try {
      const users = await superadminService.getTenantUsers(tenantId);
      setTenantUsers(users);
    } catch (err) {
      console.error('Error fetching tenant users:', err);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleSaveUser = async (e) => {
    if (e) e.preventDefault();
    setIsProvisioning(true);
    try {
      const targetTenantId = userFormData.tenantId || selectedTenant?._id;
      if (!targetTenantId) throw new Error('Please select a Target Organization.');

      if (editingUser) {
        await superadminService.updateTenantUser(targetTenantId, editingUser._id, userFormData);
      } else {
        await superadminService.createTenantUser(targetTenantId, userFormData);
      }

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setShowModal(false);
        setEditingUser(null);
        setUserFormData({ name: '', email: '', password: '', role: 'employee', tenantId: '' });
      }, 2000);

      // Update local tenant users if in modal
      if (selectedTenant && activeModalTab !== 'overview') fetchTenantUsers(selectedTenant._id);
      // Update global users if on a global user tab
      if (globalActiveTab !== 'organizations') fetchGlobalUsers(globalActiveTab);

      fetchCompanies(); // Sync counters globally
    } catch (error) {
      alert(error.response?.data?.message || 'Error saving user');
    }
  };

  const handleDeleteUser = async (userId, targetTenantId = null) => {
    const tenantId = targetTenantId || selectedTenant?._id;
    if (!tenantId) return alert('Cannot delete user: Missing tenant mapping.');

    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await superadminService.deleteTenantUser(tenantId, userId);
        if (selectedTenant && activeModalTab !== 'overview') fetchTenantUsers(tenantId);
        if (globalActiveTab !== 'organizations') fetchGlobalUsers(globalActiveTab);
        fetchCompanies();
      } catch (error) {
        alert(error.response?.data?.message || 'Error deleting user');
      }
    }
  };

  // Derive unique industries from data
  const industries = useMemo(() => {
    const set = new Set(companies.map(c => c.industry || 'Technology'));
    return Array.from(set).sort();
  }, [companies]);

  // Filtered companies
  const filteredCompanies = useMemo(() => {
    return companies.filter(company => {
      // Search: name, industry, or tenant ID
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesName = company.name?.toLowerCase().includes(q);
        const matchesIndustry = (company.industry || 'Technology').toLowerCase().includes(q);
        const matchesId = company._id?.toLowerCase().includes(q);
        const matchesDomain = company.domain?.toLowerCase().includes(q);
        if (!matchesName && !matchesIndustry && !matchesId && !matchesDomain) return false;
      }

      // Industry filter
      if (industryFilter) {
        if ((company.industry || 'Technology') !== industryFilter) return false;
      }

      // Status filter
      if (statusFilter) {
        if (company.onboardingStatus !== statusFilter) return false;
      }

      // Plan filter
      if (planFilter) {
        if (company.subscription?.plan !== planFilter) return false;
      }

      return true;
    });
  }, [companies, searchQuery, industryFilter, statusFilter, planFilter]);

  const activeFilterCount = [industryFilter, statusFilter, planFilter].filter(Boolean).length;

  const filteredGlobalUsers = useMemo(() => {
    return globalUsers.filter(user => {
      // Search: name, email, or tenant name
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesName = user.name?.toLowerCase().includes(q);
        const matchesEmail = user.email?.toLowerCase().includes(q);
        const matchesTenant = user.tenant?.name?.toLowerCase().includes(q);
        if (!matchesName && !matchesEmail && !matchesTenant) return false;
      }

      // Industry filter (from Tenant)
      if (industryFilter) {
        if ((user.tenant?.industry || 'Technology') !== industryFilter) return false;
      }

      // Status filter (User status OR Tenant status)
      if (statusFilter) {
        const q = statusFilter.toLowerCase();
        const userStatus = (user.status || 'Active').toLowerCase();
        const tenantStatus = (user.tenant?.onboardingStatus || 'active').toLowerCase();

        if (q === 'active') {
          if (userStatus !== 'active') return false;
        } else {
          // 'pending' or 'suspended' checks the tenant's global state
          if (tenantStatus !== q) return false;
        }
      }

      // Plan filter (from Tenant)
      if (planFilter) {
        if (user.tenant?.subscription?.plan !== planFilter) return false;
      }

      return true;
    });
  }, [globalUsers, searchQuery, industryFilter, statusFilter, planFilter]);

  const paginatedCompanies = useMemo(() => {
    const start = (globalCurrentPage - 1) * globalPageSize;
    return filteredCompanies.slice(start, start + globalPageSize);
  }, [filteredCompanies, globalCurrentPage]);

  const paginatedGlobalUsers = useMemo(() => {
    const start = (globalCurrentPage - 1) * globalPageSize;
    return filteredGlobalUsers.slice(start, start + globalPageSize);
  }, [filteredGlobalUsers, globalCurrentPage]);

  const userColumns = [
    {
      header: 'User & Email',
      accessor: 'name',
      render: (row) => (
        <div>
          <p className="font-bold text-gray-900 dark:text-white text-sm">{row.name}</p>
          <p className="text-xs text-gray-500 mt-0.5">{row.email}</p>
        </div>
      )
    },
    {
      header: 'Organization',
      accessor: 'tenant',
      render: (row) => (
        <span className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border border-blue-100 dark:border-blue-800">
          {row.tenant?.name || 'Unassigned'}
        </span>
      )
    },
    {
      header: 'Role',
      accessor: 'role',
      render: (row) => (
        <span className="bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider">
          {row.role}
        </span>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${row.status === 'Active' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}`}>
          {row.status || 'Active'}
        </span>
      )
    },
    {
      header: 'Actions',
      accessor: 'actions',
      render: (row) => (
        <div className="flex items-center justify-end space-x-1">
          <button onClick={(e) => { e.stopPropagation(); setEditingUser(row); setUserFormData({ name: row.name, email: row.email, password: '', role: row.role, tenantId: row.tenant?._id }); setProvisionEntity(row.role); setShowModal(true); }} className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-400 hover:text-blue-500 rounded-xl transition-colors"><Edit size={16} /></button>
          <button onClick={(e) => { e.stopPropagation(); handleDeleteUser(row._id, row.tenant?._id); }} className="p-2 hover:bg-rose-50 dark:hover:bg-rose-900/20 text-gray-400 hover:text-rose-500 rounded-xl transition-colors"><Trash2 size={16} /></button>
        </div>
      )
    }
  ];

  const clearAllFilters = () => {
    setSearchQuery('');
    setIndustryFilter('');
    setStatusFilter('');
    setPlanFilter('');
  };

  const stats = [
    { label: 'Total Organizations', value: backendStats?.totalOrganizations?.toString() || '0', icon: Building2, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Active Organizations', value: backendStats?.activeOrganizations?.toString() || '0', icon: ShieldCheck, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Global Workforce Nodes', value: backendStats?.globalWorkforceNodes?.toString() || '0', icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Avg System Utilization', value: `${backendStats?.avgUtilization || '0.0'}%`, icon: PieChart, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  const handleProvision = async (e) => {
    e.preventDefault();
    setIsProvisioning(true);
    try {
      if (editingTenant) {
        // Re-calculate employee limit if plan changed manually (fallback for old system)
        const selectedSub = subscriptions.find(s => s._id === formData.subscription?.planId);

        await superadminService.updateCompany(editingTenant._id, {
          ...formData,
          planId: formData.subscription?.planId
        });
      } else {
        await superadminService.provisionTenant(formData);
      }
      setSuccess(true);
      fetchCompanies();
      setTimeout(() => {
        setSuccess(false);
        setShowModal(false);
        setEditingTenant(null);
        setFormData({ name: '', domain: '', adminEmail: '', password: '', plan: 'Premium', planId: '', industry: '', initialManagers: [], initialEmployees: [] });
      }, 2000);
    } catch (error) {
      alert('Error provisioning tenant: ' + error.message);
    } finally {
      setIsProvisioning(false);
    }
  };

  const columns = [
    {
      header: 'Organization',
      accessor: 'name',
      render: (row) => (
        <div className="flex items-center space-x-4">
          <img src={row.settings?.logo || `https://ui-avatars.com/api/?name=${row.name}&background=random`} alt={row.name} className="w-12 h-12 rounded-2xl object-cover border border-gray-100 dark:border-gray-800 shadow-sm" />
          <div>
            <p className="font-bold text-gray-900 dark:text-gray-100 leading-none">{row.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 flex items-center">
              <span className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-[10px] font-bold uppercase mr-2">{row.industry || 'Technology'}</span>
              ID: #TEN-{row._id.slice(-6).toUpperCase()}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: 'Plan',
      accessor: 'subscription',
      render: (row) => (
        <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider ${row.subscription?.plan === 'enterprise' ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400' :
          row.subscription?.plan === 'premium' ? 'bg-indigo-100 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400' :
            'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
          }`}>
          {row.subscription?.planId?.name || row.subscription?.plan || 'basic'}
        </span>
      ),
    },
    {
      header: 'Scale',
      accessor: 'userCount',
      render: (row) => {
        const total = row.userCount || 0;
        const limit = row.subscription?.employeeLimit || 50;
        const percent = Math.min((total / limit) * 100, 100);
        const isWarning = percent > 90;

        return (
          <div className="flex flex-col w-32">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-black text-gray-900 dark:text-white leading-none tracking-tight">
                {total} <span className="text-[10px] text-gray-400 font-bold">/ {limit}</span>
              </span>
              <span className={`text-[9px] font-black ${isWarning ? 'text-rose-500' : 'text-blue-500'}`}>{percent.toFixed(0)}%</span>
            </div>
            <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${isWarning ? 'bg-rose-500' : 'bg-blue-500'}`}
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        );
      }
    },
    {
      header: 'Status',
      accessor: 'onboardingStatus',
      render: (row) => (
        <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider ${row.onboardingStatus === 'active' ? 'bg-emerald-100 text-emerald-700' :
          row.onboardingStatus === 'pending' ? 'bg-amber-100 text-amber-700' :
            row.onboardingStatus === 'suspended' ? 'bg-rose-100 text-rose-700' :
              'bg-gray-100 text-gray-700'
          }`}>
          {row.onboardingStatus}
        </span>
      ),
    },
    {
      header: 'Actions',
      accessor: 'id',
      render: (row) => {
        const isLoading = impersonating === row._id;
        return (
          <div className="flex items-center space-x-1">
            {/* Login As Tenant button */}
            <button
              onClick={(e) => { e.stopPropagation(); handleImpersonate(row._id, row.name); }}
              disabled={isLoading}
              className="relative p-2 hover:bg-violet-50 dark:hover:bg-violet-900/20 rounded-xl text-gray-400 hover:text-violet-600 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-wait group"
              title={`Login as ${row.name} Admin`}
            >
              {isLoading ? (
                <svg className="animate-spin" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
              ) : (
                <ExternalLink size={16} />
              )}
              {/* Tooltip */}
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                Login As
              </span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setEditingTenant(row);
                setFormData({
                  name: row.name,
                  domain: row.domain || '',
                  adminEmail: row.adminEmail || '',
                  password: '',
                  plan: row.subscription?.planId?.name || row.subscription?.plan || 'Premium',
                  planId: row.subscription?.planId?._id || row.subscription?.planId || '',
                  industry: row.industry || '',
                  initialManagers: [],
                  initialEmployees: []
                });
                setShowModal(true);
              }}
              className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl text-gray-400 hover:text-blue-600 transition-all flex items-center justify-center"
              title="Edit Details"
            >
              <RotateCcw size={16} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleSuspend(row._id); }}
              className={`p-2 rounded-xl transition-all flex items-center justify-center text-gray-400 ${row.onboardingStatus === 'suspended'
                ? 'hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600'
                : 'hover:bg-amber-50 dark:hover:bg-amber-900/20 hover:text-amber-600'
                }`}
              title={row.onboardingStatus === 'suspended' ? 'Unsuspend Tenant' : 'Suspend Tenant'}
            >
              {row.onboardingStatus === 'suspended' ? <CheckCircle2 size={16} /> : <ShieldCheck size={16} />}
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleDelete(row._id); }}
              className="p-2 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl text-gray-400 hover:text-rose-600 transition-all flex items-center justify-center"
              title="Delete Record"
            >
              <X size={16} />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-9 w-64 uppercase tracking-tight" />
            <Skeleton className="h-4 w-[28rem] font-medium" />
          </div>
        ) : (
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">{globalActiveTab === 'organizations' ? 'Organization Registry' : 'Global User Registry'}</h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">Global oversight of multi-tenant infrastructure and licenses</p>
          </div>
        )}
        {loading ? (
          <Skeleton className="h-12 w-32 rounded-2xl" />
        ) : (
          <Button
            onClick={() => {
              if (globalActiveTab === 'organizations') {
                setEditingTenant(null);
                setProvisionEntity('organization');
                setFormData({ name: '', domain: '', adminEmail: '', password: '', plan: 'Premium', planId: '', industry: '', initialManagers: [], initialEmployees: [] });
                setShowModal(true);
              } else {
                setEditingUser(null);
                const entityType = globalActiveTab === 'tenant admin' ? 'tenant' : globalActiveTab;
                setProvisionEntity(entityType);
                setUserFormData({ name: '', email: '', password: '', role: entityType, tenantId: '' });
                setShowModal(true);
              }
            }}
            variant="primary"
            className="flex items-center space-x-2 shadow-xl shadow-indigo-100 dark:shadow-none rounded-2xl py-3 px-6"
          >
            <Plus size={18} />
            <span className="font-bold capitalize max-w-[150px] truncate">Add</span>
          </Button>
        )}
      </div>

      {/* Provisioning Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 overflow-hidden">
          <div
            className="fixed inset-0 bg-gray-950/60 backdrop-blur-xl animate-in fade-in duration-300"
            onClick={() => {
              if (!isProvisioning && !success) {
                setShowModal(false);
                setEditingTenant(null);
                setFormData({ name: '', domain: '', adminEmail: '', password: '', plan: 'Premium', industry: '', initialManagers: [], initialEmployees: [] });
              }
            }}
          ></div>
          <div className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-[3rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-300 border border-gray-100 dark:border-gray-800">
            {success ? (
              <div className="p-12 text-center space-y-4">
                <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                  <CheckCircle2 size={40} strokeWidth={3} />
                </div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white">Tenant Provisioned!</h3>
                <p className="text-gray-500 font-medium italic">Welcome to the platform. Infrastructure is ready.</p>
              </div>
            ) : (
              <form onSubmit={provisionEntity === 'organization' ? handleProvision : handleSaveUser}>
                <div className="p-8 border-b border-gray-50 dark:border-gray-800 space-y-6 bg-gray-50/50 dark:bg-gray-800/20">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-black text-gray-900 dark:text-white">
                        {editingTenant || editingUser ? 'Update' : 'Provision'} {provisionEntity === 'organization' ? 'Organization' : provisionEntity}
                      </h3>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">
                        {provisionEntity === 'organization' ? 'Infrastructure Workflow' : 'Direct Entity Provisioning'}
                      </p>
                    </div>
                    <button type="button" onClick={() => { setShowModal(false); setEditingTenant(null); setEditingUser(null); }} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl text-gray-400 transition-colors">
                      <X size={20} />
                    </button>
                  </div>

                  {/* Role Selector Dashboard */}
                  {!editingTenant && !editingUser && (
                    <div className="flex bg-white dark:bg-gray-900 p-1.5 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-inner">
                      {[
                        { id: 'organization', label: 'Organization', icon: Building2 },
                        { id: 'manager', label: 'Manager', icon: ShieldCheck },
                        { id: 'employee', label: 'Employee', icon: Users }
                      ].map((role) => (
                        <button
                          key={role.id}
                          type="button"
                          onClick={() => {
                            setProvisionEntity(role.id);
                            if (role.id !== 'organization') {
                              setUserFormData(prev => ({ ...prev, role: role.id }));
                            }
                          }}
                          className={`flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-xl transition-all duration-300 ${provisionEntity === role.id
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none'
                            : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
                            }`}
                        >
                          <role.icon size={14} />
                          <span className="text-[10px] font-black uppercase tracking-wider">{role.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto bg-white dark:bg-gray-900">
                  {provisionEntity === 'organization' ? (
                    <div className="space-y-6 transform transition-all animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Company Name</label>
                        <div className="relative">
                          <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                          <input
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g. Acme Corp Logistics"
                            className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800/50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500/10 outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Primary Domain</label>
                          <div className="relative">
                            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                            <input
                              required
                              value={formData.domain}
                              onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                              placeholder="acme.com"
                              className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800/50 border-none rounded-2xl text-sm font-bold outline-none"
                            />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Industry</label>
                          <select
                            value={formData.industry}
                            onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                            className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-800/50 border-none rounded-2xl text-sm font-bold outline-none appearance-none cursor-pointer"
                          >
                            <option value="">Select Industry</option>
                            <option value="Technology">Technology</option>
                            <option value="Logistics">Logistics</option>
                            <option value="Supply Chain">Supply Chain</option>
                            <option value="E-commerce">E-commerce</option>
                            <option value="Healthcare">Healthcare</option>
                            <option value="Finance">Finance</option>
                            <option value="Manufacturing">Manufacturing</option>
                            <option value="Retail">Retail</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Admin Email</label>
                          <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                            <input
                              required
                              type="email"
                              value={formData.adminEmail}
                              onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
                              placeholder="admin@acme.com"
                              className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800/50 border-none rounded-2xl text-sm font-bold outline-none"
                            />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Admin Password</label>
                          <div className="relative">
                            <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                            <input
                              required={!editingTenant}
                              type="password"
                              value={formData.password}
                              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                              placeholder={editingTenant ? "Leave empty to keep current" : "Min 6 characters"}
                              minLength={editingTenant ? 0 : 6}
                              className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800/50 border-none rounded-2xl text-sm font-bold outline-none"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Subscription Plan</label>
                        <div className="grid grid-cols-3 gap-2">
                          {subscriptions.map(sub => (
                            <button
                              key={sub._id}
                              type="button"
                              onClick={() => setFormData({ ...formData, plan: sub.name, planId: sub._id })}
                              className={`py-3 px-2 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${formData.planId === sub._id || (formData.plan === sub.name && !formData.planId) ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 text-gray-400'
                                }`}
                            >
                              {sub.name}
                              <span className="block text-[9px] font-bold mt-0.5 opacity-60">
                                {sub.employeeLimit?.toLocaleString()} users
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Initial Staffing Sections */}
                      {!editingTenant && (
                        <div className="space-y-8 pt-6 border-t border-gray-100 dark:border-gray-800">
                          <div>
                            <div className="flex justify-between items-center mb-4">
                              <div>
                                <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest">Initial Management</h4>
                                <p className="text-[10px] text-gray-400 font-bold mt-0.5">Managers who will oversee operations</p>
                              </div>
                              <button
                                type="button"
                                onClick={() => setFormData({ ...formData, initialManagers: [...formData.initialManagers, { name: '', email: '', password: '' }] })}
                                className="p-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-colors"
                              >
                                <Plus size={16} />
                              </button>
                            </div>
                            <div className="space-y-3">
                              {formData.initialManagers?.map((mgr, idx) => (
                                <div key={idx} className="bg-gray-50/50 dark:bg-gray-800/40 p-4 rounded-2xl relative border border-gray-100 dark:border-gray-700/50 animate-in slide-in-from-right-4 duration-200">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newMgrs = [...formData.initialManagers];
                                      newMgrs.splice(idx, 1);
                                      setFormData({ ...formData, initialManagers: newMgrs });
                                    }}
                                    className="absolute top-2 right-2 p-1 text-gray-300 hover:text-rose-500 transition-colors"
                                  >
                                    <X size={14} />
                                  </button>
                                  <div className="space-y-3">
                                    <input required value={mgr.name} onChange={e => {
                                      const newMgrs = [...formData.initialManagers];
                                      newMgrs[idx].name = e.target.value;
                                      setFormData({ ...formData, initialManagers: newMgrs });
                                    }} placeholder="Manager Name" className="w-full bg-white dark:bg-gray-900 border-none rounded-xl px-4 py-3 text-xs font-bold outline-none shadow-sm" />
                                    <div className="grid grid-cols-2 gap-3">
                                      <input required type="email" value={mgr.email} onChange={e => {
                                        const newMgrs = [...formData.initialManagers];
                                        newMgrs[idx].email = e.target.value;
                                        setFormData({ ...formData, initialManagers: newMgrs });
                                      }} placeholder="Email" className="w-full bg-white dark:bg-gray-900 border-none rounded-xl px-4 py-3 text-xs font-bold outline-none shadow-sm" />
                                      <input required type="password" value={mgr.password} onChange={e => {
                                        const newMgrs = [...formData.initialManagers];
                                        newMgrs[idx].password = e.target.value;
                                        setFormData({ ...formData, initialManagers: newMgrs });
                                      }} placeholder="Password" className="w-full bg-white dark:bg-gray-900 border-none rounded-xl px-4 py-3 text-xs font-bold outline-none shadow-sm" />
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="pt-4">
                            <div className="flex justify-between items-center mb-4">
                              <div>
                                <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest">Field Force</h4>
                                <p className="text-[10px] text-gray-400 font-bold mt-0.5">Add initial agents and employees</p>
                              </div>
                              <button
                                type="button"
                                onClick={() => setFormData({ ...formData, initialEmployees: [...formData.initialEmployees, { name: '', email: '', password: '' }] })}
                                className="p-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-colors"
                              >
                                <Plus size={16} />
                              </button>
                            </div>
                            <div className="space-y-3">
                              {formData.initialEmployees?.map((emp, idx) => (
                                <div key={idx} className="bg-gray-50/50 dark:bg-gray-800/40 p-4 rounded-2xl relative border border-gray-100 dark:border-gray-700/50 animate-in slide-in-from-right-4 duration-200">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newEmps = [...formData.initialEmployees];
                                      newEmps.splice(idx, 1);
                                      setFormData({ ...formData, initialEmployees: newEmps });
                                    }}
                                    className="absolute top-2 right-2 p-1 text-gray-300 hover:text-rose-500 transition-colors"
                                  >
                                    <X size={14} />
                                  </button>
                                  <div className="space-y-3">
                                    <input required value={emp.name} onChange={e => {
                                      const newEmps = [...formData.initialEmployees];
                                      newEmps[idx].name = e.target.value;
                                      setFormData({ ...formData, initialEmployees: newEmps });
                                    }} placeholder="Employee Name" className="w-full bg-white dark:bg-gray-900 border-none rounded-xl px-4 py-3 text-xs font-bold outline-none shadow-sm" />
                                    <div className="grid grid-cols-2 gap-3">
                                      <input required type="email" value={emp.email} onChange={e => {
                                        const newEmps = [...formData.initialEmployees];
                                        newEmps[idx].email = e.target.value;
                                        setFormData({ ...formData, initialEmployees: newEmps });
                                      }} placeholder="Email" className="w-full bg-white dark:bg-gray-900 border-none rounded-xl px-4 py-3 text-xs font-bold outline-none shadow-sm" />
                                      <input required type="password" value={emp.password} onChange={e => {
                                        const newEmps = [...formData.initialEmployees];
                                        newEmps[idx].password = e.target.value;
                                        setFormData({ ...formData, initialEmployees: newEmps });
                                      }} placeholder="Password" className="w-full bg-white dark:bg-gray-900 border-none rounded-xl px-4 py-3 text-xs font-bold outline-none shadow-sm" />
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-6 transform transition-all animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                        <div className="relative">
                          <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                          <input
                            required
                            value={userFormData.name}
                            onChange={(e) => setUserFormData({ ...userFormData, name: e.target.value })}
                            placeholder="John Doe"
                            className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800/50 border-none rounded-2xl text-sm font-bold outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Account Email</label>
                          <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                            <input
                              required
                              type="email"
                              value={userFormData.email}
                              onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                              placeholder="john@example.com"
                              className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800/50 border-none rounded-2xl text-sm font-bold outline-none"
                            />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Password</label>
                          <div className="relative">
                            <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                            <input
                              required={!editingUser}
                              type="password"
                              value={userFormData.password}
                              onChange={(e) => setUserFormData({ ...userFormData, password: e.target.value })}
                              placeholder={editingUser ? "Leave empty" : "Min 6 chars"}
                              minLength={6}
                              className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800/50 border-none rounded-2xl text-sm font-bold outline-none"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Target Organization</label>
                        <div className="relative">
                          <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                          <select
                            required
                            disabled={!!editingUser}
                            value={userFormData.tenantId}
                            onChange={(e) => setUserFormData({ ...userFormData, tenantId: e.target.value })}
                            className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800/50 border-none rounded-2xl text-sm font-bold outline-none appearance-none cursor-pointer"
                          >
                            <option value="">Select an Organization</option>
                            {companies.map(c => (
                              <option key={c._id} value={c._id}>{c.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-8 bg-gray-50/50 dark:bg-gray-800/20 flex gap-3 border-t border-gray-50 dark:border-gray-800">
                  <Button type="button" onClick={() => { setShowModal(false); setEditingTenant(null); setEditingUser(null); }} variant="outline" className="flex-1 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest border-gray-200">
                    Cancel
                  </Button>
                  <Button disabled={isProvisioning} variant="primary" className="flex-1 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-indigo-100 dark:shadow-none">
                    {isProvisioning ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Working...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <ArrowRight size={14} />
                        <span>{editingTenant || editingUser ? 'Save Changes' : `Add ${provisionEntity}`}</span>
                      </div>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-gray-900 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 flex items-center space-x-5 shadow-sm">
            {loading ? (
              <>
                <Skeleton variant="rounded" className="w-14 h-14" />
                <div className="space-y-2 flex-grow">
                  <Skeleton className="h-3 w-3/4" />
                  <Skeleton className="h-6 w-1/2" />
                </div>
              </>
            ) : (
              <>
                <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} dark:bg-opacity-10 shadow-sm border border-transparent hover:border-white/20 transition-all`}>
                  <stat.icon size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest leading-none">{stat.label}</p>
                  <p className="text-2xl font-black text-gray-900 dark:text-white mt-1.5">{stat.value}</p>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Table with search & filters */}
      <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-50 dark:border-gray-800 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex flex-col md:flex-row md:items-center gap-6 flex-1">
              {/* Search */}
              <div className="relative w-full md:max-w-md">
                {loading || loadingGlobalUsers ? (
                  <Skeleton className="h-11 w-full rounded-2xl" />
                ) : (
                  <>
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={`Search ${globalActiveTab}...`}
                      className="w-full pl-12 pr-6 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl text-sm font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500/10 outline-none transition-all"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-gray-400 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </>
                )}
              </div>

              {/* Industry Filter / Advanced Filters */}
              <div className="flex items-center space-x-3 shrink-0">
                {loading || loadingGlobalUsers ? (
                  <>
                    <Skeleton className="h-11 w-40 rounded-2xl" />
                    <Skeleton className="h-11 w-32 rounded-2xl" />
                  </>
                ) : (
                  <>
                    {/* Industry Dropdown */}
                    <select
                      value={industryFilter}
                      onChange={(e) => setIndustryFilter(e.target.value)}
                      className="bg-gray-50 dark:bg-gray-800 border-none rounded-2xl text-xs font-bold px-4 py-3 outline-none cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
                    >
                      <option value="">All Industries</option>
                      {industries.map(ind => (
                        <option key={ind} value={ind}>{ind}</option>
                      ))}
                    </select>

                    {/* Advanced Filters Button */}
                    <Button
                      onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                      variant="outline"
                      className={`flex items-center space-x-2 rounded-2xl px-4 py-3 border-gray-200 dark:border-gray-700 transition-all ${showAdvancedFilters ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800 text-indigo-600' : 'text-gray-600 dark:text-gray-300'
                        }`}
                    >
                      <Filter size={18} />
                      <span className="font-bold">Filters</span>
                      {activeFilterCount > 0 && (
                        <span className="ml-1 w-5 h-5 bg-indigo-600 text-white text-[10px] font-black rounded-full flex items-center justify-center">
                          {activeFilterCount}
                        </span>
                      )}
                    </Button>
                  </>
                )}

                {/* Clear All */}
                {(searchQuery || activeFilterCount > 0) && !loading && (
                  <button
                    onClick={clearAllFilters}
                    className="flex items-center space-x-1.5 text-xs font-bold text-rose-500 hover:text-rose-600 transition-colors px-3 py-3"
                  >
                    <RotateCcw size={14} />
                    <span>Reset</span>
                  </button>
                )}
                {loading && (activeFilterCount > 0 || searchQuery) && (
                  <Skeleton className="h-8 w-20 rounded-xl" />
                )}
              </div>
            </div>

            {/* Global View Tabs */}
            <div className="flex bg-gray-50 dark:bg-gray-800 p-1 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-inner">
              {[
                { id: 'organizations', label: 'Organizations', icon: Building2 },
                { id: 'tenant admin', label: 'Managers', icon: ShieldCheck },
                { id: 'employee', label: 'Employees', icon: Users }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setGlobalActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-5 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all duration-300 ${globalActiveTab === tab.id
                    ? 'bg-white dark:bg-gray-900 text-indigo-600 shadow-md transform scale-[1.02]'
                    : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
                    }`}
                >
                  {loading || loadingGlobalUsers ? (
                    <Skeleton className="h-3 w-20" />
                  ) : (
                    <>
                      <tab.icon size={14} />
                      <span>{tab.label}</span>
                    </>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Advanced Filters Panel */}
          {showAdvancedFilters && (
            <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-gray-50 dark:border-gray-800 animate-in slide-in-from-top-2 duration-300">
              <div className="flex items-center gap-3">
                {loading ? (
                  <Skeleton className="h-3 w-16" />
                ) : (
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Filter by:</span>
                )}
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-4">
                {loading ? (
                  <Skeleton className="h-3 w-12" />
                ) : (
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Status</span>
                )}
                <div className="flex items-center gap-2">
                  {['active', 'pending', 'suspended'].map(status => (
                    loading ? (
                      <Skeleton key={status} className="h-8 w-20 rounded-xl" />
                    ) : (
                      <button
                        key={status}
                        onClick={() => setStatusFilter(statusFilter === status ? '' : status)}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-300 ${statusFilter === status
                          ? status === 'active' ? 'bg-emerald-600 text-white shadow-lg'
                            : status === 'pending' ? 'bg-amber-500 text-white shadow-lg'
                              : 'bg-rose-600 text-white shadow-lg'
                          : 'bg-gray-50 dark:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-white'
                          }`}
                      >
                        {status}
                      </button>
                    )
                  ))}
                </div>
              </div>

              {globalActiveTab === 'organizations' && (
                <>
                  <div className="w-px h-6 bg-gray-100 dark:bg-gray-800" />

                  {/* Plan Filter */}
                  <div className="flex items-center gap-4">
                    {loading ? (
                      <Skeleton className="h-3 w-10" />
                    ) : (
                      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Plan</span>
                    )}
                    <div className="flex items-center gap-2">
                      {loading ? (
                        [1, 2, 3].map(i => <Skeleton key={i} className="h-8 w-24 rounded-xl" />)
                      ) : (
                        subscriptions.map(sub => (
                          <button
                            key={sub._id}
                            onClick={() => setPlanFilter(planFilter === sub.name ? '' : sub.name)}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] transition-all duration-300 ${planFilter === sub.name
                              ? 'bg-indigo-600 text-white shadow-lg'
                              : 'bg-gray-50 dark:bg-gray-800 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400'
                              }`}
                          >
                            {sub.name}
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Active filter summary */}
          {loading || loadingGlobalUsers ? (
            <Skeleton className="h-4 w-64" />
          ) : (
            (searchQuery || activeFilterCount > 0) && (
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <span className="font-bold">
                  Showing {globalActiveTab === 'organizations' ? filteredCompanies.length : filteredGlobalUsers.length} of {globalActiveTab === 'organizations' ? companies.length : globalUsers.length} {globalActiveTab === 'organizations' ? 'organizations' : globalActiveTab === 'manager' ? 'managers' : 'employees'}
                </span>
                {searchQuery && (
                  <span className="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-lg text-[10px] font-black">
                    Search: "{searchQuery}"
                  </span>
                )}
                {industryFilter && (
                  <span className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-lg text-[10px] font-black flex items-center space-x-1">
                    <span>Industry: {industryFilter}</span>
                    <button onClick={() => setIndustryFilter('')} className="hover:text-blue-800"><X size={10} /></button>
                  </span>
                )}
                {statusFilter && (
                  <span className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-lg text-[10px] font-black flex items-center space-x-1">
                    <span>Status: {statusFilter}</span>
                    <button onClick={() => setStatusFilter('')} className="hover:text-emerald-800"><X size={10} /></button>
                  </span>
                )}
                {planFilter && (
                  <span className="bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 px-2 py-0.5 rounded-lg text-[10px] font-black flex items-center space-x-1">
                    <span>Plan: {planFilter}</span>
                    <button onClick={() => setPlanFilter('')} className="hover:text-purple-800"><X size={10} /></button>
                  </span>
                )}
              </div>
            )
          )}
        </div>

        <div className="px-4 pb-4 mt-2">
          {globalActiveTab === 'organizations' ? (
            <div className="space-y-4">
              <DataTable columns={columns} data={paginatedCompanies} isLoading={loading} onRowClick={(row) => {
                setSelectedTenant(row);
                setActiveModalTab('overview');
                fetchTenantUsers(row._id);
              }} />

              {/* Global Pagination Controls */}
              {loading ? (
                <div className="flex items-center justify-between px-4 py-3 bg-gray-50/50 dark:bg-gray-800/20 rounded-2xl border border-gray-100 dark:border-gray-800">
                  <Skeleton className="h-4 w-48" />
                  <div className="flex gap-2">
                    <Skeleton className="h-10 w-10 rounded-xl" />
                    <Skeleton className="h-10 w-10 rounded-xl" />
                  </div>
                </div>
              ) : (
                filteredCompanies.length > globalPageSize && (
                  <div className="flex items-center justify-between px-4 py-3 bg-gray-50/50 dark:bg-gray-800/20 rounded-2xl border border-gray-100 dark:border-gray-800">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">
                      Page {globalCurrentPage} of {Math.ceil(filteredCompanies.length / globalPageSize)}
                      <span className="ml-4 text-gray-300 dark:text-gray-600">|</span>
                      <span className="ml-4">{filteredCompanies.length} Total Organizations</span>
                    </p>
                    <div className="flex gap-2">
                      <button
                        disabled={globalCurrentPage === 1}
                        onClick={() => setGlobalCurrentPage(prev => prev - 1)}
                        className="p-2.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 transition-all text-gray-600 dark:text-gray-400 shadow-sm"
                      >
                        <RotateCcw size={14} className="rotate-90" />
                      </button>
                      <button
                        disabled={globalCurrentPage >= Math.ceil(filteredCompanies.length / globalPageSize)}
                        onClick={() => setGlobalCurrentPage(prev => prev + 1)}
                        className="p-2.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 transition-all text-gray-600 dark:text-gray-400 shadow-sm"
                      >
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <DataTable columns={userColumns} data={paginatedGlobalUsers} loading={loadingGlobalUsers} onRowClick={() => { }} />

              {/* Global Pagination Controls for Users */}
              {loadingGlobalUsers ? (
                <div className="flex items-center justify-between px-4 py-3 bg-gray-50/50 dark:bg-gray-800/20 rounded-2xl border border-gray-100 dark:border-gray-800">
                  <Skeleton className="h-4 w-48" />
                  <div className="flex gap-2">
                    <Skeleton className="h-10 w-10 rounded-xl" />
                    <Skeleton className="h-10 w-10 rounded-xl" />
                  </div>
                </div>
              ) : (
                filteredGlobalUsers.length > globalPageSize && (
                  <div className="flex items-center justify-between px-4 py-3 bg-gray-50/50 dark:bg-gray-800/20 rounded-2xl border border-gray-100 dark:border-gray-800">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">
                      Page {globalCurrentPage} of {Math.ceil(filteredGlobalUsers.length / globalPageSize)}
                      <span className="ml-4 text-gray-300 dark:text-gray-600">|</span>
                      <span className="ml-4 text-indigo-600 dark:text-indigo-400 uppercase">{globalActiveTab}s</span>
                    </p>
                    <div className="flex gap-2">
                      <button
                        disabled={globalCurrentPage === 1}
                        onClick={() => setGlobalCurrentPage(prev => prev - 1)}
                        className="p-2.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 transition-all text-gray-600 dark:text-gray-400 shadow-sm"
                      >
                        <RotateCcw size={14} className="rotate-90" />
                      </button>
                      <button
                        disabled={globalCurrentPage >= Math.ceil(filteredGlobalUsers.length / globalPageSize)}
                        onClick={() => setGlobalCurrentPage(prev => prev + 1)}
                        className="p-2.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 transition-all text-gray-600 dark:text-gray-400 shadow-sm"
                      >
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>
      {/* Detailed Tenant Modal */}
      {selectedTenant && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-8 overflow-hidden">
          <div className="fixed inset-0 bg-gray-950/60 backdrop-blur-xl animate-in fade-in duration-300" onClick={() => setSelectedTenant(null)}></div>
          <div className="bg-white dark:bg-gray-900 w-full max-w-6xl rounded-[2.5rem] shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-300 border border-white/10 flex flex-col md:flex-row h-[80vh] max-h-[820px]">

            {/* Left Sidebar Pane */}
            <div className={`md:w-[30%] relative p-8 md:p-10 flex flex-col flex-shrink-0 ${selectedTenant.onboardingStatus === 'suspended'
              ? 'bg-gradient-to-b from-[#4a4a4a] to-[#1f1f1f]'
              : 'bg-gradient-to-b from-[#3a3a3a] to-[#0f0f0f]'
              } text-white`}>
              <div className="absolute inset-0 bg-gray-700 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-8">
                  <div className="w-16 h-16 rounded-[1.2rem] bg-white/10 backdrop-blur-md flex items-center justify-center text-3xl font-black text-white shadow-inner border border-white/20">
                    {selectedTenant.name.charAt(0)}
                  </div>
                  <span className={`px-3 py-1 text-[9px] uppercase font-black rounded-lg backdrop-blur-md border ${selectedTenant.onboardingStatus === 'suspended' ? 'bg-white/10 text-white border-white/20' : 'bg-emerald-400/20 text-emerald-100 border-emerald-400/30'}`}>
                    {selectedTenant.onboardingStatus}
                  </span>
                </div>

                <h2 className="text-3xl font-black mb-1 leading-tight">{selectedTenant.name}</h2>
                <p className="text-white/70 text-sm font-medium mb-10 flex items-center gap-2">
                  <Globe size={14} className="opacity-80" />
                  {selectedTenant.domain || 'No custom domain'}
                </p>

                <div className="space-y-6 mt-auto">
                  <div>
                    <p className="text-[10px] uppercase font-black tracking-widest text-white/50 mb-1 leading-none">Entity ID</p>
                    <p className="text-xs font-bold font-mono opacity-90 truncate">{selectedTenant._id}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-black tracking-widest text-white/50 mb-1 leading-none">Industry Cluster</p>
                    <p className="text-sm font-bold opacity-90">{selectedTenant.industry || 'Technology'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-black tracking-widest text-white/50 mb-1 leading-none">Origin Date</p>
                    <p className="text-sm font-bold opacity-90">{new Date(selectedTenant.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content Pane */}
            <div className="md:w-[70%] flex flex-col bg-gray-50/50 dark:bg-gray-900/50 relative h-full overflow-hidden">
              {/* Fixed Header Content */}
              <div className="bg-gray-50/95 dark:bg-gray-900/95 backdrop-blur-md z-20 px-8 md:px-10 pt-8 border-b border-gray-200 dark:border-gray-800">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex space-x-6">
                    {[
                      { id: 'overview', label: 'Overview' },
                      { id: 'manager', label: 'Managers' },
                      { id: 'employee', label: 'Employees' }
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setActiveModalTab(tab.id);
                          setModalCurrentPage(1);
                        }}
                        className={`pb-4 text-sm font-black transition-colors border-b-2 -mb-[1px] ${activeModalTab === tab.id ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setSelectedTenant(null)}
                    className="p-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-500 shadow-sm transition-all border border-gray-100 dark:border-gray-700"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Scrollable Content Zone */}
              <div className="flex-1 overflow-y-auto p-8 md:p-10 custom-scrollbar">
                <div className="flex flex-col min-h-full">
                  {/* Tab Contents */}
                  <div className="flex-1">
                    {/* Tab: Overview */}
                    {activeModalTab === 'overview' && (
                      <div className="animate-in fade-in duration-300">
                        <h3 className="text-lg font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                          <ShieldCheck className="text-blue-500" size={20} /> License & Capacity Metrics
                        </h3>

                        {/* Dynamic License Utilization */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-[1.5rem] border border-gray-100 dark:border-gray-700 shadow-sm mb-6">
                          <div className="flex justify-between items-end mb-4">
                            <div>
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Active Nodes</p>
                              <h4 className="text-2xl font-black text-gray-900 dark:text-white">
                                {selectedTenant.userCount || 0} <span className="text-sm text-gray-400 font-medium">/ {selectedTenant.subscription?.employeeLimit || 50} licensed</span>
                              </h4>
                            </div>
                            <div className="text-right">
                              <p className="text-xs font-bold text-blue-600 dark:text-blue-400">
                                {((selectedTenant.userCount || 0) / (selectedTenant.subscription?.employeeLimit || 50) * 100).toFixed(1)}% Bound
                              </p>
                            </div>
                          </div>

                          {/* Progress Bar Container */}
                          <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden flex">
                            <div
                              className={`h-full transition-all duration-1000 ${((selectedTenant.userCount || 0) / (selectedTenant.subscription?.employeeLimit || 50) * 100) > 90 ? 'bg-rose-500' : 'bg-blue-500'}`}
                              style={{ width: `${Math.min(((selectedTenant.userCount || 0) / (selectedTenant.subscription?.employeeLimit || 50) * 100), 100)}%` }}
                            />
                          </div>
                        </div>

                        {/* Compact 2x2 Grid */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-white dark:bg-gray-800 p-5 rounded-[1.5rem] border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4 hover:border-gray-200 dark:hover:border-gray-600 transition-colors">
                            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-xl text-blue-600">
                              <Users size={18} />
                            </div>
                            <div>
                              <p className="text-[10px] uppercase font-black tracking-widest text-gray-400 mb-0.5 leading-none">Management</p>
                              <p className="text-sm font-bold text-gray-900 dark:text-white">{selectedTenant.managerCount || 0} Active Staff</p>
                            </div>
                          </div>

                          <div className="bg-white dark:bg-gray-800 p-5 rounded-[1.5rem] border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4 hover:border-gray-200 dark:hover:border-gray-600 transition-colors">
                            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl text-emerald-600">
                              <Globe size={18} />
                            </div>
                            <div>
                              <p className="text-[10px] uppercase font-black tracking-widest text-gray-400 mb-0.5 leading-none">Field Force</p>
                              <p className="text-sm font-bold text-gray-900 dark:text-white">{selectedTenant.employeeCount || 0} Ground Agents</p>
                            </div>
                          </div>

                          <div className="bg-white dark:bg-gray-800 p-5 rounded-[1.5rem] border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4 hover:border-gray-200 dark:hover:border-gray-600 transition-colors">
                            <div className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-xl text-purple-600">
                              <ShieldCheck size={18} />
                            </div>
                            <div className="w-full">
                              <p className="text-[10px] uppercase font-black tracking-widest text-gray-400 mb-0.5 leading-none">Billing Tier</p>
                              <select
                                value={selectedTenant.subscription?.plan || 'premium'}
                                onChange={handlePlanChange}
                                className="w-full bg-transparent text-sm font-bold text-gray-900 dark:text-white capitalize border-none p-0 focus:ring-0 cursor-pointer outline-none appearance-none"
                              >
                                <option className="text-gray-900" value="basic">Basic (10 Nodes)</option>
                                <option className="text-gray-900" value="premium">Premium (50 Nodes)</option>
                                <option className="text-gray-900" value="enterprise">Enterprise (1000 Nodes)</option>
                              </select>
                            </div>
                          </div>

                          <div className="bg-white dark:bg-gray-800 p-5 rounded-[1.5rem] border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4 hover:border-gray-200 dark:hover:border-gray-600 transition-colors">
                            <div className="p-3 bg-rose-50 dark:bg-rose-900/30 rounded-xl text-rose-600">
                              <X size={18} />
                            </div>
                            <div>
                              <p className="text-[10px] uppercase font-black tracking-widest text-gray-400 mb-0.5 leading-none">Renewal Status</p>
                              <p className="text-sm font-bold text-gray-900 dark:text-white">{selectedTenant.subscription?.expiry ? new Date(selectedTenant.subscription.expiry).toLocaleDateString() : 'Auto-renewing'}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Tab: Users (Managers, Employees) */}
                    {activeModalTab !== 'overview' && (
                      <div className="flex-1 flex flex-col animate-in fade-in duration-300">
                        <div className="flex justify-between items-center mb-6">
                          <h3 className="text-lg font-black text-gray-900 dark:text-white capitalize">{activeModalTab === 'tenant' ? 'Tenant Admins' : activeModalTab + 's'}</h3>
                          <button onClick={() => { setEditingUser(null); setUserFormData({ name: '', email: '', password: '', role: activeModalTab, tenantId: selectedTenant._id }); setProvisionEntity(activeModalTab); setShowModal(true); }} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-bold flex items-center space-x-2 text-sm shadow-sm transition-colors">
                            <UserPlus size={16} /> <span className="capitalize">Add {activeModalTab}</span>
                          </button>
                        </div>

                        {loadingUsers ? (
                          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
                            <div className="bg-gray-50 dark:bg-gray-900/50 px-6 py-4 flex gap-4 border-b border-gray-100 dark:border-gray-700">
                              <Skeleton className="h-4 flex-1" />
                              <Skeleton className="h-4 flex-1" />
                              <Skeleton className="h-4 w-20" />
                            </div>
                            <div className="p-6 space-y-6">
                              {[1, 2, 3].map(i => (
                                <div key={i} className="flex gap-4">
                                  <Skeleton className="h-5 flex-1" />
                                  <Skeleton className="h-5 flex-1" />
                                  <Skeleton className="h-5 w-20" />
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col flex-1">
                            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
                              <table className="w-full text-left border-collapse">
                                <thead className="bg-gray-50 dark:bg-gray-900/50">
                                  <tr>
                                    <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest border-b border-gray-100 dark:border-gray-700">Name & Email</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest border-b border-gray-100 dark:border-gray-700">Status</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest border-b border-gray-100 dark:border-gray-700 text-right">Actions</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {(() => {
                                    const filtered = tenantUsers.filter(u => u.role === activeModalTab);
                                    const start = (modalCurrentPage - 1) * modalPageSize;
                                    const paginated = filtered.slice(start, start + modalPageSize);

                                    if (filtered.length === 0) {
                                      return <tr><td colSpan="3" className="px-6 py-10 text-center text-gray-500 font-medium text-sm">No users found for this role.</td></tr>;
                                    }

                                    return paginated.map(user => (
                                      <tr key={user._id} className="border-b border-gray-50 dark:border-gray-800/60 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/80 transition-colors">
                                        <td className="px-6 py-4">
                                          <p className="font-bold text-gray-900 dark:text-white text-sm">{user.name}</p>
                                          <p className="text-xs text-gray-500 mt-0.5">{user.email}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                          <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${user.status === 'Active' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}`}>
                                            {user.status || 'Active'}
                                          </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                          <div className="flex items-center justify-end space-x-1">
                                            <button onClick={() => { setEditingUser(user); setUserFormData({ name: user.name, email: user.email, password: '', role: user.role, tenantId: selectedTenant._id }); setProvisionEntity(user.role); setShowModal(true); }} className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-400 hover:text-blue-500 rounded-xl transition-colors"><Edit size={16} /></button>
                                            <button onClick={() => handleDeleteUser(user._id)} className="p-2 hover:bg-rose-50 dark:hover:bg-rose-900/20 text-gray-400 hover:text-rose-500 rounded-xl transition-colors"><Trash2 size={16} /></button>
                                          </div>
                                        </td>
                                      </tr>
                                    ));
                                  })()}
                                </tbody>
                              </table>
                            </div>

                            {/* Modal Pagination Controls */}
                            {tenantUsers.filter(u => u.role === activeModalTab).length > modalPageSize && (
                              <div className="mt-4 flex items-center justify-between px-2">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                  Page {modalCurrentPage} of {Math.ceil(tenantUsers.filter(u => u.role === activeModalTab).length / modalPageSize)}
                                </p>
                                <div className="flex gap-2">
                                  <button
                                    disabled={modalCurrentPage === 1}
                                    onClick={() => setModalCurrentPage(prev => prev - 1)}
                                    className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                  >
                                    <RotateCcw size={14} className="rotate-90" />
                                  </button>
                                  <button
                                    disabled={modalCurrentPage >= Math.ceil(tenantUsers.filter(u => u.role === activeModalTab).length / modalPageSize)}
                                    onClick={() => setModalCurrentPage(prev => prev + 1)}
                                    className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                  >
                                    <ChevronRight size={14} />
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Functional Footer Actions (Fixed at Bottom) */}
              <div className="p-8 border-t border-gray-200 dark:border-gray-800 bg-gray-50/95 dark:bg-gray-900/95 backdrop-blur-md flex-shrink-0 z-20">
                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      handleSuspend(selectedTenant._id);
                      setSelectedTenant({ ...selectedTenant, onboardingStatus: selectedTenant.onboardingStatus === 'suspended' ? 'active' : 'suspended' });
                    }}
                    className={`px-5 py-3 rounded-xl font-black flex items-center justify-center gap-2 uppercase tracking-widest text-[10px] border-gray-200 dark:border-gray-700 ${selectedTenant.onboardingStatus === 'suspended' ? 'text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20' : 'text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20'}`}
                  >
                    {selectedTenant.onboardingStatus === 'suspended' ? <><CheckCircle2 size={16} /> Restore Operation</> : <><ShieldCheck size={16} /> Halt Operation</>}
                  </Button>

                  <Button
                    variant="primary"
                    onClick={() => {
                      setSelectedTenant(null);
                      navigate('/superadmin/analytics');
                    }}
                    className="px-6 py-3 rounded-xl font-black flex items-center justify-center gap-2 uppercase tracking-widest text-[10px] shadow-lg shadow-blue-200 dark:shadow-none bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Data & Analytics <ArrowRight size={14} />
                  </Button>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Unified Provisioning Wizard is handled above in showModal */}
    </div>
  );
};

export default CompaniesList;
