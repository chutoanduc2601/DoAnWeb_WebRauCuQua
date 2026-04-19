import React from 'react';

export default function DataTable({ columns, data, onRowAction, renderActions }) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400 dark:text-slate-500">
        Không có dữ liệu
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full admin-table-responsive">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-700">
            {columns.map((col, idx) => (
              <th
                key={idx}
                className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                style={col.width ? { width: col.width } : {}}
              >
                {col.label}
              </th>
            ))}
            {renderActions && (
              <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Thao tác
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIdx) => (
            <tr
              key={row.id || rowIdx}
              className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30"
            >
              {columns.map((col, colIdx) => (
                <td
                  key={colIdx}
                  data-label={col.label}
                  className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300"
                >
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
              {renderActions && (
                <td data-label="Thao tác" className="px-4 py-3 text-right">
                  {renderActions(row)}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
