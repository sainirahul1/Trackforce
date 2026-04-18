import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { 
  Camera, MapPin, CheckCircle2, Store, User, Phone, 
  Target, Send, AlertCircle, Clock, ShoppingBag, 
  ShoppingCart, Briefcase, Building2, Info, CheckCircle,
  ChevronRight, Check, Smartphone, ShieldCheck, X
} from 'lucide-react';
import Button from '../components/ui/Button';
import { useDialog } from '../context/DialogContext';
import { getVisits, createVisit } from '../services/visitService';

// High-Fidelity Image Modal (Internal to main component)
const ImageModal = ({ src, onClose }) => {
  if (!src) return null;
  return (
    <div 
      className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-gray-950/90 backdrop-blur-2xl animate-in fade-in duration-300"
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
          className="max-w-full max-h-full object-contain rounded-[3rem] shadow-[0_32px_128px_rgba(0,0,0,0.5)] border-4 border-white/10"
          onClick={(e) => e.stopPropagation()} 
        />
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 px-8 py-4 bg-white/10 backdrop-blur-3xl rounded-3xl border border-white/20 shadow-2xl flex items-center gap-4">
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

const MissionForm = ({ isEmbedded = false, type = 'mission' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { showAlert } = useDialog();
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [gpsLoading, setGpsLoading] = useState(false);

  // Type-specific configurations - THE PREMIUM ENGINE
  // Type-specific configurations
  const TYPE_CONFIG = {
    mission: {
      color: 'indigo',
      icon: Target,
      identityLabel: 'Store Name',
      contactLabel: 'Owner Name',
      opsHeading: 'Operations',
      opsSub: 'Business profiling',
      milestoneHeading: 'Milestones',
      milestoneSub: 'Progress check',
      initialStatus: '',
    },
    store: {
      color: 'indigo',
      icon: Store,
      identityLabel: 'Store Name',
      contactLabel: 'Owner Name',
      opsHeading: 'Operations',
      opsSub: 'Business profiling',
      milestoneHeading: 'Milestones',
      milestoneSub: 'Progress check',
      initialStatus: '',
    },
    supplier: {
      color: 'indigo',
      icon: Building2,
      identityLabel: 'Supplier Name',
      contactLabel: 'Owner Name',
      opsHeading: 'Operations',
      opsSub: 'Business profiling',
      milestoneHeading: 'Milestones',
      milestoneSub: 'Progress check',
      initialStatus: '',
    },
    collab: {
      color: 'indigo',
      icon: Briefcase,
      identityLabel: 'Organizaton Name',
      contactLabel: 'Representative',
      opsHeading: 'Geography',
      opsSub: 'Verified coordinates',
      milestoneHeading: 'Partnership',
      milestoneSub: 'Alignment check',
      initialStatus: '',
    },
    app: {
      color: 'indigo',
      icon: ShieldCheck,
      identityLabel: 'Store/Client Name',
      contactLabel: 'Contact Person',
      opsHeading: 'Verification',
      opsSub: 'Installation details',
      milestoneHeading: 'Milestones',
      milestoneSub: 'Deal progress',
      initialStatus: '',
    },
  };

  const config = TYPE_CONFIG[type] || TYPE_CONFIG.mission;

  const [formData, setFormData] = useState({
    visitType: type,
    taskId: '', // Added for mission tracking
    // Identity
    storeName: '', 
    ownerName: '', 
    mobileNumber: '', 
    gst: '', // Store specific
    productCategory: '', // Supplier specific
    // Geography
    address: '', 
    pinCode: '', 
    city: '', 
    state: '', 
    latitude: null, 
    longitude: null,
    // Operations
    classification: '', 
    estMonthlyVolume: '', 
    targetProducts: '',
    collaborationType: '', // Collab specific
    opportunityValue: '', // Collab specific
    monthlyVolume: '',
    targetFocus: '',
    interestLevel: '', // Supplier specific
    monthlyPurchase: '', // Store specific
    interestedProducts: '',
    installedAppName: '', // App specific
    // Metadata
    accuracy: null,
    battery: null,
    // Step 3/4 Checkboxes
    appInstalled: false,
    appTraining: false,
    resDone: false,
    orderPlaced: false,
    appDownloaded: false,
    accountCreated: false,
    testTransaction: false,
    // Outcome
    status: '',
    notInterestedReason: '',
    rejectionPrice: '',
    competitorName: '',
    absentAction: '', // 'reschedule' or 'cancel'
    followUpDate: '',
    followUpNotes: '',
    // Photos
    storeFront: null,
    boardInfo: null,
    ownerPhoto: null,
    selfieCheck: null,
  });

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
    }
  }, [searchParams]);

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

  const handleCaptureLocation = () => {
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
        } catch (e) {}

        setFormData(prev => ({ ...prev, latitude, longitude, accuracy, battery }));
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`);
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
            showAlert('Success', 'GPS Verified', 'success');
          }
        } catch (error) {
          showAlert('Info', 'GPS Captured (Map lookup failed)', 'info');
        } finally {
          setGpsLoading(false);
        }
      },
      () => {
        showAlert('Error', 'GPS Denied', 'error');
        setGpsLoading(false);
      },
      { enableHighAccuracy: true }
    );
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData(prev => ({ ...prev, [field]: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Asset Validation (as per specific requirements)
    const requiredPhotos = [
      { id: 'storeFront', label: 'Front View' },
      { id: 'boardInfo', label: 'Signage/Board' },
      { id: 'selfieCheck', label: 'Selfie Proof' }
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
        v.visitType === type
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
      showAlert('Error', 'Transmission failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // UI Standard Classes
  // UI Standard Classes
  const sectionCls = "bg-white dark:bg-gray-900 rounded-[2.5rem] p-6 sm:p-10 shadow-xl shadow-gray-200/40 dark:shadow-none border border-gray-100 dark:border-gray-800 relative group mb-12 transition-all duration-500 hover:shadow-indigo-500/10 hover:border-indigo-100 dark:hover:border-indigo-900/50";
  const inputContainer = `group relative bg-gray-50/50 dark:bg-gray-800/30 rounded-2xl border-2 border-gray-100/80 dark:border-gray-700/40 focus-within:bg-white dark:focus-within:bg-gray-950 focus-within:border-${config.color}-400 focus-within:ring-4 focus-within:ring-${config.color}-500/10 transition-all duration-500 shadow-sm`;
  const labelCls = `absolute text-[10px] uppercase font-black tracking-[0.2em] bg-white dark:bg-gray-950 px-2.5 py-0.5 -top-2.5 left-5 z-10 transition-all duration-300 pointer-events-none rounded-lg border border-gray-100 dark:border-gray-800 shadow-sm text-gray-400 group-focus-within:text-${config.color}-500 group-focus-within:border-${config.color}-400`;
  const inputFieldC = "block w-full py-4 px-5 bg-transparent border-none focus:ring-0 text-base font-bold text-gray-900 dark:text-gray-100 placeholder:text-gray-300 dark:placeholder:text-gray-600 outline-none transition-colors";
  const stepCircle = `w-10 h-10 rounded-full flex items-center justify-center font-black shadow-xl text-sm bg-${config.color}-600 text-white transform -translate-y-2`;

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
          className={`${inputContainer} w-full flex items-center justify-between py-4 px-5 text-base font-bold transition-all focus-within:ring-${activeColor}-500/10 focus-within:border-${activeColor}-400`}
        >
          <div className="flex items-center gap-3">
            {Icon && <Icon size={18} className="text-gray-400 group-focus-within:text-indigo-500 transition-colors" />}
            <span className={value ? "text-gray-900 dark:text-white" : "text-gray-300 dark:text-gray-600 font-medium"}>{value || `Select ${label}...`}</span>
          </div>
          <ChevronRight size={18} className={`text-gray-300 transition-transform duration-500 ${isOpen ? 'rotate-90 text-indigo-500' : ''}`} />
        </button>

        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
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
    <div className={isEmbedded ? "w-full" : "max-w-4xl mx-auto py-4 px-4 sm:px-6"}>
      {/* MANDATORY WARNING */}
      <div className={`relative overflow-hidden bg-white dark:bg-gray-950 border-2 border-red-500/50 rounded-3xl mb-10 p-5 group transition-all duration-500 hover:border-red-500 shadow-xl shadow-red-500/5`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-3xl -mr-16 -mt-16 animate-pulse" />
        <div className="flex items-center gap-5 relative z-10">
          <div className="w-14 h-14 bg-red-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/40">
            <AlertCircle size={28} strokeWidth={2.5} />
          </div>
          <div>
            <h4 className="text-base font-black text-red-600 uppercase tracking-[0.2em] mb-1">Mandatory Requirement</h4>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-relaxed">
              Fill all fields marked with <span className="text-red-500 font-black">(*)</span> to proceed.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* STEP 1: IDENTITY */}
        <section className={sectionCls}>
          <div className="flex items-center justify-between mb-10 pb-6 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 bg-${config.color}-50 dark:bg-${config.color}-500/10 rounded-2xl flex items-center justify-center text-${config.color}-600 dark:text-${config.color}-400 shadow-inner`}>
                <config.icon size={26} strokeWidth={1.5} />
              </div>
              <div>
                <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight uppercase">01. Identity</h2>
                <p className={`text-[10px] font-black text-${config.color}-500/60 uppercase tracking-widest`}>Core profile</p>
              </div>
            </div>
            <div className={stepCircle}>01</div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
              <div className="flex items-center h-full">
                <span className={`pl-5 text-base font-black text-${config.color}-500 pr-3 border-r-2 border-gray-100 dark:border-gray-800 h-1/2 flex items-center`}>+91</span>
                <input type="tel" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} required className={inputFieldC} placeholder="10 digits" />
              </div>
            </div>
            
            {/* TYPE SPECIFIC FIELDS */}
            {type === 'store' && (
              <div className={`md:col-span-2 ${inputContainer}`}>
                <label className={labelCls}>GST Number (Optional)</label>
                <input type="text" name="gst" value={formData.gst} onChange={handleChange} className={inputFieldC} placeholder="22AAAAA0000A1Z5" />
              </div>
            )}
            {type === 'supplier' && (
              <div className={`md:col-span-2 ${inputContainer}`}>
                <label className={labelCls}>Product Category</label>
                <input type="text" name="productCategory" value={formData.productCategory} onChange={handleChange} className={inputFieldC} placeholder="FMCG, Electronics, etc." />
              </div>
            )}
            {type === 'collab' && (
              <div className={`md:col-span-2 ${inputContainer}`}>
                <PremiumSelect 
                  label="Type of Collaboration" 
                  options={['Partnership', 'Referral', 'Affiliate', 'Strategic']} 
                  value={formData.collaborationType} 
                  onChange={(val) => setFormData(prev => ({ ...prev, collaborationType: val }))}
                  icon={Briefcase}
                />
              </div>
            )}
          </div>
        </section>

        {/* STEP 2: GEOGRAPHY */}
        <section className={sectionCls}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10 pb-6 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-inner">
                <MapPin size={26} strokeWidth={1.5} />
              </div>
              <div>
                <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight uppercase">02. Geography</h2>
                <p className="text-[10px] font-black text-emerald-500/60 uppercase tracking-widest">Verified coordinates</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button 
                type="button" 
                onClick={handleCaptureLocation} 
                disabled={gpsLoading}
                className={`px-6 py-3 rounded-2xl text-[10px] font-black tracking-widest uppercase shadow-lg transition-all flex items-center gap-2
                  ${formData.latitude ? 'bg-emerald-600 text-white' : 'bg-gray-950 dark:bg-white text-white dark:text-gray-900'}`}
              >
                <Target size={14} className={gpsLoading ? 'animate-spin' : ''} />
                {gpsLoading ? 'Detecting...' : formData.latitude ? 'Captured ✓' : 'Detect GPS'}
              </button>
              <div className={stepCircle}>02</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <div className={`md:col-span-4 ${inputContainer}`}>
              <label className={labelCls}>Field Address <span className="text-red-500">*</span></label>
              <textarea name="address" value={formData.address} onChange={handleChange} required rows={2} className={`${inputFieldC} min-h-[4.5rem]`} placeholder="GPS auto-fill..." />
            </div>
            <div className={inputContainer}><label className={labelCls}>City</label><input type="text" name="city" value={formData.city} onChange={handleChange} className={inputFieldC} /></div>
            <div className={inputContainer}><label className={labelCls}>State</label><input type="text" name="state" value={formData.state} onChange={handleChange} className={inputFieldC} /></div>
            <div className={`md:col-span-2 ${inputContainer}`}><label className={labelCls}>Pin Code</label><input type="text" name="pinCode" value={formData.pinCode} onChange={handleChange} className={inputFieldC} /></div>
          </div>
        </section>

        {/* STEP 3: OPERATIONS */}
        <section className={sectionCls}>
          <div className="flex items-center justify-between mb-10 pb-6 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 bg-${config.color}-50 dark:bg-${config.color}-500/10 rounded-2xl flex items-center justify-center text-${config.color}-600 dark:text-${config.color}-400 shadow-inner`}>
                <Briefcase size={26} strokeWidth={1.5} />
              </div>
              <div>
                <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight uppercase">03. {config.opsHeading}</h2>
                <p className={`text-[10px] font-black text-${config.color}-500/60 uppercase tracking-widest`}>{config.opsSub}</p>
              </div>
            </div>
            <div className={stepCircle}>03</div>
          </div>

          <div className="space-y-6">
            {type === 'store' ? (
              <PremiumSelect 
                label="Classification" 
                options={['Retail', 'Wholesale', 'Distributor', 'Kirana', 'Supermarket', 'Horeca', 'Bakery', 'Other']}
                value={formData.classification}
                onChange={(val) => setFormData(prev => ({ ...prev, classification: val }))}
                icon={Store}
              />
            ) : type === 'collab' ? (
              <>
                <div className={inputContainer}>
                  <label className={labelCls}>Opportunity Value Estimation</label>
                  <div className="flex items-center h-full">
                    <span className={`pl-5 text-base font-black text-${config.color}-600 pr-3 border-r-2 border-gray-100 dark:border-gray-800 h-1/2 flex items-center`}>₹</span>
                    <input type="text" name="opportunityValue" value={formData.opportunityValue} onChange={handleChange} className={inputFieldC} placeholder="e.g. 5,00,000" />
                  </div>
                </div>
                <div className={inputContainer}>
                  <label className={labelCls}>Est. Monthly Volume</label>
                  <input type="text" name="monthlyVolume" value={formData.monthlyVolume} onChange={handleChange} className={inputFieldC} placeholder="Volume / Capacity" />
                </div>
                <div className={inputContainer}>
                  <label className={labelCls}>Target Focus</label>
                  <input type="text" name="targetFocus" value={formData.targetFocus} onChange={handleChange} className={inputFieldC} placeholder="Interests / Products" />
                </div>
              </>
            ) : type === 'supplier' ? (
              <PremiumSelect 
                label="Interest Level" 
                options={['High', 'Medium', 'Low', 'Waitlisted']}
                value={formData.interestLevel}
                onChange={(val) => setFormData(prev => ({ ...prev, interestLevel: val }))}
                icon={Target}
              />
            ) : (
              <PremiumSelect 
                label="Classification" 
                options={['Retail', 'Wholesale', 'Distributor', 'Kirana', 'Supermarket', 'Other']}
                value={formData.classification}
                onChange={(val) => setFormData(prev => ({ ...prev, classification: val }))}
                icon={Briefcase}
              />
            )}
          </div>
        </section>

        {/* STEP 4: MILESTONES */}
        <section className={sectionCls}>
          <div className="flex items-center justify-between mb-10 pb-6 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 bg-${config.color}-50 dark:bg-${config.color}-500/10 rounded-2xl flex items-center justify-center text-${config.color}-600 dark:text-${config.color}-400 shadow-inner`}>
                <CheckCircle2 size={26} strokeWidth={1.5} />
              </div>
              <div>
                <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight uppercase">04. {config.milestoneHeading}</h2>
                <p className={`text-[10px] font-black text-${config.color}-500/60 uppercase tracking-widest`}>{config.milestoneSub}</p>
              </div>
            </div>
            <div className={stepCircle}>04</div>
          </div>

          <div className="space-y-4">
            {type === 'app' && (
              <div className={`${inputContainer} mb-6`}>
                <label className={labelCls}>Which App was Installed? *</label>
                <input type="text" name="installedAppName" value={formData.installedAppName} onChange={handleChange} className={inputFieldC} placeholder="e.g. TrackForce Executive" />
              </div>
            )}
            
            {[
              { 
                id: 'appDownloaded', 
                label: 'Initial Check', 
                icon: Smartphone 
              },
              { 
                id: 'appTraining', 
                label: 'Product Knowledge Shared', 
                icon: Info 
              },
              { 
                id: 'orderPlaced', 
                label: 'Commitment/Order Logged', 
                icon: ShoppingBag,
                showRedirect: true
              }
            ].map((milestone) => (
              <div key={milestone.id} className="space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    if (milestone.id === 'orderPlaced') {
                      showAlert('Action Required', 'You must log a commercial record in the Order Studio to satisfy this milestone.', 'info');
                      return;
                    }
                    setFormData(prev => ({ ...prev, [milestone.id]: !prev[milestone.id] }))
                  }}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all group/item
                    ${formData[milestone.id] 
                      ? 'bg-purple-50 dark:bg-purple-500/10 border-purple-200 dark:border-purple-800/50 shadow-md' 
                      : 'bg-white dark:bg-gray-800/50 border-gray-100 dark:border-gray-800 hover:border-purple-200'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500
                      ${formData[milestone.id] ? 'bg-purple-600 text-white rotate-[360deg]' : 'bg-gray-100 dark:bg-gray-800 text-gray-400 group-hover/item:text-purple-500'}`}>
                      <milestone.icon size={18} />
                    </div>
                    <span className={`text-base font-black uppercase tracking-tight transition-colors ${formData[milestone.id] ? 'text-purple-900 dark:text-purple-200' : 'text-gray-500'}`}>
                      {milestone.label}
                    </span>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-500
                    ${formData[milestone.id] ? 'bg-purple-600 border-purple-600' : 'border-gray-200 dark:border-gray-700'}`}>
                    {formData[milestone.id] && <Check size={14} className="text-white" />}
                  </div>
                </button>
                
                {milestone.showRedirect && !formData[milestone.id] && (
                  <button
                    type="button"
                    onClick={() => {
                      const returnPath = encodeURIComponent(`${location.pathname}${location.search}${location.search ? '&' : '?'}draft=true`);
                      navigate(`/employee/orders?from=mission&taskId=${formData.taskId}&storeName=${encodeURIComponent(formData.storeName)}&returnUrl=${returnPath}`);
                    }}
                    className="w-full py-3 rounded-xl border-2 border-dashed border-indigo-200 dark:border-indigo-800/50 text-[10px] font-black uppercase tracking-widest text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/5 transition-all flex items-center justify-center gap-2"
                  >
                    Log Order Now →
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* STEP 5: OUTCOME */}
        <section className={`${sectionCls} pb-20`}>
          <div className="flex items-center justify-between mb-10 pb-6 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 bg-${config.color}-50 dark:bg-${config.color}-500/10 rounded-2xl flex items-center justify-center text-${config.color}-600 dark:text-${config.color}-400 shadow-inner`}>
                <Target size={26} strokeWidth={1.5} />
              </div>
              <div>
                <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tighter uppercase">05. Audit Outcome</h2>
                <p className={`text-[10px] font-black text-${config.color}-500/60 uppercase tracking-[0.25em]`}>Final intelligence</p>
              </div>
            </div>
            <div className={stepCircle}>05</div>
          </div>

          {previewImage && <ImageModal src={previewImage} onClose={() => setPreviewImage(null)} />}

          <div className="space-y-8">
            <PremiumSelect 
              label="Final Status" 
              isRequired={true}
              options={['Completed', 'Partially Completed', 'Interested', 'Need Follow-up', 'Rejected', 'Negotiation']}
              value={formData.status}
              onChange={(val) => setFormData(prev => ({ ...prev, status: val }))}
              icon={CheckCircle}
            />

            {(formData.status === 'Rejected' || formData.status === 'Need Follow-up') && (
              <div className="space-y-6 animate-in slide-in-from-top-4">
                {formData.status === 'Rejected' && (
                  <PremiumSelect 
                    label="Rejection Reason" 
                    options={['Pricing', 'Competitor', 'No Requirement', 'Owner Absent', 'Other']}
                    value={formData.notInterestedReason}
                    onChange={(val) => setFormData(prev => ({ ...prev, notInterestedReason: val }))}
                    icon={AlertCircle}
                  />
                )}

                {formData.status === 'Rejected' && formData.notInterestedReason === 'Pricing' && (
                  <div className={`animate-in zoom-in-95 duration-300 ${inputContainer}`}>
                    <label className={labelCls}>Offered / Expected Price</label>
                    <div className="flex items-center h-full">
                      <span className={`pl-5 text-base font-black text-${config.color}-500 pr-3 border-r-2 border-gray-100 dark:border-gray-800 h-1/2 flex items-center`}>₹</span>
                      <input type="text" name="rejectionPrice" value={formData.rejectionPrice} onChange={handleChange} className={inputFieldC} placeholder="Enter value" />
                    </div>
                  </div>
                )}

                {formData.status === 'Rejected' && formData.notInterestedReason === 'Competitor' && (
                  <div className={`animate-in zoom-in-95 duration-300 ${inputContainer}`}>
                    <label className={labelCls}>Name of Competitor</label>
                    <input type="text" name="competitorName" value={formData.competitorName} onChange={handleChange} className={inputFieldC} placeholder="Who are they using?" />
                  </div>
                )}

                {formData.status === 'Rejected' && formData.notInterestedReason === 'Owner Absent' && (
                  <div className="grid grid-cols-2 gap-4 animate-in zoom-in-95 duration-300">
                    {[
                      { id: 'reschedule', label: 'Reschedule', icon: Clock, color: 'indigo' },
                      { id: 'cancel', label: 'Cancel / Lost', icon: X, color: 'rose' }
                    ].map((act) => (
                      <button
                        key={act.id}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, absentAction: act.id }))}
                        className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 group
                          ${formData.absentAction === act.id 
                            ? `bg-${act.color}-50 dark:bg-${act.color}-950/30 border-${act.color}-400 shadow-md` 
                            : 'bg-white dark:bg-gray-800/50 border-gray-100 dark:border-gray-800'}`}
                      >
                        <act.icon size={20} className={formData.absentAction === act.id ? `text-${act.color}-600` : 'text-gray-400'} />
                        <span className={`text-[10px] font-black uppercase tracking-widest ${formData.absentAction === act.id ? `text-${act.color}-900 dark:text-${act.color}-200` : 'text-gray-500'}`}>
                          {act.label}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {(formData.status === 'Need Follow-up' || (formData.notInterestedReason === 'Owner Absent' && formData.absentAction === 'reschedule')) && (
                  <div className="bg-amber-50/20 dark:bg-amber-900/10 p-5 rounded-3xl border-2 border-amber-100 dark:border-amber-900/30 animate-in slide-in-from-top-4">
                    <div className="flex items-center gap-2 text-amber-600 text-[10px] font-black uppercase tracking-widest mb-4"><Clock size={16} /> Schedule Follow-up</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={inputContainer}><label className={labelCls}>Next Date</label><input type="date" name="followUpDate" value={formData.followUpDate} onChange={handleChange} className={inputFieldC} /></div>
                      <div className={inputContainer}><label className={labelCls}>Note</label><input type="text" name="followUpNotes" value={formData.followUpNotes} onChange={handleChange} className={inputFieldC} placeholder="Context" /></div>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-6 ml-1">
                <label className="text-[10px] uppercase font-black tracking-widest text-gray-400">Security-Encrypted Evidence Gallery *</label>
                <div className="px-3 py-1 bg-indigo-50 dark:bg-indigo-500/10 rounded-full border border-indigo-100 dark:border-indigo-500/20 flex items-center gap-1.5 shadow-sm">
                   <ShieldCheck size={12} className="text-indigo-600" />
                   <span className="text-[8px] font-black text-indigo-600 uppercase tracking-widest">Verified Proof of Collaboration</span>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { id: 'storeFront', label: 'Front View', required: true },
                  { id: 'boardInfo', label: 'Signage/Board', required: true },
                  { id: 'ownerPhoto', label: 'Inside View', required: false },
                  { id: 'selfieCheck', label: 'Selfie Proof', required: true }
                ].map((asset) => (
                  <div key={asset.id} className="relative group/asset">
                    <div
                      onClick={() => {
                        if (formData[asset.id]) {
                          setPreviewImage(formData[asset.id]);
                        } else {
                          document.getElementById(`file-${asset.id}`).click();
                        }
                      }}
                      className={`w-full aspect-square rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-1 transition-all overflow-hidden relative cursor-pointer
                        ${formData[asset.id] ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/10' : 'border-gray-200 dark:border-gray-800 hover:border-indigo-400 bg-gray-50/50'}`}
                    >
                      {formData[asset.id] ? (
                        <>
                          <img src={formData[asset.id]} alt="captured" className="w-full h-full object-cover group-hover/asset:scale-110 transition-transform duration-700" />
                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover/asset:opacity-100 transition-opacity">
                             <p className="text-white text-[8px] font-black uppercase tracking-widest text-center">Tap to Preview</p>
                          </div>
                          
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              document.getElementById(`file-${asset.id}`).click();
                            }}
                            className="absolute top-2 right-2 w-8 h-8 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-xl flex items-center justify-center text-indigo-600 shadow-xl border border-gray-100 dark:border-gray-800 hover:scale-110 transition-all opacity-0 group-hover/asset:opacity-100"
                          >
                             <Camera size={14} />
                          </button>

                          <div className="absolute top-2 left-2 w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-lg transform -translate-x-1 -translate-y-1"><Check size={12} strokeWidth={3} /></div>
                        </>
                      ) : (
                        <>
                          <div className="p-3 bg-white dark:bg-gray-800 rounded-2xl shadow-sm text-gray-400 group-hover/asset:text-indigo-600 group-hover/asset:scale-110 transition-all duration-500">
                             <Camera size={24} />
                          </div>
                          <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-2">{asset.label}</span>
                          {asset.required && <div className="absolute top-3 right-3 w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse" />}
                        </>
                      )}
                    </div>
                    <input id={`file-${asset.id}`} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => setFormData(prev => ({ ...prev, [asset.id]: reader.result }));
                        reader.readAsDataURL(file);
                      }
                    }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SUBMIT */}
        <div className="flex flex-col items-center justify-center pt-8 animate-in slide-in-from-bottom-8">
          <button 
            type="submit" 
            disabled={loading} 
            className={`group relative flex items-center justify-center gap-4 w-full sm:w-[320px] py-6 rounded-[2rem] bg-gray-900 dark:bg-white text-white dark:text-gray-950 font-black tracking-[0.2em] text-lg shadow-xl hover:shadow-indigo-500/20 active:scale-95 transition-all duration-500 overflow-hidden border-2 border-white dark:border-gray-900`}
          >
            <div className={`absolute inset-0 bg-gradient-to-r from-${config.color}-600 to-${config.color}-400 opacity-0 group-hover:opacity-100 transition-opacity`} />
            {loading ? (
              <div className="flex items-center gap-3 relative z-10"><div className="w-6 h-6 border-4 border-current border-t-transparent rounded-full animate-spin" /><span className="uppercase text-sm">Transmitting...</span></div>
            ) : (
              <div className="flex items-center gap-4 relative z-10"><Send size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /><span className="uppercase">Submit Activity</span></div>
            )}
          </button>
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-6">Secure Cloud Transmission Active</p>
        </div>
      </form>
    </div>
  );
};

export default MissionForm;
