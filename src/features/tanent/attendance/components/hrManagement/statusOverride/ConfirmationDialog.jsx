import React from "react";
import PropTypes from "prop-types";

export default function ConfirmationDialog({ isOpen, onCancel, onConfirm, isSubmitting, targetStatus }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs" role="dialog" aria-modal="true" aria-labelledby="confirm-modal-heading">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 flex flex-col gap-4 animate-scale-up">
        <div className="flex items-center gap-3 text-indigo-600">
          <svg className="h-6 w-6 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <h3 id="confirm-modal-heading" className="text-base font-bold text-slate-900">Confirm Status Rewrite?</h3>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed">
          You are forcing an explicit state override to <strong className="text-indigo-700 font-mono">[{targetStatus}]</strong> on this timesheet row. This completely bypasses the core background computational calculation values for this day. An unalterable administrative audit historical trace log node will be captured permanently.
        </p>

        <div className="flex justify-end gap-2 text-xs font-semibold pt-3 border-t border-slate-100">
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
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 focus:outline-none flex items-center gap-1.5 transition-colors shadow-xs"
          >
            {isSubmitting && <span className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            Commit Rewrite Override
          </button>
        </div>
      </div>
    </div>
  );
}

ConfirmationDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  targetStatus: PropTypes.string.isRequired,
};