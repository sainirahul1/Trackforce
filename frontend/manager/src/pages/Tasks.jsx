import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Send, User, MapPin, Target, Calendar, Edit3, Plus,
  Trash2, Clock, CheckCircle2, Navigation, Search, Edit2, Save, X
} from 'lucide-react';
import { getTasks, createTask, deleteTask, updateTask } from '../services/taskService';
import { useDialog } from '../context/DialogContext';
import tenantService from '../services/core/tenantService';
import { logActivity } from '../services/activityService';
import { useGoogleMaps } from '../context/GoogleMapsContext';
import { GoogleMap, MarkerF, Autocomplete } from '@react-google-maps/api';

const ManagerTasks = () => {
  const { setPageLoading } = useOutletContext();
  const { showAlert, showConfirm } = useDialog();
  const { isLoaded } = useGoogleMaps();

  const [tasks, setTasks] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('assign');
  const [editingDateTaskId, setEditingDateTaskId] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);

  const [form, setForm] = useState({
    employee: '',
    store: '',
    type: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    title: 'Field Op', // Required by backend but we'll autogenerate contextually if missing
    coords: { lat: 17.4473, lng: 78.3787 } // Default coordinates (Gachibowli)
  });

  const [errors, setErrors] = useState({});
  const [showMap, setShowMap] = useState(false);
  const [pinConfirmed, setPinConfirmed] = useState(false);
  const geocodeTimeoutRef = useRef(null);
  const mapRef = useRef(null);
  const autocompleteRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [fetchedTasks, fetchedEmployees] = await Promise.all([
        getTasks(false),
        tenantService.getEmployees()
      ]);
      setTasks(fetchedTasks.map(t => ({
        ...t,
        id: t._id,
        assigneeName: t.employee?.name || fetchedEmployees.find(e => e._id === (t.employee?._id || t.employee))?.name || 'Unassigned',
      })));
      setTeamMembers(fetchedEmployees || []);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
      if (setPageLoading) setPageLoading(false);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.employee) newErrors.employee = 'Select an employee';
    if (!form.store.trim()) newErrors.store = 'Location is required';
    // Type and Date are now optional
    return newErrors;
  };

  const geocodeLocation = useCallback((locationName, immediate = false) => {
    if (!isLoaded || !locationName.trim() || !window.google) return;
    if (geocodeTimeoutRef.current) clearTimeout(geocodeTimeoutRef.current);

    const performGeocode = () => {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: locationName }, (results, status) => {
        if (status === 'OK' && results[0]) {
          const loc = results[0].geometry.location;
          const newCoords = { lat: loc.lat(), lng: loc.lng() };
          setForm(prev => ({ 
            ...prev, 
            coords: newCoords,
            store: results[0].formatted_address || prev.store
          }));
          if (mapRef.current) mapRef.current.panTo(newCoords);
          // Auto-open the map and confirm when geocode succeeds
          setShowMap(true);
          setPinConfirmed(true);
        }
      });
    };

    if (immediate) {
      performGeocode();
    } else {
      geocodeTimeoutRef.current = setTimeout(performGeocode, 700);
    }
  }, [isLoaded]);

  const onPlaceChanged = () => {
    if (autocompleteRef.current !== null) {
      const place = autocompleteRef.current.getPlace();
      
      if (!place || !place.geometry || !place.geometry.location) {
        console.warn('[MAP SEARCH] Selected place has no geometry. This often happens if Google Billing is not enabled or the result is invalid.');
        return;
      }

      if (place.geometry && place.geometry.location) {
        const newCoords = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        };
        
        // Update both the coords and the store name
        setForm(prev => ({ 
          ...prev, 
          coords: newCoords,
          store: place.name || place.formatted_address || prev.store
        }));
        
        if (mapRef.current) {
          mapRef.current.panTo(newCoords);
          mapRef.current.setZoom(16);
        }
        setPinConfirmed(true);
      }
    }
  };

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
    if (field === 'store') geocodeLocation(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);
    try {
      // Auto-generate title based on type and store for backend requirements
      const payload = {
        ...form,
        title: form.type ? `${form.type} - ${form.store}` : `Location: ${form.store}`,
        priority: 'medium',
        status: 'pending',
        coords: { x: form.coords.lat, y: form.coords.lng }
      };

      const created = await createTask(payload);
      
      const employeeName = teamMembers.find(m => m._id === created.employee || m._id === form.employee)?.name || 'Unassigned';
      
      setTasks(prev => [
        {
          ...created,
          id: created._id,
          assigneeName: employeeName,
        },
        ...prev,
      ]);

      try {
        logActivity('task_assigned', `Dispatched ${employeeName} to ${form.store} for ${form.type}`);
      } catch (logErr) {
        // ignore
      }

      setForm({
        employee: '',
        store: '',
        type: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
        title: 'Field Op',
        coords: { lat: 17.4473, lng: 78.3787 }
      });
      setShowMap(false);
      setPinConfirmed(false);
      showAlert('Success', 'Mission successfully dispatched.', 'success');
    } catch (err) {
      showAlert('Error', err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, taskName) => {
    const confirmed = await showConfirm(
      "Cancel Mission",
      "Are you sure you want to cancel this dispatch?",
      "Cancel Dispatch",
      "Keep",
      "danger"
    );
    
    if (confirmed) {
      try {
        await deleteTask(id);
        setTasks(prev => prev.filter(t => t.id !== id));
        logActivity('task_deleted', `Cancelled mission: ${taskName}`);
      } catch (err) {
        showAlert('Error', err.message, 'error');
      }
    }
  };

  const handleUpdateDate = async (taskId, newDate) => {
    try {
      await updateTask(taskId, { date: newDate });
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, date: newDate } : t));
      setEditingDateTaskId(null);
      showAlert('Success', 'Mission rescheduled successfully', 'success');
    } catch (error) {
      showAlert('Error', 'Failed to update date', 'error');
    }
  };

  const handleInitiateEdit = (task) => {
    setForm({
      employee: task.employee?._id || task.employee,
      store: task.store || '',
      type: task.type || '',
      date: task.date ? new Date(task.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      description: task.description || '',
      title: task.title || '',
      coords: task.coords ? { lat: task.coords.x, lng: task.coords.y } : { lat: 17.4473, lng: 78.3787 }
    });
    setEditingTaskId(task.id);
    setIsEditModalOpen(true);
    setPinConfirmed(!!task.coords);
    setShowMap(!!task.coords);
  };

  const handleUpdateMission = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        title: form.type ? `${form.type} - ${form.store}` : `Location: ${form.store}`,
        coords: { x: form.coords.lat, y: form.coords.lng }
      };

      const updated = await updateTask(editingTaskId, payload);
      
      const employeeName = teamMembers.find(m => m._id === (updated.employee?._id || updated.employee))?.name || 'Unassigned';
      
      setTasks(prev => prev.map(t => t.id === editingTaskId ? {
        ...updated,
        id: updated._id,
        assigneeName: employeeName
      } : t));

      setIsEditModalOpen(false);
      setEditingTaskId(null);
      showAlert('Success', 'Mission updated successfully', 'success');
      
      // Reset form
      setForm({
        employee: '',
        store: '',
        type: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
        title: 'Field Op',
        coords: { lat: 17.4473, lng: 78.3787 }
      });
    } catch (err) {
      showAlert('Error', err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 animate-pulse">
        <div className="w-12 h-12 rounded-full border-4 border-indigo-100 dark:border-indigo-900/30 border-t-indigo-600 animate-spin mb-4" />
        <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Loading Dispatches...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-700 max-w-4xl mx-auto pb-20">
      
      {/* Centered Tab Navigation */}
      <div className="flex justify-center mb-8">
        <div className="bg-gray-100/50 dark:bg-gray-800/80 p-2 rounded-2xl flex items-center border border-gray-200/50 dark:border-gray-700 shadow-inner">
          <button 
            onClick={() => setActiveTab('assign')}
            className={`px-8 py-3 rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center gap-2.5 focus:outline-none ${activeTab === 'assign' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 scale-[1.02]' : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-200/50 dark:hover:bg-gray-700/50'}`}
          >
            <Send size={16} className={activeTab === 'assign' ? 'text-indigo-200' : ''} /> New Dispatch
          </button>
          <div className="w-1" />
          <button 
            onClick={() => setActiveTab('list')}
            className={`px-8 py-3 rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center gap-2.5 focus:outline-none ${activeTab === 'list' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 scale-[1.02]' : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-200/50 dark:hover:bg-gray-700/50'}`}
          >
            <Navigation size={16} className={activeTab === 'list' ? 'text-indigo-200' : ''} /> Active Dispatches
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto w-full">
        
        {/* --- DISPATCH FORM --- */}
        {activeTab === 'assign' && (
        <div className="border border-gray-100 dark:border-gray-800 rounded-[2.5rem] bg-white dark:bg-gray-900 shadow-lg shadow-indigo-500/5 overflow-hidden flex flex-col animate-in slide-in-from-bottom-4 fade-in duration-500">
          <div className="p-8 border-b border-gray-50 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-5">
               <Send size={100} />
             </div>
             <h2 className="text-xl font-black text-gray-900 dark:text-white relative z-10 flex items-center gap-2">
               <Plus className="text-indigo-600" /> New Dispatch
             </h2>
          </div>
          
          <form onSubmit={handleSubmit} className="p-8 space-y-6 flex-1 bg-white dark:bg-gray-900">
            {/* Employee */}
            <div className="space-y-2">
              <label className="flex items-center justify-between text-xs font-bold text-gray-700 dark:text-gray-300">
                <span className="flex items-center gap-2"><User size={14} className="text-indigo-500" /> Target Executive</span>
                <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={form.employee}
                  onChange={e => handleChange('employee', e.target.value)}
                  className={`w-full appearance-none px-5 py-4 bg-gray-50/50 hover:bg-gray-50 dark:bg-gray-800/50 dark:hover:bg-gray-800 border rounded-2xl text-sm font-bold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer ${errors.employee ? 'border-rose-400 focus:ring-rose-500/20 focus:border-rose-500' : 'border-gray-200 dark:border-gray-700'} ${!form.employee ? 'text-gray-400' : ''}`}
                >
                  <option value="" disabled>Select Executive...</option>
                  {teamMembers.map(m => (
                    <option key={m._id} value={m._id}>{m.name}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-focus-within:text-indigo-500 transition-colors">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </div>
              </div>
              {errors.employee && <p className="text-[10px] font-bold text-rose-500 animate-in slide-in-from-top-1">{errors.employee}</p>}
            </div>


              {/* Target Location */}
            <div className="space-y-3">
              <label className="flex items-center justify-between text-xs font-bold text-gray-700 dark:text-gray-300">
                <span className="flex items-center gap-2"><MapPin size={14} className="text-emerald-500" /> Target Location</span>
                <span className="text-rose-500">*</span>
              </label>

              {/* Input row */}
              <input
                type="text"
                value={form.store}
                onChange={e => handleChange('store', e.target.value)}
                placeholder="e.g. Reliance Smart, Gachibowli"
                className={`w-full px-5 py-3.5 bg-gray-50/50 hover:bg-gray-50 dark:bg-gray-800/50 dark:hover:bg-gray-800 border rounded-2xl text-sm font-bold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-gray-300 dark:placeholder:text-gray-600 ${errors.store ? 'border-rose-400' : 'border-gray-200 dark:border-gray-700'}`}
              />

              {/* Action row with Mark button and pinned badge */}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    if (!showMap && form.store.trim()) {
                      geocodeLocation(form.store, true);
                    }
                    setShowMap(v => !v);
                  }}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                    pinConfirmed
                      ? 'bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-900/20 dark:border-rose-800'
                      : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700'
                  }`}
                >
                  <MapPin size={12} className={pinConfirmed ? 'fill-rose-400' : ''} />
                  {pinConfirmed ? 'Change Location' : 'Mark on Map'}
                </button>

                {pinConfirmed && (
                  <div className="flex items-center gap-2 text-[10px] font-black text-rose-500 uppercase tracking-widest animate-in fade-in slide-in-from-right-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                    Location Fixed
                  </div>
                )}
              </div>

              {errors.store && <p className="text-[10px] font-bold text-rose-500">{errors.store}</p>}

              {/* Pinned coordinate badge */}
              {pinConfirmed && (
                <div className="flex items-center gap-2 text-[10px] font-black text-rose-500 uppercase tracking-widest animate-in slide-in-from-top-2 duration-300">
                  <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  Pinned: {form.coords.lat.toFixed(5)}, {form.coords.lng.toFixed(5)}
                </div>
              )}

              {/* Toggleable Map */}
              {isLoaded && showMap && (
                <div className="space-y-2 animate-in slide-in-from-top-4 duration-500">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Map Selection</span>
                    <span className="text-[9px] font-bold text-rose-500 flex items-center gap-1.5">
                      <div className="w-1 h-1 rounded-full bg-rose-500 animate-pulse" /> Live Preview
                    </span>
                  </div>
                  <div className="w-full h-64 rounded-2xl overflow-hidden border border-rose-200 dark:border-rose-900/50 shadow-xl relative group">
                    {/* Integrated Map Search (Autocomplete) */}
                    <div className="absolute top-4 left-4 right-4 z-10">
                      <Autocomplete
                        onLoad={(ref) => { autocompleteRef.current = ref; }}
                        onPlaceChanged={onPlaceChanged}
                      >
                        <div className="relative group/search">
                          <input
                            type="text"
                            placeholder="Search exact location..."
                            className="w-full px-12 py-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border border-white dark:border-gray-800 rounded-xl text-xs font-bold text-gray-900 dark:text-white shadow-2xl outline-none focus:ring-2 focus:ring-rose-500/50 transition-all placeholder:text-gray-400"
                            onClick={(e) => e.stopPropagation()}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                geocodeLocation(e.target.value, true);
                              }
                            }}
                          />
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within/search:text-rose-500 transition-colors">
                            <Search size={14} />
                          </div>
                        </div>
                      </Autocomplete>
                    </div>

                    <GoogleMap
                      mapContainerStyle={{ width: '100%', height: '100%' }}
                      zoom={14}
                      center={form.coords}
                      options={{ mapTypeControl: false, streetViewControl: false, disableDefaultUI: true }}
                      onLoad={(map) => { mapRef.current = map; }}
                      onClick={(e) => {
                        const coords = { lat: e.latLng.lat(), lng: e.latLng.lng() };
                        handleChange('coords', coords);
                        setPinConfirmed(true);

                        // Reverse Geocode to update the input field with a human-readable address
                        if (window.google) {
                          const geocoder = new window.google.maps.Geocoder();
                          geocoder.geocode({ location: coords }, (results, status) => {
                            if (status === 'OK' && results[0]) {
                              setForm(prev => ({ ...prev, store: results[0].formatted_address }));
                            }
                          });
                        }
                      }}
                    >
                      <MarkerF
                        position={form.coords}
                        icon={{
                          path: window.google.maps.SymbolPath.CIRCLE,
                          scale: 10,
                          fillColor: '#ef4444',
                          fillOpacity: 1,
                          strokeWeight: 3,
                          strokeColor: '#fff'
                        }}
                      />
                    </GoogleMap>
                    
                    <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest text-rose-600 shadow-sm border border-rose-100 dark:border-rose-900/50 flex items-center gap-1.5 pointer-events-none">
                      Tap anywhere to refine pin
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Mission Type (Optional) */}
              <div className="space-y-2">
                <label className="flex items-center justify-between text-xs font-bold text-gray-700 dark:text-gray-300">
                  <span className="flex items-center gap-2"><Target size={14} className="text-rose-500" /> Mission Type</span>
                  <span className="text-[10px] text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-md">Optional</span>
                </label>
                <div className="relative">
                  <select
                    value={form.type}
                    onChange={e => handleChange('type', e.target.value)}
                    className={`w-full appearance-none px-5 py-4 bg-gray-50/50 hover:bg-gray-50 dark:bg-gray-800/50 dark:hover:bg-gray-800 border rounded-2xl text-sm font-bold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer ${errors.type ? 'border-rose-400 focus:ring-rose-500/20 focus:border-rose-500' : 'border-gray-200 dark:border-gray-700'} ${!form.type ? 'text-gray-400' : ''}`}
                  >
                    <option value="" disabled>Select Type...</option>
                    <option value="Store Visit">Store Visit</option>
                    <option value="Supplier Visit">Supplier Visit</option>
                    <option value="Collaboration">Collaboration</option>
                    <option value="Delivery">Delivery</option>
                    <option value="Other">Other</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-focus-within:text-indigo-500 transition-colors">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                  </div>
                </div>
              </div>

              {/* Date (Optional) */}
              <div className="space-y-2">
                <label className="flex items-center justify-between text-xs font-bold text-gray-700 dark:text-gray-300">
                  <span className="flex items-center gap-2"><Calendar size={14} className="text-blue-500" /> Execution Date</span>
                  <span className="text-[10px] text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-md">Optional</span>
                </label>
                <input
                  type="date"
                  value={form.date}
                  onChange={e => handleChange('date', e.target.value)}
                  className={`w-full px-5 py-4 bg-gray-50/50 hover:bg-gray-50 dark:bg-gray-800/50 dark:hover:bg-gray-800 border rounded-2xl text-sm font-bold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all ${errors.date ? 'border-rose-400 focus:ring-rose-500/20 focus:border-rose-500' : 'border-gray-200 dark:border-gray-700'} ${!form.date ? 'text-gray-400' : ''}`}
                />
              </div>
            </div>

            {/* Specific Note (Optional) */}
            <div className="space-y-2 border-t border-gray-100 dark:border-gray-800 pt-6 mt-6">
              <label className="flex items-center justify-between text-xs font-bold text-gray-700 dark:text-gray-300">
                <span className="flex items-center gap-2"><Edit3 size={14} className="text-amber-500" /> Protocol Notes</span>
                <span className="text-[10px] text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-md">Optional</span>
              </label>
              <textarea
                value={form.description}
                onChange={e => handleChange('description', e.target.value)}
                placeholder="Specific instructions for this location..."
                rows="3"
                className="w-full px-5 py-4 bg-gray-50/50 hover:bg-gray-50 dark:bg-gray-800/50 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm font-bold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none placeholder:text-gray-300 dark:placeholder:text-gray-600 shadow-inner"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className={`w-full py-4 rounded-2xl relative overflow-hidden group border border-transparent shadow-[0_0_40px_-10px_rgba(79,70,229,0.4)] transition-all flex justify-center items-center gap-3 active:scale-95 mt-4 ${submitting ? 'bg-indigo-400 opacity-80 cursor-wait' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-500/40'}`}
            >
              <Send size={18} className="text-white" />
              <span className="text-xs font-black uppercase tracking-[0.2em] text-white">
                {submitting ? 'Dispatching...' : 'Dispatch Now'}
              </span>
            </button>
          </form>
        </div>
        )}

        {/* --- ACTIVE DISPATCHES --- */}
        {activeTab === 'list' && (
        <div className="border border-gray-100 dark:border-gray-800 rounded-[2.5rem] bg-white dark:bg-gray-900 shadow-lg shadow-indigo-500/5 flex flex-col max-h-[85vh] animate-in slide-in-from-bottom-4 fade-in duration-500">
          <div className="p-8 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between">
            <h2 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-3">
              <Navigation className="text-indigo-600" /> Active Dispatches
            </h2>
            <div className="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest">
              {tasks.length} Operations Logging
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4">
            {tasks.length > 0 ? tasks.map(task => (
              <div key={task.id} className="p-6 bg-gray-50/50 dark:bg-gray-800/20 border border-gray-100 dark:border-gray-800 rounded-[2rem] hover:border-indigo-100 dark:hover:border-indigo-500/30 transition-all group flex flex-col md:flex-row md:items-center justify-between gap-6">
                
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 flex items-center justify-center text-indigo-600 shrink-0 shadow-sm group-hover:scale-110 transition-transform">
                    {task.status === 'completed' ? <CheckCircle2 size={24} className="text-emerald-500" /> : <Clock size={24} />}
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-black text-gray-900 dark:text-white capitalize">{task.store || (task.title?.includes('Location:') ? task.title.split('Location:')[1].trim() : task.title?.split('-')[1]?.trim()) || task.title}</h3>
                    <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1.5"><Target size={12} className="text-rose-400" /> {task.type || (task.title?.includes('-') ? task.title.split('-')[0].trim() : 'General Ops')}</span>
                      <span className="text-gray-300 dark:text-gray-600">•</span>
                      <span className="flex items-center gap-1.5"><User size={12} className="text-indigo-400" /> {task.assigneeName}</span>
                    </div>
                    {task.description && (
                      <p className="mt-2 text-xs font-medium text-gray-500 dark:text-gray-400 leading-relaxed max-w-lg">
                        {task.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0 border-t md:border-t-0 md:border-l border-gray-100 dark:border-gray-800 pt-4 md:pt-0 md:pl-6">
                  <div className="text-right flex-1 md:flex-none min-w-[100px]">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 flex items-center justify-end gap-2 group/date">
                      Target Date 
                      {editingDateTaskId !== task.id && (
                        <button 
                          onClick={() => setEditingDateTaskId(task.id)}
                          className="p-1 px-1.5 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-md transition-all hover:scale-110"
                          title="Reschedule Mission"
                        >
                          <Edit2 size={12} />
                        </button>
                      )}
                    </p>
                    
                    {editingDateTaskId === task.id ? (
                      <div className="flex items-center gap-2 animate-in fade-in zoom-in-95">
                        <input 
                          type="date"
                          defaultValue={task.date ? new Date(task.date).toISOString().split('T')[0] : ''}
                          onChange={(e) => handleUpdateDate(task.id, e.target.value)}
                          className="bg-white dark:bg-gray-800 border border-indigo-200 dark:border-indigo-900 rounded-lg px-2 py-1 text-xs font-bold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20"
                          autoFocus
                          onBlur={() => setEditingDateTaskId(null)}
                        />
                      </div>
                    ) : (
                      <p className="text-sm font-black text-gray-900 dark:text-white">
                        {task.date ? new Date(task.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'Not Set'}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleInitiateEdit(task)}
                      className="p-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl text-indigo-600 hover:text-indigo-700 hover:border-indigo-200 dark:hover:border-indigo-900/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all"
                      title="Edit Mission"
                    >
                      <Plus size={16} className="rotate-45" /> {/* Using Plus rotated as a generic edit/action icon for now, or I'll use Edit3 if available */}
                      <Edit3 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(task.id, task.title || task.store)}
                      className="p-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl text-gray-400 hover:text-rose-500 hover:border-rose-200 dark:hover:border-rose-900/50 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all"
                      title="Cancel Dispatch"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

              </div>
            )) : (
              <div className="h-full flex flex-col items-center justify-center py-20 opacity-50">
                <Navigation size={48} className="text-gray-300 mb-6" />
                <p className="text-[12px] font-black text-gray-400 uppercase tracking-[0.2em]">No Active Dispatches</p>
                <p className="text-xs font-bold text-gray-400 mt-2">Use the form to assign a new location.</p>
              </div>
            )}
          </div>
        </div>
        )}
        
      </div>
      
      {/* --- EDIT MISSION OVERLAY --- */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-gray-900 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-gray-800 animate-in slide-in-from-bottom-8 duration-500 flex flex-col">
            <div className="p-8 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between sticky top-0 bg-white dark:bg-gray-900 z-20">
              <div>
                <h2 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                  <Edit3 className="text-indigo-600" /> Edit Mission
                </h2>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Update dispatch details</p>
              </div>
              <button 
                onClick={() => { setIsEditModalOpen(false); setEditingTaskId(null); }}
                className="p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleUpdateMission} className="p-8 space-y-8">
              {/* Reuse Form Logic for Employee Selection */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-bold text-gray-700 dark:text-gray-300">
                  <User size={14} className="text-indigo-500" /> Assigned Executive
                </label>
                <div className="relative">
                  <select
                    value={form.employee}
                    onChange={e => handleChange('employee', e.target.value)}
                    className="w-full appearance-none px-5 py-4 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm font-bold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all cursor-pointer"
                  >
                    <option value="" disabled>Select Employee...</option>
                    {teamMembers.map(member => (
                      <option key={member._id} value={member._id}>{member.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Reuse Location/Map logic */}
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-xs font-bold text-gray-700 dark:text-gray-300">
                  <MapPin size={14} className="text-rose-500" /> Target Location
                </label>
                <div className="relative group">
                  <input
                    type="text"
                    value={form.store}
                    onChange={e => handleChange('store', e.target.value)}
                    placeholder="Search or type location..."
                    className="w-full px-5 py-4 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm font-bold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-rose-500/20 transition-all shadow-inner"
                  />
                </div>

                {isLoaded && showMap && (
                  <div className="w-full h-56 rounded-2xl overflow-hidden border border-rose-200 dark:border-rose-900/50 relative">
                    <GoogleMap
                      mapContainerStyle={{ width: '100%', height: '100%' }}
                      zoom={15}
                      center={form.coords}
                      options={{ mapTypeControl: false, streetViewControl: false, disableDefaultUI: true }}
                      onLoad={(map) => { mapRef.current = map; }}
                      onClick={(e) => {
                        const coords = { lat: e.latLng.lat(), lng: e.latLng.lng() };
                        handleChange('coords', coords);
                        
                        // Reverse Geocode
                        if (window.google) {
                          const geocoder = new window.google.maps.Geocoder();
                          geocoder.geocode({ location: coords }, (results, status) => {
                            if (status === 'OK' && results[0]) {
                              setForm(prev => ({ ...prev, store: results[0].formatted_address }));
                            }
                          });
                        }
                      }}
                    >
                      <MarkerF position={form.coords} />
                    </GoogleMap>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Target size={14} className="text-rose-500" /> Type
                  </label>
                  <select
                    value={form.type}
                    onChange={e => handleChange('type', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold text-gray-900 dark:text-white"
                  >
                    <option value="Store Visit">Store Visit</option>
                    <option value="Supplier Visit">Supplier Visit</option>
                    <option value="Collaboration">Collaboration</option>
                    <option value="Delivery">Delivery</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Calendar size={14} className="text-blue-500" /> Date
                  </label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={e => handleChange('date', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2"
              >
                {submitting ? 'Updating...' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerTasks;
