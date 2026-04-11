import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import IssueStats from '../components/issues/IssueStats';
import IssueFilters from '../components/issues/IssueFilters';
import IssueCard from '../components/issues/IssueCard';
import { mockIssues } from '../utils/mockData';
import { CheckCircle2 } from 'lucide-react';

const Issues = () => {
  const { setPageLoading } = useOutletContext();
  const role = 'tenant';

  useEffect(() => {
    if (setPageLoading) setPageLoading(false);
  }, [setPageLoading]);
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter issues based on role and status/search
  const filteredIssues = mockIssues.filter(issue => {
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
            Track and resolve concerns raised by your managers
          </p>
        </div>
      </div>

      <IssueStats issues={mockIssues.filter(i => i.to === role)} />

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
    </div>
  );
};

export default Issues;
