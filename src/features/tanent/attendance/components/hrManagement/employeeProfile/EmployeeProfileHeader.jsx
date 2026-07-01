import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { HR_ROUTES } from "../../../constants/hrAttendance";

export default function EmployeeProfileHeader({ employeeMeta, filters, onFilterChange, onRefresh, isFetching }) {
  const navigate = useNavigate();
  const name = employeeMeta ? employeeMeta.full_name : "Employee Profile";

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 pb-4 pt-2 flex flex-col gap-4 md:flex-row md:items-center md:justify-between transition-all" aria-label="Profile navigation controls bar">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate(HR_ROUTES.DIRECTORY)}
          className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
          aria-label="Back to employee directory grid"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">{name}</h1>
          <p className="text-xs text-slate-400 font-mono">Workspace Audit Log History</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 self-end md:self-auto">
        {/* Parametric Workspace Date Range Pickers */}
        <div className="flex items-center gap-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-xl px-3 py-1.5 shadow-inner">
          <input
            type="date"
            aria-label="Start date filter parameter"
            value={filters.date_from}
            onChange={(e) => onFilterChange({ date_from: e.target.value })}
            className="bg-transparent text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
          />
          <span className="text-xs text-slate-400 font-bold" aria-hidden="true">to</span>
          <input
            type="date"
            aria-label="End date filter parameter"
            value={filters.date_to}
            onChange={(e) => onFilterChange({ date_to: e.target.value })}
            className="bg-transparent text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
          />
        </div>

        <button
          type="button"
          onClick={onRefresh}
          disabled={isFetching}
          className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm disabled:opacity-50 transition-colors"
          aria-label="Synchronize workspace dataset parameters"
        >
          <svg className={`h-4 w-4 ${isFetching ? "animate-spin text-indigo-500" : "text-slate-500"}`} fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
        </button>
      </div>
    </header>
  );
}

EmployeeProfileHeader.propTypes = {
  employeeMeta: PropTypes.object,
  filters: PropTypes.object.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  onRefresh: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
};