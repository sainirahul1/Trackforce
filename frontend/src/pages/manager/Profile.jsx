import React, { useState, useRef, useEffect } from 'react';
import {
  User, Mail, Phone, Building2, MapPin, Shield,
  Settings, Bell, Moon, Sun, Camera, Save,
  ChevronRight, LogOut, CheckCircle2, Globe,
  ShieldCheck, CreditCard, Laptop, Smartphone,
  Calendar, Lock, AlertTriangle, Clock, Activity, X, MoreVertical, Sliders
} from 'lucide-react';
import { updateProfile as updateAuthProfile, getMe, uploadProfileImage as uploadAuthImage, updatePassword } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react';

/**
 * ManagerProfile Component
 * Professional profile and settings management for the Manager portal.
 */
const ManagerProfile = () => {
  const [activeTab, setActiveTab] = useState('notifications');
  const [isSaved, setIsSaved] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [isSavingAvatar, setIsSavingAvatar] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const { refreshUser } = useAuth();
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

  // Manager Data State
  const [managerData, setManagerData] = useState({
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
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setProfileLoading(true);
        const data = await getMe();
        setManagerData(prev => ({
          ...prev,
          name: data.name || prev.name,
          role: data.role === 'manager' ? 'Regional Sales Manager' : data.role,
          email: data.email || prev.email,
          phone: data.profile?.phone || prev.phone,
          company: data.company || prev.company,
          location: data.profile?.location || prev.location,
          nationality: data.profile?.nationality || prev.nationality,
          gender: data.profile?.gender || prev.gender,
          dob: data.profile?.dob || prev.dob,
          department: data.profile?.department || prev.department,
          emergencyContact: data.profile?.emergencyContact || prev.emergencyContact,
          address: data.profile?.address || prev.address,
          profileImage: data.profile?.profileImage || null,
          avatar: data.name ? data.name.split(' ').map(n => n[0]).join('') : 'AR'
        }));
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setProfileLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // State for Edit Overlay
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  // State for Notification Overlay
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);

  const tabs = [
    { id: 'security', label: 'Security & Access', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      setPasswordError('New passwords do not match');
      return;
    }
    if (passwords.new.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return;
    }
    try {
      await updatePassword({ currentPassword: passwords.current, newPassword: passwords.new });
      setIsSaved(true);
      setIsPasswordModalOpen(false);
      setPasswords({ current: '', new: '', confirm: '' });
      setPasswordError('');
      setTimeout(() => setIsSaved(false), 3000);
    } catch (error) {
      setPasswordError(error.message || 'Failed to update password');
    }
  };

  const handleRevokeSession = (id) => {
    setSessions(prev => prev.filter(session => session.id !== id));
  };

  const handleRevokeAll = () => {
    setSessions(prev => prev.filter(session => session.current));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('image', file);
      try {
        setIsSavingAvatar(true);
        const response = await uploadAuthImage(formData);
        const imageUrl = response.profileImage; // Direct Base64 URL
        setProfileImage(imageUrl);
        setManagerData(prev => ({ ...prev, profileImage: imageUrl }));
        
        // SYNC WITH GLOBAL STATE (Sidebar, Navbar)
        await refreshUser();
        
      } catch (error) {
        console.error('Failed to upload image:', error);
        alert(error.message || 'Failed to upload profile image');
      } finally {
        setIsSavingAvatar(false);
      }
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

  const NotificationPreferenceOverlay = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
        <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-white/20 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col">
          {/* Header */}
          <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-white/50 dark:bg-slate-900/50 backdrop-blur-lg sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg rotate-3">
                <Bell size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Signal Preferences</h3>
                <p className="text-xs text-gray-500 font-medium">Configure operational alerts and signals</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-3 bg-gray-50 dark:bg-gray-800 text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-2xl transition-all hover:rotate-90"
            >
              <X size={20} />
            </button>
          </div>

          {/* Settings Content */}
          <div className="p-8 space-y-2">
            <SettingRow
              label="Email Protocol"
              sub="Weekly reports and system health summaries"
              icon={Mail}
            >
              <Toggle checked={emailNotif} onChange={setEmailNotif} />
            </SettingRow>

            <SettingRow
              label="Push Alerts"
              sub="Real-time alerts for critical events"
              icon={Bell}
            >
              <Toggle checked={pushNotif} onChange={setPushNotif} />
            </SettingRow>

            <SettingRow
              label="SMS Direct"
              sub="High-priority alerts via mobile"
              icon={Smartphone}
            >
              <Toggle checked={smsNotif} onChange={setSmsNotif} />
            </SettingRow>

            <SettingRow
              label="Team Activity Alerts"
              sub="Notifications regarding task completion"
              icon={Activity}
            >
              <Toggle checked={teamAlerts} onChange={setTeamAlerts} />
            </SettingRow>
          </div>

          {/* Footer */}
          <div className="px-8 py-6 border-t border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-lg">
            <button
              onClick={onClose}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
            >
              Done Updating
            </button>
          </div>
        </div>
      </div>
    );
  };

  const ProfileEditOverlay = ({ isOpen, onClose, managerData, onSave }) => {
    const [formData, setFormData] = useState({ ...managerData });

    if (!isOpen) return null;

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await updateAuthProfile(formData);
        // Map backend response back to frontend state if necessary
        const updatedManagerData = {
          ...managerData,
          name: response.name,
          email: response.email,
          phone: response.profile?.phone,
          address: response.profile?.address,
          dob: response.profile?.dob,
          nationality: response.profile?.nationality,
          emergencyContact: response.profile?.emergencyContact,
          department: response.profile?.department,
        };
        onSave(updatedManagerData);
        onClose();
      } catch (error) {
        console.error('Failed to update profile:', error);
        alert(error.message || 'Failed to update profile');
      }
    };

    return (
      <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
        <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-white/20 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-white/50 dark:bg-slate-900/50 backdrop-blur-lg sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg rotate-3">
                <User size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Edit Profile</h3>
                <p className="text-xs text-gray-500 font-medium">Update your professional managerial details</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-3 bg-gray-50 dark:bg-gray-800 text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-2xl transition-all hover:rotate-90"
            >
              <X size={20} />
            </button>
          </div>

          {/* Form Content */}
          <form id="editProfileForm" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Identity</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800/50 border-none rounded-2xl text-sm font-bold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    placeholder="Abhiram Rangoon"
                  />
                </div>
              </div>

              {/* Official Email */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Official Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800/50 border-none rounded-2xl text-sm font-bold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    placeholder="abhiram@trackforce.com"
                  />
                </div>
              </div>

              {/* Work Phone */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Secure Line</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800/50 border-none rounded-2xl text-sm font-bold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              {/* Department */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Department Hub</label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800/50 border-none rounded-2xl text-sm font-bold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    placeholder="Sales & Operations"
                  />
                </div>
              </div>

              {/* Nationality */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nationality</label>
                <div className="relative">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    name="nationality"
                    value={formData.nationality}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800/50 border-none rounded-2xl text-sm font-bold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    placeholder="Indian"
                  />
                </div>
              </div>

              {/* DOB */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Date of Birth</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800/50 border-none rounded-2xl text-sm font-bold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    placeholder="15 May 1988"
                  />
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Emergency Contact Protocol</label>
                <div className="relative">
                  <Activity className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    name="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800/50 border-none rounded-2xl text-sm font-bold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    placeholder="Priya (Spouse) - 91234 56789"
                  />
                </div>
              </div>

              {/* Address */}
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Residential Address</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-5 text-gray-400" size={18} />
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800/50 border-none rounded-2xl text-sm font-bold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all min-h-[100px] resize-none"
                    placeholder="Vasanth Nagar, Bangalore, KA 560001"
                  />
                </div>
              </div>
            </div>
          </form>

          {/* Footer Actions */}
          <div className="px-8 py-6 border-t border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-lg flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="editProfileForm"
              className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-indigo-600/20 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Save size={16} />
              COMMIT CHANGES
            </button>
          </div>
        </div>
      </div>
    );
  };

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

  const ManagerInformationSection = ({ managerData, onEdit, loading }) => {
    const details = [
      { label: 'Manager Code', value: 'TF-MGR-' + (managerData?._id?.slice(-5).toUpperCase() || '002'), icon: Shield },
      { label: 'Date of Join', value: managerData.joinDate || 'Jan 2024', icon: Calendar },
      { label: 'Designation', value: managerData.role, icon: Building2 },
      { label: 'Department', value: managerData.department, icon: Activity },
      { label: 'Nationality', value: managerData.nationality, icon: Globe },
      { label: 'Location Zone', value: managerData.location, icon: MapPin },
    ];

    return (
      <div className="bg-white/40 dark:bg-slate-950/40 rounded-[2rem] sm:rounded-[2.5rem] border-2 border-slate-100 dark:border-slate-800 p-6 sm:p-8 lg:p-10 overflow-hidden relative backdrop-blur-xl mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 dark:bg-indigo-900/10 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="relative">
          <div className="flex items-center justify-between mb-8 sm:mb-10">
            <h3 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight">Manager Information</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 lg:gap-x-12 gap-y-8 sm:gap-y-10">
            {details.map((detail, i) => (
              <div key={i} className="flex items-start gap-4 group">
                <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-slate-900/40 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                  <detail.icon size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">{detail.label}</p>
                  {loading ? (
                    <div className="h-5 w-32 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-md mt-1" />
                  ) : (
                    <p className="mt-1 text-base font-black text-gray-800 dark:text-gray-200">{detail.value || '---'}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative min-h-screen">
      {/* Profile Edit Overlay */}
      <ProfileEditOverlay
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        managerData={managerData}
        onSave={(updatedData) => {
          setManagerData(updatedData);
          handleSave(); // Trigger success feedback
        }}
      />

      {/* Notification Preference Overlay */}
      <NotificationPreferenceOverlay
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
      />

      {/* Background Accents - Updated to White */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/10 rounded-full blur-[140px] -mr-64 -mt-64" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-white/5 rounded-full blur-[140px] -ml-64 -mb-64" />
      </div>

      {/* Password Update Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
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
                  onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
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
                  onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
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
                  onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
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
                className="w-32 h-32 md:w-40 md:h-40 rounded-[3rem] bg-indigo-50 dark:bg-slate-800 flex items-center justify-center text-4xl md:text-5xl font-black text-indigo-600 dark:text-indigo-400 shadow-2xl rotate-3 group-hover:rotate-0 transition-transform duration-500 overflow-hidden relative"
              >
                {profileLoading ? (
                  <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 animate-pulse" />
                ) : (
                  <>
                    {(managerData.profileImage || profileImage) ? (
                      <img 
                        src={(managerData.profileImage || profileImage).startsWith('data:') ? (managerData.profileImage || profileImage) : (() => {
                          let url = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
                          url = url.replace(/\/$/, '');
                          if (!url.endsWith('/api')) url += '/api';
                          return `${url.replace('/api', '')}${(managerData.profileImage || profileImage)}`;
                        })()} 
                        alt="Profile" 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <span className="text-indigo-600 dark:text-indigo-400">{managerData.avatar}</span>
                    )}
                    {isSavingAvatar && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white">
                        <Loader2 className="animate-spin" />
                      </div>
                    )}
                  </>
                )}
              </div>
              {!profileLoading && (
                <button
                  onClick={triggerFileInput}
                  disabled={isSavingAvatar}
                  className="absolute -bottom-2 -right-2 p-3 bg-white dark:bg-gray-900 rounded-2xl text-gray-900 dark:text-white shadow-xl hover:scale-110 active:scale-95 transition-all"
                >
                  <Camera size={20} />
                </button>
              )}
            </div>

            <div className="text-center md:text-left space-y-4 flex-1">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gray-900/5 dark:bg-white/10 backdrop-blur-md border border-gray-900/10 dark:border-white/20 rounded-full">
                <ShieldCheck size={14} className="text-emerald-500 dark:text-emerald-400" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 dark:text-white/90">Identity Verified</span>
              </div>
              
              {profileLoading ? (
                <div className="space-y-3">
                  <div className="h-12 w-64 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-2xl" />
                  <div className="h-6 w-48 bg-gray-100 dark:bg-gray-800/50 animate-pulse rounded-xl" />
                </div>
              ) : (
                <>
                  <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-none text-gray-900 dark:text-white">
                    {managerData.name}
                  </h1>
                </>
              )}
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <div className="flex items-center gap-2 text-gray-500 dark:text-slate-400 font-medium text-sm">
                  <Building2 size={16} />
                  <span>{managerData.company}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500 dark:text-slate-400 font-medium text-sm">
                  <MapPin size={16} />
                  <span>{managerData.location}</span>
                </div>
              </div>
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="lg:hidden mt-4 w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 px-6 py-3 rounded-2xl font-black text-sm transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-slate-900/10 dark:shadow-none"
              >
                Edit Profile
              </button>
            </div>

            <div className="flex-1" />

            <div className="hidden lg:flex flex-col items-end gap-5 text-right">

              <div className="flex flex-col items-end gap-4">
                {/* <div className="px-4 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-black rounded-lg">Top 1% Performance</div> */}
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 px-8 py-3 rounded-2xl font-black text-sm transition-all hover:scale-105 active:scale-95 shadow-xl shadow-slate-900/10 dark:shadow-none whitespace-nowrap"
                >
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* 2. Manager Information Section - Standalone */}
        <ManagerInformationSection 
          managerData={managerData} 
          onEdit={() => setIsEditModalOpen(true)} 
          loading={profileLoading}
        />

        {/* 3. Settings Content Area - Refined to Horizontal Navigation */}
        <div className="flex flex-col gap-8">

          {/* Horizontal Navigation Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-4 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md p-3 rounded-[2.5rem] border border-white/20 dark:border-slate-800">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-6 py-4 rounded-[1.5rem] font-black text-sm transition-all group ${activeTab === tab.id
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
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Recent Notifications</h3>
                      <p className="text-xs text-gray-500 font-medium mt-1">Operational alerts and system signals</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => setIsNotificationModalOpen(true)}
                        className="flex items-center gap-2 px-5 py-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all"
                      >
                        <Sliders size={16} />
                        Notifications Settings
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {[
                      { id: 1, title: 'New Team Lead Assigned', sub: 'Rajesh Kumar has been assigned to Project Alpha', icon: User, time: '2 hours ago', color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
                      { id: 2, title: 'System Maintenance', sub: 'Scheduled update on March 28, 02:00 AM IST', icon: AlertTriangle, time: '5 hours ago', color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20' },
                      { id: 3, title: 'Leave Request Approved', sub: 'Your leave for April 10th has been approved', icon: CheckCircle2, time: '1 day ago', color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
                      { id: 4, title: 'New Employee Onboarded', sub: 'Sanya Sharma joined the Sales Hub today', icon: User, time: '2 days ago', color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
                    ].map((notif) => (
                      <div key={notif.id} className="flex items-center justify-between p-6 bg-white dark:bg-gray-800/50 rounded-3xl border border-gray-100 dark:border-gray-800 hover:shadow-md transition-all group">
                        <div className="flex items-center gap-5">
                          <div className={`w-12 h-12 rounded-2xl ${notif.bg} ${notif.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                            <notif.icon size={22} />
                          </div>
                          <div>
                            <p className="text-sm font-black text-gray-900 dark:text-white">{notif.title}</p>
                            <p className="text-xs font-bold text-gray-500 mt-1">{notif.sub}</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">{notif.time}</span>
                      </div>
                    ))}
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
