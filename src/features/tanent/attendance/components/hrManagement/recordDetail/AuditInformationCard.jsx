import React from "react";
import PropTypes from "prop-types";

export default function AuditInformationCard({ reviewInfo }) {
  if (!reviewInfo) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-4">
      <h2 className="text-sm font-bold text-slate-900 tracking-tight uppercase">Audit Logs</h2>
      
      <div className="space-y-4 text-xs">
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Active Review Context</span>
          <p className="text-slate-700 font-medium leading-relaxed">{reviewInfo.review_reason || "No manual exceptions logged."}</p>
        </div>

        {reviewInfo.auto_close_reason && (
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
            <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider block mb-1">Auto Close Reason</span>
            <p className="text-amber-800 font-medium leading-relaxed">{reviewInfo.auto_close_reason}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 text-[10px] font-mono text-slate-400 pt-2 border-t border-slate-100">
          <div>
            <span className="block uppercase tracking-wider font-bold mb-0.5">Created At</span>
            <span>{reviewInfo.created_at ? new Date(reviewInfo.created_at).toLocaleString() : "N/A"}</span>
          </div>
          <div className="text-right">
            <span className="block uppercase tracking-wider font-bold mb-0.5">Updated At</span>
            <span>{reviewInfo.updated_at ? new Date(reviewInfo.updated_at).toLocaleString() : "N/A"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

AuditInformationCard.propTypes = {
  reviewInfo: PropTypes.object,
};