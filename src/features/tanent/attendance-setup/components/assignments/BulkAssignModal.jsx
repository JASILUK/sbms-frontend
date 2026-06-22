import React, { useState, useMemo } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useBulkAssignMutation, useGetShiftsQuery } from "../../api/attendanceSetupApi";
import { useGetEmployeesQuery } from "../../../emplyees/emplyeeApi";
import { EmployeeMultiSelect } from "./EmployeeMultiSelect";
import { motion, AnimatePresence } from "framer-motion";
import { X, Layers, ArrowRight, ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { bulkAssignmentSchema } from "../../schemas/assignmentSchema";


export const BulkAssignModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [bulkAssign, { isLoading }] = useBulkAssignMutation();
  
  const { data: shiftsBody } = useGetShiftsQuery();
  const { data: employeesBody } = useGetEmployeesQuery();

  const shifts = shiftsBody?.data?.results || shiftsBody?.data || [];
  const employees = employeesBody?.data || employeesBody || [];

  const methods = useForm({
    resolver: zodResolver(bulkAssignmentSchema),
    defaultValues: { membership_ids: [], shift_id: "", effective_from: "", effective_to: null, notes: "" },
    mode: "onChange"
  });

  const { register, trigger, watch, handleSubmit, formState: { errors }, reset } = methods;
  
  const watchedEmployeeIds = watch("membership_ids");
  const watchedShiftId = watch("shift_id");
  const watchedDateFrom = watch("effective_from");

  const chosenShiftName = useMemo(() => {
    return shifts.find((s) => String(s.public_id || s.id) === String(watchedShiftId))?.name || "Unselected Shift";
  }, [watchedShiftId, shifts]);

  const handleNextStep = async () => {
    if (step === 1) {
      const validStepOne = await trigger("membership_ids");
      if (validStepOne) setStep(2);
    } else if (step === 2) {
      const validStepTwo = await trigger(["shift_id", "effective_from", "effective_to"]);
      if (validStepTwo) setStep(3);
    }
  };

  const handleFormSubmission = async (values) => {
    try {
      await bulkAssign(values).unwrap();
      toast.success("Bulk headcount reallocation completed successfully.");
      handleResetSession();
    } catch {
      toast.error("Transactional server compilation sequence rejected.");
    }
  };

  const handleResetSession = () => {
    setStep(1);
    reset();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={handleResetSession} />
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} className="relative z-10 w-full max-w-xl bg-white rounded-xl border border-slate-200 shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
            
            <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">Bulk Reallocation Pipeline</h3>
              </div>
              <button type="button" onClick={handleResetSession} className="text-slate-400 hover:text-slate-600 cursor-pointer"><X className="h-4 w-4" /></button>
            </div>

            {/* Steps Tracking Status indicator map line */}
            <div className="px-6 py-2.5 bg-slate-100 border-b border-slate-200 flex gap-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 select-none">
              <span className={step === 1 ? "text-indigo-600 font-extrabold" : "text-slate-500"}>1. Headcount Target Selection ({watchedEmployeeIds.length})</span>
              <span>&rarr;</span>
              <span className={step === 2 ? "text-indigo-600 font-extrabold" : "text-slate-500"}>2. Pattern Matrix parameters</span>
              <span>&rarr;</span>
              <span className={step === 3 ? "text-indigo-600 font-extrabold" : ""}>3. Compilation Audit Summary</span>
            </div>

            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(handleFormSubmission)} className="flex-1 overflow-y-auto p-6 space-y-4 text-sm">
                
                {step === 1 && (
                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wide text-slate-600">Select target employees profiles group</label>
                    <EmployeeMultiSelect employees={employees} />
                    {errors.membership_ids && <p className="text-xs text-red-600 font-semibold mt-1">{errors.membership_ids.message}</p>}
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="bulk-shift" className="block text-xs font-bold uppercase tracking-wide text-slate-600">Target Shift Blueprint</label>
                      <select id="bulk-shift" {...register("shift_id")} className="mt-1.5 block w-full rounded-lg border border-slate-200 px-3 py-2 bg-white text-slate-800 focus:border-indigo-500 focus:outline-hidden">
                        <option value="">Designate work parameters shift window target...</option>
                        {shifts.map((s) => <option key={s.public_id || s.id} value={s.public_id || s.id}>{s.name}</option>)}
                      </select>
                      {errors.shift_id && <p className="text-xs text-red-600 font-semibold mt-1">{errors.shift_id.message}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="bulk-from" className="block text-xs font-bold uppercase tracking-wide text-slate-600">Effective From</label>
                        <input id="bulk-from" type="date" {...register("effective_from")} className="mt-1.5 block w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-800 focus:border-indigo-500 focus:outline-hidden" />
                      </div>
                      <div>
                        <label htmlFor="bulk-to" className="block text-xs font-bold uppercase tracking-wide text-slate-600">Effective To (Optional)</label>
                        <input id="bulk-to" type="date" {...register("effective_to")} className="mt-1.5 block w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-800 focus:border-indigo-500 focus:outline-hidden" />
                      </div>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 space-y-4 text-center max-w-sm mx-auto">
                    <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto" />
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Verify Compilation Run Params</h4>
                      <p className="text-xs text-slate-400 mt-1">Confirming allocation mapping deployment parameters.</p>
                    </div>
                    <div className="text-xs font-semibold bg-white border border-slate-200 rounded-xl p-3 space-y-1.5 text-left">
                      <div className="flex justify-between"><span>Batch Load:</span><span className="text-slate-900 font-bold">{watchedEmployeeIds.length} Profiles</span></div>
                      <div className="flex justify-between"><span>Destination:</span><span className="text-indigo-600 font-bold truncate max-w-[150px]">{chosenShiftName}</span></div>
                      <div className="flex justify-between"><span>Launch Date:</span><span className="text-slate-800 font-mono">{watchedDateFrom}</span></div>
                    </div>
                  </div>
                )}

                {/* Wizard Controls Footer Block */}
                <div className="pt-4 mt-6 border-t border-slate-100 flex justify-end gap-2 text-xs font-semibold">
                  {step > 1 && (
                    <button type="button" onClick={() => setStep((p) => p - 1)} className="px-3 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center gap-1 cursor-pointer">
                      <ArrowLeft className="h-3.5 w-3.5" /> Back
                    </button>
                  )}
                  {step < 3 ? (
                    <button type="button" onClick={handleNextStep} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 flex items-center gap-1 cursor-pointer">
                      Continue <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  ) : (
                    <button type="submit" disabled={isLoading} className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 flex items-center gap-1.5 cursor-pointer">
                      {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />} Assign Employees group
                    </button>
                  )}
                </div>

              </form>
            </FormProvider>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};