import React, { useState, useRef, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Building, ShieldCheck, Camera, Edit3, Key, Briefcase, X, Save, Calendar, Clock, Users, Globe } from 'lucide-react';
import { getMe, updateProfile as updateAuthProfile, uploadProfileImage as uploadAuthImage } from '../../services/core/authService';
import { useAuth } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react';

const Profile = () => {
  const { setPageLoading } = useOutletContext();
  const [avatarPreview, setAvatarPreview] = useState(null);
  const avatarInputRef = useRef(null);
  const { refreshUser } = useAuth();
  
  const [profileData, setProfileData] = useState({
    name: '',
    role: 'Tenant Administrator',
    company: '',
    location: '',
    email: '',
    phone: '',
    department: '',
    _id: ''
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState(profileData);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingAvatar, setIsSavingAvatar] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getMe();
        setProfileData(prev => ({
          ...prev,
          name: data.name || prev.name,
          role: data.profile?.designation || (data.role === 'tenant' ? 'Tenant Administrator' : data.role),
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
        if (setPageLoading) setPageLoading(false);
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
        setIsSavingAvatar(true);
        const response = await uploadAuthImage(formData);
        const imageUrl = response.profileImage;
        setAvatarPreview(imageUrl);
        
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

  const handleEditClick = () => {
    setEditForm(profileData);
    setIsEditModalOpen(true);
  };

  const handleSaveChanges = async () => {
    try {
      const payload = {
        ...editForm,
        designation: editForm.role,
        company: editForm.company,
      };
      const response = await updateAuthProfile(payload);
      setProfileData({
        ...profileData,
        name: response.name,
        email: response.email,
        phone: response.profile?.phone,
        location: response.profile?.location,
        department: response.profile?.department,
        role: response.profile?.designation || editForm.role,
        company: response.company || editForm.company,
      });
      
      // SYNC WITH GLOBAL STATE
      await refreshUser();
      
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert(error.message || 'Failed to update profile');
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
              <div className="w-full h-full rounded-[2rem] bg-gray-50 dark:bg-gray-800/50 flex items-center justify-center text-gray-400 overflow-hidden relative">
                {isLoading ? (
                  <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 animate-pulse" />
                ) : (
                  <>
                    {avatarPreview ? (
                      <img src={avatarPreview.startsWith('data:') ? avatarPreview : (() => {
                        let url = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
                        url = url.replace(/\/$/, '');
                        if (!url.endsWith('/api')) url += '/api';
                        return `${url.replace('/api', '')}${avatarPreview}`;
                      })()} alt="Profile Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <User size={64} strokeWidth={1.5} />
                    )}
                    {isSavingAvatar && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white">
                        <Loader2 className="animate-spin" />
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
            <input 
              type="file" 
              ref={avatarInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleAvatarUpload}
            />
            {!isLoading && (
              <button 
                onClick={() => avatarInputRef.current?.click()}
                disabled={isSavingAvatar}
                className="absolute -bottom-2 -right-2 w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-100 dark:border-gray-700 flex items-center justify-center text-gray-500 hover:text-indigo-600 transition-all z-10 hover:scale-110 active:scale-95"
              >
                <Camera size={20} />
              </button>
            )}
          </div>
          
          <div className="flex-1 text-center md:text-left mt-4 md:mt-0 space-y-3">
            <div className="flex flex-col md:flex-row items-center gap-4 justify-between">
              {isLoading ? (
                <div className="space-y-3">
                  <div className="h-10 w-64 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-2xl" />
                  <div className="h-5 w-48 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-xl" />
                </div>
              ) : (
                <div>
                  <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">{profileData.name}</h1>
                  <p className="text-sm font-bold text-indigo-600 uppercase tracking-widest mt-1">{profileData.role}</p>
                </div>
              )}
              {!isLoading && (
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
                  <div className="h-5 w-32 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg" />
                  <div className="h-5 w-32 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg" />
                </>
              ) : (
                <>
                  <span className="flex items-center gap-2"><Briefcase size={16} className="text-gray-400" /> {profileData.company}</span>
                  <span className="flex items-center gap-2"><MapPin size={16} className="text-gray-400" /> {profileData.location || 'Not Specified'}</span>
                  <span className="flex items-center gap-2 text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1 rounded-full text-xs font-bold leading-none"><ShieldCheck size={14} /> Active Account</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
          <h2 className="text-lg font-black text-gray-900 dark:text-white border-b border-gray-50 dark:border-gray-800 pb-4">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Full Name</label>
                {isLoading ? (
                  <div className="h-12 w-full bg-gray-50 dark:bg-gray-800 animate-pulse rounded-2xl" />
                ) : (
                  <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl font-bold text-gray-800 dark:text-gray-200 border border-transparent truncate" title={profileData.name}>{profileData.name || '---'}</div>
                )}
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Email Address</label>
                {isLoading ? (
                  <div className="h-12 w-full bg-gray-50 dark:bg-gray-800 animate-pulse rounded-2xl" />
                ) : (
                  <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl font-bold text-gray-800 dark:text-gray-200 truncate" title={profileData.email}>
                    <Mail size={16} className="text-gray-400 shrink-0" /> <span className="truncate">{profileData.email || '---'}</span>
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Phone Number</label>
                {isLoading ? (
                  <div className="h-12 w-full bg-gray-50 dark:bg-gray-800 animate-pulse rounded-2xl" />
                ) : (
                  <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl font-bold text-gray-800 dark:text-gray-200 truncate" title={profileData.phone}>
                    <Phone size={16} className="text-gray-400 shrink-0" /> <span className="truncate">{profileData.phone || '---'}</span>
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Department</label>
                {isLoading ? (
                  <div className="h-12 w-full bg-gray-50 dark:bg-gray-800 animate-pulse rounded-2xl" />
                ) : (
                  <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl font-bold text-gray-800 dark:text-gray-200 truncate" title={profileData.department}>
                    <Building size={16} className="text-gray-400 shrink-0" /> <span className="truncate">{profileData.department || '---'}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

      <div className="space-y-8">
        <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
          <h2 className="text-lg font-black text-gray-900 dark:text-white border-b border-gray-50 dark:border-gray-800 pb-4">Professional Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Tenant ID</label>
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl font-bold text-gray-800 dark:text-gray-200 border border-transparent truncate">#TNT-90210-TF</div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Join Date</label>
              <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl font-bold text-gray-800 dark:text-gray-200 truncate">
                <Calendar size={16} className="text-gray-400 shrink-0" /> <span className="truncate">Jan 15, 2026</span>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Workspace Region</label>
              <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl font-bold text-gray-800 dark:text-gray-200 truncate">
                <MapPin size={16} className="text-gray-400 shrink-0" /> <span className="truncate">US East (N. Virginia)</span>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Primary Access Node</label>
              <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl font-bold text-gray-800 dark:text-gray-200 truncate">
                <Building size={16} className="text-gray-400 shrink-0" /> <span className="truncate">Manhattan HQ Node</span>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Tenant License Key</label>
              <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl font-bold text-gray-800 dark:text-gray-200 truncate">
                <Key size={16} className="text-gray-400 shrink-0" /> <span className="truncate">****-****-X9Y2</span>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Compliance Standard</label>
              <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl font-bold text-gray-800 dark:text-gray-200 truncate">
                <ShieldCheck size={16} className="text-emerald-500 shrink-0" /> <span className="truncate">SOC 2 Type II</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
          <h2 className="text-lg font-black text-gray-900 dark:text-white border-b border-gray-50 dark:border-gray-800 pb-4">Tenant Workspace Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Workspace Domain</label>
              <div className="flex items-center gap-3 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl font-bold text-indigo-700 dark:text-indigo-400 border border-transparent truncate">
                <Globe size={16} className="shrink-0" /> <span className="truncate">trackforce.io</span>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Subscription Tier</label>
              <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl font-bold text-gray-800 dark:text-gray-200 truncate">
                <ShieldCheck size={16} className="text-emerald-500 shrink-0" /> <span className="truncate">Enterprise Plus</span>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Total Licenses</label>
              <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl font-bold text-gray-800 dark:text-gray-200 truncate">
                <Users size={16} className="text-gray-400 shrink-0" /> <span className="truncate">1,250 Active Users</span>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Billing Cycle</label>
              <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl font-bold text-gray-800 dark:text-gray-200 truncate">
                <Calendar size={16} className="text-gray-400 shrink-0" /> <span className="truncate">Renews Dec 31, 2026</span>
              </div>
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
                  className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-200 dark:shadow-none transition-all"
                >
                  <Save size={18} />
                  Save Changes
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
