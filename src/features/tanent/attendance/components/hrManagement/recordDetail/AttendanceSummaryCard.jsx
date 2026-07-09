import React from "react";
import PropTypes from "prop-types";

function SummaryMetric({ label, value, highlight = false }) {
  return (
    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col justify-between hover:border-slate-200 transition-colors">
      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{label}</span>
      <span className={`text-base font-bold font-mono mt-2 ${highlight ? "text-indigo-600" : "text-slate-800"}`}>
        {value || "--:--"}
      </span>
    </div>
  );
}

export default function AttendanceSummaryCard({ summary, flags }) {
  if (!summary) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-5">
      <h2 className="text-sm font-bold text-slate-900 tracking-tight uppercase">Metrical Summary</h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <SummaryMetric label="First Clock In" value={summary.first_check_in_at ? new Date(summary.first_check_in_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null} highlight />
        <SummaryMetric label="Last Clock Out" value={summary.last_check_out_at ? new Date(summary.last_check_out_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null} highlight />
        <SummaryMetric label="Late Arrival" value={summary.late_minutes ? `${summary.late_minutes} min` : "0 min"} />
        <SummaryMetric label="Early Exit" value={summary.early_exit_minutes ? `${summary.early_exit_minutes} min` : "0 min"} />
      </div>

      {(flags?.is_auto_closed || flags?.needs_review || summary.source) && (
        <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-100">
          {flags?.is_auto_closed && (
            <span className="text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-md uppercase tracking-wider">
              Auto Closed by System
            </span>
          )}
          {flags?.needs_review && (
            <span className="text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-1 rounded-md uppercase tracking-wider">
              Requires Review
            </span>
          )}
          {flags?.is_finalized && (
            <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 px-2.5 py-1 rounded-md uppercase tracking-wider">
              Finalized (Locked)
            </span>
          )}
        </div>
      )}
    </div>
  );
}

AttendanceSummaryCard.propTypes = {
  summary: PropTypes.object,
  flags: PropTypes.object,
};