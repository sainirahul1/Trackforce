import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { ArrowLeft, LayoutDashboard, User, Briefcase, FileText, Activity, Mail, Phone, MapPin, MoreVertical, ShieldCheck, TrendingUp, ShoppingBag, Map as MapIcon, Clock, HeartPulse, Building, Shield, UserCheck, Calendar, CheckCircle, Download, ExternalLink, Navigation, Store, LogIn, Linkedin, GraduationCap } from 'lucide-react';
import { mockEmployees } from '../../utils/mockData';
import Button from '../../components/ui/Button';

// --- Internal Section Components (Manager View) ---

const ProfileHeader = ({ employee }) => (
  <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 p-8 shadow-sm">
    <div className="flex flex-col md:flex-row md:items-center gap-8">
      <div className="flex-shrink-0 relative">
        <div className="w-36 h-36 rounded-[2.5rem] overflow-hidden border-2 border-white shadow-xl ring-1 ring-gray-100 dark:ring-gray-800">
          <img 
            src={employee.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"} 
            alt={employee.name} 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full border-4 border-white dark:border-gray-900 bg-emerald-500 flex items-center justify-center">
            <div className="h-2 w-2 rounded-full bg-white" />
        </div>
      </div>

      <div className="flex-grow">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-black text-gray-900 dark:text-white capitalize tracking-tight">
                {employee.name.toLowerCase()}
              </h1>
              <span className="flex items-center gap-1.5 rounded-full bg-blue-50 text-blue-600 px-3 py-1 text-[10px] font-black uppercase tracking-wider">
                <CheckCircle size={14} strokeWidth={3} />
                VERIFIED
              </span>
            </div>
            <p className="mt-2 text-lg font-bold text-gray-500 dark:text-gray-400">
              {employee.designation} • {employee.team}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-8">
              <div className="flex items-center gap-2.5 text-gray-500 font-semibold">
                <Phone size={18} className="text-gray-400" />
                <span>+91 91234 56789</span>
              </div>
              <div className="flex items-center gap-2.5 text-gray-500 font-semibold">
                <MapPin size={18} className="text-gray-400" />
                <span>Bengaluru Hub</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 no-print">
            <button className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-800 text-blue-600 px-8 py-3 rounded-2xl font-black text-sm tracking-wide shadow-lg shadow-blue-500/5 hover:scale-105 active:scale-95 transition-all">
              Manage Access
            </button>
            <button className="p-3 rounded-2xl bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 hover:scale-105 active:scale-90">
              <MoreVertical size={20} />
            </button>
          </div>
        </div>

        {/* Real Profile Info - No Skeletons */}
        <div className="mt-8 pt-8 border-t border-gray-50 dark:border-gray-800 flex flex-wrap items-center gap-10">
           <div className="flex items-center gap-3 group cursor-pointer">
             <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 transition-transform group-hover:scale-110">
                <Mail size={16} />
             </div>
             <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Email Address</p>
                <p className="text-sm font-bold text-gray-700 dark:text-gray-200">{employee.email}</p>
             </div>
           </div>
           <div className="flex items-center gap-3 group cursor-pointer">
             <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 transition-transform group-hover:scale-110">
                <LayoutDashboard size={16} />
             </div>
             <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Operational Role</p>
                <p className="text-sm font-bold text-gray-700 dark:text-gray-200">Field Lead • Zone A</p>
             </div>
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

// --- Simplified Print-Only Layout (Single Page Summary) ---
const PrintOnlyLayout = ({ employee }) => (
  <div className="hidden print:block w-full text-gray-900 bg-white p-12">
    <style>{`
      @media print {
        @page { size: A4; margin: 1cm; }
        body { -webkit-print-color-adjust: exact; }
      }
    `}</style>

    {/* Header */}
    <div className="border-b-4 border-gray-900 pb-6 mb-10 flex justify-between items-end">
      <div>
        <h1 className="text-4xl font-black uppercase tracking-tight">{employee.name}</h1>
        <p className="text-xl font-bold text-gray-500 uppercase tracking-widest">{employee.designation}</p>
      </div>
      <div className="text-right">
        <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Profile Report</p>
        <p className="text-lg font-bold">Ref: TF-{employee.id}-{new Date().getFullYear()}</p>
      </div>
    </div>

    <div className="space-y-12">
      {/* 1. Employment Details */}
      <section>
        <h2 className="text-sm font-black uppercase tracking-[0.3em] text-blue-600 mb-6 border-l-4 border-blue-600 pl-4 bg-blue-50/50 py-2">
          Employment Details
        </h2>
        <div className="grid grid-cols-2 gap-y-6 gap-x-12 px-4">
          {[
            { label: 'Employee ID', value: `TF-EXE-${employee.id}` },
            { label: 'Department', value: 'Field Operations' },
            { label: 'Current Designation', value: employee.designation },
            { label: 'Team/Zone', value: employee.team },
            { label: 'Base Location', value: 'Central Bengaluru Hub' },
            { label: 'Reporting Structure', value: 'Management Level 1' }
          ].map((item, i) => (
            <div key={i} className="border-b border-gray-100 pb-2">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{item.label}</p>
              <p className="font-bold text-gray-800 text-sm">{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Personal Information */}
      <section>
        <h2 className="text-sm font-black uppercase tracking-[0.3em] text-emerald-600 mb-6 border-l-4 border-emerald-600 pl-4 bg-emerald-50/50 py-2">
          Personal Information
        </h2>
        <div className="grid grid-cols-2 gap-y-6 gap-x-12 px-4">
          {[
            { label: 'Contact Number', value: '+91 91234 56789' },
            { label: 'Official Email', value: employee.email },
            { label: 'Residential Address', value: 'Indiranagar, Bengaluru, KA' },
            { label: 'Nationality', value: 'Indian' },
            { label: 'Emergency Contact', value: '+91 98765 43210' },
            { label: 'Gender', value: 'Male' }
          ].map((item, i) => (
            <div key={i} className="border-b border-gray-100 pb-2">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{item.label}</p>
              <p className="font-bold text-gray-800 text-sm">{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Document Details */}
      <section>
        <h2 className="text-sm font-black uppercase tracking-[0.3em] text-purple-600 mb-6 border-l-4 border-purple-600 pl-4 bg-purple-50/50 py-2">
          Document Details
        </h2>
        <div className="grid grid-cols-3 gap-6 px-4">
          {['Government ID Card', 'Tax Compliance ID', 'Background Verification', 'Operational Permit', 'Health Clearance'].map((doc, i) => (
            <div key={i} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
                <FileText size={16} className="text-purple-600" />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-900 uppercase leading-none mb-1">{doc}</p>
                <p className="text-[9px] font-bold text-emerald-600 uppercase">Verified</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>

    {/* Footer */}
    <div className="mt-20 pt-8 border-t border-gray-100 text-center opacity-30">
       <p className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-400">Internal Administration • Confidential Documentation</p>
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
  const { setPageLoading } = useOutletContext();
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (setPageLoading) setPageLoading(false);
  }, [setPageLoading]);

  const handleGeneratePDF = () => {
    window.print();
  };

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
    <div className="min-h-screen pb-20 print:p-0">
      <style>
        {`
          @media print {
            .no-print { display: none !important; }
            body { background: white !important; margin: 0; padding: 0; }
            .print-container { width: 100%; border: none !important; box-shadow: none !important; border-radius: 0 !important; }
            .print-shadow-none { box-shadow: none !important; }
            @page { margin: 2cm; }
          }
        `}
      </style>
      
      <div className="print:hidden">
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
             <Button 
              variant="outline" 
              className="rounded-2xl border-gray-200 dark:border-gray-700 dark:text-white dark:bg-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all font-bold px-6 py-2.5"
              onClick={handleGeneratePDF}
             >
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
        <div>
          {renderContent()}
        </div>
      </div>

      {/* Print-Only Layout */}
      <PrintOnlyLayout employee={employee} />
    </div>
  );
};

export default EmployeeDetails;
