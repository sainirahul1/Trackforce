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
    { 
      label: 'Escalated Cases', 
      count: issues.filter(i => i.status === 'Escalated').length, 
      color: 'purple',
      icon: <AlertCircle size={20} className="text-purple-500" />
    },
  ];

  const getColorClasses = (color) => {
    switch (color) {
      case 'emerald': return { bg: 'bg-emerald-500/10', text: 'text-emerald-600', dot: 'bg-emerald-500' };
      case 'orange': return { bg: 'bg-orange-500/10', text: 'text-orange-600', dot: 'bg-orange-500' };
      case 'purple': return { bg: 'bg-purple-500/10', text: 'text-purple-600', dot: 'bg-purple-500' };
      default: return { bg: 'bg-blue-500/10', text: 'text-blue-600', dot: 'bg-blue-500' };
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, i) => {
        const colors = getColorClasses(stat.color);
        return (
          <div key={i} className="bg-white dark:bg-gray-900 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{stat.label}</p>
              <div className={`p-2 rounded-xl ${colors.bg}`}>
                {stat.icon}
              </div>
            </div>
            <div className="flex items-end justify-between">
              <p className={`text-4xl font-black ${colors.text} tracking-tighter`}>
                {stat.count}
              </p>
              <div className={`h-1 w-16 ${colors.bg.replace('/10', '/20')} rounded-full overflow-hidden`}>
                <div className={`h-full ${colors.dot} w-2/3 animate-pulse`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default IssueStats;
