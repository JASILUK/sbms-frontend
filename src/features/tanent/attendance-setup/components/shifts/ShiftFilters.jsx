import React from "react";
import { Search } from "lucide-react";

export const ShiftFilters = ({ filters, onFilterChange }) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Search */}
        <div className="relative">
          <label htmlFor="shift-search" className="sr-only">Search Shifts</label>
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center定位 pl-3 text-slate-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            id="shift-search"
            type="search"
            placeholder="Search shifts..."
            value={filters.search}
            onChange={(e) => onFilterChange("search", e.target.value)}
            className="block w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
          />
        </div>

        {/* Operational Status */}
        <div>
          <label htmlFor="filter-status" className="sr-only">Status Filter</label>
          <select
            id="filter-status"
            value={filters.is_active}
            onChange={(e) => onFilterChange("is_active", e.target.value)}
            className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer"
          >
            <option value="all">All Operational Statuses</option>
            <option value="active">Active Patterns Only</option>
            <option value="inactive">Archived / Inactive</option>
          </select>
        </div>

        {/* Shift Classification */}
        <div>
          <label htmlFor="filter-type" className="sr-only">Shift Classification Filter</label>
          <select
            id="filter-type"
            value={filters.shift_type}
            onChange={(e) => onFilterChange("shift_type", e.target.value)}
            className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer"
          >
            <option value="all">All Shift Classifications</option>
            <option value="regular">Regular Work Shifts</option>
            <option value="night">Night Duty Windows</option>
          </select>
        </div>

        {/* Ordering Sequence */}
        <div>
          <label htmlFor="filter-sort" className="sr-only">Ordering Rule</label>
          <select
            id="filter-sort"
            value={filters.ordering}
            onChange={(e) => onFilterChange("ordering", e.target.value)}
            className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer"
          >
            <option value="name">Alphabetical Order (A – Z)</option>
            <option value="-name">Reverse Alphabetical (Z – A)</option>
          </select>
        </div>
      </div>
    </div>
  );
};