import React, { useState, useRef, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Building, ShieldCheck, Camera, Edit3, Key, Briefcase, X, Save, Calendar, Clock, Users, Globe, Loader2, Eye, EyeOff } from 'lucide-react';
import Skeleton from '../../components/ui/Skeleton';
import { getMe, updateProfile as updateAuthProfile, uploadProfileImage as uploadAuthImage, updateSuperadminCredentials } from '../../services/core/authService';
import { useAuth } from '../../context/AuthContext';
import { useDialog } from '../../context/DialogContext';

const Profile = () => {
  const { showAlert } = useDialog();
  const [avatarPreview, setAvatarPreview] = useState(null);
  const avatarInputRef = useRef(null);
  const { refreshUser } = useAuth();
  
  const [profileData, setProfileData] = useState({
    name: '',
    role: 'Super Administrator',
    company: '',
    location: '',
    email: '',
    phone: '',
    department: '',
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState(profileData);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // New states for Account Credentials Management
  const [credentialsForm, setCredentialsForm] = useState({
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isUpdatingCredentials, setIsUpdatingCredentials] = useState(false);
  const [credentialsMessage, setCredentialsMessage] = useState({ type: '', text: '' });

  const showCredentialsMessage = (text, type = 'success') => {
    setCredentialsMessage({ text, type });
    setTimeout(() => setCredentialsMessage({ text: '', type: '' }), 3000);
  };

  const handleUpdateCredentials = async () => {
    if (credentialsForm.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(credentialsForm.email)) {
        showCredentialsMessage('Invalid email format', 'error');
        return;
      }
    }

    if (!credentialsForm.currentPassword) {
      showCredentialsMessage('Current password is required', 'error');
      return;
    }

    if (credentialsForm.newPassword) {
      if (credentialsForm.newPassword.length < 8) {
        showCredentialsMessage('New password must be minimum 8 characters', 'error');
        return;
      }
      if (credentialsForm.newPassword !== credentialsForm.confirmPassword) {
        showCredentialsMessage('Confirm password must match new password', 'error');
        return;
      }
    }

    if (!credentialsForm.email && !credentialsForm.newPassword) {
        showCredentialsMessage('Please provide an email or new password to update', 'error');
        return;
    }

    setIsUpdatingCredentials(true);
    try {
      await updateSuperadminCredentials({ 
        uid: 'SYS-ROOT-001', 
        email: credentialsForm.email,
        currentPassword: credentialsForm.currentPassword,
        newPassword: credentialsForm.newPassword
      });
      showCredentialsMessage('Credentials updated successfully');
      setCredentialsForm({ email: '', currentPassword: '', newPassword: '', confirmPassword: '' });
      if (credentialsForm.email) {
        const freshData = await refreshUser();
        setProfileData(prev => ({ ...prev, email: freshData.email }));
      }
    } catch (error) {
      showCredentialsMessage(error.message || 'Failed to update credentials', 'error');
    } finally {
      setIsUpdatingCredentials(false);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getMe();
        setProfileData(prev => ({
          ...prev,
          name: data.name || prev.name,
          role: data.profile?.designation || (data.role === 'superadmin' ? 'Super Administrator' : data.role),
          company: data.company || prev.company,
          email: data.email || prev.email,
          phone: data.profile?.phone || prev.phone,
          location: data.profile?.location || prev.location,
          department: data.profile?.department || prev.department,
        }));
        if (data.profile?.profileImage) {
          setAvatarPreview(data.profile.profileImage);
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('image', file);
      try {
        const response = await uploadAuthImage(formData);
        const imageUrl = response.profileImage;
        setAvatarPreview(imageUrl);
        await refreshUser();
        showAlert('Profile image updated successfully.', 'Image Uploaded', 'success');
      } catch (error) {
        console.error('Failed to upload image:', error);
        showAlert(error.message || 'Failed to upload profile image', 'Upload Failed', 'error');
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleEditClick = () => {
    setEditForm(profileData);
    setIsEditModalOpen(true);
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      const payload = {
        ...editForm,
        designation: editForm.role,
        company: editForm.company,
      };
      await updateAuthProfile(payload);
      const freshData = await refreshUser();
      
      setProfileData({
        ...profileData,
        name: freshData.name,
        email: freshData.email,
        phone: freshData.profile?.phone,
        location: freshData.profile?.location,
        department: freshData.profile?.department,
        role: freshData.profile?.designation || editForm.role,
        company: freshData.company || editForm.company,
      });
      setIsEditModalOpen(false);
      showAlert('Profile information updated.', 'Profile Updated', 'success');
    } catch (error) {
      console.error('Failed to update profile:', error);
      showAlert(error.message || 'Failed to update profile', 'Update Failed', 'error');
    } finally {
      setIsSaving(false);
    }
  };


  return (
    <>
      <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-16">
        {/* Header Profile Section */}
      <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-transparent border-b border-gray-50 dark:border-gray-800/50"></div>
        <div className="relative mt-8 flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="relative group">
            <div className="w-32 h-32 rounded-[2.5rem] bg-white dark:bg-gray-800 p-2 shadow-xl border border-gray-50 dark:border-gray-700 flex items-center justify-center relative overflow-hidden">
              {isLoading ? (
                <Skeleton variant="rounded" className="w-full h-full rounded-[2rem]" />
              ) : (
                <div className="w-full h-full rounded-[2rem] bg-gray-50 dark:bg-gray-800/50 flex items-center justify-center text-gray-400 overflow-hidden">
                  {avatarPreview ? (
                    <img src={avatarPreview.startsWith('data:') ? avatarPreview : `http://localhost:5001${avatarPreview}`} alt="Profile Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User size={64} strokeWidth={1.5} />
                  )}
                </div>
              )}
            </div>
            {!isLoading && (
              <>
                <input
                  type="file"
                  ref={avatarInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                />
                <button
                  onClick={() => avatarInputRef.current?.click()}
                  disabled={isSaving}
                  className="absolute -bottom-2 -right-2 w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-100 dark:border-gray-700 flex items-center justify-center text-gray-500 hover:text-indigo-600 transition-all z-10 hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? <Loader2 size={20} className="animate-spin text-indigo-600" /> : <Camera size={20} />}
                </button>
              </>
            )}
          </div>

          <div className="flex-1 text-center md:text-left mt-4 md:mt-0 space-y-3">
            <div className="flex flex-col md:flex-row items-center gap-4 justify-between">
              {isLoading ? (
                <div className="space-y-3 flex-1">
                  <Skeleton className="h-9 w-64" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ) : (
                <div>
                  <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">{profileData.name}</h1>
                  <p className="text-sm font-bold text-indigo-600 uppercase tracking-widest mt-1">{profileData.role}</p>
                </div>
              )}
              {isLoading ? (
                <Skeleton className="h-10 w-32 rounded-2xl" />
              ) : (
                <button
                  onClick={handleEditClick}
                  className="flex items-center gap-2 px-5 py-2.5 bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 font-bold rounded-2xl hover:bg-indigo-100 transition-colors"
                >
                  <Edit3 size={16} /> Edit Profile
                </button>
              )}
            </div>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 pt-4 text-sm font-medium text-gray-500 dark:text-gray-400">
              {isLoading ? (
                <>
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-6 w-28 rounded-full" />
                </>
              ) : (
                <>
                  <span className="flex items-center gap-2"><Briefcase size={16} className="text-gray-400" /> {profileData.company}</span>
                  <span className="flex items-center gap-2"><MapPin size={16} className="text-gray-400" /> {profileData.location}</span>
                  <span className="flex items-center gap-2 text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1 rounded-full text-xs font-bold leading-none"><ShieldCheck size={14} /> Active Account</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
          {isLoading ? (
            <Skeleton className="h-7 w-48 mb-4" />
          ) : (
            <h2 className="text-lg font-black text-gray-900 dark:text-white border-b border-gray-50 dark:border-gray-800 pb-4">Personal Information</h2>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Full Name', value: profileData.name, icon: null },
              { label: 'Email Address', value: profileData.email, icon: Mail },
              { label: 'Phone Number', value: profileData.phone, icon: Phone },
              { label: 'Department', value: profileData.department, icon: Building },
            ].map((field, i) => (
              <div key={i} className="space-y-1">
                {isLoading ? (
                  <Skeleton className="h-3 w-20 ml-1 mb-1" />
                ) : (
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">{field.label}</label>
                )}
                {isLoading ? (
                  <Skeleton className="h-[52px] w-full rounded-2xl" />
                ) : (
                  <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl font-bold text-gray-800 dark:text-gray-200 truncate" title={field.value}>
                    {field.icon && <field.icon size={16} className="text-gray-400 shrink-0" />} <span className="truncate">{field.value}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
          </div>
        </div>

      <div className="space-y-8">
        <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
          {isLoading ? (
            <Skeleton className="h-7 w-64 mb-4" />
          ) : (
            <h2 className="text-lg font-black text-gray-900 dark:text-white border-b border-gray-50 dark:border-gray-800 pb-4">Platform Privileges & Details</h2>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { label: 'Superadmin UID', value: 'SYS-ROOT-001', icon: null },
              { label: 'Join Date', value: 'Jan 15, 2026', icon: Calendar },
              { label: 'Deployment Hub', value: 'US East (N. Virginia)', icon: MapPin },
              { label: 'Global Control Node', value: 'Manhattan HQ Node', icon: Building },
              { label: 'Master Access Key', value: '****-****-X9Y2', icon: Key },
              { label: 'Compliance Standard', value: 'SOC 2 Type II & ISO 27001', icon: ShieldCheck, color: 'emerald' },
            ].map((field, i) => (
              <div key={i} className="space-y-1">
                {isLoading ? (
                  <Skeleton className="h-3 w-24 ml-1 mb-1" />
                ) : (
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">{field.label}</label>
                )}
                {isLoading ? (
                  <Skeleton className="h-[52px] w-full rounded-2xl" />
                ) : (
                  <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl font-bold text-gray-800 dark:text-gray-200 truncate">
                    {field.icon && <field.icon size={16} className={`${field.color === 'emerald' ? 'text-emerald-500' : 'text-gray-400'} shrink-0`} />} <span className="truncate">{field.value}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
          {isLoading ? (
            <Skeleton className="h-7 w-80 mb-4" />
          ) : (
            <h2 className="text-lg font-black text-gray-900 dark:text-white border-b border-gray-50 dark:border-gray-800 pb-4">Platform Management Configuration</h2>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Deployment Domain', value: 'admin.trackforce.io', icon: Globe, highlight: true },
              { label: 'Access Level', value: 'System Administrator (Tier 0)', icon: ShieldCheck, emerald: true },
              { label: 'System Nodes', value: 'Global Infrastructure', icon: Users },
              { label: 'Next Audit', value: 'Dec 31, 2026', icon: Calendar },
            ].map((field, i) => (
              <div key={i} className="space-y-1">
                {isLoading ? (
                  <Skeleton className="h-3 w-28 ml-1 mb-1" />
                ) : (
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">{field.label}</label>
                )}
                {isLoading ? (
                  <Skeleton className="h-[52px] w-full rounded-2xl" />
                ) : (
                  <div className={`flex items-center gap-3 p-4 ${field.highlight ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400' : 'bg-gray-50 dark:bg-gray-800/50 text-gray-800 dark:text-gray-200'} rounded-2xl font-bold truncate`}>
                    {field.icon && <field.icon size={16} className={`${field.emerald ? 'text-emerald-500' : (field.highlight ? 'text-indigo-500' : 'text-gray-400')} shrink-0`} />} <span className="truncate">{field.value}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Account Credentials Management */}
        <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 border-b border-gray-50 dark:border-gray-800 pb-4">
            <h2 className="text-lg font-black text-gray-900 dark:text-white">Secure Credentials Management</h2>
            {credentialsMessage.text && (
              <span className={`text-sm font-bold px-4 py-1.5 rounded-2xl ${credentialsMessage.type === 'error' ? 'bg-red-50 text-red-600 dark:bg-red-900/20' : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20'} animate-in fade-in duration-300`}>
                {credentialsMessage.text}
              </span>
            )}
          </div>
          <div className="bg-gray-50 dark:bg-gray-800/40 p-6 md:p-8 rounded-3xl border border-gray-100 dark:border-gray-800">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Update Email */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Mail size={16} className="text-indigo-500" /> Update Email
                </label>
                <input
                  type="email"
                  placeholder="Enter new email"
                  value={credentialsForm.email}
                  onChange={(e) => setCredentialsForm({ ...credentialsForm, email: e.target.value })}
                  className="w-full p-3.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-600 transition-all outline-none"
                />
              </div>

              {/* Current Password */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Key size={16} className="text-amber-500" /> Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="Enter current password"
                    value={credentialsForm.currentPassword}
                    onChange={(e) => setCredentialsForm({ ...credentialsForm, currentPassword: e.target.value })}
                    className="w-full p-3.5 pr-12 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-600 transition-all outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <ShieldCheck size={16} className="text-emerald-500" /> New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={credentialsForm.newPassword}
                    onChange={(e) => setCredentialsForm({ ...credentialsForm, newPassword: e.target.value })}
                    className="w-full p-3.5 pr-12 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-600 transition-all outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <ShieldCheck size={16} className="text-emerald-500" /> Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={credentialsForm.confirmPassword}
                    onChange={(e) => setCredentialsForm({ ...credentialsForm, confirmPassword: e.target.value })}
                    className="w-full p-3.5 pr-12 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-600 transition-all outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex justify-end">
              <button
                onClick={handleUpdateCredentials}
                disabled={isUpdatingCredentials}
                className="px-6 py-3.5 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-200 dark:shadow-none transition-all disabled:opacity-70 flex items-center justify-center gap-2 w-full md:w-auto"
              >
                {isUpdatingCredentials ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                <span>Update Credentials</span>
              </button>
            </div>
          </div>
        </div>

        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 md:p-8 animate-in fade-in duration-300">
          <div 
            className="absolute inset-0 bg-gray-900/60 backdrop-blur-md"
            onClick={() => setIsEditModalOpen(false)}
          ></div>
          <div className="relative bg-white dark:bg-gray-900 w-full max-w-2xl rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-500 flex flex-col max-h-[90vh]">
            
            <div className="p-8 pb-6 border-b border-gray-50 dark:border-gray-800 flex flex-shrink-0 items-start justify-between bg-white dark:bg-gray-900 z-10">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 shadow-sm">
                  <Edit3 size={28} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Edit Profile</h2>
                  <p className="text-sm font-bold text-indigo-600 uppercase tracking-widest mt-1">Personal Information</p>
                </div>
              </div>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-8 overflow-y-auto flex-1 bg-white dark:bg-gray-900">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                  <input 
                    type="text" 
                    value={editForm.name}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    className="w-full p-4 bg-gray-50 dark:bg-gray-800/50 border-none rounded-2xl font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-600 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Role</label>
                  <input 
                    type="text" 
                    value={editForm.role}
                    onChange={(e) => setEditForm({...editForm, role: e.target.value})}
                    className="w-full p-4 bg-gray-50 dark:bg-gray-800/50 border-none rounded-2xl font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-600 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Company</label>
                  <input 
                    type="text" 
                    value={editForm.company}
                    onChange={(e) => setEditForm({...editForm, company: e.target.value})}
                    className="w-full p-4 bg-gray-50 dark:bg-gray-800/50 border-none rounded-2xl font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-600 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Location</label>
                  <input 
                    type="text" 
                    value={editForm.location}
                    onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                    className="w-full p-4 bg-gray-50 dark:bg-gray-800/50 border-none rounded-2xl font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-600 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                  <input 
                    type="email" 
                    value={editForm.email}
                    onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                    className="w-full p-4 bg-gray-50 dark:bg-gray-800/50 border-none rounded-2xl font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-600 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                  <input 
                    type="tel" 
                    value={editForm.phone}
                    onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                    className="w-full p-4 bg-gray-50 dark:bg-gray-800/50 border-none rounded-2xl font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-600 transition-all"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Department</label>
                  <input 
                    type="text" 
                    value={editForm.department}
                    onChange={(e) => setEditForm({...editForm, department: e.target.value})}
                    className="w-full p-4 bg-gray-50 dark:bg-gray-800/50 border-none rounded-2xl font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-600 transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-50 dark:border-gray-800 flex flex-shrink-0 items-center justify-end bg-gray-50 dark:bg-gray-800/40">
              <div className="flex gap-4">
                <button 
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-6 py-3 font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveChanges}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-200 dark:shadow-none transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </>
  );
};

export default Profile;
