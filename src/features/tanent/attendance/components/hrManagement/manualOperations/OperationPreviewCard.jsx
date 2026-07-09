import React from "react";
import PropTypes from "prop-types";

export default function OperationPreviewCard({ activeOp, formData, originalRecord }) {
  if (!formData.event_time) return null;

  return (
    <section className="bg-indigo-50/40 border border-indigo-100 rounded-2xl p-4 space-y-3" aria-label="Simulated computation engine timeline prediction summary">
      <div className="flex items-center gap-2 text-indigo-900">
        <svg className="h-4 w-4 text-indigo-600 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <h4 className="text-xs font-bold uppercase tracking-wider">Simulated Recalculation Preview</h4>
      </div>

      <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
        <p>
          Submitting this action will insert a fresh transaction record under type{" "}
          <strong className="text-indigo-700 uppercase font-mono bg-white px-1.5 py-0.5 rounded border border-indigo-100">{activeOp}</strong> calibrated precisely for timestamp target line{" "}
          <strong className="font-mono text-slate-900 bg-white px-1 py-0.5 rounded border">{formData.event_time}</strong>.
        </p>
        <div className="bg-white p-3 rounded-xl border border-indigo-100/60 text-[11px] text-slate-500 font-mono space-y-1">
          <div className="flex justify-between">
            <span>Historical Timeline Array Structure:</span>
            <span className="text-slate-800 font-bold">N + 1 Log Injected</span>
          </div>
          <div className="flex justify-between border-t border-slate-50 pt-1 mt-1">
            <span>Core Mathematical Model Impact:</span>
            <span className="text-indigo-600 font-semibold">Automatic System Re-evaluation</span>
          </div>
        </div>
      </div>
    </section>
  );
}

OperationPreviewCard.propTypes = {
  activeOp: PropTypes.string.isRequired,
  formData: PropTypes.object.isRequired,
  originalRecord: PropTypes.object,
};