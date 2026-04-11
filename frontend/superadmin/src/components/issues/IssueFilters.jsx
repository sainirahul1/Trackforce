import React from 'react';
import { Search, Filter } from 'lucide-react';

const IssueFilters = ({ filterStatus, setFilterStatus, searchTerm, setSearchTerm }) => {
  const tabs = ['All', 'Open', 'In Progress', 'Resolved'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 p-1.5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl w-fit shadow-sm">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setFilterStatus(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                filterStatus === tab 
                  ? 'bg-indigo-600 text-white shadow-lg' 
                  : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search issues..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-6 py-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all w-64 shadow-sm"
            />
          </div>
          <button className="p-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl text-gray-500 hover:text-indigo-600 transition-all shadow-sm">
            <Filter size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default IssueFilters;
