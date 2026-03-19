import React from 'react';

const DataTable = ({ columns, data, isLoading = false, onRowClick }) => {
  if (isLoading) return <div className="h-40 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-main"></div></div>;
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
                <td key={ci} className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 font-medium">{c.render ? c.render(r) : r[c.accessor]}</td>
              ))}
            </tr>
          )) : <tr><td colSpan={columns.length} className="px-6 py-12 text-center text-sm font-bold text-gray-300 dark:text-gray-500">No records found</td></tr>}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
