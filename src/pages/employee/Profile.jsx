import React, { useEffect, useRef, useState } from 'react';
import { User, Briefcase, FileText, Activity, LayoutDashboard, Settings, Mail, Phone, MapPin, MoreVertical, ShieldCheck, TrendingUp, ShoppingBag, Map as MapIcon, Clock, HeartPulse, Building, Shield, UserCheck, Calendar, CheckCircle, Download, ExternalLink, Bell, Globe, LogOut, Share2, Eye, EyeOff, Lock, AlertTriangle, Smartphone, Wifi, X } from 'lucide-react';

// --- Internal Section Components ---
// changes
const ProfileHeader = ({ employee, onEditProfile, onOpenSettings }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen]);

  const menuItems = [
    { label: 'Account Settings', icon: Settings, action: () => { setMenuOpen(false); onOpenSettings(); } },
    { label: 'Download Profile PDF', icon: Download, action: () => { setMenuOpen(false); window.print(); } },
    { label: 'Share Profile', icon: Share2, action: () => { setMenuOpen(false); navigator.clipboard?.writeText(window.location.href); } },
    { label: 'Sign Out', icon: LogOut, danger: true, action: () => { setMenuOpen(false); } },
  ];

  return (
    <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-indigo-600 to-indigo-800 p-8 text-white shadow-2xl">
      <div className="absolute top-0 right-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-white/10 blur-3xl opacity-50" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-64 w-64 rounded-full bg-indigo-400/20 blur-3xl opacity-30" />
      <div className="relative flex flex-col md:flex-row md:items-center gap-8">
        <div className="flex-shrink-0">
          <div className="relative">
            <img
              src={employee.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"}
              alt={employee.name}
              className="h-32 w-32 rounded-3xl border-4 border-white/20 object-cover shadow-xl backdrop-blur-sm"
            />
            <div className={`absolute -bottom-2 -right-2 h-8 w-8 rounded-full border-4 border-white flex items-center justify-center ${employee.status === 'On Duty' ? 'bg-emerald-500' : 'bg-gray-400'
              }`}>
              <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
            </div>
          </div>
        </div>
        <div className="flex-grow">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-4xl font-black tracking-tight">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-indigo-100 drop-shadow-sm">
                    {employee.name || "Abhiram R"}
                  </span>
                </h1>
                <span className="flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-widest backdrop-blur-md">
                  <ShieldCheck size={14} />
                  Employee Profile
                </span>
              </div>
              <p className="mt-2 text-lg font-medium text-indigo-100/80">{employee.designation || "Senior Field Executive"} • {employee.team || "Delta Team"}</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onEditProfile}
                className="bg-white text-indigo-600 hover:bg-indigo-50 px-6 py-2.5 rounded-2xl font-bold transition-all hover:scale-105 active:scale-95 shadow-lg whitespace-nowrap"
              >
                Edit Profile
              </button>
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 transition-all backdrop-blur-md"
                >
                  <MoreVertical size={20} />
                </button>
                {menuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-60 sm:w-64 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    {menuItems.map((item, i) => (
                      <button
                        key={i}
                        onClick={item.action}
                        className={`w-full flex items-center gap-3 px-5 py-3.5 text-sm font-bold transition-colors ${item.danger
                          ? 'text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'
                          : 'text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600'
                          } ${i !== 0 ? 'border-t border-gray-50 dark:border-gray-800' : ''}`}
                      >
                        <item.icon size={18} className={item.danger ? 'text-red-500' : 'text-gray-400 group-hover:text-indigo-600'} />
                        <span className="flex-grow text-left">{item.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-6 text-sm">
            <div className="flex items-center gap-2 text-indigo-100/90">
              <Mail size={16} className="text-white" />
              <span>{employee.email || 'abhiram@trackforce.com'}</span>
            </div>
            <div className="flex items-center gap-2 text-indigo-100/90">
              <Phone size={16} className="text-white" />
              <span>{employee.phone || '+91 91234 56789'}</span>
            </div>
            <div className="flex items-center gap-2 text-indigo-100/90">
              <MapPin size={16} className="text-white" />
              <span>{employee.location || 'Bengaluru, Karnataka'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const OverviewSection = ({ employee }) => {
  const stats = [
    { label: 'Visits Today', value: '12', sub: 'Target: 15', icon: TrendingUp, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Orders Taken', value: '8', sub: '₹28,500 Revenue', icon: ShoppingBag, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Distance', value: '18.2 km', sub: 'Travelled today', icon: MapIcon, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Active Hours', value: '5h 20m', sub: 'Current Shift', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, i) => (
        <div key={i} className="group relative overflow-hidden bg-white dark:bg-gray-900 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
          <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} dark:bg-opacity-10 w-fit mb-4 transition-transform group-hover:scale-110`}>
            <stat.icon size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">{stat.label}</p>
            <p className="text-3xl font-black text-gray-900 dark:text-white mt-1">{stat.value}</p>
            <p className="text-[10px] font-bold text-gray-500 mt-1 uppercase">{stat.sub}</p>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 dark:bg-gray-800/50 rounded-full -mr-16 -mt-16 opacity-50 pointer-events-none" />
        </div>
      ))}
    </div>
  );
};

const PersonalInfoSection = ({ employee }) => {
  const infoGroups = [
    {
      title: 'Contact Details',
      icon: Phone,
      items: [
        { label: 'Primary Phone', value: employee.phone || '+91 91234 56789', icon: Phone },
        { label: 'Official Email', value: employee.email || 'abhiram@trackforce.com', icon: Mail },
        { label: 'Residential Address', value: employee.address || 'Indiranagar, Bengaluru, KA', icon: MapPin },
      ]
    },
    {
      title: 'Identification',
      icon: User,
      items: [
        { label: 'Full Name', value: employee.name || 'Abhiram Rangoon', icon: User },
        { label: 'Gender', value: employee.gender || 'Male', icon: User },
        { label: 'Nationality', value: employee.nationality || 'Indian', icon: User },
      ]
    },
    {
      title: 'Health & Emergency',
      icon: HeartPulse,
      items: [
        { label: 'Blood Group', value: employee.bloodGroup || 'A+ Positive', icon: HeartPulse },
        { label: 'Emergency Contact', value: employee.emergencyContact || 'Deepika (Sister) - 9876543210', icon: Phone },
      ]
    }
  ];
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {infoGroups.map((group, i) => (
        <div key={i} className="bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600">
              <group.icon size={20} />
            </div>
            <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">{group.title}</h3>
          </div>
          <div className="space-y-6">
            {group.items.map((item, j) => (
              <div key={j} className="group">
                <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-2">
                  <item.icon size={12} />
                  {item.label}
                </p>
                <p className="mt-2 text-sm font-bold text-gray-700 dark:text-gray-200 leading-relaxed group-hover:text-indigo-600 transition-colors">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const EmploymentSection = () => {
  const details = [
    { label: 'Employee Code', value: 'TF-EXE-402', icon: Briefcase },
    { label: 'Date of Join', value: '15 June 2023', icon: Calendar },
    { label: 'Designation', value: 'Senior Field Executive', icon: Building },
    { label: 'Work Area', value: 'Central Bengaluru Zone', icon: Clock },
    { label: 'Reporting To', value: 'Ananya Sharma (Manager)', icon: UserCheck },
    { label: 'Security Level', value: 'Field Access - Level 1', icon: Shield },
  ];
  return (
    <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 p-10 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-full blur-3xl -mr-32 -mt-32" />
      <div className="relative">
        <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-10 tracking-tight">Employment Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-10">
          {details.map((detail, i) => (
            <div key={i} className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400">
                <detail.icon size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">{detail.label}</p>
                <p className="mt-1 text-base font-black text-gray-800 dark:text-gray-200">{detail.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const DocumentsSection = () => {
  const documents = [
    { name: 'Kyc Document (Aadhar)', size: '1.2 MB', type: 'PDF', status: 'Verified' },
    { name: 'PAN Clearance', size: '0.9 MB', type: 'PDF', status: 'Verified' },
    { name: 'Field Certification', size: '2.1 MB', type: 'PDF', status: 'Active' },
    { name: 'Monthly Performance Card', size: '1.4 MB', type: 'PDF', status: 'Pending Review' },
  ];
  return (
    <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 p-10">
      <div className="flex items-center justify-between mb-10">
        <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Your Documents</h3>
        <button className="text-sm font-bold text-indigo-600 hover:text-indigo-700 underline flex items-center gap-2">
          <Download size={16} />
          Export All
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {documents.map((doc, i) => (
          <a
            key={i}
            href="#"
            onClick={(e) => { e.preventDefault(); window.open('about:blank', '_blank'); }}
            className="group p-6 rounded-3xl border border-gray-50 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20 flex items-center justify-between hover:border-indigo-100 dark:hover:border-indigo-900/50 hover:bg-white dark:hover:bg-gray-800 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-5">
              <div className={`p-4 rounded-2xl ${doc.type === 'PDF' ? 'bg-indigo-50 text-indigo-600' : 'bg-green-50 text-green-600'} dark:bg-opacity-10`}>
                <FileText size={24} />
              </div>
              <div>
                <p className="font-bold text-gray-900 dark:text-white">{doc.name}</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{doc.size} • {doc.type}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${doc.status.includes('Verified') || doc.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'
                }`}>
                {(doc.status.includes('Verified') || doc.status === 'Active') && <CheckCircle size={12} />}
                {doc.status}
              </span>
              <div className="p-2 text-gray-400 hover:text-indigo-600 transition-colors">
                <ExternalLink size={18} />
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

// --- Edit Profile Modal ---

const EditProfileModal = ({ isOpen, onClose, employee, onSaveProfile }) => {
  const [name, setName] = useState(employee.name || '');
  const [email, setEmail] = useState(employee.email || '');
  const [phone, setPhone] = useState(employee.phone || '');
  const [location, setLocation] = useState(employee.location || '');
  const [address, setAddress] = useState(employee.address || '');
  const [gender, setGender] = useState(employee.gender || '');
  const [nationality, setNationality] = useState(employee.nationality || '');
  const [bloodGroup, setBloodGroup] = useState(employee.bloodGroup || '');
  const [emergencyContact, setEmergencyContact] = useState(employee.emergencyContact || '');
  const [avatarUrl, setAvatarUrl] = useState(employee.avatar || '');
  const [avatarFile, setAvatarFile] = useState(null);
  const [profileError, setProfileError] = useState('');
  const [saveToast, setSaveToast] = useState({ open: false, message: '' });
  const toastTimerRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    setName(employee.name || '');
    setEmail(employee.email || '');
    setPhone(employee.phone || '');
    setLocation(employee.location || '');
    setAddress(employee.address || '');
    setGender(employee.gender || '');
    setNationality(employee.nationality || '');
    setBloodGroup(employee.bloodGroup || '');
    setEmergencyContact(employee.emergencyContact || '');
    setAvatarUrl(employee.avatar || '');
    setAvatarFile(null);
    setProfileError('');
    setSaveToast({ open: false, message: '' });
  }, [isOpen, employee]);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
        toastTimerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!avatarFile) return undefined;
    const objectUrl = URL.createObjectURL(avatarFile);
    setAvatarUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [avatarFile]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prevOverflow; };
  }, [isOpen]);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setProfileError('');
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    if (!trimmedName) return setProfileError('Name is required.');
    if (!trimmedEmail) return setProfileError('Email is required.');

    const updates = {
      name: trimmedName,
      email: trimmedEmail,
      phone: phone.trim(),
      location: location.trim(),
      address: address.trim(),
      gender: gender.trim(),
      nationality: nationality.trim(),
      bloodGroup: bloodGroup.trim(),
      emergencyContact: emergencyContact.trim(),
      avatar: avatarUrl || employee.avatar,
    };

    onSaveProfile(updates);

    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setSaveToast({ open: true, message: 'Profile updated successfully.' });
    toastTimerRef.current = setTimeout(() => {
      setSaveToast((t) => ({ ...t, open: false }));
      toastTimerRef.current = null;
    }, 800);

    onClose();
  };

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? '' : 'pointer-events-none'}`} aria-hidden={!isOpen}>
      <style>{`
        .tf-modal-scroll::-webkit-scrollbar { width: 0px; height: 0px; }
        .tf-modal-scroll { scrollbar-width: none; -ms-overflow-style: none; }
      `}</style>
      <div
        className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />

      {/* Toast notification */}
      <div className="fixed inset-0 z-[60] pointer-events-none flex items-start justify-center p-4 sm:p-6">
        <div className={`transition-all duration-200 ${saveToast.open ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
          <div className="rounded-2xl px-4 py-3 sm:px-5 sm:py-4 shadow-2xl border text-sm font-black flex items-center gap-2 bg-emerald-50 text-emerald-800 border-emerald-100">
            <CheckCircle size={16} />
            <span>{saveToast.message}</span>
          </div>
        </div>
      </div>

      <div
        className={`absolute left-1/2 top-1/2 w-[calc(100%-2rem)] max-w-3xl -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-950 shadow-2xl border border-gray-100 dark:border-gray-800 rounded-[2.5rem] transition-all duration-300 ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        role="dialog"
        aria-modal="true"
        aria-label="Edit Profile"
      >
        <div className="max-h-[calc(100vh-2rem)] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-6 sm:p-8 border-b border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600">
                    <User size={18} />
                  </div>
                  <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Edit Profile</h2>
                </div>
                <p className="mt-2 text-sm font-medium text-gray-500">Update your personal information and contact details.</p>
              </div>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-2xl bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-200 font-bold hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>

          {/* Scrollable body */}
          <div className="tf-modal-scroll flex-1 overflow-y-auto p-6 sm:p-8">
            <form onSubmit={handleSaveProfile} className="space-y-6">
              {/* Avatar */}
              <div className="flex items-center gap-5 mb-2">
                <img
                  src={avatarUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"}
                  alt="Profile"
                  className="h-16 w-16 rounded-2xl object-cover border border-gray-200 dark:border-gray-800"
                />
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Profile picture</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
                    className="block text-sm font-bold text-gray-700 dark:text-gray-200 file:mr-4 file:py-2 file:px-4 file:rounded-2xl file:border-0 file:text-sm file:font-black file:bg-white dark:file:bg-gray-900 file:text-indigo-600 file:shadow-sm hover:file:bg-indigo-50 dark:hover:file:bg-gray-800"
                  />
                  <p className="text-xs text-gray-500">PNG/JPG recommended. Preview updates immediately.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Name</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white font-bold outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400"
                    placeholder="Your name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Email</label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white font-bold outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400"
                    placeholder="you@company.com"
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Phone</label>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    type="tel"
                    className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white font-bold outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400"
                    placeholder="+91 9XXXXXXXXX"
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Location</label>
                  <input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white font-bold outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400"
                    placeholder="City, State"
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Address</label>
                  <input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white font-bold outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400"
                    placeholder="Street, Area, City"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Gender</label>
                  <input
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white font-bold outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400"
                    placeholder="Male / Female / Other"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Nationality</label>
                  <input
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white font-bold outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400"
                    placeholder="Indian"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Blood Group</label>
                  <input
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white font-bold outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400"
                    placeholder="A+"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Emergency Contact</label>
                  <input
                    value={emergencyContact}
                    onChange={(e) => setEmergencyContact(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white font-bold outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400"
                    placeholder="Name (Relation) - Phone"
                  />
                </div>
              </div>

              {profileError ? (
                <div className="rounded-2xl bg-orange-50 text-orange-800 border border-orange-100 px-4 py-3 text-sm font-bold">
                  {profileError}
                </div>
              ) : null}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-3 rounded-2xl bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-200 font-black hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-2xl bg-indigo-600 text-white font-black hover:bg-indigo-700 transition-colors shadow-lg"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Account Settings Panel (Password Only) ---

const Toggle = ({ checked, onChange }) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${checked ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'
      }`}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'
        }`}
    />
  </button>
);

const AccountSettingsPanel = ({ isOpen, onClose, employee, onSaveProfile }) => {
  // --- Preferences state ---
  const [displayName, setDisplayName] = useState(employee.name || '');
  const [language, setLanguage] = useState('en');
  const [timezone, setTimezone] = useState('Asia/Kolkata');
  const [theme, setTheme] = useState('system');
  const [prefSaved, setPrefSaved] = useState(false);

  // --- Notification state ---
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);
  const [shiftReminders, setShiftReminders] = useState(true);
  const [orderAlerts, setOrderAlerts] = useState(true);
  const [notifSaved, setNotifSaved] = useState(false);

  // --- Security state ---
  const [twoFA, setTwoFA] = useState(false);
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState('30');
  const [secSaved, setSecSaved] = useState(false);

  // --- Password state ---
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSaved, setPasswordSaved] = useState(false);

  const toastTimerRef = useRef(null);

  const showToast = (setter) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setter(true);
    toastTimerRef.current = setTimeout(() => { setter(false); toastTimerRef.current = null; }, 2000);
  };

  useEffect(() => {
    if (!isOpen) return;
    setDisplayName(employee.name || '');
    setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
    setPasswordError('');
    setPrefSaved(false); setNotifSaved(false); setSecSaved(false); setPasswordSaved(false);
  }, [isOpen, employee]);

  useEffect(() => () => { if (toastTimerRef.current) clearTimeout(toastTimerRef.current); }, []);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [isOpen]);

  const handleSavePrefs = (e) => {
    e.preventDefault();
    onSaveProfile({ name: displayName });
    showToast(setPrefSaved);
  };

  const handleSaveNotif = (e) => {
    e.preventDefault();
    showToast(setNotifSaved);
  };

  const handleSaveSecurity = (e) => {
    e.preventDefault();
    showToast(setSecSaved);
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    setPasswordError('');
    if (!currentPassword || !newPassword || !confirmPassword)
      return setPasswordError('Please fill all password fields.');
    if (newPassword.length < 8)
      return setPasswordError('New password must be at least 8 characters.');
    if (newPassword !== confirmPassword)
      return setPasswordError('Passwords do not match.');
    if (newPassword === currentPassword)
      return setPasswordError('New password must differ from current.');
    onSaveProfile({ password: newPassword });
    setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
    showToast(setPasswordSaved);
  };

  const SectionCard = ({ title, icon: Icon, children, onSubmit, saved, submitLabel = 'Save Changes' }) => (
    <form onSubmit={onSubmit} className="bg-gray-50/60 dark:bg-gray-900/30 rounded-[2rem] border border-gray-100 dark:border-gray-800 p-6 sm:p-7 mb-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600"><Icon size={18} /></div>
        <h3 className="text-lg font-black text-gray-900 dark:text-white tracking-tight">{title}</h3>
      </div>
      {children}
      <div className="mt-5 flex items-center justify-between gap-3">
        {saved ? (
          <span className="flex items-center gap-1.5 text-sm font-bold text-emerald-600">
            <CheckCircle size={15} /> Saved!
          </span>
        ) : <span />}
        <button type="submit" className="px-5 py-2.5 rounded-2xl bg-indigo-600 text-white font-black hover:bg-indigo-700 transition-colors shadow-md text-sm">
          {submitLabel}
        </button>
      </div>
    </form>
  );

  const ToggleRow = ({ label, sub, checked, onChange }) => (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800 last:border-0">
      <div>
        <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{label}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );

  const inputCls = "w-full px-4 py-3 rounded-2xl bg-white dark:bg-gray-900/40 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white font-bold outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 text-sm";
  const selectCls = "w-full px-4 py-3 rounded-2xl bg-white dark:bg-gray-900/40 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white font-bold outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 text-sm appearance-none";

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? '' : 'pointer-events-none'}`} aria-hidden={!isOpen}>
      <style>{`
        .tf-settings-scroll::-webkit-scrollbar { width: 0px; height: 0px; }
        .tf-settings-scroll { scrollbar-width: none; -ms-overflow-style: none; }
      `}</style>
      <div
        className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />
      <div
        className={`absolute left-1/2 top-1/2 w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-950 shadow-2xl border border-gray-100 dark:border-gray-800 rounded-[2.5rem] transition-all duration-300 ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        role="dialog" aria-modal="true" aria-label="Account Settings"
      >
        <div className="max-h-[calc(100vh-2rem)] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-6 sm:p-8 border-b border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur flex-shrink-0">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600"><Settings size={18} /></div>
                <div>
                  <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Account Settings</h2>
                  <p className="text-sm font-medium text-gray-500">Manage preferences, notifications & security</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 rounded-2xl bg-gray-100 dark:bg-gray-900 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="tf-settings-scroll flex-1 overflow-y-auto p-5 sm:p-7">


            {/* 1. Notification Settings */}
            <SectionCard title="Notification Settings" icon={Bell} onSubmit={handleSaveNotif} saved={notifSaved}>
              <ToggleRow label="Email Notifications" sub="Get updates via your registered email" checked={emailNotif} onChange={setEmailNotif} />
              <ToggleRow label="Push Notifications" sub="Browser & mobile push alerts" checked={pushNotif} onChange={setPushNotif} />
              <ToggleRow label="Shift Reminders" sub="Reminders before your shift starts" checked={shiftReminders} onChange={setShiftReminders} />
              <ToggleRow label="Order & Task Alerts" sub="Real-time alerts on new orders" checked={orderAlerts} onChange={setOrderAlerts} />
              <ToggleRow label="Weekly Performance Digest" sub="Summary of your weekly activity" checked={weeklyDigest} onChange={setWeeklyDigest} />
            </SectionCard>

            {/* 3. Privacy & Security */}
            <SectionCard title="Privacy & Security" icon={Shield} onSubmit={handleSaveSecurity} saved={secSaved}>
              <ToggleRow label="Two-Factor Authentication" sub="Use OTP to verify on new logins" checked={twoFA} onChange={setTwoFA} />
              <ToggleRow label="Login Activity Alerts" sub="Email me on new sign-in events" checked={loginAlerts} onChange={setLoginAlerts} />
              <div className="py-3 border-b border-gray-100 dark:border-gray-800">
                <p className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-2">Session Timeout</p>
                <select value={sessionTimeout} onChange={(e) => setSessionTimeout(e.target.value)} className={selectCls}>
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="240">4 hours</option>
                  <option value="never">Never</option>
                </select>
              </div>
              <div className="py-3">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Active Sessions</p>
                <div className="space-y-2">
                  {[
                    { device: 'Chrome — Windows 11', loc: 'Bengaluru, IN', current: true },
                    { device: 'TrackForce Mobile App', loc: 'Bengaluru, IN', current: false },
                  ].map((s, i) => (
                    <div key={i} className="flex items-center justify-between bg-white dark:bg-gray-900 rounded-2xl px-4 py-3 border border-gray-100 dark:border-gray-800">
                      <div className="flex items-center gap-3">
                        <Smartphone size={16} className="text-indigo-500" />
                        <div>
                          <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{s.device}</p>
                          <p className="text-xs text-gray-400">{s.loc}</p>
                        </div>
                      </div>
                      {s.current
                        ? <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">Current</span>
                        : <button type="button" className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors">Revoke</button>
                      }
                    </div>
                  ))}
                </div>
              </div>
            </SectionCard>

            {/* 4. Change Password */}
            <form onSubmit={handleChangePassword} className="bg-gray-50/60 dark:bg-gray-900/30 rounded-[2rem] border border-gray-100 dark:border-gray-800 p-6 sm:p-7">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600"><Lock size={18} /></div>
                <h3 className="text-lg font-black text-gray-900 dark:text-white tracking-tight">Change Password</h3>
              </div>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Current Password</label>
                  <div className="relative">
                    <input value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} type={showCurrent ? 'text' : 'password'} className={inputCls + ' pr-11'} placeholder="••••••••" />
                    <button type="button" onClick={() => setShowCurrent(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600">
                      {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">New Password</label>
                  <div className="relative">
                    <input value={newPassword} onChange={(e) => setNewPassword(e.target.value)} type={showNew ? 'text' : 'password'} className={inputCls + ' pr-11'} placeholder="Minimum 8 characters" />
                    <button type="button" onClick={() => setShowNew(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600">
                      {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {newPassword.length > 0 && (
                    <div className="flex gap-1 mt-1">
                      {[8, 12, 16].map((n, i) => (
                        <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${newPassword.length >= n ? (i === 0 ? 'bg-orange-400' : i === 1 ? 'bg-yellow-400' : 'bg-emerald-500') : 'bg-gray-200'
                          }`} />
                      ))}
                      <span className="text-[10px] font-bold text-gray-400 ml-1">
                        {newPassword.length < 8 ? 'Weak' : newPassword.length < 12 ? 'Fair' : newPassword.length < 16 ? 'Good' : 'Strong'}
                      </span>
                    </div>
                  )}
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Confirm New Password</label>
                  <input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} type="password" className={inputCls} placeholder="Re-enter new password" />
                </div>
              </div>
              {passwordError && (
                <div className="mt-4 rounded-2xl bg-orange-50 text-orange-800 border border-orange-100 px-4 py-3 text-sm font-bold flex items-center gap-2">
                  <AlertTriangle size={15} />{passwordError}
                </div>
              )}
              <div className="mt-5 flex items-center justify-between">
                {passwordSaved
                  ? <span className="flex items-center gap-1.5 text-sm font-bold text-emerald-600"><CheckCircle size={15} /> Password updated!</span>
                  : <span />}
                <button type="submit" className="px-5 py-2.5 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black hover:opacity-90 transition-opacity shadow-md text-sm">
                  Update Password
                </button>
              </div>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Page Component ---

const EmployeeProfile = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  const [employee, setEmployee] = useState({
    name: 'Abhiram Rangoon',
    designation: 'Senior Field Executive',
    team: 'Delta Team',
    status: 'On Duty',
    email: 'abhiram@trackforce.com',
    phone: '+91 91234 56789',
    location: 'Bengaluru, Karnataka',
    address: 'Indiranagar, Bengaluru, KA',
    gender: 'Male',
    nationality: 'Indian',
    bloodGroup: 'A+ Positive',
    emergencyContact: 'Deepika (Sister) - 9876543210',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'
  });

  const tabs = [
    { id: 'overview', label: 'My Dashboard', icon: LayoutDashboard },
    { id: 'personal', label: 'Profile Info', icon: User },
    { id: 'employment', label: 'Work Details', icon: Briefcase },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'activity', label: 'My Timeline', icon: Activity },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <OverviewSection employee={employee} />
            <div className="grid grid-cols-1 gap-10">
              <EmploymentSection />
              <DocumentsSection />
            </div>
          </div>
        );
      case 'personal':
        return <div className="animate-in fade-in slide-in-from-bottom-4 duration-500"><PersonalInfoSection employee={employee} /></div>;
      case 'employment':
        return <div className="animate-in fade-in slide-in-from-bottom-4 duration-500"><EmploymentSection /></div>;
      case 'documents':
        return <div className="animate-in fade-in slide-in-from-bottom-4 duration-500"><DocumentsSection /></div>;
      case 'activity':
        return <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 p-10 text-center">
            <Activity className="mx-auto text-indigo-600 mb-4" size={48} />
            <p className="text-gray-500">Please visit the dedicated Activity page for full log.</p>
          </div>
        </div>;
      default:
        return <OverviewSection employee={employee} />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-20 px-4 sm:px-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Your Portfolio</h1>
          <p className="text-gray-500 font-medium">Manage your field performance and professional records</p>
        </div>
      </div>

      <ProfileHeader employee={employee} onEditProfile={() => setIsEditProfileOpen(true)} onOpenSettings={() => setIsSettingsOpen(true)} />

      <div className="mt-12 mb-10 overflow-x-auto pb-4">
        <div className="flex items-center gap-2 p-1.5 bg-gray-100/50 dark:bg-gray-800/40 backdrop-blur-md rounded-[2.5rem] w-fit border border-gray-100 dark:border-gray-800">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-6 py-4 rounded-[2rem] text-sm font-black transition-all whitespace-nowrap ${activeTab === tab.id
                ? 'bg-white dark:bg-gray-900 text-indigo-600 shadow-xl scale-105'
                : 'text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
            >
              <tab.icon size={18} className={activeTab === tab.id ? 'text-indigo-600' : 'text-gray-400'} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {renderContent()}

      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        employee={employee}
        onSaveProfile={(updates) => setEmployee((prev) => ({ ...prev, ...updates }))}
      />

      <AccountSettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        employee={employee}
        onSaveProfile={(updates) => setEmployee((prev) => ({ ...prev, ...updates }))}
      />
    </div>
  );
};

export default EmployeeProfile;
