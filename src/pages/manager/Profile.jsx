import React, { useState } from 'react';
import { 
  User, Mail, Phone, Building2, MapPin, Shield, 
  Settings, Bell, Moon, Sun, Camera, Save, 
  ChevronRight, LogOut, CheckCircle2, Globe,
  ShieldCheck, CreditCard, Laptop
} from 'lucide-react';

/**
 * ManagerProfile Component
 * Professional profile and settings management for the Manager portal.
 */
const ManagerProfile = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [isSaved, setIsSaved] = useState(false);

  const managerData = {
    name: 'Abhiram Rangoon',
    role: 'Regional Sales Manager',
    email: 'abhiram@trackforce.com',
    phone: '+91 98765 43210',
    company: 'ReatchAll Technologies',
    location: 'Bangalore, India',
    timezone: 'IST (UTC +5:30)',
    joinDate: 'Jan 2024',
    avatar: 'AR'
  };

  const tabs = [
    { id: 'personal', label: 'Personal Information', icon: User },
    { id: 'security', label: 'Security & Access', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      {/* 1. Profile Header Hub */}
      <header className="relative overflow-hidden rounded-[3rem] p-10 md:p-14 shadow-2xl bg-gradient-to-br from-slate-800 via-slate-900 to-black text-white">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] -mr-32 -mt-32 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
          <div className="relative group">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-[3rem] bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-4xl md:text-5xl font-black text-white shadow-2xl rotate-3 group-hover:rotate-0 transition-transform duration-500">
              {managerData.avatar}
            </div>
            <button className="absolute -bottom-2 -right-2 p-3 bg-white dark:bg-gray-900 rounded-2xl text-gray-900 dark:text-white shadow-xl hover:scale-110 active:scale-95 transition-all">
              <Camera size={20} />
            </button>
          </div>

          <div className="text-center md:text-left space-y-4">
             <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full">
                <ShieldCheck size={14} className="text-emerald-400" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/90">Identity Verified</span>
             </div>
             <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-none">
               {managerData.name}
             </h1>
             <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <div className="flex items-center gap-2 text-slate-400 font-medium">
                   <Building2 size={16} />
                   <span>{managerData.company}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 font-medium">
                   <MapPin size={16} />
                   <span>{managerData.location}</span>
                </div>
             </div>
          </div>

          <div className="flex-1" />

          <div className="hidden lg:flex flex-col items-end gap-3 text-right">
             <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Global Rank</p>
             <p className="text-4xl font-black text-white">#12</p>
             <div className="px-4 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black rounded-lg">Top 1% Performance</div>
          </div>
        </div>
      </header>

      {/* 2. Settings Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-4">
           {tabs.map((tab) => (
             <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id)}
               className={`w-full flex items-center gap-4 p-5 rounded-[2rem] font-black text-sm transition-all group ${
                 activeTab === tab.id 
                 ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' 
                 : 'bg-white dark:bg-gray-900 text-gray-400 border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800'
               }`}
             >
               <div className={`p-2 rounded-xl transition-all ${activeTab === tab.id ? 'bg-white/20' : 'bg-gray-50 dark:bg-gray-800'}`}>
                 <tab.icon size={18} />
               </div>
               <span className="tracking-tight">{tab.label}</span>
               <ChevronRight size={16} className={`ml-auto transition-transform ${activeTab === tab.id ? 'translate-x-1' : 'opacity-0'}`} />
             </button>
           ))}

           <div className="pt-8 space-y-4">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">Account Status</h4>
              <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-[2rem] border border-indigo-100 dark:border-indigo-900/30">
                 <div className="flex items-center justify-between mb-4">
                   <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Enterprise Plan</span>
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                 </div>
                 <p className="text-xs font-bold text-slate-600 dark:text-slate-300 leading-relaxed mb-4">You have access to all multi-tenant SaaS features.</p>
                 <button className="w-full py-3 bg-white dark:bg-gray-800 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all">MANAGE SUBSCRIPTION</button>
              </div>
           </div>
        </div>

        {/* Dynamic Detail Panes */}
        <div className="lg:col-span-3">
           <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[3.5rem] p-8 md:p-12 shadow-sm">
              
              {activeTab === 'personal' && (
                <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                   <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Personal Details</h3>
                      {isSaved && (
                        <div className="flex items-center gap-2 text-emerald-600 animate-in fade-in duration-300">
                          <CheckCircle2 size={16} />
                          <span className="text-[10px] font-black uppercase tracking-widest">Saved Successfully</span>
                        </div>
                      )}
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Identity</label>
                         <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input 
                              type="text" 
                              defaultValue={managerData.name}
                              className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800/50 border-none rounded-2xl text-sm font-bold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                            />
                         </div>
                      </div>

                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Protocol</label>
                         <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input 
                              type="email" 
                              defaultValue={managerData.email}
                              className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800/50 border-none rounded-2xl text-sm font-bold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                            />
                         </div>
                      </div>

                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Secure Line</label>
                         <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input 
                              type="text" 
                              defaultValue={managerData.phone}
                              className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800/50 border-none rounded-2xl text-sm font-bold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                            />
                         </div>
                      </div>

                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Regional Node</label>
                         <div className="relative">
                            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <select className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800/50 border-none rounded-2xl text-sm font-bold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none cursor-pointer">
                               <option>Bangalore, India</option>
                               <option>Mumbai, India</option>
                               <option>Delhi, India</option>
                            </select>
                         </div>
                      </div>
                   </div>

                   <button 
                     onClick={handleSave}
                     className="flex items-center gap-3 px-10 py-4 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-black text-sm rounded-2xl transition-all shadow-xl shadow-indigo-600/20"
                   >
                     <Save size={20} />
                     UPDATE SYNC
                   </button>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                   <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Security Hardening</h3>
                   
                   <div className="space-y-6">
                      {[
                        { label: 'Multi-Factor Auth', desc: 'Secure your login with biometric or TOTP tokens', value: true, icon: ShieldCheck },
                        { label: 'Device Integrity', desc: 'Only allow logged sessions from verified devices', value: false, icon: Laptop },
                        { label: 'Biometric Locking', desc: 'Require FaceID/TouchID for critical actions', value: true, icon: User },
                      ].map((s, i) => (
                        <div key={i} className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800">
                           <div className="flex items-center gap-5">
                              <div className="w-12 h-12 rounded-2xl bg-white dark:bg-gray-900 flex items-center justify-center text-indigo-600 shadow-sm shrink-0">
                                 <s.icon size={22} />
                              </div>
                              <div>
                                 <p className="text-sm font-black text-gray-900 dark:text-white">{s.label}</p>
                                 <p className="text-xs font-bold text-gray-400 mt-1">{s.desc}</p>
                              </div>
                           </div>
                           <button className={`w-14 h-8 rounded-full transition-all relative ${s.value ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-700'}`}>
                              <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${s.value ? 'left-7' : 'left-1'}`} />
                           </button>
                        </div>
                      ))}
                   </div>

                   <div className="p-8 bg-rose-50 dark:bg-rose-500/5 rounded-3xl border border-rose-100 dark:border-rose-500/20">
                      <h4 className="text-sm font-black text-rose-600 uppercase tracking-tight mb-2">Hazard Zone</h4>
                      <p className="text-xs font-bold text-rose-500 opacity-80 leading-relaxed mb-6">Permanently terminate your multi-tenant management session. This cannot be undone.</p>
                      <button className="flex items-center gap-2 px-6 py-3 bg-rose-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-700 transition-all">
                         TERMINATE ACCOUNT
                      </button>
                   </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                   <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Signal Preferences</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        { title: 'Critical System Alerts', type: 'Email + Push' },
                        { title: 'Visit Verifications', type: 'Instant Push' },
                        { title: 'Weekly Reports', type: 'Email Only' },
                        { title: 'Fleet Offline Alerts', type: 'SMS + Email' },
                      ].map((n, i) => (
                        <div key={i} className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800">
                           <p className="text-sm font-black text-gray-900 dark:text-white mb-2">{n.title}</p>
                           <div className="flex items-center justify-between">
                              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{n.type}</span>
                              <Settings size={14} className="text-gray-300 hover:text-indigo-600 transition-colors cursor-pointer" />
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
              )}
           </div>
        </div>

      </div>

    </div>
  );
};

export default ManagerProfile;
