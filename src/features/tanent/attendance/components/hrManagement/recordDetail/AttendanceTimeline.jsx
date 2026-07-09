import React from "react";
import PropTypes from "prop-types";

export default function AttendanceTimeline({ events = [] }) {
  if (!events.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8 text-center">
        <p className="text-sm text-slate-500 font-medium">No timeline events recorded for this operational window.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-6">
      <h2 className="text-sm font-bold text-slate-900 tracking-tight uppercase">Event Timeline</h2>
      
      <div className="flow-root pl-2">
        <ul role="list" className="-mb-8">
          {events.map((event, idx) => (
            <li key={event.id || idx}>
              <div className="relative pb-8">
                {idx !== events.length - 1 ? (
                  <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-200" aria-hidden="true" />
                ) : null}
                
                <div className="relative flex space-x-4">
                  <div>
                    <span className="h-8 w-8 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center ring-8 ring-white text-xs font-mono font-bold text-slate-500 shadow-sm">
                      {event.event_type?.charAt(0) || "E"}
                    </span>
                  </div>
                  
                  <div className="flex-1 min-w-0 flex justify-between space-x-4">
                    <div className="pt-1.5">
                      <p className="text-sm font-bold text-slate-800">{event.event_type}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded-sm">
                          {event.attendance_method}
                        </span>
                        {event.location_name && (
                          <span className="text-xs text-slate-500">at {event.location_name}</span>
                        )}
                      </div>
                      {event.notes && (
                        <p className="mt-3 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                          {event.notes}
                        </p>
                      )}
                    </div>
                    <div className="text-right whitespace-nowrap text-xs text-indigo-600 font-mono font-bold pt-1.5">
                      <time dateTime={event.event_time}>
                        {new Date(event.event_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </time>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

AttendanceTimeline.propTypes = {
  events: PropTypes.array,
};