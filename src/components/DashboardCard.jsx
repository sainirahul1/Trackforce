import React from 'react';

const DashboardCard = ({ title, value, icon: Icon, trend, trendValue, colorClass = "text-primary-main" }) => {
  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all group duration-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-400 dark:text-gray-500 text-xs font-bold uppercase tracking-widest">{title}</h3>
        {Icon && (
          <div className={`p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 ${colorClass} group-hover:scale-110 transition-transform`}>
            <Icon size={20} />
          </div>
        )}
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">{value}</p>
          {trend && (
            <div className={`flex items-center mt-2 text-xs font-bold ${trend === 'up' ? 'text-success' : 'text-error'}`}>
              <span>{trend === 'up' ? '↑' : '↓'} {trendValue}%</span>
              <span className="ml-1 text-gray-400 dark:text-gray-500 font-medium">vs last month</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
