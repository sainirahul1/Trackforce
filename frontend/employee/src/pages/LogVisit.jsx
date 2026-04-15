import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Store, Building2, Briefcase, ShieldCheck, Activity, Target } from 'lucide-react';
import StoreVisitForm from './StoreVisitForm';
import SupplierVisitForm from './SupplierVisitForm';
import CollabVisitForm from './CollabVisitForm';
import AppInstallForm from './AppInstallForm';

const tabs = [
  {
    id: 'store',
    label: 'Store Visit',
    icon: Store,
    gradient: 'from-indigo-600 to-violet-600',
    shadow: 'shadow-indigo-500/20',
    iconColor: 'text-indigo-600 dark:text-indigo-400',
    bgColor: 'bg-indigo-50 dark:bg-indigo-500/10',
  },
  {
    id: 'supplier',
    label: 'Supplier',
    icon: Building2,
    gradient: 'from-blue-600 to-cyan-600',
    shadow: 'shadow-blue-500/20',
    iconColor: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-500/10',
  },
  {
    id: 'collab',
    label: 'Collab',
    icon: Briefcase,
    gradient: 'from-violet-600 to-fuchsia-600',
    shadow: 'shadow-violet-500/20',
    iconColor: 'text-violet-600 dark:text-violet-400',
    bgColor: 'bg-violet-50 dark:bg-violet-500/10',
  },
  {
    id: 'app',
    label: 'Installs',
    icon: ShieldCheck,
    gradient: 'from-emerald-500 to-teal-500',
    shadow: 'shadow-emerald-500/20',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-50 dark:bg-emerald-500/10',
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
    <div className="max-w-4xl mx-auto pb-24 animate-in fade-in duration-500">
      
      {/* Premium Header */}
      <div className="relative bg-white dark:bg-gray-900 rounded-b-[2.5rem] p-8 sm:p-10 border-b border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden mb-8">
        <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16 opacity-20 bg-gradient-to-br ${activeTabData?.gradient}`} />
        
        <div className="flex items-center gap-5 relative z-10">
          <div className={`w-14 h-14 rounded-[1.25rem] flex items-center justify-center bg-white dark:bg-gray-800 shadow-lg ${activeTabData?.shadow}`}>
            <Target size={28} className={activeTabData?.iconColor} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Mission Log</h1>
            <p className="text-gray-500 font-medium mt-1 flex items-center gap-2">
              <Activity size={14} /> Record your field activity
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6">
        {/* Mission Categories */}
        <div className="bg-white dark:bg-gray-900 rounded-[2rem] p-2 border border-gray-100 dark:border-gray-800 shadow-sm mb-8 flex flex-wrap lg:flex-nowrap gap-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex-1 min-w-[120px] flex items-center justify-center gap-3 py-4 sm:py-5 px-2 rounded-[1.5rem] transition-all duration-300 relative group
                  ${isActive 
                    ? `bg-gray-50 dark:bg-gray-800/50 shadow-inner` 
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800/30 text-gray-400'}`}
              >
                <div className={`p-2.5 rounded-xl transition-all duration-300 
                  ${isActive ? `bg-white dark:bg-gray-700 shadow-md ${tab.iconColor} ${tab.shadow}` : 'bg-transparent group-hover:bg-gray-100 dark:group-hover:bg-gray-800 group-hover:text-gray-700 dark:group-hover:text-gray-300'}`}>
                  <Icon size={20} className={isActive ? 'transform scale-110' : ''} />
                </div>
                <span className={`text-xs sm:text-sm font-bold uppercase tracking-wide
                  ${isActive ? 'text-gray-900 dark:text-white' : ''}`}>
                  {tab.label}
                </span>

                {/* Active Indicator Line */}
                {isActive && (
                  <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 rounded-t-full bg-gradient-to-r ${tab.gradient}`} />
                )}
              </button>
            );
          })}
        </div>

        {/* Selected Form Area */}
        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-b from-gray-50/50 to-transparent dark:from-gray-800/10 pointer-events-none rounded-[3rem]" />
          <div key={activeTab} className="relative z-10 animate-in slide-in-from-right-4 fade-in duration-500">
            {FORMS[activeTab]}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogVisit;
