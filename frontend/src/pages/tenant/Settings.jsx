import React, { useState, useRef } from 'react';
import { Building, Lock, Globe, Save, User, Activity, Download } from 'lucide-react';

const Settings = () => {
  const [logoPreview, setLogoPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setLogoPreview(url);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-16">
      <div>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">System Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 font-medium mt-2">Configure platform instances and workspace preferences.</p>
      </div>

      <div className="space-y-8">
        {/* General Settings Section */}
        <section className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-2xl flex items-center justify-center">
              <Building size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-900 dark:text-white">General Information</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Configure your company profile and basic information.</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center gap-6">
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={handleLogoUpload} 
              />
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-24 h-24 rounded-3xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center relative group cursor-pointer border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-indigo-500 transition-colors overflow-hidden"
              >
                {logoPreview ? (
                  <img src={logoPreview} alt="Company Logo" className="w-full h-full object-cover" />
                ) : (
                  <Building size={32} className="text-gray-400 group-hover:text-indigo-500" />
                )}
                <div className="absolute inset-0 bg-indigo-600/90 rounded-3xl flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all font-bold text-center leading-tight text-[10px] uppercase tracking-widest p-2">Update Logo</div>
              </div>
              <div>
                <h3 className="text-lg font-black text-gray-900 dark:text-white">TrackForce Logistics</h3>
                <p className="text-sm font-bold text-indigo-600">Premium Account</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-50 dark:border-gray-800">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Company Name</label>
                <input 
                  type="text" 
                  defaultValue="TrackForce Logistics" 
                  className="w-full p-4 bg-gray-50 dark:bg-gray-800/50 border-none rounded-2xl font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-600 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Official Email</label>
                <input 
                  type="email" 
                  defaultValue="admin@trackforce.io" 
                  className="w-full p-4 bg-gray-50 dark:bg-gray-800/50 border-none rounded-2xl font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-600 transition-all"
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">HQ Address</label>
                <textarea 
                  rows="3"
                  defaultValue="123 Innovation Drive, Tech City, NY 10001" 
                  className="w-full p-4 bg-gray-50 dark:bg-gray-800/50 border-none rounded-2xl font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-600 transition-all resize-none"
                />
              </div>
            </div>
            
            <div className="flex justify-end pt-4">
              <button className="flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black rounded-2xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-all text-sm shadow-xl dark:shadow-none">
                <Save size={16} /> Save General Info
              </button>
            </div>
          </div>
        </section>

        {/* Security Settings Section */}
        <section className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-2xl flex items-center justify-center">
              <Lock size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-900 dark:text-white">Security & Passwords</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Manage passwords, 2FA, and authentication policies.</p>
            </div>
          </div>

          <div className="space-y-6">
             <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Current Password</label>
                <input 
                  type="password" 
                  placeholder="Enter current password"
                  className="w-full p-4 bg-gray-50 dark:bg-gray-800/50 border-none rounded-2xl font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 transition-all"
                />
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-50 dark:border-gray-800">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">New Password</label>
                  <input 
                    type="password" 
                    placeholder="Create new password"
                    className="w-full p-4 bg-gray-50 dark:bg-gray-800/50 border-none rounded-2xl font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Confirm Password</label>
                  <input 
                    type="password" 
                    placeholder="Confirm new password"
                    className="w-full p-4 bg-gray-50 dark:bg-gray-800/50 border-none rounded-2xl font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 transition-all"
                  />
                </div>
             </div>
             
             <div className="flex justify-end pt-4">
              <button className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-black rounded-2xl hover:bg-red-700 transition-all text-sm shadow-xl shadow-red-200 dark:shadow-none">
                <Save size={16} /> Update Password
              </button>
            </div>
          </div>
        </section>

        {/* Localization Section */}
        <section className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-2xl flex items-center justify-center">
              <Globe size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-900 dark:text-white">Localization & Region</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Set regional preferences, language, and timezone.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Timezone</label>
              <select className="w-full p-4 bg-gray-50 dark:bg-gray-800/50 border-none rounded-2xl font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all appearance-none cursor-pointer">
                <option value="EST">Eastern Standard Time (EST)</option>
                <option value="CST">Central Standard Time (CST)</option>
                <option value="PST">Pacific Standard Time (PST)</option>
                <option value="GMT">Greenwich Mean Time (GMT)</option>
                <option value="IST">Indian Standard Time (IST)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Language</label>
              <select className="w-full p-4 bg-gray-50 dark:bg-gray-800/50 border-none rounded-2xl font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all appearance-none cursor-pointer">
                <option value="en">English (US)</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-end pt-8">
             <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all text-sm shadow-xl shadow-blue-200 dark:shadow-none">
              <Save size={16} /> Save Localization
            </button>
          </div>
        </section>

        {/* Account Settings Section */}
        <section className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-2xl flex items-center justify-center">
              <User size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-900 dark:text-white">Account Settings</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Manage account status, feature flags, and data exports.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-gray-50 dark:border-gray-800">
             <div className="space-y-4 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border border-transparent hover:border-indigo-200 transition-colors">
               <div className="flex items-center gap-4">
                 <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-xl">
                    <Activity size={20} />
                 </div>
                 <div>
                   <h3 className="font-bold text-gray-900 dark:text-white">Active Sessions</h3>
                   <p className="text-xs text-gray-500">Manage devices logged into your account.</p>
                 </div>
               </div>
               <button className="w-full py-3 bg-white dark:bg-gray-800 text-indigo-600 font-bold rounded-2xl border border-indigo-100 dark:border-indigo-800 shadow-sm hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all">Sign Out All Devices</button>
             </div>
             
             <div className="space-y-4 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border border-transparent hover:border-emerald-200 transition-colors">
               <div className="flex items-center gap-4">
                 <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-xl">
                    <Download size={20} />
                 </div>
                 <div>
                   <h3 className="font-bold text-gray-900 dark:text-white">Data Export</h3>
                   <p className="text-xs text-gray-500">Download a complete backup of workspace data.</p>
                 </div>
               </div>
               <button className="w-full py-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 font-bold rounded-2xl border border-transparent shadow-sm hover:bg-emerald-600 hover:text-white transition-all">Request Data Export</button>
             </div>
          </div>

          <div className="flex justify-end pt-6">
             <button className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-black rounded-2xl hover:bg-emerald-700 transition-all text-sm shadow-xl shadow-emerald-200 dark:shadow-none">
              <Save size={16} /> Save Account Preferences
             </button>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Settings;
