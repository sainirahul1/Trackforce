import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, User, Phone, MapPin, Package, CheckCircle2, ChevronRight, HeartHandshake, Map, Hash, Camera, AlertCircle, Clock } from 'lucide-react';
import Button from '../components/ui/Button';
import { useDialog } from '../context/DialogContext';
import { createVisit } from '../services/visitService';

const interestLevels = [
  { value: 'High', label: 'High', desc: 'Strong buy-in, ready to proceed', activeBg: 'bg-emerald-600', activeBorder: 'border-emerald-600', activeDot: 'bg-emerald-300' },
  { value: 'Medium', label: 'Medium', desc: 'Showing interest, needs follow-up', activeBg: 'bg-amber-500', activeBorder: 'border-amber-500', activeDot: 'bg-amber-300' },
  { value: 'Low', label: 'Low', desc: 'Hesitant, nurturing required', activeBg: 'bg-rose-500', activeBorder: 'border-rose-500', activeDot: 'bg-rose-300' },
];

const outcomeOptions = [
  { value: 'Interested', icon: '✓', desc: 'Positive engagement', activeText: 'text-emerald-600', activeBorder: 'border-emerald-600', activeBg: 'bg-emerald-50 dark:bg-emerald-500/10' },
  { value: 'Not Interested', icon: '✕', desc: 'Visit closed', activeText: 'text-rose-600', activeBorder: 'border-rose-600', activeBg: 'bg-rose-50 dark:bg-rose-500/10' },
  { value: 'Negotiation', icon: '⇄', desc: 'Terms being discussed', activeText: 'text-blue-600', activeBorder: 'border-blue-600', activeBg: 'bg-blue-50 dark:bg-blue-500/10' },
  { value: 'Follow-up Required', icon: '↻', desc: 'Schedule next meeting', activeText: 'text-amber-600', activeBorder: 'border-amber-600', activeBg: 'bg-amber-50 dark:bg-amber-500/10' },
];

const SupplierVisitForm = ({ isEmbedded = false }) => {
  const navigate = useNavigate();
  const { showAlert } = useDialog();
  const [loading, setLoading] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);

  const [formData, setFormData] = useState({
    visitType: 'supplier',
    supplierName: '',
    contactPerson: '',
    phone: '',
    productCategory: '',
    location: '',
    latitude: null,
    longitude: null,
    collaborationInterest: '', 
    outcome: '',
    notInterestedReason: '',
    followUpDate: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
          if (data && data.display_name) {
            setFormData(prev => ({ ...prev, location: data.display_name }));
            showAlert('Success', 'GPS Position & Location verified!', 'success');
          }
        } catch (error) {
          showAlert('Success', 'GPS Captured (Address lookup unavailable)', 'info');
        } finally {
          setGpsLoading(false);
        }
      },
      (error) => {
        showAlert('Error', 'Failed to get location.', 'error');
        setGpsLoading(false);
      },
      { enableHighAccuracy: true }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!formData.supplierName || !formData.contactPerson || !formData.phone || !formData.outcome) {
      showAlert('Validation Error', 'Please fill all mandatory fields.', 'error');
      setLoading(false);
      return;
    }
    if (!formData.latitude || !formData.longitude) {
      showAlert('Validation Error', 'GPS Location capture is mandatory.', 'error');
      setLoading(false);
      return;
    }
    try {
      await createVisit({
        ...formData,
        address: formData.location,
        status: formData.outcome,
        gps: { lat: formData.latitude, lng: formData.longitude }
      });
      showAlert('Success', 'Supplier Visit logged successfully!', 'success');
      navigate('/employee/visits');
    } catch (err) {
      showAlert('Error', 'Failed to submit form.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const labelCls = "block text-xs font-black text-gray-400 dark:text-gray-500 mb-2 uppercase tracking-widest";
  const inputCls = "w-full bg-gray-50 dark:bg-gray-800/50 border-0 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 font-medium text-gray-900 dark:text-white transition-all";

  return (
    <div className={isEmbedded ? "w-full animate-in fade-in duration-500" : "max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8"}>
      <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8 pb-20">
        
        {/* SECTION 1: SUPPLIER IDENTITY */}
        <section className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-blue-50 dark:bg-blue-500/10 rounded-2xl text-blue-600"><Building2 size={22} /></div>
            <div><h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Supplier Details</h2></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2"><label className={labelCls}>Supplier Name *</label><input type="text" name="supplierName" value={formData.supplierName} onChange={handleChange} required className={inputCls} placeholder="Company Name" /></div>
            <div><label className={labelCls}>Contact Person *</label><input type="text" name="contactPerson" value={formData.contactPerson} onChange={handleChange} required className={inputCls} /></div>
            <div><label className={labelCls}>Phone Number *</label><input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className={inputCls} /></div>
            <div className="md:col-span-2"><label className={labelCls}>Product Category</label><input type="text" name="productCategory" value={formData.productCategory} onChange={handleChange} className={inputCls} /></div>
          </div>
        </section>

        {/* SECTION 2: LOCATION */}
        <section className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3"><div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl text-emerald-600"><MapPin size={22} /></div><div><h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Location</h2></div></div>
            <button type="button" onClick={handleCaptureLocation} disabled={gpsLoading} className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${formData.latitude ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' : 'bg-gray-100 dark:bg-gray-800 text-gray-600'}`}>{gpsLoading ? 'Detecting...' : formData.latitude ? 'GPS Captured ✓' : 'Detect GPS Now'}</button>
          </div>
          <textarea name="location" value={formData.location} onChange={handleChange} rows={2} className={`${inputCls} resize-none`} placeholder="Address..." />
        </section>

        {/* SECTION 3: COLLABORATION & OUTCOME */}
        <section className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3 mb-8"><div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl text-emerald-600"><HeartHandshake size={22} /></div><div><h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Collaboration & Outcome</h2></div></div>
          
          <div className="mb-10 text-left">
            <p className={labelCls}>Collaboration Interest</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {interestLevels.map(level => (
                <button key={level.value} type="button" onClick={() => setFormData(prev => ({ ...prev, collaborationInterest: level.value }))} className={`flex flex-col items-start gap-2 p-4 rounded-2xl border-2 text-left transition-all ${formData.collaborationInterest === level.value ? `${level.activeBg} ${level.activeBorder} text-white shadow-xl` : 'bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-800'}`}>
                  <p className="text-sm font-black">{level.label}</p>
                  <p className={`text-[10px] font-medium leading-tight ${formData.collaborationInterest === level.value ? 'text-white/80' : 'text-gray-400'}`}>{level.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <p className={labelCls}>Visit Outcome *</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {outcomeOptions.map(option => (
                <button key={option.value} type="button" onClick={() => setFormData(prev => ({ ...prev, outcome: option.value }))} className={`flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition-all ${formData.outcome === option.value ? `${option.activeBg} ${option.activeBorder} shadow-sm` : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800'}`}>
                  <span className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-black shrink-0 ${formData.outcome === option.value ? option.activeText : 'bg-gray-50 dark:bg-gray-800 text-gray-400'}`}>{option.icon}</span>
                  <div className="flex-1 min-w-0"><p className={`text-[11px] font-black leading-none mb-1 ${formData.outcome === option.value ? option.activeText : 'text-gray-900 dark:text-white'}`}>{option.value}</p><p className={`text-[10px] font-medium ${formData.outcome === option.value ? 'text-gray-600 dark:text-gray-400' : 'text-gray-400'}`}>{option.desc}</p></div>
                  {formData.outcome === option.value && <CheckCircle2 size={16} className={option.activeText} />}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 animate-in fade-in slide-in-from-top-2 duration-300">
            {formData.outcome === 'Not Interested' && (
              <div className="bg-rose-50 dark:bg-rose-500/5 p-6 rounded-3xl border border-rose-100 dark:border-rose-500/20">
                <div className="flex items-center gap-2 text-rose-600 text-xs font-black uppercase tracking-widest mb-3"><AlertCircle size={16} /> Rejection Intelligence</div>
                <textarea name="notInterestedReason" value={formData.notInterestedReason} onChange={handleChange} rows={2} className="w-full bg-white dark:bg-gray-900 border-0 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-rose-500" placeholder="e.g. Terms didn't match..." />
              </div>
            )}
            {formData.outcome === 'Follow-up Required' && (
              <div className="bg-amber-50 dark:bg-amber-500/5 p-6 rounded-3xl border border-amber-100 dark:border-amber-500/20">
                <div className="flex items-center gap-2 text-amber-600 text-xs font-black uppercase tracking-widest mb-3"><Clock size={16} /> Target Follow-up Date</div>
                <input type="date" name="followUpDate" value={formData.followUpDate} onChange={handleChange} className="w-full bg-white dark:bg-gray-900 border-0 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-500" />
              </div>
            )}
          </div>
        </section>

        <div className="flex justify-end pt-4 pb-12">
          <Button type="submit" variant="primary" disabled={loading} className="px-12 py-5 rounded-3xl text-lg font-black shadow-2xl shadow-blue-500/20 w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white transform active:scale-95 transition-all">
            {loading ? 'Committing...' : 'Save Supplier Visit'}
          </Button>
        </div>
      </form>
    </div>
  );
};
export default SupplierVisitForm;
