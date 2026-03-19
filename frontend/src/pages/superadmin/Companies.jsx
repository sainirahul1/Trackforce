import React, { useState } from 'react';
import DataTable from '../../components/DataTable';
import { mockCompanies } from '../../utils/mockData';
import Button from '../../components/Button';
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
  CheckCircle2
} from 'lucide-react';

const CompaniesList = () => {
  const [showModal, setShowModal] = useState(false);
  const [isProvisioning, setIsProvisioning] = useState(false);
  const [success, setSuccess] = useState(false);

  const stats = [
    { label: 'Active Tenants', value: '124', icon: Building2, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Global Coverage', value: '14 Countries', icon: Globe, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Compliance Rate', value: '99.2%', icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  const handleProvision = (e) => {
    e.preventDefault();
    setIsProvisioning(true);
    setTimeout(() => {
      setIsProvisioning(false);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setShowModal(false);
      }, 2000);
    }, 1500);
  };

  const columns = [
    {
      header: 'Organization',
      accessor: 'name',
      render: (row) => (
        <div className="flex items-center space-x-4">
          <img src={row.logo} alt={row.name} className="w-12 h-12 rounded-2xl object-cover border border-gray-100 dark:border-gray-800 shadow-sm" />
          <div>
            <p className="font-bold text-gray-900 dark:text-gray-100 leading-none">{row.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 flex items-center">
              <span className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-[10px] font-bold uppercase mr-2">{row.industry}</span>
              ID: #TEN-{row.id}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: 'Scale',
      accessor: 'employees',
      render: (row) => (
        <div className="flex flex-col">
          <span className="text-sm font-bold text-gray-700">{row.employees.toLocaleString()} Users</span>
          <div className="w-24 h-1 bg-gray-100 rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-indigo-500 w-2/3" />
          </div>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider ${
          row.status === 'Active' ? 'bg-emerald-100 text-emerald-700' :
          row.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
        }`}>
          {row.status}
        </span>
      ),
    },
    {
      header: 'Actions',
      accessor: 'id',
      render: () => (
        <div className="flex items-center space-x-3">
          <button className="p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl text-gray-400 hover:text-indigo-600 transition-all">
            <PieChart size={18} />
          </button>
          <button className="px-4 py-2 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-200 text-xs font-bold rounded-xl transition-all">
            Manage
          </button>
          <button className="p-2 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl text-gray-400 hover:text-rose-600 transition-all">
            <MoreVertical size={18} />
          </button>
        </div>
      ),
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
          <span className="font-bold">Provision New Tenant</span>
        </Button>
      </div>

      {/* Provisioning Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-gray-100 dark:border-gray-800">
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
                    <h3 className="text-xl font-black text-gray-900 dark:text-white">New Organization</h3>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">SaaS Onboarding Workflow</p>
                  </div>
                  <button type="button" onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl text-gray-400 transition-colors">
                    <X size={20} />
                  </button>
                </div>
                
                <div className="p-8 space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Company Name</label>
                      <div className="relative">
                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                        <input required placeholder="e.g. Acme Corp Logistics" className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800/50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500/10 outline-none" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Primary Domain</label>
                        <div className="relative">
                          <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                          <input required placeholder="acme.com" className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800/50 border-none rounded-2xl text-sm font-bold outline-none" />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Admin Email</label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                          <input required type="email" placeholder="admin@acme.com" className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800/50 border-none rounded-2xl text-sm font-bold outline-none" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Subscription Plan</label>
                      <div className="grid grid-cols-3 gap-2">
                        {['Basic', 'Premium', 'Enterprise'].map(plan => (
                          <button key={plan} type="button" className={`py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                            plan === 'Premium' ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 text-gray-400'
                          }`}>
                            {plan}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-8 bg-gray-50/50 dark:bg-gray-800/20 flex gap-3 border-t border-gray-50 dark:border-gray-800">
                  <Button type="button" onClick={() => setShowModal(false)} variant="outline" className="flex-1 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest border-gray-200">
                    Cancel
                  </Button>
                  <Button disabled={isProvisioning} variant="primary" className="flex-1 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-indigo-100 dark:shadow-none">
                    {isProvisioning ? 'Working...' : 'Provision Now'}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

      {/* Table with search */}
      <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-50 dark:border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Search by organization, ID, or industry..."
              className="w-full pl-12 pr-6 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl text-sm font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500/10 outline-none transition-all"
            />
          </div>
          <div className="flex items-center space-x-3">
            <select className="bg-gray-50 dark:bg-gray-800 border-none rounded-2xl text-xs font-bold px-4 py-3 outline-none cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300">
              <option>All Industries</option>
              <option>Technology</option>
              <option>Logistics</option>
            </select>
            <Button variant="outline" className="flex items-center space-x-2 rounded-2xl px-4 py-3 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300">
              <Filter size={18} />
              <span className="font-bold">Advanced Filters</span>
            </Button>
          </div>
        </div>
        <div className="px-4 pb-4">
          <DataTable columns={columns} data={mockCompanies} />
        </div>
      </div>
    </div>
  );
};

export default CompaniesList;
