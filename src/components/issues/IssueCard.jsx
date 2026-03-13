import React, { useState } from 'react';
import { MessageSquare, User, Clock, MoreVertical, CheckCircle2, AlertCircle, Send, ChevronDown, ChevronUp } from 'lucide-react';

const IssueCard = ({ issue }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [comment, setComment] = useState('');

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical': return 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-900/20';
      case 'High': return 'bg-orange-50 text-orange-600 border-orange-100 dark:bg-orange-900/20';
      case 'Medium': return 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/20';
      default: return 'bg-gray-50 text-gray-600 border-gray-100 dark:bg-gray-900/20';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Resolved': return <CheckCircle2 className="text-emerald-500" size={18} />;
      case 'In Progress': return <Clock className="text-blue-500" size={18} />;
      default: return <AlertCircle className="text-orange-500" size={18} />;
    }
  };

  return (
    <div className={`p-6 border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-3xl transition-all hover:shadow-md ${isExpanded ? 'ring-2 ring-indigo-500' : ''}`}>
      <div className="flex items-start justify-between gap-6">
        <div className="flex items-start gap-5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 shrink-0">
            <MessageSquare size={24} />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h3 className="font-bold text-gray-900 dark:text-white text-lg">{issue.subject}</h3>
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getPriorityColor(issue.priority)}`}>
                {issue.priority}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-gray-500">
              <span className="flex items-center gap-1.5">
                <User size={12} className="text-gray-400" />
                From: <span className="text-indigo-600 font-bold">{issue.from}</span>
              </span>
              <span className="flex items-center gap-1.5 sm:border-l border-gray-200 dark:border-gray-700 sm:pl-4">
                <Clock size={12} className="text-gray-400" />
                {issue.date}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <div className="flex items-center gap-2 justify-end mb-1">
              {getStatusIcon(issue.status)}
              <span className="text-sm font-black text-gray-900 dark:text-white">{issue.status}</span>
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">ID: #{issue.id.toString().padStart(4, '0')}</p>
          </div>
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"
          >
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-6 pt-6 border-t border-gray-50 dark:border-gray-800 animate-in fade-in slide-in-from-top-2">
          <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl mb-6">
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed italic">
              "No detailed description provided. This issue was raised via the Help Center dropup menu."
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Internal Note / Response</p>
                <textarea 
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Type your response here..."
                  className="w-full h-24 p-4 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 resize-none shadow-inner"
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between gap-3">
              <div className="flex gap-2">
                <button className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center gap-2">
                  <Send size={14} /> Send Note
                </button>
                <button className="px-6 py-2.5 bg-emerald-100 text-emerald-700 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-emerald-200 transition-all">
                  Resolve Issue
                </button>
              </div>
              <button className="p-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors bg-gray-50 dark:bg-gray-800 rounded-xl">
                <MoreVertical size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IssueCard;
