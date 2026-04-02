import React, { useState, useMemo, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { GoogleMap, InfoWindow, Polyline, OverlayView, OverlayViewF } from '@react-google-maps/api';
import { getSyncCachedData } from '../../utils/cacheHelper';
import { getActiveTrackingSessions } from '../../services/employee/trackingService';
import { useGoogleMaps } from '../../context/GoogleMapsContext';
import { useSocket } from '../../context/SocketContext';
import { MapPin, Users, Activity, Navigation, Search, Filter, Shield, Info, Battery, Zap, Clock, X, ChevronLeft, ChevronRight, Loader2, ExternalLink, Home, Minimize2, Maximize2, Minus } from 'lucide-react';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

const mapContainerStyle = {
  width: '100%',
  height: '100%'
};

const center = {
  // lat: 12.9716, // Default to Bangalore (based on existing location names like Koramangala)
  //lng: 77.5946
  lat: 17.366,
  lng: 78.476
};

// LIBRARIES moved to GoogleMapsContext.jsx

const LiveTracking = () => {
  const context = useOutletContext();
  const { setPageLoading } = context;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [activeRouteId, setActiveRouteId] = useState(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [isAutoSync, setIsAutoSync] = useState(true);
  const [lastSyncTime, setLastSyncTime] = useState(new Date());
  const hasAutoCentered = React.useRef(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [employees, setEmployees] = useState({}); // Store as object { id: data }
  const [map, setMap] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const hasFetched = React.useRef(false);

  const { isLoaded } = useGoogleMaps();
  const socket = useSocket();

  const user = JSON.parse(localStorage.getItem('user')) || {};

  // --- Socket Integration ---
  useEffect(() => {
    if (!socket) return;

    const handleTrackingLive = (data) => {
      console.log('Live tracking update received in manager portal:', data);
      if (!data.location || typeof data.location.lat !== 'number' || typeof data.location.lng !== 'number') {
        return console.warn('[SOCKET] Invalid location data received:', data);
      }

      setEmployees(prev => {
        const existing = prev[data.employeeId] || {};
        return {
          ...prev,
          [data.employeeId]: {
            ...existing,
            id: data.employeeId,
            name: data.employeeName,
            role: data.role || 'employee',
            status: 'On Duty',
            lastSeen: 'Just now',
            battery: '85%',
            speed: '12 km/h',
            location: data.address || `Lat: ${data.location.lat.toFixed(4)}, Lng: ${data.location.lng.toFixed(4)}`,
            address: data.address,
            city: data.city || existing.city,
            lat: data.location.lat,
            lng: data.location.lng,
            distance: data.distanceTravelled || 0,
            timestamp: data.timestamp
          }
        };
      });
    };

    const handleTrackingStop = (data) => {
      console.log('Employee stopped tracking, removing from map:', data.employeeName);
      setEmployees(prev => {
        const next = { ...prev };
        delete next[data.employeeId];
        return next;
      });
    };

    socket.on('tracking:live', handleTrackingLive);
    socket.on('tracking:stop', handleTrackingStop);

    return () => {
      socket.off('tracking:live', handleTrackingLive);
      socket.off('tracking:stop', handleTrackingStop);
    };
  }, [socket]);

   // --- 0s Hydration & Background Sync ---
  const processActiveSessions = (activeSessions) => {
    const initialMap = {};
    activeSessions.forEach(session => {
      if (session.user?._id) {
        const lastPoint = session.route?.[session.route.length - 1];
        initialMap[session.user._id] = {
          id: session.user._id,
          name: session.employeeName || session.user.name,
          role: session.user.role || 'employee',
          status: 'On Duty',
          lastSeen: session.updatedAt ? new Date(session.updatedAt).toLocaleTimeString() : 'Active',
          battery: '---',
          speed: '---',
          location: session.currentAddress || 'Known Location',
          address: session.currentAddress,
          city: session.currentCity,
          lat: lastPoint?.lat,
          lng: lastPoint?.lng,
          route: session.route?.map(p => ({ lat: Number(p.lat), lng: Number(p.lng) })) || [],
          distance: session.distanceTravelled || 0,
          timestamp: session.updatedAt
        };
      }
    });
    return initialMap;
  };

  const fetchActiveSessionsSync = React.useCallback(async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const activeSessions = await getActiveTrackingSessions();
      const initialMap = processActiveSessions(activeSessions);
      setEmployees(initialMap);
      setLastSyncTime(new Date());
      hasFetched.current = true;
    } catch (err) {
      console.error('Error syncing tracking sessions:', err);
    } finally {
      setRefreshing(false);
      if (setPageLoading) setPageLoading(false);
    }
  }, []);

  useEffect(() => {
    const { setPageLoading } = context; // Access via closure if needed or use previous destructuring

    // 1. Initial Hydration from Cache
    const cachedSessions = getSyncCachedData('active_tracking_sessions');
    if (cachedSessions) {
      setEmployees(processActiveSessions(cachedSessions));
      if (setPageLoading) setPageLoading(false);
    }

    // 2. Background Sync
    fetchActiveSessionsSync();

    // 3. Periodic Refresh
    const intervalId = setInterval(() => fetchActiveSessionsSync(), 120000);
    return () => clearInterval(intervalId);
  }, []);

  const employeeList = Object.values(employees);

  const filteredEmployees = employeeList.filter(emp =>
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (emp.location || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (emp.city || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Anti-overlap logic (Spider/Jitter)
  // Adds a tiny determinist offset if multiple employees share the exact same location
  const processedEmployees = useMemo(() => {
    const coordsCount = {};
    return filteredEmployees.map(emp => {
      if (!emp.lat || !emp.lng) return emp;
      const key = `${Number(emp.lat).toFixed(6)}|${Number(emp.lng).toFixed(6)}`;
      coordsCount[key] = (coordsCount[key] || 0) + 1;

      // If this is not the first person at this spot, add a tiny jitter
      if (coordsCount[key] > 1) {
        // Deterministic spiral-like offset based on the count
        const angle = (coordsCount[key] * 137.5) * (Math.PI / 180); // Golden angle
        const radius = 0.00015 * Math.sqrt(coordsCount[key]);
        return {
          ...emp,
          lat: Number(emp.lat) + (Math.cos(angle) * radius),
          lng: Number(emp.lng) + (Math.sin(angle) * radius),
          isJittered: true
        };
      }
      return emp;
    });
  }, [filteredEmployees]);

  // Pagination Logic
  const totalPages = Math.ceil(processedEmployees.length / itemsPerPage);
  const currentItems = processedEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const selectedEmployee = employees[selectedId];
  const activeRouteEmployee = employees[activeRouteId];
  const isValidSelectedCenter = selectedEmployee &&
    !isNaN(Number(selectedEmployee.lat)) &&
    !isNaN(Number(selectedEmployee.lng));

  const getMarkerColor = (id) => {
    const colors = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#14b8a6', '#f97316', '#a855f7'];
    if (!id) return colors[0];
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const getMarkerPath = (id) => {
    const paths = [
      "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z", // standard
      "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm0 14c-2.03 0-4.43-.82-6.14-2.1C7.12 16.2 9.4 15 12 15s4.88 1.2 6.14 2.9C16.43 19.18 14.03 20 12 20z", // rounded bust
      "M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm0 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16zm0 3a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7zm0 2a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm0 7c2.67 0 8 1.33 8 4v2H4v-2c0-2.67 5.33-4 8-4z", // detailed silhouette
      "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22 0-2.41 4.8-3.08 6-3.08 1.2 0 6 .67 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" // delivery/cap style
    ];
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    return paths[Math.abs(hash) % paths.length];
  };

  const onLoad = React.useCallback(function callback(map) {
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  // --- Frontend Geocoding Fallback ---
  const geocodeAddress = React.useCallback(async (empId, lat, lng) => {
    if (!isLoaded || !lat || !lng) return;

    const geocoder = new window.google.maps.Geocoder();
    try {
      const latLng = new window.google.maps.LatLng(lat, lng);
      const result = await new Promise((resolve, reject) => {
        geocoder.geocode({ location: latLng }, (res, status) => {
          if (status === 'OK') resolve(res);
          else reject(status);
        });
      });

      if (result[0]) {
        const locality = result[0].address_components.find(c => c.types.includes('locality'));
        const cityName = locality?.long_name || '';
        const fullAddress = result[0].formatted_address;

        setEmployees(prev => ({
          ...prev,
          [empId]: {
            ...prev[empId],
            city: cityName || prev[empId]?.city || 'Known Zone',
            location: fullAddress
          }
        }));
        return true;
      }
    } catch (err) {
      console.warn(`[GEOCODE] Failed for ID ${empId}:`, err);
      return false;
    }
    return false;
  }, [isLoaded]);

  useEffect(() => {
    if (!isLoaded || !employeeList.length) return;

    // Only auto-geocode those that are still in coordinate format
    const targetEmps = employeeList.filter(emp =>
      (!emp.city || emp.city === 'Active Zone' || emp.location?.includes('Lat:')) &&
      emp.lat && emp.lng
    );

    if (targetEmps.length > 0) {
      const timer = setTimeout(() => {
        targetEmps.forEach(emp => geocodeAddress(emp.id, emp.lat, emp.lng));
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isLoaded, employeeList.map(e => e.id + (e.location?.includes('Lat:') ? 'coord' : 'addr')).join(','), geocodeAddress]);

  // Auto-fit map to show all employees on initial load
  useEffect(() => {
    if (map && employeeList.length > 0 && !hasAutoCentered.current) {
      const bounds = new window.google.maps.LatLngBounds();
      let validCoords = 0;
      employeeList.forEach(emp => {
        if (emp.lat && emp.lng && !isNaN(emp.lat) && !isNaN(emp.lng)) {
          bounds.extend({ lat: Number(emp.lat), lng: Number(emp.lng) });
          validCoords++;
        }
      });
      if (validCoords > 0) {
        map.fitBounds(bounds);
        // Add a slight zoom out if only one employee
        if (validCoords === 1) map.setZoom(15);
        hasAutoCentered.current = true;
      }
    }
  }, [map, employeeList.length]);

  const resetView = () => {
    if (map && employeeList.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      employeeList.forEach(emp => {
        if (emp.lat && emp.lng) bounds.extend({ lat: Number(emp.lat), lng: Number(emp.lng) });
      });
      map.fitBounds(bounds);
      setSelectedId(null);
    }
  };


  return (
    <div className="space-y-6 animate-in fade-in duration-700 h-full flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0 relative">
        <div className="flex items-center gap-6">
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="p-4 bg-white dark:bg-gray-900 rounded-2xl shadow-xl text-indigo-600 hover:scale-110 active:scale-95 transition-all flex items-center gap-3 border border-indigo-100 dark:border-indigo-900/50 group"
            title={showSidebar ? "Hide Fleet" : "Show Fleet"}
          >
            <Users size={20} className={showSidebar ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-600'} />
            {!showSidebar && <span className="text-[10px] font-black uppercase tracking-widest pr-1">Show Fleet</span>}
          </button>
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight leading-none">Live Fleet Tracking</h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium mt-1.5">Real-time geospatial monitoring</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex -space-x-3">
            {employeeList.slice(0, 4).map((emp, i) => (
              <div key={i} className="w-10 h-10 rounded-2xl border-4 border-white dark:border-gray-950 bg-indigo-600 flex items-center justify-center text-xs font-black text-white shadow-xl rotate-3 hover:rotate-0 transition-transform cursor-help" title={emp.name}>
                {emp.name.charAt(0)}
              </div>
            ))}
            {employeeList.length > 4 && (
              <div className="w-10 h-10 rounded-2xl border-4 border-white dark:border-gray-950 bg-gray-900 dark:bg-white flex items-center justify-center text-xs font-black text-white dark:text-gray-900 shadow-xl -rotate-3">
                +{employeeList.length - 4}
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] leading-none">Fleet Status</span>
              <div className={`w-1.5 h-1.5 rounded-full ${isAutoSync ? 'bg-emerald-500 animate-pulse' : 'bg-gray-300'}`} />
            </div>
            <span className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">
              {employeeList.length} Active • Last sync {lastSyncTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <button
            onClick={() => fetchActiveSessionsSync(true)}
            disabled={refreshing}
            className={`flex items-center gap-3 px-5 py-3 rounded-full transition-all active:scale-95 shadow-xl font-black uppercase tracking-[0.15em] text-[10px] group ${refreshing
                ? 'bg-indigo-400 cursor-wait shadow-indigo-400/20 text-white/50'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20'
              }`}
            title="Sync Fleet Status"
          >
            <Activity size={16} className={refreshing ? 'animate-spin' : 'group-hover:animate-spin transition-all duration-1000'} />
            <span>{refreshing ? 'Syncing...' : 'Sync Fleet Status'}</span>
          </button>
          <button
            onClick={resetView}
            className="p-2 rounded-xl bg-white dark:bg-gray-900 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all active:scale-95 shadow-md border border-gray-100 dark:border-gray-800 group"
            title="Reset View"
          >
            <Home size={14} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
        {/* Sidebar: Legend & List */}
        <div className={`${showSidebar ? 'lg:flex' : 'hidden'} lg:col-span-1 flex flex-col space-y-4 h-full min-h-0 animate-in slide-in-from-left duration-500`}>
          <div className="bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 p-6 shadow-sm flex-1 flex flex-col min-h-0 overflow-hidden">
            <div className="flex items-center justify-between mb-6 shrink-0">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowSidebar(false)}
                  className="lg:hidden p-2 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-400 hover:text-indigo-600 transition-all"
                >
                  <ChevronLeft size={16} />
                </button>
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Fleet Control</h3>
              </div>
              <button
                onClick={() => setShowSidebar(false)}
                className="hidden lg:flex p-2 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-400 hover:text-indigo-600 transition-all active:scale-90"
                title="Hide Sidebar"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex items-center justify-between mb-6 shrink-0">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-indigo-600" size={16} />
                <input
                  type="text"
                  placeholder="Search fleet..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl text-[10px] font-bold outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-inner"
                />
              </div>
              <div className="ml-3">
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-[10px] font-black uppercase tracking-widest px-2 py-3 outline-none focus:ring-2 focus:ring-indigo-500/20 text-indigo-600 cursor-pointer"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                </select>
              </div>
            </div>

            <div className="space-y-3 overflow-y-auto flex-1 pr-1 custom-scrollbar">
              {currentItems.length > 0 ? (
                currentItems.map((emp) => (
                  <div
                    key={emp.id}
                    onClick={() => {
                      setSelectedId(emp.id);
                      setIsMinimized(false);
                      setActiveRouteId(emp.id);
                      if (map && emp.lat && emp.lng) {
                        map.panTo({ lat: emp.lat, lng: emp.lng });
                        map.setZoom(17);
                      }
                    }}
                    className={`group p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${selectedId === emp.id
                        ? 'border-indigo-500 bg-indigo-50/30 dark:bg-indigo-900/10 shadow-lg shadow-indigo-500/5 translate-x-1'
                        : 'border-gray-50 dark:border-gray-800 hover:border-indigo-500/30 hover:bg-gray-50/50 dark:hover:bg-gray-800/30'
                      }`}
                  >
                    <div className="flex items-start justify-between relative z-10">
                      <div>
                        <h4 className={`font-black text-sm transition-colors ${selectedId === emp.id ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-900 dark:text-white'}`}>{emp.name}</h4>
                        <div className="flex flex-col gap-0.5 mt-1">
                          {emp.city && (
                            <p className="text-[9px] font-black text-indigo-500 uppercase tracking-widest">{emp.city}</p>
                          )}
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                            <MapPin size={10} className="shrink-0" />
                            <span className="truncate max-w-[150px]">{emp.location}</span>
                          </p>
                        </div>
                      </div>
                      <div className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${emp.status === 'On Duty' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-gray-400'}`} />
                    </div>

                    <div className="mt-3 flex items-center justify-between text-[10px] font-black text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <Navigation size={10} className="text-indigo-500" />
                        <span>{emp.speed !== '-' ? emp.speed : 'Idle'}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Activity size={10} className="text-indigo-400" />
                        <span>{emp.lastSeen}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center p-10 text-center space-y-3">
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl text-gray-400">
                    <Search size={32} />
                  </div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-relaxed">No tracking data received yet</p>
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-50 dark:border-gray-800 shrink-0">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-400 hover:text-indigo-600 disabled:opacity-30 transition-all active:scale-90"
                >
                  <ChevronLeft size={16} />
                </button>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Page</span>
                  <span className="text-xs font-black text-gray-900 dark:text-white px-2 py-1 bg-gray-50 dark:bg-gray-800 rounded-lg">{currentPage}</span>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">of {totalPages}</span>
                </div>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-400 hover:text-indigo-600 disabled:opacity-30 transition-all active:scale-90"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>

          <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-[2rem] p-6 text-white shadow-xl shadow-indigo-600/20 shrink-0">
            <h5 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-4">Command Center</h5>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold">Signal Health</span>
                <span className="text-xs font-black">98.4%</span>
              </div>
              <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white w-[98.4%] animate-shimmer" />
              </div>
              <div className="flex items-center justify-between pt-2">
                <div className="flex flex-col gap-0.5">
                  <p className="text-[8px] opacity-60 font-black uppercase tracking-widest">Active Links</p>
                  <p className="text-sm font-black tracking-tight">{employeeList.length} Devices</p>
                </div>
                <div className="flex flex-col gap-0.5 text-right">
                  <p className="text-[8px] opacity-60 font-black uppercase tracking-widest">Fleet Coverage</p>
                  <p className="text-sm font-black tracking-tight">
                    {employeeList.reduce((acc, curr) => acc + (curr.distance || 0), 0).toFixed(1)} km
                  </p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <Shield size={16} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main: Google Maps View */}
        <div className={`${showSidebar ? 'lg:col-span-3' : 'lg:col-span-4'} bg-slate-50 dark:bg-gray-950 rounded-[3rem] border-4 border-white dark:border-gray-900 shadow-2xl relative overflow-hidden group transition-all duration-500`}>
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={isValidSelectedCenter ? { lat: Number(selectedEmployee.lat), lng: Number(selectedEmployee.lng) } : center}
              zoom={selectedEmployee ? 15 : 12}
              onLoad={onLoad}
              onUnmount={onUnmount}
              onClick={() => setSelectedId(null)}
              options={{
                styles: [
                  { "elementType": "geometry", "stylers": [{ "color": "#f5f5f5" }] },
                  { "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] },
                  { "elementType": "labels.text.fill", "stylers": [{ "color": "#616161" }] },
                  { "elementType": "labels.text.stroke", "stylers": [{ "color": "#f5f5f5" }] },
                  { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#ffffff" }] },
                  { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#c9c9c9" }] }
                ],
                disableDefaultUI: true,
                zoomControl: true,
              }}
            >
              <style>{`
                @keyframes markerFloat {
                  0%, 100% { transform: translateY(0); }
                  50% { transform: translateY(-10px); }
                }
                .animate-marker-float {
                  animation: markerFloat 3s ease-in-out infinite;
                }
                @keyframes detailExpand {
                  from { opacity: 0; transform: translate(-50%, -80%) scale(0.95); }
                  to { opacity: 1; transform: translate(-50%, -100%) scale(1); }
                }
                .animate-detail-expand {
                  animation: detailExpand 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                .detail-anchor {
                  transform: translate(-50%, -100%);
                  margin-top: -60px; /* Offset to float above the floating marker */
                }
                @keyframes syncGlow {
                  0%, 100% { box-shadow: 0 0 10px rgba(99, 102, 241, 0.1); border-color: rgba(99, 102, 241, 0.2); }
                  50% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.3); border-color: rgba(99, 102, 241, 0.6); }
                }
                .animate-sync-live {
                  animation: syncGlow 3s ease-in-out infinite;
                }
              `}</style>
              {processedEmployees
                .map((emp) => {
                  if (!emp.lat || !emp.lng) return null;
                  const markerColor = getMarkerColor(emp.id);
                  const isSelected = selectedId === emp.id;

                  return (
                    <React.Fragment key={emp.id}>
                      <OverlayViewF
                        position={{ lat: Number(emp.lat), lng: Number(emp.lng) }}
                        mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                        zIndex={isSelected ? 1000 : 1}
                      >
                        <div
                          style={{ transform: 'translate(-50%, -100%)' }}
                          className="relative flex flex-col items-center group cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isSelected) {
                              setIsMinimized(!isMinimized);
                            } else {
                              setSelectedId(emp.id);
                              setActiveRouteId(emp.id);
                              setIsMinimized(false);
                            }
                          }}
                        >
                          {/* Name Tag */}
                          <div className="mb-1.5 px-2.5 py-1 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-lg shadow-xl border border-indigo-100 dark:border-indigo-900/30 transition-all group-hover:scale-110">
                            <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest whitespace-nowrap">
                              {emp.name.split(' ')[0]}
                            </span>
                          </div>

                          {/* Floating Silhouette Icon */}
                          <div className={`animate-marker-float p-2 rounded-full bg-white dark:bg-gray-900 shadow-xl border-2 transition-all ${isSelected
                              ? 'border-indigo-500 scale-110 ring-4 ring-indigo-500/20'
                              : 'border-white dark:border-gray-800'
                            }`}>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d={getMarkerPath(emp.id)} fill={markerColor} />
                            </svg>
                          </div>
                        </div>
                      </OverlayViewF>
                      {isSelected && (
                        <OverlayViewF
                          position={{ lat: Number(emp.lat), lng: Number(emp.lng) }}
                          mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                          zIndex={2000}
                        >
                          <div
                            className={`bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 transition-all duration-500 overflow-hidden detail-anchor animate-detail-expand origin-bottom ${isMinimized ? 'w-fit p-2 min-h-[40px]' : 'min-w-[200px] max-w-[260px] p-4 min-h-[160px]'}`}
                          >
                            {isMinimized ? (
                              <div className="flex items-center gap-3 px-2">
                                <div className="p-1.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600">
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                    <path d={getMarkerPath(emp.id)} fill="currentColor" />
                                  </svg>
                                </div>
                                <span className="text-[10px] font-black uppercase text-gray-800 dark:text-gray-200">{emp.name.split(' ')[0]}</span>
                                <button
                                  onClick={() => setIsMinimized(false)}
                                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-all ml-1"
                                >
                                  <Maximize2 size={10} className="text-gray-400" />
                                </button>
                              </div>
                            ) : (
                              <>
                                <div className="flex items-center justify-between mb-3">
                                  <h4 className="text-sm font-black text-gray-900 dark:text-white leading-tight tracking-tight">{emp.name}</h4>
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => setIsMinimized(true)}
                                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-all"
                                      title="Minimize"
                                    >
                                      <Minus size={12} className="text-gray-400" />
                                    </button>
                                    <button
                                      onClick={() => setSelectedId(null)}
                                      className="p-1 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-md transition-all"
                                      title="Close"
                                    >
                                      <X size={12} className="text-rose-400" />
                                    </button>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 mb-3">
                                  <button
                                    onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${emp.lat},${emp.lng}`, '_blank')}
                                    className="flex-1 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all text-[8px] font-black uppercase flex items-center justify-center gap-1 group"
                                    title="Navigate in Google Maps"
                                  >
                                    <span>Navigate</span>
                                    <ExternalLink size={10} />
                                  </button>
                                  <div className="flex items-center gap-1 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-1 rounded-lg">
                                    <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[7px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">LIVE</span>
                                  </div>
                                </div>

                                <div className="space-y-3">
                                  <div className="flex flex-col">
                                    <p className="text-[9px] font-black text-indigo-600 uppercase tracking-widest mb-1">{emp.city || 'Active Zone'}</p>
                                    <div className="flex items-start gap-2 text-[10px] text-gray-500 bg-gray-50/80 dark:bg-gray-800/50 p-2.5 rounded-xl border border-gray-100 dark:border-gray-800/50 group relative">
                                      <MapPin size={12} className="text-indigo-500 shrink-0 mt-0.5" />
                                      <div className="flex flex-col gap-1 w-full">
                                        <span className={`font-semibold leading-relaxed pr-4 ${emp.location?.includes('Lat:') ? 'text-gray-400 italic' : 'text-gray-600 dark:text-gray-300'}`}>
                                          {emp.location}
                                        </span>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            geocodeAddress(emp.id, emp.lat, emp.lng);
                                          }}
                                          className="absolute right-1 top-1 p-1 rounded-lg bg-white dark:bg-gray-950 shadow-sm border border-gray-100 dark:border-gray-800 text-indigo-600 hover:scale-110 active:scale-95 transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100"
                                          title="Resolve Address"
                                        >
                                          <Navigation size={10} />
                                        </button>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-3 gap-2">
                                    <div className="flex flex-col gap-1 p-2 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800/50 items-center text-center">
                                      <Battery size={10} className="text-emerald-500" />
                                      <span className="text-[9px] font-black text-gray-900 dark:text-white uppercase">{emp.battery || '92%'}</span>
                                    </div>
                                    <div className="flex flex-col gap-1 p-2 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800/50 items-center text-center">
                                      <Navigation size={10} className="text-indigo-500" />
                                      <span className="text-[9px] font-black text-gray-900 dark:text-white uppercase">{emp.speed !== '---' ? emp.speed : '0 km/h'}</span>
                                    </div>
                                    <div className="flex flex-col gap-1 p-2 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800/50 items-center text-center">
                                      <Activity size={10} className="text-orange-500" />
                                      <span className="text-[9px] font-black text-gray-900 dark:text-white uppercase">{emp.distance?.toFixed(1) || 0} km</span>
                                    </div>
                                  </div>

                                  <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
                                    <div className="flex items-center gap-1.5">
                                      <Clock size={10} className="text-gray-400" />
                                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Seen {emp.lastSeen}</span>
                                    </div>
                                    <button
                                      onClick={() => { }}
                                      className="text-[9px] font-black text-indigo-600 uppercase tracking-widest hover:underline"
                                    >
                                      View History
                                    </button>
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        </OverlayViewF>
                      )}
                    </React.Fragment>
                  );
                })}

              {activeRouteEmployee && activeRouteEmployee.route && activeRouteEmployee.route.length > 1 && (
                <Polyline
                  path={activeRouteEmployee.route}
                  options={{
                    strokeColor: getMarkerColor(selectedEmployee.id),
                    strokeOpacity: 0.8,
                    strokeWeight: 4,
                    geodesic: true,
                  }}
                />
              )}
            </GoogleMap>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 relative overflow-hidden">
              {/* Map Skeleton Background */}
              <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1.5px,transparent_1.5px)] dark:bg-[radial-gradient(#1f2937_1.5px,transparent_1.5px)] [background-size:40px_40px] opacity-40"></div>
              
              <div className="z-10 flex flex-col items-center gap-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-white dark:bg-gray-900 rounded-[2rem] flex items-center justify-center text-indigo-600 shadow-2xl border border-gray-100 dark:border-gray-800">
                    <Loader2 className="animate-spin" size={32} />
                  </div>
                  <div className="absolute inset-0 border-4 border-indigo-400 rounded-[2rem] animate-ping opacity-20" />
                </div>
                <div className="text-center space-y-2">
                  <p className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">Initializing Map Interface</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">Establishing Secure Fleet Link...</p>
                </div>
              </div>

              {/* Skeleton Controls */}
              <div className="absolute top-8 right-8 flex flex-col gap-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-12 h-12 bg-white/50 dark:bg-gray-900/50 rounded-2xl animate-pulse" />
                ))}
              </div>
            </div>
          )}



          <div className="absolute bottom-10 right-10 flex flex-col gap-3 z-30">
            <button
              onClick={() => setSelectedId(null)}
              className="p-4 bg-white dark:bg-gray-900 rounded-2xl shadow-xl text-gray-400 hover:text-indigo-600 transition-all active:scale-90 group"
              title="Reset Focus"
            >
              <Activity size={20} className="group-hover:animate-pulse" />
            </button>
            <button
              onClick={() => {
                if (employeeList.length > 0 && map) {
                  const bounds = new window.google.maps.LatLngBounds();
                  employeeList.forEach(emp => {
                    if (emp.lat && emp.lng) bounds.extend({ lat: Number(emp.lat), lng: Number(emp.lng) });
                  });
                  map.fitBounds(bounds);
                }
              }}
              className="p-4 bg-white dark:bg-gray-900 rounded-2xl shadow-xl text-gray-400 hover:text-indigo-600 transition-all active:scale-90"
            >
              <Navigation size={20} />
            </button>
          </div>

          {/* Floating Global Insights - Collapsible */}
          <div className={`absolute top-10 left-10 transition-all duration-500 z-30 ${showInsights
              ? 'p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-[2rem] border border-white/50 dark:border-gray-800 shadow-2xl max-w-[280px]'
              : 'p-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl w-12 h-12 flex items-center justify-center cursor-pointer hover:scale-110 active:scale-95'
            }`}
            onClick={() => !showInsights && setShowInsights(true)}
          >
            {showInsights ? (
              <>
                <div className="flex items-center justify-between gap-4 mb-5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
                      <Activity size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-gray-900 dark:text-white tracking-tighter leading-none">Global Insights</h3>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-1.5">Live Zone Status</p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowInsights(false);
                    }}
                    className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-500">
                  <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100/50 dark:border-gray-800/50">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Active Links</span>
                      <span className="text-xs font-black text-indigo-600">{employeeList.length} Online</span>
                    </div>
                    <div className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 w-[100%]" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pb-2">
                    <div className="flex flex-col gap-1">
                      <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Monitoring</p>
                      <p className="text-sm font-black text-gray-900 dark:text-white">Active</p>
                    </div>
                    <div className="flex flex-col gap-1 text-right">
                      <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Refresh Rate</p>
                      <p className="text-sm font-black text-gray-900 dark:text-white">Real-time</p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <Activity size={20} className="text-indigo-600" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveTracking;
