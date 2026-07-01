import React from 'react';
import PropTypes from 'prop-types';

export default function DashboardHeader({ onRefresh, isFetching, lastUpdated }) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 dark:border-slate-900 pb-5" aria-label="Dashboard top header panel">
      <div>
        <nav aria-label="Breadcrumb" className="text-xs text-slate-500 mb-1">
          <ol className="flex items-center gap-1">
            <li><span className="hover:text-slate-700 dark:hover:text-slate-300">Attendance</span></li>
            <li className="before:content-['/'] before:mx-1 before:text-slate-400">
              <span aria-current="page" className="text-slate-700 dark:text-slate-200 font-medium">HR Console</span>
            </li>
          </ol>
        </nav>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Today's Attendance Overview</h1>
      </div>

      <div className="flex items-center gap-3 self-end sm:self-auto">
        {lastUpdated && (
          <p className="text-xs text-slate-500 dark:text-slate-400 hidden md:block">
            Snapshot metrics for: <span className="font-mono font-medium">{lastUpdated}</span>
          </p>
        )}
        <button
          type="button"
          onClick={onRefresh}
          disabled={isFetching}
          aria-label="Refresh telemetry stream"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 shadow-xs hover:bg-slate-50 dark:hover:bg-slate-800/60 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
        >
          <svg className={`h-4 w-4 text-slate-500 ${isFetching ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          <span className="hidden sm:inline">Refresh Data</span>
        </button>
      </div>
    </header>
  );
}

DashboardHeader.propTypes = {
  onRefresh: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
  lastUpdated: PropTypes.string,
};