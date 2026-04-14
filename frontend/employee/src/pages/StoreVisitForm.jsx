import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, MapPin, CheckCircle2, ChevronRight, Store, User, Phone, Building, ShoppingCart, Smartphone, Calendar, AlertCircle, Hash, Map, Check, MessageSquare, Clock } from 'lucide-react';
import Button from '../components/ui/Button';
import { useDialog } from '../context/DialogContext';
import { createVisit } from '../services/visitService';

const StoreVisitForm = ({ isEmbedded = false }) => {
  const navigate = useNavigate();
  const { showAlert } = useDialog();
  const [loading, setLoading] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);

  const [formData, setFormData] = useState({
    // Type tracking
    visitType: 'store',
    // Store Identity
    storeName: '', ownerName: '', mobileNumber: '', gst: '',
    // Geography
    address: '', pinCode: '', city: '', state: '', latitude: null, longitude: null,
    // Operations & Intelligence
    storeType: 'Retail', monthlyPurchase: '', interestedProducts: '', 
    appInstalled: false, appTraining: false, orderPlaced: false,
    // Final Outcome
    status: 'Completed',
    notInterestedReason: '',
    followUpDate: '',
    followUpNotes: '',
    // Evidence Gallery
    storePhoto: null,
    storeBoardPhoto: null,
    ownerPhoto: null,
    selfiePhoto: null,
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
      showAlert('Validation Error', 'Please fill all required Identity fields.', 'error');
      setLoading(false);
      return;
    }
    if (!formData.latitude || !formData.longitude) {
      showAlert('Validation Error', 'GPS Location is mandatory.', 'error');
      setLoading(false);
      return;
    }
    if (!formData.storePhoto || !formData.storeBoardPhoto || !formData.selfiePhoto) {
      showAlert('Validation Error', 'Proofs are mandatory.', 'error');
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

  const labelCls = "block text-xs font-black text-gray-400 dark:text-gray-500 mb-2 uppercase tracking-widest";
  const inputCls = "w-full bg-gray-50 dark:bg-gray-800/50 border-0 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 font-medium text-gray-900 dark:text-white transition-all";

  return (
    <div className={isEmbedded ? "w-full animate-in fade-in duration-500" : "max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8"}>
      <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8 pb-20">
        
        {/* SECTION 1: IDENTITY */}
        <section className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl text-indigo-600">
              <Store size={22} />
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Store Identity</h2>
              <p className="text-xs text-gray-500 font-medium">Capture core business details</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className={labelCls}>Store Name *</label>
              <input type="text" name="storeName" value={formData.storeName} onChange={handleChange} required className={inputCls} placeholder="RK Supermart" />
            </div>
            <div>
              <label className={labelCls}>Owner Name *</label>
              <input type="text" name="ownerName" value={formData.ownerName} onChange={handleChange} required className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Mobile Number *</label>
              <input type="tel" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} required className={inputCls} placeholder="+91..." />
            </div>
            <div className="md:col-span-2">
              <label className={labelCls}>GST Number (Optional)</label>
              <input type="text" name="gst" value={formData.gst} onChange={handleChange} className={inputCls} />
            </div>
          </div>
        </section>

        {/* SECTION 2: LOCATION */}
        <section className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl text-emerald-600">
                <MapPin size={22} />
              </div>
              <div>
                <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Location</h2>
              </div>
            </div>
            <button type="button" onClick={handleCaptureLocation} disabled={gpsLoading} className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${formData.latitude ? 'bg-emerald-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600'}`}>
              {gpsLoading ? 'Detecting...' : formData.latitude ? 'GPS Captured ✓' : 'Detect GPS Now'}
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-4"><label className={labelCls}>Complete Address *</label><textarea name="address" value={formData.address} onChange={handleChange} required rows={2} className={`${inputCls} resize-none`} placeholder="Shop No, Street, Landmark..." /></div>
            <div><label className={labelCls}>Pin Code</label><input type="text" name="pinCode" value={formData.pinCode} onChange={handleChange} className={inputCls} placeholder="400001" /></div>
            <div className="md:col-span-1.5"><label className={labelCls}>City</label><input type="text" name="city" value={formData.city} onChange={handleChange} className={inputCls} /></div>
            <div className="md:col-span-1.5"><label className={labelCls}>State</label><input type="text" name="state" value={formData.state} onChange={handleChange} className={inputCls} /></div>
          </div>
        </section>

        {/* SECTION 3: BUSINESS DETAILS */}
        <section className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-blue-50 dark:bg-blue-500/10 rounded-2xl text-blue-600"><Building size={22} /></div>
            <div><h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Business Details</h2></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div><label className={labelCls}>Store Type</label><select name="storeType" value={formData.storeType} onChange={handleChange} className={inputCls}><option>Retail</option><option>Wholesale</option><option>Distributor</option></select></div>
              <div><label className={labelCls}>Monthly Purchase Volume</label><input type="text" name="monthlyPurchase" value={formData.monthlyPurchase} onChange={handleChange} className={inputCls} placeholder="₹50,000" /></div>
              <div><label className={labelCls}>Interested Products</label><input type="text" name="interestedProducts" value={formData.interestedProducts} onChange={handleChange} className={inputCls} /></div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-3xl border border-gray-100 dark:border-gray-800">
              <p className={labelCls}>Milestones</p>
              <div className="space-y-3">
                {[{ id: 'appInstalled', label: 'App Installed' }, { id: 'appTraining', label: 'App Training' }, { id: 'orderPlaced', label: 'Order Placed' }].map(item => (
                  <label key={item.id} className="flex items-center gap-3 p-3 bg-white dark:bg-gray-900 rounded-xl cursor-pointer">
                    <input type="checkbox" name={item.id} checked={formData[item.id]} onChange={handleChange} className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500" />
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: OUTCOME WITH CONDITIONAL DETAILS */}
        <section className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-violet-50 dark:bg-violet-500/10 rounded-2xl text-violet-600"><CheckCircle2 size={22} /></div>
            <div><h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Visit Outcome</h2></div>
          </div>
          <div className="mb-8">
            <label className={labelCls}>Status *</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['Completed', 'Partially Completed', 'Not Interested', 'Need Follow-up'].map(status => (
                <button key={status} type="button" onClick={() => setFormData(prev => ({ ...prev, status }))} className={`px-4 py-3 rounded-xl border-2 font-black text-[10px] uppercase tracking-wider transition-all ${formData.status === status ? 'bg-violet-600 border-violet-600 text-white shadow-lg shadow-violet-500/20 shadow-md' : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-800 text-gray-400 hover:border-gray-200'}`}>
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Conditional Sub-Details */}
          <div className="animate-in fade-in slide-in-from-top-2 duration-300">
            {formData.status === 'Not Interested' && (
              <div className="bg-rose-50 dark:bg-rose-500/5 p-6 rounded-3xl border border-rose-100 dark:border-rose-500/20 space-y-4">
                <div className="flex items-center gap-2 text-rose-600 text-xs font-black uppercase tracking-widest"><AlertCircle size={16} /> Rejection Intelligence</div>
                <textarea name="notInterestedReason" value={formData.notInterestedReason} onChange={handleChange} rows={3} className="w-full bg-white dark:bg-gray-900 border-0 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-rose-500" placeholder="Why was the owner not interested? (e.g. Price too high, Competitor usage...)" />
              </div>
            )}

            {formData.status === 'Need Follow-up' && (
              <div className="bg-amber-50 dark:bg-amber-500/5 p-6 rounded-3xl border border-amber-100 dark:border-amber-500/20 space-y-6">
                <div className="flex items-center gap-2 text-amber-600 text-xs font-black uppercase tracking-widest"><Clock size={16} /> Schedule Next Mission</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-amber-600/60 uppercase mb-2">Next Visit Date</label>
                    <input type="date" name="followUpDate" value={formData.followUpDate} onChange={handleChange} className="w-full bg-white dark:bg-gray-900 border-0 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-500" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-amber-600/60 uppercase mb-2">Internal Note</label>
                    <textarea name="followUpNotes" value={formData.followUpNotes} onChange={handleChange} rows={1} className="w-full bg-white dark:bg-gray-900 border-0 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-500" placeholder="What needs to be discussed next?" />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-10">
            <label className={labelCls}>Field Assets (Capture Proofs)</label>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {[{ id: 'storePhoto', label: 'Store Photo *' }, { id: 'storeBoardPhoto', label: 'Board Photo *' }, { id: 'ownerPhoto', label: 'Owner (Opt)' }, { id: 'selfiePhoto', label: 'Selfie *' }].map(pic => (
                <label key={pic.id} className="relative aspect-square rounded-[2rem] border-2 border-dashed border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 hover:bg-white flex flex-col items-center justify-center cursor-pointer overflow-hidden group">
                  {formData[pic.id] ? <img src={formData[pic.id]} className="w-full h-full object-cover" /> : <div className="text-center group-hover:scale-110 transition-all"><Camera size={20} className="text-gray-400 mx-auto mb-1" /><span className="text-[10px] font-black text-gray-400 uppercase">Capture</span></div>}
                  <input type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => handlePhotoCapture(e, pic.id)} />
                </label>
              ))}
            </div>
          </div>
        </section>

        <div className="flex justify-center pt-8">
          <Button type="submit" variant="primary" disabled={loading} className="px-16 py-5 rounded-3xl text-lg font-black shadow-2xl shadow-indigo-500/30 w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white transform active:scale-95 transition-all">
            {loading ? 'Submitting...' : 'Submit Store Visit'}
          </Button>
        </div>
      </form>
    </div>
  );
};
export default StoreVisitForm;
