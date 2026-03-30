import React, { useState } from 'react';
import IssueStats from '../../components/issues/IssueStats';
import IssueFilters from '../../components/issues/IssueFilters';
import IssueCard from '../../components/issues/IssueCard';
import { mockIssues as initialIssues } from '../../utils/mockData';
import { CheckCircle2, Plus, CheckCircle } from 'lucide-react';
import CreateIssueModal from '../../components/issues/CreateIssueModal';

const Issues = () => {
  const role = 'superadmin';
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [issuesList, setIssuesList] = useState(initialIssues);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showToast, setShowToast] = useState({ show: false, message: '', type: 'success' });

  const triggerToast = (message, type = 'success') => {
    setShowToast({ show: true, message, type });
    if (type === 'success') {
      setTimeout(() => setShowToast({ show: false, message: '', type: 'success' }), 2000);
    }
  };

  const handleCreateIssue = (newData) => {
    const newIssue = {
      id: Date.now(),
      from: 'Super Admin',
      fromRole: 'superadmin',
      to: 'superadmin', // Superadmin can raise issues to themselves or system
      subject: newData.subject,
      status: 'Open',
      priority: newData.priority,
      date: new Date().toISOString().split('T')[0],
      description: newData.description
    };
    setIssuesList([newIssue, ...issuesList]);
    setShowCreateModal(false);
    triggerToast('Issue successfully recorded');
  };

  // Filter issues based on role and status/search
  const filteredIssues = issuesList.filter(issue => {
    const isForMe = issue.to === role;
    const matchesStatus = filterStatus === 'All' || issue.status === filterStatus;
    const matchesSearch = issue.subject.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          issue.from.toLowerCase().includes(searchTerm.toLowerCase());
    return isForMe && matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Issues Management</h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">
            Track and resolve concerns raised by your tenants
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-indigo-500/40 hover:bg-indigo-700 hover:-translate-y-1 transition-all active:scale-95 group"
        >
          <div className="p-1.5 bg-white/20 rounded-xl group-hover:rotate-90 transition-transform duration-500">
            <Plus size={16} />
          </div>
          Report New Issue
        </button>
      </div>

      {showCreateModal && (
        <CreateIssueModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateIssue}
        />
      )}

      <IssueStats issues={issuesList.filter(i => i.to === role)} />

      <IssueFilters 
        filterStatus={filterStatus} 
        setFilterStatus={setFilterStatus}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <div className="space-y-4">
        {filteredIssues.length > 0 ? (
          filteredIssues.map((issue) => (
            <IssueCard key={issue.id} issue={issue} />
          ))
        ) : (
          <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 p-20 text-center shadow-sm">
            <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
              <CheckCircle2 size={32} />
            </div>
            <p className="text-gray-500 font-bold">No issues found for this category</p>
          </div>
        )}
      </div>

      {/* Global Toast */}
      {showToast.show && (
        <div className="fixed inset-x-0 top-4 z-[250] flex justify-center p-4 pointer-events-none animate-in slide-in-from-top-2 fade-in duration-700">
          <div className="bg-emerald-600/90 text-white px-4 py-2 rounded-2xl shadow-[0_10px_20px_-5px_rgba(16,185,129,0.3)] flex items-center gap-2.5 border border-emerald-400/20 backdrop-blur-2xl pointer-events-auto ring-4 ring-emerald-500/5 active:scale-95 transition-all scale-[0.85]">
            <div className="bg-white/20 p-1 rounded-lg">
              <CheckCircle size={12} className="text-white" />
            </div>
            <span className="text-[8px] font-black uppercase tracking-[0.3em]">{showToast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Issues;
