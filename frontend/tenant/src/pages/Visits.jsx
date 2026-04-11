import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Camera, MapPin, Calendar, CheckCircle, Clock, ChevronRight, User } from 'lucide-react';
import { getVisits } from '../services/visitService';

const Visits = () => {
  const { setPageLoading } = useOutletContext();
  const [visits, setVisits] = useState([]);
  const [stats, setStats] = useState({
    totalToday: 0,
    successRate: 0,
    avgTime: '24m'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getVisits();
        setVisits(data);

        // Calculate dynamic stats
        const today = new Date().setHours(0, 0, 0, 0);
        const todayVisits = data.filter(v => new Date(v.timestamp).setHours(0, 0, 0, 0) === today);
        const completedVisits = data.filter(v => v.status === 'completed' || v.status === 'Completed');

        setStats({
          totalToday: todayVisits.length,
          successRate: data.length > 0 ? Math.round((completedVisits.length / data.length) * 100) : 0,
          avgTime: '24m' // Keeping default as it requires start/end time tracking
        });

        if (setPageLoading) setPageLoading(false);
      } catch (error) {
        console.error('Error fetching visits:', error);
        if (setPageLoading) setPageLoading(false);
      }
    };

    fetchData();
  }, [setPageLoading]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 font-sans">
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Visit Management</h1>
        <p className="text-gray-500 dark:text-gray-400 font-medium pb-2">Track and analyze field visits and outcomes.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Total Visits Today</p>
          <div className="flex items-end gap-2">
            <h2 className="text-4xl font-black text-indigo-600">{stats.totalToday}</h2>
            <span className="text-green-500 font-bold mb-1.5 flex items-center gap-1 text-sm">
              +12% <Clock size={14} />
            </span>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Success Rate</p>
          <div className="flex items-end gap-2">
            <h2 className="text-4xl font-black text-gray-900 dark:text-white">{stats.successRate}%</h2>
            <span className="text-indigo-500 font-bold mb-1.5 text-sm uppercase tracking-wider">
              {stats.successRate > 80 ? 'Excellent' : stats.successRate > 50 ? 'Good' : 'Needs Improvement'}
            </span>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Average Visit Time</p>
          <div className="flex items-end gap-2">
            <h2 className="text-4xl font-black text-gray-900 dark:text-white">{stats.avgTime}</h2>
            <span className="text-gray-500 font-bold mb-1.5 text-sm">per store</span>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-md">
        <div className="p-6 border-b border-gray-50 dark:border-gray-800">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white">Recent Visit Activity</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
                <th className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest w-[40%]">Store</th>
                <th className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest w-[30%]">Executive</th>
                <th className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest w-[15%]">Status</th>
                <th className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center w-[15%]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {visits.map((visit) => {
                const date = new Date(visit.timestamp);
                const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const statusFormatted = visit.status.charAt(0).toUpperCase() + visit.status.slice(1).replace('_', ' ');

                // Specific status color palette to match "Order History" example with Dark Mode fixes
                const getStatusStyle = (status) => {
                  const s = status.toLowerCase();
                  if (s.includes('completed') && !s.includes('partially')) return 'border-emerald-100 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400';
                  if (s.includes('partially')) return 'border-sky-100 bg-sky-50 text-sky-700 dark:border-sky-500/20 dark:bg-sky-500/10 dark:text-sky-400';
                  if (s.includes('pending')) return 'border-amber-100 bg-amber-50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400';
                  if (s.includes('follow')) return 'border-purple-100 bg-purple-50 text-purple-700 dark:border-purple-500/20 dark:bg-purple-500/10 dark:text-purple-400';
                  if (s.includes('rejected') || s.includes('canceled')) return 'border-rose-100 bg-rose-50 text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-400';
                  return 'border-gray-100 bg-gray-50 text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300';
                };

                return (
                  <tr key={visit._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/40 transition-all duration-200">
                    <td className="px-6 py-3 w-[40%]">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100/50 dark:border-indigo-500/20 flex items-center justify-center text-[10px] font-black text-indigo-400 dark:text-indigo-400 uppercase tracking-tighter">
                          {(visit.storeName || 'S').charAt(0)}
                        </div>
                        <span className="text-[13px] font-bold text-gray-700 dark:text-gray-200">
                          {visit.storeName || visit.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-3 w-[30%]">
                      <div className="flex flex-col">
                        <span className="text-[13px] font-bold text-gray-700 dark:text-gray-200">{visit.employee?.name || visit.executive || 'Unassigned'}</span>
                        <span className="text-[9px] font-bold text-gray-400 tracking-wider uppercase mt-0.5">{timeStr}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3 w-[15%]">
                      <span className={`px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border transition-colors whitespace-nowrap ${getStatusStyle(statusFormatted)}`}>
                        {statusFormatted}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-center w-[15%]">
                      <div className="flex items-center justify-center">
                        <button className="px-3 py-1.5 rounded-lg border border-indigo-100 dark:border-indigo-500/30 text-[9px] font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-900/20 hover:bg-indigo-100/50 dark:hover:bg-indigo-900/40 uppercase tracking-widest transition-all">
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Visits;
