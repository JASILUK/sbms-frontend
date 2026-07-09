import React from "react";
import PropTypes from "prop-types";

export default function OperationConfirmationDialog({ isOpen, onCancel, onConfirm, isSubmitting }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs" role="dialog" aria-modal="true" aria-labelledby="confirm-dialog-title">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 flex flex-col gap-4 animate-scale-up">
        <div className="flex items-center gap-3 text-amber-600">
          <svg className="h-6 w-6 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 id="confirm-dialog-title" className="text-base font-bold text-slate-900">Commit Transaction Logs?</h3>
        </div>
        
        <p className="text-xs text-slate-500 leading-relaxed">
          This operation injects a new raw log event into the ledger stream. The backend computational engine will instantly re-process all daily records and recalibrate the final duration metrics. An unalterable administrative audit historical trace node will be appended.
        </p>

        <div className="flex justify-end gap-2 text-xs font-semibold pt-2 border-t border-slate-100">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onCancel}
            className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 focus:outline-none transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onConfirm}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 focus:outline-none flex items-center gap-1.5 transition-colors shadow-sm"
          >
            {isSubmitting && <span className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            Write Log Event
          </button>
        </div>
      </div>
    </div>
  );
}

OperationConfirmationDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
};