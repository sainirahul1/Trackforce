import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, User, Landmark, IndianRupee, FileText, ChevronRight, Briefcase, MapPin, Map } from 'lucide-react';
import Button from '../components/ui/Button';
import { useDialog } from '../context/DialogContext';
import { createVisit } from '../services/visitService';

const CollabVisitForm = ({ isEmbedded = false }) => {
  const navigate = useNavigate();
  const { showAlert } = useDialog();
  const [loading, setLoading] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);

  const [formData, setFormData] = useState({
    organizationName: '',
    contactPerson: '',
    collaborationType: 'Partnership',
    opportunityValue: '',
    notes: '',
    latitude: null,
    longitude: null,
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

    if (!formData.organizationName || !formData.contactPerson) {
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
        storeName: formData.organizationName,
        status: 'completed',
        gps: { lat: formData.latitude, lng: formData.longitude }
      });
      showAlert('Success', 'Collaboration opportunity logged successfully!', 'success');
      navigate('/employee/visits');
    } catch (err) {
      console.error('Submission error:', err);
      showAlert('Error', err.response?.data?.message || 'Failed to submit form.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const labelCls = "block text-xs font-black text-gray-400 dark:text-gray-500 mb-2 uppercase tracking-widest";
  const inputCls = "w-full bg-gray-50 dark:bg-gray-800/50 border-0 rounded-xl px-4 py-3 focus:ring-2 focus:ring-violet-500 font-medium text-gray-900 dark:text-white transition-all";

  return (
    <div className={isEmbedded ? "w-full animate-in fade-in duration-500" : "max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8"}>

      <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8 pb-20">

        {/* SECTION 1: OPPORTUNITY IDENTITY */}
        <section className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-violet-50 dark:bg-violet-500/10 rounded-2xl text-violet-600">
              <Briefcase size={22} />
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Collaboration Details</h2>
              <p className="text-xs text-gray-500 font-medium">Capture business partnership & opportunity info</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className={labelCls}>Organization Name *</label>
              <input type="text" name="organizationName" value={formData.organizationName} onChange={handleChange} required className={inputCls} placeholder="Target Company/Entity" />
            </div>
            <div>
              <label className={labelCls}>Key Contact Person *</label>
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" name="contactPerson" value={formData.contactPerson} onChange={handleChange} required className={`${inputCls} pl-11`} placeholder="Lead contact name" />
              </div>
            </div>

            <div>
              <label className={labelCls}>Collaboration Type</label>
              <select name="collaborationType" value={formData.collaborationType} onChange={handleChange} className={inputCls}>
                <option>Partnership</option>
                <option>Joint Venture</option>
                <option>Sponsorship</option>
                <option>Franchise</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Value Estimation</label>
              <div className="relative">
                <IndianRupee size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" name="opportunityValue" value={formData.opportunityValue} onChange={handleChange} className={`${inputCls} pl-11`} placeholder="E.g. ₹5,00,000" />
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
                <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Location Verification</h2>
                <p className="text-xs text-gray-500 font-medium">Verify meeting venue through GPS</p>
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
          <p className="text-[10px] text-gray-400 font-medium italic">Capturing GPS is required for meeting verification.</p>
        </section>

        {/* SECTION 3: DISCUSSION NOTES */}
        <section className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-violet-50 dark:bg-violet-500/10 rounded-2xl text-violet-600">
              <Landmark size={22} />
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Meeting Intelligence</h2>
              <p className="text-xs text-gray-500 font-medium">Record key takeaways and strategies</p>
            </div>
          </div>
          <label className={labelCls}>Negotiation Notes</label>
          <textarea name="notes" value={formData.notes} onChange={handleChange} rows={4} className={`${inputCls} resize-none`} placeholder="Capture key discussion points and follow-up strategies..."></textarea>
        </section>

        {/* SUBMIT */}
        <div className="flex justify-end pt-4 pb-12">
          <Button type="submit" variant="primary" disabled={loading} className="px-12 py-5 rounded-3xl text-lg font-black shadow-2xl shadow-violet-500/20 w-full sm:w-auto bg-violet-600 hover:bg-violet-700 text-white transform active:scale-95 transition-all">
            {loading ? 'Committing...' : 'Log Opportunity'}
            {!loading && <ChevronRight className="ml-2 inline" />}
          </Button>
        </div>

      </form>
    </div>
  );
};

export default CollabVisitForm;
