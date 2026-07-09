import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  useFinalizeRecordMutation,
  useUnlockRecordMutation,
  useReprocessTimelineMutation,
  useRecalculateAttendanceMutation
} from "../../../api/hrAttendance/attendanceRecordApi";

export default function AdministrativeActionsPanel({ recordId, allowedActions, onMutationSuccess }) {
  const [activeModal, setActiveModal] = useState(null); // finalize | unlock | reprocess | recalculate
  const [reasonInput, setReasonInput] = useState("");
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  const [finalizeFn] = useFinalizeRecordMutation();
  const [unlockFn] = useUnlockRecordMutation();
  const [reprocessFn] = useReprocessTimelineMutation();
  const [recalculateFn] = useRecalculateAttendanceMutation();

  const handleExecute = async () => {
    // Only Finalize and Unlock typically require justification reasons logically, but we enforce it broadly here if desired.
    if ((activeModal === "finalize" || activeModal === "unlock") && reasonInput.trim().length < 5) {
      alert("Validation Error: Please provide a clear administrative reason (min 5 characters).");
      return;
    }
    
    setIsSubmitLoading(true);
    try {
      if (activeModal === "finalize") await finalizeFn({ recordId, reason: reasonInput }).unwrap();
      if (activeModal === "unlock") await unlockFn({ recordId, reason: reasonInput }).unwrap();
      if (activeModal === "reprocess") await reprocessFn({ recordId, reason: "Reprocess triggered" }).unwrap();
      if (activeModal === "recalculate") await recalculateFn({ recordId, reason: "Recalculate triggered" }).unwrap();
      
      setActiveModal(null);
      setReasonInput("");
      if (onMutationSuccess) onMutationSuccess();
      // A toast notification would ideally go here if you have a global toast provider
    } catch (err) {
      alert(`Operation Failed: ${err?.data?.message || "An unexpected error occurred."}`);
    } finally {
      setIsSubmitLoading(false);
    }
  };

  const actionsConfig = {
    finalize: { title: "Finalize Record", desc: "This record will be locked and finalized for payroll processing. No further automated updates will occur.", needsReason: true },
    unlock: { title: "Unlock Record", desc: "This will remove the finalization lock, allowing the system or administrators to edit the record again.", needsReason: true },
    reprocess: { title: "Reprocess Timeline", desc: "All attendance events will be processed sequentially again to rebuild the timeline.", needsReason: false },
    recalculate: { title: "Recalculate Attendance", desc: "Working hours, late minutes, and overtime calculations will be regenerated based on current policies.", needsReason: false }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-5 sticky top-24">
      <h2 className="text-sm font-bold text-slate-900 tracking-tight uppercase">Administrative Actions</h2>
      
      <div className="flex flex-col gap-3">
        <button
          type="button"
          disabled={!allowedActions?.can_finalize}
          onClick={() => setActiveModal("finalize")}
          className="w-full bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 px-4 py-3 rounded-xl shadow-xs disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Finalize Record
        </button>

        <button
          type="button"
          disabled={!allowedActions?.can_unlock}
          onClick={() => setActiveModal("unlock")}
          className="w-full bg-white border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 px-4 py-3 rounded-xl shadow-xs disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Unlock Record
        </button>
        
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            disabled={!allowedActions?.can_reprocess}
            onClick={() => setActiveModal("reprocess")}
            className="w-full bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-100 px-3 py-2.5 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Reprocess
          </button>
          <button
            type="button"
            disabled={!allowedActions?.can_reprocess}
            onClick={() => setActiveModal("recalculate")}
            className="w-full bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-100 px-3 py-2.5 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Recalculate
          </button>
        </div>
      </div>

      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity" onClick={() => !isSubmitLoading && setActiveModal(null)} />
          <div className="relative bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 flex flex-col gap-4 animate-scale-up">
            <h3 className="text-lg font-bold text-slate-900">{actionsConfig[activeModal].title}</h3>
            <p className="text-sm text-slate-600 leading-relaxed">{actionsConfig[activeModal].desc}</p>
            
            {actionsConfig[activeModal].needsReason && (
              <textarea
                rows={3}
                value={reasonInput}
                onChange={(e) => setReasonInput(e.target.value)}
                placeholder="Required: Provide a reason for this administrative action..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 text-sm p-3 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
              />
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button 
                type="button" 
                disabled={isSubmitLoading}
                onClick={() => { setActiveModal(null); setReasonInput(""); }} 
                className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-medium text-sm rounded-xl hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="button"
                disabled={isSubmitLoading}
                onClick={handleExecute}
                className="px-4 py-2 bg-indigo-600 text-white font-medium text-sm rounded-xl hover:bg-indigo-700 flex items-center gap-2 transition-colors shadow-xs"
              >
                {isSubmitLoading && <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                Confirm Execution
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

AdministrativeActionsPanel.propTypes = {
  recordId: PropTypes.number.isRequired,
  allowedActions: PropTypes.object,
  onMutationSuccess: PropTypes.func.isRequired,
};