// # attendance/components/hrManagement/dashboard/LiveWorkforceTable.jsx

import React from 'react';
import PropTypes from 'prop-types';
import { LiveWorkforceRow } from './LiveWorkforceRow';

export const LiveWorkforceTable = React.memo(({
  employees,
  isLoading,
  isError,
  onRetry,
  pagination,
  onPageChange,
  filters,
  onOrderingChange,
}) => {
  if (isError) {
    return (
      <div className="bg-white border border-dashed border-rose-200 rounded-2xl p-12 text-center">
        <p className="text-sm font-bold text-rose-600 mb-4">Failed to load workforce data.</p>
        <button
          type="button"
          onClick={onRetry}
          className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!isLoading && employees.length === 0) {
    return (
      <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-12 text-center">
        <p className="text-sm font-medium text-slate-500">No employees match the current filters.</p>
      </div>
    );
  }

  const totalPages = Math.ceil((pagination?.count || 0) / (filters?.limit || 20));
  const currentPage = Math.floor((filters?.offset || 0) / (filters?.limit || 20));

  const SortHeader = ({ field, children }) => {
    const isActive = filters?.ordering === field || filters?.ordering === `-${field}`;
    const isDesc = filters?.ordering === `-${field}`;
    return (
      <th
        onClick={() => onOrderingChange(field)}
        className="px-4 py-3 text-left text-[10px] font-extrabold uppercase tracking-wider text-slate-400 cursor-pointer hover:text-slate-600 select-none group"
      >
        <div className="flex items-center gap-1">
          {children}
          {isActive && (
            <svg
              className={`w-3 h-3 transition-transform ${isDesc ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
            </svg>
          )}
        </div>
      </th>
    );
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse" role="table" aria-label="Live Workforce">
          <thead className="bg-slate-50 border-b border-slate-200 sticky top-0">
            <tr>
              <SortHeader field="employee_name">Employee</SortHeader>
              <SortHeader field="department">Department</SortHeader>
              <SortHeader field="shift">Shift</SortHeader>
              <SortHeader field="current_status">Status</SortHeader>
              <SortHeader field="first_check_in">First In</SortHeader>
              <SortHeader field="last_event_time">Last Event</SortHeader>
              <SortHeader field="working_duration">Working</SortHeader>
              <SortHeader field="late_minutes">Late</SortHeader>
              <th className="px-4 py-3 text-left text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-slate-50">
                  <td colSpan={9} className="px-4 py-4">
                    <div className="flex items-center gap-3 animate-pulse">
                      <div className="w-9 h-9 rounded-full bg-slate-200" />
                      <div className="space-y-2">
                        <div className="w-32 h-3 bg-slate-200 rounded" />
                        <div className="w-24 h-2 bg-slate-200 rounded" />
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              employees.map((employee) => (
                <LiveWorkforceRow key={employee.membership_id} employee={employee} />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 bg-slate-50/50">
          <p className="text-xs text-slate-500">
            Showing {filters.offset + 1}-{Math.min(filters.offset + filters.limit, pagination.count)} of {pagination.count}
          </p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentPage === 0}
              onClick={() => onPageChange(currentPage - 1)}
              className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
              const page = i;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => onPageChange(page)}
                  className={`w-8 h-8 text-xs font-bold rounded-lg transition-colors ${
                    page === currentPage
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {page + 1}
                </button>
              );
            })}
            <button
              type="button"
              disabled={currentPage >= totalPages - 1}
              onClick={() => onPageChange(currentPage + 1)}
              className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

LiveWorkforceTable.displayName = 'LiveWorkforceTable';
LiveWorkforceTable.propTypes = {
  employees: PropTypes.array.isRequired,
  isLoading: PropTypes.bool,
  isError: PropTypes.bool,
  onRetry: PropTypes.func,
  pagination: PropTypes.object,
  onPageChange: PropTypes.func,
  filters: PropTypes.object,
  onOrderingChange: PropTypes.func,
};