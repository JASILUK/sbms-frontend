import React from "react";
import PropTypes from "prop-types";

export const ReviewToolbar = React.memo(({ filters, searchInputValue, onSearchValueChange, onFilterChange, onClear }) => {
  return (
    <div className="bg-white p-4 border border-slate-200 rounded-2xl flex flex-col md:flex-row gap-3 shadow-xs">
      <div className="flex-1">
        <label htmlFor="search-input" className="sr-only">Search Employee</label>
        <input
          id="search-input"
          type="text"
          placeholder="Search corporate employee name or metadata log info..."
          value={searchInputValue}
          onChange={(e) => onSearchValueChange(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
        />
      </div>
      
      <div className="flex flex-wrap gap-2 items-center">
        <label htmlFor="reason-filter" className="sr-only">Anomaly Reason</label>
        <select
          id="reason-filter"
          value={filters.review_reason}
          onChange={(e) => onFilterChange({ review_reason: e.target.value })}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-indigo-500 transition-colors"
        >
          <option value="">All Anomaly Reasons</option>
          <option value="missing">Missing Checkout</option>
          <option value="duplicate">Duplicate Punches</option>
          <option value="inverted">Inverted Sequence</option>
          <option value="impossible">Duration Overflow</option>
        </select>

        <label htmlFor="date-filter" className="sr-only">Target Date</label>
        <input
          id="date-filter"
          type="date"
          value={filters.date}
          onChange={(e) => onFilterChange({ date: e.target.value, date_from: e.target.value, date_to: e.target.value })}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 focus:outline-none font-mono transition-colors"
        />

        <button
          type="button"
          onClick={onClear}
          className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold rounded-xl transition-colors cursor-pointer"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
});

ReviewToolbar.displayName = "ReviewToolbar";
ReviewToolbar.propTypes = {
  filters: PropTypes.object.isRequired,
  searchInputValue: PropTypes.string.isRequired,
  onSearchValueChange: PropTypes.func.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
};