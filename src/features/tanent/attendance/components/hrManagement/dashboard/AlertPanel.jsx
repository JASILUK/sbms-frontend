import React from 'react';
import PropTypes from 'prop-types';

export default function AlertPanel({ alerts = [] }) {
  if (!alerts?.length) return null;

  return (
    <section className="bg-white dark:bg-slate-950 border border-red-200/60 dark:border-red-950/40 rounded-2xl shadow-xs p-5 space-y-4" aria-label="Critical tracking exceptions list">
      <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
        Critical Action Alerts
      </h2>

      <div className="space-y-2 max-h-[280px] overflow-y-auto">
        {alerts.map((alert, idx) => (
          <div 
            key={alert.id || idx} 
            className="p-3 border border-red-100/60 dark:border-red-900/30 rounded-xl bg-red-50/20 dark:bg-red-950/10 flex flex-col gap-1 text-xs"
          >
            <div className="flex items-center justify-between font-semibold text-slate-900 dark:text-slate-100">
              <span>{alert.employee_name}</span>
              <span className="font-mono text-[10px] bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400 px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                {alert.alert_type || 'REVIEW'}
              </span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-medium">{alert.trigger_description || alert.review_reason}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

AlertPanel.propTypes = {
  alerts: PropTypes.array,
};