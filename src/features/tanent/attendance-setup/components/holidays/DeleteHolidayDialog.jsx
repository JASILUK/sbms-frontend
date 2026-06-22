import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useDeleteHolidayMutation } from "../../api/attendanceSetupApi";
import { toast } from "sonner";

export const DeleteHolidayDialog = ({ isOpen, onClose, targetId }) => {
  const [deleteHoliday, { isLoading }] = useDeleteHolidayMutation();

  const handleConfirmDelete = async () => {
    if (!targetId) return;
    try {
      await deleteHoliday(targetId).unwrap();
      toast.success("Holiday record permanently evicted from organization scopes.");
      onClose();
    } catch {
      toast.error("An anomaly occurred while updating the global holiday register.");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={onClose} />
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} className="relative z-10 w-full max-w-md bg-white rounded-xl shadow-2xl p-6 border border-slate-200">
            <div className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600 border border-red-100">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Delete Holiday Criteria Block?</h3>
                <p className="mt-2 text-sm text-slate-500">
                  This calendar element will be immediately removed from global payroll timelines and system validation routines. This cannot be undone.
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2.5 border-t border-slate-100 pt-4">
              <button type="button" disabled={isLoading} onClick={onClose} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer">
                Cancel
              </button>
              <button type="button" disabled={isLoading} onClick={handleConfirmDelete} className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500 cursor-pointer disabled:opacity-50">
                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                Remove Element
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};