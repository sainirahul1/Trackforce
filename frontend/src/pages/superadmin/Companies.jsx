import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from '../../components/DataTable';
import Button from '../../components/Button';
import superadminService from '../../services/superadminService';
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
  ArrowRight
} from 'lucide-react';

const CompaniesList = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
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

  const [formData, setFormData] = useState({
    name: '',
    domain: '',
    adminEmail: '',
    password: '',
    plan: 'Premium',
    industry: ''
  });

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await superadminService.getCompanies();
      setCompanies(response.data || []);
      if (response.stats) setBackendStats(response.stats);
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

  const clearAllFilters = () => {
    setSearchQuery('');
    setIndustryFilter('');
    setStatusFilter('');
    setPlanFilter('');
  };

  const stats = backendStats ? [
    { label: 'Total Organizations', value: backendStats.totalOrganizations?.toString() || '0', icon: Building2, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Active Organizations', value: backendStats.activeOrganizations?.toString() || '0', icon: ShieldCheck, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Global Workforce Nodes', value: backendStats.globalWorkforceNodes?.toString() || '0', icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Avg System Utilization', value: `${backendStats.avgUtilization || '0.0'}%`, icon: PieChart, color: 'text-purple-600', bg: 'bg-purple-50' },
  ] : [
    { label: 'Total Organizations', value: '...', icon: Building2, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Active Organizations', value: '...', icon: ShieldCheck, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Global Workforce Nodes', value: '...', icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Avg System Utilization', value: '...', icon: PieChart, color: 'text-purple-600', bg: 'bg-purple-50' }
  ];

  const handleProvision = async (e) => {
    e.preventDefault();
    setIsProvisioning(true);
    try {
      if (editingTenant) {
        await superadminService.updateCompany(editingTenant._id, formData);
      } else {
        await superadminService.provisionTenant(formData);
      }
      setSuccess(true);
      fetchCompanies();
      setTimeout(() => {
        setSuccess(false);
        setShowModal(false);
        setEditingTenant(null);
        setFormData({ name: '', domain: '', adminEmail: '', password: '', plan: 'Premium', industry: '' });
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
          {row.subscription?.plan || 'basic'}
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
      render: (row, ri) => {
        const isLastRow = ri >= filteredCompanies.length - 2 && filteredCompanies.length > 2;
        return (
          <div className="flex items-center space-x-3 relative">
            <button
              onClick={(e) => { e.stopPropagation(); navigate('/superadmin/analytics'); }}
              className="p-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl text-gray-400 hover:text-indigo-600 transition-all"
              title="Analytics"
            >
              <PieChart size={18} />
            </button>
            <div className="relative">
              <button
                onClick={(e) => { e.stopPropagation(); setActiveMenuId(activeMenuId === row._id ? null : row._id); }}
                className={`p-2 rounded-xl transition-all ${activeMenuId === row._id ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-600' : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
              >
                <MoreVertical size={18} />
              </button>

              {activeMenuId === row._id && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setActiveMenuId(null)}
                  ></div>
                  <div className={`absolute right-0 ${isLastRow ? 'bottom-full mb-2' : 'top-full mt-2'} w-48 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 py-2 z-50 animate-in fade-in zoom-in duration-200`}>
                    {[
                      {
                        label: 'Edit Details', icon: RotateCcw, color: 'indigo', onClick: (row) => {
                          setEditingTenant(row);
                          setFormData({
                            name: row.name,
                            domain: row.domain || '',
                            adminEmail: row.adminEmail || '',
                            password: '',
                            plan: row.subscription?.plan || 'Premium',
                            industry: row.industry || ''
                          });
                          setShowModal(true);
                        }
                      },
                      { label: row.onboardingStatus === 'suspended' ? 'Unsuspend Tenant' : 'Suspend Tenant', icon: row.onboardingStatus === 'suspended' ? CheckCircle2 : X, color: row.onboardingStatus === 'suspended' ? 'emerald' : 'amber', onClick: (row) => handleSuspend(row._id) },
                      { label: 'Delete Record', icon: X, color: 'rose', onClick: (row) => handleDelete(row._id) },
                    ].map((action, i) => (
                      <button
                        key={i}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 text-left transition-colors group"
                        onClick={(e) => {
                          e.stopPropagation();
                          action.onClick(row);
                          setActiveMenuId(null);
                        }}
                      >
                        <action.icon size={16} className={`text-gray-400 group-hover:text-${action.color}-500`} />
                        <span className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-widest">{action.label}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Organization Registry</h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">Global oversight of multi-tenant infrastructure and licenses</p>
        </div>
        <Button
          onClick={() => setShowModal(true)}
          variant="primary"
          className="flex items-center space-x-2 shadow-xl shadow-indigo-100 dark:shadow-none rounded-2xl py-3 px-6"
        >
          <Plus size={18} />
          <span className="font-bold">Add New Tenant</span>
        </Button>
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
                setFormData({ name: '', domain: '', adminEmail: '', password: '', plan: 'Premium', industry: '' });
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
              <form onSubmit={handleProvision}>
                <div className="p-8 border-b border-gray-50 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/20">
                  <div>
                    <h3 className="text-xl font-black text-gray-900 dark:text-white">{editingTenant ? 'Update Organization' : 'New Organization'}</h3>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">{editingTenant ? 'Infrastructure Update' : 'SaaS Onboarding Workflow'}</p>
                  </div>
                  <button type="button" onClick={() => { setShowModal(false); setEditingTenant(null); }} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl text-gray-400 transition-colors">
                    <X size={20} />
                  </button>
                </div>

                <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto">
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
                      {['Basic', 'Premium', 'Enterprise'].map(plan => (
                        <button
                          key={plan}
                          type="button"
                          onClick={() => setFormData({ ...formData, plan })}
                          className={`py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${formData.plan === plan ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 text-gray-400'
                            }`}
                        >
                          {plan}
                          <span className="block text-[9px] font-bold mt-0.5 opacity-60">
                            {plan === 'Basic' ? '10 users' : plan === 'Premium' ? '50 users' : '1,000 users'}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-8 bg-gray-50/50 dark:bg-gray-800/20 flex gap-3 border-t border-gray-50 dark:border-gray-800">
                  <Button type="button" onClick={() => { setShowModal(false); setEditingTenant(null); }} variant="outline" className="flex-1 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest border-gray-200">
                    Cancel
                  </Button>
                  <Button disabled={isProvisioning} variant="primary" className="flex-1 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-indigo-100 dark:shadow-none">
                    {isProvisioning ? 'Working...' : (editingTenant ? 'Save Changes' : 'Add Now')}
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
            <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} dark:bg-opacity-10 shadow-sm border border-transparent hover:border-white/20 transition-all`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest leading-none">{stat.label}</p>
              <p className="text-2xl font-black text-gray-900 dark:text-white mt-1.5">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table with search & filters */}
      <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-50 dark:border-gray-800 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by organization, ID, or industry..."
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
            </div>

            <div className="flex items-center space-x-3">
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

              {/* Clear All */}
              {(searchQuery || activeFilterCount > 0) && (
                <button
                  onClick={clearAllFilters}
                  className="flex items-center space-x-1.5 text-xs font-bold text-rose-500 hover:text-rose-600 transition-colors px-3 py-3"
                >
                  <RotateCcw size={14} />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>

          {/* Advanced Filters Panel */}
          {showAdvancedFilters && (
            <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-gray-50 dark:border-gray-800 animate-in slide-in-from-top-2 duration-200">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Filter by:</span>

              {/* Status Filter */}
              <div className="flex items-center space-x-1.5">
                <span className="text-[10px] font-bold text-gray-500">Status:</span>
                {['active', 'pending', 'suspended'].map(status => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(statusFilter === status ? '' : status)}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${statusFilter === status
                      ? status === 'active' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100'
                        : status === 'pending' ? 'bg-amber-500 text-white shadow-lg shadow-amber-100'
                          : 'bg-rose-600 text-white shadow-lg shadow-rose-100'
                      : 'bg-gray-50 dark:bg-gray-800 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                  >
                    {status}
                  </button>
                ))}
              </div>

              <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />

              {/* Plan Filter */}
              <div className="flex items-center space-x-1.5">
                <span className="text-[10px] font-bold text-gray-500">Plan:</span>
                {['basic', 'premium', 'enterprise'].map(plan => (
                  <button
                    key={plan}
                    onClick={() => setPlanFilter(planFilter === plan ? '' : plan)}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${planFilter === plan
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100'
                      : 'bg-gray-50 dark:bg-gray-800 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                  >
                    {plan}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Active filter summary */}
          {(searchQuery || activeFilterCount > 0) && (
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <span className="font-bold">Showing {filteredCompanies.length} of {companies.length} organizations</span>
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
          )}
        </div>

        <div className="px-4 pb-4">
          <DataTable columns={columns} data={filteredCompanies} loading={loading} onRowClick={(row) => setSelectedTenant(row)} />
        </div>
      </div>
      {/* Detailed Tenant Modal */}
      {selectedTenant && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
          <div className="fixed inset-0 bg-gray-950/60 backdrop-blur-xl animate-in fade-in duration-300" onClick={() => setSelectedTenant(null)}></div>
          <div className="bg-white dark:bg-gray-900 w-full max-w-5xl rounded-[2.5rem] shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-300 border border-white/20 flex flex-col md:flex-row h-auto max-h-[90vh]">

            {/* Left Sidebar Pane */}
            <div className={`md:w-1/3 relative p-8 md:p-10 flex flex-col ${selectedTenant.onboardingStatus === 'suspended'
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
            <div className="md:w-2/3 p-8 md:p-10 flex flex-col bg-gray-50/50 dark:bg-gray-900/50 overflow-y-auto relative">
              <button
                onClick={() => setSelectedTenant(null)}
                className="absolute top-8 right-8 p-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full text-gray-500 transition-all z-10"
              >
                <X size={18} />
              </button>

              <div className="flex-1 mt-2">
                <div className="mb-6">
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
              </div>

              {/* Functional Footer Actions */}
              <div className="mt-6 flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-800">
                <Button
                  variant="outline"
                  onClick={() => {
                    handleSuspend(selectedTenant._id);
                    setSelectedTenant({ ...selectedTenant, onboardingStatus: selectedTenant.onboardingStatus === 'suspended' ? 'active' : 'suspended' });
                  }}
                  className={`px-5 py-3 rounded-xl font-black flex items-center justify-center gap-2 uppercase tracking-widest text-[10px] border-gray-200 dark:border-gray-700 ${selectedTenant.onboardingStatus === 'suspended' ? 'text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20' : 'text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20'}`}
                >
                  {selectedTenant.onboardingStatus === 'suspended' ? <><CheckCircle2 size={16} /> Restore Operation</> : <><X size={16} /> Halt Operations</>}
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
      )}
    </div>
  );
};

export default CompaniesList;
