import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
  RefreshCw,
  Eye,
  EyeOff,
  Activity,
  BarChart,
  HardDrive,
  AlertCircle
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import Button from '../../components/Button';
import superadminService from '../../services/superadminService';

const Settings = () => {
  const [activeSection, setActiveSection] = useState('General');
  const [settings, setSettings] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [settingsData, analyticsData] = await Promise.all([
        superadminService.getSettings(),
        superadminService.getDatabaseAnalytics()
      ]);
      setSettings(settingsData);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error fetching initial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    setLoading(true);
    await fetchInitialData();
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await superadminService.updateSettings(settings);
      alert('Settings saved successfully!');
    } catch (error) {
      alert('Error saving settings: ' + error.message);
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

  const sections = [
    { id: 'General', icon: Globe, label: 'General Configuration' },
    { id: 'Integrations', icon: Cpu, label: 'API & Integrations' },
    { id: 'Mobile', icon: Smartphone, label: 'Mobile App Settings' },
    { id: 'Storage', icon: BarChart, label: 'Database Analytics' },
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

      <div className="flex flex-col gap-10">
        {/* Horizontal Nav Row */}
        <div className="flex flex-wrap items-center gap-3 p-2 bg-gray-50 dark:bg-gray-800/50 rounded-[2rem] border border-gray-100 dark:border-gray-800">
          {sections.map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center gap-3 px-6 py-3.5 rounded-[1.5rem] font-black text-sm transition-all duration-300 ${activeSection === section.id
                  ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100 dark:shadow-none scale-[1.02]'
                  : 'text-gray-400 hover:bg-white dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-white'
                }`}
            >
              <section.icon size={18} />
              <span className="uppercase tracking-widest text-[10px] whitespace-nowrap">{section.label}</span>
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
                        onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
                        className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Default Platform Currency</label>
                      <select
                        value={settings.currency}
                        onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
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
                        onClick={() => setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })}
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
                        onClick={() => setSettings({ ...settings, globalNotifications: !settings.globalNotifications })}
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
                        <div className="flex items-center gap-4">
                          <div className="relative flex-1 flex items-center">
                            <Lock className="absolute left-4 text-gray-400" size={16} />
                            <input
                              type={showApiKey ? 'text' : 'password'}
                              value={settings.integrations.googleMaps.apiKey || ''}
                              onChange={(e) => updateNestedSetting('integrations.googleMaps.apiKey', e.target.value)}
                              className="w-full pl-12 pr-20 py-4 bg-gray-50 dark:bg-gray-800/50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500/20"
                              placeholder="Enter your Google Maps API Key"
                            />
                            <button
                              onClick={() => setShowApiKey(!showApiKey)}
                              className="absolute right-4 text-indigo-600 text-[10px] font-black uppercase hover:underline flex items-center gap-1"
                            >
                              {showApiKey ? <EyeOff size={14} /> : <Eye size={14} />}
                              {showApiKey ? 'Hide' : 'Reveal'}
                            </button>
                          </div>
                          <Button
                            onClick={handleSave}
                            disabled={saving}
                            variant="primary"
                            className="rounded-2xl py-4 h-full px-8 flex items-center gap-2"
                          >
                            {saving ? <RefreshCw className="animate-spin" size={16} /> : <Zap size={16} />}
                            <span className="text-[10px] font-black uppercase tracking-widest">Connect Key</span>
                          </Button>
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

              {activeSection === 'Mobile' && (
                <div className="relative overflow-hidden rounded-[2rem] p-10 border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 min-h-[400px] flex flex-col items-center justify-center text-center">
                  <div className="absolute inset-0 bg-white/40 dark:bg-black/40 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center p-10">
                    <div className="p-6 bg-white dark:bg-gray-900 rounded-full shadow-2xl mb-8 scale-125 animate-bounce">
                      <Smartphone size={48} className="text-indigo-600" />
                    </div>
                    <div className="max-w-md">
                      <h3 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-4">Mobile Hub Coming Soon</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 font-bold italic leading-relaxed">
                        We are currently engineering the TrackForce Mobile App. Native iOS and Android configuration modules will be deployed in the next major patch.
                      </p>
                      <div className="mt-8 flex items-center gap-3 justify-center">
                        <span className="px-4 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 text-[10px] font-black uppercase tracking-widest">Version 2.0 Feature</span>
                        <span className="px-4 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 text-[10px] font-black uppercase tracking-widest">In Development</span>
                      </div>
                    </div>
                  </div>

                  {/* Blurred Background Content for Preview Effect */}
                  <div className="w-full opacity-20 filter blur-sm space-y-6 pointer-events-none">
                    <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded-xl w-3/4 mx-auto"></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="h-24 bg-gray-200 dark:bg-gray-800 rounded-2xl"></div>
                      <div className="h-24 bg-gray-200 dark:bg-gray-800 rounded-2xl"></div>
                    </div>
                    <div className="h-20 bg-gray-200 dark:bg-gray-800 rounded-2xl w-full"></div>
                  </div>
                </div>
              )}

              {activeSection === 'Storage' && analytics && (
                <div className="space-y-10 animate-in fade-in duration-500">
                  {/* Storage Command Center (Mini-Dash Compact View) */}
                  <div className="bg-gray-900 rounded-[2rem] p-6 text-white shadow-2xl relative overflow-hidden border border-gray-800">
                    <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none translate-x-5 -translate-y-5">
                      <Database size={200} className="rotate-12" />
                    </div>

                    <div className="relative z-10 flex flex-col gap-6">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="p-3 bg-indigo-600/20 backdrop-blur-md rounded-xl border border-indigo-500/20 text-indigo-400">
                            <HardDrive size={20} />
                          </div>
                          <div>
                            <h3 className="text-base font-black uppercase tracking-widest mb-0.5">Storage Command</h3>
                            <p className="text-[8px] text-gray-500 font-bold uppercase tracking-widest italic">Live Resource Telemetry</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="px-3 py-1.5 bg-gray-800/80 rounded-lg border border-gray-700 flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></div>
                            <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400">Link Active</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                        <div className="lg:col-span-12 space-y-4">
                          <div className="flex items-end gap-2.5">
                            <span className="text-5xl font-black tracking-tighter leading-none bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent">{analytics.storageMetrics.used}</span>
                            <div className="mb-0.5">
                              <p className="text-base font-black uppercase tracking-widest text-indigo-400 leading-none mb-0.5">GB Used</p>
                              <p className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">Cap: {analytics.storageMetrics.total}GB</p>
                            </div>
                          </div>

                          <div className="space-y-2.5">
                            <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden p-0.5 border border-gray-700">
                              <div
                                className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(79,70,229,0.3)]"
                                style={{ width: `${analytics.storageMetrics.percentUsed}%` }}
                              />
                            </div>
                            <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-gray-600 px-1">
                              <span>Relational: 2.4GB</span>
                              <span>Media: {analytics.storageMetrics.used - 2.4}GB</span>
                              <span className="text-indigo-400/80">{analytics.storageMetrics.percentUsed}% Capacity</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-6 border-t border-gray-800/50">
                        <div className="p-4 rounded-xl bg-gray-800/30 border border-gray-700/30 text-center">
                          <p className="text-[8px] font-black uppercase tracking-widest text-gray-500 mb-1">Remaining</p>
                          <p className="text-xl font-black text-indigo-400">{analytics.storageMetrics.remaining}GB</p>
                        </div>
                        <div className="p-4 rounded-xl bg-gray-800/30 border border-gray-700/30 text-center">
                          <p className="text-[8px] font-black uppercase tracking-widest text-gray-500 mb-1">Integrity</p>
                          <p className="text-sm font-black uppercase tracking-tighter flex items-center justify-center gap-1.5 text-emerald-400">
                            <Zap size={14} /> Healthy
                          </p>
                        </div>
                        <div className="p-4 rounded-xl bg-gray-800/30 border border-gray-700/30 text-center">
                          <p className="text-[8px] font-black uppercase tracking-widest text-gray-500 mb-1">IO Status</p>
                          <p className="text-sm font-black uppercase tracking-tighter text-amber-500">Optimal</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stats Grid (Secondary) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { label: 'Total Database Objects', value: analytics.counts.users.total + analytics.counts.auditLogs, icon: Database, color: 'indigo' },
                      { label: 'Cloud Network Uptime', value: analytics.uptime, icon: Cpu, color: 'amber' },
                    ].map((stat, i) => (
                      <div key={i} className="bg-gray-50 dark:bg-gray-800/50 p-8 rounded-[2.5rem] border border-transparent hover:border-gray-100 dark:hover:border-gray-700 transition-all flex items-center gap-6">
                        <div className={`p-4 rounded-2xl bg-${stat.color}-50 dark:bg-${stat.color}-900/20 text-${stat.color}-600`}>
                          <stat.icon size={24} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
                          <p className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter uppercase">{stat.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Charts Row */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Storage Growth Area Chart */}
                    <div className="bg-gray-50 dark:bg-gray-800/30 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800">
                      <div className="flex items-center justify-between mb-8">
                        <div>
                          <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">Growth Analytics</h4>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Platform Expansion (GB)</p>
                        </div>
                        <div className="p-3 bg-white dark:bg-gray-900 rounded-2xl shadow-sm text-indigo-500">
                          <HardDrive size={20} />
                        </div>
                      </div>
                      <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={analytics.storageGrowth}>
                            <defs>
                              <linearGradient id="colorSize" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" opacity={0.5} />
                            <XAxis
                              dataKey="month"
                              axisLine={false}
                              tickLine={false}
                              tick={{ fontSize: 10, fontWeight: 900, fill: '#9CA3AF' }}
                              dy={10}
                            />
                            <YAxis
                              axisLine={false}
                              tickLine={false}
                              tick={{ fontSize: 10, fontWeight: 900, fill: '#9CA3AF' }}
                              dx={-10}
                            />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: '#FFF',
                                borderRadius: '16px',
                                border: 'none',
                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                padding: '12px'
                              }}
                              labelStyle={{ fontWeight: 900, marginBottom: '4px', fontSize: '12px' }}
                              itemStyle={{ color: '#4f46e5', fontWeight: 900, fontSize: '10px', textTransform: 'uppercase' }}
                            />
                            <Area type="monotone" dataKey="size" stroke="#4f46e5" strokeWidth={4} fillOpacity={1} fill="url(#colorSize)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* User Distribution Pie Chart */}
                    <div className="bg-gray-50 dark:bg-gray-800/30 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800">
                      <div className="flex items-center justify-between mb-8">
                        <div>
                          <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">User distribution</h4>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Platform Account Segmentation</p>
                        </div>
                        <div className="p-3 bg-white dark:bg-gray-900 rounded-2xl shadow-sm text-emerald-500">
                          <Layout size={20} />
                        </div>
                      </div>
                      <div className="h-64 w-full flex items-center justify-center relative">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={[
                                { name: 'Tenants', value: analytics.counts.users.tenant },
                                { name: 'Managers', value: analytics.counts.users.manager },
                                { name: 'Employees', value: analytics.counts.users.employee },
                              ]}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={8}
                              dataKey="value"
                            >
                              {[
                                { color: '#4f46e5' }, // indigo
                                { color: '#10b981' }, // emerald
                                { color: '#f59e0b' }, // amber
                              ].map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                              ))}
                            </Pie>
                            <Tooltip
                              contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                              itemStyle={{ fontWeight: 900, fontSize: '10px', textTransform: 'uppercase' }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute flex flex-col items-center">
                          <span className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter">{analytics.counts.users.total}</span>
                          <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Active</span>
                        </div>
                      </div>
                      <div className="flex justify-center gap-6 mt-4">
                        {[
                          { label: 'Tenants', color: 'bg-indigo-600' },
                          { label: 'Managers', color: 'bg-emerald-500' },
                          { label: 'Employees', color: 'bg-amber-500' }
                        ].map(item => (
                          <div key={item.label} className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${item.color}`} />
                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{item.label}</span>
                          </div>
                        ))}
                      </div>
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
