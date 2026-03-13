import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, LayoutDashboard, User, Briefcase, FileText, Activity, Mail, Phone, MapPin, MoreVertical, ShieldCheck, TrendingUp, ShoppingBag, Map as MapIcon, Clock, HeartPulse, Building, Shield, UserCheck, Calendar, CheckCircle, Download, ExternalLink, Navigation, Store, LogIn } from 'lucide-react';
import { mockEmployees } from '../../utils/mockData';
import Button from '../../components/Button';

// --- Internal Section Components (Manager View) ---

const ProfileHeader = ({ employee }) => (
  <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-blue-600 to-blue-800 p-8 text-white shadow-2xl">
    <div className="absolute top-0 right-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-white/10 blur-3xl opacity-50" />
    <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-64 w-64 rounded-full bg-blue-400/20 blur-3xl opacity-30" />
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
              <h1 className="text-4xl font-black tracking-tight">{employee.name}</h1>
              <span className="flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-widest backdrop-blur-md">
                <ShieldCheck size={14} />
                Verified Executive
              </span>
            </div>
            <p className="mt-2 text-lg font-medium text-blue-100/80">{employee.designation} • {employee.team}</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-2.5 rounded-2xl font-bold transition-all hover:scale-105 active:scale-95 shadow-lg whitespace-nowrap">
              Manage Access
            </button>
            <button className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 transition-all backdrop-blur-md">
              <MoreVertical size={20} />
            </button>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-6 text-sm">
          <div className="flex items-center gap-2 text-blue-100/90">
            <Mail size={16} className="text-white" />
            <span>{employee.email}</span>
          </div>
          <div className="flex items-center gap-2 text-blue-100/90">
            <Phone size={16} className="text-white" />
            <span>+91 91234 56789</span>
          </div>
          <div className="flex items-center gap-2 text-blue-100/90">
            <MapPin size={16} className="text-white" />
            <span>Bengaluru Hub</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const OverviewSection = ({ employee }) => {
  const stats = [
    { label: 'Completion Rate', value: '92%', sub: 'Target: 95%', icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Orders (MTD)', value: '142', sub: '₹4.2L Revenue', icon: ShoppingBag, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Avg visits/day', value: '14.5', sub: 'Zone Delta', icon: MapIcon, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Avg Active Hrs', value: '7.8h', sub: 'Regular Shift', icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
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
        { label: 'Official Email', value: employee.email, icon: Mail },
        { label: 'Residential Address', value: 'Indiranagar, Bengaluru, KA', icon: MapPin },
      ]
    },
    {
      title: 'Work Profile',
      icon: User,
      items: [
        { label: 'Full Name', value: employee.name, icon: User },
        { label: 'Gender', value: 'Male', icon: User },
        { label: 'Nationality', value: 'Indian', icon: User },
      ]
    },
    {
      title: 'Emergency Contact',
      icon: HeartPulse,
      items: [
        { label: 'Relation', value: 'Dependant', icon: HeartPulse },
        { label: 'Contact', value: '9876543210', icon: Phone },
      ]
    }
  ];
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {infoGroups.map((group, i) => (
        <div key={i} className="bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600">
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
                <p className="mt-2 text-sm font-bold text-gray-700 dark:text-gray-200 leading-relaxed group-hover:text-blue-600 transition-colors">
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

const EmploymentSection = ({ employee }) => {
  const details = [
    { label: 'Employee ID', value: `TF-EXE-${employee.id}`, icon: Briefcase },
    { label: 'Department', value: 'Field Sales', icon: Building },
    { label: 'Designation', value: employee.designation, icon: Shield },
    { label: 'Base Location', value: 'Central Bengaluru', icon: MapPin },
    { label: 'Reporting Manager', value: 'Current User (You)', icon: UserCheck },
    { label: 'Shift Type', value: 'General (9AM - 6PM)', icon: Clock },
  ];
  return (
    <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 p-10 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 dark:bg-blue-900/10 rounded-full blur-3xl -mr-32 -mt-32" />
      <div className="relative">
        <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-10 tracking-tight">Employment Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-10">
          {details.map((detail, i) => (
            <div key={i} className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
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

const DocumentsSection = () => (
  <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 p-10">
    <div className="flex items-center justify-between mb-10">
      <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Verified Documents</h3>
      <button className="text-sm font-bold text-blue-600 hover:text-blue-700 underline flex items-center gap-2">
        <Download size={16} />
        Bulk Download
      </button>
    </div>
    <div className="grid grid-cols-1 gap-4">
      {['Govt ID (Verified)', 'Tax Documents', 'Background Check', 'Health Audit'].map((doc, i) => (
        <div key={i} className="flex items-center justify-between p-5 rounded-2xl bg-gray-50/50 dark:bg-gray-800/20 border border-gray-50 dark:border-gray-800">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl bg-blue-50 text-blue-600`}>
              <FileText size={20} />
            </div>
            <p className="font-bold text-gray-900 dark:text-white text-sm">{doc}</p>
          </div>
          <button className="text-gray-400 hover:text-blue-600 transition-colors">
            <ExternalLink size={18} />
          </button>
        </div>
      ))}
    </div>
  </div>
);

const TimelineSection = () => {
  const activities = [
    { type: 'CHECKIN', title: 'Route Started: Zone 04', time: '09:00 AM', desc: 'Starting daily coverage.', icon: Store, bg: 'bg-blue-100 text-blue-600' },
    { type: 'ORDER', title: 'Large Order: ₹24,000', time: '11:30 AM', desc: 'Successfully negotiated.', icon: ShoppingBag, bg: 'bg-emerald-100 text-emerald-600' },
    { type: 'LOGIN', title: 'Shift Login', time: '08:45 AM', desc: 'Secure login from assigned area.', icon: LogIn, bg: 'bg-purple-100 text-purple-600' },
  ];
  return (
    <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 p-10">
      <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-10 tracking-tight">Live Performance Stream</h3>
      <div className="relative space-y-12 before:absolute before:inset-0 before:ml-5 lg:before:ml-6 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-blue-500 before:via-emerald-500 before:to-transparent">
        {activities.map((activity, i) => (
          <div key={i} className="relative flex items-center gap-6 lg:gap-10 grow">
            <div className={`relative flex items-center justify-center shrink-0 w-10 lg:w-12 h-10 lg:h-12 rounded-2xl shadow-lg ring-4 ring-white dark:ring-gray-900 ${activity.bg} z-10 hover:scale-110 transition-transform`}>
              <activity.icon size={20} />
            </div>
            <div className="grow">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-1">
                <h4 className="font-bold text-gray-900 dark:text-white">{activity.title}</h4>
                <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">{activity.time}</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{activity.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const EmployeeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  // Find employee from mock data
  const employee = mockEmployees.find(emp => emp.id === parseInt(id)) || mockEmployees[0];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'employment', label: 'Employment', icon: Briefcase },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'activity', label: 'Activity', icon: Activity },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <OverviewSection employee={employee} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
               <TimelineSection />
               <div className="space-y-10">
                 <EmploymentSection employee={employee} />
                 <DocumentsSection />
               </div>
            </div>
          </div>
        );
      case 'personal':
        return <div className="animate-in fade-in slide-in-from-bottom-4 duration-500"><PersonalInfoSection employee={employee} /></div>;
      case 'employment':
        return <div className="animate-in fade-in slide-in-from-bottom-4 duration-500"><EmploymentSection employee={employee} /></div>;
      case 'documents':
        return <div className="animate-in fade-in slide-in-from-bottom-4 duration-500"><DocumentsSection /></div>;
      case 'activity':
        return <div className="animate-in fade-in slide-in-from-bottom-4 duration-500"><TimelineSection /></div>;
      default:
        return <OverviewSection employee={employee} />;
    }
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Navigation Header */}
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={() => navigate(-1)}
          className="group flex items-center gap-3 text-gray-500 hover:text-blue-600 transition-all"
        >
          <div className="p-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm group-hover:scale-110 transition-transform">
            <ArrowLeft size={18} />
          </div>
          <span className="font-bold text-sm tracking-widest uppercase">Back to Team</span>
        </button>

        <div className="flex items-center gap-3">
           <Button variant="outline" className="rounded-2xl border-gray-200 dark:border-gray-800">
             Generate PDF Profile
           </Button>
        </div>
      </div>

      {/* Profile Header Card */}
      <ProfileHeader employee={employee} />

      {/* Tab Navigation */}
      <div className="mt-12 mb-10 overflow-x-auto">
        <div className="flex items-center gap-2 p-1.5 bg-gray-100/50 dark:bg-gray-800/40 backdrop-blur-md rounded-[2rem] w-fit border border-gray-100 dark:border-gray-800">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-6 py-3 rounded-[1.5rem] text-sm font-black transition-all ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-gray-900 text-blue-600 shadow-lg scale-105'
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <tab.icon size={18} className={activeTab === tab.id ? 'text-blue-600' : 'text-gray-400'} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      {renderContent()}
    </div>
  );
};

export default EmployeeDetails;
