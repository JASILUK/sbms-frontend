import React from 'react';
import PropTypes from 'prop-types';

export default function LiveStatusGrid({ workforce = [] }) {
  return (
    <section className="bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl shadow-xs p-5 space-y-4" aria-label="Real-time employee status monitoring panel">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">Live Attendance Overview</h2>
        <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-1 rounded-lg border border-emerald-200/60 dark:border-emerald-900/60 font-mono animate-pulse">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          {workforce?.length || 0} Working Now
        </span>
      </div>

      {!workforce?.length ? (
        <div className="text-center py-8 border border-dashed border-slate-100 dark:border-slate-900 rounded-xl">
          <p className="text-sm text-slate-400">No active tracking matrices recorded within this window block.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[360px] overflow-y-auto pr-1">
          {workforce.map((user) => (
            <div 
              key={user.id || user.membership_id} 
              className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-900 bg-slate-50/40 dark:bg-slate-900/20 hover:border-slate-200 dark:hover:border-slate-800 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-950/60 flex items-center justify-center font-bold text-xs text-indigo-600 dark:text-indigo-400 font-mono">
                  {user.username?.substring(0, 2).toUpperCase() || 'EM'}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white truncate max-w-[140px]">{user.employee_name || user.username}</h3>
                  <p className="text-xs text-slate-400 truncate max-w-[140px]">{user.department_name}</p>
                </div>
              </div>
              <div className="text-right font-mono text-xs">
                <p className="font-semibold text-slate-700 dark:text-slate-300">{user.first_check_in_at ? new Date(user.first_check_in_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '--:--'}</p>
                <p className="text-slate-400 uppercase text-[10px] tracking-wider">{user.attendance_method || 'WEB'}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

LiveStatusGrid.propTypes = {
  workforce: PropTypes.array,
};