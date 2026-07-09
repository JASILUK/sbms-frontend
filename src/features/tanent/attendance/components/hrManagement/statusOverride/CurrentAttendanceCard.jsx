import React from "react";
import PropTypes from "prop-types";
import { ATTENDANCE_THEME } from "../../../constants/hrAttendance";

export default function CurrentAttendanceCard({ header, summary, flags }) {
  if (!summary && !header) return null;
  const metrics = summary || {};
  const currentStatus = header?.attendance_status || metrics.attendance_status || "UNKNOWN";
  const badgeTheme = ATTENDANCE_THEME[currentStatus] || { color: "text-slate-600", bg: "bg-slate-50", border: "border-slate-200" };

  return (
    <section className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3" aria-label="Current attendance metrical overview">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Current Roster State</h3>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border ${badgeTheme.bg} ${badgeTheme.color} ${badgeTheme.border}`}>
          {currentStatus}
        </span>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
        <div className="bg-white p-2.5 rounded-xl border border-slate-200/60">
          <span className="text-[10px] text-slate-400 font-sans block mb-0.5">First Check In</span>
          <span className="font-bold text-slate-800">
            {metrics.first_check_in_at ? new Date(metrics.first_check_in_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "--:--"}
          </span>
        </div>
        <div className="bg-white p-2.5 rounded-xl border border-slate-200/60">
          <span className="text-[10px] text-slate-400 font-sans block mb-0.5">Last Check Out</span>
          <span className="font-bold text-slate-800">
            {metrics.last_check_out_at ? new Date(metrics.last_check_out_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "--:--"}
          </span>
        </div>
        <div className="bg-white p-2.5 rounded-xl border border-slate-200/60">
          <span className="text-[10px] text-slate-400 font-sans block mb-0.5">Calculated Work</span>
          <span className="font-bold text-indigo-600">{(metrics.working_hours || 0).toFixed(2)}h</span>
        </div>
        <div className="bg-white p-2.5 rounded-xl border border-slate-200/60">
          <span className="text-[10px] text-slate-400 font-sans block mb-0.5">Exception Flags</span>
          <span className={`font-bold ${flags?.needs_review ? "text-rose-600" : "text-emerald-600"}`}>
            {flags?.needs_review ? "Active Review" : "Clear"}
          </span>
        </div>
      </div>
    </section>
  );
}

CurrentAttendanceCard.propTypes = {
  header: PropTypes.object,
  summary: PropTypes.object,
  flags: PropTypes.object,
};