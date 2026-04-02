import React, { useState, useRef, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Building, Lock, Globe, Save, User, Activity, Download, Eye, EyeOff } from 'lucide-react';
import tenantService from '../../services/core/tenantService';

const Settings = () => {
  const { setPageLoading } = useOutletContext();
  const [logoPreview, setLogoPreview] = useState(null);
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  // General Info State
  const [generalInfo, setGeneralInfo] = useState({
    companyName: '',
    officialEmail: '',
    hqAddress: '',
  });

  // Password State
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Localization State
  const [localization, setLocalization] = useState({
    timezone: 'EST',
    language: 'en',
  });

  // Account Preferences State
  const [accountPrefs, setAccountPrefs] = useState({
    status: 'Active',
    featureFlags: [],
  });

  // PERSISTENT CACHE INITIALIZATION (0s Loading)
  const cachedSettings = tenantService.getSyncCachedData ? tenantService.getSyncCachedData('tenant_settings') : null;

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await tenantService.getSettings();
        if (data) {
          setGeneralInfo({
            companyName: data.general?.companyName || '',
            officialEmail: data.general?.officialEmail || '',
            hqAddress: data.general?.hqAddress || '',
          });
          setLogoPreview(data.general?.logoUrl);
          setLocalization({
            timezone: data.localization?.timezone || 'EST',
            language: data.localization?.language || 'en',
          });
          setAccountPrefs({
            status: data.account?.status || 'Active',
            featureFlags: data.account?.featureFlags || [],
          });
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        if (setPageLoading) setPageLoading(false);
      }
    };
    
    // Immediate state hydration from cache
    if (cachedSettings) {
      setGeneralInfo({
        companyName: cachedSettings.general?.companyName || '',
        officialEmail: cachedSettings.general?.officialEmail || '',
        hqAddress: cachedSettings.general?.hqAddress || '',
      });
      setLogoPreview(cachedSettings.general?.logoUrl);
      setLocalization({
        timezone: cachedSettings.localization?.timezone || 'EST',
        language: cachedSettings.localization?.language || 'en',
      });
      setAccountPrefs({
        status: cachedSettings.account?.status || 'Active',
        featureFlags: cachedSettings.account?.featureFlags || [],
      });
      if (setPageLoading) setPageLoading(false);
    }

    fetchSettings();
  }, [setPageLoading]);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveGeneralInfo = async () => {
    try {
      setLoading(true);
      const payload = {
        ...generalInfo,
        logoUrl: logoPreview,
      };
      console.log('[FRONTEND DEBUG] Saving General Info:', payload);
      await tenantService.updateGeneralInfo(payload);
      showToast('Settings Updated Successfully!', 'success');
    } catch (error) {
      showToast(error.response?.data?.message || 'Error saving general info', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }
    try {
      setLoading(true);
      await tenantService.updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      showToast('Password Updated Successfully!', 'success');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      showToast(error.response?.data?.message || 'Error updating password', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveLocalization = async () => {
    try {
      setLoading(true);
      console.log('[FRONTEND DEBUG] Saving Localization:', localization);
      await tenantService.updateLocalization(localization);
      showToast('Localization Updated Successfully!', 'success');
    } catch (error) {
      showToast(error.response?.data?.message || 'Error saving localization', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAccountPrefs = async () => {
    try {
      setLoading(true);
      console.log('[FRONTEND DEBUG] Saving Account Prefs:', accountPrefs);
      await tenantService.updateAccountPreferences(accountPrefs);
      showToast('Account Preferences Updated Successfully!', 'success');
    } catch (error) {
      showToast(error.response?.data?.message || 'Error saving account preferences', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDataExport = async () => {
    try {
      const data = await tenantService.requestDataExport();
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'tenant_data_export.json');
      document.body.appendChild(link);
      link.click();
      link.remove();
      showToast('Data Export Started!', 'success');
    } catch (error) {
      showToast('Error exporting data', 'error');
    }
  };

  const handleSignOutManagers = async () => {
    try {
      setLoading(true);
      await tenantService.signOutAllManagers();
      showToast('Successfully signed out all the managers', 'success');
    } catch (error) {
      showToast(error.response?.data?.message || 'Error signing out managers', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-16 relative">
      {/* Custom Toast Notification */}
      {toast.show && (
        <div className={`fixed top-10 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl animate-in slide-in-from-top-10 duration-300 ${toast.type === 'success'
            ? 'bg-emerald-600 text-white'
            : 'bg-red-600 text-white'
          }`}>
          <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center">
            {toast.type === 'success' ? <Save size={14} /> : <Lock size={14} />}
          </div>
          <span className="font-black tracking-tight">{toast.message}</span>
        </div>
      )}

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
                <h3 className="text-lg font-black text-gray-900 dark:text-white">{generalInfo.companyName || 'TrackForce Logistics'}</h3>
                <p className="text-sm font-bold text-indigo-600">Premium Account</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-50 dark:border-gray-800">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Company Name</label>
                <input
                  type="text"
                  value={generalInfo.companyName}
                  onChange={(e) => setGeneralInfo({ ...generalInfo, companyName: e.target.value })}
                  className="w-full p-4 bg-gray-50 dark:bg-gray-800/50 border-none rounded-2xl font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-600 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Official Email</label>
                <input
                  type="email"
                  value={generalInfo.officialEmail}
                  onChange={(e) => setGeneralInfo({ ...generalInfo, officialEmail: e.target.value })}
                  className="w-full p-4 bg-gray-50 dark:bg-gray-800/50 border-none rounded-2xl font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-600 transition-all"
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">HQ Address</label>
                <textarea
                  rows="3"
                  value={generalInfo.hqAddress}
                  onChange={(e) => setGeneralInfo({ ...generalInfo, hqAddress: e.target.value })}
                  className="w-full p-4 bg-gray-50 dark:bg-gray-800/50 border-none rounded-2xl font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-600 transition-all resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={handleSaveGeneralInfo}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black rounded-2xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-all text-sm shadow-xl dark:shadow-none disabled:opacity-50"
              >
                <Save size={16} /> {loading ? 'Saving...' : 'Save General Info'}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-gray-50 dark:border-gray-800">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Current Password</label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? 'text' : 'password'}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    placeholder="Enter current password"
                    autoComplete="off"
                    className="w-full p-4 bg-gray-50 dark:bg-gray-800/50 border-none rounded-2xl font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 transition-all pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    {showPasswords.current ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">New Password</label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    placeholder="Create new password"
                    autoComplete="new-password"
                    className="w-full p-4 bg-gray-50 dark:bg-gray-800/50 border-none rounded-2xl font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 transition-all pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    placeholder="Confirm new password"
                    autoComplete="new-password"
                    className="w-full p-4 bg-gray-50 dark:bg-gray-800/50 border-none rounded-2xl font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 transition-all pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={handleUpdatePassword}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-black rounded-2xl hover:bg-red-700 transition-all text-sm shadow-xl shadow-red-200 dark:shadow-none disabled:opacity-50"
              >
                <Save size={16} /> {loading ? 'Updating...' : 'Update Password'}
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
              <select
                value={localization.timezone}
                onChange={(e) => setLocalization({ ...localization, timezone: e.target.value })}
                className="w-full p-4 bg-gray-50 dark:bg-gray-800/50 border-none rounded-2xl font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all appearance-none cursor-pointer"
              >
                <option value="EST">Eastern Standard Time (EST)</option>
                <option value="CST">Central Standard Time (CST)</option>
                <option value="PST">Pacific Standard Time (PST)</option>
                <option value="GMT">Greenwich Mean Time (GMT)</option>
                <option value="IST">Indian Standard Time (IST)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Language</label>
              <select
                value={localization.language}
                onChange={(e) => setLocalization({ ...localization, language: e.target.value })}
                className="w-full p-4 bg-gray-50 dark:bg-gray-800/50 border-none rounded-2xl font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all appearance-none cursor-pointer"
              >
                <option value="en">English (US)</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-8">
            <button
              onClick={handleSaveLocalization}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all text-sm shadow-xl shadow-blue-200 dark:shadow-none disabled:opacity-50"
            >
              <Save size={16} /> {loading ? 'Saving...' : 'Save Localization'}
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
              <button
                onClick={handleSignOutManagers}
                disabled={loading}
                className="w-full py-3 bg-white dark:bg-gray-800 text-indigo-600 font-bold rounded-2xl border border-indigo-100 dark:border-indigo-800 shadow-sm hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Sign Out All Managers'}
              </button>
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
              <button
                onClick={handleDataExport}
                className="w-full py-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 font-bold rounded-2xl border border-transparent shadow-sm hover:bg-emerald-600 hover:text-white transition-all"
              >
                Request Data Export
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6 border-b border-gray-50 dark:border-gray-800">
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Account Status</label>
              <select
                value={accountPrefs.status}
                onChange={(e) => setAccountPrefs({ ...accountPrefs, status: e.target.value })}
                className="w-full p-4 bg-gray-50 dark:bg-gray-800/50 border-none rounded-2xl font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 transition-all appearance-none cursor-pointer"
              >
                <option value="Active">Active</option>
                <option value="Suspended">Suspended</option>
                <option value="Deactivated">Deactivated</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Available Feature Flags</label>
              <div className="flex flex-wrap gap-2 pt-1">
                {['API Access', 'Beta Features', 'Premium Support', 'Multi-region'].map(flag => (
                  <button
                    key={flag}
                    onClick={() => {
                      const flags = accountPrefs.featureFlags.includes(flag)
                        ? accountPrefs.featureFlags.filter(f => f !== flag)
                        : [...accountPrefs.featureFlags, flag];
                      setAccountPrefs({ ...accountPrefs, featureFlags: flags });
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${accountPrefs.featureFlags.includes(flag)
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                      }`}
                  >
                    {flag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-6">
            <button
              onClick={handleSaveAccountPrefs}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-black rounded-2xl hover:bg-emerald-700 transition-all text-sm shadow-xl shadow-emerald-200 dark:shadow-none disabled:opacity-50"
            >
              <Save size={16} /> {loading ? 'Saving...' : 'Save Account Preferences'}
            </button>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Settings;
