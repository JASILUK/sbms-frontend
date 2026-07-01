import React from 'react';
import PropTypes from 'prop-types';

export default function DashboardToolbar({ filters, searchVal, onFilterChange, onSearchChange, onClear }) {
  return (
    <section 
      className="sticky top-0 z-10 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/60 shadow-xs rounded-2xl p-4 flex flex-col md:flex-row gap-3 items-center justify-between"
      aria-label="Operational query parameters toolbar"
    >
      <div className="w-full md:w-72 relative">
        <label htmlFor="hr-attendance-search" className="sr-only">Search employees</label>
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          id="hr-attendance-search"
          type="text"
          value={searchVal}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search corporate profile mappings..."
          className="block w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 py-2 pl-9 pr-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:focus:bg-slate-950 transition-all"
        />
      </div>

      <div className="flex flex-col sm:flex-row w-full md:w-auto items-center gap-3">
        <div className="w-full sm:w-auto flex items-center gap-2">
          <label htmlFor="toolbar-date-select" className="text-xs font-medium text-slate-500 whitespace-nowrap">Target Date:</label>
          <input
            id="toolbar-date-select"
            type="date"
            value={filters.date_from || new Date().toISOString().split('T')[0]}
            onChange={(e) => onFilterChange('date_from', e.target.value)}
            className="w-full sm:w-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-200 shadow-xs focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <button
          type="button"
          onClick={onClear}
          className="text-xs font-medium text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 px-2 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors self-end sm:self-auto"
        >
          Reset Filters
        </button>
      </div>
    </section>
  );
}

DashboardToolbar.propTypes = {
  filters: PropTypes.object.isRequired,
  searchVal: PropTypes.string.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
};