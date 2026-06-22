import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertOctagon, Loader2 } from "lucide-react";

export const ResetPolicyDialog = ({ isOpen, onClose, onConfirm, isResetting }) => {
  React.useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
          {/* Backdrop Layer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal Container Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative z-10 w-full max-w-lg transform overflow-hidden rounded-xl bg-white p-6 shadow-2xl transition-all border border-slate-200 text-left align-middle"
          >
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="mx-auto flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600 border border-red-100 sm:mx-0">
                <AlertOctagon className="h-5 w-5" />
              </div>
              <div className="text-center sm:text-left">
                <h3 className="text-base font-bold text-slate-900">Reset Attendance Policy Matrix?</h3>
                <p className="mt-2 text-sm text-slate-500">
                  This action will clear all custom calculations and revert values back to default core system baselines. This modification is permanent.
                </p>
              </div>
            </div>
            
            <div className="mt-6 flex flex-col-reverse sm:flex-row justify-end gap-2.5 border-t border-slate-100 pt-4">
              <button
                type="button"
                disabled={isResetting}
                onClick={onClose}
                className="w-full sm:w-auto rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isResetting}
                onClick={onConfirm}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 disabled:opacity-50 transition-colors cursor-pointer"
              >
                {isResetting && <Loader2 className="h-4 w-4 animate-spin" />}
                Reset Configuration Rules
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};