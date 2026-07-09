import React from "react";
import PropTypes from "prop-types";

export default function AttendanceEventsTable({ events = [] }) {
  if (!events.length) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden w-full">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
        <h2 className="text-sm font-bold text-slate-900 tracking-tight uppercase">Event Log Detail Grid</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
              <th className="py-3 px-6">Timestamp</th>
              <th className="py-3 px-4">Event Type</th>
              <th className="py-3 px-4">Method</th>
              <th className="py-3 px-6">Source / Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-mono text-xs text-slate-700 bg-white">
            {events.map((event, index) => (
              <tr key={event.id || index} className="hover:bg-slate-50 transition-colors">
                <td className="py-3 px-6 font-semibold">
                  {new Date(event.event_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </td>
                <td className="py-3 px-4 font-sans font-medium">{event.event_type}</td>
                <td className="py-3 px-4 uppercase text-[10px] tracking-wide">
                  <span className="bg-slate-50 text-slate-600 border border-slate-200 px-2 py-1 rounded-md">{event.attendance_method}</span>
                </td>
                <td className="py-3 px-6 font-sans">
                  <div className="truncate max-w-[200px]" title={event.notes}>
                    <span className="font-semibold text-slate-900 block">{event.instigated_by || "System"}</span>
                    <span className="text-slate-500 text-[11px]">{event.notes || "-"}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

AttendanceEventsTable.propTypes = {
  events: PropTypes.array,
};