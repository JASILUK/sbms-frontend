import React, { useState } from "react";
import PropTypes from "prop-types";
import { 
  ShieldCheck, 
  Lock, 
  Unlock, 
  RefreshCcw, 
  Calculator,
  X,
  FileText
} from "lucide-react";
import {
  useFinalizeRecordMutation,
  useUnlockRecordMutation,
  useReprocessTimelineMutation,
  useRecalculateAttendanceMutation
} from "../../../api/hrAttendance/attendanceRecordApi";

export default function AdministrativeActionsPanel({ recordId, allowedActions, onMutationSuccess }) {
  const [activeModal, setActiveModal] = useState(null); 
  const [reasonInput, setReasonInput] = useState("");
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  const [finalizeFn] = useFinalizeRecordMutation();
  const [unlockFn] = useUnlockRecordMutation();
  const [reprocessFn] = useReprocessTimelineMutation();
  const [recalculateFn] = useRecalculateAttendanceMutation();

  const handleExecute = async () => {
    if ((activeModal === "finalize" || activeModal === "unlock") && reasonInput.trim().length < 5) {
      alert("Validation Error: Please provide a clear administrative justification (min 5 characters).");
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
    } catch (err) {
      alert(`Operation Failed: ${err?.data?.message || "An unexpected error occurred."}`);
    } finally {
      setIsSubmitLoading(false);
    }
  };

  const actionsConfig = {
    finalize: { 
      title: "Lock & Finalize Ledger Node", 
      desc: "This shifts the record status into a read-only verified state. Automated synchronization loops will skip this record during future engine cycles.", 
      needsReason: true,
      confirmTheme: "bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500/20"
    },
    unlock: { 
      title: "Release Operational Lock", 
      desc: "Releases structural constraints on the ledger node. The record will re-open for operational edits, back-calculations, and payroll recalculations.", 
      needsReason: true,
      confirmTheme: "bg-rose-600 hover:bg-rose-700 focus:ring-rose-500/20"
    },
    reprocess: { 
      title: "Sequential Stream Reprocessing", 
      desc: "Forces the core system to evaluate every punch event captured within this tracking window to clean up overlapping state parameters.", 
      needsReason: false,
      confirmTheme: "bg-slate-950 hover:bg-slate-800 focus:ring-slate-900/20"
    },
    recalculate: { 
      title: "Policy Engine Recalculation", 
      desc: "Re-evaluates working durations, break margins, overtime allowances, and variance boundaries matching the target date's policy rules.", 
      needsReason: false,
      confirmTheme: "bg-slate-950 hover:bg-slate-800 focus:ring-slate-900/20"
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-xs p-5 space-y-4">
      <div className="flex items-center gap-2 text-slate-400 pb-1 border-b border-slate-100">
        <ShieldCheck className="w-4 h-4 text-slate-500" />
        <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Administrative System Operations</h2>
      </div>
      
      <div className="flex flex-col gap-2.5">
        <button
          type="button"
          disabled={!allowedActions?.can_finalize}
          onClick={() => setActiveModal("finalize")}
          className="w-full inline-flex items-center justify-center gap-2 bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-100 px-4 py-2.5 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-2xs"
        >
          <Lock className="w-3.5 h-3.5 text-slate-400" />
          Lock & Finalize Record
        </button>

        <button
          type="button"
          disabled={!allowedActions?.can_unlock}
          onClick={() => setActiveModal("unlock")}
          className="w-full inline-flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 px-4 py-2.5 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-2xs"
        >
          <Unlock className="w-3.5 h-3.5 text-slate-400" />
          Release Administrative Lock
        </button>
        
        <div className="grid grid-cols-2 gap-2.5 pt-1.5">
          <button
            type="button"
            disabled={!allowedActions?.can_reprocess}
            onClick={() => setActiveModal("reprocess")}
            className="inline-flex items-center justify-center gap-1.5 bg-white border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50 px-3 py-2.5 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <RefreshCcw className="w-3 h-3 text-slate-400" />
            Reprocess Logs
          </button>
          <button
            type="button"
            disabled={!allowedActions?.can_reprocess}
            onClick={() => setActiveModal("recalculate")}
            className="inline-flex items-center justify-center gap-1.5 bg-white border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50 px-3 py-2.5 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <Calculator className="w-3 h-3 text-slate-400" />
            Recalculate Metrics
          </button>
        </div>
      </div>

      {/* Modernized Fullscreen Dialog Envelope Mask */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-950/30 backdrop-blur-xs transition-opacity duration-300" 
            onClick={() => !isSubmitLoading && setActiveModal(null)} 
          />
          
          <div className="relative bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 flex flex-col gap-4 transform transition-all duration-300 scale-100">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                {actionsConfig[activeModal].title}
              </h3>
              <button
                type="button"
                disabled={isSubmitLoading}
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
              {actionsConfig[activeModal].desc}
            </p>
            
            {actionsConfig[activeModal].needsReason && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  Audit Justification Message
                </label>
                <textarea
                  rows={3}
                  value={reasonInput}
                  onChange={(e) => setReasonInput(e.target.value)}
                  placeholder="Provide a detailed administrative reason for this database mutation..."
                  className="w-full rounded-xl border border-slate-200 bg-white text-xs p-3 font-medium placeholder-slate-400 text-slate-800 focus:outline-none focus:border-slate-950 focus:ring-1 focus:ring-slate-950/20 transition-all outline-none"
                />
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button 
                type="button" 
                disabled={isSubmitLoading}
                onClick={() => { setActiveModal(null); setReasonInput(""); }} 
                className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-semibold text-xs rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="button"
                disabled={isSubmitLoading}
                onClick={handleExecute}
                className={`px-4 py-2 text-white font-semibold text-xs rounded-xl flex items-center gap-2 transition-all shadow-xs cursor-pointer focus:ring-2 ${actionsConfig[activeModal].confirmTheme}`}
              >
                {isSubmitLoading && <span className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin" />}
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