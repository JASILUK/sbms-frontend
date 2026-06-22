import React from "react";
import { FormProvider } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";

// FIXED: Corrected path and file target from "../hooks/useShiftForm" to "../hooks/useAssignmentForm"
import { useAssignmentForm } from "../../hooks/useAssignmentForm"; 

import { useGetShiftsQuery } from "../../api/attendanceSetupApi";
import { X, Loader2, Edit3 } from "lucide-react";

export const EditAssignmentModal = ({ isOpen, onClose, activeRecord }) => {
  const { methods, onSubmit, isSaving } = useAssignmentForm(activeRecord, onClose);
  const { register, formState: { errors, isDirty } } = methods;

  const { data: shiftsBody } = useGetShiftsQuery();
  const shifts = shiftsBody?.data?.results || shiftsBody?.data || [];

  const handleCancelClick = () => {
    if (isDirty && !window.confirm("You have unsaved changes. Abort adjustments?")) return;
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={handleCancelClick} />
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} className="relative z-10 w-full max-w-lg bg-white rounded-xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden">
            
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/60">
              <div className="flex items-center gap-2">
                <Edit3 className="h-4 w-4 text-indigo-500" />
                <h3 className="text-base font-bold text-slate-900">Modify Assignment Rules</h3>
              </div>
              <button type="button" onClick={handleCancelClick} className="text-slate-400 hover:text-slate-600 cursor-pointer"><X className="h-4 w-4" /></button>
            </div>

            <FormProvider {...methods}>
              <form onSubmit={onSubmit} className="p-6 space-y-4">
                
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-xs text-slate-500">
                  Employee Dimension Vector: <span className="font-bold text-slate-800">{activeRecord?.employee?.first_name || "Enterprise Associate"}</span> (Identity parameters locked during active configuration runs).
                </div>

                <div>
                  <label htmlFor="edit-shift" className="block text-xs font-bold uppercase tracking-wide text-slate-600">Reassign Shift Pattern Blueprint</label>
                  <select id="edit-shift" {...register("shift_id")} className="mt-1.5 block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm bg-white text-slate-800 focus:border-indigo-500 focus:outline-hidden">
                    {shifts.map((s) => (
                      <option key={s.public_id || s.id} value={s.public_id || s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="edit-from" className="block text-xs font-bold uppercase tracking-wide text-slate-600">Effective From</label>
                    <input id="edit-from" type="date" {...register("effective_from")} className="mt-1.5 block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-hidden" />
                  </div>
                  <div>
                    <label htmlFor="edit-to" className="block text-xs font-bold uppercase tracking-wide text-slate-600">Effective To</label>
                    <input id="edit-to" type="date" {...register("effective_to")} className="mt-1.5 block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-hidden" />
                  </div>
                </div>

                <div>
                  <label htmlFor="edit-notes" className="block text-xs font-bold uppercase tracking-wide text-slate-600">Audit Logs</label>
                  <textarea id="edit-notes" rows={2} {...register("notes")} className="mt-1.5 block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-hidden resize-none" />
                </div>

                <div className="pt-4 flex justify-end gap-2.5 border-t border-slate-100">
                  <button type="button" onClick={handleCancelClick} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer">Cancel</button>
                  <button type="submit" disabled={isSaving} className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 cursor-pointer">
                    {isSaving && <Loader2 className="h-4 w-4 animate-spin" />} Update Criteria
                  </button>
                </div>

              </form>
            </FormProvider>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};