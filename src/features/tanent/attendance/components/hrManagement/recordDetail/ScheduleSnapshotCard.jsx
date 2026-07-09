import React from "react";
import PropTypes from "prop-types";

function DetailRow({ label, value }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0 last:pb-0">
      <span className="text-xs text-slate-500 font-medium">{label}</span>
      <span className="text-xs font-bold text-slate-800 font-mono">{value || "--:--"}</span>
    </div>
  );
}

export default function ScheduleSnapshotCard({ snapshot }) {
  if (!snapshot) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-4">
      <h3 className="text-sm font-bold text-slate-900 tracking-tight uppercase">Schedule Snapshot</h3>
      <div className="space-y-1">
        <DetailRow label="Shift Name" value={snapshot.shift_name || "Unassigned"} />
        <DetailRow label="Expected In" value={snapshot.expected_clock_in} />
        <DetailRow label="Expected Out" value={snapshot.expected_clock_out} />
        <DetailRow label="Target Mins" value={snapshot.expected_working_minutes ? `${snapshot.expected_working_minutes} m` : "0 m"} />
      </div>
    </div>
  );
}

ScheduleSnapshotCard.propTypes = {
  snapshot: PropTypes.object,
};