import React from "react";
import PropTypes from "prop-types";

export default function DirectoryToolbar({ filters, onFilterChange, onClear, searchInputValue, onSearchValueChange }) {
  return (
    <section className="bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/60 shadow-sm rounded-2xl p-4 flex flex-col gap-4 w-full" aria-label="Directory granular filters panel">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Search Parameter Capture */}
        <div className="relative">
          <label htmlFor="directory-search-input" className="sr-only">Search employees</label>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            id="directory-search-input"
            type="text"
            value={searchInputValue}
            onChange={(e) => onSearchValueChange(e.target.value)}
            placeholder="Search name, code, email..."
            className="block w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 py-2 pl-9 pr-3 text-sm text-slate-900 dark:text-white focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
          />
        </div>

        {/* Department Structural Filter Dropdown */}
        <div>
          <label htmlFor="dept-select-box" className="sr-only">Filter by Department</label>
          <select
            id="dept-select-box"
            value={filters.department}
            onChange={(e) => onFilterChange({ department: e.target.value })}
            className="block w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="">All Departments</option>
            <option value="1">Core Engineering</option>
            <option value="2">Human Resources</option>
            <option value="3">Product Management</option>
          </select>
        </div>

        {/* Current Working Operational State Selection */}
        <div>
          <label htmlFor="state-select-box" className="sr-only">Filter by Current State</label>
          <select
            id="state-select-box"
            value={filters.current_state}
            onChange={(e) => onFilterChange({ current_state: e.target.value })}
            className="block w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="">All Operational States</option>
            <option value="Not Started">Not Started</option>
            <option value="Working">Working</option>
            <option value="Checked Out">Checked Out</option>
            <option value="On Leave">On Leave</option>
          </select>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-900 pt-3">
        <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input 
              type="checkbox" 
              checked={filters.missing_checkout === "true"}
              onChange={(e) => onFilterChange({ missing_checkout: e.target.checked ? "true" : "" })}
              className="rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 dark:border-slate-800 h-4 w-4"
            />
            Missing Checkout
          </label>
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input 
              type="checkbox" 
              checked={filters.auto_closed === "true"}
              onChange={(e) => onFilterChange({ auto_closed: e.target.checked ? "true" : "" })}
              className="rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 dark:border-slate-800 h-4 w-4"
            />
            Auto Closed
          </label>
        </div>

        <button
          type="button"
          onClick={onClear}
          className="text-xs font-semibold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors px-2 py-1 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-lg"
        >
          Clear Filters
        </button>
      </div>
    </section>
  );
}

DirectoryToolbar.propTypes = {
  filters: PropTypes.object.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  searchInputValue: PropTypes.string.isRequired,
  onSearchValueChange: PropTypes.func.isRequired,
};