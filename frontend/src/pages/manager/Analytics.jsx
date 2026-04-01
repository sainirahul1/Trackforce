import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, useOutletContext } from 'react-router-dom';
import {
  AlertCircle, ArrowLeft, Activity, Eye, MapPin, Briefcase, Store,
  ClipboardList, CheckCircle2, ShoppingBag, ArrowRight, Shield, Clock, Zap, Ban, TrendingUp,
  Fingerprint, Users, Navigation2, ChevronRight, BarChart3, Search, Moon, Sun, Bell, ExternalLink,
  Loader2, Check, X, XCircle, Maximize2, ShieldCheck, Mail, Phone, ChevronDown, History, Camera
} from 'lucide-react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Filler, Tooltip
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import tenantService from '../../services/core/tenantService';
import { getVisitById, updateVisit } from '../../services/employee/visitService';
import { useDialog } from '../../context/DialogContext';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Filler, Tooltip);

const IntelligenceSuite = () => {
  const { showAlert } = useDialog();
  const navigate = useNavigate();
  const { setPageLoading } = useOutletContext();
  const [view, setView] = useState('list');
  const [statusFilter, setStatusFilter] = useState('All');
  const [timeFilter, setTimeFilter] = useState('Daily');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [selectedVisitLoading, setSelectedVisitLoading] = useState(false);
  const [activePhoto, setActivePhoto] = useState(null);
  const [observationCategory, setObservationCategory] = useState('General Overview');
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectionReasonInput, setRejectionReasonInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const categoryContent = {
    'General Overview': "The store inventory was mostly organized, however, some discrepancies were noted in the inward goods section. Client was cooperative and provided all necessary documentation for the audit trail. No major issues faced during the field protocol execution.",
    'Inventory Compliance': "Stock levels for premium SKUs are maintained at 85%. End-cap displays are correctly positioned as per the planogram. Inward goods documentation is complete and verified.",
    'Staff Performance': "Executive demonstrated excellent product knowledge and client engagement. Store manager noted the promptness and professionalism of the field officer during the audit.",
    'Client Feedback': "Client expressed satisfaction with the real-time reporting capabilities. Requested a follow-up on the promotional display efficacy by next week's visit.",
    'Protocol Variance': "Minor variance noted in the geo-tagging at the entrance. Site-path protocols were strictly followed otherwise, with all checkpoints covered accurately."
  };

  const [employees, setEmployees] = useState([]);
  const [taskLogs, setTaskLogs] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({
    Daily: {
      revenue: { val: '₹0', data: [30, 45, 40, 70, 50, 85, 95] },
      tasks: { val: '0', data: [20, 35, 25, 45, 30, 50, 42] },
      success: { val: '0%', data: [60, 75, 70, 85, 80, 92, 91.4] },
      performance: { val: '0%', data: [65, 70, 75, 72, 80, 85, 85] }
    },
    Weekly: {
      revenue: { val: '₹0', data: [85, 95, 110, 105, 130, 150, 142] },
      tasks: { val: '0', data: [240, 260, 290, 275, 310, 295, 284] },
      success: { val: '0%', data: [85, 87, 86, 90, 88, 89, 89.2] },
      performance: { val: '0%', data: [80, 81, 80, 83, 82, 82, 82] }
    },
    Monthly: {
      revenue: { val: '₹0', data: [420, 450, 480, 460, 500, 530, 512] },
      tasks: { val: '0', data: [980, 1020, 1050, 1080, 1150, 1100, 1120] },
      success: { val: '0%', data: [88, 89, 90, 89, 91, 90, 90.5] },
      performance: { val: '0%', data: [85, 86, 87, 86, 88, 89, 88] }
    }
  });

  const handleViewVisit = async (log) => {
    try {
      setSelectedVisitLoading(true);
      setSelectedVisit(log);

      let detailData = null;
      try {
        detailData = await getVisitById(log.id);
      } catch (e) {
        // Fallback to task if visit not found
        console.log("Visit not found, trying task fallback...");
        detailData = await getTaskById(log.id);
      }

      const visitDate = new Date(detailData.timestamp || detailData.createdAt || detailData.date);
      const isValidDate = !isNaN(visitDate.getTime());
      const empName = detailData.employee?.name || log.executive;
      const initials = (empName || 'Unknown').split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase();

      // Extract photos from either StoreVisit (photos) or Task (evidence)
      let photos = [];
      if (detailData.photos) {
        photos = detailData.photos;
      } else if (detailData.evidence) {
        if (detailData.evidence.storeFront) photos.push(detailData.evidence.storeFront);
        if (detailData.evidence.selfie) photos.push(detailData.evidence.selfie);
        if (detailData.evidence.productDisplay) photos.push(detailData.evidence.productDisplay);
        if (detailData.evidence.officialDoc) photos.push(detailData.evidence.officialDoc);
      }

      setSelectedVisit({
        ...log,
        ...detailData,
        id: detailData._id,
        store: detailData.storeName || detailData.store,
        executive: empName,
        avatar: initials,
        time: isValidDate ? visitDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : log.time,
        location: (detailData.gps?.lat || detailData.coords?.x) ? `Verified (GPS: ${(detailData.gps?.lat || detailData.coords?.x).toFixed(4)}, ${(detailData.gps?.lng || detailData.coords?.y).toFixed(4)})` : 'Location data not available',
        photosCount: photos.length,
        proofs: photos.map((url, idx) => ({
          id: idx + 1,
          title: `Evidence ${idx + 1}`,
          img: url,
        })),
        notes: detailData.notes || detailData.visitNotes,
        checklist: detailData.checklist || [],
        reviewStatus: detailData.reviewStatus || log.reviewStatus || 'pending',
        rejectionReason: detailData.rejectionReason || null,
      });
    } catch (err) {
      console.error('Error fetching visit details:', err);
    } finally {
      setSelectedVisitLoading(false);
    }
  };

  const handleAction = async (id, newReviewStatus, reason = null) => {
    try {
      const payload = { reviewStatus: newReviewStatus };
      if (reason) payload.rejectionReason = reason;
      await updateVisit(id, payload);

      // Update local state
      setTaskLogs(prev => prev.map(log =>
        log.id === id ? { ...log, reviewStatus: newReviewStatus, rejectionReason: reason } : log
      ));

      if (selectedVisit && selectedVisit.id === id) {
        setSelectedVisit(prev => ({ ...prev, reviewStatus: newReviewStatus, rejectionReason: reason }));
      }

      setIsRejecting(false);
      setRejectionReasonInput('');
      showAlert('Review status updated successfully.', 'Status Updated', 'success');
    } catch (err) {
      console.error('Error updating visit review status:', err);
      showAlert('Failed to update review status.', 'Update Error', 'error');
    }
  };

  useEffect(() => {
    const fetchRealtimeData = async () => {
      try {
        setLoading(true);
        const [empRes, taskRes] = await Promise.all([
          tenantService.getEmployees(),
          getTasks()
        ]);

        const emps = Array.isArray(empRes) ? empRes : [];
        const tasks = Array.isArray(taskRes) ? taskRes : [];

        let totalRevenue = 0;
        let activeTasksCount = 0;
        let completedTasksCount = 0;

        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfWeek = new Date(startOfDay.getTime() - 7 * 24 * 60 * 60 * 1000);
        const startOfMonth = new Date(startOfDay.getTime() - 30 * 24 * 60 * 60 * 1000);

        const calculateStats = (timeframeTasks) => {
          let tRev = 0;
          let aTasks = 0;
          let cTasks = 0;

          timeframeTasks.forEach(t => {
            if (t.status === 'completed') {
              tRev += (t.incentiveVal || Number(t.incentive) || 0);
              cTasks++;
            }
            if (['pending', 'in-progress'].includes(t.status)) {
              aTasks++;
            }
          });

          const overallSuccess = timeframeTasks.length > 0 ? Math.round((cTasks / timeframeTasks.length) * 100) : 0;
          const overallPerformance = timeframeTasks.length > 0 ? Math.round((cTasks / timeframeTasks.length) * 90) : 0;

          return {
            revenue: { val: `₹${tRev}`, data: [30, 45, 40, 70, 50, 85, 95] },
            tasks: { val: aTasks.toString(), data: [20, 35, 25, 45, 30, 50, 42] },
            success: { val: `${overallSuccess}%`, data: [60, 75, 70, 85, 80, 92, overallSuccess] },
            performance: { val: `${overallPerformance}%`, data: [65, 70, 75, 72, 80, 85, overallPerformance] }
          };
        };

        const dailyTasks = tasks.filter(t => new Date(t.date || t.createdAt) >= startOfDay);
        const weeklyTasks = tasks.filter(t => new Date(t.date || t.createdAt) >= startOfWeek);
        const monthlyTasks = tasks.filter(t => new Date(t.date || t.createdAt) >= startOfMonth);

        setDashboardStats({
          Daily: calculateStats(dailyTasks),
          Weekly: calculateStats(weeklyTasks),
          Monthly: calculateStats(monthlyTasks)
        });

        const empProcessed = emps.map(emp => {
          const empTasks = tasks.filter(t => {
            const tId = typeof t.employee === 'object' ? t.employee?._id : t.employee;
            return tId === emp._id;
          });

          let empRevenue = 0;
          let empCompleted = 0;
          let activeTitle = 'Idle';
          let empActive = false;

          empTasks.forEach(t => {
            if (t.status === 'completed') {
              empRevenue += (t.incentiveVal || Number(t.incentive) || 0);
              empCompleted++;
            }
            if (['pending', 'in-progress'].includes(t.status)) {
              empActive = true;
              if (activeTitle === 'Idle') activeTitle = t.title;
            }
          });

          const empSuccess = empTasks.length > 0 ? Math.round((empCompleted / empTasks.length) * 100) : 0;
          const initial = emp.name ? emp.name.match(/\b(\w)/g)?.join('').substring(0, 2).toUpperCase() : 'NA';
          const role = emp.profile?.designation || emp.role || 'Employee';
          const zone = emp.profile?.team || 'General';

          return {
            id: emp._id,
            name: emp.name,
            task: activeTitle,
            success: empSuccess,
            efficiency: `${empSuccess}%`,
            revenue: `₹${empRevenue}`,
            initial: initial || 'EM',
            role: role,
            zone: zone,
            status: emp.isDeactivated ? 'Offline' : (empActive ? 'Online' : 'Offline')
          };
        });

        setEmployees(empProcessed);

        const mapSubmissionStatus = (backendStatus) => {
          switch (backendStatus) {
            case 'completed': return 'Completed';
            case 'partially_completed': return 'Partial';
            case 'not_interested': return 'No Interest';
            case 'follow_up': return 'Follow-up';
            default: return 'Pending';
          }
        };

        const tLogs = tasks.map(t => {
          let sts = t.status === 'completed' ? 'Completed' : t.status === 'in-progress' ? 'Ongoing' : t.status === 'rejected' || t.status === 'cancelled' ? 'Rejected' : 'Pending';
          const visitDate = new Date(t.timestamp || t.date || t.createdAt);
          const initials = (t.employee?.name || 'Unknown').split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase();

          const photos = [];
          if (t.evidence) {
            if (t.evidence.storeFront) photos.push(t.evidence.storeFront);
            if (t.evidence.selfie) photos.push(t.evidence.selfie);
            if (t.evidence.productDisplay) photos.push(t.evidence.productDisplay);
            if (t.evidence.officialDoc) photos.push(t.evidence.officialDoc);
          }

          return {
            id: t._id,
            employeeId: typeof t.employee === 'object' ? t.employee?._id : t.employee,
            executive: t.employee?.name || 'Unknown',
            avatar: initials,
            designation: t.employee?.profile?.designation || 'Field Executive',
            title: t.title,
            client: t.store || t.companyName || 'Unknown Store',
            status: sts,
            submissionStatus: mapSubmissionStatus(t.status),
            date: visitDate.toLocaleDateString(),
            time: !isNaN(visitDate.getTime()) ? visitDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '---',
            photosCount: photos.length || t.photos?.length || 0,
            proofs: photos.length > 0 ? photos.map((url, idx) => ({ id: idx + 1, title: 'Evidence', img: url })) : [],
            reviewStatus: t.reviewStatus || 'pending',
            brief: t.visitNotes || t.description || 'Task assigned.'
          };
        });
        setTaskLogs(tLogs);

      } catch (err) {
        console.error('Failed to fetch realtime data', err);
      } finally {
        setLoading(false);
        if (setPageLoading) setPageLoading(false);
      }
    };

    fetchRealtimeData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const chartOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { x: { display: false }, y: { display: false } },
    elements: { line: { tension: 0.4 }, point: { radius: 0 } }
  };

  const currentStats = dashboardStats[timeFilter];

  const revenueData = {
    labels: ['', '', '', '', '', '', ''],
    datasets: [{
      data: currentStats.revenue.data,
      borderColor: '#0ea5e9',
      backgroundColor: 'rgba(14, 165, 233, 0.2)',
      fill: true,
      borderWidth: 3
    }]
  };

  const tasksData = {
    labels: ['', '', '', '', '', '', ''],
    datasets: [{
      data: currentStats.tasks.data,
      backgroundColor: 'rgba(168, 85, 247, 0.8)',
      borderRadius: 6,
      barThickness: 12
    }]
  };

  const successData = {
    labels: ['', '', '', '', '', '', ''],
    datasets: [{
      data: currentStats.success.data,
      borderColor: '#10b981',
      backgroundColor: 'rgba(16, 185, 129, 0.2)',
      fill: true,
      borderWidth: 3,
      tension: 0.5
    }]
  };

  const performanceData = {
    labels: ['', '', '', '', '', '', ''],
    datasets: [{
      data: currentStats.performance.data,
      borderColor: '#f43f5e',
      backgroundColor: 'rgba(244, 63, 94, 0.1)',
      fill: true,
      borderWidth: 3,
      stepped: true
    }]
  };

  // Inline views instead of defining them as functional components inside the render
  // to prevent re-mounting and focus loss on search state changes.





  const VisitDetailView = () => {
    if (!selectedVisit) return null;

    return (
      <div className="animate-in slide-in-from-bottom-12 [animation-duration:1000ms] [animation-timing-function:cubic-bezier(0.16,1,0.3,1)] max-w-[1400px] mx-auto">
        <div className="bg-white dark:bg-gray-950 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-[0_32px_128px_-16px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col min-h-[85vh] relative">
          {selectedVisitLoading && (
            <div className="absolute inset-0 z-[210] flex flex-col items-center justify-center bg-white/60 dark:bg-gray-950/60 backdrop-blur-sm rounded-[3rem]">
              <div className="w-12 h-12 rounded-full border-4 border-indigo-100 dark:border-indigo-900/30 border-t-indigo-600 animate-spin mb-4" />
              <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest animate-pulse">Fetching Mission Evidence...</p>
            </div>
          )}

          <div className="bg-gray-50/50 dark:bg-white/5 border-b border-gray-100 dark:border-gray-800 p-8 lg:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[400px] h-full bg-indigo-500/5 blur-[100px] -mr-32 pointer-events-none" />
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 relative z-10">
              <div className="flex items-center gap-8">
                <div className="relative shrink-0">
                  <div className="w-24 h-24 rounded-[2.5rem] bg-indigo-600 flex items-center justify-center text-white font-black text-4xl shadow-2xl border-4 border-white dark:border-gray-900">
                    {selectedVisit.avatar}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-10 h-10 bg-emerald-500 rounded-2xl flex items-center justify-center text-white border-4 border-white dark:border-gray-950 shadow-lg">
                    <ShieldCheck size={20} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">{selectedVisit.executive}</h2>
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${selectedVisit.reviewStatus === 'accepted' ? 'text-emerald-600 bg-emerald-50 border-emerald-100 dark:bg-emerald-500/10 dark:border-emerald-500/20' :
                      selectedVisit.reviewStatus === 'rejected' ? 'text-rose-600 bg-rose-50 border-rose-100 dark:bg-rose-500/10 dark:border-rose-500/20' :
                        'text-amber-600 bg-amber-50 border-amber-100 dark:bg-amber-500/10 dark:border-amber-500/20'
                      }`}>
                      {selectedVisit.reviewStatus === 'pending' ? 'Pending Review' : selectedVisit.reviewStatus === 'accepted' ? 'Accepted' : 'Rejected'}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-6">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                      <Users size={14} className="text-indigo-500" />
                      {selectedVisit.designation} • #{selectedVisit.id?.toString().slice(-6).toUpperCase()}
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-400 lowercase tracking-tight">
                      <Mail size={14} className="text-emerald-500" />
                      {selectedVisit.executive.toLowerCase().replace(' ', '.')}@trackforce.com
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                      <Phone size={14} className="text-blue-500" />
                      +91 98765 43210
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
            <div className="p-8 lg:p-12 border-r border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-black/10 overflow-y-auto">
              <div className="space-y-12">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-1.5 h-6 bg-indigo-600 rounded-full" />
                    <h5 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em]">Operational Mission</h5>
                  </div>
                  <h3 className="text-2xl font-black text-gray-950 dark:text-white tracking-tighter mb-4">{selectedVisit.title}</h3>
                  <p className="text-[13px] font-bold text-gray-500 leading-relaxed max-w-xl italic">
                    "{selectedVisit.brief}"
                  </p>
                </div>

                <div>
                  <h5 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] mb-8">Audit Intelligence Report</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { label: 'Target Location', value: selectedVisit.client, icon: Store, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                      { label: 'Audit Timestamp', value: `${selectedVisit.date} ${selectedVisit.time}`, icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
                      { label: 'Geospatial Delta', value: selectedVisit.location || 'Verified', icon: MapPin, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                      { label: 'Visual Evidence', value: `${selectedVisit.photosCount} HD Assets`, icon: Camera, color: 'text-indigo-600', bg: 'bg-indigo-50' }
                    ].map((item, id) => (
                      <div key={id} className="p-5 bg-white dark:bg-gray-900 rounded-[1.5rem] border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col gap-4 group transition-all hover:shadow-lg hover:border-indigo-100 dark:hover:border-indigo-500/20">
                        <div className={`w-12 h-12 rounded-xl ${item.bg} dark:bg-opacity-10 flex items-center justify-center ${item.color} shadow-inner group-hover:scale-110 transition-transform`}>
                          <item.icon size={20} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">{item.label}</p>
                          <p className="text-[13px] font-black text-gray-950 dark:text-white leading-tight tracking-tight">{item.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-12 pt-10 border-t border-gray-100 dark:border-gray-800">
                  <h5 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] mb-6">Review Protocol</h5>
                  {selectedVisit.reviewStatus === 'pending' ? (
                    !isRejecting ? (
                      <div className="grid grid-cols-1 gap-3">
                        <button onClick={() => handleAction(selectedVisit.id, 'accepted')} className="w-full py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest hover:bg-indigo-500 shadow-2xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-3">
                          <CheckCircle2 size={18} /> Approve Field Audit
                        </button>
                        <button onClick={() => setIsRejecting(true)} className="w-full py-5 bg-white dark:bg-gray-900 text-rose-500 border border-rose-100 dark:border-gray-800 rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest hover:border-rose-500 transition-all flex items-center justify-center gap-3">
                          <XCircle size={18} /> Reject Submission
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3 animate-in fade-in zoom-in-95">
                        <textarea value={rejectionReasonInput} onChange={(e) => setRejectionReasonInput(e.target.value)} placeholder="Enter detailed rejection remark..." className="w-full h-32 p-6 bg-white dark:bg-gray-950 border border-rose-500/20 rounded-[2rem] text-[13px] font-bold focus:ring-2 focus:ring-rose-500/10 transition-all resize-none dark:text-white" />
                        <div className="flex gap-3">
                          <button onClick={() => handleAction(selectedVisit.id, 'rejected', rejectionReasonInput)} disabled={!rejectionReasonInput.trim()} className="flex-[2] py-4 bg-rose-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-500 transition-all">Confirm Rejection</button>
                          <button onClick={() => { setIsRejecting(false); setRejectionReasonInput(''); }} className="flex-1 py-4 bg-white dark:bg-gray-900 text-gray-500 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-gray-100 dark:border-gray-800">Cancel</button>
                        </div>
                      </div>
                    )
                  ) : (
                    <div className={`rounded-[2.5rem] border p-8 flex items-center justify-between group overflow-hidden relative ${selectedVisit.reviewStatus === 'rejected'
                      ? 'bg-rose-50/50 dark:bg-rose-500/5 border-rose-100 dark:border-rose-500/10'
                      : 'bg-emerald-50/50 dark:bg-emerald-500/5 border-emerald-100 dark:border-emerald-500/10'
                      }`}>
                      <div className="flex items-center gap-6 md:gap-8 relative z-10">
                        <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-white shadow-xl ${selectedVisit.reviewStatus === 'rejected' ? 'bg-rose-500' : 'bg-emerald-500'}`}>
                          {selectedVisit.reviewStatus === 'rejected' ? <XCircle size={32} /> : <CheckCircle2 size={32} />}
                        </div>
                        <div>
                          <p className={`text-[11px] font-black uppercase tracking-[0.3em] mb-2 ${selectedVisit.reviewStatus === 'rejected' ? 'text-rose-600/60' : 'text-emerald-600/60'}`}>Audit Intelligence {selectedVisit.reviewStatus === 'rejected' ? 'Flagged' : 'Verified'}</p>
                          <h4 className={`text-xl md:text-2xl font-black tracking-tighter ${selectedVisit.reviewStatus === 'rejected' ? 'text-rose-600' : 'text-emerald-600'}`}>
                            {selectedVisit.reviewStatus.toUpperCase()}
                          </h4>
                          {selectedVisit.reviewStatus === 'rejected' && selectedVisit.rejectionReason && (
                            <p className="mt-4 p-4 bg-rose-50/50 dark:bg-rose-500/10 rounded-2xl border border-rose-100 dark:border-rose-500/20 text-[11px] font-bold text-rose-600 leading-relaxed italic">
                              "{selectedVisit.rejectionReason}"
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 lg:p-10 overflow-y-auto flex flex-col h-full bg-white dark:bg-gray-950">
              <div className="flex items-center justify-between mb-4 shrink-0">
                <div className="flex items-center gap-4">
                  <div className="w-1.5 h-6 bg-indigo-500 rounded-full" />
                  <div>
                    <h5 className="text-[12px] font-black text-gray-900 dark:text-white uppercase tracking-[0.3em]">Visual Evidence Discovery</h5>
                    <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">High-Fidelity Proofs for Integrity Validation</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 flex-1 content-start pb-10">
                {selectedVisit.proofs && selectedVisit.proofs.length > 0 ? (
                  selectedVisit.proofs.map((proof) => (
                    <div
                      key={proof.id}
                      onClick={() => setActivePhoto(proof)}
                      className="group relative overflow-hidden rounded-[2rem] border-[4px] border-white dark:border-gray-900 shadow-2xl aspect-square cursor-pointer hover:-translate-y-2 transition-all duration-700"
                    >
                      <img src={proof.img} alt={proof.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      <div className="absolute top-4 right-4 w-8 h-8 bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all">
                        <Maximize2 size={16} />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-24 flex flex-col items-center justify-center border-4 border-dashed border-gray-100 dark:border-gray-800 rounded-[3rem]">
                    <Camera size={48} className="text-gray-200 dark:text-gray-800 mb-6" />
                    <p className="text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-[0.4em]">No visual assets available</p>
                  </div>
                )}
              </div>

              <div className="mt-12 pt-10 border-t border-gray-100 dark:border-gray-800 space-y-8">
                <div className="p-8 bg-white dark:bg-gray-900 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-sm transition-all duration-500">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-1.5 h-6 bg-indigo-500 rounded-full" />
                    <h5 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em]">Visit Notes & Observations</h5>
                  </div>
                  <p className="pl-8 text-[14px] font-bold text-gray-600 dark:text-gray-400 leading-relaxed italic">
                    "{selectedVisit.notes || categoryContent[observationCategory]}"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="dark:bg-[#0b0d11] min-h-screen transition-colors duration-500">
      {selectedVisit ? (
        <div className="p-6">
          <button onClick={() => setSelectedVisit(null)} className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 hover:text-blue-600 mb-4 tracking-wider transition-colors">
            <ArrowLeft size={14} /> Back to Activity
          </button>
          <VisitDetailView />
        </div>
      ) : (view === 'list' ? (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0b0d11] p-6 transition-all duration-500">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <Activity className="text-blue-600" /> Performance Suite
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">Fleet Executive Management</p>
            </div>

            <div className="flex flex-1 max-w-md mx-8 relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
              <input
                type="text"
                placeholder="Search employees, roles, or zones..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
                className="w-full pl-12 pr-4 py-3 bg-white dark:bg-[#16191f] border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
              />
            </div>

            <div className="flex bg-white dark:bg-[#16191f] p-1 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
              {['Daily', 'Weekly', 'Monthly'].map(f => (
                <button key={f} onClick={() => setTimeFilter(f)} className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${timeFilter === f ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-blue-500'}`}>{f}</button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Revenue', val: currentStats.revenue.val, data: revenueData, type: 'line' },
              { label: 'Active Tasks', val: currentStats.tasks.val, data: tasksData, type: 'bar' },
              { label: 'Avg Success', val: currentStats.success.val, data: successData, type: 'line' },
              { label: 'Total Performance', val: currentStats.performance.val, data: performanceData, type: 'line' }
            ].map((card, i) => (
              <div key={i} className="group relative bg-white dark:bg-[#16191f] border-2 border-transparent p-6 rounded-[2rem] shadow-sm hover:border-blue-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all overflow-hidden cursor-default min-h-[140px]">
                <div className="relative z-10">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{card.label}</p>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white">{card.val}</h3>
                </div>
                <div className="absolute bottom-0 left-0 w-full h-24 opacity-40 group-hover:opacity-60 transition-opacity">
                  {card.type === 'line' ? (
                    <Line data={card.data} options={chartOptions} />
                  ) : (
                    <Bar data={card.data} options={chartOptions} />
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white dark:bg-[#16191f] border border-slate-200 dark:border-slate-800 rounded-[2rem] overflow-hidden shadow-xl transition-all">
            <div className="grid grid-cols-[2fr_2fr_1fr_1fr_0.5fr] p-6 border-b border-slate-100 dark:border-slate-800 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
              <span>Executive</span>
              <span>Current Status</span>
              <span className="text-center">Efficiency</span>
              <span className="text-center">Revenue</span>
              <span className="text-right">Action</span>
            </div>
            <div className="p-4 space-y-2">
              {(() => {
                const filtered = employees.filter(emp =>
                  emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  emp.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  emp.zone.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  emp.task.toLowerCase().includes(searchTerm.toLowerCase())
                );

                const totalPages = Math.ceil(filtered.length / itemsPerPage);
                const startIndex = (currentPage - 1) * itemsPerPage;
                const paginated = filtered.slice(startIndex, startIndex + itemsPerPage);

                return (
                  <>
                    {paginated.map((exec) => (
                      <div
                        key={exec.id}
                        onClick={() => { setSelectedEmployee(exec); setStatusFilter('All'); setView('profile'); }}
                        className="grid grid-cols-[2fr_2fr_1fr_1fr_0.5fr] p-6 items-center border-2 border-transparent hover:border-blue-500 hover:bg-slate-50 dark:hover:bg-slate-800/30 rounded-2xl transition-all cursor-pointer group"
                      >
                        <div className="flex items-center gap-4 overflow-hidden pr-2">
                          <div className="w-10 h-10 shrink-0 rounded-xl bg-blue-600 flex items-center justify-center text-sm font-black text-white shadow-lg group-hover:shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                            {exec.initial}
                          </div>
                          <div className="flex flex-col min-w-0 pr-4">
                            <span className="font-black text-slate-900 dark:text-white tracking-tight truncate">{exec.name}</span>
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider truncate">{exec.role}</span>
                          </div>
                        </div>
                        <div className="flex flex-col min-w-0 pr-4">
                          <span className="text-sm font-bold text-slate-600 dark:text-slate-300 truncate">{exec.task}</span>
                          <span className="text-[9px] font-black text-blue-500 uppercase truncate">{exec.status} Now</span>
                        </div>
                        <div className="text-center text-lg font-black text-emerald-500 italic">{exec.efficiency}</div>
                        <div className="text-center text-lg font-black text-slate-900 dark:text-white tracking-tighter">{exec.revenue}</div>
                        <div className="flex justify-end">
                          <span className="text-[10px] font-black uppercase text-blue-500 group-hover:underline tracking-widest">Profile</span>
                        </div>
                      </div>
                    ))}

                    {/* Pagination UI */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-center gap-2 mt-8 pb-4">
                        <button
                          onClick={(e) => { e.stopPropagation(); setCurrentPage(prev => Math.max(prev - 1, 1)); }}
                          disabled={currentPage === 1}
                          className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-white dark:bg-gray-800 border border-slate-200 dark:border-slate-800 text-slate-400 disabled:opacity-30 hover:text-blue-500 transition-all pointer-events-auto"
                        >
                          Prev
                        </button>

                        <div className="flex items-center gap-1">
                          {[...Array(totalPages)].map((_, i) => (
                            <button
                              key={i + 1}
                              onClick={(e) => { e.stopPropagation(); setCurrentPage(i + 1); }}
                              className={`w-8 h-8 rounded-lg text-[10px] font-black transition-all ${currentPage === i + 1
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                                : 'bg-white dark:bg-gray-800 text-slate-400 hover:text-blue-500 border border-slate-200 dark:border-slate-800'
                                }`}
                            >
                              {i + 1}
                            </button>
                          ))}
                        </div>

                        <button
                          onClick={(e) => { e.stopPropagation(); setCurrentPage(prev => Math.min(prev + 1, totalPages)); }}
                          disabled={currentPage === totalPages}
                          className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-white dark:bg-gray-800 border border-slate-200 dark:border-slate-800 text-slate-400 disabled:opacity-30 hover:text-blue-500 transition-all pointer-events-auto"
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0b0d11] p-6 transition-colors duration-500">
          <button onClick={() => setView('list')} className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 hover:text-blue-600 mb-4 tracking-wider transition-colors">
            <ArrowLeft size={14} /> Back to Fleet
          </button>

          {/* COMPACT PROFILE GRID */}
          <div className="bg-white dark:bg-[#16191f] border border-slate-200 dark:border-slate-800 p-6 rounded-[2rem] shadow-sm flex flex-col md:flex-row items-center justify-between mb-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-2xl font-black shadow-lg">
                  {selectedEmployee.initial}
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-white dark:border-[#16191f] rounded-full"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
                <div className="col-span-2">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-none">{selectedEmployee.name}</h2>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                  <Briefcase size={12} className="text-blue-500" /> {selectedEmployee.role}
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                  <Fingerprint size={12} className="text-blue-500" /> ID: TF-2026-{selectedEmployee.id ? selectedEmployee.id.toString().slice(-4).toUpperCase() : '88'}
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <MapPin size={12} className="text-blue-500" /> {selectedEmployee.zone} Zone
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <Users size={12} className="text-blue-500" /> Field Ops Dept.
                </div>
              </div>
            </div>

            <div className="flex items-center gap-10 mt-6 md:mt-0 pr-4">
              <div className="flex flex-col h-16 justify-center">
                <h4 className="text-4xl font-black text-blue-600 italic tracking-tighter leading-none">
                  {selectedEmployee.success}%
                </h4>
                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] mt-2">
                  Success Rate
                </p>
              </div>
            </div>
          </div>

          {/* KPI FILTERS */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
            {[
              { label: 'Assigned', count: taskLogs.filter(log => log.employeeId === selectedEmployee.id).length, filter: 'All', icon: <ClipboardList size={18} />, color: 'text-blue-500' },
              { label: 'Completed', count: taskLogs.filter(log => log.employeeId === selectedEmployee.id && log.status === 'Completed').length, filter: 'Completed', icon: <CheckCircle2 size={18} />, color: 'text-emerald-500' },
              { label: 'Pending', count: taskLogs.filter(log => log.employeeId === selectedEmployee.id && log.status === 'Pending').length, filter: 'Pending', icon: <Clock size={18} />, color: 'text-amber-500' },
              { label: 'Ongoing', count: taskLogs.filter(log => log.employeeId === selectedEmployee.id && log.status === 'Ongoing').length, filter: 'Ongoing', icon: <Activity size={18} />, color: 'text-indigo-500' },
              { label: 'Rejected', count: taskLogs.filter(log => log.employeeId === selectedEmployee.id && log.status === 'Rejected').length, filter: 'Rejected', icon: <Ban size={18} />, color: 'text-rose-500' }
            ].map((stat, i) => (
              <div
                key={i}
                onClick={() => setStatusFilter(stat.filter)}
                className={`bg-white dark:bg-[#16191f] p-4 rounded-2xl shadow-sm border-2 transition-all cursor-pointer ${statusFilter === stat.filter ? 'border-blue-500 bg-blue-50/20 shadow-[0_0_15px_rgba(59,130,246,0.2)]' : 'border-transparent hover:border-blue-500 hover:shadow-[0_0_15px_rgba(59,130,246,0.2)]'}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`${stat.color}`}>{stat.icon}</span>
                  <h4 className="text-xl font-black text-slate-900 dark:text-white italic">{stat.count}</h4>
                </div>
                <p className="text-[8px] font-black text-slate-500 uppercase tracking-tighter">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* ACTIVITY LOG WITH BRIEF DESCRIPTION */}
          <div className="bg-white dark:bg-[#16191f] border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b dark:border-slate-800/50">
              <h3 className="text-[12px] font-black uppercase tracking-widest text-blue-600">Executive Activity</h3>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[9px] font-black text-slate-500 uppercase tracking-tighter">
                Showing: {statusFilter}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {taskLogs
                .filter(log => log.employeeId === selectedEmployee.id && (statusFilter === 'All' || log.status === statusFilter))
                .map(log => (
                  <div
                    key={log.id}
                    onClick={() => handleViewVisit(log)}
                    className={`group bg-slate-50 dark:bg-[#1a1d23] p-4 rounded-2xl border-2 transition-all cursor-pointer ${selectedVisit?.id === log.id
                      ? 'border-emerald-500 bg-emerald-50/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                      : 'border-transparent hover:border-blue-500 hover:shadow-[0_0_15px_rgba(59,130,246,0.1)]'
                      }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        <div className="mt-1 p-2.5 bg-white dark:bg-slate-800 text-blue-500 rounded-lg shadow-sm">
                          <ClipboardList size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-black text-slate-900 dark:text-white text-sm tracking-tight">{log.title}</h4>
                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter bg-slate-200/50 dark:bg-slate-700 px-1.5 py-0.5 rounded">
                              {log.id.toString().slice(-6).toUpperCase()}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-400 text-[8px] font-bold uppercase tracking-tighter mt-1 mb-2">
                            <div className="flex items-center gap-1"><Store size={10} className="text-blue-500" /> <span>{log.client}</span></div>
                            <div className="flex items-center gap-1"><Clock size={10} className="text-blue-500" /> <span>{log.date} {log.time}</span></div>
                            <div className="flex items-center gap-1"><Camera size={10} className="text-indigo-500" /> <span>{log.photosCount} Proofs</span></div>
                            <div className="flex items-center gap-1"><Activity size={10} className="text-emerald-500" /> <span>Outcome: {log.submissionStatus}</span></div>
                            <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded ${log.reviewStatus === 'accepted' ? 'bg-emerald-500/10 text-emerald-500' :
                              log.reviewStatus === 'rejected' ? 'bg-rose-500/10 text-rose-500' : 'bg-amber-500/10 text-amber-500'
                              }`}>
                              <ShieldCheck size={10} /> <span>{log.reviewStatus.toUpperCase()}</span>
                            </div>
                          </div>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl italic">
                            "{log.brief}"
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleViewVisit(log); }}
                          className={`p-2 rounded-full transition-all shadow-lg ${selectedVisit?.id === log.id
                            ? 'bg-emerald-500 scale-95'
                            : 'bg-blue-600 hover:scale-110 active:scale-95 hover:shadow-blue-500/40'
                            } text-white`}
                          title="View Details"
                        >
                          {selectedVisit?.id === log.id ? (
                            <Check size={16} strokeWidth={4} className="animate-in zoom-in duration-300" />
                          ) : (
                            <ChevronRight size={16} strokeWidth={3} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )
      )}

      {activePhoto && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-0 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-gray-950/90 backdrop-blur-3xl" onClick={() => setActivePhoto(null)} />
          <div className="relative max-w-5xl w-full h-full flex flex-col items-center justify-center">
            <button
              onClick={(e) => { e.stopPropagation(); setActivePhoto(null); }}
              className="absolute top-4 right-4 md:top-6 md:right-6 p-4 text-white hover:scale-110 transition-all z-[100000] group"
            >
              <div className="bg-gray-800 rounded-full p-2.5 shadow-2xl border-2 border-gray-700 group-hover:bg-rose-500 transition-all">
                <X size={28} strokeWidth={3} />
              </div>
            </button>
            <div className="w-full h-full relative group flex items-center justify-center p-6">
              <img src={activePhoto.img} alt={activePhoto.title} className="max-w-full max-h-[88vh] object-contain rounded-3xl shadow-2xl border-4 border-white/20" />
            </div>
          </div>
        </div>
        , document.body)}
    </div>
  );
};

export default IntelligenceSuite;