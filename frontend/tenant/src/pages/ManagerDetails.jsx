import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { ArrowLeft, User, Mail, Phone, MapPin, Briefcase, Activity, Calendar, Shield, Clock } from 'lucide-react';
import Button from '../components/ui/Button';
import tenantService from '../services/core/tenantService';

const ManagerDetails = () => {
  const { setPageLoading } = useOutletContext();
  const { id } = useParams();
  const navigate = useNavigate();
  const [manager, setManager] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchManagerData = async () => {
      try {
        setLoading(true);
        const data = await tenantService.getEmployeeById(id);
        setManager(data);
        setError(null);
        // Ensure page resets to top on profile navigation
        window.scrollTo(0, 0);
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Failed to load personnel profile.');
      } finally {
        setLoading(false);
        if (setPageLoading) setPageLoading(false);
      }
    };

    if (id) {
      fetchManagerData();
    }
  }, [id]);



  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-black text-gray-400 uppercase tracking-widest animate-pulse">Synchronizing Personnel Data...</p>
      </div>
    );
  }

  if (error || !manager) {
    return (
      <div className="p-8 bg-rose-50 dark:bg-rose-900/10 border-2 border-rose-500/20 rounded-[2rem] flex flex-col items-center text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-rose-500 flex items-center justify-center text-white shadow-lg shadow-rose-500/20">
          <Shield size={32} />
        </div>
        <h2 className="text-xl font-black text-rose-700 dark:text-rose-400 uppercase tracking-tight">Access Error</h2>
        <p className="text-sm font-bold text-rose-600 dark:text-rose-500/80 max-w-md">{error || 'Resource not found'}</p>
        <Button onClick={() => navigate(-1)} variant="outline" className="mt-4 border-rose-500/30 text-rose-600 px-8 rounded-xl">
          Return to Hub
        </Button>
      </div>
    );
  }

  // Profile Mapping
  const profileDetails = {
    name: manager.name,
    designation: manager.profile?.designation || (manager.role === 'manager' ? 'Operations Manager' : 'Field Representative'),
    email: manager.email,
    phone: manager.profile?.phone || 'No Contact Verified',
    location: manager.profile?.location || manager.profile?.zone || 'Global Operations',
    team: manager.profile?.team || 'Standard Nexus',
    status: manager.status || (manager.isDeactivated ? 'Inactive' : 'Active'),
    joinDate: new Date(manager.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
    avatar: manager.profile?.profileImage || `https://i.pravatar.cc/150?u=${manager._id}`
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 overflow-x-hidden pb-12">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={() => navigate(-1)} className="p-2 border border-gray-100 dark:border-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm">
          <ArrowLeft size={20} className="text-gray-600 dark:text-gray-400" />
        </Button>
        <div className="flex flex-col">
          <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight uppercase leading-none">Personnel Profile</h1>
          <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1">Ref ID: {manager._id}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
        <div className="absolute -top-10 -right-10 w-64 h-64 bg-blue-50 dark:bg-blue-900/10 rounded-full blur-3xl opacity-50 pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-emerald-50 dark:bg-emerald-900/10 rounded-full blur-3xl opacity-50 pointer-events-none" />

        {/* LEFT COLUMN - Profile Card */}
        <div className="col-span-1 space-y-6">
          <div className="relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-[2.5rem] p-8 border-2 border-blue-500/10 flex flex-col items-center text-center shadow-xl shadow-gray-200/20 dark:shadow-none transition-all hover:border-blue-500/30 overflow-hidden group">
            <div className="absolute right-0 top-0 w-32 h-32 opacity-5 pointer-events-none text-blue-900 rotate-12 -translate-y-4 translate-x-4">
              <User size={128} />
            </div>

            <div className="w-32 h-32 rounded-[2rem] bg-blue-50 dark:bg-blue-900/40 p-1 mb-6 group-hover:scale-110 transition-transform duration-500 shrink-0 shadow-lg">
              <img src={profileDetails.avatar} alt={profileDetails.name} className="w-full h-full rounded-[1.8rem] border-4 border-white dark:border-gray-800 object-cover" />
            </div>

            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-1 tracking-tight uppercase leading-none">{profileDetails.name}</h2>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 mt-2">{profileDetails.designation}</p>

            <span className={`inline-flex items-center px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm border-2 ${profileDetails.status === 'On Duty' || profileDetails.status === 'Active'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-500/20 dark:bg-emerald-900/40 dark:text-emerald-400'
              : 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800/40 dark:text-gray-400'
              }`}>
              {profileDetails.status}
            </span>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-[2rem] p-8 border-2 border-blue-500/10 shadow-sm space-y-6 transition-all hover:border-blue-500/30 group">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] mb-4 flex items-center gap-2">
              <Mail size={14} className="text-blue-500" /> Contact Grid
            </h3>
            <div className="space-y-5">
              <div className="flex items-center gap-4 group/item">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 shrink-0 group-hover/item:rotate-12 transition-transform shadow-sm">
                  <Mail size={18} />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Digital Address</span>
                  <span className="font-bold text-sm text-gray-900 dark:text-white truncate">{profileDetails.email}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 group/item">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 shrink-0 group-hover/item:-rotate-12 transition-transform shadow-sm">
                  <Phone size={18} />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Telecom</span>
                  <span className="font-bold text-sm text-gray-900 dark:text-white">{profileDetails.phone}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 group/item">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 shrink-0 group-hover/item:rotate-12 transition-transform shadow-sm">
                  <MapPin size={18} />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Geo Node</span>
                  <span className="font-bold text-sm text-gray-900 dark:text-white">{profileDetails.location}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - Main Content */}
        <div className="col-span-1 lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-10 border-2 border-blue-500/10 shadow-sm transition-all hover:border-blue-500/30">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] mb-10 flex items-center gap-2">
              <Briefcase size={16} className="text-purple-500" /> Operational Overview
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="flex items-center space-x-5 p-4 bg-gray-50/50 dark:bg-gray-800/20 rounded-2xl border border-transparent hover:border-purple-500/20 transition-all">
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-2xl text-purple-600 shadow-sm">
                  <Briefcase size={24} />
                </div>
                <div>
                  <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Assigned Domain</p>
                  <p className="font-black text-lg text-gray-900 dark:text-white uppercase tracking-tight">{profileDetails.team}</p>
                </div>
              </div>
              <div className="flex items-center space-x-5 p-4 bg-gray-50/50 dark:bg-gray-800/20 rounded-2xl border border-transparent hover:border-emerald-500/20 transition-all">
                <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl text-emerald-600 shadow-sm">
                  <Activity size={24} />
                </div>
                <div>
                  <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Telemetry Status</p>
                  <p className="font-black text-lg text-gray-900 dark:text-white uppercase tracking-tight">{profileDetails.status}</p>
                </div>
              </div>
              <div className="flex items-center space-x-5 p-4 bg-gray-50/50 dark:bg-gray-800/20 rounded-2xl border border-transparent hover:border-blue-500/20 transition-all">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl text-blue-600 shadow-sm">
                  <Calendar size={24} />
                </div>
                <div>
                  <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Onboarding Epoch</p>
                  <p className="font-black text-lg text-gray-900 dark:text-white uppercase tracking-tight">{profileDetails.joinDate}</p>
                </div>
              </div>
              <div className="flex items-center space-x-5 p-4 bg-gray-50/50 dark:bg-gray-800/20 rounded-2xl border border-transparent hover:border-indigo-500/20 transition-all">
                <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl text-indigo-600 shadow-sm">
                  <User size={24} />
                </div>
                <div>
                  <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Strategic Parent</p>
                  <p className="font-black text-lg text-gray-900 dark:text-white uppercase tracking-tight">Executive HQ</p>
                </div>
              </div>
            </div>
          </div>

          {/* Team Members Section */}
          {manager.role === 'manager' && (
            <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-10 border-2 border-blue-500/10 shadow-sm transition-all hover:border-blue-500/30 overflow-hidden">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] flex items-center gap-2">
                  <User size={16} className="text-blue-500" /> Team Members
                </h3>
                <span className="text-[8px] font-black text-blue-500 uppercase tracking-widest bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full">{manager.subordinates?.length || 0} Managed Nodes</span>
              </div>

              <div className="overflow-x-auto -mx-2">
                <table className="w-full person-table text-left border-separate border-spacing-y-3">
                  <thead>
                    <tr className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em]">
                      <th className="px-4 pb-2">Employee</th>
                      <th className="px-4 pb-2">Role</th>
                      <th className="px-4 pb-2">Status</th>
                      <th className="px-4 pb-2">Last Activity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {manager.subordinates?.map((sub) => (
                      <tr
                        key={sub._id}
                        onClick={() => navigate(`/tenant/employees/${sub._id}`)}
                        className="group/row bg-gray-50/50 dark:bg-gray-800/20 hover:bg-blue-50/30 dark:hover:bg-blue-900/20 border-2 border-transparent hover:border-blue-500/20 rounded-2xl cursor-pointer transition-all"
                      >
                        <td className="px-4 py-4 rounded-l-2xl">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-[10px] font-black text-blue-600">
                              {sub.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <span className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-tight group-hover/row:text-blue-600 transition-colors">{sub.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest leading-none">
                            {sub.profile?.designation || 'Field Rep'}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${sub.status === 'Active' || sub.status === 'On Duty'
                            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
                            : 'bg-gray-100 text-gray-500 dark:bg-gray-800/50 dark:text-gray-400'
                            }`}>
                            {sub.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 rounded-r-2xl">
                          <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 tabular-nums">
                            {new Date(sub.updatedAt || sub.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {(!manager.subordinates || manager.subordinates.length === 0) && (
                      <tr className="bg-gray-50/30 dark:bg-transparent rounded-2xl border-2 border-dashed border-gray-100 dark:border-gray-800">
                        <td colSpan={4} className="px-4 py-8 text-center">
                          <div className="flex flex-col items-center gap-2">
                            <User size={24} className="text-gray-300 dark:text-gray-700" />
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">No personnel reports for this node</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-10 border-2 border-blue-500/10 shadow-sm transition-all hover:border-blue-500/30">

            <div className="flex items-center justify-between mb-10">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] flex items-center gap-2">
                <Clock size={16} className="text-blue-500" /> Recent Activity Stream
              </h3>
              <span className="text-[8px] font-black text-blue-500 uppercase tracking-widest bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full">Encrypted logs</span>
            </div>

            <div className="space-y-8 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-100 dark:before:bg-gray-800">
              <div className="relative pl-10 group">
                <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-white dark:bg-gray-900 border-4 border-emerald-500 group-hover:scale-125 transition-transform z-10 shadow-sm" />
                <div className="pb-2">
                  <p className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">Active Pulse Detected</p>
                  <p className="text-xs font-bold text-gray-500 mt-1 italic">Last active: Just moments ago in {profileDetails.location}</p>
                </div>
              </div>
              <div className="relative pl-10 group">
                <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-white dark:bg-gray-900 border-4 border-blue-500 group-hover:scale-125 transition-transform z-10 shadow-sm" />
                <div className="pb-2">
                  <p className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">System Handshake Completed</p>
                  <p className="text-xs font-bold text-gray-500 mt-1 italic">Synchronization at {new Date().toLocaleTimeString()}</p>
                </div>
              </div>
            </div>

            <button className="w-full mt-10 py-5 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-[1.5rem] text-[10px] font-black uppercase text-gray-400 hover:text-blue-600 hover:border-blue-500/30 transition-all tracking-[0.2em]">
              Access Detailed Audit Stream
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDetails;
