import React, { useState } from "react";
import PropTypes from "prop-types";
import  ModalBase  from "../shared/ModalBase" // Assuming absolute shared path resolution configuration
import {
  useFinalizeRecordMutation,
  useUnlockRecordMutation,
  useReprocessTimelineMutation
} from "../../../api/hrAttendance/attendanceActionsApi";

export default function HRActionPanel({ recordId, allowedActions, onMutationSuccess }) {
  const [activeModal, setActiveModal] = useState(null); // finalize | unlock | reprocess
  const [reasonInput, setReasonInput] = useState("");
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  const [finalizeFn] = useFinalizeRecordMutation();
  const [unlockFn] = useUnlockRecordMutation();
  const [reprocessFn] = useReprocessTimelineMutation();

  const handleActionExecution = async () => {
    if (activeModal !== "reprocess" && reasonInput.trim().length < 5) {
      alert("Validation failure: Please specify a detailed administrative action justification note.");
      return;
    }
    
    setIsSubmitLoading(true);
    try {
      if (activeModal === "finalize") {
        await finalizeFn({ recordId, reason: reasonInput }).unwrap();
      } else if (activeModal === "unlock") {
        await unlockFn({ recordId, reason: reasonInput }).unwrap();
      } else if (activeModal === "reprocess") {
        await reprocessFn({ recordId }).unwrap();
      }
      
      setActiveModal(null);
      setReasonInput("");
      if (onMutationSuccess) onMutationSuccess();
    } catch (err) {
      alert(`Transaction execution failure: ${err?.data?.message || "Internal mutation rejection error."}`);
    } finally {
      setIsSubmitLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-xs p-5 space-y-4">
      <h2 className="text-sm font-bold text-slate-900 tracking-tight">Administrative Operation Console</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-semibold">
        <button
          type="button"
          disabled={!allowedActions?.can_finalize}
          onClick={() => setActiveModal("finalize")}
          className="w-full bg-indigo-600 text-white hover:bg-indigo-700 px-3 py-2 rounded-xl shadow-xs disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Finalize & Freeze
        </button>

        <button
          type="button"
          disabled={!allowedActions?.can_unlock}
          onClick={() => setActiveModal("unlock")}
          className="w-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-3 py-2 rounded-xl shadow-xs disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Unlock Roster
        </button>

        <button
          type="button"
          disabled={!allowedActions?.can_reprocess}
          onClick={() => setActiveModal("reprocess")}
          className="w-full bg-slate-100 text-slate-700 hover:bg-slate-200 px-3 py-2 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Force Metric Recalculation
        </button>
      </div>

      {/* Reusable Action Confirmation Dialog Frame */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 flex flex-col gap-4 animate-scale-up">
            <h3 className="text-base font-bold text-slate-900 capitalize">Confirm Operational Task: {activeModal}</h3>
            <p className="text-xs text-slate-500">Are you sure you want to execute this change on record reference #{recordId}?</p>
            
            {activeModal !== "reprocess" && (
              <textarea
                rows={3}
                value={reasonInput}
                onChange={(e) => setReasonInput(e.target.value)}
                placeholder="Specify administrative compliance execution context reason details..."
                className="w-full rounded-xl border border-slate-200 text-xs p-3 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
              />
            )}

            <div className="flex justify-end gap-2 text-xs font-semibold pt-2 border-t">
              <button 
                type="button" 
                disabled={isSubmitLoading}
                onClick={() => { setActiveModal(null); setReasonInput(""); }} 
                className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200"
              >
                Cancel
              </button>
              <button 
                type="button"
                disabled={isSubmitLoading}
                onClick={handleActionExecution}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 flex items-center gap-1"
              >
                {isSubmitLoading && <span className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                Confirm Task Execution
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

HRActionPanel.propTypes = {
  recordId: PropTypes.number.isRequired,
  allowedActions: PropTypes.object,
  onMutationSuccess: PropTypes.func.isRequired,
};