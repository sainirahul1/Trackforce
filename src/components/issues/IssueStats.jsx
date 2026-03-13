import React from 'react';

const IssueStats = ({ issues }) => {
  const stats = [
    { label: 'Open Issues', count: issues.filter(i => i.status === 'Open').length, color: 'orange' },
    { label: 'In Progress', count: issues.filter(i => i.status === 'In Progress').length, color: 'blue' },
    { label: 'Resolved Today', count: issues.filter(i => i.status === 'Resolved').length, color: 'emerald' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, i) => (
        <div key={i} className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm transition-all hover:shadow-md">
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
          <div className="flex items-end justify-between mt-2">
            <p className={`text-4xl font-black text-${stat.color}-600`}>{stat.count}</p>
            <div className={`h-1.5 w-12 bg-${stat.color}-100 dark:bg-${stat.color}-900/20 rounded-full`} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default IssueStats;
