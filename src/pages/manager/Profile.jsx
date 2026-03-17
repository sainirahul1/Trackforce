import React, { useState, useRef } from 'react';
import { 
  User, Mail, Phone, Building2, MapPin, Shield, 
  Settings, Bell, Moon, Sun, Camera, Save, 
  ChevronRight, LogOut, CheckCircle2, Globe,
  ShieldCheck, CreditCard, Laptop, Smartphone,
  Calendar, Lock, AlertTriangle, Clock, Activity
} from 'lucide-react';

/**
 * ManagerProfile Component
 * Professional profile and settings management for the Manager portal.
 */
const ManagerProfile = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [isSaved, setIsSaved] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const fileInputRef = useRef(null);

  // States for toggles
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(false);
  const [teamAlerts, setTeamAlerts] = useState(true);
  const [twoFA, setTwoFA] = useState(true);
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [quietHours, setQuietHours] = useState(false);

  // States for Password Modal
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [passwordError, setPasswordError] = useState('');

  // States for Sessions
  const [sessions, setSessions] = useState([
    { id: 1, device: 'Workstation — Chrome @ Windows 11', loc: 'Bangalore, India', current: true, icon: Laptop },
    { id: 2, device: 'iPhone 15 Pro — Safari @ iOS 17', loc: 'Bangalore, India', current: false, icon: Smartphone },
  ]);

  const managerData = {
    name: 'Abhiram Rangoon',
    role: 'Regional Sales Manager',
    email: 'abhiram@trackforce.com',
    phone: '+91 98765 43210',
    company: 'ReatchAll Technologies',
    location: 'Bangalore, India',
    nationality: 'Indian',
    gender: 'Male',
    dob: '15 May 1988',
    department: 'Sales & Operations',
    emergencyContact: 'Priya (Spouse) - 91234 56789',
    address: 'Vasanth Nagar, Bangalore, KA 560001',
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

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      setPasswordError('New passwords do not match');
      return;
    }
    if (passwords.new.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return;
    }
    // Simulate API call
    setIsSaved(true);
    setIsPasswordModalOpen(false);
    setPasswords({ current: '', new: '', confirm: '' });
    setPasswordError('');
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleRevokeSession = (id) => {
    setSessions(prev => prev.filter(session => session.id !== id));
  };

  const handleRevokeAll = () => {
    setSessions(prev => prev.filter(session => session.current));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const Toggle = ({ checked, onChange }) => (
    <button 
      onClick={() => onChange(!checked)}
      className={`w-14 h-8 rounded-full transition-all relative ${checked ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-700'}`}
    >
      <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-sm ${checked ? 'left-7' : 'left-1'}`} />
    </button>
  );

  const SettingRow = ({ label, sub, icon: Icon, children }) => (
    <div className="flex items-center justify-between gap-8 py-6 border-b border-gray-50 dark:border-gray-800/50 last:border-0 hover:bg-gray-50/30 dark:hover:bg-gray-800/10 -mx-6 px-6 rounded-2xl transition-all">
      <div className="flex items-center gap-4 min-w-0">
        {Icon && (
          <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-xl shrink-0">
            <Icon size={18} />
          </div>
        )}
        <div className="min-w-0">
          <p className="font-bold text-gray-900 dark:text-white truncate">{label}</p>
          <p className="text-xs text-gray-500 font-medium mt-1">{sub}</p>
        </div>
      </div>
      <div className="shrink-0">
        {children}
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen">
      {/* Background Accents - Updated to White */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/10 rounded-full blur-[140px] -mr-64 -mt-64" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-white/5 rounded-full blur-[140px] -ml-64 -mb-64" />
      </div>

      {/* Password Update Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border border-white/20 dark:border-slate-800 shadow-2xl animate-in zoom-in-95 duration-300">
            <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight mb-2">Update Password</h3>
            <p className="text-xs text-gray-500 font-medium mb-8">Ensure your account stays secure with a strong password.</p>
            
            <form onSubmit={handlePasswordUpdate} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Current Password</label>
                <input 
                  type="password"
                  required
                  value={passwords.current}
                  onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                  className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-none rounded-2xl text-sm font-bold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  placeholder="••••••••"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">New Password</label>
                <input 
                  type="password"
                  required
                  value={passwords.new}
                  onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                  className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-none rounded-2xl text-sm font-bold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  placeholder="••••••••"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Confirm New Password</label>
                <input 
                  type="password"
                  required
                  value={passwords.confirm}
                  onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                  className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-none rounded-2xl text-sm font-bold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  placeholder="••••••••"
                />
              </div>

              {passwordError && (
                <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest text-center">{passwordError}</p>
              )}

              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
                >
                  Update Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="relative z-10 max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 px-4">
        
        {/* 1. Profile Header Hub - Transitioned to White Theme */}
        <header className="relative overflow-hidden rounded-[3rem] p-10 md:p-14 shadow-2xl bg-white/60 dark:bg-slate-900/40 backdrop-blur-3xl border border-white/20 dark:border-slate-800 text-gray-900 dark:text-white">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-[120px] -mr-32 -mt-32 pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
            <div className="relative group">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                className="hidden" 
                accept="image/*" 
              />
              <div 
                className="w-32 h-32 md:w-40 md:h-40 rounded-[3rem] bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-4xl md:text-5xl font-black text-white shadow-2xl rotate-3 group-hover:rotate-0 transition-transform duration-500 overflow-hidden"
              >
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  managerData.avatar
                )}
              </div>
              <button 
                onClick={triggerFileInput}
                className="absolute -bottom-2 -right-2 p-3 bg-white dark:bg-gray-900 rounded-2xl text-gray-900 dark:text-white shadow-xl hover:scale-110 active:scale-95 transition-all"
              >
                <Camera size={20} />
              </button>
            </div>

            <div className="text-center md:text-left space-y-4">
               <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gray-900/5 dark:bg-white/10 backdrop-blur-md border border-gray-900/10 dark:border-white/20 rounded-full">
                  <ShieldCheck size={14} className="text-emerald-500 dark:text-emerald-400" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 dark:text-white/90">Identity Verified</span>
               </div>
               <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-none text-gray-900 dark:text-white">
                 {managerData.name}
               </h1>
               <div className="flex flex-wrap justify-center md:justify-start gap-4">
                  <div className="flex items-center gap-2 text-gray-500 dark:text-slate-400 font-medium">
                     <Building2 size={16} />
                     <span>{managerData.company}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 dark:text-slate-400 font-medium">
                     <MapPin size={16} />
                     <span>{managerData.location}</span>
                  </div>
               </div>
            </div>

            <div className="flex-1" />

            <div className="hidden lg:flex flex-col items-end gap-3 text-right">
               <p className="text-[10px] font-black text-gray-400 dark:text-white/40 uppercase tracking-widest">Global Rank</p>
               <p className="text-4xl font-black text-gray-900 dark:text-white">#12</p>
               <div className="px-4 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-black rounded-lg">Top 1% Performance</div>
            </div>
          </div>
        </header>

        {/* 2. Settings Content Area - Refined to Horizontal Navigation */}
        <div className="flex flex-col gap-8">
          
          {/* Horizontal Navigation Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-4 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md p-3 rounded-[2.5rem] border border-white/20 dark:border-slate-800">
             {tabs.map((tab) => (
               <button
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id)}
                 className={`flex items-center gap-3 px-6 py-4 rounded-[1.5rem] font-black text-sm transition-all group ${
                   activeTab === tab.id 
                   ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' 
                   : 'text-gray-400 hover:bg-white dark:hover:bg-gray-800 hover:text-gray-600 dark:hover:text-white'
                 }`}
               >
                 <div className={`p-2 rounded-xl transition-all ${activeTab === tab.id ? 'bg-white/20' : 'bg-gray-50 dark:bg-gray-800'}`}>
                   <tab.icon size={18} />
                 </div>
                 <span className="tracking-tight">{tab.label}</span>
               </button>
             ))}
          </div>

          {/* Dynamic Detail Panes - Vertically Arranged and Centered */}
          <div className="max-w-4xl mx-auto w-full">
             <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-gray-100 dark:border-gray-800 rounded-[3.5rem] p-8 md:p-12 shadow-sm">
                
                {activeTab === 'personal' && (
                  <div className="space-y-10 animate-in fade-in slide-in-from-top-4 duration-500">
                     <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Personal Details</h3>
                          <p className="text-xs text-gray-500 font-medium mt-1">Management identity and professional records</p>
                        </div>
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
                           <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Official Email</label>
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
                           <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Department Hub</label>
                           <div className="relative">
                              <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                              <input 
                                type="text" 
                                defaultValue={managerData.department}
                                className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800/50 border-none rounded-2xl text-sm font-bold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                              />
                           </div>
                        </div>

                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nationality</label>
                           <div className="relative">
                              <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                              <input 
                                type="text" 
                                defaultValue={managerData.nationality}
                                className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800/50 border-none rounded-2xl text-sm font-bold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                              />
                           </div>
                        </div>

                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Date of Birth</label>
                           <div className="relative">
                              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                              <input 
                                type="text" 
                                defaultValue={managerData.dob}
                                className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800/50 border-none rounded-2xl text-sm font-bold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                              />
                           </div>
                        </div>

                        <div className="md:col-span-2 space-y-2">
                           <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Emergency Contact Protocol</label>
                           <div className="relative">
                              <Activity className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                              <input 
                                type="text" 
                                defaultValue={managerData.emergencyContact}
                                className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800/50 border-none rounded-2xl text-sm font-bold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                              />
                           </div>
                        </div>

                        <div className="md:col-span-2 space-y-2">
                           <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Residential Address</label>
                           <div className="relative">
                              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                              <textarea 
                                defaultValue={managerData.address}
                                className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800/50 border-none rounded-2xl text-sm font-bold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all min-h-[100px] resize-none"
                              />
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
                  <div className="space-y-10 animate-in fade-in slide-in-from-top-4 duration-500">
                     <div>
                       <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Security Hardening</h3>
                       <p className="text-xs text-gray-500 font-medium mt-1">Multi-layered protection for your management account</p>
                     </div>
                     
                     <div className="space-y-2">
                        <SettingRow 
                          label="Multi-Factor Auth" 
                          sub="Secure your login with biometric or TOTP tokens" 
                          icon={ShieldCheck}
                        >
                          <Toggle checked={twoFA} onChange={setTwoFA} />
                        </SettingRow>
                        
                        <SettingRow 
                          label="Login Activity Alerts" 
                          sub="Notify me on new sign-in events from unknown devices" 
                          icon={AlertTriangle}
                        >
                          <Toggle checked={loginAlerts} onChange={setLoginAlerts} />
                        </SettingRow>

                        <SettingRow 
                          label="Session Timeout" 
                          sub="Auto-logout after period of inactivity" 
                          icon={Clock}
                        >
                           <select className="bg-gray-50 dark:bg-gray-800 text-xs font-bold py-2 px-3 rounded-lg outline-none">
                             <option>30 Minutes</option>
                             <option>1 Hour</option>
                             <option>4 Hours</option>
                             <option>Never</option>
                           </select>
                        </SettingRow>
                     </div>

                     <div className="space-y-6">
                        <div className="flex items-center justify-between mb-4 px-2">
                           <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Sessions</h4>
                           <button 
                             onClick={handleRevokeAll}
                             className="text-[10px] font-black text-indigo-600 uppercase tracking-widest cursor-pointer hover:underline outline-none"
                           >
                             Revoke All
                           </button>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                           {sessions.length > 0 ? (
                             sessions.map((s) => (
                               <div key={s.id} className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800/30 rounded-3xl border border-slate-100 dark:border-slate-800/50">
                                  <div className="flex items-center gap-5">
                                     <div className="w-12 h-12 rounded-2xl bg-white dark:bg-gray-900 flex items-center justify-center text-indigo-600 shadow-sm shrink-0">
                                        <s.icon size={22} />
                                     </div>
                                     <div>
                                        <p className="text-sm font-black text-gray-900 dark:text-white">{s.device}</p>
                                        <p className="text-[10px] font-bold text-gray-400 mt-1">{s.loc}</p>
                                     </div>
                                  </div>
                                  {s.current ? (
                                     <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full uppercase tracking-widest">Current Session</span>
                                  ) : (
                                     <button 
                                       onClick={() => handleRevokeSession(s.id)}
                                       className="text-[10px] font-black text-rose-500 hover:bg-rose-500/10 px-3 py-1 rounded-full uppercase tracking-widest transition-colors outline-none"
                                     >
                                       Revoke
                                     </button>
                                  )}
                               </div>
                             ))
                           ) : (
                             <div className="p-10 text-center bg-slate-50 dark:bg-slate-800/30 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800/50">
                               <p className="text-xs font-bold text-gray-400 uppercase tracking-widest italic">No other active sessions detected</p>
                             </div>
                           )}
                        </div>
                     </div>

                     <div className="p-8 bg-indigo-50/30 dark:bg-indigo-900/10 rounded-[2.5rem] border border-indigo-100/50 dark:border-indigo-500/10 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex-1 text-center md:text-left">
                          <h5 className="font-black text-gray-900 dark:text-white uppercase tracking-widest text-xs flex items-center justify-center md:justify-start gap-2 mb-2">
                            <Lock size={14} className="text-indigo-600" /> Password Management
                          </h5>
                          <p className="text-sm text-gray-500 font-medium leading-relaxed">Regularly update your password to keep your managerial account safe.</p>
                        </div>
                        <button 
                          onClick={() => setIsPasswordModalOpen(true)}
                          className="px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-black text-sm hover:scale-[1.02] transition-all shadow-xl shrink-0"
                        >
                          Update Password
                        </button>
                     </div>
                  </div>
                )}

                {activeTab === 'notifications' && (
                  <div className="space-y-10 animate-in fade-in slide-in-from-top-4 duration-500">
                     <div>
                       <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Signal Preferences</h3>
                       <p className="text-xs text-gray-500 font-medium mt-1">Configure how you receive critical operational alerts</p>
                     </div>
                     
                     <div className="space-y-2">
                        <SettingRow 
                          label="Email Protocol" 
                          sub="Receive weekly reports and system health summaries" 
                          icon={Mail}
                        >
                          <Toggle checked={emailNotif} onChange={setEmailNotif} />
                        </SettingRow>

                        <SettingRow 
                          label="Push Alerts" 
                          sub="Real-time notifications for critical system events" 
                          icon={Bell}
                        >
                          <Toggle checked={pushNotif} onChange={setPushNotif} />
                        </SettingRow>

                        <SettingRow 
                          label="SMS Direct" 
                          sub="High-priority alerts sent directly to your mobile" 
                          icon={Smartphone}
                        >
                          <Toggle checked={smsNotif} onChange={setSmsNotif} />
                        </SettingRow>

                        <SettingRow 
                          label="Team Activity Alerts" 
                          sub="Notifications regarding subordinate task completion" 
                          icon={Activity}
                        >
                          <Toggle checked={teamAlerts} onChange={setTeamAlerts} />
                        </SettingRow>
                     </div>

                     <div className="bg-slate-50 dark:bg-white/5 rounded-[2.5rem] p-8 border border-slate-100 dark:border-white/10">
                        <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest mb-6 px-2">Quiet Hours</h4>
                        <div className="flex items-center justify-between p-6 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
                           <div className="flex items-center gap-5">
                              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 flex items-center justify-center">
                                 <Moon size={22} />
                              </div>
                              <div>
                                 <p className="text-sm font-black text-gray-900 dark:text-white">Scheduled Maintenance Mode</p>
                                 <p className="text-[10px] font-bold text-gray-400 mt-1">Mute non-priority alerts after 20:00 IST</p>
                              </div>
                           </div>
                           <Toggle checked={quietHours} onChange={setQuietHours} />
                        </div>
                     </div>
                  </div>
                )}
             </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default ManagerProfile;
