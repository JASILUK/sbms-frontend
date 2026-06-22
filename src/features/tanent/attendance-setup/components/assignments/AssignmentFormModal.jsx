import React from "react";
import { FormProvider } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { useAssignmentForm } from "../../hooks/useAssignmentForm";
import { useGetShiftsQuery } from "../../api/attendanceSetupApi";
// FIXED: Corrected spelling to look for 'employees/employeeApi' relative paths
import { useGetEmployeesQuery } from "../../../emplyees/emplyeeApi";

import { X, Loader2, Calendar } from "lucide-react";

export const AssignmentFormModal = ({ isOpen, onClose }) => {
  const { methods, onSubmit, isSaving } = useAssignmentForm(null, onClose);
  const { register, formState: { errors } } = methods;

  const { data: shiftsBody } = useGetShiftsQuery();
  const { data: employeesBody } = useGetEmployeesQuery();

  const shifts = shiftsBody?.data?.results || shiftsBody?.data || [];
  const employees = employeesBody?.data || employeesBody || [];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={onClose} />
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} className="relative z-10 w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 flex flex-col max-h-[90vh] overflow-hidden">
            
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/60">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-indigo-500" />
                <h3 className="text-base font-bold text-slate-900">Assign Employee Work Schedule</h3>
              </div>
              <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"><X className="h-4 w-4" /></button>
            </div>

            <FormProvider {...methods}>
              <form onSubmit={onSubmit} className="p-6 space-y-4 overflow-y-auto">
                
                <div>
                  <label htmlFor="modal-emp-select" className="block text-xs font-bold uppercase tracking-wide text-slate-600">Select Target Staff Profile</label>
                  <select id="modal-emp-select" {...register("membership_id")} className="mt-1.5 block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm bg-white text-slate-800 focus:border-indigo-500 focus:outline-hidden">
                    <option value="">Choose an employee...</option>
                    {employees.map((e) => (
                      // FIXED: Used real schema model value e.username instead of absent first_name properties
                      <option key={e.id} value={e.id}>
                        {e.username} {e.job_title ? `(${e.job_title})` : `(${e.department_name || "ITT"})`}
                      </option>
                    ))}
                  </select>
                  {errors.membership_id && <p className="mt-1 text-xs text-red-600 font-semibold">{errors.membership_id.message}</p>}
                </div>

                <div>
                  <label htmlFor="modal-shift-select" className="block text-xs font-bold uppercase tracking-wide text-slate-600">Target Shift Blueprint</label>
                  <select id="modal-shift-select" {...register("shift_id")} className="mt-1.5 block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm bg-white text-slate-800 focus:border-indigo-500 focus:outline-hidden">
                    <option value="">Choose a shift pattern...</option>
                    {shifts.map((s) => (
                      <option key={s.public_id || s.id} value={s.public_id || s.id}>{s.name} ({s.start_time?.substring(0,5)} - {s.end_time?.substring(0,5)})</option>
                    ))}
                  </select>
                  {errors.shift_id && <p className="mt-1 text-xs text-red-600 font-semibold">{errors.shift_id.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="modal-date-from" className="block text-xs font-bold uppercase tracking-wide text-slate-600">Effective From</label>
                    <input id="modal-date-from" type="date" {...register("effective_from")} className="mt-1.5 block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-indigo-500 focus:outline-hidden" />
                    {errors.effective_from && <p className="mt-1 text-xs text-red-600 font-semibold">{errors.effective_from.message}</p>}
                  </div>
                  <div>
                    <label htmlFor="modal-date-to" className="block text-xs font-bold uppercase tracking-wide text-slate-600">Effective To (Optional)</label>
                    <input id="modal-date-to" type="date" {...register("effective_to")} className="mt-1.5 block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-indigo-500 focus:outline-hidden" />
                    {errors.effective_to && <p className="mt-1 text-xs text-red-600 font-semibold">{errors.effective_to.message}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="modal-notes" className="block text-xs font-bold uppercase tracking-wide text-slate-600">Audit Operational Notes</label>
                  <textarea id="modal-notes" rows={2} {...register("notes")} placeholder="Add cross-organizational administrative logs for compliance transparency..." className="mt-1.5 block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-hidden resize-none" />
                </div>

                <div className="pt-4 flex justify-end gap-2.5 border-t border-slate-100">
                  <button type="button" onClick={onClose} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer" disabled={isSaving}>Cancel</button>
                  <button type="submit" disabled={isSaving} className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 cursor-pointer disabled:opacity-50">
                    {isSaving && <Loader2 className="h-4 w-4 animate-spin" />} Assign Employee
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