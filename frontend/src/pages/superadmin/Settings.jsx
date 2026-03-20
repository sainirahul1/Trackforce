import React, { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, 
  Globe, 
  Map, 
  Shield, 
  Mail, 
  Database, 
  Smartphone,
  Check,
  Save,
  Lock,
  Zap,
  Layout,
  Cpu,
  RefreshCw
} from 'lucide-react';
import Button from '../../components/Button';
import superadminService from '../../services/superadminService';

const Settings = () => {
  const [activeSection, setActiveSection] = useState('General');
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const data = await superadminService.getSettings();
      setSettings(data);
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await superadminService.updateSettings(settings);
      alert('Settings saved successfully!');
    } catch (error) {
      const serverMsg = error.response?.data?.message || '';
      alert(`Error saving settings: ${error.message} \nServer said: ${serverMsg}`);
    } finally {
      setSaving(false);
    }
  };

  const updateNestedSetting = (path, value) => {
    const newSettings = { ...settings };
    const keys = path.split('.');
    let last = newSettings;
    for (let i = 0; i < keys.length - 1; i++) {
      last = last[keys[i]];
    }
    last[keys[keys.length - 1]] = value;
    setSettings(newSettings);
  };

  const updateToggle = async (key, currentValue) => {
    const newValue = !currentValue;
    const newSettings = { ...settings, [key]: newValue };
    setSettings(newSettings);
    
    setSaving(true);
    try {
      await superadminService.updateSettings(newSettings);
    } catch (error) {
      const serverMsg = error.response?.data?.message || '';
      alert(`Error auto-saving settings: ${error.message} \nServer said: ${serverMsg}`);
      setSettings(settings); // Revert on error
    } finally {
      setSaving(false);
    }
  };

  const sections = [
    { id: 'General', icon: Globe, label: 'General Configuration' },
    { id: 'Integrations', icon: Cpu, label: 'API & Integrations' },
    { id: 'Security', icon: Shield, label: 'Security & Auth' },
    { id: 'Mobile', icon: Smartphone, label: 'Mobile App Settings' },
    { id: 'Storage', icon: Database, label: 'Data & Storage' },
  ];

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-20 text-center">
      <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-6"></div>
      <p className="font-black text-gray-900 dark:text-white uppercase tracking-[0.3em] animate-pulse">Initializing System Engine...</p>
    </div>
  );

  if (!settings) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-20 text-center space-y-6">
      <div className="p-6 bg-rose-50 dark:bg-rose-500/10 rounded-3xl text-rose-500 shadow-sm border border-rose-100 dark:border-rose-500/20">
        <Database size={48} strokeWidth={1.5} />
      </div>
      <div>
        <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-wider">System Link Failure</h3>
        <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium italic">Unable to retrieve global configuration from the core database.</p>
      </div>
      <Button onClick={fetchSettings} variant="primary" className="rounded-2xl py-3 px-8 flex items-center gap-2">
        <RefreshCw size={18} />
        <span className="font-bold">Retry Connection</span>
      </Button>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600 rounded-2xl text-white shadow-lg rotate-6">
               <SettingsIcon size={28} />
            </div>
            Global Platform Settings
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium italic">Configure core platform behavior, API keys, and system-wide defaults.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-2xl py-3 px-6 text-xs font-black uppercase tracking-widest flex items-center gap-2">
            <RefreshCw size={16} />
            Reset Defaults
          </Button>
          <Button onClick={handleSave} disabled={saving} variant="primary" className="rounded-2xl py-3 px-8 shadow-xl shadow-indigo-100 dark:shadow-none flex items-center gap-2">
            {saving ? <RefreshCw className="animate-spin" size={18} /> : <Save size={18} />}
            <span className="font-bold">{saving ? 'Syncing...' : 'Save All Changes'}</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Sidebar Nav */}
        <div className="lg:w-72 shrink-0 space-y-2">
          {sections.map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-[1.5rem] font-black text-sm transition-all duration-300 ${
                activeSection === section.id 
                  ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100 dark:shadow-none translate-x-1' 
                  : 'text-gray-400 hover:bg-white dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-white border border-transparent hover:border-gray-100 dark:hover:border-gray-800'
              }`}
            >
              <section.icon size={20} />
              <span className="uppercase tracking-widest text-[11px]">{section.label}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 space-y-8 pb-20">
          <div className="bg-white dark:bg-gray-900 p-8 sm:p-10 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden group">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
              <Cpu size={160} className="text-indigo-500 rotate-12" />
            </div>

            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-8 border-b border-gray-50 dark:border-gray-800 pb-6 flex items-center gap-3">
              <Zap size={24} className="text-amber-500" />
              {activeSection} Settings
            </h2>

            <div className="space-y-10 max-w-3xl">
              {activeSection === 'General' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Platform Name</label>
                      <input 
                        type="text" 
                        value={settings.platformName} 
                        onChange={(e) => setSettings({...settings, platformName: e.target.value})}
                        className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Default Platform Currency</label>
                      <select 
                        value={settings.currency}
                        onChange={(e) => setSettings({...settings, currency: e.target.value})}
                        className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all appearance-none cursor-pointer"
                      >
                        <option value="USD">USD ($)</option>
                        <option value="INR">INR (₹)</option>
                        <option value="EUR">EUR (€)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-6 bg-gray-50 dark:bg-gray-800/30 rounded-3xl border border-transparent hover:border-indigo-100 dark:hover:border-indigo-500/20 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-white dark:bg-gray-900 rounded-2xl shadow-sm text-indigo-500">
                          <Layout size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest leading-tight">Maintenance Mode</p>
                          <p className="text-xs text-gray-400 font-medium mt-0.5">Disables access for all non-admin users across the platform.</p>
                        </div>
                      </div>
                      <div 
                        onClick={() => updateToggle('maintenanceMode', settings.maintenanceMode)}
                        className={`relative w-12 h-6 rounded-full cursor-pointer transition-colors p-1 ${settings.maintenanceMode ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'}`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${settings.maintenanceMode ? 'translate-x-6' : 'translate-x-0'}`}></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-6 bg-gray-50 dark:bg-gray-800/30 rounded-3xl border border-transparent hover:border-emerald-100 dark:hover:border-emerald-500/20 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-white dark:bg-gray-900 rounded-2xl shadow-sm text-emerald-500">
                          <Mail size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest leading-tight">Enable Global Email Notifications</p>
                          <p className="text-xs text-gray-400 font-medium mt-0.5">Allows platform to send welcome emails and daily reports automatically.</p>
                        </div>
                      </div>
                      <div 
                        onClick={() => updateToggle('globalNotifications', settings.globalNotifications)}
                        className={`relative w-12 h-6 rounded-full cursor-pointer transition-colors p-1 ${settings.globalNotifications ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-gray-700'}`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${settings.globalNotifications ? 'translate-x-6' : 'translate-x-0'}`}></div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {activeSection === 'Integrations' && (
                <div className="space-y-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                       <Map className="text-indigo-500" size={20} />
                       <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">Google Maps Integration</h4>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Maps JavaScript API Key</label>
                        <div className="relative flex items-center">
                          <Lock className="absolute left-4 text-gray-400" size={16} />
                          <input type="password" value="********************************" className="w-full pl-12 pr-12 py-4 bg-gray-50 dark:bg-gray-800/50 border-none rounded-2xl text-sm font-bold outline-none" />
                          <button className="absolute right-4 text-indigo-600 text-[10px] font-black uppercase hover:underline">Reveal</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-indigo-50 dark:bg-indigo-500/10 rounded-3xl border border-indigo-100 dark:border-indigo-500/20">
                     <div className="flex items-center gap-4">
                        <div className="p-3 bg-white dark:bg-gray-900 rounded-2xl shadow-sm text-indigo-500">
                           <RefreshCw size={20} className="animate-spin-slow" />
                        </div>
                        <div className="flex-1">
                           <p className="text-sm font-black text-indigo-900 dark:text-indigo-200 uppercase tracking-widest mb-1 italic">API Sync Status: Active</p>
                           <p className="text-[11px] text-indigo-600/70 dark:text-indigo-400/70 font-medium">Last automated sync attempt: 12 minutes ago. All background processes are responding correctly.</p>
                        </div>
                     </div>
                  </div>
                </div>
              )}

              {/* Security Tab (Simplified) */}
              {activeSection === 'Security' && (
                <div className="space-y-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Password Complexity Policy</label>
                      <div className="grid grid-cols-2 gap-4">
                         {['Uppercase', 'Symbols', 'Min. 8 Chars', 'Numbers'].map(rule => (
                           <div key={rule} className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                             <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                                <Check size={12} strokeWidth={4} />
                             </div>
                             <span className="text-xs font-black text-gray-600 dark:text-gray-300 uppercase tracking-widest">{rule}</span>
                           </div>
                         ))}
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

export default Settings;
