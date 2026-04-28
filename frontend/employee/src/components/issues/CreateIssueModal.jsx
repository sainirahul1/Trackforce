import React, { useState } from 'react';
import { X, Plus, Loader2, Camera, Check } from 'lucide-react';

const CreateIssueModal = ({ onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    subject: '',
    priority: 'Medium',
    description: '',
    image: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.subject || !formData.description || !formData.image) return;
    
    setIsSubmitting(true);
    try {
      await onCreate({
        ...formData,
        images: [formData.image]
      });
    } finally {
      // If the parent component closes the modal on success, this might unmount before reaching here,
      // which is fine, but if it errors out, we want to stop loading.
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-start md:items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300 overflow-y-auto">
      <div className="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-[3rem] p-8 md:p-10 shadow-2xl border border-gray-100 dark:border-gray-800 animate-in zoom-in-95 duration-300 relative overflow-hidden text-left my-auto">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-3xl rounded-full -mr-32 -mt-32"></div>
        
        <button 
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute top-8 right-8 p-3 text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-2xl transition-all disabled:opacity-50"
        >
          <X size={24} />
        </button>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-white shadow-xl shadow-indigo-500/20">
            <Plus size={32} />
          </div>
          <div>
            <h3 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Raise Issue</h3>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Submit a new support ticket</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Issue Subject</label>
              <input
                required
                type="text"
                placeholder="e.g. Device synchronization error"
                className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-indigo-500 rounded-3xl outline-none transition-all font-bold text-gray-900 dark:text-white"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Urgency Level</label>
              <select
                className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-indigo-500 rounded-3xl outline-none transition-all font-black uppercase text-[10px] tracking-widest text-indigo-600 appearance-none cursor-pointer disabled:opacity-50"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                disabled={isSubmitting}
              >
                <option value="Low">Low Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="High">High Priority</option>
                <option value="Critical">Critical Issue</option>
              </select>
            </div>
          </div>

          {/* VISUAL EVIDENCE CAPTURE */}
          <div className="space-y-4">
            <div className="flex items-center justify-between ml-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Visual Evidence Discovery *</label>
              {formData.image && (
                <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-full text-[8px] font-black uppercase tracking-widest border border-emerald-100 dark:border-emerald-800 animate-in zoom-in-95">
                  <Check size={10} /> Verified Capture
                </span>
              )}
            </div>

            <div className="grid grid-cols-1">
              <div 
                onClick={() => document.getElementById('issue-image-input').click()}
                className={`group relative aspect-[16/6] rounded-[2.5rem] border-4 border-dashed transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center gap-3
                  ${formData.image 
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 shadow-xl shadow-emerald-500/10' 
                    : 'border-gray-100 dark:border-gray-800 hover:border-indigo-400 bg-gray-50/50 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10'}`}
              >
                {formData.image ? (
                  <>
                    <img src={formData.image} alt="Evidence" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                      <div className="p-4 bg-white rounded-full text-indigo-600 shadow-2xl">
                        <Camera size={24} />
                      </div>
                      <p className="text-white text-[10px] font-black uppercase tracking-widest mt-4">Replace Proof</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-5 bg-white dark:bg-gray-800 rounded-3xl shadow-lg text-gray-400 group-hover:text-indigo-600 transition-all group-hover:scale-110 group-hover:-rotate-3">
                      <Camera size={32} />
                    </div>
                    <div>
                      <p className="text-gray-950 dark:text-white text-xs font-black uppercase tracking-widest text-center">Capture Incident Evidence</p>
                      <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest text-center mt-1">Proof of malfunction required</p>
                    </div>
                  </>
                )}
                <input 
                  id="issue-image-input"
                  type="file" 
                  accept="image/*" 
                  capture="environment"
                  className="hidden" 
                  onChange={handleFileChange} 
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Detailed Description</label>
            <textarea
              required
              rows={4}
              placeholder="Describe the problem in detail..."
              className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-indigo-500 rounded-[2rem] outline-none transition-all font-medium text-gray-600 dark:text-gray-300 resize-none disabled:opacity-50"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              disabled={isSubmitting}
            ></textarea>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 py-5 bg-gray-50 dark:bg-gray-800 text-gray-500 font-black uppercase tracking-widest rounded-3xl hover:bg-gray-100 transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-[2] flex items-center justify-center gap-2 py-5 bg-indigo-600 text-white font-black uppercase tracking-widest rounded-3xl hover:bg-indigo-700 shadow-xl shadow-indigo-500/30 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Submitting Ticket...
                </>
              ) : (
                'Submit Ticket'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateIssueModal;
