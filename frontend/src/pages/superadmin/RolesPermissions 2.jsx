import React, { useState } from 'react';
import { 
  Shield, 
  Lock, 
  Users, 
  Eye, 
  Edit3, 
  ChevronRight, 
  Search,
  CheckCircle2,
  XCircle,
  MoreVertical,
  Key
} from 'lucide-react';
import Button from '../../components/Button';

const RolesPermissions = () => {
  const [activeTab, setActiveTab] = useState('Roles');
  
  const roles = [
    { 
      name: 'Super Admin', 
      description: 'Platform owner with full access to all organizations and global settings.',
      users: 5,
      level: 'Global',
      color: 'indigo'
    },
    { 
      name: 'Tenant Admin', 
      description: 'Organization administrator managing their own company, employees, and settings.',
      users: 142,
      level: 'Organization',
      color: 'blue'
    },
    { 
      name: 'Manager', 
      description: 'Team lead managing field executive performance, routes, and tasks.',
      users: 380,
      level: 'Team',
      color: 'emerald'
    },
    { 
      name: 'Employee', 
      description: 'Field executive performing store visits, tracking movements, and collecting orders.',
      users: 4200,
      level: 'Individual',
      color: 'amber'
    }
  ];

  const permissions = [
    { module: 'User Management', superAdmin: true, tenant: true, manager: true, employee: false },
    { module: 'Global Settings', superAdmin: true, tenant: false, manager: false, employee: false },
    { module: 'Live Tracking', superAdmin: true, tenant: true, manager: true, employee: false },
    { module: 'Revenue Analytics', superAdmin: true, tenant: true, manager: false, employee: false },
    { module: 'Store Visits', superAdmin: true, tenant: true, manager: true, employee: true },
    { module: 'Order Collection', superAdmin: true, tenant: true, manager: true, employee: true },
    { module: 'GPS History', superAdmin: true, tenant: true, manager: true, employee: false },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Roles & Permissions</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium italic">Define platform-wide access controls and permission matrices.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-2xl py-3 px-6 hidden sm:flex items-center gap-2">
            <Lock size={18} />
            <span className="font-bold">Security Audit</span>
          </Button>
          <Button variant="primary" className="rounded-2xl py-3 px-6 shadow-xl shadow-indigo-100 dark:shadow-none flex items-center gap-2">
            <Key size={18} />
            <span className="font-bold">Define Role</span>
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-8 border-b border-gray-100 dark:border-gray-800 pb-px">
        {['Roles', 'Permissions', 'Audit Log'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 text-sm font-black uppercase tracking-widest transition-all relative ${
              activeTab === tab 
                ? 'text-indigo-600' 
                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      {activeTab === 'Roles' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {roles.map((role) => (
            <div 
              key={role.name}
              className="bg-white dark:bg-gray-900 p-6 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:border-indigo-100 dark:hover:border-indigo-500/20 transition-all duration-300 group"
            >
              <div className="flex justify-between items-start mb-6">
                <div className={`p-4 rounded-2xl bg-${role.color}-50 dark:bg-${role.color}-500/10 text-${role.color}-600 dark:text-${role.color}-400`}>
                  <Shield size={24} />
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Users</span>
                    <span className="text-xl font-black text-gray-900 dark:text-white italic">{role.users.toLocaleString()}</span>
                  </div>
                  <button className="p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl text-gray-300 transition-colors">
                    <MoreVertical size={20} />
                  </button>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-black text-gray-900 dark:text-white">{role.name}</h3>
                  <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-tighter bg-${role.color}-50 dark:bg-${role.color}-500/10 text-${role.color}-600 dark:text-${role.color}-400 border border-${role.color}-100 dark:border-${role.color}-500/20`}>
                    {role.level}
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                  {role.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-gray-800">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-900 bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-[10px] font-bold text-gray-500">
                      {String.fromCharCode(64+i)}
                    </div>
                  ))}
                  <div className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-900 bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-[10px] font-bold text-indigo-600">
                    +
                  </div>
                </div>
                <button className="flex items-center gap-1.5 text-xs font-black text-indigo-600 hover:underline uppercase tracking-widest">
                  Edit Permissions <ChevronRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'Permissions' && (
        <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/20">
            <h3 className="font-black text-gray-900 dark:text-white uppercase tracking-widest text-xs">Global Permission Matrix</h3>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl">
              <Search size={14} className="text-gray-400" />
              <input type="text" placeholder="Search modules..." className="bg-transparent border-none text-xs font-bold outline-none w-40" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-50 dark:border-gray-800 bg-white dark:bg-gray-900">
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Module Name</th>
                  <th className="px-6 py-5 text-[10px] font-black text-indigo-600 uppercase tracking-widest text-center">Super Admin</th>
                  <th className="px-6 py-5 text-[10px] font-black text-blue-600 uppercase tracking-widest text-center">Tenant Admin</th>
                  <th className="px-6 py-5 text-[10px] font-black text-emerald-600 uppercase tracking-widest text-center">Manager</th>
                  <th className="px-6 py-5 text-[10px] font-black text-amber-600 uppercase tracking-widest text-center">Employee</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                {permissions.map((p, i) => (
                  <tr key={i} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                        <span className="text-sm font-black text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors">{p.module}</span>
                      </div>
                    </td>
                    {[p.superAdmin, p.tenant, p.manager, p.employee].map((allowed, idx) => (
                      <td key={idx} className="px-6 py-5 text-center">
                        <div className="flex justify-center">
                          {allowed ? (
                            <div className="text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 p-1.5 rounded-lg shadow-sm border border-emerald-100 dark:border-emerald-500/20">
                              <CheckCircle2 size={16} strokeWidth={3} />
                            </div>
                          ) : (
                            <div className="text-red-500 bg-red-50 dark:bg-red-500/10 p-1.5 rounded-lg opacity-30">
                              <XCircle size={16} strokeWidth={3} />
                            </div>
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-6 bg-gray-50 dark:bg-gray-800/20 flex justify-center border-t border-gray-50 dark:border-gray-800">
            <Button variant="outline" className="rounded-xl py-2 px-8 text-xs font-black uppercase tracking-widest">
              Save changes to matrix
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RolesPermissions;
