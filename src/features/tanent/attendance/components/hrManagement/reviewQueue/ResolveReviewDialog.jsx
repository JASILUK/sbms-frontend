import React, { useState } from "react";
import PropTypes from "prop-types";

export const ResolveReviewDialog = React.memo(({ isOpen, onCancel, onConfirm, isSubmitting }) => {
  const [justification, setJustification] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (justification.trim().length < 5) {
      alert("Validation Error: Please describe your corrective findings action (min 5 characters).");
      return;
    }
    onConfirm(justification);
    setJustification("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs" role="dialog" aria-modal="true" aria-labelledby="resolve-dialog-title">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 flex flex-col gap-4">
        <h3 id="resolve-dialog-title" className="text-base font-bold text-slate-900">Resolve Exception Alert Flag</h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          This attendance anomaly has already been corrected and verified. By confirming, you clear the structural warning alert from the active monitoring ledger.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="resolve-justification" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Resolution Narrative Summary
            </label>
            <textarea
              id="resolve-justification"
              rows={3}
              required
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              placeholder="Provide a mandatory entry description explaining the rationale or verification checks executed to clear this alert..."
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs bg-slate-50 text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white leading-relaxed"
            />
          </div>

          <div className="flex justify-end gap-2 text-xs font-semibold pt-2 border-t border-slate-100">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => { setJustification(""); onCancel(); }}
              className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              {isSubmitting && <span className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              Clear Warning Flag
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

ResolveReviewDialog.displayName = "ResolveReviewDialog";
ResolveReviewDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
};