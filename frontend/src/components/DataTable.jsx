import Skeleton from './Skeleton';

const DataTable = ({ columns, data, isLoading = false, loading = false, onRowClick }) => {
  const isCurrentlyLoading = isLoading || loading;
  if (isCurrentlyLoading) {
    return (
      <div className="overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="w-full text-left border-collapse">
          {/* Header Skeleton */}
          <div className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 px-6 py-4 flex gap-4">
            {columns.map((_, i) => (
              <div key={i} className="flex-1">
                <Skeleton className="h-3 w-20 uppercase tracking-widest" />
              </div>
            ))}
          </div>
          {/* Row Skeletons */}
          <div className="divide-y divide-gray-100 dark:divide-gray-800/50">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((row) => (
              <div key={row} className="px-6 py-5 flex gap-4 items-center">
                {columns.map((_, i) => (
                  <div key={i} className="flex-1">
                    <Skeleton className="h-5 w-3/4 rounded-lg" />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-100 dark:border-gray-800">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
            {columns.map((c, i) => (
              <th key={i} className="px-6 py-4 text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">{c.header}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
          {data.length > 0 ? data.map((r, ri) => (
            <tr 
              key={ri} 
              className={`hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
              onClick={() => onRowClick && onRowClick(r)}
            >
              {columns.map((c, ci) => (
                <td key={ci} className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 font-medium">{c.render ? c.render(r, ri) : r[c.accessor]}</td>
              ))}
            </tr>
          )) : <tr><td colSpan={columns.length} className="px-6 py-12 text-center text-sm font-bold text-gray-300 dark:text-gray-500">No records found</td></tr>}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
