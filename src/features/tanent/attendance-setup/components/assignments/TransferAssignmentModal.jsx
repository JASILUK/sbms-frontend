import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { transferAssignmentSchema } from "../../schemas/assignmentSchema";
import { useTransferAssignmentMutation, useGetShiftsQuery } from "../../api/attendanceSetupApi";
import { motion, AnimatePresence } from "framer-motion";
// FIXED: Replaced MoveLeftRight with ArrowLeftRight to match your current Lucide bundle version
import { X, Loader2, ArrowLeftRight, Info } from "lucide-react";
import { toast } from "sonner";

export const TransferAssignmentModal = ({ isOpen, onClose, activeRecord }) => {
  const [transferShift, { isLoading }] = useTransferAssignmentMutation();
  const { data: shiftsBody } = useGetShiftsQuery();
  const shifts = shiftsBody?.data?.results || shiftsBody?.data || [];

  const nameString = activeRecord?.employee ? `${activeRecord.employee.first_name} ${activeRecord.employee.last_name}` : "Associate Profile";

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(transferAssignmentSchema),
    defaultValues: { new_shift_id: "", transfer_date: "", notes: "" }
  });

  const handleFormSubmission = async (values) => {
  if (values.new_shift_id === String(activeRecord?.shift_id || activeRecord?.shift?.public_id)) {
    toast.error("Target pattern destination matches the current assignment.");
    return;
  }

  try {
    // FIXED: Remap the form values to the exact property keys expected by the Django InlineTransferSerializer
    const payload = {
      shift_id: parseInt(values.new_shift_id, 10),
      effective_from: values.transfer_date,
      notes: values.notes || "",
    };

    // Pass the payload object instead of spreading raw form values
    await transferShift({ id: activeRecord.id, ...payload }).unwrap();
    toast.success("Workforce transition logged; historical tracks safely archived.");
    reset();
    onClose();
  } catch {
    toast.error("Pipeline migration sequence execution rejected.");
  }
};

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={onClose} />
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} className="relative z-10 w-full max-w-lg bg-white rounded-xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden">
            
            <div className="flex items-center justify-between px-6 py-4 bg-indigo-50/60 border-b border-indigo-100">
              <div className="flex items-center gap-2 text-indigo-900">
                {/* FIXED: Swapped out the old component indicator name */}
                <ArrowLeftRight className="h-4 w-4" />
                <h3 className="text-base font-bold">Transfer Associate Workspace Allocation</h3>
              </div>
              <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"><X className="h-4 w-4" /></button>
            </div>

            <form onSubmit={handleSubmit(handleFormSubmission)} className="p-6 space-y-4">
              
              <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-xs text-indigo-900 flex gap-2 items-start">
                <img src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%233730a3' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><circle cx='12' cy='12' r='10'/><line x1='12' y1='16' x2='12' y2='12'/><line x1='12' y1='8' x2='12.01' y2='8'/></svg>" alt="Info" className="w-4 h-4 mt-0.5 shrink-0" />
                <p><strong>Immutable Architecture Guarantee:</strong> This operation safely terminates the current schedule and maps a new timeline layer to prevent analytical report distortion.</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 border border-slate-200 rounded-xl p-3">
                <div>
                  <span className="text-slate-400 font-medium block">Target Headcount</span>
                  <span className="font-bold text-slate-800 block mt-0.5">{nameString}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Active Shift Context</span>
                  <span className="font-bold text-slate-800 block mt-0.5">{activeRecord?.shift?.name || "Baseline Pattern"}</span>
                </div>
              </div>

              <div>
                <label htmlFor="transfer-target" className="block text-xs font-bold uppercase tracking-wide text-slate-600">New Work Matrix Assignment Target</label>
                <select id="transfer-target" { ...register("new_shift_id") } className="mt-1.5 block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm bg-white text-slate-800 focus:border-indigo-500 focus:outline-hidden">
                  <option value="">Choose target pattern configuration destination...</option>
                  {shifts.map((s) => (
                    <option key={s.public_id || s.id} value={s.public_id || s.id}>{s.name}</option>
                  ))}
                </select>
                {errors.new_shift_id && <p className="mt-1 text-xs text-red-600 font-semibold">{errors.new_shift_id.message}</p>}
              </div>

              <div>
                <label htmlFor="transfer-date" className="block text-xs font-bold uppercase tracking-wide text-slate-600">Effective Transition Launch Date Checkpoint</label>
                <input id="transfer-date" type="date" { ...register("transfer_date") } className="mt-1.5 block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-hidden" />
                {errors.transfer_date && <p className="mt-1 text-xs text-red-600 font-semibold">{errors.transfer_date.message}</p>}
              </div>

              <div className="pt-4 flex justify-end gap-2.5 border-t border-slate-100">
                <button type="button" onClick={onClose} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer">Abort Action</button>
                <button type="submit" disabled={isLoading} className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 shadow-sm cursor-pointer">
                  {isLoading && <Loader2 className="h-4 w-4 animate-spin" />} Transfer Employee
                </button>
              </div>

            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};