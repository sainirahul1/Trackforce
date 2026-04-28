/**
 * @file Visits.jsx
 * @description High-fidelity Manager Dashboard for reviewing Field Visits and Proofs.
 * Features include high-density row layouts, dynamic status-based UI, 
 * and a React Portal-based Lightbox for 100% viewport coverage.
 */

import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { useGoogleMaps } from '../context/GoogleMapsContext';
import { createPortal } from 'react-dom';
import { GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';
import { getSyncCachedData } from '../utils/cacheHelper';
import {
  Camera, MapPin, CheckCircle2, Clock, AlertCircle,
  ExternalLink, Maximize2, ShieldCheck, User, Store,
  Search, Filter, Calendar, ArrowRight, XCircle, RotateCcw,
  Check, X, MessageSquare, MoreHorizontal, Mail, Phone, ArrowLeft,
  ChevronDown, History, Radio, Activity, Navigation, Users, ArrowUpRight,
  Building2, ClipboardList
} from 'lucide-react';
import { getVisits, getVisitById, updateVisit } from '../services/visitService';
import { getActiveTrackingSessions } from '../services/trackingService';
import { useDialog } from '../context/DialogContext';
import { logActivity } from '../services/activityService';

/**
 * VisitRow Component
 * Renders a high-density, horizontal entry for the visits feed.
 */
const VisitRow = ({ visit, onReview, isLive }) => {
  const statusConfig = {
    'Completed': { color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-500/10', border: 'border-emerald-100 dark:border-emerald-500/20', icon: CheckCircle2 },
    'Partial': { color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-500/10', border: 'border-amber-100 dark:border-amber-500/20', icon: Clock },
    'Follow-up': { color: 'text-rose-600', bg: 'bg-rose-50 dark:bg-rose-500/10', border: 'border-rose-100 dark:border-rose-500/20', icon: RotateCcw },
    'No Interest': { color: 'text-rose-600', bg: 'bg-rose-50 dark:bg-rose-500/10', border: 'border-rose-100 dark:border-rose-500/20', icon: XCircle }
  };

  const status = statusConfig[visit.submissionStatus] || { color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-500/10', border: 'border-indigo-100 dark:border-indigo-500/20', icon: Activity };
  const StatusIcon = status.icon;

  return (
    <div
      onClick={onReview}
      className={`group bg-white dark:bg-gray-900 px-6 py-4 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-2xl hover:border-indigo-100 dark:hover:border-indigo-500/30 transition-all cursor-pointer flex flex-col lg:flex-row items-center gap-6 relative overflow-hidden`}
    >
      {isLive && (
        <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500 animate-pulse" />
      )}

      {/* Identification & Role */}
      <div className="flex items-center gap-4 w-full lg:w-[22%] shrink-0">
        <div className="relative">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg shrink-0 group-hover:scale-110 transition-transform duration-500">
            {visit.avatar || '??'}
          </div>
          {isLive && (
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-4 border-white dark:border-gray-900 flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
            </div>
          )}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h4 className="text-[15px] font-black text-gray-900 dark:text-white truncate tracking-tight uppercase italic">{visit.executive}</h4>
          </div>
          <div className="flex items-center gap-1.5 p-1 px-2 bg-gray-50 dark:bg-gray-800 rounded-lg w-fit border border-gray-100 dark:border-gray-700">
             <User size={10} className="text-gray-400" />
             <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest truncate">{visit.designation}</p>
          </div>
        </div>
      </div>

      {/* Main Intel: Store, Type & Timeline */}
      <div className="flex flex-col sm:flex-row lg:items-center gap-6 w-full lg:w-[45%]">
        <div className="flex flex-col gap-2 min-w-[180px]">
          <div className="flex items-center gap-2">
            <Store size={14} className="text-indigo-500" />
            <span className="text-[13px] font-black text-gray-900 dark:text-white truncate">
              {isLive && visit.liveLocation ? (
                <span className="text-emerald-500 flex items-center gap-1.5">
                  Live: {visit.city || visit.address || 'Active Tracking'}
                </span>
              ) : visit.store}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            {visit.visitType === 'supplier' && (
              <span className="px-2.5 py-1 rounded-lg bg-sky-50 dark:bg-sky-500/10 text-sky-600 border border-sky-100 dark:border-sky-500/20 text-[8px] font-black uppercase tracking-wider flex items-center gap-1.5">
                <Building2 size={10} /> Supplier Audit
              </span>
            )}
            {(!visit.visitType || visit.visitType === 'store') && (
              <span className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 border border-indigo-100 dark:border-indigo-500/20 text-[8px] font-black uppercase tracking-wider flex items-center gap-1.5">
                <Store size={10} /> Store Visit
              </span>
            )}
            {visit.visitType === 'mission' && (
              <span className="px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-500/10 text-purple-600 border border-purple-100 dark:border-purple-500/20 text-[8px] font-black uppercase tracking-wider flex items-center gap-1.5">
                <ClipboardList size={10} /> Mission
              </span>
            )}
            {visit.visitType === 'collab' && (
              <span className="px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-500/10 text-amber-600 border border-amber-100 dark:border-amber-500/20 text-[8px] font-black uppercase tracking-wider flex items-center gap-1.5">
                <Users size={10} /> Collab
              </span>
            )}
            {visit.visitType === 'app' && (
              <span className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 border border-emerald-100 dark:border-emerald-500/20 text-[8px] font-black uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck size={10} /> App Install
              </span>
            )}
            {visit.visitType === 'LogVisit' && (
              <span className="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-500/10 text-rose-600 border border-rose-100 dark:border-rose-500/20 text-[8px] font-black uppercase tracking-wider flex items-center gap-1.5">
                <Activity size={10} /> Generic Log
              </span>
            )}
            <div className="flex items-center gap-1.5 text-gray-400 text-[10px] font-bold tabular-nums ml-2">
              <Clock size={12} className="text-gray-300" /> {visit.time}
            </div>
          </div>
        </div>

        {/* Proof Previews (Asset Peeking) */}
        <div className="flex items-center -space-x-3 overflow-hidden">
          {visit.proofs?.slice(0, 3).map((proof, idx) => (
            <div key={idx} className="w-9 h-9 rounded-lg border-2 border-white dark:border-gray-800 bg-gray-100 overflow-hidden shadow-sm group-hover:translate-x-1 group-hover:-rotate-3 transition-all duration-500">
              <img src={proof.img} alt="proof" className="w-full h-full object-cover" />
            </div>
          ))}
          {visit.photos > 3 && (
            <div className="w-9 h-9 rounded-lg border-2 border-white dark:border-gray-800 bg-indigo-600 flex items-center justify-center text-[8px] font-black text-white shadow-lg relative z-10 transition-transform group-hover:scale-110">
              +{visit.photos - 3}
            </div>
          )}
          {visit.photos === 0 && (
            <div className="w-9 h-9 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-800 flex items-center justify-center opacity-40">
              <Camera size={12} className="text-gray-400" />
            </div>
          )}
        </div>
      </div>

      {/* Outcome & Status Control */}
      <div className="flex items-center justify-between lg:justify-end gap-6 w-full lg:flex-1">
        <div className="flex flex-col items-end gap-2">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl border ${status.bg} ${status.color} ${status.border} shadow-sm transition-all group-hover:shadow-md`}>
            <StatusIcon size={14} className={visit.submissionStatus === 'Partial' ? 'animate-pulse' : ''} />
            <span className="text-[10px] font-black uppercase tracking-[0.15em] italic">
              Outcome: {visit.submissionStatus}
            </span>
          </div>
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mr-1">Review Intel Available</p>
        </div>

        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl text-gray-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
          <ArrowRight size={20} />
        </div>
      </div>
    </div>
  );
};

// Helper: assign a unique color per employee marker
const getMarkerColor = (employeeId) => {
  const colors = ['#4f46e5', '#059669', '#d97706', '#dc2626', '#7c3aed', '#0891b2'];
  // Simple deterministic hash of the id string
  let hash = 0;
  for (let i = 0; i < (employeeId || '').length; i++) {
    hash = (hash * 31 + employeeId.charCodeAt(i)) & 0xffffffff;
  }
  return colors[Math.abs(hash) % colors.length];
};





/**
 * ManagerVisits Main Component
 */
const ManagerVisits = () => {
  // --- State Initialization ---
  const [filterStatus, setFilterStatus] = React.useState('Total');       // Active status filter (Total, Accepted, Rejected, etc.)
  const [selectedVisit, setSelectedVisit] = React.useState(null);       // Tracks the visit currently being reviewed in Detail mode
  const [isPendingExpanded, setIsPendingExpanded] = React.useState(true); // Toggles 'Awaiting Action' accordion
  const [isHistoryExpanded, setIsHistoryExpanded] = React.useState(true); // Toggles 'Operational Intelligence' accordion
  const [isRejecting, setIsRejecting] = React.useState(false);           // Controls the showing of the rejection remark textarea
  const [rejectionReasonInput, setRejectionReasonInput] = React.useState(''); // Buffer for user-entered rejection text
  const [activePhoto, setActivePhoto] = React.useState(null);           // Holds the photo object for the Portal-based Lightbox
  const [liveEmployees, setLiveEmployees] = React.useState({});         // Map of employeeId -> latest location data
  const { user } = useAuth();
  const { setPageLoading } = useOutletContext() || {};
  const { socket } = useSocket() || {};
  const { isLoaded } = useGoogleMaps();
  const { showAlert } = useDialog();

  const [map, setMap] = React.useState(null);
  const onLoad = React.useCallback(map => setMap(map), []);

  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const hasFetched = useRef(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [selectedVisitLoading, setSelectedVisitLoading] = useState(false);

  const activeLocation = selectedVisit ? liveEmployees[selectedVisit.employee?._id] : null;
  const isValidCenter = activeLocation &&
    activeLocation.location &&
    !isNaN(Number(activeLocation.location.lat)) &&
    !isNaN(Number(activeLocation.location.lng));
  const isLive = !!activeLocation;

  const visitGps = selectedVisit?.gps;
  const hasVisitGps = visitGps && !isNaN(Number(visitGps.lat)) && !isNaN(Number(visitGps.lng));
  const centerLat = hasVisitGps ? Number(visitGps.lat) : (isValidCenter ? Number(activeLocation.location.lat) : 12.9716);
  const centerLng = hasVisitGps ? Number(visitGps.lng) : (isValidCenter ? Number(activeLocation.location.lng) : 77.5946);

  // --- Socket Integration ---
  React.useEffect(() => {
    if (!socket) return;

    const handleTrackingLive = (data) => {
      console.log('Live update received for:', data.employeeName, data.location);
      setLiveEmployees(prev => ({
        ...prev,
        [data.employeeId]: data
      }));
    };

    const handleNewVisit = (newVisit) => {
      console.log('New visit received via socket:', newVisit.storeName);
      const processed = processVisitsData([newVisit])[0];
      setVisits(prev => [processed, ...prev]);
      showAlert(`New activity logged at ${processed.store}`, 'success');
    };

    socket.on('tracking:live', handleTrackingLive);
    socket.on('visit:new', handleNewVisit);

    return () => {
      socket.off('tracking:live', handleTrackingLive);
      socket.off('visit:new', handleNewVisit);
    };
  }, [socket]);

  // --- 0s Hydration & Background Sync ---
  const mapSubmissionStatus = (backendStatus) => {
    switch (backendStatus) {
      case 'completed': return 'Completed';
      case 'partially_completed': return 'Partial';
      case 'not_interested': return 'No Interest';
      case 'follow_up': return 'Follow-up';
      case 'rejected': return 'Rejected';
      default: return 'Pending';
    }
  };

  const processVisitsData = (data) => {
    return data.map(v => {
      const visitDate = new Date(v.timestamp || v.createdAt);
      const isValidDate = !isNaN(visitDate.getTime());
      const empName = v.employee?.name || 'Unknown';
      const initials = empName.split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase();

      // DYNAMIC AUDIT SCORING ENGINE
      let score = 0;
      // 1. Milestones (40%)
      if (v.milestones) {
        const completedCount = Object.values(v.milestones).filter(m => m === true).length;
        score += (completedCount / 3) * 40;
      }
      // 2. Geospatial Integrity (30%)
      if (v.gps?.lat) score += 30;
      // 3. Visual Evidence pro-rated (30%)
      if (v.photos?.length) {
        score += Math.min(30, (v.photos.length / 3) * 30);
      }
      const finalScore = Math.max(0, Math.min(100, Math.round(score)));

      // SMART MISSION TAXONOMY
      const TYPE_META = {
        mission: { title: 'General Field Activity', desc: 'Standard operational protocol execution and reporting.' },
        store: { title: 'Retail Presence Audit', desc: 'Comprehensive store profile validation and inventory check.' },
        supplier: { title: 'Supply Chain Compliance', desc: 'In-depth supplier quality audit and logistics verification.' },
        collab: { title: 'Strategic Partnership', desc: 'Business alignment session and opportunity evaluation.' },
        app: { title: 'Digital Onboarding', desc: 'Installation verification and product training session.' },
        LogVisit: { title: 'General Field Intelligence', desc: 'Ad-hoc intelligence collection from the field.' }
      };
      
      const meta = TYPE_META[v.visitType] || TYPE_META.mission;

      return {
        ...v,
        id: v._id,
        store: v.storeName,
        executive: empName,
        designation: v.employee?.profile?.designation || v.employee?.role || 'Field Executive',
        phone: v.employee?.profile?.phone || 'N/A',
        email: v.employee?.email || 'N/A',
        team: v.employee?.profile?.team || 'Operations',
        type: v.taskType || meta.title,
        taskDescription: meta.desc,
        auditScore: finalScore,
        submissionStatus: mapSubmissionStatus(v.status),
        time: isValidDate ? visitDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '---',
        location: v.gps?.lat ? `Verified (GPS: ${v.gps.lat.toFixed(4)}, ${v.gps.lng.toFixed(4)})` : 'Location data not available',
        photos: v.photos?.length || 0,
        avatar: initials,
        employeeId: v.employee?._id || '---',
        visitType: v.visitType || 'store',
        rejectionIntelligence: v.visitForm?.notInterestedReason || null,
        nextFollowUp: v.visitForm?.followUpDate || null,
        proofs: (v.photos || []).map((url, idx) => ({
          id: idx + 1,
          title: `Field Asset ${idx + 1}`,
          img: url,
        })),
        reviewStatus: v.reviewStatus || 'pending',
        rejectionReason: v.rejectionReason || null,
        employee: v.employee
      };
    });
  };

  const fetchVisitsSync = async (isManual = false) => {
    if (isManual) setRefreshing(true);

    try {
      const data = await getVisits(isManual || hasFetched.current); // Force refresh if manual OR background sync after first load
      const mapped = processVisitsData(data);
      setVisits(mapped);
      setError(null);

      // Also fetch active tracking sessions for live data
      const activeSessions = await getActiveTrackingSessions();
      const liveMap = {};
      activeSessions.forEach(session => {
        if (session.user?._id) {
          liveMap[session.user._id] = {
            location: session.route?.[session.route.length - 1] || null,
            address: session.currentAddress,
            city: session.currentCity,
            timestamp: session.updatedAt
          };
        }
      });
      setLiveEmployees(liveMap);
    } catch (err) {
      console.error('Error syncing visits:', err);
      if (!visits.length) setError('Failed to load visits');
    } finally {
      setLoading(false);
      setRefreshing(false);
      if (setPageLoading) setPageLoading(false);
    }
  };

  useEffect(() => {
    // 1. Initial Hydration from Cache
    const cachedVisits = getSyncCachedData('visits');
    if (cachedVisits) {
      setVisits(processVisitsData(cachedVisits));
      setLoading(false);
      if (setPageLoading) setPageLoading(false);
    }

    // 2. Background Sync
    fetchVisitsSync();

    // 3. Periodic Refresh (every 2 mins)
    const intervalId = setInterval(() => fetchVisitsSync(), 120000);
    return () => clearInterval(intervalId);
  }, []);

  // --- History Filtering (Simplified) ---
  const filteredHistoryVisits = useMemo(() => {
    return visits.filter(v => v.reviewStatus !== 'pending');
  }, [visits]);

  // Handle clicking a visit row to load full details
  const handleReviewVisit = async (visit) => {
    try {
      setSelectedVisitLoading(true);
      setSelectedVisit(visit); // Show with partial data
      const fullVisit = await getVisitById(visit.id);
      const visitDate = new Date(fullVisit.timestamp || fullVisit.createdAt);
      const isValidDate = !isNaN(visitDate.getTime());
      const empName = fullVisit.employee?.name || visit.executive;
      const initials = empName.split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase();

      setSelectedVisit({
        ...visit,
        ...fullVisit,
        id: fullVisit._id,
        store: fullVisit.storeName,
        executive: empName,
        avatar: initials,
        designation: fullVisit.employee?.profile?.designation || fullVisit.employee?.role || visit.designation,
        phone: fullVisit.employee?.profile?.phone || visit.phone,
        email: fullVisit.employee?.email || visit.email,
        status: visit.status, // Keep the mapped status
        time: isValidDate ? visitDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : visit.time,
        location: fullVisit.gps?.lat ? `Verified (GPS: ${fullVisit.gps.lat.toFixed(4)}, ${fullVisit.gps.lng.toFixed(4)})` : visit.location,
        photos: fullVisit.photos?.length || 0,
        proofs: (fullVisit.photos || []).map((url, idx) => ({
          id: idx + 1,
          title: `Photo ${idx + 1}`,
          img: url,
        })),
        notes: fullVisit.notes,
        checklist: fullVisit.checklist || [],
        visitType: fullVisit.visitType || visit.visitType,
        rejectionIntelligence: fullVisit.visitForm?.notInterestedReason || null,
        nextFollowUp: fullVisit.visitForm?.followUpDate || null,
        reviewStatus: fullVisit.reviewStatus || visit.reviewStatus,
        rejectionReason: fullVisit.rejectionReason || visit.rejectionReason,
      });
    } catch (err) {
      console.error('Error fetching visit details:', err);
    } finally {
      setSelectedVisitLoading(false);
    }
  };

  const stats = [
    { label: 'Total Field Updates', value: visits.length.toString(), icon: Camera, color: 'text-indigo-600', bg: 'bg-indigo-50', status: 'Total' },
    { label: 'Completed', value: visits.filter(v => v.submissionStatus === 'Completed').length.toString(), icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50', status: 'Completed' },
    { label: 'Partial', value: visits.filter(v => v.submissionStatus === 'Partial').length.toString(), icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', status: 'Partial' },
    { label: 'Follow-up Needs', value: visits.filter(v => ['Follow-up', 'No Interest'].includes(v.submissionStatus)).length.toString(), icon: RotateCcw, color: 'text-rose-600', bg: 'bg-rose-50', status: 'Follow-up' },
  ]

  const filteredVisits = filterStatus === 'Total'
    ? visits
    : visits.filter(v => {
      if (filterStatus === 'Completed') return v.submissionStatus === 'Completed';
      if (filterStatus === 'Partial') return v.submissionStatus === 'Partial';
      if (filterStatus === 'Follow-up') return ['Follow-up', 'No Interest'].includes(v.submissionStatus);
      return true;
    });



  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* --- DASHBOARD HEADER ---
          Provides context and global navigation controls. */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em]">Operational Intelligence</span>
          </div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Field Visits & Proofs</h1>
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mt-2">Monitor, review, and validate real-time visit requests and geospatial evidence.</p>
        </div>

        <div className="flex items-center gap-4">
          {selectedVisit && (
            <button
              onClick={() => setSelectedVisit(null)}
              className="flex items-center gap-3 px-6 py-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm hover:scale-105 transition-all text-gray-500 hover:text-indigo-600 font-bold text-sm uppercase tracking-widest"
            >
              <ArrowLeft size={18} />
              Back to Overview
            </button>
          )}
          <button
            onClick={() => fetchVisitsSync(true)}
            className={`flex items-center gap-2 px-4 py-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-bold rounded-2xl transition-all shadow-sm hover:shadow-md hover:bg-indigo-100 dark:hover:bg-indigo-900/50 ${refreshing ? 'opacity-50' : ''}`}
          >
            <Activity size={18} className={refreshing ? 'animate-spin' : ''} />
            <span className="text-sm uppercase tracking-widest">{refreshing ? 'Syncing...' : 'Live Sync'}</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 animate-pulse">
          <div className="w-12 h-12 rounded-full border-4 border-indigo-100 dark:border-indigo-900/30 border-t-indigo-600 animate-spin mb-4" />
          <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Loading Field Intelligence...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-32">
          <p className="text-sm font-black text-rose-500 uppercase tracking-widest">{error}</p>
        </div>
      ) : !selectedVisit ? (
        <>
          {/* --- KPI QUICK OPS GRID ---
              Dynamic summary of visit counts with quick-filter capabilities. */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {stats.map((stat, i) => (
              <button
                key={i}
                onClick={() => setFilterStatus(stat.status)}
                className={`text-left bg-white dark:bg-gray-900 p-3 px-4 rounded-2xl border transition-all flex items-center gap-4 ${filterStatus === stat.status ? 'border-indigo-500 ring-2 ring-indigo-500/20 shadow-md scale-[1.01]' : 'border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                  }`}
              >
                <div className={`w-8 h-8 rounded-lg ${stat.bg} ${stat.color} dark:bg-opacity-10 flex items-center justify-center shadow-sm shrink-0`}>
                  <stat.icon size={14} />
                </div>
                <div className="min-w-0">
                  <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
                  <p className="text-lg font-black text-gray-900 dark:text-white leading-none">{stat.value}</p>
                </div>
              </button>
            ))}
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex flex-col gap-4 animate-in slide-in-from-top-4 duration-500 mt-6">
                {filteredVisits.length > 0 ? (
                  filteredVisits.map((visit) => {
                    const liveData = liveEmployees[visit.employee?._id];
                    return (
                      <VisitRow
                        key={visit.id}
                        visit={{
                          ...visit,
                          address: liveData?.address,
                          city: liveData?.city,
                          liveLocation: liveData ? `L: ${liveData.location.lat.toFixed(4)}, ${liveData.location.lng.toFixed(4)}` : null
                        }}
                        onReview={() => setSelectedVisit({
                          ...visit,
                          liveData: liveData
                        })}
                        isLive={!!liveData}
                      />
                    );
                  })
                ) : (
                  <div className="py-24 text-center bg-gray-50/50 dark:bg-gray-800/10 rounded-[3rem] border-2 border-dashed border-gray-100 dark:border-gray-800">
                    <div className="mx-auto w-16 h-16 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center mb-6">
                      <Camera size={32} className="text-gray-300 dark:text-gray-600" />
                    </div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No field intel found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="animate-in slide-in-from-bottom-12 [animation-duration:1000ms] [animation-timing-function:cubic-bezier(0.16,1,0.3,1)] max-w-[1400px] mx-auto">
          {/* --- COMPREHENSIVE DETAIL REVIEW MODE ---
              A dual-column layout for deep-dive analysis of a specific visit. */}
          <div className="bg-white dark:bg-gray-950 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-[0_32px_128px_-16px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col min-h-[85vh] relative">
            {/* Loading overlay for detail fetch */}
            {selectedVisitLoading && (
              <div className="absolute inset-0 z-[210] flex flex-col items-center justify-center bg-white/60 dark:bg-gray-950/60 backdrop-blur-sm rounded-[3rem]">
                <div className="w-12 h-12 rounded-full border-4 border-indigo-100 dark:border-indigo-900/30 border-t-indigo-600 animate-spin mb-4" />
                <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest animate-pulse">Fetching Mission Evidence...</p>
              </div>
            )}

            {/* 1. DYNAMIC REPORT HEADER
                Displays the executive's profile, contact info, and current audit status. */}
            <div className="bg-gradient-to-br from-indigo-50/50 via-white to-indigo-50/30 dark:from-indigo-950/20 dark:via-gray-950 dark:to-indigo-950/10 border-b border-gray-100 dark:border-gray-800 p-8 lg:p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[500px] h-full bg-indigo-500/[0.03] blur-[100px] -mr-32 pointer-events-none" />
              <div className="absolute -left-12 -top-12 w-64 h-64 bg-indigo-500/[0.02] rounded-full blur-[80px]" />

              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 relative z-10">
                {/* Executive Identity Card */}
                <div className="flex items-center gap-10">
                  <div className="relative shrink-0">
                    <div className="w-28 h-28 rounded-[2.5rem] bg-indigo-600 flex items-center justify-center text-white font-black text-4xl shadow-[0_20px_50px_rgba(79,70,229,0.3)] border-4 border-white dark:border-gray-900 group-hover:rotate-2 transition-transform duration-700">
                      {selectedVisit.avatar}
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-11 h-11 bg-emerald-500 rounded-2xl flex items-center justify-center text-white border-4 border-white dark:border-gray-950 shadow-xl ring-2 ring-emerald-500/20">
                      <ShieldCheck size={22} />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em] bg-indigo-50 dark:bg-indigo-500/10 px-3 py-1 rounded-full">Primary Auditor</span>
                        {isLive && (
                          <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-500/10 rounded-full border border-emerald-100 dark:border-emerald-500/20 animate-in zoom-in-95 duration-500">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                            <span className="text-[8px] font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-[0.1em]">Live Protocol Active</span>
                          </div>
                        )}
                      </div>
                      <h2 className="text-5xl font-black text-gray-950 dark:text-white tracking-tighter leading-none">{selectedVisit.executive}</h2>
                    </div>
                    <div className="flex flex-wrap items-center gap-5 pt-2">
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-100 dark:border-gray-800 text-[10px] font-black text-gray-500 uppercase tracking-widest shadow-sm">
                        <User size={12} className="text-indigo-500" />
                        {selectedVisit.designation} • #{selectedVisit.employeeId}
                      </div>

                      <div className="flex items-center gap-2 px-3 py-1.5 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-100 dark:border-gray-800 text-[10px] font-black text-gray-500 uppercase tracking-widest shadow-sm">
                        <Mail size={12} className="text-emerald-500" />
                        {selectedVisit.email}
                      </div>

                      <div className="flex items-center gap-2 px-3 py-1.5 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-100 dark:border-gray-800 text-[10px] font-black text-gray-500 uppercase tracking-widest shadow-sm">
                        <Phone size={12} className="text-blue-500" />
                        {selectedVisit.phone}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Audit Performance Stats */}
                <div className="flex items-center gap-4">
                   <div className="px-6 py-4 bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-xl hover:shadow-indigo-500/10 transition-all flex flex-col items-center min-w-[120px]">
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Audit Score</span>
                      <span className="text-3xl font-black text-indigo-600 leading-none tabular-nums">{selectedVisit.auditScore || 0}%</span>
                   </div>
                   <div className="px-6 py-4 bg-indigo-600 rounded-[2rem] shadow-xl shadow-indigo-600/20 flex flex-col items-center min-w-[120px]">
                      <span className="text-[9px] font-black text-indigo-200 uppercase tracking-widest mb-1">Status</span>
                      <span className="text-[11px] font-black text-white uppercase tracking-widest leading-none mt-1">{selectedVisit.submissionStatus}</span>
                   </div>
                </div>
              </div>
            </div>

            {/* 2. Main content Grid (50/50 Split) */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 overflow-hidden">

              {/* LEFT COLUMN: Data-Driven Intelligence 
                  Houses the mission description, audit stats, and review protocols. */}
              <div className="p-8 lg:p-12 border-r border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-black/10 overflow-y-auto custom-scrollbar">
                <div className="space-y-12">
                  {/* Audit Title & Mission Description */}
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-1.5 h-6 bg-indigo-600 rounded-full" />
                      <h5 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em]">Operational Mission</h5>
                    </div>
                    <h3 className="text-2xl font-black text-gray-950 dark:text-white tracking-tighter mb-4">{selectedVisit.type}</h3>
                    <p className="text-[13px] font-bold text-gray-500 leading-relaxed max-w-xl">
                      {selectedVisit.taskDescription}
                    </p>
                  </div>


                  {/* Audit Intelligence Grid */}
                  <div>
                    <h5 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] mb-8 border-b border-gray-100 dark:border-gray-800 pb-2">Audit Intelligence Report</h5>
                    <div className="grid grid-cols-2 gap-6">
                      {[
                        {
                          label: 'Target Location',
                          value: (isLive && activeLocation?.address) ? activeLocation.address : selectedVisit.store,
                          icon: isLive ? Navigation : Store,
                          color: isLive ? 'text-emerald-600' : 'text-indigo-600',
                          bg: isLive ? 'bg-emerald-50' : 'bg-indigo-50'
                        },
                        { label: 'Audit Timestamp', value: selectedVisit.time, icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
                        {
                          label: isLive ? 'Current GPS' : 'Geospatial Delta',
                          value: isLive ? `Live Tracking Active` : selectedVisit.location,
                          icon: isLive ? Radio : MapPin,
                          secondary: isLive ? `${activeLocation.location.lat.toFixed(4)}, ${activeLocation.location.lng.toFixed(4)}` : null,
                          color: (!isLive && (selectedVisit.location || '').includes('Warning')) ? 'text-rose-600' : 'text-emerald-600',
                          bg: (!isLive && (selectedVisit.location || '').includes('Warning')) ? 'bg-rose-50' : 'bg-emerald-50'
                        },
                        { label: 'Visual Evidence', value: `${selectedVisit.photos} HD Assets`, icon: Camera, color: 'text-violet-600', bg: 'bg-violet-50' }
                      ].map((item, id) => (
                        <div key={id} className="p-6 bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-[0_8px_30px_rgba(0,0,0,0.02)] flex flex-col gap-6 group transition-all hover:shadow-xl hover:border-indigo-100 dark:hover:border-indigo-500/20">
                          <div className={`w-14 h-14 rounded-2xl ${item.bg} dark:bg-opacity-10 flex items-center justify-center ${item.color} shadow-inner group-hover:scale-110 transition-all duration-500`}>
                            <item.icon size={24} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{item.label}</p>
                            <p className="text-[15px] font-black text-gray-950 dark:text-white leading-tight tracking-tight uppercase truncate">{item.value}</p>
                            {item.secondary && (
                              <p className="text-[9px] font-bold text-gray-400 mt-1 tabular-nums tracking-widest">{item.secondary}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>


                  {/* Protocol Action Panel */}
                  <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
                    <h5 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4">Live Operational Map</h5>
                    <div className="w-full h-[300px] rounded-[2rem] overflow-hidden border-2 border-white dark:border-gray-900 shadow-xl relative group/map">
                      {isLoaded ? (
                        <GoogleMap
                          mapContainerStyle={{ width: '100%', height: '100%' }}
                          center={{ lat: centerLat, lng: centerLng }}
                          zoom={13}
                          onLoad={onLoad}
                          options={{ disableDefaultUI: true, zoomControl: true, styles: [/* standard subtle styles */] }}
                        >
                          {/* Marker for Visit Upload Location */}
                          {hasVisitGps && (
                            <Marker
                              position={{ lat: Number(visitGps.lat), lng: Number(visitGps.lng) }}
                              title="Upload Location"
                              label={{ text: 'V', color: 'white', fontSize: '10px', fontWeight: 'black' }}
                              icon={{
                                path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z",
                                fillColor: "#10b981", // Emerald green for the uploaded visit location
                                fillOpacity: 1,
                                strokeWeight: 3,
                                strokeColor: "#ffffff",
                                scale: 1.4
                              }}
                              zIndex={10}
                            />
                          )}

                          {/* Markers for Live Fleet */}
                          {Object.values(liveEmployees).map((emp) => (
                            emp.location && (
                              <Marker
                                key={emp.employeeId}
                                position={{ lat: Number(emp.location.lat), lng: Number(emp.location.lng) }}
                                title={emp.employeeName}
                                label={{
                                  text: emp.employeeName?.charAt(0) || 'E',
                                  color: 'white',
                                  fontSize: '10px',
                                  fontWeight: 'black'
                                }}
                                animation={emp.employeeId === selectedVisit.employee?._id ? window.google.maps.Animation.BOUNCE : null}
                                icon={{
                                  path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z",
                                  fillColor: getMarkerColor(emp.employeeId),
                                  fillOpacity: 1,
                                  strokeWeight: emp.employeeId === selectedVisit.employee?._id ? 4 : 2,
                                  strokeColor: emp.employeeId === selectedVisit.employee?._id ? "#4f46e5" : "#ffffff",
                                  scale: emp.employeeId === selectedVisit.employee?._id ? 1.4 : 1.1
                                }}
                                zIndex={emp.employeeId === selectedVisit.employee?._id ? 5 : 1}
                              />
                            )
                          ))}
                        </GoogleMap>
                      ) : (
                        <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                          <Activity className="animate-spin text-indigo-600" />
                        </div>
                      )}

                      {/* Floating Legend */}
                      <div className="absolute top-4 left-4 p-2.5 bg-white/90 dark:bg-gray-950/90 backdrop-blur-md rounded-xl shadow-lg border border-white/20 z-10">
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span className="text-[8px] font-black uppercase text-gray-950 dark:text-white">Upload Location</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                            <span className="text-[8px] font-black uppercase text-gray-950 dark:text-white">Active Executive</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-gray-400" />
                            <span className="text-[8px] font-black uppercase text-gray-500">Fleet Members</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Rejection Intelligence (SUB-DETAILS) */}
                  {selectedVisit.rejectionIntelligence && (
                    <div className="mt-8 animate-in slide-in-from-top-4 duration-500">
                      <div className="bg-rose-50 dark:bg-rose-500/5 p-6 rounded-[2rem] border border-rose-100 dark:border-rose-500/20 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
                          <AlertCircle size={48} className="text-rose-500" />
                        </div>
                        <h5 className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                          <AlertCircle size={14} /> Rejection Intelligence (Field Report)
                        </h5>
                        <p className="text-[15px] font-bold text-rose-700 dark:text-rose-400 leading-relaxed italic border-l-4 border-rose-300 dark:border-rose-500/40 pl-6">
                          "{selectedVisit.rejectionIntelligence}"
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Follow-up Scheduling Intelligence */}
                  {selectedVisit.nextFollowUp && (
                    <div className="mt-8 animate-in slide-in-from-top-4 duration-500">
                      <div className="bg-amber-50 dark:bg-amber-500/5 p-6 rounded-[2rem] border border-amber-100 dark:border-amber-500/20 shadow-sm relative group">
                        <h5 className="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                          <Clock size={14} /> Target Follow-up Scheduled
                        </h5>
                        <div className="flex items-center gap-4">
                          <div className="px-6 py-3 bg-white dark:bg-gray-950 rounded-2xl border border-amber-200 dark:border-amber-500/30 text-lg font-black text-amber-600 shadow-sm">
                            {new Date(selectedVisit.nextFollowUp).toLocaleDateString([], { day: '2-digit', month: 'long', year: 'numeric' })}
                          </div>
                          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            Scheduled by {selectedVisit.executive}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}


                </div>

              </div>

              {/* RIGHT COLUMN: Visual Evidence Discovery 
                  Interactive image gallery for physical proof validation. */}
              <div className="p-6 lg:p-10 overflow-y-auto custom-scrollbar flex flex-col h-full bg-white dark:bg-gray-950">
                
                {/* Observation Intel & Notes */}
                <div className="mb-12 animate-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center justify-between mb-6">
                    <h5 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em]">Observation Intelligence</h5>
                  </div>

                  <div className="p-10 bg-gradient-to-br from-gray-900 to-black dark:from-black dark:to-gray-950 rounded-[3rem] shadow-2xl shadow-gray-900/20 relative overflow-hidden group/insight border border-gray-800">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover/insight:scale-125 group-hover/insight:rotate-6 transition-all duration-1000">
                        <MessageSquare size={120} className="text-white" />
                    </div>
                    
                    <div className="flex items-center justify-between mb-8 relative z-10">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 backdrop-blur-xl flex items-center justify-center border border-white/10 shadow-inner">
                           <span className="text-sm font-black text-white">{selectedVisit.avatar}</span>
                        </div>
                        <div>
                          <h5 className="text-[12px] font-black text-white uppercase tracking-[0.2em]">Executive Insight</h5>
                          <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Primary Operational Log</p>
                        </div>
                      </div>
                      <div className="px-4 py-1.5 bg-white/5 backdrop-blur-xl rounded-full text-[9px] font-black text-emerald-400 uppercase tracking-widest border border-white/10 shadow-sm">
                         Protocol Case ID: #A-{selectedVisit.id?.slice(-4)}
                      </div>
                    </div>

                    <div className="relative z-10">
                      <p className="text-[16px] font-medium text-gray-200 italic leading-relaxed">
                        {selectedVisit.notes ? `"${selectedVisit.notes}"` : <span className="text-gray-500 font-normal">No intelligence notes provided.</span>}
                      </p>
                      
                      <div className="mt-8 flex items-center justify-between">
                         <div className="flex -space-x-2">
                            <div className="w-8 h-8 rounded-full border-2 border-gray-900 bg-emerald-500 flex items-center justify-center text-[10px] text-white shadow-lg"><Check size={14} /></div>
                            <div className="w-8 h-8 rounded-full border-2 border-gray-900 bg-indigo-500 flex items-center justify-center text-[10px] text-white shadow-lg"><Activity size={12} /></div>
                         </div>
                         <div className="text-[9px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Authenticated by Field Engine
                         </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dynamic Form Intelligence */}
                {selectedVisit.visitForm && Object.keys(selectedVisit.visitForm).filter(k => !['notInterestedReason', 'followUpDate', 'followUpNotes'].includes(k)).length > 0 && (
                  <div className="mb-12 animate-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-sky-50 dark:bg-sky-500/5 p-6 rounded-[2rem] border border-sky-100 dark:border-sky-500/20 shadow-sm">
                      <h5 className="text-[10px] font-black text-sky-600 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                        <Activity size={14} /> Collected Field Data Intelligence
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {Object.entries(selectedVisit.visitForm)
                          .filter(([k, v]) => !['notInterestedReason', 'followUpDate', 'followUpNotes'].includes(k) && v !== '' && v !== null && v !== undefined)
                          .map(([key, value]) => (
                            <div key={key} className="flex flex-col p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:border-sky-200 dark:hover:border-sky-500/30 transition-colors h-full">
                              <p className="text-[9px] font-black text-sky-500 uppercase tracking-widest mb-2 border-b border-sky-50 dark:border-sky-500/10 pb-2">
                                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim()}
                              </p>
                              <div className="mt-auto pt-1">
                                {typeof value === 'boolean' ? (
                                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${value ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/20' : 'bg-rose-50 text-rose-600 border border-rose-200 dark:bg-rose-500/10 dark:border-rose-500/20'}`}>
                                    {value ? 'Yes' : 'No'}
                                  </span>
                                ) : (
                                  <span className="text-sm font-bold text-gray-900 dark:text-gray-100 break-words">{String(value)}</span>
                                )}
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* App Installation Intelligence */}
                {selectedVisit.appInstallation && Object.keys(selectedVisit.appInstallation).length > 0 && (
                  <div className="mb-12 animate-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-indigo-50 dark:bg-indigo-500/5 p-6 rounded-[2rem] border border-indigo-100 dark:border-indigo-500/20 shadow-sm">
                      <h5 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                        <Activity size={14} /> App Installation Metrics
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {selectedVisit.appInstallation.status && (
                          <div className="p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
                            <p className="text-[9px] font-black text-indigo-500 uppercase tracking-widest mb-1.5">App Downloaded</p>
                            <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{selectedVisit.appInstallation.status}</p>
                          </div>
                        )}
                        {selectedVisit.appInstallation.registration?.status && (
                          <div className="p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
                            <p className="text-[9px] font-black text-indigo-500 uppercase tracking-widest mb-1.5">Registration Status</p>
                            <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{selectedVisit.appInstallation.registration.status}</p>
                          </div>
                        )}
                        {selectedVisit.appInstallation.training?.status && (
                          <div className="p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
                            <p className="text-[9px] font-black text-indigo-500 uppercase tracking-widest mb-1.5">Training Completed</p>
                            <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{selectedVisit.appInstallation.training.status}</p>
                          </div>
                        )}
                        {selectedVisit.appInstallation.firstOrder?.status && (
                          <div className="p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-[0_4px_20_rgba(0,0,0,0.03)]">
                            <p className="text-[9px] font-black text-indigo-500 uppercase tracking-widest mb-1.5">First Order Placed</p>
                            <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{selectedVisit.appInstallation.firstOrder.status}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between mb-4 shrink-0">
                  <div className="flex items-center gap-4">
                    <div className="w-1.5 h-6 bg-indigo-500 rounded-full shadow-lg shadow-indigo-500/20" />
                    <div>
                      <h5 className="text-[12px] font-black text-gray-900 dark:text-white uppercase tracking-[0.3em]">Visual Evidence Discovery</h5>
                      <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">High-Fidelity Proofs for Integrity Validation</p>
                    </div>
                  </div>                  <div className="px-4 py-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-full text-[10px] font-black text-indigo-600 tracking-widest border border-indigo-100 dark:border-indigo-500/20">
                    {selectedVisit.photos} VISUAL ASSETS
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 flex-1 content-start pb-10">
                  {selectedVisit.proofs && selectedVisit.proofs.length > 0 ? (
                    <>
                      {selectedVisit.proofs.map((proof) => (
                        <div
                          key={proof.id}
                          onClick={() => setActivePhoto(proof)}
                          className="group relative overflow-hidden rounded-[2.5rem] border-[8px] border-white dark:border-gray-900 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] aspect-square cursor-pointer hover:shadow-indigo-500/20 hover:-translate-y-2 transition-all duration-700"
                        >
                          <img src={proof.img} alt={proof.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms]" />
                          <div className="absolute inset-x-4 bottom-4 p-4 bg-black/40 backdrop-blur-xl rounded-3xl border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 shadow-2xl">
                              <p className="text-white font-black text-[10px] uppercase tracking-widest mb-1">{proof.title}</p>
                              <div className="flex items-center gap-2">
                                <div className="p-1 px-2 bg-emerald-500 rounded-lg text-[7px] font-black text-white uppercase tracking-tighter">Verified Integrity</div>
                                <div className="text-[7px] font-bold text-gray-100 uppercase tracking-widest opacity-60">Full HD Asset</div>
                              </div>
                          </div>
                          <div className="absolute top-6 right-6 w-10 h-10 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl flex items-center justify-center text-indigo-600 opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 shadow-xl">
                            <Maximize2 size={18} />
                          </div>
                        </div>
                      ))}
                      {selectedVisit.proofs.length < 4 && Array.from({ length: 4 - selectedVisit.proofs.length }).map((_, i) => (
                        <div key={`empty-${i}`} className="rounded-[2.5rem] border-4 border-dashed border-gray-100 dark:border-gray-800 flex flex-col items-center justify-center aspect-square bg-gray-50/50 dark:bg-white/5 opacity-50 group hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-500">
                          <Camera size={28} className="text-gray-200 dark:text-gray-700 mb-4 group-hover:scale-110 transition-transform" />
                          <p className="text-[9px] font-black text-gray-300 dark:text-gray-700 uppercase tracking-[0.3em]">Protocol Lock</p>
                        </div>
                      ))}
                    </>
                  ) : (
                    <div className="col-span-full py-24 flex flex-col items-center justify-center border-4 border-dashed border-gray-100 dark:border-gray-800 rounded-[3rem] bg-gray-50/50 dark:bg-gray-800/10">
                      <Camera size={48} className="text-gray-200 dark:text-gray-800 mb-6 animate-pulse" />
                      <p className="text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-[0.4em] text-center">No visual assets available</p>
                    </div>
                  )}
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- GLOBAL LIGHTBOX PORTAL ---
          Renders the modal at the document body level to ensure absolute
          top-level layering, overlaying the global Navbar and Sidebar regardless
          of parent layout stacking contexts. */}
      {activePhoto && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-0 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-gray-950/90 backdrop-blur-3xl" onClick={() => setActivePhoto(null)} />
          <div className="relative max-w-5xl w-full h-full flex flex-col items-center justify-center">
            <button
              onClick={(e) => { e.stopPropagation(); setActivePhoto(null); }}
              className="absolute top-4 right-4 md:top-6 md:right-6 p-4 text-white hover:scale-110 transition-all z-[100000] group"
              aria-label="Close Lightbox"
            >
              <div className="bg-gray-800 rounded-full p-2.5 shadow-2xl border-2 border-gray-700 group-hover:bg-rose-500 group-hover:text-white transition-all">
                <X size={28} strokeWidth={3} />
              </div>
            </button>
            <div className="w-full h-full relative group flex items-center justify-center p-6">
              <img src={activePhoto.img} alt={activePhoto.title} className="max-w-full max-h-[88vh] object-contain rounded-3xl shadow-[0_32px_128px_rgba(0,0,0,0.5)] border-4 border-white/20" />
              <div className="absolute bottom-8 left-8 p-6 bg-black/40 backdrop-blur-3xl rounded-[2rem] border border-white/10 shadow-2xl animate-in slide-in-from-left-8 duration-1000">
                <p className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-1">Evidence Discovery Asset</p>
                <h3 className="text-xl font-black text-white tracking-tighter">{activePhoto.title}</h3>
              </div>
            </div>
          </div>
        </div>
        , document.body)}
    </div>
  );
};

export default ManagerVisits;
