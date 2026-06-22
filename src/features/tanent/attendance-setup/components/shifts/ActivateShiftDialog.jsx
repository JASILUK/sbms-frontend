import React from "react";
import { useActivateShiftMutation } from "../../api/attendanceSetupApi";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const ActivateShiftDialog = ({ isOpen, onClose, targetId }) => {
  const [activateShift, { isLoading }] = useActivateShiftMutation();

  const handleCommitAction = async () => {
    try {
      await activateShift(targetId).unwrap();
      toast.success("Shift architecture pattern successfully restored.");
      onClose();
    } catch {
      toast.error("Activation pipeline operation rejected.");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs" onClick={onClose} />
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }} className="relative z-10 w-full max-w-sm bg-white rounded-xl p-5 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex gap-3 items-start">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100 shrink-0"><CheckCircle className="h-4 w-4" /></div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Restore Shift Eligibility?</h4>
                <p className="text-xs text-slate-500 mt-1">Activating this row immediately re-enters this template into active employee assignment selector contexts.</p>
              </div>
            </div>
            <div className="flex justify-end gap-2 text-xs font-semibold pt-1">
              <button onClick={onClose} disabled={isLoading} className="px-3 py-1.5 border border-slate-200 bg-white rounded-md text-slate-700 hover:bg-slate-50 cursor-pointer">Cancel</button>
              <button onClick={handleCommitAction} disabled={isLoading} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-600 text-white hover:bg-emerald-500 shadow-xs cursor-pointer disabled:opacity-40">
                {isLoading && <Loader2 className="h-3 w-3 animate-spin" />} Confirm Activation
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};