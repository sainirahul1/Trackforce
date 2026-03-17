import React from 'react';
import { AlertCircle, Activity, CheckCircle2 } from 'lucide-react';

const IssueStats = ({ issues }) => {
  const stats = [
    { 
      label: 'Open Issues', 
      count: issues.filter(i => i.status === 'Open').length, 
      color: 'orange',
      icon: <AlertCircle size={20} className="text-orange-500" />
    },
    { 
      label: 'In Progress', 
      count: issues.filter(i => i.status === 'In Progress').length, 
      color: 'blue',
      icon: <Activity size={20} className="text-blue-500" />
    },
    { 
      label: 'Resolved Today', 
      count: issues.filter(i => i.status === 'Resolved').length, 
      color: 'emerald',
      icon: <CheckCircle2 size={20} className="text-emerald-500" />
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, i) => (
        <div key={i} className="bg-white dark:bg-gray-900 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{stat.label}</p>
            <div className={`p-2 rounded-xl bg-${stat.color === 'emerald' ? 'emerald' : stat.color === 'orange' ? 'orange' : 'blue'}-500/10`}>
              {stat.icon}
            </div>
          </div>
          <div className="flex items-end justify-between">
            <p className={`text-4xl font-black text-${stat.color === 'emerald' ? 'emerald' : stat.color === 'orange' ? 'orange' : 'blue'}-600 tracking-tighter`}>
              {stat.count}
            </p>
            <div className={`h-1 w-16 bg-${stat.color === 'emerald' ? 'emerald' : stat.color === 'orange' ? 'orange' : 'blue'}-500/20 rounded-full overflow-hidden`}>
              <div className={`h-full bg-${stat.color === 'emerald' ? 'emerald' : stat.color === 'orange' ? 'orange' : 'blue'}-500 w-2/3 animate-pulse`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default IssueStats;
