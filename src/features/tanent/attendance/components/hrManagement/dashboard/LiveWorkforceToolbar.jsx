// # attendance/components/hrManagement/dashboard/LiveWorkforceToolbar.jsx

import React from 'react';
import PropTypes from 'prop-types';

export const LiveWorkforceToolbar = React.memo(({
  filters,
  searchVal,
  filterMetadata,
  onSearchChange,
  onFilterChange,
  onClear,
  isLoading,
}) => {
  const departments = filterMetadata?.departments || [];
  const shifts = filterMetadata?.shifts || [];
  const statuses = filterMetadata?.available_statuses || [];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            placeholder="Search employees..."
            value={searchVal}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
          />
        </div>

        {/* Date */}
        <input
          type="date"
          value={filters.date}
          onChange={(e) => onFilterChange('date', e.target.value)}
          className="px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
        />

        {/* Department */}
        <select
          value={filters.department}
          onChange={(e) => onFilterChange('department', e.target.value)}
          className="px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 min-w-[140px]"
        >
          <option value="">All Departments</option>
          {departments.map((dept) => (
            <option key={dept.id} value={dept.id}>
              {dept.name}
            </option>
          ))}
        </select>

        {/* Shift */}
        <select
          value={filters.shift}
          onChange={(e) => onFilterChange('shift', e.target.value)}
          className="px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 min-w-[140px]"
        >
          <option value="">All Shifts</option>
          {shifts.map((shift) => (
            <option key={shift.id} value={shift.id}>
              {shift.name}
            </option>
          ))}
        </select>

        {/* Status */}
        <select
          value={filters.status}
          onChange={(e) => onFilterChange('status', e.target.value)}
          className="px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 min-w-[140px]"
        >
          <option value="">All Statuses</option>
          {statuses.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>

        {/* Needs Review Toggle */}
        <button
          type="button"
          onClick={() => onFilterChange('needs_review', filters.needs_review ? '' : 'true')}
          className={`px-3 py-2 text-xs font-bold rounded-xl border transition-all ${
            filters.needs_review
              ? 'bg-rose-50 text-rose-700 border-rose-300'
              : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
          }`}
        >
          Needs Review
        </button>

        {/* Clear */}
        <button
          type="button"
          onClick={onClear}
          className="px-3 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 transition-colors"
        >
          Reset
        </button>
      </div>
    </div>
  );
});

LiveWorkforceToolbar.displayName = 'LiveWorkforceToolbar';
LiveWorkforceToolbar.propTypes = {
  filters: PropTypes.object.isRequired,
  searchVal: PropTypes.string.isRequired,
  filterMetadata: PropTypes.object,
  onSearchChange: PropTypes.func.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};