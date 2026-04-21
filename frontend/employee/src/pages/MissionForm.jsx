import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import {
  Camera, MapPin, CheckCircle2, Store, User, Phone,
  Target, Send, AlertCircle, Clock, ShoppingBag,
  ShoppingCart, Briefcase, Building2, Info, CheckCircle,
  ChevronRight, Check, Smartphone, ShieldCheck, X, Image as ImageIcon, Maximize2
} from 'lucide-react';
import Button from '../components/ui/Button';
import { useDialog } from '../context/DialogContext';
import storage from '../utils/storage';
import apiClient, { getApiBaseUrl } from '../services/apiClient';
import { getVisits, createVisit } from '../services/visitService';

// High-Fidelity Image Modal (Internal to main component)
const ImageModal = ({ src, onClose }) => {
  if (!src) return null;
  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center p-2 sm:p-4 bg-gray-950/95 backdrop-blur-2xl animate-in fade-in duration-300"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-8 right-8 p-4 bg-white/10 hover:bg-white/20 text-white rounded-3xl transition-all z-[310]"
      >
        <X size={32} />
      </button>
      <div className="relative max-w-5xl w-full h-full flex items-center justify-center p-4 md:p-12 animate-in zoom-in-95 duration-500">
        <img
          src={src}
          alt="Evidence Detail"
          className="max-w-full max-h-full object-contain rounded-2xl md:rounded-[3rem] shadow-[0_32px_128px_rgba(0,0,0,0.5)] border-2 md:border-4 border-white/10"
          onClick={(e) => e.stopPropagation()}
        />
        <div className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 px-5 sm:px-8 py-3 sm:py-4 bg-white/10 backdrop-blur-3xl rounded-2xl sm:rounded-3xl border border-white/20 shadow-2xl flex items-center gap-3 sm:gap-4 w-[90%] sm:w-auto">
          <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white">
            <ShieldCheck size={20} />
          </div>
          <div>
            <p className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Security-Encrypted Asset</p>
            <p className="text-[8px] font-bold text-gray-300 uppercase tracking-widest mt-0.5">Verified Intelligence Proof</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const MissionForm = ({ isEmbedded = false, type: initialType = 'mission' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { showAlert } = useDialog();
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [gpsLoading, setGpsLoading] = useState(false);

  // Interactive Type State (Tabs)
  const [activeType, setActiveType] = useState(initialType);

  // UI Unified Standard Classes (Compact & Responsive Version)
  const auditContainerCls = `bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-2xl md:rounded-[2rem] shadow-[0_16px_64px_-16px_rgba(0,0,0,0.1)] relative overflow-hidden transition-all duration-700`;
  const auditSectionCls = `p-5 md:p-8 relative border-b border-gray-50 dark:border-gray-900/50 last:border-0 hover:bg-gray-50/20 dark:hover:bg-white/[0.01] transition-colors duration-500`;
  const inputContainer = `flex flex-col gap-1.5`;
  const labelCls = `text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-[0.15em] ml-1`;
  const inputFieldC = `w-full bg-gray-50/50 dark:bg-gray-900/50 border-2 border-gray-100 dark:border-gray-800 rounded-2xl px-5 py-3.5 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none text-gray-900 dark:text-white font-bold text-sm placeholder:text-gray-400 dark:placeholder:text-gray-600`;
  const auditStepCircle = `w-12 h-12 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-gray-950 flex items-center justify-center font-black text-xs shadow-lg shrink-0 transition-transform group-hover/section:scale-110 duration-500`;

  // Type-specific configurations
  const TYPE_CONFIG = {
    mission: {
      id: 'mission',
      color: 'indigo',
      icon: Target,
      label: 'Mission',
      identityLabel: 'Store Name',
      contactLabel: 'Owner Name',
    },
    store: {
      id: 'store',
      color: 'indigo',
      icon: Store,
      label: 'Store Visit',
      identityLabel: 'Store Name',
      contactLabel: 'Owner Name',
    },
    supplier: {
      id: 'supplier',
      color: 'indigo',
      icon: Building2,
      label: 'Supplier',
      identityLabel: 'Supplier Name',
      contactLabel: 'Owner Name',
    },
    collab: {
      id: 'collab',
      color: 'indigo',
      icon: Briefcase,
      label: 'Collab',
      identityLabel: 'Organization Name',
      contactLabel: 'Representative',
    },
    app: {
      id: 'app',
      color: 'indigo',
      icon: ShieldCheck,
      label: 'Installs',
      identityLabel: 'Store/Client Name',
      contactLabel: 'Contact Person',
    },
  };

  const config = TYPE_CONFIG[activeType] || TYPE_CONFIG.mission;

  const [formData, setFormData] = useState({
    visitType: activeType,
    taskId: '',
    storeName: '',
    ownerName: '',
    mobileNumber: '',
    gst: '',
    productCategory: '',
    address: '',
    pinCode: '',
    city: '',
    state: '',
    latitude: null,
    longitude: null,
    classification: '',
    opportunityValue: '',
    monthlyVolume: '',
    targetFocus: '',
    interestLevel: '',
    monthlyPurchase: '',
    interestedProducts: '',
    installedAppName: '',
    accuracy: null,
    battery: null,
    appInstalled: false,
    appTraining: false,
    orderPlaced: false,
    appDownloaded: false,
    accountCreated: false,
    testTransaction: false,
    status: '',
    notInterestedReason: '',
    rejectionPrice: '',
    competitorName: '',
    absentAction: '',
    followUpDate: '',
    followUpNotes: '',
    storeFront: null,
    boardInfo: null,
    ownerPhoto: null,
    selfieCheck: null,
    appInstallation: {
      status: null,
      noReason: '',
      otherReason: '',
      registration: { status: null, reason: '', feedback: '' },
      training: { status: null, reason: '', feedback: '' },
      firstOrder: { status: null, reason: '', feedback: '' }
    }
  });

  // Sync formData with Tab switching and URL updates
  const handleTypeChange = (typeId) => {
    setActiveType(typeId);
    navigate(`?type=${typeId}`, { replace: true });
  };

  useEffect(() => {
    setFormData(prev => ({ ...prev, visitType: activeType }));
  }, [activeType]);

  // Handle browser back/forward and searchParams changes
  useEffect(() => {
    const qType = searchParams.get('type');
    if (qType && TYPE_CONFIG[qType] && qType !== activeType) {
      setActiveType(qType);
    }
  }, [searchParams, activeType]);

  // Assignment Link Auto-Hydration & Draft Recovery
  useEffect(() => {
    const qTaskId = searchParams.get('taskId');
    const qStoreName = searchParams.get('storeName');
    const qType = searchParams.get('type');
    const qReturn = searchParams.get('orderReturn'); // Signal that we just came back from logging an order

    // 1. Try to load draft from localStorage
    const savedDraft = localStorage.getItem('mission_draft');
    if (savedDraft) {
      try {
        const draftData = JSON.parse(savedDraft);
        setFormData(prev => ({ ...prev, ...draftData }));

        // If we're returning from a successful order submission, auto-check the milestone
        if (qReturn === 'true') {
          setFormData(prev => ({ ...prev, ...draftData, orderPlaced: true }));
          showAlert('Order Logged', 'Commercial commitment has been verified.', 'success');
        }
      } catch (e) {
        console.error('Draft recovery failed', e);
      }
    }

    // 2. Query Param Overrides (Assignments)
    if (qTaskId || qStoreName) {
      setFormData(prev => ({
        ...prev,
        taskId: qTaskId || prev.taskId,
        storeName: qStoreName || prev.storeName,
        visitType: qType || prev.visitType
      }));
      if (qType && TYPE_CONFIG[qType]) {
        setActiveType(qType);
      }
    }
  }, [searchParams]);

  // Duty Status Verification & Auto-GPS
  useEffect(() => {
    const isTracking = storage.getUser()?.isTracking;

    if (!isTracking) {
      (async () => {
        await showAlert('Please turn on location from the dashboard to start logging visits.', 'Duty Off', 'error');
        navigate('/employee/dashboard');
      })();
    }

    if (!formData.latitude && !formData.longitude && !gpsLoading) {
      // PREFER DASHBOARD TELEMETRY FOR "REFLECTION"
      const lastTelemetryRaw = localStorage.getItem('last_telemetry');
      if (isTracking && lastTelemetryRaw) {
        try {
          const telemetry = JSON.parse(lastTelemetryRaw);
          const timeDiff = Date.now() - new Date(telemetry.timestamp).getTime();

          // Use telemetry if it's less than 5 minutes old
          if (timeDiff < 5 * 60 * 1000) {
            setFormData(prev => ({
              ...prev,
              latitude: telemetry.latitude,
              longitude: telemetry.longitude,
              accuracy: telemetry.accuracy,
              battery: telemetry.battery
            }));

            // ALSO FETCH ADDRESS FOR THE REFLECTED DATA
            handleReverseGeocode(telemetry.latitude, telemetry.longitude);
            return; // Skip active capture if we have good telemetry
          }
        } catch (e) {
          console.error('Failed to parse telemetry', e);
        }
      }

      if (isTracking) {
        handleCaptureLocation();
      }
    }
  }, []);

  // Auto-Save Draft
  useEffect(() => {
    // We don't save the photos to localStorage to avoid QuotaExceededError
    // because localStorage max size is ~5MB
    const { storeFront, boardInfo, ownerPhoto, selfieCheck, ...serializableData } = formData;
    localStorage.setItem('mission_draft', JSON.stringify(serializableData));
  }, [formData]);

  const handleChange = (e) => {
    const { name, value, type: inputType, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: inputType === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e, assetId) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // COMPRESS IMAGE TO PREVENT PAYLOAD/NETWORK CRASHES
        const img = new Image();
        img.src = reader.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Compress to WebP or JPEG heavily (0.6 is plenty for audit proof)
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.6);
          setFormData(prev => ({ ...prev, [assetId]: compressedDataUrl }));
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReverseGeocode = async (lat, lon) => {
    setGpsLoading(true);
    try {
      // PROXY VIA BACKEND TO AVOID CORS POLICY BLOCKS
      const appApiUrl = getApiBaseUrl();
      const response = await fetch(`${appApiUrl}/reatchall/public/geocoding/reverse?lat=${lat}&lon=${lon}`);
      
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      if (data && data.address) {
        const { address } = data;
        setFormData(prev => ({
          ...prev,
          address: data.display_name || '',
          city: address.city || address.town || address.village || '',
          state: address.state || '',
          pinCode: address.postcode || ''
        }));
      }
    } catch (error) {
      console.error('Reverse geocode failed', error);
    } finally {
      setGpsLoading(false);
    }
  };

  const handleCaptureLocation = () => {
    const isTracking = storage.getUser()?.isTracking;
    if (!isTracking) {
      (async () => {
        await showAlert('Please turn on location from the dashboard.', 'Error', 'error');
        navigate('/employee/dashboard');
      })();
      return;
    }

    setGpsLoading(true);
    if (!navigator.geolocation) {
      showAlert('Error', 'Geolocation is not supported', 'error');
      setGpsLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        let battery = null;
        try {
          if (navigator.getBattery) {
            const batteryInfo = await navigator.getBattery();
            battery = Math.round(batteryInfo.level * 100);
          }
        } catch (e) { }

        setFormData(prev => ({ ...prev, latitude, longitude, accuracy, battery }));
        handleReverseGeocode(latitude, longitude);
      },
      () => {
        showAlert('Error', 'GPS Denied', 'error');
        setGpsLoading(false);
      },
      { enableHighAccuracy: true }
    );
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const isTracking = storage.getUser()?.isTracking;
    if (!isTracking) {
      (async () => {
        await showAlert('Submission denied. Duty must be ON to log visits.', 'Security Block', 'error');
        navigate('/employee/dashboard');
      })();
      return;
    }

    setLoading(true);

    // Asset Validation (Store photo and Selfie are mandatory)
    const requiredPhotos = [
      { id: 'storeFront', label: 'Store Photo' },
      { id: 'selfieCheck', label: 'Selfie' }
    ];

    for (const photo of requiredPhotos) {
      if (!formData[photo.id]) {
        showAlert('Photo Required', `${photo.label} is mandatory for this activity.`, 'warning');
        setLoading(false);
        return;
      }
    }

    try {
      // Duplicate prevention (By name today)
      const existingVisits = await getVisits(true);
      const today = new Date().toISOString().split('T')[0];
      const isDuplicate = existingVisits.some(v =>
        v.storeName?.toLowerCase().trim() === formData.storeName.toLowerCase().trim() &&
        new Date(v.createdAt || v.timestamp).toISOString().split('T')[0] === today &&
        v.visitType === activeType
      );

      if (isDuplicate) {
        showAlert('Duplicate', 'This log already exists for today.', 'error');
        setLoading(false);
        return;
      }

      // SANITIZE PAYLOAD
      const {
        storeFront, boardInfo, ownerPhoto, selfieCheck,
        latitude, longitude, accuracy, battery,
        appDownloaded, appTraining, orderPlaced,
        ...sanitizedData
      } = formData;

      await createVisit({
        ...sanitizedData,
        gps: { lat: formData.latitude, lng: formData.longitude },
        milestones: {
          initialCheck: formData.appDownloaded,
          knowledgeShared: formData.appTraining,
          orderLogged: formData.orderPlaced
        },
        photos: [storeFront, boardInfo, ownerPhoto, selfieCheck].filter(p => p)
      });

      showAlert('Success', 'Activity recorded successfully.', 'success');
      navigate('/employee/visits');
    } catch (err) {
      console.error('Submit Error:', err);
      showAlert('Transmission Error', err?.response?.data?.message || 'Payload too large or network error. Please try uploading smaller images or fewer images.', 'error');
    } finally {
      setLoading(false);
    }
  };


  // Custom Selection Component
  const PremiumSelect = ({ label, isRequired = false, options, value, onChange, icon: Icon, activeColor = config.color }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div className="relative">
        <label className={`${labelCls} text-${activeColor}-500 border-${activeColor}-100 dark:border-${activeColor}-900/50`}>
          {label} {isRequired && <span className="text-red-500 ml-0.5">*</span>}
        </label>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center justify-between bg-gray-50/50 dark:bg-gray-900/50 border-2 border-gray-100 dark:border-gray-800 rounded-[1.25rem] px-6 py-4 transition-all outline-none
            ${isOpen ? `ring-4 ring-${activeColor}-500/10 border-${activeColor}-500` : `hover:border-gray-200 dark:hover:border-gray-700`}`}
        >
          <div className="flex items-center gap-3">
            {Icon && <Icon size={18} className={value ? `text-${activeColor}-500` : "text-gray-400"} />}
            <span className={value ? "text-gray-900 dark:text-white font-bold text-sm" : "text-gray-400 dark:text-gray-600 font-bold text-sm"}>
              {value || `Select ${label}...`}
            </span>
          </div>
          <ChevronRight size={18} className={`text-gray-300 transition-transform duration-500 shrink-0 ${isOpen ? 'rotate-90 text-indigo-500' : ''}`} />
        </button>

        {isOpen && (
          <>
            <div className="fixed inset-0 z-[100]" onClick={() => setIsOpen(false)} />
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 rounded-2xl shadow-2xl z-[110] overflow-hidden animate-in fade-in slide-in-from-top-2">
              <div className="max-h-60 overflow-y-auto">
                {options.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => { onChange(opt); setIsOpen(false); }}
                    className={`w-full text-left px-5 py-4 text-sm font-bold flex items-center justify-between transition-colors
                      ${value === opt ? `bg-${activeColor}-50 dark:bg-${activeColor}-500/10 text-${activeColor}-600` : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                  >
                    {opt}
                    {value === opt && <Check size={16} />}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    );
  };


  return (
    <>
      <div className={`relative min-h-screen ${isEmbedded ? "w-full" : "max-w-4xl mx-auto py-4 sm:py-8 px-3 sm:px-6"}`}>
        {/* BACKGROUND AMBIENCE */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
          <div className="absolute top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-500/5 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-[10%] -right-[10%] w-[30%] h-[30%] bg-purple-500/5 blur-[100px] rounded-full" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] dark:opacity-[0.05]" />
        </div>

        <div className={isEmbedded ? "w-full" : "space-y-6"}>
          
          {/* MISSION SELEKTOR (Minimized Control) - Single Line with Optimized Spacing */}
          <div className="flex flex-nowrap items-center gap-3 sm:gap-4 max-w-full overflow-x-auto pb-4 no-scrollbar scroll-smooth">
            {Object.values(TYPE_CONFIG).map((t) => {
              const isActive = activeType === t.id;
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => handleTypeChange(t.id)}
                  className={`flex items-center gap-3 px-7 py-4 rounded-[1.80rem] transition-all duration-500 font-black text-[11px] uppercase tracking-[0.2em] border shadow-sm shrink-0 whitespace-nowrap
                    ${isActive 
                      ? `bg-indigo-600 text-white border-indigo-500 shadow-xl shadow-indigo-500/20 scale-105` 
                      : `bg-white dark:bg-gray-950 text-gray-400 border-gray-100 dark:border-gray-800 hover:text-gray-600 dark:hover:text-gray-200 hover:border-gray-200`}`}
                >
                  <Icon size={18} strokeWidth={isActive ? 3 : 2} />
                  {t.label}
                </button>
              );
            })}
          </div>

          {/* COMMAND PULSE HEADER: Live Intel + Security Status (Removed Black Background) */}
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl md:rounded-[2.5rem] p-5 sm:p-6 md:p-8 text-gray-900 dark:text-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] relative overflow-hidden group">
            {/* Subtle Intelligence Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -mr-32 -mt-32" />
            <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-500" />
            
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="flex items-center gap-4 sm:gap-6">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl sm:rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-inner shrink-0 border border-indigo-100 dark:border-indigo-900/20">
                  <MapPin size={24} sm:size={28} strokeWidth={2.5} className="animate-bounce" />
                </div>
                <div>
                  <h1 className="text-[9px] font-black uppercase tracking-[0.4em] text-indigo-600 dark:text-indigo-400 mb-1 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-ping" />
                    Live Intelligence
                  </h1>
                  {gpsLoading ? (
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 border-2 border-white dark:border-gray-950 border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs font-black uppercase tracking-widest opacity-60">Synchronizing Geo-Pulse...</span>
                    </div>
                  ) : (
                    <p className="text-sm sm:text-base md:text-lg font-black leading-tight max-w-xl">
                      {formData.address || 'Waiting for high-fidelity geodata...'}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-row md:flex-col items-center md:items-end gap-2 shrink-0">
                 <div className="px-3 sm:px-5 py-1.5 sm:py-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg sm:rounded-xl border border-indigo-100 dark:border-indigo-900/20 flex items-center gap-2 backdrop-blur-xl">
                    <ShieldCheck size={14} sm:size={18} className="text-indigo-600" />
                    <span className="text-[8px] sm:text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.1em] sm:tracking-[0.25em]">Audit-Secure</span>
                 </div>
                 <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-emerald-500/10 rounded-md sm:rounded-lg border border-emerald-500/20">
                    <div className="w-1 sm:w-1.5 h-1 sm:h-1.5 bg-emerald-500 rounded-full" />
                    <span className="text-[7px] sm:text-[8px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Active Audit</span>
                 </div>
              </div>
            </div>
          </div>

          {/* UNIFIED AUDIT DOCUMENT */}
          <div className={auditContainerCls}>
            <form onSubmit={handleSubmit}>
              
              {/* 01: IDENTITY SECTION */}
              <section className={`${auditSectionCls} group/section`}>
                <div className="flex items-start justify-between mb-8">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-inner">
                      <User size={28} strokeWidth={1.5} />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight uppercase">01 • Identity</h2>
                      <p className="text-[10px] font-black text-indigo-500/60 uppercase tracking-[0.3em] mt-0.5">Core Entity Profile</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className={`md:col-span-2 ${inputContainer}`}>
                    <label className={labelCls}>{config.identityLabel} <span className="text-red-500">*</span></label>
                    <input type="text" name="storeName" value={formData.storeName} onChange={handleChange} required className={inputFieldC} placeholder="Official name" />
                  </div>
                  <div className={inputContainer}>
                    <label className={labelCls}>{config.contactLabel} <span className="text-red-500">*</span></label>
                    <input type="text" name="ownerName" value={formData.ownerName} onChange={handleChange} required className={inputFieldC} placeholder="Key person" />
                  </div>
                  <div className={inputContainer}>
                    <label className={labelCls}>Mobile No. <span className="text-red-500">*</span></label>
                    <div className="flex items-center h-full relative">
                      <span className="absolute left-6 text-sm font-black text-gray-400">+91</span>
                      <input type="tel" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} required className={`${inputFieldC} pl-16`} placeholder="10 digits" />
                    </div>
                  </div>
                  <div className={`md:col-span-2 ${inputContainer}`}>
                    <label className={labelCls}>GST Number (Optional)</label>
                    <input type="text" name="gst" value={formData.gst} onChange={handleChange} className={inputFieldC} placeholder="22AAAAA0000A1Z5" />
                  </div>
                </div>
              </section>

              {/* 02: VERIFICATION SECTION */}
              <section className={`${auditSectionCls} group/section`}>
                <div className="flex items-start justify-between mb-8">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-inner">
                      <ShieldCheck size={28} strokeWidth={1.5} />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight uppercase">02 • Verification</h2>
                      <p className="text-[10px] font-black text-emerald-500/60 uppercase tracking-[0.3em] mt-0.5">Installation details</p>
                    </div>
                  </div>
                </div>
                
                <div className="max-w-2xl">
                   <PremiumSelect 
                      label="Classification" 
                      isRequired={true}
                      options={['Retail', 'Wholesale', 'Distributor', 'Kirana', 'Supermarket', 'Horeca', 'Bakery', 'Other']}
                      value={formData.classification}
                      onChange={(val) => setFormData(prev => ({ ...prev, classification: val }))}
                      icon={Store}
                      activeColor="emerald"
                    />
                </div>
              </section>

              {/* 03: MILESTONES SECTION */}
              <section className={`${auditSectionCls} group/section`}>
                <div className="flex items-start justify-between mb-8">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-blue-50 dark:bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-inner">
                      <Smartphone size={28} strokeWidth={1.5} />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight uppercase">03 • Milestones</h2>
                      <p className="text-[10px] font-black text-blue-500/60 uppercase tracking-[0.3em] mt-0.5">Progress check</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-8 max-w-2xl">
                  <PremiumSelect 
                    label="App installation ?" 
                    isRequired={true}
                    options={['Yes', 'No']}
                    value={formData.appInstallation.status}
                    onChange={(val) => setFormData(prev => ({ ...prev, appInstallation: { ...prev.appInstallation, status: val } }))}
                    icon={Smartphone}
                    activeColor="blue"
                  />
                  
                  {formData.appInstallation.status === 'No' && (
                    <div className="pl-8 border-l-4 border-indigo-500/20 space-y-6 animate-in slide-in-from-left-4 duration-500">
                      <PremiumSelect 
                        label="Reason for not installing" 
                        options={['Got error', 'Asked me to come again', 'Decision maker not available', 'Not using smart phone', 'Not interested in online purchase', 'I have credit in the wholesale market', 'Enter any other reason']} 
                        value={formData.appInstallation.noReason} 
                        onChange={(val) => setFormData(prev => ({ ...prev, appInstallation: { ...prev.appInstallation, noReason: val } }))} 
                        icon={AlertCircle}
                        activeColor="indigo"
                      />
                      {formData.appInstallation.noReason === 'Enter any other reason' && (
                         <div className={inputContainer}>
                           <input type="text" value={formData.appInstallation.otherReason} onChange={e => setFormData(prev => ({ ...prev, appInstallation: { ...prev.appInstallation, otherReason: e.target.value } }))} className={inputFieldC} placeholder="Enter reason..." />
                         </div>
                      )}
                    </div>
                  )}

                  {formData.appInstallation.status === 'Yes' && (
                    <div className="pl-8 border-l-4 border-blue-500/20 space-y-8 animate-in slide-in-from-left-4 duration-500">
                      <div className="space-y-4">
                        <PremiumSelect 
                          label="Registration completed ?" 
                          options={['Yes', 'No']}
                          value={formData.appInstallation.registration.status}
                          onChange={(val) => setFormData(prev => ({ ...prev, appInstallation: { ...prev.appInstallation, registration: { ...prev.appInstallation.registration, status: val } } }))}
                          icon={User}
                          activeColor="blue"
                        />
                        {formData.appInstallation.registration.status === 'No' && (
                          <input type="text" value={formData.appInstallation.registration.reason} onChange={e => setFormData(prev => ({ ...prev, appInstallation: { ...prev.appInstallation, registration: { ...prev.appInstallation.registration, reason: e.target.value } } }))} className={inputFieldC} placeholder="Reason for not registering" />
                        )}
                        {formData.appInstallation.registration.status === 'Yes' && (
                          <input type="text" value={formData.appInstallation.registration.feedback} onChange={e => setFormData(prev => ({ ...prev, appInstallation: { ...prev.appInstallation, registration: { ...prev.appInstallation.registration, feedback: e.target.value } } }))} className={inputFieldC} placeholder="Feedback on registration" />
                        )}
                      </div>

                      <div className="space-y-4">
                        <PremiumSelect 
                          label="App training ?" 
                          options={['Yes', 'No']}
                          value={formData.appInstallation.training.status}
                          onChange={(val) => setFormData(prev => ({ ...prev, appInstallation: { ...prev.appInstallation, training: { ...prev.appInstallation.training, status: val } } }))}
                          icon={Info}
                          activeColor="blue"
                        />
                        {formData.appInstallation.training.status === 'No' && (
                          <input type="text" value={formData.appInstallation.training.reason} onChange={e => setFormData(prev => ({ ...prev, appInstallation: { ...prev.appInstallation, training: { ...prev.appInstallation.training, reason: e.target.value } } }))} className={inputFieldC} placeholder="Reason for not training" />
                        )}
                        {formData.appInstallation.training.status === 'Yes' && (
                          <input type="text" value={formData.appInstallation.training.feedback} onChange={e => setFormData(prev => ({ ...prev, appInstallation: { ...prev.appInstallation, training: { ...prev.appInstallation.training, feedback: e.target.value } } }))} className={inputFieldC} placeholder="Feedback on training" />
                        )}
                      </div>

                      <div className="space-y-4">
                        <PremiumSelect 
                          label="First Order placed ?" 
                          options={['Yes', 'No']}
                          value={formData.appInstallation.firstOrder.status}
                          onChange={(val) => setFormData(prev => ({ ...prev, appInstallation: { ...prev.appInstallation, firstOrder: { ...prev.appInstallation.firstOrder, status: val } } }))}
                          icon={ShoppingBag}
                          activeColor="blue"
                        />
                        {formData.appInstallation.firstOrder.status === 'No' && (
                          <input type="text" value={formData.appInstallation.firstOrder.reason} onChange={e => setFormData(prev => ({ ...prev, appInstallation: { ...prev.appInstallation, firstOrder: { ...prev.appInstallation.firstOrder, reason: e.target.value } } }))} className={inputFieldC} placeholder="Reason for not ordering" />
                        )}
                        {formData.appInstallation.firstOrder.status === 'Yes' && (
                          <input type="text" value={formData.appInstallation.firstOrder.feedback} onChange={e => setFormData(prev => ({ ...prev, appInstallation: { ...prev.appInstallation, firstOrder: { ...prev.appInstallation.firstOrder, feedback: e.target.value } } }))} className={inputFieldC} placeholder="Feedback on first order" />
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {/* 04: AUDIT OUTCOME SECTION */}
              <section className={`${auditSectionCls} group/section`}>
                <div className="flex items-start justify-between mb-8">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-purple-50 dark:bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-600 dark:text-purple-400 shadow-inner">
                      <Target size={28} strokeWidth={1.5} />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight uppercase">04 • Audit Outcome</h2>
                      <p className="text-[10px] font-black text-purple-500/60 uppercase tracking-[0.3em] mt-0.5">Final intelligence</p>
                    </div>
                  </div>
                </div>
                
                {previewImage && <ImageModal src={previewImage} onClose={() => setPreviewImage(null)} />}

                <div className="space-y-8">
                  <div className="max-w-xl">
                    <PremiumSelect 
                      label="Final Status" 
                      isRequired={true}
                      options={['Completed', 'Partially Completed (App installation is done)', 'Interested', 'Need Follow-up', 'Rejected']}
                      value={formData.status}
                      onChange={(val) => setFormData(prev => ({ ...prev, status: val }))}
                      icon={CheckCircle}
                      activeColor="purple"
                    />
                  </div>

                  {/* GEOTAGGED PROOF GALLERY */}
                  <div className="pt-12 border-t border-gray-100 dark:border-gray-900/50">
                    <div className="flex items-center justify-between mb-10">
                      <div>
                        <h4 className="text-sm font-black uppercase tracking-[0.25em] text-gray-900 dark:text-white">Security-Encrypted Evidence</h4>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-1.5">Geotagged Proof Gallery</p>
                      </div>
                      <div className="px-5 py-2.5 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 flex items-center gap-3 backdrop-blur-xl">
                         <ShieldCheck size={16} className="text-emerald-500" />
                         <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest leading-none">Secured</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                      {[
                        { id: 'storeFront', label: 'Store Front', icon: Store, required: true },
                        { id: 'boardInfo', label: 'Signage', icon: ImageIcon },
                        { id: 'ownerPhoto', label: 'Presence', icon: User },
                        { id: 'selfieCheck', label: 'Selfie', icon: Camera, required: true }
                      ].map((asset) => (
                        <div key={asset.id} className="relative group/asset">
                          <div
                            onClick={() => formData[asset.id] ? setPreviewImage(formData[asset.id]) : document.getElementById(`file-${asset.id}`).click()}
                            className={`w-full aspect-[4/5] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-3 transition-all duration-500 overflow-hidden relative cursor-pointer
                              ${formData[asset.id] ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/5' : 'border-gray-100 dark:border-gray-800 hover:border-indigo-500 bg-gray-50/30 dark:bg-white/[0.02] hover:bg-indigo-50/30'}`}
                          >
                            {formData[asset.id] ? (
                              <>
                                <img src={formData[asset.id]} alt="captured" className="w-full h-full object-cover transition-transform duration-700 group-hover/asset:scale-110" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/asset:opacity-100 transition-opacity flex items-center justify-center">
                                   <Maximize2 size={20} className="text-white" />
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="p-3 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 transition-transform group-hover/asset:scale-110">
                                  <asset.icon size={20} className="text-gray-400 group-hover/asset:text-indigo-500" />
                                </div>
                                <span className="text-[9px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest text-center px-4">
                                  {asset.label}
                                  {asset.required && <span className="text-red-500 ml-1">*</span>}
                                </span>
                              </>
                            )}
                          </div>
                          <input id={`file-${asset.id}`} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => handleFileChange(e, asset.id)} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* MISSION SUBMISSION FOOTER */}
              <div className="bg-gray-50/50 dark:bg-white/[0.02] p-6 sm:p-8 md:p-10 border-t border-gray-100 dark:border-gray-900/50 flex flex-col items-center justify-center gap-6">
                <button 
                  type="submit" 
                  disabled={loading} 
                  className={`group relative flex items-center justify-center gap-4 w-full sm:w-[350px] py-5 px-8 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-gray-950 font-black tracking-[0.25em] text-lg shadow-[0_10px_40px_rgba(0,0,0,0.15)] active:scale-95 transition-all duration-500 border-2 border-white dark:border-gray-900 overflow-hidden`}
                >
                  <div className={`absolute inset-0 bg-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  <span className="relative z-10 uppercase">{loading ? 'Transmitting...' : 'Submit Activity'}</span>
                  {!loading && <Send size={24} className="relative z-10 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-500" />}
                </button>
                
                <div className="flex flex-col items-center gap-3">
                  <div className="flex items-center gap-3 px-6 py-2.5 bg-indigo-500/10 rounded-full border border-indigo-500/20">
                     <ShieldCheck size={16} className="text-indigo-500" /> 
                     <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em]">Secure Cloud Trans</span>
                  </div>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em] text-center max-w-[300px]">
                    Intelligence data encrypted with AES-256 for audit integrity policy.
                  </p>
                </div>
              </div>

            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default MissionForm;
