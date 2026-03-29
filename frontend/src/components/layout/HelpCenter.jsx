import React, { useState, useRef } from 'react';
import { HelpCircle, Send, X, ShieldAlert, Paperclip, Trash2, FileText, Image as ImageIcon } from 'lucide-react';

const HelpCenter = ({ role }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);

  if (role === 'superadmin') return null;

  const superAdminTarget = { id: 'superadmin', label: 'Super Admin', icon: ShieldAlert, color: 'text-purple-600', bgColor: 'bg-purple-50' };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.values || e.target.files);
    setFiles(prev => [...prev, ...selectedFiles]);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (file) => {
    if (file.type.startsWith('image/')) return <ImageIcon size={16} />;
    return <FileText size={16} />;
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <div className="fixed bottom-8 right-8 z-[150] flex flex-col items-end">
        <button
          onClick={() => { setIsOpen(!isOpen); if (!isOpen) setFiles([]); }}
          className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all hover:scale-110 active:scale-95 ${
            isOpen ? 'bg-gray-900 text-white rotate-90' : 'bg-indigo-600 text-white'
          }`}
        >
          {isOpen ? <X size={24} /> : <HelpCircle size={28} />}
        </button>
      </div>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 md:p-8 animate-in fade-in duration-300">
          <div 
            className="absolute inset-0 bg-gray-900/60 backdrop-blur-md"
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="relative bg-white dark:bg-gray-900 w-full max-w-lg rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-500">
            <div className="h-2 w-full bg-indigo-600"></div>
            <div className="p-8 space-y-8">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-3xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 shadow-sm">
                    <HelpCircle size={32} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Help Center</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Raise a formal concern</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <div className={`p-2 rounded-lg ${superAdminTarget.bgColor} ${superAdminTarget.color}`}>
                        <superAdminTarget.icon size={14} />
                     </div>
                     <span className="text-xs font-black text-indigo-600 uppercase tracking-widest">Raising concern to {superAdminTarget.label}</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <textarea 
                    placeholder="Describe your issue or concern in detail. This information will be sent directly to the Super Admin for review."
                    className="w-full min-h-[120px] p-6 bg-gray-50 dark:bg-gray-800 border-none rounded-[2rem] text-sm focus:ring-2 focus:ring-indigo-500 resize-none font-medium placeholder:text-gray-400"
                  />
                  
                  {/* File Upload Section */}
                  <div className="space-y-3">
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      multiple
                      className="hidden"
                    />
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-all border border-indigo-100/50 dark:border-indigo-800/50"
                    >
                      <Paperclip size={14} />
                      Attach Documents
                    </button>

                    {files.length > 0 && (
                      <div className="grid grid-cols-1 gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                        {files.map((file, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800 group">
                            <div className="flex items-center gap-3 overflow-hidden">
                              <div className="p-2 bg-white dark:bg-gray-800 rounded-lg text-gray-400">
                                {getFileIcon(file)}
                              </div>
                              <span className="text-xs font-bold text-gray-600 dark:text-gray-300 truncate">{file.name}</span>
                            </div>
                            <button 
                              onClick={() => removeFile(idx)}
                              className="p-1.5 text-gray-400 hover:text-rose-500 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <button 
                  onClick={() => setIsOpen(false)}
                  className="w-full py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black uppercase tracking-widest text-xs shadow-lg shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                >
                  <Send size={16} />
                  Submit Formal Complaint
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HelpCenter;
