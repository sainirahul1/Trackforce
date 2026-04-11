import Skeleton from './Skeleton';

const DashboardCard = ({ title, value, icon: Icon, trend, trendValue, colorClass = "text-primary-main", onClick, isLoading = false, children }) => {
  return (
    <div 
      className={`bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all group duration-300 ${onClick ? 'cursor-pointer hover:border-indigo-500' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-400 dark:text-gray-500 text-xs font-bold uppercase tracking-widest min-w-[80px]">
          {isLoading ? <Skeleton className="h-3 w-24" /> : title}
        </h3>
        {isLoading ? (
          <Skeleton variant="rounded" className="w-10 h-10" />
        ) : (
          Icon && (
            <div className={`p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 ${colorClass} group-hover:scale-110 transition-transform`}>
              <Icon size={20} />
            </div>
          )
        )}
      </div>
      <div className="flex items-end justify-between">
        <div className="w-full">
          {isLoading ? (
            <Skeleton className="h-8 w-3/4 mb-2" />
          ) : (
            <p className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">{value}</p>
          )}
          
          {isLoading ? (
            <div className="flex flex-col gap-2 mt-2">
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-2 w-1/3" />
            </div>
          ) : (
            trend && (
              <div className={`flex items-center mt-2 text-xs font-bold ${trend === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>
                <span>{trend === 'up' ? '↑' : '↓'} {trendValue}%</span>
                <span className="ml-1 text-gray-400 dark:text-gray-500 font-medium">vs last month</span>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
