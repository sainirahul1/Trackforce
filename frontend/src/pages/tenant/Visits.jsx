import React, { useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Camera, MapPin, Calendar, CheckCircle, Clock, ChevronRight, User } from 'lucide-react';

const Visits = () => {
  const { setPageLoading } = useOutletContext();

  useEffect(() => {
    if (setPageLoading) setPageLoading(false);
  }, [setPageLoading]);
  const visits = [
    { id: 1, type: 'Store', name: 'Reliance Digital', executive: 'John Doe', time: '10:30 AM', status: 'Completed', location: 'Brooklyn, NY' },
    { id: 2, type: 'Supplier', name: 'Global Tech Ltd', executive: 'Jane Smith', time: '12:45 PM', status: 'In Progress', location: 'Queens, NY' },
    { id: 3, type: 'Store', name: 'Apple Store', executive: 'Mike Ross', time: '02:15 PM', status: 'Pending', location: 'Manhattan, NY' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Visit Management</h1>
        <p className="text-gray-500 dark:text-gray-400 font-medium">Track and analyze field visits and outcomes.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Total Visits Today</p>
          <div className="flex items-end gap-2">
            <h2 className="text-4xl font-black text-indigo-600">42</h2>
            <span className="text-green-500 font-bold mb-1.5 flex items-center gap-1 text-sm">
              +12% <Clock size={14} />
            </span>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Success Rate</p>
          <div className="flex items-end gap-2">
            <h2 className="text-4xl font-black text-gray-900 dark:text-white">88%</h2>
            <span className="text-indigo-500 font-bold mb-1.5 text-sm uppercase tracking-wider">Excellent</span>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Average Visit Time</p>
          <div className="flex items-end gap-2">
            <h2 className="text-4xl font-black text-gray-900 dark:text-white">24m</h2>
            <span className="text-gray-500 font-bold mb-1.5 text-sm">per store</span>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between">
          <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Calendar size={18} className="text-indigo-600" />
            Recent Visit Activity
          </h3>
          <button className="text-indigo-600 font-bold text-sm hover:underline">View All</button>
        </div>
        <div className="divide-y divide-gray-50 dark:divide-gray-800">
          {visits.map((visit) => (
            <div key={visit.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  visit.type === 'Store' ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600' : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600'
                }`}>
                  {visit.type === 'Store' ? <Camera size={24} /> : <User size={24} />}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">{visit.name}</h4>
                  <p className="text-sm text-gray-500 font-medium flex items-center gap-1.5">
                    <MapPin size={14} /> {visit.location}
                  </p>
                </div>
              </div>
              
              <div className="hidden md:block">
                <p className="text-sm font-bold text-gray-900 dark:text-white">{visit.executive}</p>
                <p className="text-xs text-gray-400 font-medium uppercase">{visit.time}</p>
              </div>

              <div className="flex items-center gap-6">
                <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${
                  visit.status === 'Completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30' : 
                  visit.status === 'In Progress' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30' : 
                  'bg-gray-100 text-gray-700 dark:bg-gray-900/30'
                }`}>
                  {visit.status}
                </span>
                <ChevronRight className="text-gray-300" size={18} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Visits;
