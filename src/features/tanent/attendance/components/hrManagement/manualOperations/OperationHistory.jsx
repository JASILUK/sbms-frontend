import React from "react";
import PropTypes from "prop-types";

export default function OperationHistory({ historicTimeline = [] }) {
  // Extract administrative intervention occurrences out of the general timeline stream arrays
  const corrections = historicTimeline.filter(
    (ev) => ev.attendance_method === "MANUAL" || ev.attendance_method === "ADMIN_OVERRIDE"
  );

  if (!corrections.length) return null;

  return (
    <div className="space-y-3 w-full pt-2">
      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Recent Workspace Manual Adjudications</h4>
      <div className="border border-slate-200/80 bg-white rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-mono text-[11px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-sans font-bold uppercase tracking-wider text-[10px]">
                <th className="py-2 px-3">Timestamp</th>
                <th className="py-2 px-3">Operation Event</th>
                <th className="py-2 px-3">Authorized Adjudicator</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600 bg-white">
              {corrections.map((item, index) => (
                <tr key={item.id || index} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-2 px-3 font-semibold text-slate-900">
                    {new Date(item.event_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </td>
                  <td className="py-2 px-3 font-sans font-medium text-slate-700">
                    {item.event_type} <span className="text-[9px] bg-slate-100 border px-1 rounded block mt-0.5 w-max font-mono font-bold uppercase tracking-wide">{item.attendance_method}</span>
                  </td>
                  <td className="py-2 px-3 font-sans text-slate-400 truncate max-w-[110px]" title={item.notes}>
                    {item.instigated_by || "System Admin"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

OperationHistory.propTypes = {
  historicTimeline: PropTypes.array,
};