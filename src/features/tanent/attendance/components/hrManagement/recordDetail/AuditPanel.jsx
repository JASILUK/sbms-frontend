import React from "react";
import PropTypes from "prop-types";

export default function AuditPanel({ reviewInfo }) {
  if (!reviewInfo) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-xs p-5 space-y-4">
      <h2 className="text-sm font-bold text-slate-900 tracking-tight">Compliance Narrative & Audit Logs</h2>
      
      <div className="space-y-3 text-xs font-mono text-slate-600">
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-sans block">Active Review Reason</span>
          <p className="text-slate-700 font-medium">{reviewInfo.review_reason || "No manual review exception narrative logs submitted."}</p>
        </div>

        {reviewInfo.auto_close_reason && (
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-sans block">Auto Close Trigger Log</span>
            <p className="text-amber-700 font-medium">{reviewInfo.auto_close_reason}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 pt-1">
          <span>Created: {new Date(reviewInfo.created_at).toLocaleDateString()}</span>
          <span className="text-right">Last System Sync: {new Date(reviewInfo.updated_at).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}

AuditPanel.propTypes = {
  reviewInfo: PropTypes.object,
};