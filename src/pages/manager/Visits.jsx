import React from 'react';
import {
  Camera, MapPin, CheckCircle2, Clock, AlertCircle,
  ExternalLink, Maximize2, ShieldCheck, User, Store,
  Search, Filter, Calendar, ArrowRight, XCircle, RotateCcw,
  Check, X, MessageSquare, MoreHorizontal, Mail, Phone, ArrowLeft,
  ChevronDown, History
} from 'lucide-react';

/**
 * VisitCard Component
 * Shared card for the visits list feed.
 */
const VisitCard = ({ visit, onReview }) => (
  <div 
    onClick={onReview}
    className="group bg-white dark:bg-gray-900 p-6 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer"
  >
    <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
      {/* Executive Info */}
      <div className="flex items-center gap-4 min-w-[200px]">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 font-black text-sm border border-indigo-100 dark:border-indigo-500/20">
          {visit.avatar}
        </div>
        <div>
          <h4 className="text-[15px] font-black text-gray-900 dark:text-white">{visit.executive}</h4>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{visit.designation}</p>
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

      {/* Actions Status */}
      <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto">
        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-center border ${
          visit.status === 'Accepted' || visit.status === 'Verified' ? 'text-emerald-600 bg-emerald-50 border-emerald-100 dark:bg-emerald-500/10 dark:border-emerald-500/20' : 
          visit.status === 'Rejected' ? 'text-rose-600 bg-rose-50 border-rose-100 dark:bg-rose-500/10 dark:border-rose-500/20' :
          visit.status === 'Follow-up' ? 'text-amber-600 bg-amber-50 border-amber-100 dark:bg-amber-500/10 dark:border-amber-500/20' :
          'text-indigo-600 bg-indigo-50 border-indigo-100 dark:bg-indigo-500/10 dark:border-indigo-500/20'
        }`}>
          {visit.status}
        </span>
        <button 
          onClick={(e) => { e.stopPropagation(); onReview(); }}
          className="flex items-center justify-center gap-2 px-4 py-1.5 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 hover:scale-105 transition-all shadow-lg shadow-indigo-500/20"
        >
          Review <ArrowRight size={12} />
        </button>
      </div>
    </div>
  </div>
);

const ManagerVisits = () => {
  const [filterStatus, setFilterStatus] = React.useState('Total');
  const [selectedVisit, setSelectedVisit] = React.useState(null);
  const [isPendingExpanded, setIsPendingExpanded] = React.useState(true);
  const [isHistoryExpanded, setIsHistoryExpanded] = React.useState(true);
  const [isRejecting, setIsRejecting] = React.useState(false);
  const [rejectionReasonInput, setRejectionReasonInput] = React.useState('');

  const [visits, setVisits] = React.useState([
    {
      id: 'VST-9021',
      store: 'Global Tech Solutions HQ',
      executive: 'John Doe',
      designation: 'Sales Executive',
      team: 'North Sales',
      type: 'Store Visit',
      status: 'Accepted',
      time: '10:45 AM',
      location: 'Verified (0.02km variance)',
      photos: 3,
      avatar: 'JD',
      employeeId: 101,
      proofs: [
        { id: 1, title: 'Store Front', img: 'https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?w=500&auto=format&fit=crop&q=60' },
        { id: 2, title: 'Shelf Check', img: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&auto=format&fit=crop&q=60' }
      ]
    },
    {
      id: 'VST-9022',
      store: 'North Star Retail',
      executive: 'Sarah Wilson',
      designation: 'Field Officer',
      team: 'Retail Team',
      type: 'Supplier Visit',
      status: 'Pending Review',
      time: '11:15 AM',
      location: 'Warning (0.15km variance)',
      photos: 2,
      avatar: 'SW',
      employeeId: 102,
      proofs: [
        { id: 1, title: 'Display Area', img: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=500&auto=format&fit=crop&q=60' }
      ]
    },
    {
      id: 'VST-9023',
      store: 'Prime Logistics Hub',
      executive: 'Mike Johnson',
      designation: 'Logistics Supervisor',
      team: 'Logistics A',
      type: 'Routine Check',
      status: 'Accepted',
      time: '09:30 AM',
      location: 'Verified (0.01km variance)',
      photos: 4,
      avatar: 'MJ',
      employeeId: 103,
      proofs: []
    },
    {
      id: 'VST-9024',
      store: 'City Mall Store',
      executive: 'Emma Davis',
      designation: 'Brand Ambassador',
      team: 'Promotions',
      type: 'Promotion Check',
      status: 'Rejected',
      time: '12:00 PM',
      location: 'Warning (0.5km variance)',
      photos: 1,
      avatar: 'ED',
      employeeId: 104,
      proofs: [],
      rejectionReason: 'Geospatial evidence outside perimeter.'
    },
    {
      id: 'VST-9025',
      store: 'Wellness Pharmacy',
      executive: 'Alex Brown',
      designation: 'Medical Rep',
      team: 'Pharma West',
      type: 'Visit',
      status: 'Follow-up',
      time: '01:30 PM',
      location: 'Verified (0.05km variance)',
      photos: 5,
      avatar: 'AB',
      employeeId: 105,
      proofs: []
    },
  ]);

  const stats = [
    { label: 'Total Visits', value: visits.length.toString(), icon: Camera, color: 'text-indigo-600', bg: 'bg-indigo-50', status: 'Total' },
    { label: 'Accepted Visits', value: visits.filter(v => v.status === 'Accepted').length.toString(), icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50', status: 'Accepted' },
    { label: 'Rejected Visits', value: visits.filter(v => v.status === 'Rejected').length.toString(), icon: XCircle, color: 'text-rose-600', bg: 'bg-rose-50', status: 'Rejected' },
    { label: 'Follow-up Visits', value: visits.filter(v => v.status === 'Follow-up' || v.status === 'Pending Review').length.toString(), icon: RotateCcw, color: 'text-amber-600', bg: 'bg-amber-50', status: 'Follow-up' },
  ];

  const filteredVisits = filterStatus === 'Total'
    ? visits
    : visits.filter(v => {
      if (filterStatus === 'Follow-up') return v.status === 'Follow-up' || v.status === 'Pending Review';
      return v.status === filterStatus;
    });

  const handleAction = (id, newStatus, reason = null) => {
    setVisits(prev => prev.map(v => v.id === id ? { ...v, status: newStatus, rejectionReason: reason } : v));
    setSelectedVisit(null);
    setIsRejecting(false);
    setRejectionReasonInput('');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em]">Operational Intelligence</span>
          </div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Field Visits & Proofs</h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">Monitor, review, and validate real-time visit requests and geospatial evidence.</p>
        </div>

        {selectedVisit && (
          <button
            onClick={() => setSelectedVisit(null)}
            className="flex items-center gap-3 px-6 py-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm hover:scale-105 transition-all text-gray-500 hover:text-indigo-600 font-bold text-sm uppercase tracking-widest"
          >
            <ArrowLeft size={18} />
            Back to Overview
          </button>
        )}
      </div>

      {!selectedVisit ? (
        <>
          {/* Quick Ops Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <button
                key={i}
                onClick={() => setFilterStatus(stat.status)}
                className={`text-left bg-white dark:bg-gray-900 p-6 rounded-[2.5rem] border shadow-sm hover:shadow-xl transition-all ${
                  filterStatus === stat.status ? 'border-indigo-500 ring-2 ring-indigo-500/20 shadow-indigo-500/10' : 'border-gray-100 dark:border-gray-800'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl ${stat.bg} ${stat.color} dark:bg-opacity-10 flex items-center justify-center mb-4`}>
                    <stat.icon size={20} />
                </div>
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter">{stat.value}</p>
              </button>
            ))}
          </div>

          <div className="space-y-12">
            {/* 1. Pending Reviews Section */}
            {(filterStatus === 'Total' || filterStatus === 'Follow-up') && filteredVisits.some(v => v.status === 'Pending Review') && (
              <div className="space-y-4">
                <button 
                  onClick={() => setIsPendingExpanded(!isPendingExpanded)}
                  className="w-full flex items-center justify-between p-6 bg-rose-50/50 dark:bg-rose-500/5 rounded-[2rem] border border-rose-100 dark:border-rose-500/10 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/20">
                      <Clock size={18} />
                    </div>
                    <div className="text-left">
                      <h3 className="text-sm font-black text-rose-500 dark:text-rose-400 uppercase tracking-[0.2em] flex items-center gap-2">
                        Awaiting Action
                        <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                      </h3>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">{filteredVisits.filter(v => v.status === 'Pending Review').length} NEW REQUESTS PENDING</p>
                    </div>
                  </div>
                  <div className={`p-2 rounded-xl bg-white dark:bg-gray-900 border border-rose-100 dark:border-rose-500/20 text-rose-500 transition-transform duration-300 ${isPendingExpanded ? 'rotate-180' : ''}`}>
                    <ChevronDown size={20} />
                  </div>
                </button>
                
                {isPendingExpanded && (
                  <div className="space-y-4 animate-in slide-in-from-top-4 duration-500">
                    {filteredVisits.filter(v => v.status === 'Pending Review').map((visit) => (
                      <VisitCard key={visit.id} visit={visit} onReview={() => setSelectedVisit(visit)} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 2. Operational History Section */}
            <div className="space-y-4">
              <button 
                onClick={() => setIsHistoryExpanded(!isHistoryExpanded)}
                className="w-full flex items-center justify-between p-6 bg-indigo-50/50 dark:bg-indigo-500/5 rounded-[2rem] border border-indigo-100 dark:border-indigo-500/10 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/20">
                    <History size={18} />
                  </div>
                  <div className="text-left">
                    <h3 className="text-sm font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em] flex items-center gap-2">
                      Operational History
                    </h3>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">VIEWING {filteredVisits.filter(v => v.status !== 'Pending Review').length} RECORDED ENTRIES</p>
                  </div>
                </div>
                <div className={`p-2 rounded-xl bg-white dark:bg-gray-900 border border-indigo-100 dark:border-indigo-500/20 text-indigo-600 transition-transform duration-300 ${isHistoryExpanded ? 'rotate-180' : ''}`}>
                  <ChevronDown size={20} />
                </div>
              </button>
              
              {isHistoryExpanded && (
                <div className="space-y-4 animate-in slide-in-from-top-4 duration-500">
                  {filteredVisits.filter(v => v.status !== 'Pending Review').length > 0 ? (
                    filteredVisits.filter(v => v.status !== 'Pending Review').map((visit) => (
                      <VisitCard key={visit.id} visit={visit} onReview={() => setSelectedVisit(visit)} />
                    ))
                  ) : (
                    <div className="py-24 text-center bg-gray-50/50 dark:bg-gray-800/10 rounded-[3rem] border-2 border-dashed border-gray-100 dark:border-gray-800">
                      <div className="mx-auto w-16 h-16 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center mb-6">
                         <History size={32} className="text-gray-300 dark:text-gray-600" />
                      </div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">No historical data found for this filter</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="animate-in slide-in-from-right-8 duration-700">
          <div className="bg-white dark:bg-gray-900 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-2xl flex flex-col lg:flex-row overflow-hidden relative">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] -mr-64 -mt-64 pointer-events-none" />
            
            {/* Detail Left: Profile & Info */}
            <div className="flex-1 p-8 md:p-14 overflow-y-auto relative z-10">
              <div className="flex items-center gap-10 mb-14">
                <div className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-900/20 dark:to-gray-900 flex items-center justify-center text-indigo-600 font-black text-4xl border-2 border-indigo-100 dark:border-indigo-500/20 shadow-2xl relative">
                  {selectedVisit.avatar}
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 rounded-2xl flex items-center justify-center text-white border-4 border-white dark:border-gray-900 shadow-lg">
                    <ShieldCheck size={20} />
                  </div>
                </div>
                <div>
                  <h4 className="text-5xl font-black text-gray-900 dark:text-white leading-tight tracking-tighter">{selectedVisit.executive}</h4>
                  <p className="text-base font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mt-2">{selectedVisit.designation}</p>
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest mt-1 opacity-70">Team ID: {selectedVisit.team} • Employee #{selectedVisit.employeeId}</p>
                  
                  <div className="flex flex-wrap gap-4 mt-8">
                    <div className="flex items-center gap-3 text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50/50 dark:bg-gray-800 px-5 py-2.5 rounded-xl border border-gray-100 dark:border-gray-800">
                       <Mail size={12} className="text-indigo-500" />
                       {selectedVisit.executive.toLowerCase().replace(' ', '.')}@trackforce.com
                    </div>
                    <div className="flex items-center gap-3 text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50/50 dark:bg-gray-800 px-5 py-2.5 rounded-xl border border-gray-100 dark:border-gray-800">
                       <Phone size={12} className="text-emerald-500" />
                       +91 98765 43210
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-12">
                <div>
                  <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                    Visit Intelligence Data
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-[2.5rem] bg-gray-50/50 dark:bg-gray-800/20 border border-gray-100 dark:border-gray-800 flex items-start gap-6 transition-all hover:bg-white dark:hover:bg-gray-800 hover:shadow-2xl hover:-translate-y-1 group">
                      <div className="w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                        <Store size={24} />
                      </div>
                      <div className="flex-1">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Target Location</p>
                        <p className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">{selectedVisit.store}</p>
                      </div>
                    </div>
                    <div className="p-8 rounded-[2.5rem] bg-gray-50/50 dark:bg-gray-800/20 border border-gray-100 dark:border-gray-800 flex items-start gap-6 transition-all hover:bg-white dark:hover:bg-gray-800 hover:shadow-2xl hover:-translate-y-1 group">
                      <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-500/20 text-blue-600 flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                        <Clock size={24} />
                      </div>
                      <div className="flex-1">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Timestamp</p>
                        <p className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">{selectedVisit.time}</p>
                      </div>
                    </div>
                    <div className="p-8 rounded-[2.5rem] bg-gray-50/50 dark:bg-gray-800/20 border border-gray-100 dark:border-gray-800 col-span-1 md:col-span-2 flex items-start gap-6 transition-all hover:bg-white dark:hover:bg-gray-800 hover:shadow-2xl hover:-translate-y-1 group">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform ${selectedVisit.location.includes('Warning') ? 'bg-rose-100 dark:bg-rose-500/20 text-rose-600' : 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600'}`}>
                        <MapPin size={24} />
                      </div>
                      <div className="flex-1">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Geospatial Variance</p>
                        <p className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">{selectedVisit.location}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-gray-100 dark:border-gray-800">
                  <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-10 flex items-center justify-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${selectedVisit.status === 'Pending Review' || selectedVisit.status === 'Follow-up' ? 'bg-emerald-500 animate-pulse' : 'bg-gray-300'}`} />
                    {selectedVisit.status === 'Pending Review' || selectedVisit.status === 'Follow-up' ? 'Awaiting Management Verification' : 'Verification Complete'}
                  </h5>
                  
                  {selectedVisit.status === 'Pending Review' || selectedVisit.status === 'Follow-up' ? (
                    <div className="max-w-2xl mx-auto space-y-8">
                      {!isRejecting ? (
                        <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
                          {selectedVisit.status === 'Pending Review' && (
                            <button 
                              onClick={() => handleAction(selectedVisit.id, 'Accepted')}
                              className="w-full sm:w-auto px-12 py-5 bg-emerald-600 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-emerald-500 hover:-translate-y-1 active:scale-95 transition-all shadow-2xl shadow-emerald-500/30 flex items-center justify-center gap-4 group"
                            >
                              <CheckCircle2 size={20} className="group-hover:rotate-12 transition-transform" /> Approve Visit
                            </button>
                          )}
                          <button 
                            onClick={() => setIsRejecting(true)}
                            className="w-full sm:w-auto px-12 py-5 bg-white dark:bg-gray-900 text-rose-500 border-2 border-rose-500/20 hover:border-rose-500/50 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] hover:-translate-y-1 active:scale-95 transition-all shadow-xl flex items-center justify-center gap-4 group"
                          >
                            <XCircle size={20} className="group-hover:rotate-12 transition-transform" /> Reject Request
                          </button>
                        </div>
                      ) : (
                        <div className="bg-rose-50/50 dark:bg-rose-500/5 p-8 rounded-[2.5rem] border border-rose-100 dark:border-rose-500/20 space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                          <div className="flex items-center gap-3 mb-2">
                             <MessageSquare size={18} className="text-rose-500" />
                             <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Reason for Rejection</p>
                          </div>
                          <textarea 
                            value={rejectionReasonInput}
                            onChange={(e) => setRejectionReasonInput(e.target.value)}
                            placeholder="Please specify why this visit is being rejected..."
                            className="w-full h-32 p-6 bg-white dark:bg-gray-900 border border-rose-100 dark:border-rose-500/20 rounded-3xl text-sm font-medium focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 transition-all resize-none dark:text-white"
                          />
                          <div className="flex flex-col sm:flex-row gap-4">
                            <button 
                              onClick={() => handleAction(selectedVisit.id, 'Rejected', rejectionReasonInput)}
                              disabled={!rejectionReasonInput.trim()}
                              className="flex-1 px-8 py-4 bg-rose-600 disabled:bg-gray-300 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-500 transition-all shadow-lg shadow-rose-500/20"
                            >
                              Confirm Rejection
                            </button>
                            <button 
                              onClick={() => { setIsRejecting(false); setRejectionReasonInput(''); }}
                              className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-500 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-gray-100 dark:border-gray-700 hover:bg-gray-50"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-16 bg-gray-50/50 dark:bg-gray-800/10 rounded-[3rem] border border-gray-100 dark:border-gray-800 max-w-xl mx-auto text-center px-10">
                      <div className={`w-20 h-20 rounded-[2rem] mb-6 flex items-center justify-center shadow-2xl ${
                        selectedVisit.status === 'Accepted' || selectedVisit.status === 'Verified' ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-rose-500 text-white shadow-rose-500/20'
                      }`}>
                         {selectedVisit.status === 'Accepted' || selectedVisit.status === 'Verified' ? <Check size={40} /> : <X size={40} />}
                      </div>
                      <p className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-widest">{selectedVisit.status}</p>
                      
                      {selectedVisit.rejectionReason && (
                        <div className="mt-6 p-6 bg-white dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800 w-full relative">
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 rounded-full">
                             <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest text-center">Remark</p>
                          </div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 italic">"{selectedVisit.rejectionReason}"</p>
                        </div>
                      )}
                      
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-6">Audit trail recorded at {new Date().toLocaleTimeString()}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Detail Right: Visual Evidence */}
            <div className="lg:w-[450px] bg-slate-50/50 dark:bg-slate-900/50 p-8 md:p-14 border-l border-gray-100 dark:border-gray-800 overflow-y-auto relative z-10">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3">
                   <div className="w-1.5 h-6 bg-indigo-500 rounded-full" />
                   <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Visual Evidence Assets</h5>
                </div>
                <span className="px-4 py-1.5 bg-indigo-600 text-white rounded-full text-[10px] font-black shadow-lg shadow-indigo-600/20">{selectedVisit.photos} FILES</span>
              </div>
              <div className="space-y-10">
                {selectedVisit.proofs && selectedVisit.proofs.length > 0 ? (
                  selectedVisit.proofs.map((proof) => (
                    <div key={proof.id} className="group relative overflow-hidden rounded-[3rem] border-8 border-white dark:border-gray-800 shadow-2xl aspect-[4/3] cursor-pointer">
                      <img src={proof.img} alt={proof.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-8">
                        <p className="text-white font-black text-2xl tracking-tight">{proof.title}</p>
                        <div className="flex items-center gap-2 text-indigo-400 text-[10px] font-black uppercase tracking-widest mt-2 bg-indigo-500/10 backdrop-blur-md w-fit px-3 py-1 rounded-full">
                           <Maximize2 size={12} /> HD Evidence
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-40 flex flex-col items-center justify-center text-gray-300 dark:text-gray-700 gap-8 border-4 border-dashed border-gray-100 dark:border-gray-800 rounded-[4rem]">
                    <div className="w-24 h-24 rounded-full bg-gray-50 dark:bg-gray-800/50 flex items-center justify-center">
                       <Camera size={48} strokeWidth={1} className="opacity-40" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-center px-12 leading-loose">No high-definition visual assets were submitted with this visit log.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerVisits;
