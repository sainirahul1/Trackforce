import React from 'react';
import { 
  Camera, MapPin, CheckCircle2, Clock, AlertCircle, 
  ExternalLink, Maximize2, ShieldCheck, User, Store,
  Search, Filter, Calendar, ArrowRight
} from 'lucide-react';

/**
 * Visits Component
 * Specialized monitoring for field visits, proofs, and GPS validation.
 */
const ManagerVisits = () => {
  const visits = [
    { 
      id: 'VST-9021', 
      store: 'Global Tech Solutions HQ', 
      executive: 'John Doe', 
      type: 'Store Visit', 
      status: 'Verified', 
      time: '10:45 AM',
      location: 'Verified (0.02km variance)',
      photos: 3,
      avatar: 'JD'
    },
    { 
      id: 'VST-9022', 
      store: 'North Star Retail', 
      executive: 'Sarah Wilson', 
      type: 'Supplier Visit', 
      status: 'Pending Review', 
      time: '11:15 AM',
      location: 'Warning (0.15km variance)',
      photos: 2,
      avatar: 'SW'
    },
    { 
      id: 'VST-9023', 
      store: 'Prime Logistics Hub', 
      executive: 'Mike Johnson', 
      type: 'Routine Check', 
      status: 'Verified', 
      time: '09:30 AM',
      location: 'Verified (0.01km variance)',
      photos: 4,
      avatar: 'MJ'
    },
  ];

  const proofs = [
    { id: 1, title: 'Store Front', img: 'https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?w=500&auto=format&fit=crop&q=60', tag: 'Exterior' },
    { id: 2, title: 'Inventory Shelf', img: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&auto=format&fit=crop&q=60', tag: 'Stock' },
    { id: 3, title: 'Banner Verification', img: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=500&auto=format&fit=crop&q=60', tag: 'Branding' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Visit Intelligence HQ</h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">Real-time geospatial audit and physical proof verification system.</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
           <div className="flex items-center gap-3 px-6 py-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">System Online</span>
           </div>
           <div className="flex items-center gap-2 px-6 py-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl border border-emerald-100 dark:border-emerald-500/20 shadow-sm">
             <ShieldCheck size={18} className="text-emerald-600" />
             <span className="text-xs font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">98.4% Accuracy</span>
           </div>
        </div>
      </div>

      {/* Quick Ops Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Active Audits', value: '18', icon: Camera, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'GPS Variance', value: '< 50m', icon: MapPin, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Photos today', value: '842', icon: Maximize2, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Alerts', value: '03', icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-gray-900 p-6 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all">
             <div className={`w-12 h-12 rounded-xl ${stat.bg} ${stat.color} dark:bg-opacity-10 flex items-center justify-center mb-4`}>
                <stat.icon size={20} />
             </div>
             <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
             <p className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Live Feed of Visits */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-[0.2em] flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
               Current Operations
            </h3>
            <div className="flex items-center gap-3">
               <button className="p-2 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 text-gray-400 hover:text-indigo-600">
                 <Filter size={16} />
               </button>
               <button className="p-2 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 text-gray-400 hover:text-indigo-600">
                 <Calendar size={16} />
               </button>
            </div>
          </div>

          <div className="space-y-4">
            {visits.map((visit) => (
              <div key={visit.id} className="group bg-white dark:bg-gray-900 p-6 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all">
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                  {/* Executive Info */}
                  <div className="flex items-center gap-4 min-w-[180px]">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 font-black text-sm border border-indigo-100 dark:border-indigo-500/20">
                      {visit.avatar}
                    </div>
                    <div>
                      <h4 className="text-[15px] font-black text-gray-900 dark:text-white">{visit.executive}</h4>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{visit.type}</p>
                    </div>
                  </div>

                  {/* Visit Details */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2">
                      <Store size={14} className="text-gray-400" />
                      <span className="text-sm font-black text-gray-700 dark:text-gray-200">{visit.store}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <MapPin size={10} className={visit.location.includes('Warning') ? 'text-rose-500' : 'text-emerald-500'} />
                        <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{visit.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <Camera size={10} className="text-indigo-500" />
                        <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{visit.photos} Proofs</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <Clock size={10} className="text-blue-500" />
                        <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{visit.time}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto">
                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-center border ${
                      visit.status === 'Verified' ? 'text-emerald-600 bg-emerald-50 border-emerald-100 dark:bg-emerald-500/10 dark:border-emerald-500/20' : 
                      'text-indigo-600 bg-indigo-50 border-indigo-100 dark:bg-indigo-500/10 dark:border-indigo-500/20'
                    }`}>
                      {visit.status}
                    </span>
                    <button className="flex items-center justify-center gap-2 px-4 py-1.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all">
                      Review <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Visual Proofs Gallery */}
        <div className="lg:col-span-1 space-y-6">
           <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-[0.2em] px-2 flex items-center justify-between">
              Recent Proofs
              <Maximize2 size={16} className="text-gray-400 cursor-pointer hover:text-indigo-600" />
           </h3>
           
           <div className="grid grid-cols-1 gap-4">
              {proofs.map((proof) => (
                <div key={proof.id} className="relative group overflow-hidden rounded-[2rem] border-2 border-white dark:border-gray-900 shadow-xl aspect-video cursor-pointer">
                  <img src={proof.img} alt={proof.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-1">{proof.tag}</span>
                    <h5 className="text-white font-black text-lg">{proof.title}</h5>
                  </div>
                  <div className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md rounded-xl border border-white/20 group-hover:bg-indigo-600 group-hover:border-indigo-500 transition-all">
                    <ExternalLink size={14} className="text-white" />
                  </div>
                </div>
              ))}
           </div>

           {/* Metadata Summary */}
           <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-indigo-600/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl" />
              <h4 className="text-xs font-black uppercase tracking-[0.2em] opacity-60 mb-6">Execution Summary</h4>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-2xl font-black">124</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mt-1">Total Visits</p>
                </div>
                <div>
                  <p className="text-2xl font-black">94%</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mt-1">Verified</p>
                </div>
                <div>
                  <p className="text-2xl font-black">0.8 km</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mt-1">Avg. Variance</p>
                </div>
                <div>
                  <p className="text-2xl font-black">412</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mt-1">Photo Proofs</p>
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerVisits;
