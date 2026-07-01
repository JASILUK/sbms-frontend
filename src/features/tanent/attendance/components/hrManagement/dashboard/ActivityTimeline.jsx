import React from 'react';
import PropTypes from 'prop-types';

export default function ActivityTimeline({ activities = [] }) {
  return (
    <section className="bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl shadow-xs p-5 space-y-4" aria-label="Recent system transaction streams">
      <h2 className="text-base font-bold text-slate-900 dark:text-white">Latest Activity Logs</h2>
      
      {!activities?.length ? (
        <p className="text-sm text-slate-400 text-center py-4">No events trace signatures detected.</p>
      ) : (
        <div className="flow-root">
          <ul role="list" className="-mb-8">
            {activities.map((act, actIdx) => (
              <li key={act.id || actIdx}>
                <div className="relative pb-5">
                  {actIdx !== activities.length - 1 ? (
                    <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-100 dark:bg-slate-900" aria-hidden="true" />
                  ) : null}
                  <div className="relative flex space-x-3">
                    <div>
                      <span className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center ring-8 ring-white dark:ring-slate-950 text-xs font-mono font-bold text-slate-500">
                        {act.event_type?.charAt(0) || 'E'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0 pt-1.5 flex justify-between space-x-4">
                      <div>
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{act.employee_name}</p>
                        <p className="text-xs text-slate-400 font-mono uppercase tracking-wider">{act.event_type} • {act.source}</p>
                      </div>
                      <div className="text-right whitespace-nowrap text-xs text-slate-400 font-mono">
                        <time dateTime={act.timestamp}>
                          {new Date(act.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </time>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

ActivityTimeline.propTypes = {
  activities: PropTypes.array,
};