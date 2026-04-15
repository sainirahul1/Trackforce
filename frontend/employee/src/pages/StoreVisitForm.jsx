import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, MapPin, CheckCircle2, Store, User, Phone, Building, ShoppingCart, Target, Hash, Building2, Briefcase, ShoppingBag, Send, AlertCircle, Clock } from 'lucide-react';
import Button from '../components/ui/Button';
import { useDialog } from '../context/DialogContext';
import { createVisit } from '../services/visitService';

const StoreVisitForm = ({ isEmbedded = false }) => {
  const navigate = useNavigate();
  const { showAlert } = useDialog();
  const [loading, setLoading] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);

  const [formData, setFormData] = useState({
    visitType: 'store',
    storeName: '', ownerName: '', mobileNumber: '', gst: '',
    address: '', pinCode: '', city: '', state: '', latitude: null, longitude: null,
    storeType: 'Retail', monthlyPurchase: '', interestedProducts: '',
    appInstalled: false, appTraining: false, orderPlaced: false,
    status: 'Completed', notInterestedReason: '', followUpDate: '', followUpNotes: '',
    storePhoto: null, storeBoardPhoto: null, ownerPhoto: null, selfiePhoto: null,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCaptureLocation = () => {
    setGpsLoading(true);
    if (!navigator.geolocation) {
      showAlert('Error', 'Geolocation is not supported by your browser', 'error');
      setGpsLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setFormData(prev => ({ ...prev, latitude, longitude }));

        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`);
          const data = await response.json();
          if (data && data.address) {
            const { address } = data;
            setFormData(prev => ({
              ...prev,
              address: data.display_name || '',
              city: address.city || address.town || address.village || address.suburb || '',
              state: address.state || '',
              pinCode: address.postcode || ''
            }));
            showAlert('Success', 'GPS Position & Address captured!', 'success');
          }
        } catch (error) {
          console.warn('Geocoding failed');
          showAlert('Success', 'GPS Captured (Address lookup failed)', 'info');
        } finally {
          setGpsLoading(false);
        }
      },
      (error) => {
        showAlert('Error', 'Failed to get location. Please allow GPS permissions.', 'error');
        setGpsLoading(false);
      },
      { enableHighAccuracy: true }
    );
  };

  const handlePhotoCapture = (e, field) => {
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

    if (!formData.storeName || !formData.ownerName || !formData.mobileNumber) {
      showAlert('Required', 'Please fill all required Identity fields.', 'error');
      setLoading(false);
      return;
    }
    if (!formData.latitude || !formData.longitude) {
      showAlert('Required', 'GPS Location is mandatory.', 'error');
      setLoading(false);
      return;
    }
    if (!formData.storePhoto || !formData.storeBoardPhoto || !formData.selfiePhoto) {
      showAlert('Required', 'Proofs are mandatory.', 'error');
      setLoading(false);
      return;
    }

    try {
      const submissionData = {
        ...formData,
        gps: { lat: formData.latitude, lng: formData.longitude },
        photos: [formData.storePhoto, formData.storeBoardPhoto, formData.ownerPhoto, formData.selfiePhoto].filter(p => p)
      };
      await createVisit(submissionData);
      showAlert('Success', 'Store Visit logged successfully!', 'success');
      navigate('/employee/visits');
    } catch (err) {
      showAlert('Error', 'Failed to submit form.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Modern input styles
  const inputContainer = "group relative bg-gray-50/50 dark:bg-gray-800/20 rounded-2xl border border-gray-100 dark:border-gray-800 focus-within:bg-white dark:focus-within:bg-gray-900 focus-within:ring-4 focus-within:ring-indigo-500/10 focus-within:border-indigo-400 transition-all duration-300";
  const labelCls = "absolute text-[10px] uppercase font-black tracking-widest text-gray-400 bg-transparent px-1 top-2.5 left-4 z-10 transition-all duration-300 pointer-events-none group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400";
  const inputFieldC = "block w-full pt-8 pb-3 px-4 bg-transparent border-none focus:ring-0 text-sm font-bold text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-gray-600 outline-none";

  return (
    <div className={isEmbedded ? "w-full" : "max-w-4xl mx-auto py-8 px-4"}>
      <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8 pb-20">

        {/* SECTION 1: IDENTITY */}
        <section className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-6 sm:p-10 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:shadow-none border border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Store size={26} strokeWidth={1.5} />
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Identity</h2>
              <p className="text-sm font-medium text-gray-500">Core business intel</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className={`md:col-span-2 ${inputContainer}`}>
              <label className={labelCls}>Store Name *</label>
              <input type="text" name="storeName" value={formData.storeName} onChange={handleChange} required className={inputFieldC} placeholder="Enter retail/shop name" />
            </div>
            <div className={inputContainer}>
              <label className={labelCls}>Owner Name *</label>
              <input type="text" name="ownerName" value={formData.ownerName} onChange={handleChange} required className={inputFieldC} placeholder="Key Contact" />
            </div>
            <div className={inputContainer}>
              <label className={labelCls}>Mobile No. *</label>
              <input type="tel" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} required className={inputFieldC} placeholder="+91" />
            </div>
          </div>
        </section>

        {/* SECTION 2: LOCATION */}
        <section className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-6 sm:p-10 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:shadow-none border border-gray-100 dark:border-gray-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <MapPin size={26} strokeWidth={1.5} />
              </div>
              <div>
                <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Geography</h2>
                <p className="text-sm font-medium text-gray-500">Location coordinates</p>
              </div>
            </div>
            <button type="button" onClick={handleCaptureLocation} disabled={gpsLoading} className={`px-5 py-3 rounded-2xl text-xs font-black tracking-widest uppercase shadow-md transition-all flex items-center gap-2 justify-center
              ${formData.latitude ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/30' : 'bg-gray-900 dark:bg-white dark:text-gray-900 text-white hover:bg-gray-800'}`}>
              <Target size={16} className={gpsLoading ? 'animate-spin' : ''} />
              {gpsLoading ? 'Detecting...' : formData.latitude ? 'Captured ✓' : 'Detect GPS'}
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <div className={`md:col-span-4 ${inputContainer}`}>
              <label className={labelCls}>Field Address *</label>
              <textarea name="address" value={formData.address} onChange={handleChange} required rows={2} className={`${inputFieldC} resize-none min-h-[4rem]`} placeholder="Auto-filled via GPS or manual entry..." />
            </div>
            <div className={inputContainer}><label className={labelCls}>City</label><input type="text" name="city" value={formData.city} onChange={handleChange} className={inputFieldC} /></div>
            <div className={inputContainer}><label className={labelCls}>State</label><input type="text" name="state" value={formData.state} onChange={handleChange} className={inputFieldC} /></div>
            <div className={`md:col-span-2 ${inputContainer}`}><label className={labelCls}>Pin Code</label><input type="text" name="pinCode" value={formData.pinCode} onChange={handleChange} className={inputFieldC} /></div>
          </div>
        </section>

        {/* SECTION 3: BUSINESS ACUMEN */}
        <section className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-6 sm:p-10 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:shadow-none border border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-blue-50 dark:bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400"><Briefcase size={26} strokeWidth={1.5} /></div>
            <div>
              <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Operations</h2>
              <p className="text-sm font-medium text-gray-500">Business profiling</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-5">
              <div className={inputContainer}>
                <label className={labelCls}>Classification</label>
                <select name="storeType" value={formData.storeType} onChange={handleChange} className={`${inputFieldC} cursor-pointer appearance-none`}>
                  <option>Retail</option><option>Wholesale</option><option>Distributor</option><option>Kirana</option><option>Supermarket</option><option>Other</option>
                </select>
              </div>
              <div className={inputContainer}>
                <label className={labelCls}>Est. Monthly Volume</label>
                <input type="text" name="monthlyPurchase" value={formData.monthlyPurchase} onChange={handleChange} className={inputFieldC} placeholder="e.g. ₹50,000" />
              </div>
              <div className={inputContainer}>
                <label className={labelCls}>Target Products</label>
                <input type="text" name="interestedProducts" value={formData.interestedProducts} onChange={handleChange} className={inputFieldC} placeholder="Key interests" />
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800/40 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 flex flex-col justify-center">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 ml-1">Key Milestones</p>
              <div className="space-y-3">
                {[
                  { id: 'appInstalled', label: 'App Successfully Installed', icon: ShoppingBag, color: 'text-emerald-500' }, 
                  { id: 'appTraining', label: 'Product Training Provided', icon: CheckCircle2, color: 'text-indigo-500' }, 
                  { id: 'orderPlaced', label: 'Initial Order Placed', icon: ShoppingCart, color: 'text-amber-500' }
                ].map(item => (
                  <label key={item.id} className="group flex items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 cursor-pointer hover:border-indigo-200 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl bg-gray-50 dark:bg-gray-800 ${item.color}`}><item.icon size={16} /></div>
                      <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{item.label}</span>
                    </div>
                    <div className="relative flex items-center h-5 w-10">
                      <input type="checkbox" name={item.id} checked={formData[item.id]} onChange={handleChange} className="peer sr-only" />
                      <div className="block h-6 w-11 rounded-full bg-gray-200 dark:bg-gray-700 peer-checked:bg-indigo-500 transition-colors" />
                      <div className="dot absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform peer-checked:translate-x-5 shadow-sm" />
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: OUTCOME */}
        <section className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-6 sm:p-10 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:shadow-none border border-gray-100 dark:border-gray-800 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          
          <div className="flex items-center gap-4 mb-8 relative z-10">
            <div className="w-14 h-14 bg-violet-50 dark:bg-violet-500/10 rounded-2xl flex items-center justify-center text-violet-600 dark:text-violet-400"><Target size={26} strokeWidth={1.5} /></div>
            <div><h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Outcome</h2><p className="text-sm font-medium text-gray-500">Result & evidence</p></div>
          </div>

          <div className="mb-10 relative z-10">
            <label className="block text-[10px] uppercase font-black tracking-widest text-gray-400 mb-3 ml-1">Final Status *</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-gray-50 dark:bg-gray-800/50 p-2 rounded-2xl">
              {['Completed', 'Not Interested', 'Need Follow-up', 'Partially Completed'].map(status => (
                <button key={status} type="button" onClick={() => setFormData(prev => ({ ...prev, status }))} 
                  className={`px-4 py-3 sm:py-4 rounded-[1.25rem] text-xs font-black uppercase tracking-wider transition-all duration-300
                    ${formData.status === status ? 'bg-white dark:bg-gray-900 text-indigo-600 dark:text-indigo-400 shadow-md transform scale-[1.02]' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="relative z-10">
            {formData.status === 'Not Interested' && (
              <div className="bg-rose-50/50 dark:bg-rose-900/10 p-6 rounded-[2rem] border border-rose-100 dark:border-rose-900/30 mb-8 animate-in slide-in-from-top-2">
                <div className="flex items-center gap-2 text-rose-600 text-xs font-black uppercase tracking-widest mb-4"><AlertCircle size={16} /> Rejection Intelligence</div>
                <select name="notInterestedReason" value={formData.notInterestedReason} onChange={handleChange} className="w-full bg-white dark:bg-gray-900 border-none rounded-2xl px-5 py-4 font-bold focus:ring-4 focus:ring-rose-500/20 outline-none text-gray-900 dark:text-white">
                  <option value="">Select Reason...</option><option>Competitor</option><option>Price</option><option>Not Required</option><option>Owner Not Available</option><option>Other</option>
                </select>
              </div>
            )}

            {formData.status === 'Need Follow-up' && (
              <div className="bg-amber-50/50 dark:bg-amber-900/10 p-6 rounded-[2rem] border border-amber-100 dark:border-amber-900/30 mb-8 animate-in slide-in-from-top-2">
                <div className="flex items-center gap-2 text-amber-600 text-xs font-black uppercase tracking-widest mb-4"><Clock size={16} /> Schedule Next Mission</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className={inputContainer}><label className={labelCls}>Next Visit Date</label><input type="date" name="followUpDate" value={formData.followUpDate} onChange={handleChange} className={inputFieldC} /></div>
                  <div className={inputContainer}><label className={labelCls}>Internal Note</label><input type="text" name="followUpNotes" value={formData.followUpNotes} onChange={handleChange} placeholder="Discussion context" className={inputFieldC} /></div>
                </div>
              </div>
            )}
          </div>

          <div className="relative z-10">
            <label className="block text-[10px] uppercase font-black tracking-widest text-gray-400 mb-3 ml-1">Asset Gallery (Proofs) *</label>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {[
                { id: 'storePhoto', label: 'Store Front', icon: Store }, 
                { id: 'storeBoardPhoto', label: 'Board Info', icon: Building2 }, 
                { id: 'ownerPhoto', label: 'Owner (Opt)', icon: User }, 
                { id: 'selfiePhoto', label: 'Selfie Check', icon: Camera }
              ].map(pic => (
                <label key={pic.id} className="relative aspect-[4/3] rounded-[1.5rem] border-2 border-dashed border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 flex flex-col items-center justify-center cursor-pointer overflow-hidden group transition-all duration-300">
                  {formData[pic.id] ? (
                    <div className="w-full h-full relative">
                      <img src={formData[pic.id]} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-white text-xs font-bold bg-black/50 px-3 py-1.5 rounded-full backdrop-blur-md">Retake</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center transform group-hover:-translate-y-1 transition-all duration-300">
                      <pic.icon size={24} className="text-gray-400 dark:text-gray-500 mx-auto mb-2 group-hover:text-indigo-500 transition-colors" />
                      <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest group-hover:text-indigo-600 transition-colors">{pic.label}</span>
                    </div>
                  )}
                  <input type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => handlePhotoCapture(e, pic.id)} />
                </label>
              ))}
            </div>
          </div>
        </section>

        <div className="flex justify-center pt-6">
          <button type="submit" disabled={loading} className="group relative flex items-center justify-center gap-3 w-full sm:w-auto px-16 py-5 rounded-[2rem] bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black tracking-wide text-lg shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-indigo-500/20 active:scale-[0.98] transition-all hover:bg-indigo-600 dark:hover:bg-indigo-500 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? (
              <span className="animate-pulse">Submitting...</span>
            ) : (
              <>
                <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                Submit Mission Log
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
export default StoreVisitForm;
