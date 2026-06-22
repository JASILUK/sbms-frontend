import React from "react";

const MONTHS = [
  { value: "all", label: "All Months" },
  { value: "01", label: "January" }, { value: "02", label: "February" },
  { value: "03", label: "March" }, { value: "04", label: "April" },
  { value: "05", label: "May" }, { value: "06", label: "June" },
  { value: "07", label: "July" }, { value: "08", label: "August" },
  { value: "09", label: "September" }, { value: "10", label: "October" },
  { value: "11", label: "November" }, { value: "12", label: "December" }
];

export const HolidayFilters = ({ filters, onFilterChange, uniqueTypes = [] }) => {
  const currentYear = new Date().getFullYear();
  const yearOptions = [currentYear - 1, currentYear, currentYear + 1, currentYear + 2];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 mb-6 shadow-xs flex flex-wrap items-center gap-5 justify-between">
      <div className="flex flex-wrap items-center gap-4 flex-1">
        <div className="w-full sm:w-36">
          <label htmlFor="filter-year" className="sr-only">Filter Year</label>
          <select
            id="filter-year"
            value={filters.year}
            onChange={(e) => onFilterChange("year", Number(e.target.value))}
            className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 bg-white focus:border-indigo-500 focus:outline-none"
          >
            {yearOptions.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>

        <div className="w-full sm:w-44">
          <label htmlFor="filter-month" className="sr-only">Filter Month</label>
          <select
            id="filter-month"
            value={filters.month}
            onChange={(e) => onFilterChange("month", e.target.value)}
            className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 bg-white focus:border-indigo-500 focus:outline-none"
          >
            {MONTHS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>
        </div>

        <div className="w-full sm:w-44">
          <label htmlFor="filter-type" className="sr-only">Filter Classification</label>
          <select
            id="filter-type"
            value={filters.holiday_type}
            onChange={(e) => onFilterChange("holiday_type", e.target.value)}
            className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 bg-white focus:border-indigo-500 focus:outline-none"
          >
            <option value="all">All Classifications</option>
            {uniqueTypes.map((t) => (
              <option key={t} value={t} className="capitalize">{t}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center gap-2 border-l border-slate-100 pl-2">
        <button
          type="button"
          role="switch"
          aria-checked={filters.upcoming}
          onClick={() => onFilterChange("upcoming", !filters.upcoming)}
          className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
            filters.upcoming ? "bg-indigo-600" : "bg-slate-200"
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out ${
              filters.upcoming ? "translate-x-4" : "translate-x-0"
            }`}
          />
        </button>
        <span className="text-xs font-semibold text-slate-600 tracking-wide">Upcoming Only</span>
      </div>
    </div>
  );
};