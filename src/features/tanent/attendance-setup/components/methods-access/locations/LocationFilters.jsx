import React from 'react';
import { Search, Filter } from 'lucide-react';
import { LOCATION_STATUS_FILTERS } from '../../../constants/attendanceLocationConstants';

export const LocationFilters = React.memo(({ search, onSearchChange, status, onStatusChange }) => (
  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200/60 text-xs">
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
      <input
        type="text"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search perimeter label name or corporate address..."
        className="w-full pl-9 pr-4 py-1.5 border border-slate-200 bg-white rounded-lg focus:outline-none focus:border-slate-900 placeholder-slate-400 font-medium"
      />
    </div>
    <div className="flex items-center gap-2">
      <div className="inline-flex border border-slate-200 bg-white p-0.5 rounded-lg shadow-2xs">
        {Object.entries(LOCATION_STATUS_FILTERS).map(([key, val]) => (
          <button
            key={val}
            onClick={() => onStatusChange(val)}
            className={`px-3 py-1 rounded-md font-semibold transition-colors ${
              status === val ? 'bg-slate-900 text-white shadow-2xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {key.charAt(0) + key.slice(1).toLowerCase()}
          </button>
        ))}
      </div>
    </div>
  </div>
));

LocationFilters.displayName = 'LocationFilters';