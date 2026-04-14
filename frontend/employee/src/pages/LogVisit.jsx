import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Store, Building2, Briefcase, ShieldCheck, ChevronRight } from 'lucide-react';
import StoreVisitForm from './StoreVisitForm';
import SupplierVisitForm from './SupplierVisitForm';
import CollabVisitForm from './CollabVisitForm';
import AppInstallForm from './AppInstallForm';

const tabs = [
  {
    id: 'store',
    label: 'Store Visit',
    icon: Store,
    accent: 'indigo',
    activeBg: 'bg-indigo-600',
    activeText: 'text-indigo-600',
    iconBg: 'bg-indigo-50 dark:bg-indigo-500/10',
    dot: 'bg-indigo-500',
  },
  {
    id: 'supplier',
    label: 'Supplier Visit',
    icon: Building2,
    accent: 'blue',
    activeBg: 'bg-blue-600',
    activeText: 'text-blue-600',
    iconBg: 'bg-blue-50 dark:bg-blue-500/10',
    dot: 'bg-blue-500',
  },
  {
    id: 'collab',
    label: 'Business Collab',
    icon: Briefcase,
    accent: 'violet',
    activeBg: 'bg-violet-600',
    activeText: 'text-violet-600',
    iconBg: 'bg-violet-50 dark:bg-violet-500/10',
    dot: 'bg-violet-500',
  },
  {
    id: 'app',
    label: 'App Installs',
    icon: ShieldCheck,
    accent: 'emerald',
    activeBg: 'bg-emerald-600',
    activeText: 'text-emerald-600',
    iconBg: 'bg-emerald-50 dark:bg-emerald-500/10',
    dot: 'bg-emerald-500',
  },
];

const FORMS = {
  store: <StoreVisitForm isEmbedded={true} />,
  supplier: <SupplierVisitForm isEmbedded={true} />,
  collab: <CollabVisitForm isEmbedded={true} />,
  app: <AppInstallForm isEmbedded={true} />,
};

const LogVisit = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const defaultTab = queryParams.get('type') || 'store';
  const [activeTab, setActiveTab] = useState(defaultTab);

  const handleTabChange = (id) => {
    setActiveTab(id);
    navigate(`?type=${id}`, { replace: true });
  };

  const activeTabData = tabs.find(t => t.id === activeTab);

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6 lg:px-8 min-h-screen">

      {/* Header */}
      <div className="mb-6 animate-in fade-in slide-in-from-top-4 duration-500">
        <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
          Field Activity Log
        </h1>
        <p className="text-xs text-gray-400 font-bold uppercase tracking-[0.2em] mt-1">
          Select Mission Type
        </p>
      </div>

      {/* Big Tab Navigation — High visibility segmented control */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mb-8 p-1.5 bg-gray-50 dark:bg-gray-900/50 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-inner">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex flex-col items-center justify-center gap-2 px-3 py-5 rounded-[1.6rem] transition-all duration-300 relative overflow-hidden group
                ${isActive
                  ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-xl border border-gray-100 dark:border-gray-700'
                  : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-800/30'
                }`}
            >
              <div className={`p-2.5 rounded-2xl transition-all duration-300 ${isActive ? tab.iconBg : 'bg-transparent group-hover:bg-gray-200/50 dark:group-hover:bg-gray-700/50'}`}>
                <Icon size={24} className={isActive ? tab.activeText : 'text-gray-400'} />
              </div>
              <span className={`text-[11px] font-black uppercase tracking-tight text-center leading-none ${isActive ? 'text-gray-900 dark:text-white' : ''}`}>
                {tab.label}
              </span>
              
              {isActive && (
                <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 rounded-t-full ${tab.accent === 'indigo' ? 'bg-indigo-600' : tab.accent === 'blue' ? 'bg-blue-600' : tab.accent === 'violet' ? 'bg-violet-600' : 'bg-emerald-600'}`} />
              )}
            </button>
          );
        })}
      </div>

      {/* Active Selection Strip — Enhanced Readability */}
      <div className={`flex items-center gap-4 px-6 py-5 rounded-[2rem] mb-8 border transition-all duration-500 ${activeTabData?.iconBg} border-gray-200/50 dark:border-gray-800 backdrop-blur-sm shadow-sm`}>
        <div className={`w-2.5 h-2.5 rounded-full ${activeTabData?.dot} animate-pulse shadow-sm`} />
        <div className="flex-1">
          <p className={`text-xs font-bold uppercase tracking-[0.15em] mb-1 ${activeTabData?.activeText}`}>
            Now Logging: {activeTabData?.label}
          </p>
          <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 leading-tight">
            Mission focused interface for {activeTabData?.label.toLowerCase()} reports.
          </p>
        </div>
      </div>

      {/* Form Container */}
      <div key={activeTab} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
        {FORMS[activeTab]}
      </div>
    </div>
  );
};

export default LogVisit;
