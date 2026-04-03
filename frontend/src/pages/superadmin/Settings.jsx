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
  AlertCircle,
  AlertTriangle,
  ChevronDown
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
import Button from '../../components/ui/Button';
import Skeleton from '../../components/ui/Skeleton';
import superadminService from '../../services/superadmin/superadminService';

const Settings = () => {
  const [activeSection, setActiveSection] = useState('General');
  const [settings, setSettings] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [duplicates, setDuplicates] = useState([]);
  const [loadingDuplicates, setLoadingDuplicates] = useState(false);
  const [dupField, setDupField] = useState('email');
  const [customPath, setCustomPath] = useState('');
  const [selectedDups, setSelectedDups] = useState([]);
  const [cleaning, setCleaning] = useState(false);
  const [isDupScanOpen, setIsDupScanOpen] = useState(false);

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

  const fetchDuplicates = async (field) => {
    setLoadingDuplicates(true);
    try {
      const data = await superadminService.getDuplicates(field || dupField, customPath);
      setDuplicates(data);
    } catch (error) {
      console.error('Error fetching duplicates:', error);
    } finally {
      setLoadingDuplicates(false);
    }
  };

  const [showPurgeModal, setShowPurgeModal] = useState(false);

  const handleCleanup = async () => {
    if (selectedDups.length === 0) return;

    setCleaning(true);
    setShowPurgeModal(false); // Close modal before starting
    try {
      // Group selected IDs by collection
      const grouped = selectedDups.reduce((acc, item) => {
        if (!acc[item.source]) acc[item.source] = [];
        acc[item.source].push(item.id);
        return acc;
      }, {});

      // Execute cleanup for each collection
      for (const [source, ids] of Object.entries(grouped)) {
        await superadminService.cleanupDuplicates(ids, source);
      }

      setSelectedDups([]);
      fetchDuplicates();
      fetchInitialData(); // Refresh counts
    } catch (error) {
      alert(`Cleanup failed: ${error.message}`);
    } finally {
      setCleaning(false);
    }
  };

  const toggleDupSelection = (id, source) => {
    setSelectedDups(prev => {
      const isSelected = prev.some(item => item.id === id);
      if (isSelected) {
        return prev.filter(item => item.id !== id);
      } else {
        return [...prev, { id, source }];
      }
    });
  };

  const sections = [
    { id: 'General', icon: Globe, label: 'General Configuration' },
    { id: 'Integrations', icon: Cpu, label: 'API & Integrations' },
    { id: 'Mobile', icon: Smartphone, label: 'Mobile App Settings' },
    { id: 'Storage', icon: BarChart, label: 'Database Analytics' },
  ];

  // Removed early return for loading spinner to implement "Pure Skeleton" loading
  // if (loading) return (...)

  if (!settings && !loading) return (
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
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-80 uppercase tracking-tight" />
            <Skeleton className="h-4 w-[32rem] font-medium" />
          </div>
        ) : (
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
              <div className="p-2.5 bg-indigo-600 rounded-2xl text-white shadow-lg rotate-6">
                <SettingsIcon size={28} />
              </div>
              Global Platform Settings
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium italic">Configure core platform behavior, API keys, and system-wide defaults.</p>
          </div>
        )}
        <div className="flex items-center gap-3">
          {loading ? (
            <>
              <Skeleton className="h-12 w-40 rounded-2xl" />
              <Skeleton className="h-12 w-48 rounded-2xl" />
            </>
          ) : (
            <>
              <Button variant="outline" className="rounded-2xl py-3 px-6 text-xs font-black uppercase tracking-widest flex items-center gap-2">
                <RefreshCw size={16} />
                Reset Defaults
              </Button>
              <Button onClick={handleSave} disabled={saving} variant="primary" className="rounded-2xl py-3 px-8 shadow-xl shadow-indigo-100 dark:shadow-none flex items-center gap-2">
                {saving ? <RefreshCw className="animate-spin" size={18} /> : <Save size={18} />}
                <span className="font-bold">{saving ? 'Syncing...' : 'Save All Changes'}</span>
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-10">
        {/* Horizontal Nav Row */}
        <div className="flex flex-wrap items-center gap-3 p-2 bg-gray-50 dark:bg-gray-800/50 rounded-[2rem] border border-gray-100 dark:border-gray-800">
          {loading ? (
            <div className="flex items-center gap-2 px-2">
              <Skeleton className="h-12 w-44 rounded-[1.5rem]" />
              <Skeleton className="h-12 w-40 rounded-[1.5rem]" />
              <Skeleton className="h-12 w-48 rounded-[1.5rem]" />
              <Skeleton className="h-12 w-44 rounded-[1.5rem]" />
            </div>
          ) : (
            sections.map(section => (
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
            ))
          )}
        </div>

        {/* Content Area */}
        <div className="flex-1 space-y-8 pb-20">
          <div className="bg-white dark:bg-gray-900 p-8 sm:p-10 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden group">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
              <Cpu size={160} className="text-indigo-500 rotate-12" />
            </div>

            {loading ? (
              <Skeleton className="h-8 w-64 mb-10 pb-6 border-b border-gray-50 dark:border-gray-800" />
            ) : (
              <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-8 border-b border-gray-50 dark:border-gray-800 pb-6 flex items-center gap-3">
                <Zap size={24} className="text-amber-500" />
                {activeSection} Settings
              </h2>
            )}

            <div className="space-y-10 max-w-3xl">
              {activeSection === 'General' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      {loading ? (
                        <Skeleton className="h-3 w-24 ml-1 mb-1" />
                      ) : (
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Platform Name</label>
                      )}
                      {loading ? (
                        <Skeleton className="h-[52px] w-full rounded-2xl" />
                      ) : (
                        <input
                          type="text"
                          value={settings.platformName}
                          onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
                          className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                        />
                      )}
                    </div>
                    <div className="space-y-2">
                      {loading ? (
                        <Skeleton className="h-3 w-32 ml-1 mb-1" />
                      ) : (
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Default Platform Currency</label>
                      )}
                      {loading ? (
                        <Skeleton className="h-[52px] w-full rounded-2xl" />
                      ) : (
                        <select
                          value={settings.currency}
                          onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                          className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all appearance-none cursor-pointer"
                        >
                          <option value="USD">USD ($)</option>
                          <option value="INR">INR (₹)</option>
                          <option value="EUR">EUR (€)</option>
                        </select>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    {[
                      { id: 'maintenanceMode', label: 'Maintenance Mode', desc: 'Disables access for all non-admin users across the platform.', icon: Layout, color: 'indigo' },
                      { id: 'globalNotifications', label: 'Enable Global Email Notifications', desc: 'Allows platform to send welcome emails and daily reports automatically.', icon: Mail, color: 'emerald' }
                    ].map(item => (
                      <div key={item.id} className={`flex items-center justify-between p-6 bg-gray-50 dark:bg-gray-800/30 rounded-3xl border border-transparent hover:border-${item.color}-100 dark:hover:border-${item.color}-500/20 transition-all`}>
                        <div className="flex items-center gap-4">
                          {loading ? (
                            <Skeleton variant="rounded" className="w-11 h-11" />
                          ) : (
                            <div className={`p-3 bg-white dark:bg-gray-900 rounded-2xl shadow-sm text-${item.color}-500`}>
                              <item.icon size={20} />
                            </div>
                          )}
                          <div className="space-y-1.5 flex-1">
                            {loading ? (
                              <>
                                <Skeleton className="h-4 w-40" />
                                <Skeleton className="h-3 w-64" />
                              </>
                            ) : (
                              <>
                                <p className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest leading-tight">{item.label}</p>
                                <p className="text-xs text-gray-400 font-medium mt-0.5">{item.desc}</p>
                              </>
                            )}
                          </div>
                        </div>
                        {loading ? (
                          <Skeleton className="w-12 h-6 rounded-full" />
                        ) : (
                          <div
                            onClick={() => updateToggle(item.id, settings[item.id])}
                            className={`relative w-12 h-6 rounded-full cursor-pointer transition-colors p-1 ${settings[item.id] ? (item.color === 'indigo' ? 'bg-indigo-600' : 'bg-emerald-500') : 'bg-gray-200 dark:bg-gray-700'}`}
                          >
                            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${settings[item.id] ? 'translate-x-6' : 'translate-x-0'}`}></div>
                          </div>
                        )}
                      </div>
                    ))}
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
                        {loading ? (
                          <Skeleton className="h-3 w-36 ml-1 mb-1" />
                        ) : (
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Maps JavaScript API Key</label>
                        )}
                        <div className="flex items-center gap-4">
                          <div className="relative flex-1 flex items-center">
                            {loading ? (
                              <Skeleton className="h-[56px] w-full rounded-2xl" />
                            ) : (
                              <>
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
                              </>
                            )}
                          </div>
                          {loading ? (
                            <Skeleton className="h-[56px] w-36 rounded-2xl" />
                          ) : (
                            <Button
                              onClick={handleSave}
                              disabled={saving}
                              variant="primary"
                              className="rounded-2xl py-4 h-full px-8 flex items-center gap-2"
                            >
                              {saving ? <RefreshCw className="animate-spin" size={16} /> : <Zap size={16} />}
                              <span className="text-[10px] font-black uppercase tracking-widest">Connect Key</span>
                            </Button>
                          )}
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
                        <p className="text-sm font-black text-indigo-900 dark:text-indigo-200 uppercase tracking-widest mb-1 italic">API Sync Status: Operational</p>
                        <p className="text-[11px] text-indigo-600/70 dark:text-indigo-400/70 font-medium">Background services are responding correctly. Real-time synchronization is active.</p>
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
                <div className="space-y-10 animate-in fade-in duration-700">
                  {/* Storage Command Center */}
                  <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 text-gray-900 dark:text-white shadow-2xl relative overflow-hidden border border-gray-100 dark:border-gray-800 transition-all duration-500">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none translate-x-10 -translate-y-10">
                      <Database size={280} className="rotate-12 text-indigo-500" />
                    </div>

                    <div className="relative z-10 flex flex-col gap-8">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-gray-50 dark:border-gray-800">
                        <div className="flex items-center gap-4">
                          <div className="p-4 bg-indigo-600 rounded-2xl text-white shadow-xl shadow-indigo-100 dark:shadow-none">
                            <HardDrive size={24} />
                          </div>
                          <div>
                            <h3 className="text-xl font-black uppercase tracking-tighter mb-0.5">Storage Master Control</h3>
                            <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-black uppercase tracking-[0.2em] italic">Real-Time Core Telemetry</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {!loading && (
                            <div className="px-4 py-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl border border-emerald-100 dark:border-emerald-500/20 flex items-center gap-2.5">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse ring-4 ring-emerald-500/20"></div>
                              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">System Link: Active</span>
                            </div>
                          )}
                          <Button
                            onClick={fetchInitialData}
                            variant="outline"
                            className="p-2.5 h-11 w-11 rounded-xl border-gray-100 dark:border-gray-700 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                            title="Purge Cache & Sync"
                          >
                            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                        <div className="lg:col-span-12 space-y-8">
                          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
                            <div className="flex items-end gap-4 overflow-hidden">
                              <div className="flex flex-col items-start gap-1">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500/60 dark:text-indigo-400/40 ml-1">Used Data</span>
                                <div className="flex items-baseline gap-2">
                                  <span className="text-6xl md:text-7xl font-black tracking-tighter leading-tight bg-gradient-to-br from-gray-900 via-indigo-900 to-indigo-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                                    {(analytics.storageMetrics.used * 1024).toFixed(2)}
                                  </span>
                                  <span className="text-2xl font-black opacity-60 text-indigo-600 dark:text-indigo-400 mb-2">MB</span>
                                </div>
                              </div>
                              <div className="mb-2 min-w-fit">
                                <p className="text-base md:text-lg font-black uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400 leading-tight mb-1">DATA CONSUMPTION</p>
                                <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest leading-none">Global Cap: 512MB (Standard Tier)</p>
                              </div>
                            </div>
                            <div className="text-left sm:text-right w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-gray-100 dark:border-gray-800">
                              <p className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter leading-none">{analytics.storageMetrics.percentUsed}%</p>
                              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mt-1">System Load</p>
                            </div>
                          </div>


                          <div className="space-y-4">
                            <div className="relative">
                              <div className="h-4 w-full bg-gray-50 dark:bg-gray-800/80 rounded-full overflow-hidden p-1 border border-gray-100 dark:border-gray-700 shadow-inner">
                                <div
                                  className="h-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-400 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(79,70,229,0.4)] relative"
                                  style={{ width: `${analytics.storageMetrics.percentUsed}%` }}
                                >
                                  <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.2)_50%,transparent_100%)] animate-shimmer" />
                                </div>
                              </div>
                              <div className="flex justify-between mt-2 px-1">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">0 MB</span>
                                <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest leading-none">512 MB TOTAL</span>
                              </div>
                            </div>
                          </div>


                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-6 mt-2">
                        {[
                          { label: 'Remaining', value: `${Math.round(analytics.storageMetrics.remaining * 1024)}MB`, color: 'indigo', sub: 'Available Block' },
                          { label: 'Integrity', value: analytics.integrityStatus || 'Healthy', color: 'emerald', icon: Shield, sub: 'Record Validation' },
                          { label: 'IO Status', value: analytics.ioStatus || 'Optimal', color: 'indigo', icon: Activity, sub: 'Latency Index' },
                          { label: 'Uptime', value: analytics.uptime || '100%', color: 'indigo', sub: `${analytics.nodeAvailability || 'Active'} Node Availability` }
                        ].map((stat, i) => (
                          <div key={i} className="p-5 rounded-2xl bg-gray-50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-700/30 hover:shadow-lg transition-all group/stat">
                            <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1 group-hover/stat:text-indigo-500 transition-colors">{stat.label}</p>
                            <p className={`text-lg text-${stat.color}-600 dark:text-${stat.color}-400 font-black uppercase tracking-tighter flex items-center gap-2`}>
                              {stat.icon && <stat.icon size={16} />}
                              {stat.value}
                            </p>
                            <p className="text-[8px] font-bold text-gray-300 dark:text-gray-600 uppercase tracking-widest mt-1 italic">{stat.sub}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Role-Based Distribution & Inventory Row */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Account Data Impact Panel */}
                    <div className="lg:col-span-12 xl:col-span-5 bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden h-full flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-8">
                          <div>
                            <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest text-[#4f46e5]">Account Data Impact</h4>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Storage breakdown by identity role</p>
                          </div>
                          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl text-indigo-500">
                            <Shield size={20} />
                          </div>
                        </div>

                        <div className="space-y-6">
                          {analytics.roleDistribution.map((role, idx) => (
                            <div key={idx} className="space-y-2">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className={`p-2 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-400`}>
                                    {role.role === 'Tenants' ? <Shield size={14} /> : role.role === 'Managers' ? <Zap size={14} /> : <Smartphone size={14} />}
                                  </div>
                                  <span className="text-[10px] font-black text-gray-700 dark:text-gray-300 uppercase tracking-widest">{role.role}</span>
                                </div>
                                <div className="text-right">
                                  <span className="text-[10px] font-black text-gray-900 dark:text-white">{role.sizeMB} MB</span>
                                  <span className="text-[8px] text-gray-400 font-bold ml-2">({role.count} Active)</span>
                                </div>
                              </div>
                              <div className="h-1.5 w-full bg-gray-50 dark:bg-gray-800 rounded-full overflow-hidden">
                                <div
                                  className="h-full transition-all duration-1000"
                                  style={{ width: `${role.percent}%`, backgroundColor: role.color }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-8 p-5 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-2xl border border-indigo-100/50 dark:border-indigo-500/10">
                        <div className="flex items-center gap-4">
                          <div className="p-2.5 bg-white dark:bg-gray-900 rounded-xl shadow-sm text-indigo-600">
                            <Activity size={16} />
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-indigo-900 dark:text-indigo-200 uppercase tracking-widest">Density Analysis</p>
                            <p className="text-[9px] text-indigo-600/70 dark:text-indigo-400/70 font-medium leading-relaxed italic">
                              Employees represent {analytics.roleDistribution.find(r => r.role === 'Employees')?.percent}% of the total identity footprint.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Distribution Analytics (Pie Chart) */}
                    <div className="lg:col-span-12 xl:col-span-7 bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden h-full">
                      <div className="flex items-center justify-between mb-8">
                        <div>
                          <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest text-[#10b981]">Resource Allocation Topology</h4>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Strategic distribution of platform assets</p>
                        </div>
                        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl text-emerald-500">
                          <Layout size={20} />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div className="h-64 w-full flex items-center justify-center relative">
                          {loading ? (
                            <Skeleton variant="circle" className="w-48 h-48" />
                          ) : (
                            <>
                              <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                  <Pie
                                    data={analytics.roleDistribution.map(r => ({ name: r.role, value: r.count, color: r.color }))}
                                    cx="50%" cy="50%" innerRadius="65%" outerRadius="90%" paddingAngle={8} dataKey="value"
                                  >
                                    {analytics.roleDistribution.map((entry, index) => (
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
                                <span className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">{analytics.counts.users.total}</span>
                                <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Total Nodes</span>
                              </div>
                            </>
                          )}
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                          {analytics.roleDistribution.map((item, i) => (
                            <div key={i} className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-700/30 flex flex-col gap-3 transition-all hover:shadow-md group/item">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="w-3 h-3 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.1)]" style={{ backgroundColor: item.color }} />
                                  <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest group-hover/item:text-indigo-500 transition-colors">{item.role}</span>
                                </div>
                                <span className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-tighter">{item.count}</span>
                              </div>
                              <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div
                                  className="h-full rounded-full transition-all duration-1000"
                                  style={{
                                    width: `${item.percent}%`,
                                    backgroundColor: item.color
                                  }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Duplicate Management Panel */}
                  <div className="p-8 bg-white dark:bg-gray-900 rounded-[2.5rem] border border-rose-100 dark:border-rose-500/10 shadow-sm overflow-hidden relative group">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none group-hover:opacity-[0.06] transition-opacity">
                      <AlertCircle size={160} className="text-rose-500 -rotate-12" />
                    </div>

                    <div className="relative z-10">
                      <div
                        onClick={() => setIsDupScanOpen(!isDupScanOpen)}
                        className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8 border-b border-gray-50 dark:border-gray-800 pb-6 cursor-pointer hover:bg-gray-50/50 dark:hover:bg-gray-800/10 p-2 rounded-2xl transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-3.5 bg-rose-500 rounded-2xl text-white shadow-xl shadow-rose-100 dark:shadow-none">
                            <AlertCircle size={24} />
                          </div>
                          <div>
                            <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                              Duplicate Identity Scan
                              <ChevronDown size={14} className={`transition-transform duration-500 ${isDupScanOpen ? 'rotate-180' : ''}`} />
                            </h4>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Cross-referencing database for record overlap</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto" onClick={(e) => e.stopPropagation()}>
                          <select
                            value={dupField}
                            onChange={(e) => setDupField(e.target.value)}
                            className="flex-1 md:flex-none px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl text-[10px] font-black uppercase tracking-widest outline-none transition-all focus:ring-2 focus:ring-rose-500/20 min-w-[140px]"
                          >
                            <option value="email">By Email Address</option>
                            <option value="phone">By Phone Number</option>
                            <option value="username">By Unique Username</option>
                            <option value="custom">Custom Field Filter</option>
                          </select>
                          {dupField === 'custom' && (
                            <input
                              type="text"
                              value={customPath}
                              onChange={(e) => setCustomPath(e.target.value)}
                              placeholder="e.g. id, number, address, code"
                              className="flex-1 md:w-64 px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-rose-200 dark:border-rose-500/30 rounded-xl text-[10px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-rose-500/20"
                            />
                          )}
                          <Button
                            onClick={() => {
                              fetchDuplicates();
                              setIsDupScanOpen(true);
                            }}
                            disabled={loadingDuplicates}
                            variant="primary"
                            className="px-6 py-2.5 rounded-xl bg-gray-900 dark:bg-rose-600 hover:bg-black dark:hover:bg-rose-700 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg"
                          >
                            {loadingDuplicates ? <RefreshCw className="animate-spin" size={14} /> : <Zap size={14} />}
                            {loadingDuplicates ? 'Scanning...' : 'Run Analysis'}
                          </Button>
                        </div>
                      </div>

                      {isDupScanOpen && (
                        <div className="animate-in slide-in-from-top-4 fade-in duration-500">
                          {loadingDuplicates ? (
                            <div className="py-20 flex flex-col items-center justify-center">
                              <RefreshCw className="animate-spin text-rose-500 mb-4" size={32} />
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Scanning database cluster...</p>
                            </div>
                          ) : duplicates.length > 0 ? (
                            <div className="space-y-6">
                              <div className="flex items-center justify-between px-2">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Live Collision Report</p>
                                <div className="flex items-center gap-4">
                                  <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest italic">{duplicates.length} Conflict Groups Found</span>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[500px] overflow-y-auto custom-scrollbar pr-2 pb-4">
                                {duplicates.map((group, idx) => (
                                  <div key={idx} className="p-6 bg-gray-50/50 dark:bg-gray-800/40 rounded-[2rem] border border-gray-100 dark:border-gray-700/50 hover:border-rose-200 dark:hover:border-rose-500/30 transition-all shadow-sm">
                                    <div className="flex items-center justify-between mb-5 border-b border-gray-200 dark:border-gray-700/50 pb-3">
                                      <div className="flex flex-col">
                                        <div className="flex items-center gap-2 mb-1">
                                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic font-serif">Conflict in {group.records[0]?.source}</span>
                                          <span className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[8px] font-black uppercase tracking-widest">Source: {group.records[0]?.source}</span>
                                        </div>
                                        <span className="text-xs font-black text-rose-600 dark:text-rose-400 uppercase tracking-tighter truncate max-w-[180px]" title={group._id}>{group._id}</span>
                                      </div>
                                      <button
                                        onClick={() => {
                                          const groupRecords = group.records.map(r => ({ id: r._id, source: r.source }));
                                          const allInGroupSelected = groupRecords.every(gr => selectedDups.some(sd => sd.id === gr.id));
                                          if (allInGroupSelected) {
                                            const groupIds = groupRecords.map(gr => gr.id);
                                            setSelectedDups(prev => prev.filter(sd => !groupIds.includes(sd.id)));
                                          } else {
                                            setSelectedDups(prev => {
                                              const newStuff = groupRecords.filter(gr => !prev.some(sd => sd.id === gr.id));
                                              return [...prev, ...newStuff];
                                            });
                                          }
                                        }}
                                        className="text-[9px] font-black uppercase text-indigo-600 hover:underline px-3 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-900/20"
                                      >
                                        {group.records.every(r => selectedDups.some(sd => sd.id === r._id)) ? 'Deselect Group' : 'Select Group'}
                                      </button>
                                    </div>
                                    <div className="space-y-3">
                                      {group.records.map((rec, rIdx) => {
                                        const isSelected = selectedDups.some(item => item.id === rec._id);
                                        return (
                                          <div
                                            key={rIdx}
                                            onClick={() => toggleDupSelection(rec._id, rec.source)}
                                            className={`flex items-center justify-between group/rec p-3.5 rounded-2xl border transition-all cursor-pointer ${isSelected ? 'bg-rose-50 border-rose-200 dark:bg-rose-500/10 dark:border-rose-500/40' : 'bg-white dark:bg-gray-900/50 border-transparent hover:border-gray-200 dark:hover:border-gray-700'}`}
                                          >
                                            <div className="flex items-center gap-4">
                                              <div
                                                className={`w-6 h-6 rounded-xl border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-rose-500 border-rose-500 shadow-lg shadow-rose-200 dark:shadow-none' : 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700'}`}
                                              >
                                                {isSelected && <Check size={14} className="text-white" strokeWidth={3} />}
                                              </div>
                                              <div>
                                                <p className="text-[11px] font-black text-gray-700 dark:text-gray-200 break-all">{rec.name || 'Unnamed Record'}</p>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Added: {new Date(rec.createdAt).toLocaleDateString()}</p>
                                                  <span className="w-1 h-1 rounded-full bg-gray-300" />
                                                  <span className="text-[8px] font-black text-indigo-500 uppercase">{rec.source}</span>
                                                </div>
                                              </div>
                                            </div>
                                            <div className="text-right flex flex-col items-end opacity-0 group-hover/rec:opacity-100 transition-opacity">
                                              <span className="text-[8px] font-black px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-400 uppercase tracking-widest">ID: {rec._id.slice(-6)}</span>
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                ))}
                              </div>
                              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t border-gray-100 dark:border-gray-800">
                                <div className="flex flex-col gap-1.5">
                                  <div className="flex items-center gap-3">
                                    <div className={`w-2.5 h-2.5 rounded-full ${selectedDups.length > 0 ? 'bg-rose-500 animate-pulse outline outline-4 outline-rose-500/20' : 'bg-gray-300'}`} />
                                    <p className="text-[11px] text-gray-900 dark:text-white font-black uppercase tracking-widest">
                                      Queue: <span className="text-rose-500 text-lg ml-1">{selectedDups.length}</span> Objects Identified
                                    </p>
                                  </div>
                                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest ml-5.5 italic">Permanent deletion protocols will be executed upon confirmation.</p>
                                </div>
                                <button
                                  onClick={() => setShowPurgeModal(true)}
                                  disabled={selectedDups.length === 0 || cleaning}
                                  className={`w-full sm:w-auto py-4 px-10 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl flex items-center justify-center gap-3 transition-all active:scale-95 ${selectedDups.length > 0 ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-200 dark:shadow-none' : 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'}`}
                                >
                                  {cleaning ? <RefreshCw className="animate-spin" size={18} /> : <Zap size={18} />}
                                  {cleaning ? 'Purging Nodes...' : 'Execute Secure Purge'}
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="py-20 flex flex-col items-center justify-center text-center">
                              <div className="p-6 bg-emerald-50 dark:bg-emerald-500/10 rounded-full mb-4 shadow-inner">
                                <Check size={32} className="text-emerald-500" />
                              </div>
                              <p className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">No Integrity Issues Detected</p>
                              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2 italic">The database is currently free of {dupField} collisions.</p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Atomic Purge Authorization Modal */}
                      {showPurgeModal && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                          <div
                            className="absolute inset-0 bg-gray-900/60 backdrop-blur-md animate-in fade-in duration-300"
                            onClick={() => setShowPurgeModal(false)}
                          />
                          <div className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-rose-500 via-orange-500 to-rose-500 animate-gradient-x" />

                            <div className="p-10">
                              <div className="w-20 h-20 bg-rose-50 dark:bg-rose-500/10 rounded-[2rem] flex items-center justify-center text-rose-500 mb-8 mx-auto shadow-inner">
                                <AlertTriangle size={36} strokeWidth={2.5} />
                              </div>

                              <div className="text-center mb-10">
                                <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-2">Atomic Purge Authorized?</h3>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] leading-relaxed">
                                  You are about to permanently remove <span className="text-rose-600 dark:text-rose-400">{selectedDups.length} objects</span> from the database cluster. This operation is irreversible.
                                </p>
                              </div>

                              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 mb-10">
                                <div className="flex items-center justify-between mb-4">
                                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Security Protocol</span>
                                  <span className="text-[9px] font-bold text-rose-500 uppercase tracking-widest animate-pulse">Critical Warning</span>
                                </div>
                                <div className="space-y-3">
                                  <div className="flex items-center gap-3">
                                    <Shield size={12} className="text-indigo-500" />
                                    <span className="text-[10px] font-black text-gray-700 dark:text-gray-300 uppercase tracking-widest">Encrypted Deletion Path</span>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <Activity size={12} className="text-indigo-500" />
                                    <span className="text-[10px] font-black text-gray-700 dark:text-gray-300 uppercase tracking-widest">Irreversible Data Erasure</span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex flex-col gap-3">
                                <button
                                  onClick={handleCleanup}
                                  className="w-full py-4 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-rose-200 dark:shadow-none transition-all active:scale-95"
                                >
                                  Confirm Permanent Purge
                                </button>
                                <button
                                  onClick={() => setShowPurgeModal(false)}
                                  className="w-full py-4 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all font-serif italic"
                                >
                                  Abort Operation
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                    </div>
                  </div>

                  {/* Growth Perspective Table & Charts Row */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Growth Analytics */}
                    <div className="lg:col-span-7 bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm">
                      <div className="flex items-center justify-between mb-8">
                        <div>
                          <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">Data Expansion Perspective</h4>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Growth progression in GB</p>
                        </div>
                        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl text-indigo-500">
                          <BarChart size={20} />
                        </div>
                      </div>
                      <div className="h-64 w-full">
                        {loading ? (
                          <Skeleton className="h-full w-full rounded-2xl" />
                        ) : (
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={analytics.storageGrowth}>
                              <defs>
                                <linearGradient id="colorSize" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1} />
                                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" opacity={0.5} />
                              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#9CA3AF' }} dy={10} />
                              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#9CA3AF' }} dx={-10} />
                              <Tooltip
                                contentStyle={{ backgroundColor: '#FFF', borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', padding: '12px' }}
                                labelStyle={{ fontWeight: 900, marginBottom: '4px', fontSize: '12px' }}
                                itemStyle={{ color: '#4f46e5', fontWeight: 900, fontSize: '10px', textTransform: 'uppercase' }}
                              />
                              <Area type="monotone" dataKey="size" stroke="#4f46e5" strokeWidth={4} fillOpacity={1} fill="url(#colorSize)" />
                            </AreaChart>
                          </ResponsiveContainer>
                        )}
                      </div>
                    </div>

                    {/* Account Stats Grid */}
                    <div className="lg:col-span-5 grid grid-rows-2 gap-8">
                      {[
                        { label: 'Total Database Objects', value: (analytics.collectionInventory.reduce((acc, curr) => acc + curr.count, 0)).toLocaleString(), icon: Database, color: 'indigo', sub: 'Indexed Records' },
                        { label: 'Platform Performance', value: analytics.storageMetrics.used < 1 ? 'Lightning' : 'Optimal', icon: Zap, color: 'emerald', sub: 'Latency Index' },
                      ].map((stat, i) => (
                        <div key={i} className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all flex items-center gap-6 group">
                          <div className={`p-5 rounded-[1.5rem] bg-${stat.color}-50 dark:bg-${stat.color}-900/10 text-${stat.color}-600 dark:text-${stat.color}-400 group-hover:scale-110 transition-transform`}>
                            <stat.icon size={28} />
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-2">{stat.label}</p>
                            <p className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter uppercase">{stat.value}</p>
                            <p className="text-[8px] font-bold text-gray-300 dark:text-gray-600 uppercase tracking-widest mt-1 italic">{stat.sub}</p>
                          </div>
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
