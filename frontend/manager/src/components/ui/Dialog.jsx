import React from 'react';
import { X, Trash2, Info, AlertTriangle, CheckCircle2, AlertCircle } from 'lucide-react';

const icons = {
  info:    { icon: Info,          color: 'text-blue-500',   bg: 'bg-blue-50',    border: 'border-blue-100',   glow: 'bg-blue-50/50' },
  warning: { icon: AlertTriangle, color: 'text-amber-500',  bg: 'bg-amber-50',   border: 'border-amber-100',  glow: 'bg-amber-50/50' },
  error:   { icon: AlertCircle,   color: 'text-rose-500',   bg: 'bg-rose-50',    border: 'border-rose-100',   glow: 'bg-rose-50/50' },
  success: { icon: CheckCircle2,  color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-100', glow: 'bg-emerald-50/50' },
  danger:  { icon: Trash2,        color: 'text-rose-500',   bg: 'bg-rose-50',    border: 'border-rose-100',   glow: 'bg-rose-50/50' },
};

const Dialog = ({ title, message, type = 'info', isConfirm = false, onConfirm, onClose }) => {
  const theme = icons[type] || icons.info;
  const IconComponent = theme.icon;

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      />
      <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] w-full max-w-md p-8 shadow-2xl border border-white/20 dark:border-gray-800 animate-in zoom-in-95 duration-300 relative z-10 overflow-hidden">
        <div className={`absolute top-0 right-0 w-32 h-32 ${theme.glow} dark:opacity-20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none`} />
        
        <div className="relative z-10 text-center space-y-6">
          <div className={`w-20 h-20 ${theme.bg} dark:bg-opacity-20 rounded-3xl flex items-center justify-center ${theme.color} mx-auto border ${theme.border} dark:border-opacity-30 shadow-inner`}>
            <IconComponent size={40} strokeWidth={1.5} />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{title}</h2>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {message}
            </p>
          </div>

          <div className="flex gap-4 pt-4">
            {isConfirm && (
              <button
                onClick={onClose}
                className="flex-1 py-4 rounded-2xl text-xs font-black uppercase tracking-widest border border-gray-100 dark:border-gray-800 text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all font-sans"
              >
                Cancel
              </button>
            )}
            <button
              onClick={onConfirm}
              className={`flex-1 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-white shadow-lg transition-all font-sans ${
                type === 'danger' || type === 'error' ? 'bg-rose-500 shadow-rose-200 dark:shadow-none hover:bg-rose-600' :
                type === 'success' ? 'bg-emerald-500 shadow-emerald-200 dark:shadow-none hover:bg-emerald-600' :
                'bg-indigo-600 shadow-indigo-200 dark:shadow-none hover:bg-indigo-700'
              }`}
            >
              {isConfirm ? (type === 'danger' ? 'Confirm Deletion' : 'Confirm') : 'OK'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dialog;
