import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import { GoogleMap, Polyline, OverlayView, OverlayViewF } from '@react-google-maps/api';
import { getActiveTrackingSessions } from '../../services/employee/trackingService';
import { useGoogleMaps } from '../../context/GoogleMapsContext';
import { useSocket } from '../../context/SocketContext';
import { Users, Activity, Search, Clock, ChevronRight, Loader2, Home, MapPin, Navigation, Flag, X, Maximize2, ExternalLink, History, Zap, Activity as SpeedIcon, Ruler, RefreshCw, Eye, EyeOff } from 'lucide-react';
import trackforceEmployeeIcon from '../../assets/trackforce_employee.png';

const ARTICLES = {
  container: "space-y-6 flex flex-col p-4 dark:bg-gray-950 h-full relative",
  header: "flex flex-col xl:flex-row xl:items-center justify-between gap-6 p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-[2.5rem] shadow-xl border border-white/50 dark:border-gray-800/30",
};

const mapContainerStyle = { width: '100%', height: '100%' };
const center = { lat: 17.4450, lng: 78.4200 };

// --- Elite Components ---

const EmployeeDetailCard = ({ employee, currentPos, onClose, onToggleMission, isVisible }) => {
  if (!employee) return null;
  const lat = employee.lat || currentPos?.lat;
  const lng = employee.lng || currentPos?.lng;

  return (
    <div className="absolute bottom-[65px] left-1/2 -translate-x-1/2 w-[240px] bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl rounded-[1.8rem] shadow-[0_25px_60px_rgba(0,0,0,0.25)] border border-white/20 p-4 z-[2000] animate-in slide-in-from-bottom-2 duration-300 pointer-events-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1.5 focus:outline-none">
           <h2 className="text-[12px] font-black text-gray-900 dark:text-white uppercase tracking-tight">{employee.name || 'AGENT'}</h2>
           <div className={`flex items-center gap-1 px-2 py-0.5 ${employee.isTracking ? 'bg-emerald-500' : 'bg-gray-500'} rounded-full`}>
              {employee.isTracking && <div className="w-1 h-1 bg-white rounded-full animate-ping" />}
              <span className="text-[7px] font-black text-white uppercase tracking-widest">{employee.isTracking ? 'LIVE' : 'GPS OFF'}</span>
           </div>
        </div>
        <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="p-1 hover:bg-rose-50 dark:hover:bg-rose-900/20 group rounded-lg transition-colors focus:outline-none">
          <X size={14} className="text-gray-400 group-hover:text-rose-500" />
        </button>
      </div>
      <div className="space-y-4 mb-5">
        <div className="flex gap-3">
           <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center shrink-0"><MapPin size={18} className="text-[#3b82f6]" /></div>
            <div>
              <p className="text-[8px] font-black text-blue-500 uppercase tracking-widest mb-0.5">EXACT LIVE COORDINATES</p>
              <p className="text-[12px] font-black text-gray-900 dark:text-white leading-none">
                {lat ? `${Number(lat).toFixed(6)}, ${Number(lng).toFixed(6)}` : 'Resolving GPS...'}
              </p>
              {employee.address && (
                <p className="text-[9px] font-bold text-gray-400 mt-1 uppercase tracking-tight line-clamp-1">
                  {employee.address}
                </p>
              )}
            </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 mb-5">
         <div className="bg-gray-50 dark:bg-gray-800/50 p-2.5 rounded-2xl flex flex-col items-center justify-center gap-1 border border-white/50 dark:border-gray-800"><Zap size={14} className="text-gray-300 dark:text-gray-600" /><span className="text-[10px] font-black text-gray-900 dark:text-white">--</span></div>
         <div className="bg-gray-50 dark:bg-gray-800/50 p-2.5 rounded-2xl flex flex-col items-center justify-center gap-1 border border-white/50 dark:border-gray-800"><SpeedIcon size={14} className="text-gray-300 dark:text-gray-600" /><span className="text-[10px] font-black text-gray-900 dark:text-white">0 KM/H</span></div>
         <div className="bg-gray-50 dark:bg-gray-800/50 p-2.5 rounded-2xl flex flex-col items-center justify-center gap-1 border border-white/50 dark:border-gray-800"><Ruler size={14} className="text-gray-300 dark:text-gray-600" /><span className="text-[10px] font-black text-gray-900 dark:text-white">0.5 KM</span></div>
      </div>
      <button onClick={(e) => { e.stopPropagation(); onToggleMission(); }} className={`w-full py-2.5 mb-4 rounded-2xl flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-widest transition-all ${isVisible ? 'bg-rose-600 text-white shadow-lg shadow-rose-500/30' : 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 hover:bg-blue-700'} active:scale-95 focus:outline-none`}>
        {isVisible ? <><EyeOff size={14} /> HIDE ROUTE</> : <><Eye size={14} /> SHOW ROUTE</>}
      </button>
      <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800"><div className="flex items-center gap-1.5 text-gray-400 capitalize"><History size={12} /><span className="text-[8px] font-bold uppercase tracking-widest">Active Status</span></div><button className="text-[8px] font-black text-blue-500 uppercase tracking-widest">HISTORY</button></div>
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white/95 dark:bg-gray-900/95 rotate-45 border-r border-b border-white/20 dark:border-gray-800" />
    </div>
  );
};

// Reduced avatar size from w-14 to w-11 for professional map density
const EmployeeAvatar = ({ onClick }) => (
  <div onClick={onClick} className="relative group flex flex-col items-center focus:outline-none">
    <div className="absolute -inset-4 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all duration-500" />
    <div className="relative transform hover:scale-110 transition-all duration-400 cursor-pointer">
       <div className="w-11 h-11 rounded-full border-[3px] border-white dark:border-gray-900 shadow-xl overflow-hidden bg-white/90 backdrop-blur shadow-blue-500/5">
          <img src={trackforceEmployeeIcon} alt="Employee" className="w-full h-full object-cover scale-110" />
       </div>
       <div className="absolute -bottom-0.5 -right-0.5 bg-emerald-500 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-gray-950 flex items-center justify-center shadow-lg"><div className="w-1.5 h-1.5 bg-white rounded-full animate-ping" /></div>
    </div>
  </div>
);

// HARD-FLUSH MISSION LAYER: Never returns null, explicitly clears path
const ActiveMissionLayer = ({ missionId, employees, routes, destinations }) => {
  const activeId = missionId ? String(missionId) : null;
  const employee = activeId ? employees[activeId] : null;
  const path = activeId ? (routes[activeId] || []) : [];
  const dest = activeId ? destinations[activeId] : null;

  return (
    <>
      {/* Outer Glow Path */}
      <Polyline 
        key={`glow-route-${activeId || 'idle'}`}
        path={path}
        options={{ 
          strokeColor: '#3b82f6', 
          strokeOpacity: activeId ? 0.2 : 0, 
          strokeWeight: 12, 
          lineJoin: 'round', 
          visible: !!activeId,
          zIndex: 99
        }}
      />
      {/* Primary Optimal Path */}
      <Polyline 
        key={`hard-flush-route-${activeId || 'idle'}`}
        path={path}
        options={{ 
          strokeColor: '#2563eb', 
          strokeOpacity: activeId ? 1 : 0, 
          strokeWeight: 5, 
          lineJoin: 'round', 
          visible: !!activeId,
          zIndex: 100 
        }}
      />
      {activeId && employee?.start && (
        <OverlayViewF position={{ lat: Number(employee.start.lat), lng: Number(employee.start.lng) }} mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
          <div className="p-2 bg-slate-800 rounded-full shadow-lg border-2 border-white translate-x-[-50%] translate-y-[-50%] flex items-center justify-center animate-in zoom-in-50 duration-300"><Flag size={10} className="text-white fill-white" /></div>
        </OverlayViewF>
      )}
      {activeId && dest && (
        <OverlayViewF position={{ lat: Number(dest.lat), lng: Number(dest.lng) }} mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
          <div className="p-2 bg-blue-600 rounded-full shadow-2xl border-2 border-white translate-x-[-50%] translate-y-[-50%] flex items-center justify-center z-[2000] animate-in zoom-in-0 duration-500">
            <div className="absolute inset-0 bg-blue-600 rounded-full animate-ping opacity-25" />
            <MapPin size={18} className="text-white fill-white relative z-10" />
          </div>
        </OverlayViewF>
      )}
    </>
  );
};

const LiveTracking = () => {
  const context = useOutletContext();
  const { setPageLoading } = context;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [employees, setEmployees] = useState({});
  const [map, setMap] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [animatedPositions, setAnimatedPositions] = useState({});
  const [routes, setRoutes] = useState({});
  const [destinations, setDestinations] = useState({});
  const [detailEmpId, setDetailEmpId] = useState(null);
  const [visibleMissionId, setVisibleMissionId] = useState(null);
  const [lastSyncTime, setLastSyncTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  const animationFrameRef = useRef({});
  const lastRouteUpdateRef = useRef({}); // Track last update time per employee ID
  const { isLoaded } = useGoogleMaps();
  const socket = useSocket();

  const handleResetMission = useCallback(() => {
    setVisibleMissionId(null);
    setRoutes({});
    setDestinations({});
    setDetailEmpId(null);
    setSelectedId(null);
  }, []);

  const fetchOptimalRoute = async (id, origin, destination, isSilent = false) => {
    if (!isLoaded || !origin || !destination) return;
    
    // Throttle: Don't update more than once every 12 seconds per agent
    const idStr = String(id);
    const now = Date.now();
    const lastUpdate = lastRouteUpdateRef.current[idStr] || 0;
    if (isSilent && (now - lastUpdate < 12000)) return;

    try {
      const response = await fetch(`https://router.project-osrm.org/route/v1/driving/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?overview=full&geometries=geojson&continue_straight=true`);
      const data = await response.json();
      if (data.code === 'Ok' && data.routes?.[0]) {
        let path = data.routes[0].geometry.coordinates.map(coord => ({ lat: coord[1], lng: coord[0] }));
        
        // Ensure the path starts EXACTLY at the current origin for a "live connection" feel
        if (path.length > 0) {
          path = [{ lat: Number(origin.lat), lng: Number(origin.lng) }, ...path];
        }
        
        setRoutes(prev => ({ ...prev, [idStr]: path }));
        lastRouteUpdateRef.current[idStr] = now;
      }
    } catch (err) { 
      if (!isSilent) console.error(`[ROUTING ERROR]`, err); 
    }
  };

  useEffect(() => {
    if (!socket) return;

    socket.on('tracking:start', (data) => {
      console.log('[SOCKET] Agent started tracking:', data.employeeName);
      setEmployees(prev => {
        const idStr = String(data.employeeId);
        if (prev[idStr]) return { ...prev, [idStr]: { ...prev[idStr], isTracking: true } };
        return { 
          ...prev, 
          [idStr]: { 
            id: idStr, 
            name: data.employeeName, 
            isTracking: true,
            lat: data.location?.lat,
            lng: data.location?.lng
          } 
        };
      });
    });

    socket.on('tracking:stop', (data) => {
      console.log('[SOCKET] Agent stopped tracking:', data.employeeName);
      setEmployees(prev => {
        const idStr = String(data.employeeId);
        if (!prev[idStr]) return prev;
        return { ...prev, [idStr]: { ...prev[idStr], isTracking: false } };
      });
      // If this agent's mission was active, reset it
      if (String(visibleMissionId) === String(data.employeeId)) {
        handleResetMission();
      }
    });

    socket.on('tracking:live', (data) => {
      setEmployees(prev => {
        const idStr = String(data.employeeId);
        const existing = prev[idStr] || {};
        
        const rawLat = data.lat || (data.location && data.location.lat);
        const rawLng = data.lng || (data.location && data.location.lng);
        
        if (!rawLat || !rawLng) return prev; // Ignore invalid pings

        const newPos = { lat: Number(rawLat), lng: Number(rawLng) };
        const currentPos = animatedPositions[idStr] || { lat: existing.lat || newPos.lat, lng: existing.lng || newPos.lng };
        
        const duration = 2000;
        let startTicks = null;
        const step = (timestamp) => {
          if (!startTicks) startTicks = timestamp;
          const progress = Math.min((timestamp - startTicks) / duration, 1);
          const interpLat = currentPos.lat + (newPos.lat - currentPos.lat) * progress;
          const interpLng = currentPos.lng + (newPos.lng - currentPos.lng) * progress;
          setAnimatedPositions(v => ({ ...v, [idStr]: { lat: interpLat, lng: interpLng } }));
          if (progress < 1) animationFrameRef.current[idStr] = requestAnimationFrame(step);
        };
        if (animationFrameRef.current[idStr]) cancelAnimationFrame(animationFrameRef.current[idStr]);
        animationFrameRef.current[idStr] = requestAnimationFrame(step);

        // LIVE ROUTE UPDATE: If this employee's mission is active, update the route
        if (String(visibleMissionId) === idStr && existing.destination) {
          fetchOptimalRoute(idStr, newPos, existing.destination, true);
        }

        return { 
          ...prev, 
          [idStr]: { 
            ...existing, 
            ...data, 
            id: idStr, 
            lat: newPos.lat, 
            lng: newPos.lng, 
            address: data.address || existing.address || `Lat: ${newPos.lat.toFixed(6)}, Lng: ${newPos.lng.toFixed(6)}`,
            isTracking: true 
          } 
        };
      });
    });

    return () => {
      socket.off('tracking:start');
      socket.off('tracking:stop');
      socket.off('tracking:live');
    };
  }, [socket, animatedPositions, visibleMissionId, handleResetMission]);

  const fetchActiveSessionsSync = useCallback(async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const activeSessions = await getActiveTrackingSessions();
      const initialMap = {};
      activeSessions.forEach(session => {
        if (session.user?._id) {
          const idStr = String(session.user._id);
          const lastPoint = session.route?.[session.route.length - 1];
          const startPoint = session.route?.[0] || lastPoint;
          const existing = employees[idStr];
          initialMap[idStr] = { 
            id: idStr, 
            name: session.employeeName || session.user.name, 
            lat: lastPoint?.lat || existing?.lat, 
            lng: lastPoint?.lng || existing?.lng, 
            start: startPoint, 
            address: session.currentAddress || existing?.address,
            destination: session.destination, // PULL FORM DATABASE
            isTracking: !!session.user.isTracking
          };
          if (lastPoint && !animatedPositions[idStr]) setAnimatedPositions(prev => ({ ...prev, [idStr]: { lat: lastPoint.lat, lng: lastPoint.lng } }));
        }
      });
      setEmployees(initialMap);
      setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } catch (err) { console.error('Sync Error:', err); } finally { if (isManual) setTimeout(() => setRefreshing(false), 800); else setRefreshing(false); if (setPageLoading) setPageLoading(false); }
  }, [isLoaded, animatedPositions, setPageLoading]);

  useEffect(() => {
    if (isLoaded) { fetchActiveSessionsSync(); const intervalId = setInterval(() => fetchActiveSessionsSync(), 60000); return () => { clearInterval(intervalId); Object.values(animationFrameRef.current).forEach(cancelAnimationFrame); }; }
  }, [isLoaded, fetchActiveSessionsSync]);

  const handleAvatarClick = (id) => {
    const idStr = String(id);
    setDetailEmpId(idStr === String(detailEmpId) ? null : idStr);
    const emp = employees[idStr];
    if (map && emp?.lat) {
       map.panTo({ lat: Number(emp.lat), lng: Number(emp.lng) });
       map.setZoom(16);
    }
  };

  const handleToggleMission = (id) => {
    const idStr = String(id);
    const currentActiveIdStr = visibleMissionId ? String(visibleMissionId) : null;
    
    if (currentActiveIdStr === idStr) { 
      handleResetMission(); 
    } 
    else { 
      setVisibleMissionId(idStr); 
      setDetailEmpId(idStr);
      setSelectedId(idStr);
      
      const emp = employees[idStr];
      if (emp && emp.destination) {
        setDestinations({ [idStr]: emp.destination });
        setRoutes({}); // Clear other routes for isolation
        
        // Use the most accurate current position for routing
        const origin = { lat: emp.lat, lng: emp.lng };
        fetchOptimalRoute(idStr, origin, emp.destination);
        
        if (map) { 
          map.panTo(origin); 
          map.setZoom(16); 
        }
      }
    }
  };

  const allActiveEmployees = Object.values(employees).filter(emp => emp.isTracking);
  const filtered = allActiveEmployees.filter(emp => emp.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const currentItems = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className={ARTICLES.container}>
      <div className={ARTICLES.header}>
        <div className="flex flex-col"><h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-widest leading-none">COMMAND CENTER</h1><p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mt-2 flex items-center gap-2 italic">LIVE MISSION PULSE <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /></p></div>
        <div className="flex items-center gap-8">
           <div className="flex flex-col items-end"><p className="text-gray-400 font-black uppercase text-[10px] tracking-widest">FLEET SYNC</p><p className="text-[14px] font-black text-gray-900 dark:text-white leading-none uppercase">{allActiveEmployees.length} AGENTS ACTIVE • {lastSyncTime}</p></div>
           <button onClick={() => fetchActiveSessionsSync(true)} className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-black uppercase text-[12px] tracking-widest transition-all shadow-xl shadow-blue-500/30 hover:bg-blue-700 active:scale-95 focus:outline-none">{refreshing ? <RefreshCw className="animate-spin" size={18} /> : 'SYNC FLEET'}</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 flex-1 min-h-0">
        <div className={`${showSidebar ? 'lg:flex' : 'hidden'} lg:col-span-1 flex flex-col space-y-4`}>
          <div className="bg-white dark:bg-gray-900/90 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-xl flex-1 flex flex-col overflow-hidden border border-white/50 dark:border-gray-800">
             <div className="flex items-center gap-2 mb-8 pr-2"><div className="relative flex-1"><Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={18} /><input type="text" placeholder="SEARCH AGENT..." value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} className="w-full pl-14 pr-4 py-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl text-[10px] font-black outline-none tracking-widest uppercase focus:ring-1 focus:ring-blue-500" /></div></div>
            <div className="space-y-4 overflow-y-auto flex-1 custom-scrollbar pr-1">
              {currentItems.map((emp) => (
                <div key={`side-${emp.id}`} className={`p-4 rounded-2xl border-2 transition-all ${selectedId === emp.id ? 'border-blue-500 bg-blue-500/5 shadow-xl' : 'border-transparent bg-gray-50/50 dark:bg-gray-800/30'}`}>
                   <div className="flex justify-between items-start mb-3">
                     <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                       <h4 className="font-black text-[11px] dark:text-white uppercase tracking-tight leading-none truncate">{emp.name}</h4>
                       <div className="flex flex-col gap-0.5">
                         <span className="text-[7px] font-black text-gray-400 uppercase tracking-widest">{emp.isTracking ? 'AGENT DISPATCHED' : 'OFFLINE'}</span>
                          {emp.isTracking && (
                            <div className="flex flex-col gap-0.5 max-w-[140px]">
                              <span className="text-[9px] font-black text-blue-600 dark:text-blue-400 tracking-tight leading-none italic">
                                { (emp.lat || animatedPositions[emp.id]?.lat) ? `${Number(emp.lat || animatedPositions[emp.id]?.lat).toFixed(6)}, ${Number(emp.lng || animatedPositions[emp.id]?.lng).toFixed(6)}` : 'Resolving GPS...'}
                              </span>
                              {emp.address && <span className="text-[7px] font-bold text-gray-500 line-clamp-1 truncate uppercase tracking-tighter">{emp.address}</span>}
                            </div>
                          )}
                       </div>
                     </div>
                     <div className={`w-2 h-2 rounded-full shrink-0 ${emp.isTracking ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-gray-300'}`} />
                   </div>
                   <div className="grid grid-cols-2 gap-2">
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleAvatarClick(emp.id); }}
                        className="flex items-center justify-center gap-1.5 py-1.5 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl text-[8px] font-black text-gray-900 dark:text-gray-200 uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
                      >
                        <MapPin size={10} className="text-blue-500" />
                        LIVE
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleToggleMission(emp.id); }}
                        className={`flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all shadow-sm ${String(visibleMissionId) === String(emp.id) ? 'bg-rose-600 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                      >
                        <Navigation size={10} />
                        ROUTE
                      </button>
                   </div>
                </div>
              ))}
              {filtered.length === 0 && <div className="text-center py-10 opacity-40"><p className="text-[10px] font-black uppercase tracking-widest text-gray-400">No Mission Intel</p></div>}
            </div>
          </div>
        </div>

        <div className={`${showSidebar ? 'lg:col-span-3' : 'lg:col-span-4'} bg-white dark:bg-gray-900 rounded-[3rem] relative overflow-hidden border-[10px] border-white dark:border-gray-950 shadow-2xl h-[750px]`}>
          <div className="absolute top-8 left-8 z-20 flex gap-4">
             <button onClick={() => setShowSidebar(!showSidebar)} className="p-4 bg-white/95 dark:bg-gray-900/95 rounded-2xl shadow-xl text-blue-600 border border-blue-50 transition-all hover:scale-105 active:scale-95 focus:outline-none"><Users size={22} /></button>
             {visibleMissionId && <button onClick={handleResetMission} className="p-4 bg-rose-600 rounded-2xl shadow-xl text-white font-black transition-all hover:bg-rose-700 active:scale-95 focus:outline-none shadow-rose-500/30 animate-in zoom-in-50 duration-300"><EyeOff size={22} /></button>}
          </div>

          {isLoaded ? (
            <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={15} onLoad={setMap} options={{ disableDefaultUI: true, zoomControl: true, styles: [{ featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] }] }}>
              <ActiveMissionLayer 
                missionId={visibleMissionId} 
                employees={employees} 
                routes={routes} 
                destinations={destinations} 
              />

              {allActiveEmployees.map((emp) => {
                const empIdStr = String(emp.id);
                const pos = animatedPositions[empIdStr] || { lat: emp.lat, lng: emp.lng };
                const isSelectedForMission = String(visibleMissionId) === empIdStr;
                const missionActive = visibleMissionId !== null;
                
                // ISOLATION: When a mission is active, hide EVERYONE ELSE except the selected agent
                if (missionActive && !isSelectedForMission) return null;
                
                return (
                  <OverlayViewF key={`agent-v-p-${empIdStr}`} position={pos} mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET} zIndex={isSelectedForMission ? 1050 : 1000}>
                    <div style={{ transform: 'translate(-50%, -100%)' }} className="cursor-pointer relative transform transition-transform duration-300 hover:scale-110">
                      {String(detailEmpId) === empIdStr && <EmployeeDetailCard employee={emp} currentPos={pos} onClose={() => setDetailEmpId(null)} onToggleMission={() => handleToggleMission(empIdStr)} isVisible={isSelectedForMission} />}
                      <EmployeeAvatar onClick={() => handleAvatarClick(empIdStr)} />
                      <div className={`mt-2 bg-slate-900 border border-white/20 text-white px-3 py-1 rounded-xl shadow-2xl text-[8px] font-black text-center uppercase tracking-widest transition-all ${isSelectedForMission ? 'ring-2 ring-blue-500 scale-110' : ''}`}>{emp.name.split(' ')[0]}</div>
                    </div>
                  </OverlayViewF>
                );
              })}
            </GoogleMap>
          ) : <div className="w-full h-full flex items-center justify-center bg-gray-50 dark:bg-gray-950"><Loader2 className="animate-spin text-blue-600" size={64} /></div>}
        </div>
      </div>
    </div>
  );
};

export default LiveTracking;
