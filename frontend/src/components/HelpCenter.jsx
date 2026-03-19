import React, { useState } from 'react';
import { HelpCircle, MessageSquare, Send, X, ShieldAlert, Building, User } from 'lucide-react';

const HelpCenter = ({ role }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedTarget, setSelectedTarget] = useState(null);

  if (role === 'superadmin') return null;

  const targets = {
    employee: [
      { id: 'manager', label: 'To Manager', icon: User, color: 'indigo' },
      { id: 'tenant', label: 'To Tenant', icon: Building, color: 'blue' },
      { id: 'superadmin', label: 'To Super Admin', icon: ShieldAlert, color: 'purple' },
    ],
    manager: [
      { id: 'tenant', label: 'To Tenant', icon: Building, color: 'blue' },
      { id: 'superadmin', label: 'To Super Admin', icon: ShieldAlert, color: 'purple' },
    ],
    tenant: [
      { id: 'superadmin', label: 'To Super Admin', icon: ShieldAlert, color: 'purple' },
    ],
  };

  const currentTargets = targets[role] || [];

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end">
      {/* Dropup Menu */}
      {isOpen && (
        <div className="mb-4 w-64 bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          <div className="p-6 border-b border-gray-50 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">Help Center</h3>
            <p className="text-[10px] text-gray-500 font-bold mt-1">Raise a concern to authorities</p>
          </div>
          
          {!showForm ? (
            <div className="p-2 space-y-1">
              {currentTargets.map((target) => (
                <button
                  key={target.id}
                  onClick={() => { setSelectedTarget(target); setShowForm(true); }}
                  className="w-full flex items-center gap-3 p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all group"
                >
                  <div className={`p-2 rounded-xl bg-${target.color}-50 text-${target.color}-600 dark:bg-opacity-10 transition-transform group-hover:scale-110`}>
                    <target.icon size={18} />
                  </div>
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-200">{target.label}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black text-indigo-600 uppercase tracking-widest">Raising to {selectedTarget.id}</span>
                <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={14} />
                </button>
              </div>
              <textarea 
                placeholder="Describe your issue..."
                className="w-full min-h-[100px] p-4 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 resize-none"
              />
              <button 
                onClick={() => { setIsOpen(false); setShowForm(false); }}
                className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
              >
                <Send size={14} />
                Submit Complaint
              </button>
            </div>
          )}
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => { setIsOpen(!isOpen); setShowForm(false); }}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all hover:scale-110 active:scale-95 ${
          isOpen ? 'bg-gray-900 text-white rotate-90' : 'bg-indigo-600 text-white'
        }`}
      >
        {isOpen ? <X size={24} /> : <HelpCircle size={28} />}
      </button>
    </div>
  );
};

export default HelpCenter;
