import React from "react";
import PropTypes from "prop-types";

export default function CurrentAttendanceCard({ summary, record }) {
  if (!summary && !record) return null;
  const target = summary || record;

  const clockIn = target.first_check_in_at ? new Date(target.first_check_in_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "--:--";
  const clockOut = target.last_check_out_at ? new Date(target.last_check_out_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "--:--";

  return (
    <section className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3" aria-label="Current operational timesheet context snapshot">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Current Record Snapshot</h3>
        <span className="text-[10px] font-mono font-bold bg-white text-slate-600 px-2 py-0.5 rounded-md border border-slate-200">
          Status: {target.attendance_status || "N/A"}
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
        <div className="bg-white p-2.5 rounded-xl border border-slate-200/60">
          <span className="text-[10px] text-slate-400 font-sans block mb-0.5">Clock In</span>
          <span className="font-bold text-slate-800">{clockIn}</span>
        </div>
        <div className="bg-white p-2.5 rounded-xl border border-slate-200/60">
          <span className="text-[10px] text-slate-400 font-sans block mb-0.5">Clock Out</span>
          <span className="font-bold text-slate-800">{clockOut}</span>
        </div>
        <div className="bg-white p-2.5 rounded-xl border border-slate-200/60">
          <span className="text-[10px] text-slate-400 font-sans block mb-0.5">Worked Duration</span>
          <span className="font-bold text-indigo-600">{(target.working_hours || 0).toFixed(2)}h</span>
        </div>
        <div className="bg-white p-2.5 rounded-xl border border-slate-200/60">
          <span className="text-[10px] text-slate-400 font-sans block mb-0.5">Break Interval</span>
          <span className="font-bold text-slate-700">{(target.break_hours || 0).toFixed(2)}h</span>
        </div>
      </div>
    </section>
  );
}

CurrentAttendanceCard.propTypes = {
  summary: PropTypes.object,
  record: PropTypes.object,
};