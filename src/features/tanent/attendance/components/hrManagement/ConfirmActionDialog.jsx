import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Loader2 } from "lucide-react";

const ACTION_COPY = {
  finalize: {
    title: "Finalize this record?",
    description: "This locks the attendance record from further edits and marks the day as finalized.",
  },
  unlock: {
    title: "Unlock this record?",
    description: "This re-opens a finalized record so corrections can be made.",
  },
  reprocess: {
    title: "Reprocess this record?",
    description: "This re-runs the attendance engine against the raw punch events for this day.",
  },
};

export default function ConfirmActionDialog({ pendingAction, onCancel, onConfirm, isLoading }) {
  const open = Boolean(pendingAction);
  const copy = pendingAction ? ACTION_COPY[pendingAction.action] : null;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.18 }}
            role="alertdialog"
            aria-modal="true"
            className="relative w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl dark:bg-neutral-900"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-50 dark:bg-amber-500/10">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
            </div>
            <h3 className="mt-3 text-base font-semibold text-neutral-900 dark:text-neutral-100">{copy?.title}</h3>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{copy?.description}</p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={onCancel}
                disabled={isLoading}
                className="rounded-lg px-3.5 py-2 text-sm font-medium text-neutral-600 transition hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={isLoading}
                className="inline-flex items-center gap-1.5 rounded-lg bg-neutral-900 px-3.5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-neutral-800 disabled:opacity-60 dark:bg-white dark:text-neutral-900"
              >
                {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                Confirm
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
