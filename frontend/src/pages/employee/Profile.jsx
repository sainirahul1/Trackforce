import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
// import { User, Briefcase, FileText, Activity, LayoutDashboard, Settings, Mail, Phone, MapPin, MoreVertical, ShieldCheck, TrendingUp, ShoppingBag, Map as MapIcon, Clock, HeartPulse, Building, Shield, UserCheck, Calendar, CheckCircle, Download, ExternalLink, Bell, Globe, LogOut, Share2, Eye, EyeOff, Lock, AlertTriangle, Smartphone, Wifi, X, MessageSquare, Copy, Pencil, UploadCloud, ChevronDown, CheckCircle2, Filter, Search, GripVertical, MoreHorizontal, Info, Users, Menu } from 'lucide-react';
import { User, Briefcase, FileText, Activity, LayoutDashboard, Settings, Mail, Phone, MapPin, MoreVertical, ShieldCheck, TrendingUp, ShoppingBag, Map as MapIcon, Clock, HeartPulse, Building, Shield, UserCheck, Calendar, CheckCircle, Download, ExternalLink, Bell, Globe, LogOut, Share2, Eye, EyeOff, Lock, AlertTriangle, Smartphone, Wifi, X, MessageSquare, Copy, Pencil, UploadCloud, ChevronDown, CheckCircle2, Filter, Search, GripVertical, MoreHorizontal, Info, Users, Menu, Plus, Trash2, Camera, Loader2 } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';
import { uploadProfileImage } from '../../services/authService';
import { getMyProfile, updateMyProfile, changePassword } from '../../services/profileService';
import { fetchDocuments, uploadDocument, updateDocumentService, deleteDocumentService } from '../../services/documentService';

const ScrollStyles = () => (
  <style>{`
    .tf-modal-scroll::-webkit-scrollbar,
    .tf-settings-scroll::-webkit-scrollbar {
      width: 5px;
    }
    .tf-modal-scroll::-webkit-scrollbar-track,
    .tf-settings-scroll::-webkit-scrollbar-track {
      background: transparent;
    }
    .tf-modal-scroll::-webkit-scrollbar-thumb,
    .tf-settings-scroll::-webkit-scrollbar-thumb {
      background: #e2e8f0;
      border-radius: 10px;
    }
    .dark .tf-modal-scroll::-webkit-scrollbar-thumb,
    .dark .tf-settings-scroll::-webkit-scrollbar-thumb {
      background: #1e293b;
    }
    .tf-modal-scroll::-webkit-scrollbar-thumb:hover,
    .tf-settings-scroll::-webkit-scrollbar-thumb:hover {
      background: #cbd5e1;
    }
    .dark .tf-modal-scroll::-webkit-scrollbar-thumb:hover,
    .dark .tf-settings-scroll::-webkit-scrollbar-thumb:hover {
      background: #334155;
    }
  `}</style>
);

// --- Internal Section Components ---
// changes

const ShareProfileModal = ({ isOpen, onClose, employee }) => {
  const profileUrl = window.location.href;
  const [copied, setCopied] = useState(false);

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

  const handleCopy = () => {
    navigator.clipboard?.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${employee.name}'s Profile`,
          text: `Check out ${employee.name}'s professional portfolio on TrackForce.`,
          url: profileUrl,
        });
      } catch (err) {
        console.log('Share failed:', err);
      }
    }
  };

  const shareOptions = [
    {
      name: 'WhatsApp',
      icon: MessageSquare,
      color: 'bg-[#25D366]/10 text-[#25D366]',
      action: () => window.open(`https://wa.me/?text=${encodeURIComponent(`Check out ${employee.name}'s professional profile: ${profileUrl}`)}`, '_blank')
    },
    {
      name: 'Email',
      icon: Mail,
      color: 'bg-slate-50 text-slate-900',
      action: () => window.location.href = `mailto:?subject=${encodeURIComponent(`${employee.name}'s Profile Portfolio`)}&body=${encodeURIComponent(`Check out this professional profile: ${profileUrl}`)}`
    },
    {
      name: 'Copy Link',
      icon: copied ? CheckCircle : Copy,
      color: copied ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-900',
      action: handleCopy
    },
  ];

  return (
    <div className={`fixed inset-0 z-[200] flex items-center justify-center p-4 transition-all duration-300 ${isOpen ? '' : 'pointer-events-none'}`}>
      <div className={`absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`} />
      <div className={`relative w-[calc(100%-2rem)] max-w-sm bg-white dark:bg-gray-950 rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 p-6 sm:p-8 transition-all duration-300 transform ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 sm:p-3 rounded-2xl bg-slate-900 text-white"><Share2 size={20} /></div>
            <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Share Profile</h3>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-all"><X size={20} /></button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {shareOptions.map((opt, i) => (
            <button
              key={i}
              onClick={opt.action}
              className="flex items-center gap-4 p-4 rounded-2xl border border-slate-50 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all group"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${opt.color}`}>
                <opt.icon size={24} />
              </div>
              <span className="font-bold text-gray-700 dark:text-gray-200">{opt.name}</span>
            </button>
          ))}
          {navigator.share && (
            <button
              onClick={handleNativeShare}
              className="mt-2 w-full py-4 rounded-2xl bg-slate-900 text-white font-black shadow-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
            >
              <Globe size={18} />
              More Sharing Options
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const ProfileUnifiedOverlay = ({ isOpen, onClose, employee, documents, activeTab, setActiveTab, onEditDocument, onViewDocument, onDeleteDocument, onEditProfile, onSaveProfile }) => {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
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

  const navItems = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex animate-in fade-in duration-300 backdrop-blur-xl bg-white/10 dark:bg-black/20">
      {/* Sidebar Mockup */}
      <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 flex flex-col hidden lg:flex">
        <div className="p-6 flex items-center justify-between border-b border-gray-50 dark:border-gray-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl rotate-3 shrink-0">
              <ShieldCheck size={24} />
            </div>
            <span className="text-[22px] font-black italic tracking-tighter text-gray-900 dark:text-white pt-0.5">TrackForce</span>
          </div>
        </div>
        <div className="flex-1 p-4 space-y-2">
          <p className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Profile Sections</p>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${activeTab === item.id
                ? 'bg-indigo-50 text-indigo-600 shadow-inner dark:bg-indigo-900/20'
                : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                }`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
        <div className="p-4 border-t border-gray-100 dark:border-gray-800">
          <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 font-bold shrink-0 overflow-hidden">
              {employee.avatar ? (
                <img 
                  src={employee.avatar.startsWith('data:') ? employee.avatar : (employee.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix")} 
                  alt="DP" 
                  className="w-full h-full object-cover" 
                />
              ) : (
                employee.name.charAt(0)
              )}
            </div>
            <div className="min-w-0">
              <p className="font-black text-gray-900 dark:text-white text-sm truncate">{employee.name}</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest truncate">{employee.designation}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 bg-gray-50 dark:bg-gray-950 flex flex-col relative overflow-hidden">
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] -mr-64 -mt-64 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] -ml-64 -mb-64 pointer-events-none" />

        {/* Top Header with Horizontal Navigation - Hidden when password modal is open */}
        {!isPasswordModalOpen && (
          <header className="h-24 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 flex items-center justify-between px-8 sticky top-0 z-20 transition-all shrink-0 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex items-center gap-8">
              <button onClick={onClose} className="lg:hidden p-2.5 rounded-2xl bg-gray-50 dark:bg-gray-800 text-gray-400 hover:text-indigo-600 transition-all">
                <Menu size={20} />
              </button>
              <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Your Profile</h2>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={onClose} className="p-3 bg-gray-50 dark:bg-gray-800 text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-2xl transition-all shadow-sm">
                <X size={20} />
              </button>
            </div>
          </header>
        )}
        <div className="flex-1 overflow-y-auto p-8 lg:p-12 tf-modal-scroll relative z-10">
          <div className="max-w-6xl mx-auto">
            {activeTab === 'personal' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col gap-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-1">Personal Details</h3>
                      <p className="text-gray-500 font-medium">Your verified identity and health records</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-8">
                    <PersonalInfoContent employee={employee} />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'documents' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col gap-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-1">Verified Documents</h3>
                      <p className="text-gray-500 font-medium">Access and manage your professional credentials</p>
                    </div>
                    <button className="flex items-center gap-2 px-6 py-2.5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl font-black text-sm text-gray-900 dark:text-white hover:bg-gray-50 transition-all shadow-sm">
                      <Download size={18} /> Export Records
                    </button>
                  </div>
                  <div className="flex flex-col gap-8">
                    <DocumentsContent documents={documents} onEditDocument={onEditDocument} onViewDocument={onViewDocument} onDeleteDocument={onDeleteDocument} />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col gap-8">
                  <div className="flex items-center justify-between">
                    <SettingsContent
                      employee={employee}
                      onSaveProfile={onSaveProfile}
                      isPasswordModalOpen={isPasswordModalOpen}
                      setIsPasswordModalOpen={setIsPasswordModalOpen}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

// --- Content Sub-components for Overlay ---

const PersonalInfoContent = ({ employee, loading }) => {
  const groups = [
    {
      title: 'Identity & Contact',
      icon: User,
      items: [
        { label: 'Full Name', value: employee?.name, icon: User },
        { label: 'Official Email', value: employee?.email, icon: Mail },
        { label: 'Work Phone', value: employee?.phone, icon: Phone },
        { label: 'Nationality', value: employee?.nationality, icon: Globe },
      ]
    },
    {
      title: 'Residential Address',
      icon: MapPin,
      items: [
        { label: 'Location', value: employee?.location, icon: MapPin },
        { label: 'Home Address', value: employee?.address, icon: Building },
      ]
    },
    {
      title: 'Medical Summary',
      icon: HeartPulse,
      items: [
        { label: 'Blood Group', value: employee?.bloodGroup, icon: HeartPulse },
        { label: 'Emergency Contact', value: employee?.emergencyContact, icon: Phone },
      ]
    }
  ];

  return groups.map((group, idx) => (
    <div key={idx} className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-2xl group-hover:scale-110 transition-transform">
          <group.icon size={20} />
        </div>
        <h4 className="text-lg font-black text-gray-900 dark:text-white tracking-tight">{group.title}</h4>
      </div>
      <div className="flex flex-col gap-6">
        {group.items.map((item, i) => (
          <div key={i} className="flex items-center justify-between gap-4 py-3 border-b border-gray-50 dark:border-gray-800/50 last:border-0 hover:bg-gray-50/50 dark:hover:bg-gray-800/20 -mx-4 px-4 rounded-xl transition-colors">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="p-1.5 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-400 group-hover:text-indigo-500 transition-colors">
                <item.icon size={12} />
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest truncate">{item.label}</p>
            </div>
            {loading ? (
              <div className="h-4 w-32 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-md" />
            ) : (
              <p className="text-sm font-bold text-gray-700 dark:text-gray-200 text-right truncate">{item.value || '---'}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  ));
};

const MOCK_DOCS = [
  { name: 'Aadhaar Card', type: 'PDF', size: '1.2 MB', status: 'Pending Upload' },
  { name: 'PAN Card', type: 'PDF', size: '0.8 MB', status: 'Pending Upload' },
  { name: 'Driving License', type: 'PDF', size: '1.5 MB', status: 'Pending Upload' },
  { name: 'Medical Fitness Cert.', type: 'PDF', size: '2.1 MB', status: 'Pending Upload' },
  { name: 'Background Check Report', type: 'PDF', size: '3.4 MB', status: 'Pending Upload' }
];

const DocumentsContent = ({ documents, onEditDocument, onViewDocument, onAddDocument, onDeleteDocument }) => {
  // Merge real documents with placeholders based on name matching
  const displayDocsBase = MOCK_DOCS.map(mockDoc => {
    const realDoc = (documents || []).find(d => d.name === mockDoc.name);
    return realDoc || mockDoc;
  });

  // Also include any extra documents that aren't in the MOCK_DOCS list
  const extraDocs = (documents || []).filter(d => !MOCK_DOCS.find(m => m.name === d.name));
  const finalDocs = [...displayDocsBase, ...extraDocs];

  return (
    <div className="grid grid-cols-1 gap-8">
      {finalDocs.map((doc, i) => (
        <div
          key={doc._id || i} // Use doc._id if available, otherwise index
          className="group p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 flex flex-col gap-6 hover:border-indigo-500/30 hover:shadow-xl hover:-translate-y-1 transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className={`p-5 rounded-2xl ${doc.type === 'PDF' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'} dark:bg-opacity-10 group-hover:scale-110 transition-transform`}>
                <FileText size={28} />
              </div>
              <div>
                <p className="text-xl font-black text-gray-900 dark:text-white tracking-tight">{doc.name}</p>
                <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-0.5">Professional Document</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {doc._id && (
                <button
                  onClick={() => onDeleteDocument && onDeleteDocument(doc)}
                  className="p-3 rounded-2xl bg-red-50 dark:bg-red-900/20 text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/40 transition-all shadow-sm"
                  title="Delete Document"
                >
                  <Trash2 size={18} />
                </button>
              )}
              <button
                onClick={() => onEditDocument(doc)}
                className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-800 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all shadow-sm"
              >
                <UploadCloud size={18} />
              </button>
              <button
                onClick={() => onViewDocument(doc)}
                className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 transition-all active:scale-95"
              >
                <ExternalLink size={18} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 pt-6 border-t border-gray-50 dark:border-gray-800">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Format</span>
              <span className="text-sm font-bold text-gray-700 dark:text-gray-200">{doc.type}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Size</span>
              <span className="text-sm font-bold text-gray-700 dark:text-gray-200">{doc.size}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</span>
              <span className={`text-sm font-bold ${doc.status === 'Verified' ? 'text-emerald-500' : 'text-orange-500'}`}>{doc.status}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const SettingsContent = ({ employee, onSaveProfile, isPasswordModalOpen, setIsPasswordModalOpen }) => {
  const [displayName, setDisplayName] = useState(employee.name || '');
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(true);
  const [twoFA, setTwoFA] = useState(false);
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState('30');

  const SectionContainer = ({ title, icon: Icon, children }) => (
    <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col gap-6">
      <div className="flex items-center gap-4 mb-2">
        <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-2xl">
          <Icon size={20} />
        </div>
        <h4 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">{title}</h4>
      </div>
      {children}
    </div>
  );

  const SettingRow = ({ label, sub, children }) => (
    <div className="flex items-center justify-between gap-8 py-4 border-b border-gray-50 dark:border-gray-800/50 last:border-0">
      <div className="min-w-0 flex-1">
        <p className="font-bold text-gray-900 dark:text-white truncate">{label}</p>
        <p className="text-xs text-gray-500 font-medium mt-1">{sub}</p>
      </div>
      <div className="shrink-0">
        {children}
      </div>
    </div>
  );

  const inputCls = "px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-900 dark:text-white font-bold outline-none focus:ring-2 focus:ring-indigo-500/30 text-sm w-64 text-right transition-all";

  return (
    <div className="flex flex-col gap-8 pb-12">
      <SectionContainer title="User Preferences" icon={User}>
        <SettingRow label="Display Name" sub="How your name appears across the platform">
          <input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            onBlur={() => onSaveProfile({ name: displayName })}
            className={inputCls}
          />
        </SettingRow>
        <SettingRow label="Language" sub="Select your preferred display language">
          <select className={inputCls}>
            <option>English (US)</option>
            <option>Hindi</option>
            <option>Spanish</option>
          </select>
        </SettingRow>
      </SectionContainer>

      <SectionContainer title="Notifications" icon={Bell}>
        <SettingRow label="Email Updates" sub="Receive shift alerts and company news">
          <Toggle checked={emailNotif} onChange={setEmailNotif} />
        </SettingRow>
        <SettingRow label="Push Alerts" sub="Real-time mobile and desktop notifications">
          <Toggle checked={pushNotif} onChange={setPushNotif} />
        </SettingRow>
      </SectionContainer>

      <SectionContainer title="Security & Privacy" icon={ShieldCheck}>
        <SettingRow label="Two-Factor Auth" sub="Additional security via verification code">
          <Toggle checked={twoFA} onChange={setTwoFA} />
        </SettingRow>
        <SettingRow label="Login Activity Alerts" sub="Notify me on new sign-in events">
          <Toggle checked={loginAlerts} onChange={setLoginAlerts} />
        </SettingRow>
        <SettingRow label="Session Timeout" sub="Auto-logout after period of inactivity">
          <select
            value={sessionTimeout}
            onChange={(e) => setSessionTimeout(e.target.value)}
            className={inputCls}
          >
            <option value="15">15 minutes</option>
            <option value="30">30 minutes</option>
            <option value="60">1 hour</option>
            <option value="240">4 hours</option>
            <option value="never">Never</option>
          </select>
        </SettingRow>

        <div className="mt-6 pt-6 border-t border-gray-50 dark:border-gray-800">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Active Sessions</p>
          <div className="space-y-4">
            {[
              { device: 'Chrome — Windows 11', loc: 'Bengaluru, IN', current: true },
              { device: 'TrackForce Mobile App', loc: 'Bengaluru, IN', current: false },
            ].map((s, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-white dark:bg-gray-900 rounded-lg text-indigo-600 shadow-sm">
                    <Smartphone size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{s.device}</p>
                    <p className="text-[10px] text-gray-500 font-medium">{s.loc}</p>
                  </div>
                </div>
                {s.current ? (
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1 rounded-full">Active</span>
                ) : (
                  <button className="text-[10px] font-black uppercase tracking-widest text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 px-3 py-1 rounded-full transition-colors">Revoke</button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="p-8 bg-indigo-50/30 dark:bg-indigo-900/10 rounded-[2.5rem] border border-indigo-100/50 dark:border-indigo-500/10 flex items-center justify-between gap-8 mt-6">
          <div className="flex-1">
            <h5 className="font-black text-gray-900 dark:text-white uppercase tracking-widest text-xs flex items-center gap-2 mb-2">
              <Lock size={14} className="text-indigo-600" /> Password Management
            </h5>
            <p className="text-sm text-gray-500 font-medium leading-relaxed">Regularly update your password to keep your account safe.</p>
          </div>
          <button
            onClick={() => setIsPasswordModalOpen(true)}
            className="px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-black text-sm hover:scale-[1.02] transition-all shadow-xl shrink-0"
          >
            Update Password
          </button>
        </div>
      </SectionContainer>

      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </div>
  );
};

const ChangePasswordModal = ({ isOpen, onClose }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setError('');
      setSuccess(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      return setError('New passwords do not match');
    }

    if (newPassword.length < 8) {
      return setError('New password must be at least 8 characters');
    }

    setLoading(true);
    try {
      await changePassword({ currentPassword, newPassword });
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white dark:bg-gray-950 rounded-[2rem] shadow-2xl border border-gray-100 dark:border-gray-800 p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600">
              <Lock size={20} />
            </div>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Update Password</h3>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        {success ? (
          <div className="py-8 text-center animate-in fade-in zoom-in duration-300">
            <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={40} />
            </div>
            <h4 className="text-xl font-black text-gray-900 dark:text-white mb-2">Password Updated!</h4>
            <p className="text-gray-500 font-medium">Your account is now more secure.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-900/30 flex items-center gap-3 text-rose-600 dark:text-rose-400 text-sm font-bold">
                <AlertTriangle size={18} />
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Current Password</label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-indigo-500 outline-none transition-all font-bold text-gray-900 dark:text-white"
                placeholder="••••••••"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">New Password</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-indigo-500 outline-none transition-all font-bold text-gray-900 dark:text-white"
                placeholder="••••••••"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Confirm New Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-indigo-500 outline-none transition-all font-bold text-gray-900 dark:text-white"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-xl"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white dark:border-slate-900 border-t-transparent rounded-full animate-spin" />
              ) : (
                'Save New Password'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

const ProfileHeader = ({ employee, onEditProfile, onOpenSettings, onShareProfile, onOpenNavigation, onAvatarUpload, isSavingAvatar, loading }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const menuRef = useRef(null);
  const toastTimerRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => { if (toastTimerRef.current) clearTimeout(toastTimerRef.current); };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen]);

  const handleShare = () => {
    setMenuOpen(false);
    onShareProfile();
  };

  const handleSignOut = () => {
    setMenuOpen(false);
    localStorage.clear();
    window.location.href = '/login';
  };

  const menuItems = [
    { label: 'Account Settings', icon: Settings, action: () => { setMenuOpen(false); onOpenSettings(); } },
    { label: 'Download Profile PDF', icon: Download, action: () => { setMenuOpen(false); window.print(); } },
    { label: 'Share Profile', icon: Share2, action: handleShare },
    { label: 'Sign Out', icon: LogOut, danger: true, action: handleSignOut },
  ];

  return (
    <div
      onClick={onOpenNavigation}
      className={`relative rounded-[2rem] sm:rounded-[2.5rem] bg-white/40 dark:bg-slate-950/40 p-5 sm:p-8 text-gray-900 dark:text-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] cursor-pointer group/header overflow-visible border-2 border-slate-200 dark:border-slate-800 backdrop-blur-2xl transition-shadow duration-300 ${menuOpen ? 'z-40' : 'z-20'}`}
    >
      {/* Toast notification for Share Profile */}
      <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[120] pointer-events-none" onClick={(e) => e.stopPropagation()}>
        <div className={`transition-all duration-300 transform ${showToast ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
          <div className="bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl border border-white/10 flex items-center gap-3 font-bold text-sm backdrop-blur-xl">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <Share2 size={16} />
            </div>
            Profile link copied to clipboard!
          </div>
        </div>
      </div>

      <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-white/5 blur-3xl opacity-50 group-hover/header:opacity-80 transition-opacity duration-700" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-64 w-64 rounded-full bg-slate-400/5 blur-3xl opacity-30" />
      </div>

      <div className="relative flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-8">
        <div className="flex-shrink-0" onClick={(e) => e.stopPropagation()}>
          <div className="relative">
            <div className="relative group/avatar">
              {loading ? (
                <div className="h-24 w-24 sm:h-32 sm:w-32 rounded-2xl sm:rounded-3xl bg-gray-200 dark:bg-gray-800 animate-pulse border-2 border-transparent" />
              ) : (
                <>
                  <img
                    src={employee.avatar?.startsWith('data:') ? employee.avatar : (employee.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix")}
                    alt={employee.name}
                    className="h-24 w-24 sm:h-32 sm:w-32 rounded-2xl sm:rounded-3xl border-2 border-slate-200 dark:border-white/10 object-cover shadow-xl"
                  />
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isSavingAvatar}
                    className="absolute inset-0 bg-black/40 rounded-2xl sm:rounded-3xl opacity-0 group-hover/avatar:opacity-100 transition-all flex items-center justify-center text-white"
                  >
                    {isSavingAvatar ? <Loader2 className="animate-spin" /> : <Camera size={24} />}
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) onAvatarUpload(file);
                    }}
                  />
                </>
              )}
            </div>
            {!loading && (
              <div className={`absolute -bottom-2 -right-2 h-8 w-8 rounded-full border-4 border-white dark:border-slate-900 flex items-center justify-center ${employee.status === 'On Duty' ? 'bg-emerald-500' : 'bg-slate-400'
                }`}>
                <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
              </div>
            )}
          </div>
        </div>
        <div className="flex-grow">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                {loading ? (
                  <div className="h-10 w-64 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-xl" />
                ) : (
                  <>
                    <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
                      <span className="text-slate-900 dark:text-white drop-shadow-sm">
                        {employee.name}
                      </span>
                    </h1>
                    <span className="flex items-center gap-1 rounded-full bg-slate-100 dark:bg-white/10 px-2.5 py-1 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-300">
                      <ShieldCheck size={14} />
                      Verified Profile
                    </span>
                  </>
                )}
              </div>
              {loading ? (
                <div className="h-6 w-48 bg-gray-100 dark:bg-gray-800/50 animate-pulse rounded-lg" />
              ) : (
                <p className="mt-1 sm:mt-2 text-base sm:text-lg font-medium text-slate-500 dark:text-slate-400">
                  {employee.designation} • {employee.team}
                </p>
              )}
            </div>
            {!loading && (
              <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={onEditProfile}
                  className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 px-6 py-2.5 rounded-2xl font-bold transition-all hover:scale-105 active:scale-95 shadow-lg whitespace-nowrap"
                >
                  Edit Profile
                </button>
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setMenuOpen((v) => !v)}
                    className="p-3 rounded-2xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 transition-all text-slate-600 dark:text-white"
                  >
                    <MoreVertical size={20} />
                  </button>
                  {menuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-60 sm:w-64 bg-slate-900 rounded-2xl shadow-2xl border border-white/10 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      {menuItems.map((item, i) => (
                        <button
                          key={i}
                          onClick={item.action}
                          className={`w-full flex items-center gap-3 px-5 py-3.5 text-sm font-bold transition-colors ${item.danger ? 'text-rose-400 hover:bg-rose-500/10' : 'text-slate-300 hover:bg-white/5'
                            }`}
                        >
                          <item.icon size={18} />
                          {item.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="mt-4 sm:mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-[13px] sm:text-sm">
            <div className="flex items-center gap-2 text-slate-400 focus:outline-none">
              <Mail size={16} className="text-slate-500" />
              <span className="line-clamp-1">{employee.email || 'person@trackforce.com'}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Phone size={16} className="text-slate-500" />
              <span>{employee.phone || '+91 91234 56789'}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <MapPin size={16} className="text-slate-500" />
              <span className="line-clamp-1">{employee.location || 'Bengaluru, Karnataka'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Section Components ---

const PersonalInfoModal = ({ isOpen, onClose, employee }) => {
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

  const infoGroups = [
    {
      title: 'Contact Details',
      icon: Phone,
      items: [
        { label: 'Primary Phone', value: employee.phone || '+91 91234 56789', icon: Phone },
        { label: 'Official Email', value: employee.email || 'person@trackforce.com', icon: Mail },
        { label: 'Residential Address', value: employee.address || 'Indiranagar, Bengaluru, KA', icon: MapPin },
      ]
    },
    {
      title: 'Identification',
      icon: User,
      items: [
        { label: 'Full Name', value: employee.name || 'test person', icon: User },
        { label: 'Gender', value: employee.gender || 'Male', icon: User },
        { label: 'Nationality', value: employee.nationality || 'Indian', icon: Globe },
        { label: 'Date of Birth', value: employee.dob || '12 Oct 1995', icon: Calendar },
      ]
    },
    {
      title: 'Health & Emergency',
      icon: HeartPulse,
      items: [
        { label: 'Blood Group', value: employee.bloodGroup || 'A+ Positive', icon: HeartPulse },
        { label: 'Emergency Contact', value: employee.emergencyContact || 'Deepika (Sister) - 9876543210', icon: Phone },
        { label: 'Allergies', value: employee.allergies || 'None Reported', icon: AlertTriangle },
      ]
    }
  ];

  return (
    <div className={`fixed inset-0 z-[200] flex items-center justify-center p-4 transition-all duration-300 ${isOpen ? '' : 'pointer-events-none'}`}>
      <div className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`} />
      <div className={`relative w-[calc(100%-2rem)] max-w-4xl bg-white dark:bg-gray-950 rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-gray-800 transition-all duration-300 transform ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
        <div className="flex flex-col max-h-[90vh]">
          <div className="p-5 sm:p-8 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-white/80 dark:bg-gray-950/80 backdrop-blur rounded-t-[2.5rem] flex-shrink-0 sticky top-0 z-10">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2.5 sm:p-3 rounded-2xl bg-slate-900 text-white"><User size={20} className="sm:w-6 sm:h-6" /></div>
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight">Personal Information</h3>
                <p className="text-[10px] sm:text-sm font-medium text-gray-500">Your verified identity & details</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl sm:rounded-2xl bg-gray-100 dark:bg-gray-900 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-all"><X size={20} /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 tf-modal-scroll">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {infoGroups.map((group, i) => (
                <div key={i} className="bg-slate-50/50 dark:bg-slate-900/40 rounded-[1.5rem] sm:rounded-[2rem] border border-slate-100 dark:border-slate-800 p-5 sm:p-6 lg:p-8 hover:border-slate-200 dark:hover:border-slate-700 transition-colors">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-400 shadow-sm"><group.icon size={18} /></div>
                    <h4 className="text-lg font-black text-gray-900 dark:text-white tracking-tight">{group.title}</h4>
                  </div>
                  <div className="space-y-4 sm:space-y-6">
                    {group.items.map((item, j) => (
                      <div key={j} className="group">
                        <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-2">
                          <item.icon size={12} /> {item.label}
                        </p>
                        <p className="mt-1 sm:mt-2 text-sm font-bold text-gray-700 dark:text-gray-200 leading-relaxed group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const EmploymentSection = ({ employee }) => {
  const details = [
    { label: 'Employee Code', value: employee.employeeCode || 'TF-EXE-402', icon: Briefcase },
    { label: 'Date of Join', value: employee.dateOfJoin || '15 June 2023', icon: Calendar },
    { label: 'Designation', value: employee.designation || 'Senior Field Executive', icon: Building },
    { label: 'Work Area', value: employee.workArea || 'Central Bengaluru Zone', icon: Clock },
    { label: 'Reporting To', value: employee.reportingTo || 'Ananya Sharma (Manager)', icon: UserCheck },
    { label: 'Security Level', value: employee.securityLevel || 'Field Access - Level 1', icon: Shield },
  ];
  return (
    <div className="bg-white/40 dark:bg-slate-950/40 rounded-[2rem] sm:rounded-[2.5rem] border-2 border-slate-100 dark:border-slate-800 p-6 sm:p-8 lg:p-10 overflow-hidden relative backdrop-blur-xl mb-6">
      <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 dark:bg-slate-900/10 rounded-full blur-3xl -mr-32 -mt-32" />
      <div className="relative">
        <h3 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white mb-8 sm:mb-10 tracking-tight">Employment Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 lg:gap-x-12 gap-y-8 sm:gap-y-10">
          {details.map((detail, i) => (
            <div key={i} className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-900/40 text-slate-600 dark:text-slate-400">
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

const NotificationsSection = () => {
  const {
    executiveList, setExecutiveList,
    managerList, setManagerList,
    markAllAsRead
  } = useNotifications();

  const [activeCategory, setActiveCategory] = useState('executive');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [draggedItemIndex, setDraggedItemIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isPriorityExpanded, setIsPriorityExpanded] = useState(false);

  const onDragStart = (e, index) => {
    setDraggedItemIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index);
  };

  const onDrop = (e, targetIndex) => {
    e.preventDefault();
    if (draggedItemIndex === null || draggedItemIndex === targetIndex) return;

    const list = activeCategory === 'executive' ? [...executiveList] : [...managerList];
    const draggedItem = list[draggedItemIndex];

    list.splice(draggedItemIndex, 1);
    list.splice(targetIndex, 0, draggedItem);

    if (activeCategory === 'executive') setExecutiveList(list);
    else setManagerList(list);

    setDraggedItemIndex(null);
  };

  const currentCategoryData = activeCategory === 'executive' ? executiveList : managerList;

  const filteredNotifications = currentCategoryData.filter(n => {
    const matchesPriority = priorityFilter === 'all' || n.priority === priorityFilter;
    const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPriority && matchesSearch;
  });

  const getIcon = (type) => {
    switch (type) {
      case 'alert': return <AlertTriangle size={18} />;
      case 'success': return <CheckCircle2 size={18} />;
      case 'message': return <MessageSquare size={18} />;
      default: return <Info size={18} />;
    }
  };

  const getColor = (type) => {
    switch (type) {
      case 'alert': return 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400';
      case 'success': return 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400';
      case 'message': return 'bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400';
      default: return 'bg-slate-50 text-slate-500 dark:bg-slate-800 dark:text-slate-400';
    }
  };

  return (
    <div id="notifications" className="bg-white/40 dark:bg-slate-950/40 rounded-[2rem] sm:rounded-[2.5rem] border-2 border-slate-100 dark:border-slate-800 p-6 sm:p-8 lg:p-10 relative backdrop-blur-xl">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8 select-none">
        <div className="space-y-1">
          <h3 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight">Notifications</h3>
          <p className="text-[10px] sm:text-sm font-medium text-gray-500">Real-time alerts and activity updates</p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto">
          <div className="relative group flex-1 sm:min-w-[260px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={16} />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-3 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-900 dark:hover:text-white">
                <X size={14} />
              </button>
            )}
          </div>

          <button
            onClick={() => markAllAsRead(activeCategory)}
            className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 px-5 py-3 rounded-xl transition-all uppercase tracking-widest whitespace-nowrap"
          >
            Mark all read
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="inline-flex p-1 bg-slate-100/50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
          <button
            onClick={() => setActiveCategory('executive')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${activeCategory === 'executive'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
          >
            <Briefcase size={16} />
            Field Ops
            <span className={`ml-1 text-[10px] px-1.5 py-0.5 rounded-md ${activeCategory === 'executive' ? 'bg-indigo-50 text-indigo-600 font-black' : 'bg-slate-200/50 text-slate-400 font-bold'}`}>
              {executiveList.length}
            </span>
          </button>
          <button
            onClick={() => setActiveCategory('manager')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${activeCategory === 'manager'
              ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
          >
            <Users size={16} />
            Management
            <span className={`ml-1 text-[10px] px-1.5 py-0.5 rounded-md ${activeCategory === 'manager' ? 'bg-emerald-50 text-emerald-600 font-black' : 'bg-slate-200/50 text-slate-400 font-bold'}`}>
              {managerList.length}
            </span>
          </button>
        </div>

        <div className="relative">
          <button
            onClick={() => setIsPriorityExpanded(!isPriorityExpanded)}
            className={`flex items-center gap-3 px-5 py-2.5 rounded-xl font-bold text-sm transition-all bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-200 shadow-sm ${isPriorityExpanded ? 'ring-2 ring-indigo-500/20 border-indigo-500' : 'text-slate-600'
              }`}
          >
            <Filter size={14} className={isPriorityExpanded ? 'text-indigo-600' : 'text-slate-400'} />
            <span className="min-w-[80px] text-left">
              {priorityFilter === 'all' ? 'All Priorities' : `${priorityFilter.charAt(0).toUpperCase() + priorityFilter.slice(1)} Priority`}
            </span>
            <ChevronDown size={14} className={`transition-transform duration-300 ${isPriorityExpanded ? 'rotate-180' : ''}`} />
          </button>

          {isPriorityExpanded && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-1.5 flex flex-col gap-1">
                {['all', 'high', 'low'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => { setPriorityFilter(filter); setIsPriorityExpanded(false); }}
                    className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${priorityFilter === filter
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                  >
                    {filter === 'all' ? 'All Alerts' : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Priority`}
                    {priorityFilter === filter && <CheckCircle2 size={14} className="text-white" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((n, index) => (
            <div
              key={n.id}
              draggable={priorityFilter === 'all' && searchQuery === ''}
              onDragStart={(e) => onDragStart(e, index)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => onDrop(e, index)}
              onDragEnd={() => setDraggedItemIndex(null)}
              className={`group flex items-start gap-4 p-4 sm:p-5 rounded-2xl border transition-all duration-300 relative ${priorityFilter === 'all' && searchQuery === '' ? 'cursor-move' : 'cursor-default'
                } ${draggedItemIndex === index ? 'opacity-30 scale-[0.99] border-dashed border-indigo-400 bg-slate-50/50' : ''
                } ${n.isRead
                  ? 'bg-white/60 dark:bg-slate-900/40 border-slate-100 dark:border-slate-800/50'
                  : 'bg-white dark:bg-slate-900 border-indigo-100 dark:border-indigo-500/20 shadow-sm'
                }`}
            >
              <div className={`absolute top-0 right-8 px-2 py-0.5 rounded-b-md text-[8px] font-black uppercase tracking-widest ${n.priority === 'high' ? 'bg-rose-500 text-white' : 'bg-sky-500 text-white'
                }`}>
                {n.priority}
              </div>

              <div className={`p-3 rounded-xl shrink-0 ${getColor(n.type)} transition-transform group-hover:scale-110 shadow-sm`}>
                {getIcon(n.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-3 mb-1">
                  <h4 className={`font-bold tracking-tight text-sm sm:text-base ${n.isRead ? 'text-slate-600 dark:text-slate-400' : 'text-slate-900 dark:text-white'} group-hover:text-indigo-600 transition-colors`}>
                    {n.title}
                  </h4>
                  <span className="shrink-0 text-[10px] font-bold text-slate-400 pt-0.5 uppercase tracking-widest">{n.time}</span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-medium leading-relaxed max-w-2xl line-clamp-1 group-hover:line-clamp-none transition-all">
                  {n.desc}
                </p>

                {!n.isRead && (
                  <div className="mt-2 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                    <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest">New</span>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white/50 dark:bg-slate-900/30 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
            <Bell size={28} className="mx-auto text-slate-300 dark:text-slate-700 mb-3" />
            <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1">No alerts found</h4>
            <p className="text-slate-500 text-xs sm:text-sm">You're all caught up!</p>
          </div>
        )}
      </div>
    </div>
  );
};

const DocumentsModal = ({ isOpen, onClose, documents, onEditDocument, onViewDocument, onDeleteDocument }) => {
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

  return (
    <div className={`fixed inset-0 z-[200] flex items-center justify-center p-4 transition-all duration-300 ${isOpen ? '' : 'pointer-events-none'}`}>
      <div className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`} />
      <div className={`relative w-[calc(100%-2rem)] max-w-4xl bg-white dark:bg-gray-950 rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-gray-800 transition-all duration-300 transform ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
        <div className="flex flex-col max-h-[90vh]">
          <div className="p-5 sm:p-8 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-white/80 dark:bg-gray-950/80 backdrop-blur rounded-t-[2.5rem] flex-shrink-0 sticky top-0 z-10">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2.5 sm:p-3 rounded-2xl bg-slate-900 text-white"><FileText size={20} className="sm:w-6 sm:h-6" /></div>
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight">Professional Documents</h3>
                <p className="text-[10px] sm:text-sm font-medium text-gray-500">Access verified field records</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={() => onEditDocument(null)}
                className="hidden sm:flex text-sm font-bold bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-2 rounded-xl items-center gap-2 hover:opacity-90 transition-all"
              >
                <Plus size={16} /> New Upload
              </button>
              <button className="hidden sm:flex text-sm font-bold text-slate-900 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white underline items-center gap-2 mr-4">
                <Download size={16} /> Export All
              </button>
              <button onClick={onClose} className="p-2 rounded-xl sm:rounded-2xl bg-gray-100 dark:bg-gray-900 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-all"><X size={20} /></button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 tf-modal-scroll">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {documents.map((doc, i) => (
                <div
                  key={doc._id || i} // Use doc._id if available, otherwise index
                  className="group p-4 sm:p-5 lg:p-6 rounded-2xl sm:rounded-3xl border border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/20 flex items-center justify-between hover:border-slate-200 dark:hover:border-slate-700 hover:bg-white dark:hover:bg-gray-800 transition-all"
                >
                  <div className="flex items-center gap-5">
                    <div className={`p-4 rounded-2xl ${doc.type === 'PDF' ? 'bg-slate-100 text-slate-900' : 'bg-green-50 text-green-600'} dark:bg-opacity-10 group-hover:scale-110 transition-transform`}>
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
                    <div className="flex items-center gap-2">
                      {doc._id && (
                        <button
                          onClick={() => onDeleteDocument && onDeleteDocument(doc)}
                          className="p-2 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/40 transition-all shadow-sm"
                          title="Delete Document"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => onEditDocument(doc)}
                        className="p-2 rounded-xl bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-gray-700 transition-all shadow-sm"
                        title="Upload New Version"
                      >
                        <UploadCloud size={16} />
                      </button>
                      <button
                        onClick={() => onViewDocument(doc)}
                        className="p-2 text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                        title="View Document"
                      >
                        <ExternalLink size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DocumentPreviewModal = ({ isOpen, onClose, document: docRecord }) => {
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className={`absolute inset-0 bg-slate-900/90 backdrop-blur-xl transition-opacity duration-500`} onClick={onClose} />

      <div className="relative w-[calc(100%-2rem)] max-w-5xl h-[85vh] transition-all duration-500 transform scale-100 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6 text-white bg-white/10 p-5 sm:p-6 rounded-[2rem] sm:rounded-[2.5rem] backdrop-blur-md border border-white/10 shadow-2xl flex-shrink-0 sticky top-0 z-10">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="p-2.5 sm:p-3 rounded-2xl bg-white/10 text-white"><FileText size={20} className="sm:w-6 sm:h-6" /></div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight line-clamp-1">{docRecord?.name || 'Document Preview'}</h3>
              <p className="text-slate-300 text-[10px] font-bold uppercase tracking-widest">{docRecord?.status || 'Verified Record'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            {docRecord?.fileUrl && (
              <button
                onClick={() => {
                  const getBaseUrl = () => {
                    let url = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
                    url = url.replace(/\/$/, '');
                    if (!url.endsWith('/api')) url += '/api';
                    return url;
                  };
                  const base = getBaseUrl().replace('/api', '');
                  window.open(`${base}${docRecord.fileUrl}`, '_blank');
                }}
                className="hidden sm:flex p-3 rounded-2xl bg-indigo-500 hover:bg-indigo-600 transition-all items-center gap-2 font-bold text-sm text-white border-none"
              >
                <ExternalLink size={20} /> View Original
              </button>
            )}
            <button className="hidden sm:flex p-3 rounded-2xl bg-white/10 hover:bg-white/20 transition-all items-center gap-2 font-bold text-sm">
              <Download size={20} /> Download
            </button>
            <button onClick={onClose} className="p-2.5 sm:p-3 rounded-2xl bg-white/20 hover:bg-white/30 transition-all text-white"><X size={24} /></button>
          </div>
        </div>

        {/* Content Area - Sample Document */}
        <div className="flex-1 bg-white rounded-[2rem] sm:rounded-[3.5rem] shadow-inner overflow-hidden relative border-4 border-slate-900 p-6 sm:p-12 flex items-center justify-center tf-modal-scroll overflow-y-auto">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #000 1px, transparent 0)', backgroundSize: '24px 24px' }} />

          <div className="relative w-full max-w-2xl min-h-full border-[6px] sm:border-[10px] border-double border-slate-100 p-6 sm:p-10 flex flex-col">
            <div className="flex justify-between items-start mb-8 sm:mb-12">
              <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full border-4 border-slate-200 flex items-center justify-center text-slate-100 transform -rotate-12 flex-shrink-0">
                <Shield size={28} className="sm:w-10 sm:h-10" />
              </div>
              <div className="text-right">
                <h4 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tighter uppercase italic">Trackforce</h4>
                <p className="text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Verified Field Excellence</p>
              </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 sm:space-y-8 py-8">
              <div className="space-y-2">
                <p className="text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">CERTIFICATE OF RECORD</p>
                <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">{docRecord?.name || 'Professional Document'}</h2>
              </div>

              <div className="w-24 sm:w-32 h-1 bg-slate-900 rounded-full" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 sm:gap-x-20 gap-y-6 sm:gap-y-10 text-left w-full max-w-lg mx-auto py-4 sm:py-8">
                <div>
                  <label className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Holder Name</label>
                  <p className="font-bold text-slate-900 border-b-2 border-slate-100 pb-1 text-sm sm:text-base">Test person</p>
                </div>
                <div>
                  <label className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Employee ID</label>
                  <p className="font-bold text-slate-900 border-b-2 border-slate-100 pb-1 text-sm sm:text-base">TF-EXE-402</p>
                </div>
                <div>
                  <label className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Issue Status</label>
                  <p className="font-bold text-emerald-600 border-b-2 border-slate-100 pb-1 text-sm sm:text-base">{docRecord?.status || 'Verified'}</p>
                </div>
                <div>
                  <label className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">File Metadata</label>
                  <p className="font-bold text-slate-900 border-b-2 border-slate-100 pb-1 text-sm sm:text-base">{docRecord?.size || '0.0 MB'} • {docRecord?.type || 'PDF'}</p>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-center gap-4 text-slate-300">
                <ShieldCheck size={32} className="opacity-20 sm:w-12 sm:h-12" />
                <Activity size={32} className="opacity-20 sm:w-12 sm:h-12" />
                <UserCheck size={32} className="opacity-20 sm:w-12 sm:h-12" />
              </div>
            </div>

            <div className="mt-auto pt-10 border-t border-slate-100 flex justify-between items-end opacity-40 grayscale">
              <div>
                <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Digital Verification Key</p>
                <p className="text-[10px] font-mono text-slate-900 mt-1">AX-772-TF-99-RECORD-PREVIEW</p>
              </div>
              <div className="text-right">
                <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Issued Date</p>
                <p className="text-xs font-black text-slate-900 mt-1">14 MARCH 2026</p>
              </div>
            </div>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-[20px] border-slate-50 rounded-full w-[500px] h-[500px] pointer-events-none opacity-[0.02]" />
          </div>
        </div>
      </div>
    </div>
  );
};

const DocumentUploadModal = ({ isOpen, onClose, document: docRecord, onSave }) => {
  const [name, setName] = useState('');
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (docRecord) {
      setName(docRecord.name);
      setFile(null);
    }
  }, [docRecord]);

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

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Auto-update name only if it's empty
      if (!name) {
        setName(selectedFile.name.split('.')[0]);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', name);
      onSave(formData, docRecord?._id);
    } else {
      const updatedData = {
        ...docRecord,
        name,
        size: docRecord?.size || '0 MB',
        status: docRecord?.status || 'Pending Review'
      };
      onSave(updatedData, docRecord?._id);
    }
  };

  return (
    <div className={`fixed inset-0 z-[200] flex items-center justify-center p-4 transition-all duration-300 ${isOpen ? '' : 'pointer-events-none'}`}>
      <div className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`} />
      <div className={`relative w-[calc(100%-2rem)] max-w-md bg-white dark:bg-gray-950 rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-gray-800 p-6 sm:p-8 transition-all duration-300 transform ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 sm:p-3 rounded-2xl bg-slate-100 dark:bg-gray-800 text-slate-900 dark:text-slate-400 flex-shrink-0"><UploadCloud size={20} /></div>
            <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Upload Document</h3>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-all"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Document Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-gray-900 border-2 border-transparent focus:border-slate-900 dark:focus:border-white outline-none transition-all font-bold text-gray-900 dark:text-white"
              placeholder="Enter document title"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">File Attachment</label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".pdf,.doc,.docx,.jpg,.png"
            />
            <div
              onClick={() => fileInputRef.current.click()}
              className="group cursor-pointer p-6 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-slate-900 dark:hover:border-white hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-all flex flex-col items-center justify-center gap-3"
            >
              {file ? (
                <div className="flex flex-col items-center">
                  <div className="p-3 rounded-full bg-emerald-100 text-emerald-600 mb-2 animate-bounce"><CheckCircle size={24} /></div>
                  <p className="font-black text-gray-900 dark:text-white text-sm text-center line-clamp-1">{file.name}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{(file.size / 1024).toFixed(0)} KB • Ready to upload</p>
                </div>
              ) : (
                <>
                  <UploadCloud size={32} className="text-gray-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
                  <p className="text-sm font-bold text-gray-500 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">Select a file to upload</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">PDF, DOCX, JPG or PNG (Max 10MB)</p>
                </>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 rounded-2xl bg-slate-100 dark:bg-gray-800 text-slate-900 dark:text-white font-black hover:bg-slate-200 dark:hover:bg-gray-700 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!file && (!name || name === docRecord?.name)}
              className="flex-1 py-4 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-slate-900/10 dark:shadow-none"
            >
              Update Record
            </button>
          </div>
        </form>
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
  const [dob, setDob] = useState(employee.dob || '');
  const [allergies, setAllergies] = useState(employee.allergies || '');
  const [employeeCode, setEmployeeCode] = useState(employee.employeeCode || '');
  const [dateOfJoin, setDateOfJoin] = useState(employee.dateOfJoin || '');
  const [designation, setDesignation] = useState(employee.designation || '');
  const [workArea, setWorkArea] = useState(employee.workArea || '');
  const [reportingTo, setReportingTo] = useState(employee.reportingTo || '');
  const [securityLevel, setSecurityLevel] = useState(employee.securityLevel || '');
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
    setDob(employee.dob || '');
    setAllergies(employee.allergies || '');
    setEmployeeCode(employee.employeeCode || '');
    setDateOfJoin(employee.dateOfJoin || '');
    setDesignation(employee.designation || '');
    setWorkArea(employee.workArea || '');
    setReportingTo(employee.reportingTo || '');
    setSecurityLevel(employee.securityLevel || '');
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
      dob: dob.trim(),
      allergies: allergies.trim(),
      employeeCode: employeeCode.trim(),
      dateOfJoin: dateOfJoin.trim(),
      designation: designation.trim(),
      workArea: workArea.trim(),
      reportingTo: reportingTo.trim(),
      securityLevel: securityLevel.trim(),
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
    <div className={`fixed inset-0 z-[200] ${isOpen ? '' : 'pointer-events-none'}`} aria-hidden={!isOpen}>
      <style>{`
        .tf-modal-scroll::-webkit-scrollbar { width: 0px; height: 0px; }
        .tf-modal-scroll { scrollbar-width: none; -ms-overflow-style: none; }
      `}</style>
      <div
        className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />

      {/* Toast notification */}
      <div className="fixed inset-0 z-[130] pointer-events-none flex items-start justify-center p-4 sm:p-6">
        <div className={`transition-all duration-200 ${saveToast.open ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
          <div className="rounded-2xl px-4 py-3 sm:px-5 sm:py-4 shadow-2xl border text-sm font-black flex items-center gap-2 bg-emerald-50 text-emerald-800 border-emerald-100">
            <CheckCircle size={16} />
            <span>{saveToast.message}</span>
          </div>
        </div>
      </div>

      <div
        className={`absolute left-1/2 top-1/2 w-[calc(100%-2rem)] max-w-3xl -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-950 shadow-2xl border border-gray-100 dark:border-gray-800 rounded-[2rem] sm:rounded-[2.5rem] transition-all duration-300 ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        role="dialog"
        aria-modal="true"
        aria-label="Edit Profile"
      >
        <div className="max-h-[calc(100vh-2rem)] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-5 sm:p-8 border-b border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur flex-shrink-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <div className="p-2.5 sm:p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600">
                    <User size={18} />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight">Edit Profile</h2>
                </div>
                <p className="mt-1 sm:mt-2 text-[10px] sm:text-sm font-medium text-gray-500">Update your personal information.</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 sm:px-4 sm:py-2 rounded-xl sm:rounded-2xl bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-200 font-bold hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                aria-label="Close"
              >
                <span className="hidden sm:inline">Close</span>
                <X size={18} className="sm:hidden" />
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

                {/* Employment Fields */}
                <div className="sm:col-span-2 pt-4 border-t border-gray-100 dark:border-gray-800">
                  <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest mb-4">Employment Details</h3>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Employee Code</label>
                  <input
                    value={employeeCode}
                    onChange={(e) => setEmployeeCode(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white font-bold outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400"
                    placeholder="e.g. TF-EXE-402"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Date of Join</label>
                  <input
                    value={dateOfJoin}
                    onChange={(e) => setDateOfJoin(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white font-bold outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400"
                    placeholder="e.g. 15 June 2023"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Designation</label>
                  <input
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white font-bold outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400"
                    placeholder="e.g. Senior Field Executive"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Work Area</label>
                  <input
                    value={workArea}
                    onChange={(e) => setWorkArea(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white font-bold outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400"
                    placeholder="e.g. Central Bengaluru Zone"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Reporting To</label>
                  <input
                    value={reportingTo}
                    onChange={(e) => setReportingTo(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white font-bold outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400"
                    placeholder="e.g. Ananya Sharma (Manager)"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Security Level</label>
                  <input
                    value={securityLevel}
                    onChange={(e) => setSecurityLevel(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white font-bold outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400"
                    placeholder="e.g. Field Access - Level 1"
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
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Date of Birth</label>
                  <input
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    type="date"
                    className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white font-bold outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Allergies</label>
                  <input
                    value={allergies}
                    onChange={(e) => setAllergies(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white font-bold outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400"
                    placeholder="None Reported"
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
    <form onSubmit={onSubmit} className="bg-gray-50/60 dark:bg-gray-900/30 rounded-[1.5rem] sm:rounded-[2rem] border border-gray-100 dark:border-gray-800 p-5 sm:p-7 mb-6">
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
    <div className={`fixed inset-0 z-[200] flex items-center justify-center p-4 ${isOpen ? '' : 'pointer-events-none'}`} aria-hidden={!isOpen}>
      <div
        className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />
      <div
        className={`relative w-[calc(100%-2rem)] max-w-2xl bg-white dark:bg-gray-950 shadow-2xl border border-gray-100 dark:border-gray-800 rounded-[2.5rem] transition-all duration-300 transform ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        role="dialog" aria-modal="true" aria-label="Account Settings"
      >
        <div className="max-h-[calc(100vh-2rem)] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-5 sm:p-8 border-b border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur flex-shrink-0 sticky top-0 z-10">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 sm:p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600"><Settings size={18} /></div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight">Account Settings</h2>
                  <p className="text-[10px] sm:text-sm font-medium text-gray-500">Preferences & security</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 rounded-xl sm:rounded-2xl bg-gray-100 dark:bg-gray-900 text-gray-500 hover:text-gray-200 dark:hover:bg-gray-800 transition-colors">
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="tf-settings-scroll flex-1 overflow-y-auto p-4 sm:p-7">


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

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, documentName }) => {
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white dark:bg-gray-950 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 p-8 transform animate-in zoom-in-95 duration-300">
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-3xl bg-rose-50 dark:bg-rose-900/20 text-rose-500 flex items-center justify-center mb-6 shadow-sm">
            <Trash2 size={40} />
          </div>
          <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight mb-2">Delete Document?</h3>
          <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed mb-8">
            Are you sure you want to delete <span className="font-black text-gray-900 dark:text-white">"{documentName || 'this file'}"</span>? This action cannot be undone.
          </p>

          <div className="flex w-full gap-4">
            <button
              onClick={onClose}
              className="flex-1 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-black hover:bg-gray-100 dark:hover:bg-gray-700 transition-all border border-gray-100 dark:border-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-4 rounded-2xl bg-rose-500 text-white font-black hover:bg-rose-600 transition-all shadow-lg shadow-rose-200 dark:shadow-none"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Page Component ---

const EmployeeProfile = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { refreshUser } = useAuth();
  const [isSavingAvatar, setIsSavingAvatar] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isNavigationOpen, setIsNavigationOpen] = useState(false);
  const [isPersonalInfoOpen, setIsPersonalInfoOpen] = useState(false);
  const [isDocumentsOpen, setIsDocumentsOpen] = useState(false);
  const [isEditDocumentOpen, setIsEditDocumentOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState(null);
  const [viewingDocument, setViewingDocument] = useState(null);
  const [activeTab, setActiveTab] = useState('personal');
  const [deleteModalConfig, setDeleteModalConfig] = useState({ isOpen: false, documentId: null, documentName: '' });

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('modal') === 'settings') {
      setActiveTab('settings');
      setIsNavigationOpen(true);
      // Clean up URL to avoid re-triggering on refresh
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  const [documents, setDocuments] = useState([]);

  const [employee, setEmployee] = useState({
    name: '',
    designation: '',
    team: '',
    status: 'Off Duty',
    email: '',
    phone: '',
    location: '',
    address: '',
    gender: '',
    nationality: '',
    dob: '',
    bloodGroup: '',
    emergencyContact: '',
    allergies: '',
    avatar: '',
    employeeCode: '',
    dateOfJoin: '',
    workArea: '',
    reportingTo: '',
    securityLevel: ''
  });
  const [profileLoading, setProfileLoading] = useState(true);

  // Fetch profile from backend on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setProfileLoading(true);
        const data = await getMyProfile();
        setEmployee(data);
      } catch (err) {
        console.error('Failed to load profile:', err.message);
      } finally {
        setProfileLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Fetch documents from backend on mount
  useEffect(() => {
    const loadDocuments = async () => {
      try {
        const data = await fetchDocuments();
        setDocuments(data);
      } catch (err) {
        console.error('Failed to load documents:', err.message);
      }
    };
    loadDocuments();
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('user'));
        if (!userInfo || !userInfo.token) return;
        const getBaseUrl = () => {
          let url = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
          url = url.replace(/\/$/, '');
          if (!url.endsWith('/api')) url += '/api';
          return url;
        };
        const BASE_URL = getBaseUrl();
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.get(`${BASE_URL}/auth/me`, config);
        setEmployee(prev => ({
          ...prev,
          name: data.name || prev.name,
          email: data.email || prev.email,
          phone: data.profile?.phone || prev.phone,
          address: data.profile?.address || prev.address,
          dob: data.profile?.dob || prev.dob,
          gender: data.profile?.gender || prev.gender,
          nationality: data.profile?.nationality || prev.nationality,
          bloodGroup: data.profile?.bloodGroup || prev.bloodGroup,
          emergencyContact: data.profile?.emergencyContact || prev.emergencyContact,
          allergies: data.profile?.allergies || prev.allergies,
          location: data.profile?.location || prev.location,
        }));
      } catch (err) {
        console.error("Error fetching profile", err);
      }
    };
    fetchProfile();
  }, []);

  const handleSaveProfile = async (updates) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('user'));
      if (userInfo && userInfo.token) {
        const getBaseUrl = () => {
          let url = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
          url = url.replace(/\/$/, '');
          if (!url.endsWith('/api')) url += '/api';
          return url;
        };
        const BASE_URL = getBaseUrl();
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        await axios.put(`${BASE_URL}/auth/profile`, updates, config);
      }
      setEmployee(prev => ({ ...prev, ...updates }));
    } catch (err) {
      console.error("Failed to update profile", err);
    }
  };

  const handleAvatarUpload = async (file) => {
    try {
      setIsSavingAvatar(true);
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await uploadProfileImage(formData);
      
      // Update local state
      setEmployee(prev => ({
        ...prev,
        avatar: response.profileImage || response.url
      }));
      
      // Sync with global state (Sidebar, Navbar)
      await refreshUser();
      
    } catch (err) {
      console.error('Failed to upload avatar:', err.message);
    } finally {
      setIsSavingAvatar(false);
    }
  };

  const tabs = [
    { id: 'personal', label: 'Profile Info', icon: User },
    { id: 'employment', label: 'Work Details', icon: Briefcase },
    { id: 'documents', label: 'Documents', icon: FileText },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'personal':
        return <div className="animate-in fade-in slide-in-from-bottom-4 duration-500"><PersonalInfoContent employee={employee} loading={profileLoading} /></div>;
      case 'employment':
        return <div className="animate-in fade-in slide-in-from-bottom-4 duration-500"><EmploymentSection employee={employee} loading={profileLoading} /></div>;
      case 'documents':
        return <div className="animate-in fade-in slide-in-from-bottom-4 duration-500"><DocumentsContent
          documents={documents}
          onEditDocument={(doc) => { setEditingDocument(doc); setIsEditDocumentOpen(true); }}
          onViewDocument={(doc) => { setViewingDocument(doc); setIsViewModalOpen(true); }}
          onAddDocument={() => { setEditingDocument(null); setIsEditDocumentOpen(true); }}
          onDeleteDocument={(doc) => setDeleteModalConfig({
            isOpen: true,
            documentId: doc._id,
            documentName: doc.name
          })}
        /></div>;
      default:
        return <div className="animate-in fade-in slide-in-from-bottom-4 duration-500"><PersonalInfoContent employee={employee} loading={profileLoading} /></div>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-20 px-4 sm:px-0">
      <div className="animate-in duration-500">
        <ScrollStyles />

        <div className="space-y-12">
          <ProfileHeader
            employee={employee}
            onEditProfile={() => setIsEditProfileOpen(true)}
            onOpenSettings={() => {
              setActiveTab('settings');
              setIsNavigationOpen(true);
            }}
            onShareProfile={() => setIsShareModalOpen(true)}
            onOpenNavigation={() => setIsNavigationOpen(true)}
            onAvatarUpload={handleAvatarUpload}
            isSavingAvatar={isSavingAvatar}
            loading={profileLoading}
          />

          <EmploymentSection employee={employee} loading={profileLoading} />
          <NotificationsSection />
        </div>
      </div>

      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        employee={employee}
        onSaveProfile={async (updates) => {
          try {
            const saved = await updateMyProfile(updates);
            setEmployee(saved);
            // Sync with global state
            await refreshUser();
            // Sync with localStorage
            const userInfo = JSON.parse(localStorage.getItem('user') || '{}');
            localStorage.setItem('user', JSON.stringify({ ...userInfo, name: saved.name, email: saved.email }));
          } catch (err) {
            console.error('Failed to save profile:', err.message);
            // Still update locally so the UI isn't stale
            setEmployee((prev) => ({ ...prev, ...updates }));
          }
        }}
      />

      <AccountSettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        employee={employee}
        onSaveProfile={async (updates) => {
          try {
            const saved = await updateMyProfile(updates);
            setEmployee(saved);
            // Sync with global state
            await refreshUser();
            // Sync with localStorage
            const userInfo = JSON.parse(localStorage.getItem('user') || '{}');
            localStorage.setItem('user', JSON.stringify({ ...userInfo, name: saved.name, email: saved.email }));
          } catch (err) {
            console.error('Failed to save settings:', err.message);
            setEmployee((prev) => ({ ...prev, ...updates }));
          }
        }}
      />

      <ShareProfileModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        employee={employee}
      />

      <ProfileUnifiedOverlay
        isOpen={isNavigationOpen}
        onClose={() => setIsNavigationOpen(false)}
        employee={employee}
        documents={documents}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onEditDocument={(doc) => {
          setEditingDocument(doc);
          setIsNavigationOpen(false);
          setIsEditDocumentOpen(true);
        }}
        onViewDocument={(doc) => {
          setViewingDocument(doc);
          setIsNavigationOpen(false);
          setIsViewModalOpen(true);
        }}
        onEditProfile={() => {
          setIsNavigationOpen(false);
          setIsEditProfileOpen(true);
        }}
        onDeleteDocument={(doc) => setDeleteModalConfig({
          isOpen: true,
          documentId: doc._id,
          documentName: doc.name
        })}
        onSaveProfile={async (updates) => {
          try {
            const saved = await updateMyProfile(updates);
            setEmployee(saved);
            // Sync with localStorage
            const userInfo = JSON.parse(localStorage.getItem('user') || '{}');
            localStorage.setItem('user', JSON.stringify({ ...userInfo, name: saved.name, email: saved.email }));
          } catch (err) {
            console.error('Failed to save profile:', err.message);
            setEmployee((prev) => ({ ...prev, ...updates }));
          }
        }}
      />

      <PersonalInfoModal
        isOpen={isPersonalInfoOpen}
        onClose={() => {
          setIsPersonalInfoOpen(false);
          setIsNavigationOpen(true);
        }}
        employee={employee}
      />

      <DocumentsModal
        isOpen={isDocumentsOpen}
        onClose={() => {
          setIsDocumentsOpen(false);
          setIsNavigationOpen(true);
        }}
        documents={documents}
        onEditDocument={(doc) => {
          setEditingDocument(doc);
          setIsDocumentsOpen(false);
          setIsEditDocumentOpen(true);
        }}
        onViewDocument={(doc) => {
          setViewingDocument(doc);
          setIsDocumentsOpen(false);
          setIsViewModalOpen(true);
        }}
        onDeleteDocument={(doc) => setDeleteModalConfig({
          isOpen: true,
          documentId: doc._id,
          documentName: doc.name
        })}
      />

      <DeleteConfirmationModal
        isOpen={deleteModalConfig.isOpen}
        onClose={() => setDeleteModalConfig({ isOpen: false, documentId: null, documentName: '' })}
        onConfirm={async () => {
          const { documentId } = deleteModalConfig;
          try {
            await deleteDocumentService(documentId);
            setDocuments(prev => prev.filter(d => d._id !== documentId));
          } catch (err) {
            console.error('Failed to delete document', err);
          } finally {
            setDeleteModalConfig({ isOpen: false, documentId: null, documentName: '' });
          }
        }}
        documentName={deleteModalConfig.documentName}
      />

      <DocumentUploadModal
        isOpen={isEditDocumentOpen}
        onClose={() => {
          setIsEditDocumentOpen(false);
          setIsNavigationOpen(true);
        }}
        document={editingDocument}
        onSave={async (updatedDoc, documentId) => {
          try {
            let saved;
            if (documentId) {
              saved = await updateDocumentService(documentId, updatedDoc);
              setDocuments(prev => prev.map(d => d._id === saved._id ? saved : d));
            } else {
              saved = await uploadDocument(updatedDoc);
              setDocuments(prev => [saved, ...prev]);
            }
            setIsEditDocumentOpen(false);
            setIsNavigationOpen(true);
          } catch (err) {
            console.error('Failed to save document:', err.message);
          }
        }}
      />

      <DocumentPreviewModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setIsNavigationOpen(true);
        }}
        document={viewingDocument}
      />
    </div>
  );
};

export default EmployeeProfile;
