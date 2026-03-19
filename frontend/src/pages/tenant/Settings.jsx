import React from 'react';
import { User, Building, Lock, Globe, Bell, Palette, Save } from 'lucide-react';

const Settings = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">System Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 font-medium">Configure your platform instance and company profile.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Navigation Sidebar */}
        <div className="w-full md:w-64 space-y-2">
          {[
            { label: 'General', icon: Building, active: true },
            { label: 'Security', icon: Lock, active: false },
            { label: 'Localization', icon: Globe, active: false },
            { label: 'Appearance', icon: Palette, active: false },
            { label: 'Preferences', icon: Bell, active: false },
          ].map((item, i) => (
            <button key={i} className={`w-full p-4 rounded-2xl flex items-center gap-3 font-bold text-sm transition-all ${
              item.active 
                ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100 dark:shadow-none' 
                : 'text-gray-400 hover:bg-white dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-white'
            }`}>
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 space-y-6">
          <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-8">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-3xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center relative group cursor-pointer border-2 border-dashed border-gray-300 dark:border-gray-700">
                <Building size={32} className="text-gray-400" />
                <div className="absolute inset-0 bg-indigo-600/80 rounded-3xl flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all font-bold text-xs uppercase tracking-widest">Update Logo</div>
              </div>
              <div>
                <h3 className="text-lg font-black text-gray-900 dark:text-white">TrackForce Logistics</h3>
                <p className="text-sm font-bold text-indigo-600">Premium Account</p>
                <p className="text-xs text-gray-400 font-medium mt-1 uppercase tracking-widest">Member since Jan 2026</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t border-gray-50 dark:border-gray-800">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Company Name</label>
                <input 
                  type="text" 
                  defaultValue="TrackForce Logistics" 
                  className="w-full p-3 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-600 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Official Email</label>
                <input 
                  type="email" 
                  defaultValue="admin@trackforce.io" 
                  className="w-full p-3 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-600 transition-all"
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">HQ Address</label>
                <textarea 
                  rows="3"
                  defaultValue="123 Innovation Drive, Tech City, NY 10001" 
                  className="w-full p-4 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-600 transition-all resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end pt-8">
              <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-100 dark:shadow-none transition-all">
                <Save size={18} />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
