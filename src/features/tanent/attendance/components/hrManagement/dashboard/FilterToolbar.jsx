import React from 'react';
import PropTypes from 'prop-types';

export const FilterToolbar = React.memo(({ filters, onFilterChange, onClear }) => {
  return (
    <section className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row gap-4 items-center justify-between shadow-xs">
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <label htmlFor="dashboard-calendar-date" className="text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Target Date:</label>
        <input
          id="dashboard-calendar-date"
          type="date"
          value={filters.date_from || new Date().toISOString().split('T')[0]}
          onChange={(e) => onFilterChange('date_from', e.target.value)}
          className="w-full sm:w-auto rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 focus:outline-hidden focus:bg-white focus:border-indigo-500 transition-all font-mono"
        />
      </div>
      <button
        type="button"
        onClick={onClear}
        className="text-xs font-bold text-slate-400 hover:text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors self-end sm:self-auto cursor-pointer"
      >
        Clear Parameters
      </button>
    </section>
  );
});

FilterToolbar.displayName = "FilterToolbar";
FilterToolbar.propTypes = {
  filters: PropTypes.object.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
};