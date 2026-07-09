import React from 'react';
import PropTypes from 'prop-types';

export const ActivityTimeline = React.memo(({ activities = [] }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4 w-full">
      <div>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Streaming Activity Punch Feed</h3>
        <p className="text-xs text-slate-500 font-semibold mt-0.5">Latest chronological ingestion interactions</p>
      </div>

      {!activities.length ? (
        <p className="text-xs text-slate-400 font-mono py-6 text-center">No raw transaction punch flows written today.</p>
      ) : (
        <div className="flow-root pl-1 max-h-[320px] overflow-y-auto pr-1">
          <ul role="list" className="-mb-8">
            {activities.map((act, idx) => (
              <li key={act.id || idx}>
                <div className="relative pb-6">
                  {idx !== activities.length - 1 && (
                    <span className="absolute top-4 left-3 -ml-px h-full w-0.5 bg-slate-100" aria-hidden="true" />
                  )}
                  <div className="relative flex space-x-3 text-xs">
                    <span className="h-6 w-6 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center font-mono font-black text-[9px] text-slate-400 shadow-xs shrink-0">
                      {act.event?.charAt(0) || "P"}
                    </span>
                    <div className="flex-1 min-w-0 pt-0.5 flex justify-between space-x-4">
                      <div>
                        <p className="font-bold text-slate-800">{act.employee_name}</p>
                        <p className="text-[10px] text-slate-400 font-medium">{act.event} • Channel: {act.method}</p>
                      </div>
                      <div className="text-right whitespace-nowrap text-[10px] text-indigo-600 font-mono font-bold">
                        {act.time ? new Date(act.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--:--"}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
});

ActivityTimeline.displayName = "ActivityTimeline";
ActivityTimeline.propTypes = {
  activities: PropTypes.array,
};