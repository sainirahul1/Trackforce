import React from 'react';
import { MapPin, Navigation, Clock, CheckCircle2, ChevronRight } from 'lucide-react';
import Button from '../../components/Button';

const EmployeeVisits = () => {
  const visits = [
    { id: 1, store: 'Reliance Fresh - HSR', address: 'Sector 2, HSR Layout, BLR', time: '10:00 AM', status: 'Completed' },
    { id: 2, store: 'More Megamart - Koramangala', address: '8th Block, Koramangala, BLR', time: '12:30 PM', status: 'In Progress' },
    { id: 3, store: 'Big Bazaar - Central', address: 'MG Road, Bengaluru', time: '03:00 PM', status: 'Pending' },
    { id: 4, store: 'Star Bazar - Indiranagar', address: '100ft Road, Indiranagar, BLR', time: '05:30 PM', status: 'Upcoming' },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">Store Visits</h1>
          <p className="text-gray-500 font-medium">Your schedule for {new Date().toLocaleDateString()}</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl">
          <MapPin size={18} className="mr-2" />
          View On Map
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {visits.map((visit) => (
            <div key={visit.id} className="bg-white dark:bg-gray-900 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
              <div className="flex items-center gap-6">
                <div className={`p-4 rounded-2xl ${
                  visit.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' :
                  visit.status === 'In Progress' ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-400'
                }`}>
                  <Navigation size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg">{visit.store}</h3>
                  <p className="text-sm text-gray-500">{visit.address}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="flex items-center gap-1 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      <Clock size={12} />
                      {visit.time}
                    </span>
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg ${
                      visit.status === 'Completed' ? 'text-emerald-600 bg-emerald-50' :
                      visit.status === 'In Progress' ? 'text-blue-600 bg-blue-50' : 'text-gray-400 bg-gray-50'
                    }`}>
                      {visit.status}
                    </span>
                  </div>
                </div>
              </div>
              <button className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-400 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-all">
                <ChevronRight size={20} />
              </button>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-8 rounded-[2.5rem] text-white shadow-xl">
            <h3 className="text-xl font-black mb-4 tracking-tight">Today's Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="opacity-80">Total Scheduled</span>
                <span className="font-black">8 Stores</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="opacity-80">Completed</span>
                <span className="font-black">3 Stores</span>
              </div>
              <div className="pt-4 border-t border-white/20">
                <p className="text-xs opacity-60 uppercase font-black tracking-widest mb-2">Completion Rate</p>
                <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white w-[37%]" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm">
            <h3 className="font-black text-gray-900 dark:text-white mb-6">Zone Guidelines</h3>
            <ul className="space-y-4">
              <li className="flex gap-3 text-sm text-gray-500">
                <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                <span>Always check-in before entering the store premises.</span>
              </li>
              <li className="flex gap-3 text-sm text-gray-500">
                <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                <span>Upload a minimum of 2 photos for each visit.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeVisits;
