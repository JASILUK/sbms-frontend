import React, { useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import { createPortal } from "react-dom";

import { useOverrideStatusMutation } from "../../../api/hrAttendance/statusOverrideApi";
import CurrentAttendanceCard from "./CurrentAttendanceCard";
import OverrideStatusForm from "./OverrideStatusForm";
import ReviewPanel from "./ReviewPanel";
import OverrideHistory from "./OverrideHistory";
import ConfirmationDialog from "./ConfirmationDialog";
import StatusOverrideSkeleton from "./StatusOverrideSkeleton";

export default function StatusOverrideDrawer({ isOpen, onClose, recordId, recordContextGraph, isDataLoading }) {
  const [selectedStatus, setSelectedStatus] = useState("");
  const [reason, setReason] = useState("");
  const [errors, setErrors] = useState({});
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isMutating, setIsMutating] = useState(false);

  const [overrideStatusFn] = useOverrideStatusMutation();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setSelectedStatus(recordContextGraph?.header?.attendance_status || "");
      setReason("");
      setErrors({});
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen, recordContextGraph]);

  const validateForm = () => {
    const nextErrors = {};
    if (!selectedStatus) nextErrors.status = "Targeted override status selection value is mandatory.";
    if (!reason || reason.trim().length < 5) {
      nextErrors.reason = "A detailed administrative compliance context justification log message is mandatory (min 5 characters).";
    }
    
    // Prevent duplicate status rewrite submission requests
    if (selectedStatus === recordContextGraph?.header?.attendance_status) {
      nextErrors.status = "The selected targeted override status cannot match the active current sheet status state.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleTriggerConfirmOpen = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsConfirmOpen(true);
    }
  };

  const handleExecuteStatusOverrideMutation = async () => {
    setIsConfirmOpen(false);
    setIsMutating(true);
    try {
      await overrideStatusFn({
        recordId,
        status: selectedStatus,
        reason: reason,
      }).unwrap();

      alert("Success: Administrative status override transaction written securely to ledger.");
      onClose();
    } catch (err) {
      alert(`Override mutation rejection exception: ${err?.data?.message || "Internal database constraint breakdown."}`);
    } finally {
      setIsMutating(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true" aria-label="Administrative status override and exceptions console sheet">
      <div className="absolute inset-0 overflow-hidden">
        {/* Backdrop Mask Drop Layer */}
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300" onClick={() => !isMutating && onClose()} />

        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
          <div className="pointer-events-auto w-screen max-w-2xl transform bg-white shadow-2xl transition-all duration-300 border-l border-slate-200 h-full flex flex-col">
            
            {/* Header Structural Deck Area */}
            <header className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/60 shrink-0">
              <div>
                <h2 className="text-base font-bold text-slate-900 tracking-tight">Status Override & Exception Console</h2>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Record Key Scope Context: #{recordId}
                </p>
              </div>
              <button
                type="button"
                disabled={isMutating}
                onClick={onClose}
                className="p-1.5 rounded-xl border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-white focus:outline-none transition-colors cursor-pointer"
                aria-label="Close override configurations control console panel overlay panel"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </header>

            {/* Scrollable Form Workspace Main Body Viewport */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5 min-w-0">
              {isDataLoading ? (
                <StatusOverrideSkeleton />
              ) : (
                <form id="status-override-workspace-form" onSubmit={handleTriggerConfirmOpen} className="space-y-5">
                  <CurrentAttendanceCard header={recordContextGraph?.header} summary={recordContextGraph?.summary} flags={data?.flags || recordContextGraph?.record} />
                  
                  <ReviewPanel recordId={recordId} flags={recordContextGraph?.flags || recordContextGraph?.record} onActionSuccess={onClose} />
                  
                  <div className="border-t border-slate-200/80 pt-4">
                    <OverrideStatusForm 
                      selectedStatus={selectedStatus} 
                      onStatusChange={setSelectedStatus} 
                      reason={reason} 
                      onReasonChange={setReason} 
                      errors={errors} 
                    />
                  </div>

                  <OverrideHistory auditHistory={recordContextGraph?.audit_history} />
                </form>
              )}
            </div>

            {/* Bottom Form Action Buttons Controls Tray Anchor */}
            <footer className="px-5 py-3 border-t border-slate-200 bg-slate-50/50 flex items-center justify-end gap-2 text-xs font-semibold shrink-0">
              <button
                type="button"
                disabled={isMutating}
                onClick={onClose}
                className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="status-override-workspace-form"
                disabled={isDataLoading || isMutating}
                className="px-5 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-xs flex items-center gap-1 cursor-pointer"
              >
                Commit Override Adjustment
              </button>
            </footer>

          </div>
        </div>
      </div>

      {/* Confirmation Alert Dialog Overlay Modal Layer */}
      <ConfirmationDialog
        isOpen={isConfirmOpen}
        isSubmitting={isMutating}
        onCancel={() => setIsConfirmOpen(false)}
        onConfirm={handleExecuteStatusOverrideMutation}
        targetStatus={selectedStatus}
      />
    </div>,
    document.body
  );
}

StatusOverrideDrawer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  recordId: PropTypes.number.isRequired,
  recordContextGraph: PropTypes.object,
  isDataLoading: PropTypes.bool.isRequired,
};