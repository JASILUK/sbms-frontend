import React from "react";
import PropTypes from "prop-types";

export default function PolicySnapshotCard({ snapshot }) {
  if (!snapshot) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-4">
      <h3 className="text-sm font-bold text-slate-900 tracking-tight uppercase">Policy Rules Evaluated</h3>
      <div className="text-xs space-y-3 text-slate-600">
        <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
          <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Late Arrival Threshold</span>
          <span className="font-semibold text-slate-800">{snapshot.late_policy || "Standard Policy"}</span>
        </div>
        <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
          <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Early Exit Strategy</span>
          <span className="font-semibold text-slate-800">{snapshot.early_exit_policy || "Standard Policy"}</span>
        </div>
        <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
          <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Auto-Close Rule</span>
          <span className="font-semibold text-slate-800">{snapshot.auto_close_rules || "System Default"}</span>
        </div>
      </div>
    </div>
  );
}

PolicySnapshotCard.propTypes = {
  snapshot: PropTypes.object,
};