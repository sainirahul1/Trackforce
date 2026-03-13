import React, { useState } from 'react';
import { User, Briefcase, FileText, Activity, LayoutDashboard, Settings, Mail, Phone, MapPin, MoreVertical, ShieldCheck, TrendingUp, ShoppingBag, Map as MapIcon, Clock, HeartPulse, Building, Shield, UserCheck, Calendar, CheckCircle, Download, ExternalLink } from 'lucide-react';

// --- Internal Section Components ---

const ProfileHeader = ({ employee }) => (
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
          <div className={`absolute -bottom-2 -right-2 h-8 w-8 rounded-full border-4 border-white flex items-center justify-center ${
            employee.status === 'On Duty' ? 'bg-emerald-500' : 'bg-gray-400'
          }`}>
            <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
          </div>
        </div>
      </div>
      <div className="flex-grow">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-black tracking-tight">{employee.name || "Abhiram R"}</h1>
              <span className="flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-widest backdrop-blur-md">
                <ShieldCheck size={14} />
                Employee Profile
              </span>
            </div>
            <p className="mt-2 text-lg font-medium text-indigo-100/80">{employee.designation || "Senior Field Executive"} • {employee.team || "Delta Team"}</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="bg-white text-indigo-600 hover:bg-indigo-50 px-6 py-2.5 rounded-2xl font-bold transition-all hover:scale-105 active:scale-95 shadow-lg whitespace-nowrap">
              Edit Profile
            </button>
            <button className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 transition-all backdrop-blur-md">
              <MoreVertical size={20} />
            </button>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-6 text-sm">
          <div className="flex items-center gap-2 text-indigo-100/90">
            <Mail size={16} className="text-white" />
            <span>{employee.email || 'abhiram@trackforce.com'}</span>
          </div>
          <div className="flex items-center gap-2 text-indigo-100/90">
            <Phone size={16} className="text-white" />
            <span>+91 91234 56789</span>
          </div>
          <div className="flex items-center gap-2 text-indigo-100/90">
            <MapPin size={16} className="text-white" />
            <span>Bengaluru, Karnataka</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

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
        { label: 'Primary Phone', value: '+91 91234 56789', icon: Phone },
        { label: 'Official Email', value: 'abhiram@trackforce.com', icon: Mail },
        { label: 'Residential Address', value: 'Indiranagar, Bengaluru, KA', icon: MapPin },
      ]
    },
    {
      title: 'Identification',
      icon: User,
      items: [
        { label: 'Full Name', value: 'Naresh yadav', icon: User },
        { label: 'Gender', value: 'Male', icon: User },
        { label: 'Nationality', value: 'Indian', icon: User },
      ]
    },
    {
      title: 'Health & Emergency',
      icon: HeartPulse,
      items: [
        { label: 'Blood Group', value: 'A+ Positive', icon: HeartPulse },
        { label: 'Emergency Contact', value: 'Deepika (Sister) - 9876543210', icon: Phone },
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
          <div key={i} className="group p-6 rounded-3xl border border-gray-50 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20 flex items-center justify-between hover:border-indigo-100 dark:hover:border-indigo-900/50 hover:bg-white dark:hover:bg-gray-800 transition-all">
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
              <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                doc.status.includes('Verified') || doc.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'
              }`}>
                {(doc.status.includes('Verified') || doc.status === 'Active') && <CheckCircle size={12} />}
                {doc.status}
              </span>
              <button className="p-2 text-gray-400 hover:text-indigo-600 transition-colors">
                <ExternalLink size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Main Page Component ---

const EmployeeProfile = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const employee = {
    name: 'Abhiram Rangoon',
    designation: 'Senior Field Executive',
    team: 'Delta Team',
    status: 'On Duty',
    email: 'abhiram@trackforce.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'
  };

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
        <button className="flex items-center gap-2 p-3 bg-gray-100 dark:bg-gray-800 rounded-2xl text-gray-600 dark:text-gray-400 hover:text-indigo-600 transition-colors">
          <Settings size={20} />
          <span className="font-bold text-sm">Account Settings</span>
        </button>
      </div>

      <ProfileHeader employee={employee} />

      <div className="mt-12 mb-10 overflow-x-auto pb-4">
        <div className="flex items-center gap-2 p-1.5 bg-gray-100/50 dark:bg-gray-800/40 backdrop-blur-md rounded-[2.5rem] w-fit border border-gray-100 dark:border-gray-800">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-6 py-4 rounded-[2rem] text-sm font-black transition-all whitespace-nowrap ${
                activeTab === tab.id
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
    </div>
  );
};

export default EmployeeProfile;
