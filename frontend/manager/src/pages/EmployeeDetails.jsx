import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { 
  ArrowLeft, LayoutDashboard, User, Briefcase, FileText, Activity, 
  Mail, Phone, MapPin, MoreVertical, ShieldCheck, TrendingUp, 
  ShoppingBag, Map as MapIcon, Clock, HeartPulse, Building, 
  Shield, UserCheck, Calendar, CheckCircle, Download, 
  ExternalLink, Navigation, Store, LogIn, Linkedin, 
  GraduationCap, Loader2, Battery, Zap, Gauge, Users, 
  UserPlus, FileSignature, CheckCircle2, X 
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend 
} from 'recharts';
import tenantService from '../services/core/tenantService';
import Button from '../components/ui/Button';
import { useDialog } from '../context/DialogContext';

// --- Sub-Components ---

const ProfileHeader = ({ employee, onEdit }) => (
  <div className="relative bg-white dark:bg-gray-950 rounded-[3rem] p-10 border border-gray-100 dark:border-gray-800 shadow-2xl shadow-gray-200/20 overflow-hidden">
    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50 dark:bg-blue-900/10 rounded-full blur-3xl -mr-48 -mt-48 opacity-50" />
    <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-50 dark:bg-purple-900/10 rounded-full blur-3xl -ml-36 -mb-36 opacity-50" />
    
    <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
      <div className="relative group">
        <div className="absolute -inset-1.5 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition-opacity" />
        <div className="relative w-36 h-36 rounded-[2.2rem] bg-gray-50 dark:bg-gray-800 flex items-center justify-center overflow-hidden border-4 border-white dark:border-gray-900 shadow-xl">
          {employee.profile?.profileImage ? (
            <img src={employee.profile.profileImage} alt={employee.name} className="w-full h-full object-cover" />
          ) : (
            <Users size={60} className="text-gray-200 dark:text-gray-700" />
          )}
        </div>
        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 rounded-2xl border-4 border-white dark:border-gray-950 flex items-center justify-center text-white shadow-lg">
          <ShieldCheck size={18} />
        </div>
      </div>

      <div className="flex-1 text-center md:text-left space-y-4">
        <div>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
            <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter uppercase">{employee.name}</h1>
            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
              employee.status === 'Active' || employee.status === 'On Duty' 
                ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                : 'bg-gray-50 text-gray-500 border-gray-100'
            }`}>
              {employee.status}
            </span>
          </div>
          <p className="text-gray-400 font-bold uppercase tracking-[0.3em] text-xs px-1">
             {employee.profile?.designation || 'Field Executive'} • {employee.profile?.employeeCode || 'TF-ID-PENDING'}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
            <Mail size={14} className="text-blue-500" />
            <span className="text-sm font-bold text-gray-600 dark:text-gray-400">{employee.email}</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
            <Phone size={14} className="text-purple-500" />
            <span className="text-sm font-bold text-gray-600 dark:text-gray-400">{employee.profile?.phone || 'Not provided'}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 min-w-[200px]">
        <Button 
          variant="primary" 
          className="rounded-2xl font-black text-xs uppercase tracking-widest py-4 shadow-xl shadow-blue-500/20"
          onClick={onEdit}
        >
          Edit Profile
        </Button>
      </div>
    </div>
  </div>
);

const OverviewSection = ({ employee, analyticsData }) => {
  const stats = [
    { 
      label: 'Completion Rate', 
      value: analyticsData?.overview?.completionRate || '0%', 
      sub: 'Performance Metric', 
      icon: TrendingUp, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50' 
    },
    { 
      label: 'MTD Orders', 
      value: analyticsData?.overview?.ordersMTD || '0', 
      sub: analyticsData?.overview?.revenueMTD || '₹0k Revenue', 
      icon: ShoppingBag, 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-50' 
    },
    { 
      label: 'Avg visits/day', 
      value: analyticsData?.overview?.avgVisitsPerDay || '0', 
      sub: 'Field Density', 
      icon: MapIcon, 
      color: 'text-purple-600', 
      bg: 'bg-purple-50' 
    },
    { 
      label: 'Sustainability', 
      value: analyticsData?.latestSession?.activitySummary?.lastBattery ? `${analyticsData.latestSession.activitySummary.lastBattery}%` : 'N/A', 
      sub: 'Device Health', 
      icon: Battery, 
      color: 'text-orange-600', 
      bg: 'bg-orange-50' 
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, i) => (
        <div key={i} className="group relative overflow-hidden bg-white dark:bg-gray-950 p-6 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
          <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} dark:bg-opacity-10 w-fit mb-4 transition-transform group-hover:scale-110 shadow-inner`}>
            <stat.icon size={22} />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-2xl font-black text-gray-900 dark:text-white mt-1">{stat.value}</p>
            <p className="text-[9px] font-black text-gray-400 mt-1 uppercase tracking-wider">{stat.sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

const PersonalInfoSection = ({ employee }) => {
  const infoGroups = [
    {
      title: 'Identity Details',
      icon: User,
      items: [
        { label: 'Full Legal Name', value: employee.name, icon: User },
        { label: 'Gender', value: employee.profile?.gender || 'Not specified', icon: User },
        { label: 'Nationality', value: employee.profile?.nationality || 'Not specified', icon: Globe },
        { label: 'Date of Birth', value: employee.profile?.dob || 'Not provided', icon: Calendar },
      ]
    },
    {
      title: 'Contact Profile',
      icon: Mail,
      items: [
        { label: 'Official Email', value: employee.email, icon: Mail },
        { label: 'Linked Phone', value: employee.profile?.phone || 'Not provided', icon: Phone },
        { label: 'Field Address', value: employee.profile?.address || 'Not provided', icon: MapPin },
        { label: 'Base Zone', value: employee.profile?.zone || 'Unassigned', icon: Navigation },
      ]
    },
    {
      title: 'Health & Support',
      icon: HeartPulse,
      items: [
        { label: 'Emergency Contact', value: employee.profile?.emergencyContact || 'Not provided', icon: Phone },
        { label: 'Blood Group', value: employee.profile?.bloodGroup || 'Not provided', icon: Droplets },
        { label: 'Medical Allergies', value: employee.profile?.allergies || 'None recorded', icon: Activity },
      ]
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {infoGroups.map((group, i) => (
        <div key={i} className="bg-white dark:bg-gray-950 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600">
              <group.icon size={20} />
            </div>
            <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter">{group.title}</h3>
          </div>
          <div className="space-y-6">
            {group.items.map((item, j) => (
              <div key={j} className="group">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <item.icon size={11} />
                  {item.label}
                </p>
                <p className="mt-2 text-sm font-bold text-gray-700 dark:text-gray-300 group-hover:text-blue-600 transition-colors">
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
    { label: 'Executive Code', value: employee.profile?.employeeCode || 'TF-PENDING', icon: Briefcase },
    { label: 'Operational Role', value: employee.profile?.designation || 'Field Executive', icon: Shield },
    { label: 'Department', value: employee.profile?.department || 'Field Ops', icon: Building },
    { label: 'Join Date', value: employee.profile?.dateOfJoin || 'Not provided', icon: Calendar },
    { label: 'Reporting Hub', value: employee.profile?.location || 'Central Bengaluru', icon: MapPin },
    { label: 'Security Level', value: employee.profile?.securityLevel || 'Standard', icon: ShieldCheck },
  ];

  return (
    <div className="bg-white dark:bg-gray-950 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 p-10 overflow-hidden relative shadow-sm">
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 dark:bg-blue-900/10 rounded-full blur-3xl -mr-32 -mt-32" />
      <div className="relative">
        <h3 className="text-lg font-black text-gray-900 dark:text-white mb-10 uppercase tracking-tighter">Employment intelligence</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-10">
          {details.map((detail, i) => (
            <div key={i} className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-900 text-blue-600 shadow-inner">
                <detail.icon size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1.5">{detail.label}</p>
                <p className="text-sm font-black text-gray-800 dark:text-gray-200">{detail.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const DocumentsSection = ({ employee, onAdd }) => (
  <div className="space-y-8">
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter">Verified Credentials</h2>
      <Button 
        variant="outline" 
        className="rounded-xl border-dashed border-2 border-blue-200 text-blue-600 font-bold text-xs"
        onClick={onAdd}
      >
        <UserPlus size={14} className="mr-2" />
        Record Document
      </Button>
    </div>
    <div className="bg-white dark:bg-gray-950 rounded-[2.5rem] p-10 border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {employee.profile?.verifiedDocuments?.length > 0 ? (
          employee.profile.verifiedDocuments.map((doc, i) => (
            <div key={i} className="group relative p-6 bg-gray-50 dark:bg-gray-900 rounded-3xl border border-transparent hover:border-blue-100 dark:hover:border-blue-900 transition-all hover:shadow-lg hover:shadow-blue-500/5 overflow-hidden">
               <div className="absolute top-0 right-0 w-24 h-24 bg-blue-100/30 dark:bg-blue-900/10 rounded-full blur-2xl -mr-12 -mt-12 opacity-0 group-hover:opacity-100 transition-opacity" />
               <div className="flex items-start gap-4 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm border border-gray-100 dark:border-gray-700">
                  <FileSignature size={24} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-black text-gray-900 dark:text-white text-sm uppercase mb-1">{doc.name}</h3>
                  <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-1.5">
                    <CheckCircle2 size={10} />
                    Logged {doc.verifiedAt ? new Date(doc.verifiedAt).toLocaleDateString() : 'Active'}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center">
            <div className="w-20 h-20 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-dashed border-gray-200 dark:border-gray-800">
              <FileText size={32} className="text-gray-300" />
            </div>
            <p className="text-sm font-bold text-gray-400 italic">No government or operational documents on file</p>
          </div>
        )}
      </div>
    </div>
  </div>
);

const TimelineSection = ({ analyticsData }) => {
  const activities = analyticsData?.activityFeed || [];
  const getEventMeta = (type) => {
    switch (type) {
      case 'ORDER': return { icon: ShoppingBag, bg: 'bg-emerald-100 text-emerald-600' };
      case 'VISIT': return { icon: Store, bg: 'bg-blue-100 text-blue-600' };
      case 'TASK': return { icon: FileText, bg: 'bg-purple-100 text-purple-600' };
      case 'SESSION': return { icon: Navigation, bg: 'bg-slate-100 text-slate-600' };
      default: return { icon: Activity, bg: 'bg-gray-100 text-gray-600' };
    }
  };

  return (
    <div className="bg-white dark:bg-gray-950 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 p-10 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 dark:bg-emerald-900/10 rounded-full blur-3xl opacity-50" />
      <h3 className="text-lg font-black text-gray-900 dark:text-white mb-10 tracking-tighter uppercase flex items-center gap-3">
        Live Performance Stream
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
      </h3>
      <div className="relative space-y-12 before:absolute before:inset-0 before:ml-5 lg:before:ml-6 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-blue-500 before:via-emerald-500 before:to-transparent">
        {activities.length > 0 ? activities.map((activity, i) => {
          const meta = getEventMeta(activity.type);
          return (
          <div key={i} className="relative flex items-center gap-6 lg:gap-10 grow animate-in slide-in-from-right-4 duration-500" style={{ animationDelay: `${i * 100}ms` }}>
            <div className={`relative flex items-center justify-center shrink-0 w-10 lg:w-12 h-10 lg:h-12 rounded-2xl shadow-lg ring-4 ring-white dark:ring-gray-900 ${meta.bg} z-10 hover:scale-110 transition-transform`}>
              <meta.icon size={20} />
            </div>
            <div className="grow">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-1">
                <h4 className="font-bold text-gray-900 dark:text-white text-sm">{activity.title}</h4>
                <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">{new Date(activity.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{activity.desc}</p>
            </div>
          </div>
        )}) : (
          <div className="py-20 text-center opacity-30 flex flex-col items-center gap-4">
             <Activity size={48} />
             <p className="font-black uppercase tracking-widest text-[10px]">No recent operational logs documented</p>
          </div>
        )}
      </div>
    </div>
  );
};

const DeepAnalyticsSection = ({ analyticsData, loading }) => {
  if (loading) return <div className="h-96 flex items-center justify-center bg-white dark:bg-gray-950 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm"><Loader2 className="animate-spin text-blue-500" /></div>;
  if (!analyticsData) return <div className="h-96 flex flex-col items-center justify-center bg-white dark:bg-gray-950 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm"><Activity className="text-gray-300 mb-4" size={48} /><p className="text-sm font-black text-gray-400 uppercase tracking-widest">No Telemetry Intel Available</p></div>;

  const activityData = [
    { name: 'Moving', value: analyticsData.aggregate7Days?.totalMovingTime || 0, color: '#10b981' },
    { name: 'Idle', value: analyticsData.aggregate7Days?.totalIdleTime || 0, color: '#f59e0b' },
    { name: 'Visiting', value: analyticsData.aggregate7Days?.totalVisitTime || 0, color: '#3b82f6' },
  ].filter(v => v.value > 0);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white dark:bg-gray-950 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 p-8 shadow-sm">
           <h3 className="text-sm font-black text-gray-900 dark:text-white mb-8 tracking-widest uppercase">Movement Distribution</h3>
           <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={activityData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {activityData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                  <Tooltip 
                     contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                     formatter={(value) => [`${Math.round(value / 60)} min`, 'Duration']}
                  />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
           </div>
        </div>
        <div className="lg:col-span-2 bg-white dark:bg-gray-950 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 p-8 shadow-sm">
           <div className="flex items-center justify-between mb-8">
              <h3 className="text-sm font-black text-gray-900 dark:text-white tracking-widest uppercase">Velocity analysis</h3>
              <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                <Gauge size={12} />
                Peak: {analyticsData.latestSession?.activitySummary?.maxSpeed?.toFixed(1) || 0} km/h
              </div>
           </div>
           <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analyticsData.telemetrySeries}>
                  <defs>
                    <linearGradient id="colorSpeed" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="timeLabel" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }} hide={analyticsData.telemetrySeries.length > 20} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }} unit="k/h" />
                  <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }} />
                  <Area type="monotone" dataKey="speed" stroke="#10b981" fillOpacity={1} fill="url(#colorSpeed)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-950 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 p-8 shadow-sm">
         <div className="flex items-center justify-between mb-8">
            <h3 className="text-sm font-black text-gray-900 dark:text-white tracking-widest uppercase">Battery Sustainability</h3>
            <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest">
              <Battery size={12} />
              Terminated At: {analyticsData.latestSession?.activitySummary?.lastBattery || 'N/A'}%
            </div>
         </div>
         <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analyticsData.telemetrySeries}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="timeLabel" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }} domain={[0, 100]} unit="%" />
                <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }} />
                <Line type="stepAfter" dataKey="battery" stroke="#3b82f6" strokeWidth={4} dot={false} />
              </LineChart>
            </ResponsiveContainer>
         </div>
      </div>
    </div>
  );
};

// --- Main EmployeeDetails Component ---

const EmployeeDetails = () => {
  const { setPageLoading } = useOutletContext();
  const { id } = useParams();
  const navigate = useNavigate();
  const { showAlert } = useDialog();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [editingData, setEditingData] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchEmployee();
    fetchAnalytics();
  }, [id]);

  const fetchEmployee = async () => {
    try {
      setLoading(true);
      if (setPageLoading) setPageLoading(true);
      const data = await tenantService.getEmployeeById(id);
      setEmployee(data);
    } catch (error) {
      console.error("Failed to fetch employee", error);
      showAlert('Error', 'Failed to retrieve executive profile.', 'error');
    } finally {
      setLoading(false);
      if (setPageLoading) setPageLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      setAnalyticsLoading(true);
      const data = await tenantService.getEmployeeAnalytics(id);
      setAnalyticsData(data);
    } catch (error) {
      console.error("Failed to fetch analytics", error);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      await tenantService.updateEmployee(id, editingData);
      showAlert('Success', 'Profile intellignce updated successfully.', 'success');
      setIsEditModalOpen(false);
      fetchEmployee();
    } catch (error) {
      showAlert('Error', 'Failed to save profile changes.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleVerifyDocument = async (e) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const formData = new FormData(e.target);
      const docData = {
        name: formData.get('name'),
        url: formData.get('url')
      };
      await tenantService.verifyDocument(id, docData);
      showAlert('Success', 'Document logged and verified.', 'success');
      setIsDocModalOpen(false);
      fetchEmployee();
    } catch (error) {
      showAlert('Error', 'Failed to log document.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 min-h-[60vh] flex flex-col items-center justify-center p-8 bg-gray-50 dark:bg-gray-950">
        <Loader2 size={48} className="text-blue-500 animate-spin mb-4" />
        <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest animate-pulse">Establishing Secure Uplink...</p>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'personal', label: 'Persona', icon: User },
    { id: 'employment', label: 'Operations', icon: Briefcase },
    { id: 'documents', label: 'Credentials', icon: FileText },
    { id: 'analytics', label: 'Deep Analytics', icon: TrendingUp },
    { id: 'activity', label: 'Live Stream', icon: Activity },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'personal': return <PersonalInfoSection employee={employee} />;
      case 'employment': return <EmploymentSection employee={employee} />;
      case 'documents': return <DocumentsSection employee={employee} onAdd={() => setIsDocModalOpen(true)} />;
      case 'analytics': return <DeepAnalyticsSection analyticsData={analyticsData} loading={analyticsLoading} />;
      case 'activity': return <TimelineSection analyticsData={analyticsData} />;
      default: return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <OverviewSection employee={employee} analyticsData={analyticsData} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
             <TimelineSection analyticsData={analyticsData} />
             <div className="space-y-10">
               <EmploymentSection employee={employee} />
               <DocumentsSection employee={employee} onAdd={() => setIsDocModalOpen(true)} />
             </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen pb-20 animate-in fade-in duration-500">
      
      {/* Navigation Header */}
      <div className="flex items-center justify-between mb-8">
        <button onClick={() => navigate(-1)} className="group flex items-center gap-3 text-gray-500 hover:text-blue-600 transition-all">
          <div className="p-2.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm group-hover:scale-110 transition-transform">
            <ArrowLeft size={18} />
          </div>
          <span className="font-black text-[10px] tracking-[0.2em] uppercase">Return to base</span>
        </button>
        <div className="flex items-center gap-3">
           <Button variant="outline" className="rounded-2xl border-gray-200 dark:border-gray-700 bg-white/50 backdrop-blur-sm font-bold px-6 py-2.5" onClick={() => window.print()}>
             Generate PDF Profile
           </Button>
        </div>
      </div>

      <ProfileHeader employee={employee} onEdit={() => {
        setEditingData({
          name: employee.name,
          email: employee.email,
          status: employee.status,
          ...employee.profile
        });
        setIsEditModalOpen(true);
      }} />

      {/* Tab Navigation */}
      <div className="mt-12 mb-10 overflow-x-auto">
        <div className="flex items-center gap-2 p-1.5 bg-gray-100/50 dark:bg-gray-900/40 backdrop-blur-md rounded-[2rem] w-fit border border-gray-100 dark:border-gray-800">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-3 px-6 py-3 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-white dark:bg-gray-800 text-blue-600 shadow-lg scale-105' : 'text-gray-400 hover:text-gray-600'}`}>
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500" key={activeTab}>
        {renderContent()}
      </div>

      {/* Modals */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setIsEditModalOpen(false)} />
          <div className="relative w-full max-w-4xl bg-white dark:bg-gray-950 rounded-[3rem] shadow-2xl border border-white/20 overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <h2 className="text-xl font-black uppercase tracking-tighter">Edit Executive Profile</h2>
              <button onClick={() => setIsEditModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={20} /></button>
            </div>
            <form onSubmit={handleUpdateProfile} className="p-8 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h3 className="text-xs font-black text-blue-600 uppercase tracking-widest border-l-4 border-blue-600 pl-3">Identity Context</h3>
                  <div className="space-y-4">
                    <label className="block text-[10px] font-black uppercase text-gray-400">Full Name</label>
                    <input value={editingData.name} onChange={e => setEditingData({...editingData, name: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 font-bold text-sm" />
                  </div>
                  <div className="space-y-4">
                    <label className="block text-[10px] font-black uppercase text-gray-400">Designation</label>
                    <input value={editingData.designation} onChange={e => setEditingData({...editingData, designation: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 font-bold text-sm" />
                  </div>
                </div>
                <div className="space-y-6">
                   <h3 className="text-xs font-black text-purple-600 uppercase tracking-widest border-l-4 border-purple-600 pl-3">Contact Payload</h3>
                   <div className="space-y-4">
                    <label className="block text-[10px] font-black uppercase text-gray-400">Phone Number</label>
                    <input value={editingData.phone} onChange={e => setEditingData({...editingData, phone: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 font-bold text-sm" />
                  </div>
                  <div className="space-y-4">
                    <label className="block text-[10px] font-black uppercase text-gray-400">Address</label>
                    <input value={editingData.address} onChange={e => setEditingData({...editingData, address: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 font-bold text-sm" />
                  </div>
                </div>
              </div>
              <div className="mt-12 flex gap-4">
                <Button type="submit" variant="primary" className="flex-1 py-4 rounded-2xl font-black uppercase tracking-widest" disabled={isSaving}>
                  {isSaving ? 'Encrypting Data...' : 'Synchronize Profile'}
                </Button>
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 py-4 bg-gray-100 rounded-2xl font-black uppercase tracking-widest text-gray-500">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDocModalOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setIsDocModalOpen(false)} />
          <div className="relative w-full max-w-md bg-white dark:bg-gray-950 rounded-[3rem] shadow-2xl p-10 border border-white/20 animate-in zoom-in-95 duration-300">
             <h2 className="text-xl font-black uppercase tracking-tighter mb-8 text-center text-blue-600">Register verified document</h2>
             <form onSubmit={handleVerifyDocument} className="space-y-8">
                <div className="space-y-4 text-center">
                  <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center text-blue-500 mx-auto shadow-inner border border-blue-100">
                     <FileSignature size={32} />
                  </div>
                  <p className="text-xs font-bold text-gray-400">Formal document validation and timestamp logging</p>
                </div>
                <div className="space-y-4">
                  <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest">Document Title</label>
                  <input name="name" placeholder="e.g. Passport Copy, Operational Permit" className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 font-bold text-sm" required />
                </div>
                <div className="space-y-4">
                   <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest">Storage Reference (URL)</label>
                   <input name="url" placeholder="https://cloud.storage/path/to/doc" className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 font-bold text-sm" />
                </div>
                <Button type="submit" variant="primary" className="w-full py-4 rounded-2xl font-black uppercase tracking-widest" disabled={isSaving}>
                  {isSaving ? 'Logging...' : 'Confirm Verification'}
                </Button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeDetails;
