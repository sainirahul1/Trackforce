/**
 * @file Visits.jsx
 * @description High-fidelity Manager Dashboard for reviewing Field Visits and Proofs.
 * Features include high-density row layouts, dynamic status-based UI, 
 * and a React Portal-based Lightbox for 100% viewport coverage.
 */

import React, { useState, useMemo, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { useGoogleMaps } from '../../context/GoogleMapsContext';
import { createPortal } from 'react-dom';
import { GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';
import { getSyncCachedData } from '../../utils/cacheHelper';
import {
  Camera, MapPin, CheckCircle2, Clock, AlertCircle,
  ExternalLink, Maximize2, ShieldCheck, User, Store,
  Search, Filter, Calendar, ArrowRight, XCircle, RotateCcw,
  Check, X, MessageSquare, MoreHorizontal, Mail, Phone, ArrowLeft,
  ChevronDown, History, Radio, Activity, Navigation, Users, ArrowUpRight
} from 'lucide-react';
import { getVisits, getVisitById, updateVisit } from '../../services/employee/visitService';
import { getActiveTrackingSessions } from '../../services/employee/trackingService';

/**
 * VisitRow Component
 * Renders a high-density, horizontal entry for the visits feed.
 */
const VisitRow = ({ visit, onReview, isLive }) => (
  <div
    onClick={onReview}
    className={`group bg-white dark:bg-gray-900 px-4 py-2.5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col lg:flex-row items-center gap-4 border-l-[4px] transition-all ${isLive ? 'border-l-emerald-500' : 'hover:border-l-indigo-600 border-l-transparent'}`}
  >
    {/* Identification */}
    <div className="flex items-center gap-3 w-full lg:w-[20%] shrink-0">
      <div className="relative">
        <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-xs shadow-md shrink-0 group-hover:scale-105 transition-transform">
          {visit.avatar || '??'}
        </div>
        {isLive && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-gray-950 animate-pulse" />
        )}
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="text-[13px] font-black text-gray-900 dark:text-white truncate tracking-tight">{visit.executive}</h4>
          {isLive && <span className="text-[7px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-50 dark:bg-emerald-500/10 px-1.5 py-0.5 rounded">Live</span>}
        </div>
        <p className="text-[8px] font-black text-gray-400 uppercase tracking-[0.1em] truncate">{visit.designation}</p>
      </div>
    </div>

    {/* Location & Store Metadata */}
    <div className="flex items-center gap-5 w-full lg:w-[40%]">
      <div className="flex items-center gap-2 min-w-[110px]">
        <Store size={12} className="text-indigo-400" />
        <span className="text-[11px] font-bold text-gray-600 dark:text-gray-300 truncate">
          {isLive && visit.liveLocation ? (
            <span className="text-emerald-500 font-black animate-pulse flex items-center gap-1">
              <MapPin size={10} /> {visit.address || visit.liveLocation}
            </span>
          ) : visit.store}
        </span>
      </div>

      <div className="hidden xl:flex items-center gap-5">
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border ${visit.location && visit.location.includes('Warning') ? 'bg-rose-50 border-rose-100 text-rose-500' : 'bg-emerald-50 border-emerald-100 text-emerald-500'} dark:bg-opacity-5 dark:border-opacity-10 text-[8px] font-black uppercase tracking-tight`}>
          <Radio size={9} className={isLive ? 'animate-pulse text-emerald-500' : 'shrink-0'} fill="currentColor" fillOpacity={0.2} />
          {isLive && visit.city ? visit.city : (visit.location ? visit.location.split(' ')[0] : 'N/A')}
        </div>
        <div className="flex items-center gap-1.5 text-gray-400 text-[9px] font-bold tabular-nums">
          <Clock size={11} />
          {visit.time}
        </div>
      </div>
    </div>

    {/* Assets & Status Control */}
    <div className="flex items-center justify-between lg:justify-end gap-5 w-full lg:flex-1">
      <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg text-gray-400">
        <Camera size={11} />
        <span className="text-[8px] font-black uppercase tracking-widest">{visit.photos} Proofs</span>
      </div>

      <div className="flex flex-col items-end gap-1.5 shrink-0">
        {/* Submission Status (Outcome of the visit) */}
        <div className="px-2 py-0.5 rounded bg-gray-50 dark:bg-gray-800 text-[7px] font-black text-gray-400 uppercase tracking-tighter border border-gray-100 dark:border-gray-700">
          Outcome: {visit.submissionStatus}
        </div>

        {/* Audit Status (Manager Review) */}
        <div className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border ${visit.reviewStatus === 'accepted' ? 'text-emerald-500 bg-emerald-50 border-emerald-100 dark:bg-emerald-500/5' :
          visit.reviewStatus === 'rejected' ? 'text-rose-500 bg-rose-50 border-rose-100 dark:bg-rose-500/5' :
            'text-amber-500 bg-amber-50 border-amber-100 dark:bg-amber-500/5'
          }`}>
          {visit.reviewStatus === 'pending' ? 'Pending Review' : visit.reviewStatus === 'accepted' ? 'Accepted' : 'Rejected'}
        </div>
      </div>

      <button
        onClick={(e) => { e.stopPropagation(); onReview(); }}
        className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-md flex items-center justify-center gap-1.5 shrink-0"
      >
        Review <ArrowRight size={11} />
      </button>
    </div>
  </div>
);

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
  const [observationCategory, setObservationCategory] = React.useState('General Overview'); // Active category for observation notes
  const [liveEmployees, setLiveEmployees] = React.useState({});         // Map of employeeId -> latest location data
  const { user } = useAuth();
  const { setPageLoading } = useOutletContext();
  const socket = useSocket();
  const { isLoaded } = useGoogleMaps();

  const [map, setMap] = React.useState(null);
  const onLoad = React.useCallback(map => setMap(map), []);

  const [visits, setVisits] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const hasFetched = React.useRef(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [selectedVisitLoading, setSelectedVisitLoading] = useState(false);

  const activeLocation = selectedVisit ? liveEmployees[selectedVisit.employee?._id] : null;
  const isValidCenter = activeLocation &&
    activeLocation.location &&
    !isNaN(Number(activeLocation.location.lat)) &&
    !isNaN(Number(activeLocation.location.lng));
  const isLive = !!activeLocation;

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

    socket.on('tracking:live', handleTrackingLive);

    return () => {
      socket.off('tracking:live', handleTrackingLive);
    };
  }, [socket]);

  // --- 0s Hydration & Background Sync ---
  const mapSubmissionStatus = (backendStatus) => {
    switch (backendStatus) {
      case 'completed': return 'Completed';
      case 'partially_completed': return 'Partial';
      case 'not_interested': return 'No Interest';
      case 'follow_up': return 'Follow-up';
      default: return 'Pending';
    }
  };

  const processVisitsData = (data) => {
    return data.map(v => {
      const visitDate = new Date(v.timestamp || v.createdAt);
      const isValidDate = !isNaN(visitDate.getTime());
      const empName = v.employee?.name || 'Unknown';
      const initials = empName.split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase();

      return {
        ...v,
        id: v._id,
        store: v.storeName,
        executive: empName,
        designation: v.employee?.role || 'Field Executive',
        team: 'Operations',
        type: v.taskType || 'Store Visit',
        submissionStatus: mapSubmissionStatus(v.status),
        time: isValidDate ? visitDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '---',
        location: v.gps?.lat ? `Verified (GPS: ${v.gps.lat.toFixed(4)}, ${v.gps.lng.toFixed(4)})` : 'Location data not available',
        photos: v.photos?.length || 0,
        avatar: initials,
        employeeId: v.employee?._id || '---',
        proofs: (v.photos || []).map((url, idx) => ({
          id: idx + 1,
          title: `Photo ${idx + 1}`,
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
    { label: 'Total Visits', value: visits.length.toString(), icon: Camera, color: 'text-indigo-600', bg: 'bg-indigo-50', status: 'Total' },
    { label: 'Awaiting Review', value: visits.filter(v => v.reviewStatus === 'pending').length.toString(), icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', status: 'Pending' },
    { label: 'Accepted', value: visits.filter(v => v.reviewStatus === 'accepted').length.toString(), icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50', status: 'Accepted' },
    { label: 'Rejected', value: visits.filter(v => v.reviewStatus === 'rejected').length.toString(), icon: XCircle, color: 'text-rose-600', bg: 'bg-rose-50', status: 'Rejected' },
    // --- Statistics & Filtering ---
  ]


  const filteredVisits = filterStatus === 'Total'
    ? visits
    : visits.filter(v => {
      if (filterStatus === 'Pending') return v.reviewStatus === 'pending';
      if (filterStatus === 'Accepted') return v.reviewStatus === 'accepted';
      if (filterStatus === 'Rejected') return v.reviewStatus === 'rejected';
      return true;
    });

  /**
   * Finalizes an audit action (Approve/Reject)
   * Persists to backend and updates local state.
   */
  const handleAction = async (id, newReviewStatus, reason = null) => {
    try {
      const payload = { reviewStatus: newReviewStatus };
      if (reason) payload.rejectionReason = reason;
      await updateVisit(id, payload);
      setVisits(prev => prev.map(v => v.id === id ? { ...v, reviewStatus: newReviewStatus, rejectionReason: reason } : v));
      setSelectedVisit(null);
      setIsRejecting(false);
      setRejectionReasonInput('');
    } catch (err) {
      console.error('Error updating visit review status:', err);
      alert('Failed to update review status.');
    }
  };

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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <button
                key={i}
                onClick={() => setFilterStatus(stat.status)}
                className={`text-left bg-white dark:bg-gray-900 p-6 rounded-[2.5rem] border shadow-sm hover:shadow-xl transition-all ${filterStatus === stat.status ? 'border-indigo-500 ring-2 ring-indigo-500/20 shadow-indigo-500/10' : 'border-gray-100 dark:border-gray-800'
                  }`}
              >
                <div className={`w-12 h-12 rounded-xl ${stat.bg} ${stat.color} dark:bg-opacity-10 flex items-center justify-center mb-4`}>
                  <stat.icon size={20} />
                </div>
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter">{stat.value}</p>
              </button>
            ))}
          </div>

          <div className="space-y-6">
            {/* --- SECTION 1: AWAITING ACTION ---
                Renders pending review requests with a blink-status indicator. */}
            {(filterStatus === 'Total' || filterStatus === 'Pending') && (
              <div className="space-y-4">
                <button
                  onClick={() => setIsPendingExpanded(!isPendingExpanded)}
                  className="w-full flex items-center justify-between p-6 bg-rose-50/50 dark:bg-rose-500/5 rounded-[2rem] border border-rose-100 dark:border-rose-500/10 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/20">
                      <Clock size={18} />
                    </div>
                    <div className="text-left">
                      <h3 className="text-sm font-black text-rose-500 dark:text-rose-400 uppercase tracking-[0.2em] flex items-center gap-2">
                        Awaiting Action
                        <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                      </h3>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">{visits.filter(v => v.reviewStatus === 'pending').length} NEW REQUESTS PENDING</p>
                    </div>
                  </div>
                  <div className={`p-2 rounded-xl bg-white dark:bg-gray-900 border border-rose-100 dark:border-rose-500/20 text-rose-500 transition-transform duration-300 ${isPendingExpanded ? 'rotate-180' : ''}`}>
                    <ChevronDown size={20} />
                  </div>
                </button>

                {isPendingExpanded && (
                  <div className="flex flex-col gap-4 animate-in slide-in-from-top-4 duration-500">
                    {filteredVisits.filter(v => v.reviewStatus === 'pending').length > 0 ? (
                      filteredVisits.filter(v => v.reviewStatus === 'pending').map((visit) => {
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
                          <Clock size={32} className="text-gray-300 dark:text-gray-600" />
                        </div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No pending audits matching current filter</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* --- SECTION 2: OPERATIONAL HISTORY ---
                Renders the history of processed visits (Accepted, Rejected, etc.) */}
            {(filterStatus === 'Total' || filterStatus === 'Accepted' || filterStatus === 'Rejected') && (
              <div className="space-y-4">
                <button
                  onClick={() => setIsHistoryExpanded(!isHistoryExpanded)}
                  className="w-full flex items-center justify-between p-6 bg-indigo-50/50 dark:bg-indigo-500/5 rounded-[2rem] border border-indigo-100 dark:border-indigo-500/10 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/20">
                      <History size={18} />
                    </div>
                    <div className="text-left">
                      <h3 className="text-sm font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em] flex items-center gap-2">
                        Operational History
                      </h3>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">{filteredHistoryVisits.length} RECORDED ENTRIES FOUND</p>
                    </div>
                  </div>
                  <div className={`p-2 rounded-xl bg-white dark:bg-gray-900 border border-indigo-100 dark:border-indigo-500/20 text-indigo-600 transition-transform duration-300 ${isHistoryExpanded ? 'rotate-180' : ''}`}>
                    <ChevronDown size={20} />
                  </div>
                </button>

                {isHistoryExpanded && (
                  <div className="flex flex-col gap-4 animate-in slide-in-from-top-4 duration-500">
                    {filteredHistoryVisits.length > 0 ? (
                      filteredHistoryVisits.map((visit) => {
                        const liveData = liveEmployees[visit.employee?._id];
                        return (
                          <VisitRow
                            key={visit.id}
                            isLive={!!liveData}
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
                          />
                        );
                      })
                    ) : (
                      <div className="py-24 text-center bg-gray-50/50 dark:bg-gray-800/10 rounded-[3rem] border-2 border-dashed border-gray-100 dark:border-gray-800">
                        <div className="mx-auto w-16 h-16 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center mb-6">
                          <History size={32} className="text-gray-300 dark:text-gray-600" />
                        </div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No historical data found for this filter</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
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
            <div className="bg-gray-50/50 dark:bg-white/5 border-b border-gray-100 dark:border-gray-800 p-8 lg:p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[400px] h-full bg-indigo-500/5 blur-[100px] -mr-32 pointer-events-none" />

              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 relative z-10">
                {/* Executive Profile Section */}
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
                      {isLive && (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl border border-emerald-100 dark:border-emerald-500/20 shadow-sm animate-in zoom-in-95 duration-500">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                          <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-[0.15em]">Live Intelligence Feed Active</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-6">
                      <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                        <User size={14} className="text-indigo-500" />
                        {selectedVisit.designation} • #{selectedVisit.employeeId}
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
                    <h3 className="text-2xl font-black text-gray-950 dark:text-white tracking-tighter mb-4">Store Inventory Audit</h3>
                    <p className="text-[13px] font-bold text-gray-500 leading-relaxed max-w-xl">
                      Complete a thorough audit of Big Bazaar Central's inventory. Ensure all field protocols are followed and evidence is recorded accurately for compliance validation.
                    </p>
                  </div>


                  {/* Audit Intelligence Grid */}
                  <div>
                    <h5 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] mb-8">Audit Intelligence Report</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                          value: isLive ? `L: ${activeLocation.location.lat.toFixed(4)}, ${activeLocation.location.lng.toFixed(4)}` : selectedVisit.location,
                          icon: isLive ? Radio : MapPin,
                          color: (!isLive && (selectedVisit.location || '').includes('Warning')) ? 'text-rose-600' : 'text-emerald-600',
                          bg: (!isLive && (selectedVisit.location || '').includes('Warning')) ? 'bg-rose-50' : 'bg-emerald-50'
                        },
                        { label: 'Visual Evidence', value: `${selectedVisit.photos} HD Assets`, icon: Camera, color: 'text-indigo-600', bg: 'bg-indigo-50' }
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


                  {/* Protocol Action Panel */}
                  <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
                    <h5 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4">Live Operational Map</h5>
                    <div className="w-full h-[300px] rounded-[2rem] overflow-hidden border-2 border-white dark:border-gray-900 shadow-xl relative group/map">
                      {isLoaded ? (
                        <GoogleMap
                          mapContainerStyle={{ width: '100%', height: '100%' }}
                          center={isValidCenter ? { lat: Number(activeLocation.location.lat), lng: Number(activeLocation.location.lng) } : { lat: 12.9716, lng: 77.5946 }}
                          zoom={13}
                          onLoad={onLoad}
                          options={{ disableDefaultUI: true, zoomControl: true, styles: [/* standard subtle styles */] }}
                        >
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

                  <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800">
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
                        <div className={`absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-48 h-48 rounded-full blur-3xl transition-colors ${selectedVisit.reviewStatus === 'rejected' ? 'bg-rose-500/5 group-hover:bg-rose-500/10' : 'bg-emerald-500/5 group-hover:bg-emerald-500/10'
                          }`} />
                        <div className="flex items-center gap-6 md:gap-8 relative z-10">
                          <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-white shadow-xl transition-transform duration-500 group-hover:scale-110 ${selectedVisit.reviewStatus === 'rejected' ? 'bg-rose-500 shadow-rose-500/20' : 'bg-emerald-500 shadow-emerald-500/20'
                            }`}>
                            {selectedVisit.reviewStatus === 'rejected' ? <XCircle size={32} strokeWidth={2.5} /> : <CheckCircle2 size={32} strokeWidth={2.5} />}
                          </div>
                          <div>
                            <p className={`text-[11px] font-black uppercase tracking-[0.3em] mb-2 ${selectedVisit.reviewStatus === 'rejected' ? 'text-rose-600/60' : 'text-emerald-600/60'
                              }`}>Audit Intelligence {selectedVisit.reviewStatus === 'rejected' ? 'Flagged' : 'Verified'}</p>
                            <h4 className={`text-xl md:text-2xl font-black tracking-tighter ${selectedVisit.reviewStatus === 'rejected' ? 'text-rose-600' : 'text-emerald-600'
                              }`}>
                              {selectedVisit.reviewStatus === 'rejected' ? 'Rejected' : 'Accepted'}
                              <span className={`font-medium ml-2 uppercase text-[12px] md:text-[15px] tracking-[0.1em] ${selectedVisit.reviewStatus === 'rejected' ? 'text-rose-400' : 'text-emerald-400'
                                }`}>ON {selectedVisit.time}</span>
                            </h4>
                            {/* Display rejection reason only if the visit was explicitly flagged */}
                            {selectedVisit.reviewStatus === 'rejected' && selectedVisit.rejectionReason && (
                              <p className="mt-4 p-4 bg-rose-50/50 dark:bg-rose-500/10 rounded-2xl border border-rose-100 dark:border-rose-500/20 text-[11px] font-bold text-rose-600 leading-relaxed italic animate-in slide-in-from-top-2 duration-500">
                                "{selectedVisit.rejectionReason}"
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="hidden md:flex flex-col items-end relative z-10">
                          <div className={`px-5 py-2.5 bg-white dark:bg-gray-900 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border shadow-sm ${selectedVisit.reviewStatus === 'rejected' ? 'text-rose-600 border-rose-100 dark:border-rose-500/20' : 'text-gray-400 border-gray-100 dark:border-gray-800'
                            }`}>
                            {selectedVisit.reviewStatus === 'rejected' ? 'Audit Terminated' : 'Audit Trail Complete'}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Visual Evidence Discovery 
                  Interactive image gallery for physical proof validation. */}
              <div className="p-6 lg:p-10 overflow-y-auto custom-scrollbar flex flex-col h-full bg-white dark:bg-gray-950">
                <div className="flex items-center justify-between mb-4 shrink-0">
                  <div className="flex items-center gap-4">
                    <div className="w-1.5 h-6 bg-indigo-500 rounded-full shadow-lg shadow-indigo-500/20" />
                    <div>
                      <h5 className="text-[12px] font-black text-gray-900 dark:text-white uppercase tracking-[0.3em]">Visual Evidence Discovery</h5>
                      <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">High-Fidelity Proofs for Integrity Validation</p>
                    </div>
                  </div>
                  <div className="px-4 py-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg text-[10px] font-black text-indigo-600 tracking-widest border border-indigo-100 dark:border-indigo-500/20">
                    {selectedVisit.photos} ASSETS
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 flex-1 content-start pb-10">
                  {selectedVisit.proofs && selectedVisit.proofs.length > 0 ? (
                    <>
                      {selectedVisit.proofs.map((proof) => (
                        <div
                          key={proof.id}
                          onClick={() => setActivePhoto(proof)}
                          className="group relative overflow-hidden rounded-[2rem] border-[4px] border-white dark:border-gray-900 shadow-2xl aspect-square cursor-pointer hover:shadow-indigo-500/20 hover:-translate-y-2 transition-all duration-700"
                        >
                          <img src={proof.img} alt={proof.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                          <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6">
                            <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                              <p className="text-white font-bold text-sm tracking-tight mb-2">{proof.title}</p>
                              <div className="flex items-center gap-2">
                                <div className="px-2 py-1 bg-indigo-600 rounded text-[8px] font-black text-white uppercase tracking-widest">Full HD Proof</div>
                              </div>
                            </div>
                          </div>
                          <div className="absolute top-4 right-4 w-8 h-8 bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100">
                            <Maximize2 size={16} />
                          </div>
                        </div>
                      ))}
                      {selectedVisit.proofs.length < 4 && Array.from({ length: 4 - selectedVisit.proofs.length }).map((_, i) => (
                        <div key={`empty-${i}`} className="rounded-[2rem] border-4 border-dashed border-gray-100 dark:border-gray-900 flex flex-col items-center justify-center aspect-square bg-gray-50/50 dark:bg-white/5 opacity-50 group transition-all hover:bg-indigo-50/20">
                          <Camera size={24} className="text-gray-200 dark:text-gray-700 mb-4 group-hover:scale-110 transition-transform" />
                          <p className="text-[8px] font-black text-gray-300 dark:text-gray-700 uppercase tracking-[0.2em]">Pending asset</p>
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

                {/* Observation Intel & Notes */}
                <div className="mt-12 pt-10 border-t border-gray-100 dark:border-gray-800 space-y-8 animate-in slide-in-from-bottom-5 duration-700">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h5 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em]">Observation Intelligence</h5>
                      <div className="px-3 py-1 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg text-[8px] font-black text-indigo-600 uppercase tracking-widest border border-indigo-100 dark:border-indigo-500/20">Configurable</div>
                    </div>
                    <div className="relative group">
                      <select
                        value={observationCategory}
                        onChange={(e) => setObservationCategory(e.target.value)}
                        className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 rounded-2xl px-6 py-4 text-xs font-black uppercase tracking-widest focus:ring-2 focus:ring-indigo-500 transition-all outline-none appearance-none cursor-pointer hover:border-indigo-200 dark:hover:border-indigo-500/30"
                      >
                        <option>General Overview</option>
                        <option>Inventory Compliance</option>
                        <option>Staff Performance</option>
                        <option>Client Feedback</option>
                        <option>Protocol Variance</option>
                      </select>
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-indigo-500 transition-colors">
                        <ChevronDown size={18} />
                      </div>
                    </div>
                  </div>

                  <div className="p-8 bg-white dark:bg-gray-900 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-sm group hover:shadow-2xl transition-all duration-500">
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-indigo-500 rounded-full" />
                        <h5 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em]">Visit Notes & Observations</h5>
                      </div>
                      <div className="px-4 py-1.5 bg-gray-50 dark:bg-gray-800 rounded-full text-[9px] font-black text-gray-400 uppercase tracking-widest border border-gray-100 dark:border-gray-700">Employee Log</div>
                    </div>
                    <div className="relative">
                      <div className="absolute left-0 top-0 w-1.5 h-full bg-indigo-500/20 dark:bg-indigo-500/10 rounded-full overflow-hidden">
                        <div className="absolute top-0 w-full h-1/2 bg-indigo-500" />
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
