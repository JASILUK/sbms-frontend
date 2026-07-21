import React from "react";
import PropTypes from "prop-types";
import { Edit2 } from "lucide-react";

export default function AttendanceEventsTable({ events = [], onEditEvent, isEditable = true }) {
  if (!events.length) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden w-full">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
        <h2 className="text-xs font-bold text-slate-700 tracking-tight uppercase">Event Log Detail Grid</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
              <th className="py-3 px-6">Timestamp</th>
              <th className="py-3 px-4">Event Type</th>
              <th className="py-3 px-4">Method</th>
              <th className="py-3 px-6">Source / Notes</th>
              {isEditable && <th className="py-3 px-6 text-center w-24">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-mono text-xs text-slate-700 bg-white">
            {events.map((event, index) => (
              <tr key={event.id || index} className="hover:bg-slate-50/60 transition-colors">
                <td className="py-3 px-6 font-semibold text-slate-900">
                  {new Date(event.event_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </td>
                <td className="py-3 px-4 font-sans font-medium text-slate-600">
                  <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-[11px]">
                    {event.event_type}
                  </span>
                </td>
                <td className="py-3 px-4 uppercase text-[10px] tracking-wide">
                  <span className="bg-slate-50 text-slate-500 border border-slate-200 px-2 py-1 rounded-md">{event.attendance_method}</span>
                </td>
                <td className="py-3 px-6 font-sans">
                  <div className="truncate max-w-[200px]" title={event.notes}>
                    <span className="font-semibold text-slate-900 block truncate">{event.instigated_by || "System"}</span>
                    <span className="text-slate-400 text-[11px] block truncate mt-0.5">{event.notes || "—"}</span>
                  </div>
                </td>
                {isEditable && (
                  <td className="py-2 px-6 text-center font-sans">
                    <button
                      type="button"
                      onClick={() => onEditEvent(event)}
                      className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all cursor-pointer inline-flex items-center gap-1 text-xs font-semibold"
                      title="Adjust Transaction Boundary Parameters"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      Modify
                    </button>
                  </td>
                )}
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
  onEditEvent: PropTypes.func.isRequired,
  isEditable: PropTypes.bool,
};