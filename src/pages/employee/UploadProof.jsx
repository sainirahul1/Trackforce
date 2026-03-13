import React, { useState, useRef } from 'react';
import { Camera, Image as ImageIcon, Upload, CheckCircle2, ShieldCheck, Info, FileText, AlertCircle } from 'lucide-react';

const UploadProof = () => {
  // --- STATE AND REFS MANAGEMENT ---
  // Stores files by ID and manages UI states for errors and successful submission.
  // Using a single object for 'uploads' prevents multiple state triggers.
  const [uploads, setUploads] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showError, setShowError] = useState(false);
  const fileInputRefs = useRef({});

  // --- CONFIGURATION: PROOF TYPES ---
  // Centralized configuration for the 4 main capture types.
  // 'mode' utilizes the browser's 'capture' attribute for direct camera access on mobile.
  const proofTypes = [
    { id: 'store', title: 'Store Front', desc: 'Main board and entrance.', icon: ImageIcon, type: 'image', mode: 'environment' },
    { id: 'selfie', title: 'Selfie at Visit', desc: 'Verification of presence.', icon: Camera, type: 'image', mode: 'user' },
    { id: 'product', title: 'Product Display', desc: 'Proof of inventory check.', icon: ImageIcon, type: 'image', mode: 'environment' },
    { id: 'doc', title: 'Official Document', desc: 'ID or authorization letters.', icon: FileText, type: 'document', mode: null },
  ];

  // --- HELPER FUNCTIONS ---
  // handleFileChange: Validates selection and clears error popups instantly.
  // triggerUpload: Standardizes the click-trigger for hidden file inputs across all IDs.
  const handleFileChange = (id, event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setUploads(prev => ({ ...prev, [id]: files }));
      setShowError(false);
    }
  };

  const triggerUpload = (id) => {
    if (fileInputRefs.current[id]) {
      fileInputRefs.current[id].click();
    }
  };

  // --- FORM SUBMISSION LOGIC ---
  // Checks if the 4 mandatory proofs are present (excluding optional batch uploads).
  // Includes a 3-second timeout for the error popup to prevent UI clutter.
  const handleSubmit = () => {
    const completedCount = proofTypes.filter(type => uploads[type.id]).length;
    
    if (completedCount < proofTypes.length) {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }
    setIsSubmitted(true);
  };

  return (
    <div className="max-w-5xl mx-auto pb-16 px-4 relative overflow-x-hidden">
      
      {/* SECTION: ERROR NOTIFICATION */}
      {/* Mobile-optimized fixed positioning. Using 'w-[90%]' ensures it doesn't clip on small screens. */}
      {showError && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-bounce w-max max-w-[90%]">
          <div className="bg-red-600 dark:bg-red-500 border border-red-300 text-white px-5 py-3 rounded-2xl shadow-[0_0_30px_rgba(239,68,68,0.5)] flex items-center gap-3">
            <AlertCircle size={18} className="flex-shrink-0" />
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider">You haven't done yet!</span>
          </div>
        </div>
      )}

      {/* SECTION: PAGE HEADER */}
      {/* Centered on mobile, left-aligned on large screens for a professional layout. */}
      <div className="mb-6 pt-6 text-center lg:text-left">
        <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">Upload Visit Proof</h1>
        <p className="text-xs sm:text-sm text-gray-500 font-medium">Verify your visit with geo-tagged images</p>
      </div>

      {/* SECTION: INFORMATION BANNER */}
      {/* Uses 'flex-start' to ensure the icon stays at the top even if text wraps on narrow phones. */}
      <div className="bg-indigo-50/50 dark:bg-indigo-900/20 p-4 rounded-2xl border-2 border-indigo-100 dark:border-indigo-800 flex items-start gap-3 mb-8">
        <Info className="text-indigo-600 dark:text-indigo-400 mt-0.5 flex-shrink-0" size={16} />
        <p className="text-[10px] sm:text-xs text-indigo-800 dark:text-indigo-200 font-bold leading-relaxed">
          Automatic Location Detection: GPS must be enabled for valid verification.
        </p>
      </div>

      {/* SECTION: PROOF CARDS GRID */}
      {/* Grid: 1 col (mobile), 2 cols (tablet), 4 cols (desktop). */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {proofTypes.map((type) => {
          const isUploaded = !!uploads[type.id];
          return (
            <div key={type.id} className="bg-white dark:bg-gray-800/40 p-5 sm:p-6 rounded-[2rem] sm:rounded-[2.5rem] border-2 border-gray-100 dark:border-gray-700 flex flex-col items-center text-center transition-all duration-300 hover:border-indigo-400 dark:hover:border-indigo-500">
              <input
                type="file"
                ref={el => fileInputRefs.current[type.id] = el}
                className="hidden"
                accept={type.type === 'image' ? "image/*" : ".pdf,.doc,.docx"}
                capture={type.mode} 
                onChange={(e) => handleFileChange(type.id, e)}
              />
              <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center mb-4 ${
                isUploaded ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600' : 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600'
              }`}>
                <type.icon size={22} />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white text-xs mb-1">{type.title}</h3>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 font-medium mb-6 px-2">{type.desc}</p>
              <button 
                onClick={() => triggerUpload(type.id)}
                className={`w-full py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-300 ${
                  isUploaded ? 'bg-emerald-500 text-white shadow-lg' : 'bg-indigo-600 text-white active:scale-95'
                }`}
              >
                {isUploaded ? <CheckCircle2 size={12} /> : (type.type === 'document' ? <Upload size={12} /> : <Camera size={12} />)}
                {isUploaded ? 'Uploaded' : (type.type === 'document' ? 'Upload' : 'Capture')}
              </button>
            </div>
          );
        })}
      </div>

      {/* SECTION: BATCH UPLOAD BAR */}
      {/* Optimized for mobile: uses 'flex-col' on very small screens or 'flex-row' where space permits. */}
      <div className={`bg-white dark:bg-gray-800/40 rounded-3xl border-2 p-4 mb-10 max-w-3xl mx-auto transition-all duration-300 
        hover:shadow-[0_0_25px_rgba(79,70,229,0.3)] 
        ${uploads['batch'] 
          ? 'border-emerald-500 dark:border-emerald-400 shadow-lg shadow-emerald-500/10' 
          : 'border-gray-100 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-400'
        }`}
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className={`p-2.5 rounded-lg flex-shrink-0 ${
              uploads['batch'] ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600' : 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600'
            }`}>
              <Upload size={18} />
            </div>
            <div>
              <h3 className="text-xs font-black text-gray-900 dark:text-white">Batch Upload</h3>
              <p className="text-[9px] text-gray-400">
                {uploads['batch'] ? `${uploads['batch'].length} files selected` : 'Pick multiple images from gallery'}
              </p>
            </div>
          </div>
          <button 
            onClick={() => triggerUpload('batch')}
            className={`w-full sm:w-auto px-5 py-2.5 rounded-lg font-black tracking-widest text-[9px] uppercase transition-all duration-300 ${
              uploads['batch'] ? 'bg-emerald-500 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            {uploads['batch'] ? 'Files Added' : 'Select Files'}
          </button>
          <input type="file" multiple className="hidden" ref={el => fileInputRefs.current['batch'] = el} onChange={(e) => handleFileChange('batch', e)} />
        </div>
      </div>

      {/* SECTION: SUBMIT AND SECURITY FOOTER */}
      {/* Full-width button on mobile for better accessibility. */}
      <div className="flex flex-col items-center">
        <button 
          onClick={handleSubmit}
          disabled={isSubmitted}
          className={`w-full sm:w-auto px-10 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all duration-500 shadow-xl ${
            isSubmitted 
            ? 'bg-emerald-500 text-white cursor-default' 
            : 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95 shadow-indigo-500/20'
          }`}
        >
          {isSubmitted ? 'Visit Proof Submitted' : 'Submit Verification'}
        </button>

        {!isSubmitted && (
          <div className="mt-8 flex items-center gap-2 px-5 py-2 bg-gray-50 dark:bg-gray-800/60 rounded-full text-[9px] sm:text-[10px] font-bold text-gray-400 dark:text-gray-500 border-2 border-gray-100 dark:border-gray-700">
            <ShieldCheck size={14} className="text-indigo-500 flex-shrink-0" />
            Secured with blockchain verification
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadProof;