import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Smartphone, Store, User, Phone, CheckCircle2, ChevronRight, ShoppingCart, ShieldCheck, MapPin, Map } from 'lucide-react';
import Button from '../components/ui/Button';
import { useDialog } from '../context/DialogContext';
import { createVisit } from '../services/visitService';

const AppInstallForm = ({ isEmbedded = false }) => {
  const navigate = useNavigate();
  const { showAlert } = useDialog();
  const [loading, setLoading] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);

  const [formData, setFormData] = useState({
    storeName: '',
    ownerName: '',
    phone: '',
    appInstalled: false,
    firstOrderPlaced: false,
    installedAppName: '',
    latitude: null,
    longitude: null,
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
      (position) => {
        setFormData(prev => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }));
        setGpsLoading(false);
        showAlert('Success', 'GPS Location captured successfully!', 'success');
      },
      (error) => {
        showAlert('Error', 'Failed to get location. Please allow GPS permissions.', 'error');
        setGpsLoading(false);
      },
      { enableHighAccuracy: true }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    if (!formData.storeName || !formData.ownerName || !formData.phone) {
      showAlert('Validation Error', 'Please fill all mandatory store details.', 'error');
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
        status: 'completed',
        gps: { lat: formData.latitude, lng: formData.longitude }
      });
      showAlert('Success', 'App installation tracker updated!', 'success');
      navigate('/employee/visits');
    } catch (err) {
      console.error('Submission error:', err);
      showAlert('Error', err.response?.data?.message || 'Failed to submit form.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const labelCls = "block text-xs font-black text-gray-400 dark:text-gray-500 mb-2 uppercase tracking-widest";
  const inputCls = "w-full bg-gray-50 dark:bg-gray-800/50 border-0 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 font-medium text-gray-900 dark:text-white transition-all";

  return (
    <div className={isEmbedded ? "w-full animate-in fade-in duration-500" : "max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8"}>
      
      <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8 pb-20">
        
        {/* SECTION 1: STORE IDENTITY */}
        <section className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl text-emerald-600">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Onboarding Target</h2>
              <p className="text-xs text-gray-500 font-medium">Identify the store for software adoption tracking</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className={labelCls}>Store Name *</label>
              <input type="text" name="storeName" value={formData.storeName} onChange={handleChange} required className={inputCls} placeholder="E.g. Metro Retail" />
            </div>
            <div>
              <label className={labelCls}>Owner Name *</label>
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" name="ownerName" value={formData.ownerName} onChange={handleChange} required className={`${inputCls} pl-11`} />
              </div>
            </div>
            <div>
              <label className={labelCls}>Phone Number *</label>
              <div className="relative">
                <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className={`${inputCls} pl-11`} placeholder="+91..." />
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: LOCATION & GPS */}
        <section className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl text-emerald-600">
                <MapPin size={22} />
              </div>
              <div>
                <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Onboarding Location</h2>
                <p className="text-xs text-gray-500 font-medium">Verify installation site through GPS</p>
              </div>
            </div>
            <button 
              type="button" 
              onClick={handleCaptureLocation} 
              disabled={gpsLoading}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${formData.latitude ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 hover:bg-gray-200'}`}
            >
              <Map size={14} />
              {gpsLoading ? 'Detecting...' : formData.latitude ? 'GPS Captured ✓' : 'Detect GPS Now'}
            </button>
          </div>
        </section>

        {/* SECTION 3: ADOPTION TRACKING */}
        <section className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl text-emerald-600">
              <Smartphone size={22} />
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Adoption Milestones</h2>
              <p className="text-xs text-gray-500 font-medium">Track installation and training status</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {[
              { id: 'appInstalled', label: 'App Installed', icon: Smartphone, desc: 'Verified app on owner device', color: 'text-indigo-500' },
              { id: 'appTrainingCompleted', label: 'Training Completed', icon: ShieldCheck, desc: 'Owner understands ordering flow', color: 'text-emerald-500' },
              { id: 'firstOrderPlaced', label: 'First Order Placed', icon: ShoppingCart, desc: 'Successfully initiated transaction', color: 'text-blue-500' },
            ].map(item => (
              <div key={item.id} className="space-y-3">
                <label className={`flex items-center justify-between p-5 rounded-3xl border-2 transition-all cursor-pointer ${formData[item.id] ? 'bg-white dark:bg-gray-800 border-emerald-500 shadow-md' : 'border-transparent bg-gray-50 dark:bg-gray-800/50 hover:border-gray-200'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-2xl bg-white dark:bg-gray-900 shadow-sm ${item.color}`}>
                      <item.icon size={22} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white leading-none mb-1">{item.label}</h3>
                      <p className="text-[10px] font-medium text-gray-400">{item.desc}</p>
                    </div>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${formData[item.id] ? 'bg-emerald-600 border-emerald-600' : 'border-gray-200 dark:border-gray-700'}`}>
                    {formData[item.id] && <CheckCircle2 size={14} className="text-white" />}
                  </div>
                  <input type="checkbox" name={item.id} checked={formData[item.id]} onChange={handleChange} className="hidden" />
                </label>
                {item.id === 'appInstalled' && formData.appInstalled && (
                  <div className="pl-4 pr-2 py-2 animate-in fade-in slide-in-from-top-2">
                    <label className={labelCls}>Which App was Installed?</label>
                    <input 
                      type="text" 
                      name="installedAppName" 
                      value={formData.installedAppName} 
                      onChange={handleChange} 
                      className={inputCls} 
                      placeholder="E.g. ReatchAll, VillagKart, etc." 
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* SUBMIT */}
        <div className="flex justify-end pt-4 pb-12">
          <Button type="submit" variant="primary" disabled={loading} className="px-12 py-5 rounded-3xl text-lg font-black shadow-2xl shadow-emerald-500/20 w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white transform active:scale-95 transition-all">
            {loading ? 'Committing...' : 'Save Tracking Update'}
            {!loading && <ChevronRight className="ml-2 inline" />}
          </Button>
        </div>

      </form>
    </div>
  );
};

export default AppInstallForm;
