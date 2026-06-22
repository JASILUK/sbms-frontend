import React from "react";
import { useSetDefaultShiftMutation } from "../../api/attendanceSetupApi";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const SetDefaultDialog = ({ isOpen, onClose, targetId }) => {
  const [assignDefault, { isLoading }] = useSetDefaultShiftMutation();

  const handleCommitAction = async () => {
    // FIXED: Early defensive guard clause preventing mutation executions on missing IDs
    if (!targetId) {
      toast.error("Unable to execute operation: Missing unique shift identifier.");
      return;
    }

    try {
      await assignDefault(targetId).unwrap();
      toast.success("Workspace baseline scheduling metric updated.");
      onClose();
    } catch {
      toast.error("Transactional parameter configuration change rejected.");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs" 
            onClick={onClose} 
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.97 }} 
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0, scale: 0.97 }} 
            className="relative z-10 w-full max-w-sm bg-white rounded-xl p-5 border border-slate-200 shadow-2xl space-y-4"
          >
            <div className="flex gap-3 items-start">
              <div className="p-2 bg-amber-50 text-amber-600 rounded-lg border border-amber-100 shrink-0">
                <AlertTriangle className="h-4 w-4" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Assign Corporate Scheduling Default?</h4>
                <p className="text-xs text-slate-500 mt-1">
                  This shift pattern will automatically scale as the baseline fallback across all employee groups lacking explicit alternative row rules.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2 text-xs font-semibold pt-1">
              <button 
                type="button"
                onClick={onClose} 
                disabled={isLoading} 
                className="px-3 py-1.5 border border-slate-200 bg-white rounded-md text-slate-700 hover:bg-slate-50 cursor-pointer disabled:opacity-50"
              >
                Abort
              </button>
              <button 
                type="button"
                onClick={handleCommitAction} 
                disabled={isLoading} 
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-amber-600 text-white hover:bg-amber-500 shadow-xs cursor-pointer disabled:opacity-40"
              >
                {isLoading && <Loader2 className="h-3 w-3 animate-spin" />} Commit Default
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};