import React from "react";
import { useDeleteShiftMutation } from "../../api/attendanceSetupApi";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const DeactivateShiftDialog = ({ isOpen, onClose, targetId }) => {
  const [deactivateShift, { isLoading }] = useDeleteShiftMutation();

  const handleCommitAction = async () => {
    try {
      await deactivateShift(targetId).unwrap();
      toast.success("Shift pattern deactivated successfully.");
      onClose();
    } catch {
      toast.error("Failed to archive target timeline parameter rule.");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs" onClick={onClose} />
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }} className="relative z-10 w-full max-w-sm bg-white rounded-xl p-5 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex gap-3 items-start">
              <div className="p-2 bg-red-50 text-red-600 rounded-lg border border-red-100 shrink-0"><ShieldAlert className="h-4 w-4" /></div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Deactivate Target Work Pattern?</h4>
                <p className="text-xs text-slate-500 mt-1">Deactivated shifts are excluded from future template selector lists. Historical assignments remain locked and un-mutated.</p>
              </div>
            </div>
            <div className="flex justify-end gap-2 text-xs font-semibold pt-1">
              <button onClick={onClose} disabled={isLoading} className="px-3 py-1.5 border border-slate-200 bg-white rounded-md text-slate-700 hover:bg-slate-50 cursor-pointer">Abort</button>
              <button onClick={handleCommitAction} disabled={isLoading} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-red-600 text-white hover:bg-red-500 shadow-xs cursor-pointer disabled:opacity-40">
                {isLoading && <Loader2 className="h-3 w-3 animate-spin" />} Deactivate Template
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};