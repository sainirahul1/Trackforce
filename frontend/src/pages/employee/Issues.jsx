import React, { useState, useEffect } from 'react';
import { Plus, CheckCircle2, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import CreateIssueModal from '../../components/issues/CreateIssueModal';
import { createIssue, getIssues } from '../../services/core/issueService';
import IssueCard from '../../components/issues/IssueCard';
import { useSocket } from '../../context/SocketContext';

const EmployeeIssues = () => {
  const { socket } = useSocket();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showToast, setShowToast] = useState({ show: false, message: '', type: 'success' });

  const fetchIssues = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const data = await getIssues();
      setIssues(data);
    } catch (err) {
      console.error('Error fetching issues:', err);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();

    if (socket) {
      const handleStatusUpdate = (updatedIssue) => {
        setIssues(prev => prev.map(issue => 
          issue._id === updatedIssue._id ? updatedIssue : issue
        ));
        
        // Show notification if status changed to Resolved
        if (updatedIssue.status === 'Resolved') {
          triggerToast(`Issue "${updatedIssue.subject}" has been resolved!`);
        }
      };

      socket.on('issue:status_update', handleStatusUpdate);
      return () => socket.off('issue:status_update', handleStatusUpdate);
    }
  }, [socket]);

  const triggerToast = (message, type = 'success') => {
    setShowToast({ show: true, message, type });
    setTimeout(() => setShowToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const handleCreateIssue = async (newData) => {
    setSubmitting(true);
    try {
      const createdIssue = await createIssue({
        ...newData,
        to: 'manager' // Employee reports to manager
      });
      
      // OPTIMISTIC UPDATE: Prepend the new issue immediately
      setIssues(prev => [createdIssue, ...prev]);
      
      setShowCreateModal(false);
      triggerToast('Issue reported successfully to your Manager');
      
      // Background refresh to sync with server (no loading spinner)
      fetchIssues(false);
    } catch (err) {
      triggerToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Resolved': return 'bg-emerald-100 text-emerald-600';
      case 'In Progress': return 'bg-amber-100 text-amber-600';
      default: return 'bg-blue-100 text-blue-600';
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in duration-700 pb-20 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pt-4">
        <div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight leading-none">Support Center</h1>
          <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest mt-3 opacity-60">Track your reported concerns</p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-indigo-500/30 hover:bg-indigo-700 hover:-translate-y-1 transition-all active:scale-95 group"
        >
          <Plus size={16} className="group-hover:rotate-90 transition-transform duration-500" />
          Report New Concern
        </button>
      </div>

      {showCreateModal && (
        <CreateIssueModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateIssue}
        />
      )}

      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          <div className="p-20 text-center animate-pulse">
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Loading issues...</p>
          </div>
        ) : issues.length > 0 ? (
          issues.map((issue) => (
            <div key={issue._id} className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all group">
              <div className="flex justify-between items-start mb-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${getStatusColor(issue.status)}`}>
                      {issue.status}
                    </span>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">#{issue._id.slice(-6)}</span>
                  </div>
                  <h3 className="text-xl font-black text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors uppercase tracking-tight pt-2">
                    {issue.subject}
                  </h3>
                </div>
                <div className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest ${
                  issue.priority === 'High' || issue.priority === 'Critical' ? 'bg-rose-50 text-rose-600' : 'bg-gray-50 text-gray-400'
                }`}>
                  {issue.priority} Priority
                </div>
              </div>
              
              <p className="text-gray-500 dark:text-gray-400 font-medium text-sm leading-relaxed mb-6">
                {issue.description}
              </p>

              <div className="flex items-center justify-between pt-6 border-t border-gray-50 dark:border-gray-800/50">
                <div className="flex items-center gap-2 text-gray-400">
                  <Clock size={12} />
                  <span className="text-[9px] font-black uppercase tracking-widest">
                    Reported on {new Date(issue.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {issue.status === 'Resolved' && (
                  <div className="flex items-center gap-2 text-emerald-500">
                    <CheckCircle2 size={14} />
                    <span className="text-[9px] font-black uppercase tracking-widest">Resolved</span>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white dark:bg-gray-900 rounded-[3rem] border-2 border-dashed border-gray-100 dark:border-gray-800 p-24 text-center">
            <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
              <AlertCircle size={32} />
            </div>
            <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2 uppercase tracking-tight">No Active Issues</h3>
            <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.2em]">Everything is running smoothly</p>
          </div>
        )}
      </div>

      {/* Toast Notification */}
      {showToast.show && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[300] animate-in slide-in-from-bottom-5 duration-500">
          <div className={`px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border ${
            showToast.type === 'error' ? 'bg-rose-600 text-white border-rose-400/20' : 'bg-emerald-600 text-white border-emerald-400/20'
          }`}>
            <CheckCircle size={18} />
            <span className="text-[10px] font-black uppercase tracking-widest">{showToast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeIssues;
