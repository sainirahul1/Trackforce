import React, { useState } from 'react';
import { X, Plus, Loader2 } from 'lucide-react';

const CreateIssueModal = ({ onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    subject: '',
    priority: 'Medium',
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.subject || !formData.description) return;
    
    setIsSubmitting(true);
    try {
      await onCreate(formData);
    } finally {
      // If the parent component closes the modal on success, this might unmount before reaching here,
      // which is fine, but if it errors out, we want to stop loading.
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-[3rem] p-10 shadow-2xl border border-gray-100 dark:border-gray-800 animate-in zoom-in-95 duration-300 relative overflow-hidden text-left">
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
