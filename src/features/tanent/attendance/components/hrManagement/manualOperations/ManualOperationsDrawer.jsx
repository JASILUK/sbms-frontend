import React, { useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import { createPortal } from "react-dom";

// Ingestion API hooks bindings definitions
import {
  useManualCheckInMutation,
  useManualCheckOutMutation,
  useManualBreakStartMutation,
  useManualBreakEndMutation,
  useAdvancedManualPunchMutation,
} from "../../../api/hrAttendance/manualOperationsApi";

import CurrentAttendanceCard from "./CurrentAttendanceCard";
import ManualOperationSelector from "./ManualOperationSelector";
import ManualEventForm from "./ManualEventForm";
import OperationPreviewCard from "./OperationPreviewCard";
import OperationConfirmationDialog from "./OperationConfirmationDialog";
import OperationHistory from "./OperationHistory";
import OperationSkeleton from "./OperationSkeleton";

export default function ManualOperationsDrawer({ isOpen, onClose, recordId, recordContextGraph, isDataLoading }) {
  const [activeOp, setActiveOp] = useState("check-in");
  const [formData, setFormData] = useState({
    event_time: "",
    event_type: "",
    attendance_method: "MANUAL",
    location_name: "",
    reason: "",
  });
  const [errors, setErrors] = useState({});
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isMutating, setIsMutating] = useState(false);

  // Bind individual mutation functions triggers
  const [checkInMutate] = useManualCheckInMutation();
  const [checkOutMutate] = useManualCheckOutMutation();
  const [breakStartMutate] = useManualBreakStartMutation();
  const [breakEndMutate] = useManualBreakEndMutation();
  const [advancedPunchMutate] = useAdvancedManualPunchMutation();

  // Reset core states on structural drawer toggles
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setFormData({
        event_time: new Date().toTimeString().split(" ")[0].substring(0, 5),
        event_type: "",
        attendance_method: "MANUAL",
        location_name: "",
        reason: "",
      });
      setErrors({});
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  const handleFieldChange = useCallback((field, val) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  }, []);

  const validateWorkspaceForm = () => {
    const nextErrors = {};
    if (!formData.event_time) nextErrors.event_time = "Event time specification marker is required.";
    if (!formData.reason || formData.reason.trim().length < 5) {
      nextErrors.reason = "A descriptive verification rationale narrative string is mandatory (min 5 chars).";
    }
    if (activeOp === "advanced" && !formData.event_type) {
      nextErrors.event_type = "Advanced mode structural ingestion event type flag token is mandatory.";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleTriggerPreviewSubmit = (e) => {
    e.preventDefault();
    if (validateWorkspaceForm()) {
      setIsConfirmOpen(true);
    }
  };

  const handleExecuteCommitMutation = async () => {
    setIsConfirmOpen(false);
    setIsMutating(true);
    
    // Extrapolate date context out of the target header record profile row variables
    const targetDateStr = recordContextGraph?.header?.attendance_date || new Date().toISOString().split("T")[0];
    const computedFullTimestampIso = `${targetDateStr}T${formData.event_time}:00Z`;

    try {
      if (activeOp === "check-in") {
        await checkInMutate({
          recordId,
          event_time: computedFullTimestampIso,
          attendance_method: formData.attendance_method,
          location_name: formData.location_name || undefined,
          reason: formData.reason,
        }).unwrap();
      } else if (activeOp === "check-out") {
        await checkOutMutate({
          recordId,
          event_time: computedFullTimestampIso,
          attendance_method: formData.attendance_method,
          location_name: formData.location_name || undefined,
          reason: formData.reason,
        }).unwrap();
      } else if (activeOp === "break-start") {
        await breakStartMutate({
          recordId,
          event_time: computedFullTimestampIso,
          reason: formData.reason,
        }).unwrap();
      } else if (activeOp === "break-end") {
        await breakEndMutate({
          recordId,
          event_time: computedFullTimestampIso,
          reason: formData.reason,
        }).unwrap();
      } else if (activeOp === "advanced") {
        await advancedPunchMutate({
          record_id: recordId,
          membership_id: recordContextGraph?.header?.membership_id,
          event_time: computedFullTimestampIso,
          event_type: formData.event_type.toUpperCase(),
          attendance_method: formData.attendance_method,
          location_name: formData.location_name || undefined,
          notes: formData.reason,
        }).unwrap();
      }

      alert("Transactional log entry inserted successfully. Calculations updated.");
      onClose();
    } catch (err) {
      alert(`Ledger commit exception: ${err?.data?.message || "Internal transaction verification breakdown."}`);
    } finally {
      setIsMutating(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true" aria-label="Manual operational adjustment workspace sheet">
      <div className="absolute inset-0 overflow-hidden">
        {/* Underlay Backdrop Mask Layer */}
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300" onClick={() => !isMutating && onClose()} />

        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
          <div className="pointer-events-auto w-screen max-w-2xl transform bg-white shadow-2xl transition-all duration-300 border-l border-slate-200 flex flex-col h-full">
            
            {/* Header Layout Component Area */}
            <header className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/60 shrink-0">
              <div>
                <h2 className="text-base font-bold text-slate-900 tracking-tight">Manual Log Operations</h2>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Record Context Target Reference: #{recordId}
                </p>
              </div>
              <button
                type="button"
                disabled={isMutating}
                onClick={onClose}
                className="p-1.5 rounded-xl border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-white focus:outline-none transition-colors"
                aria-label="Close manual operations workspace overlay drawer panel"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </header>

            {/* Scrollable Form Body Container Block Element */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5 min-w-0">
              {isDataLoading ? (
                <OperationSkeleton />
              ) : (
                <form id="manual-workspace-form" onSubmit={handleTriggerPreviewSubmit} className="space-y-5">
                  <CurrentAttendanceCard summary={recordContextGraph?.summary} record={recordContextGraph?.record} />
                  
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Choose Task Protocol</span>
                    <ManualOperationSelector activeOp={activeOp} onOpChange={(op) => { setActiveOp(op); setErrors({}); }} />
                  </div>

                  <ManualEventForm activeOp={activeOp} formData={formData} onChange={handleFieldChange} errors={errors} />
                  
                  <OperationPreviewCard activeOp={activeOp} formData={formData} originalRecord={recordContextGraph?.summary} />
                  
                  <OperationHistory historicTimeline={recordContextGraph?.timeline} />
                </form>
              )}
            </div>

            {/* Sticky Lower Action Control Button Bar */}
            <footer className="px-5 py-3 border-t border-slate-200 bg-slate-50/50 flex items-center justify-end gap-2 text-xs font-semibold shrink-0">
              <button
                type="button"
                disabled={isMutating}
                onClick={onClose}
                className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="manual-workspace-form"
                disabled={isDataLoading || isMutating}
                className="px-5 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-xs flex items-center gap-1"
              >
                Preview & Inject Event
              </button>
            </footer>

          </div>
        </div>
      </div>

      {/* Embedded Floating Task Execution Confirmation Modal */}
      <OperationConfirmationDialog
        isOpen={isConfirmOpen}
        isSubmitting={isMutating}
        onCancel={() => setIsConfirmOpen(false)}
        onConfirm={handleExecuteCommitMutation}
      />
    </div>,
    document.body
  );
}

ManualOperationsDrawer.propTypes = {
  isOpen: PropTypes.bool.isOpen,
  onClose: PropTypes.func.isRequired,
  recordId: PropTypes.number.isRequired,
  recordContextGraph: PropTypes.object,
  isDataLoading: PropTypes.bool.isRequired,
};