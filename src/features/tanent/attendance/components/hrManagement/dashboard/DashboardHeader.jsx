import React from 'react';
import PropTypes from 'prop-types';

export const DashboardHeader = React.memo(({ metadata, onRefresh, isFetching }) => {
  const companyName = metadata?.company_name || "Enterprise Workspace";
  const dateStr = metadata?.summary_date || new Date().toISOString().split('T')[0];

  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-5" aria-label="Dashboard head navigation context">
      <div>
        <nav aria-label="Breadcrumb" className="text-xs text-slate-400 font-medium mb-1 font-mono uppercase tracking-wider">
          Attendance / <span className="text-slate-600 font-sans font-bold">HR Dashboard</span>
        </nav>
        <h1 className="text-2xl font-black tracking-tight text-slate-900">{companyName} Overview</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">Real-time parametric attendance metrics tracking dashboard platform.</p>
      </div>

      <div className="flex items-center gap-3 self-end sm:self-auto">
        <div className="text-right hidden md:block font-mono text-[11px] text-slate-400">
          <span>Active Zone: {metadata?.timezone || "UTC"}</span>
          <span className="block text-slate-500 font-sans font-medium">Snapshot: {dateStr}</span>
        </div>
        <button
          type="button"
          onClick={onRefresh}
          disabled={isFetching}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors cursor-pointer"
        >
          <svg className={`h-4 w-4 text-indigo-600 ${isFetching ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          Synchronize Console
        </button>
      </div>
    </header>
  );
});

DashboardHeader.displayName = "DashboardHeader";
DashboardHeader.propTypes = {
  metadata: PropTypes.object,
  onRefresh: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
};