import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { holidayImportSchema } from "../../schemas/holidayImportSchema";
import { usePreviewHolidayImportMutation, useImportHolidaysMutation } from "../../api/attendanceSetupApi";
import { HolidayPreviewTable } from "./HolidayPreviewTable";
import { HolidayImportSummary } from "./HolidayImportSummary";
import { X, Loader2, Globe, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

export const ImportHolidayDialog = ({ isOpen, onClose, refetchHolidays }) => {
  const [step, setStep] = useState(1);
  const [previewData, setPreviewData] = useState([]);
  const [summaryData, setSummaryData] = useState(null);

  const [previewImport, { isLoading: isPreviewing }] = usePreviewHolidayImportMutation();
  const [commitImport, { isLoading: isCommitting }] = useImportHolidaysMutation();

  const methods = useForm({
    resolver: zodResolver(holidayImportSchema),
    defaultValues: { country_code: "IN", year: new Date().getFullYear(), subdivision: "", overwrite_existing: false },
    mode: "onChange"
  });

  const { register, handleSubmit, formState: { errors }, getValues } = methods;

  const handleStepOneSubmit = async (values) => {
    try {
      const response = await previewImport(values).unwrap();
      setPreviewData(response?.data || response || []);
      setStep(2);
    } catch {
      toast.error("Failed to parse remote legislative holiday tables.");
    }
  };

  const handleExecuteImport = async () => {
    try {
      const formPayload = getValues();

      // Submit standard parameter triggers to let the background service pull the full list
      const response = await commitImport(formPayload).unwrap();
      
      // Target the unwrapped inner summary dataset safely
      setSummaryData(response?.data || response);
      toast.success("Statutory holiday data merged successfully.");
      refetchHolidays();
      setStep(3);
    } catch {
      toast.error("Transactional failure encountered during server synchronization.");
    }
  };

  const handleTermReset = () => {
    setStep(1);
    setPreviewData([]);
    setSummaryData(null);
    methods.reset();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={handleTermReset} />
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} className="relative z-10 w-full max-w-xl bg-white rounded-xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 bg-slate-50/80 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-indigo-500" />
                <h3 className="text-base font-bold text-slate-900">Statutory Calendar Sync Pipeline</h3>
              </div>
              <button type="button" onClick={handleTermReset} className="text-slate-400 hover:text-slate-600 cursor-pointer"><X className="h-4 w-4" /></button>
            </div>

            <div className="px-6 py-3 bg-slate-100/40 border-b border-slate-100 flex items-center gap-2 text-xs font-semibold text-slate-400">
              <span className={step === 1 ? "text-indigo-600 font-bold" : "text-slate-700"}>1. Parameters</span>
              <span>&rarr;</span>
              <span className={step === 2 ? "text-indigo-600 font-bold" : "text-slate-700"}>2. Review Preview</span>
              <span>&rarr;</span>
              <span className={step === 3 ? "text-indigo-600 font-bold" : ""}>3. Summary Execution</span>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <FormProvider {...methods}>
                {step === 1 && (
                  <form id="step-one-form" onSubmit={handleSubmit(handleStepOneSubmit)} className="space-y-4">
                    <div>
                      <label htmlFor="country_code" className="block text-xs font-bold uppercase tracking-wide text-slate-600">ISO Country Jurisdiction Code</label>
                      <input id="country_code" type="text" maxLength={2} placeholder="e.g. IN, US, AE" {...register("country_code")} className="mt-1.5 block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 uppercase" />
                      {errors.country_code && <p className="mt-1 text-xs text-red-600">{errors.country_code.message}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="year" className="block text-xs font-bold uppercase tracking-wide text-slate-600">Calendar Target Year</label>
                        <input id="year" type="number" {...register("year", { valueAsNumber: true })} className="mt-1.5 block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800" />
                        {errors.year && <p className="mt-1 text-xs text-red-600">{errors.year.message}</p>}
                      </div>
                      <div>
                        <label htmlFor="subdivision" className="block text-xs font-bold uppercase tracking-wide text-slate-600">Subdivision / State (Optional)</label>
                        <input id="subdivision" type="text" placeholder="e.g. KL, CA, TX" {...register("subdivision")} className="mt-1.5 block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 uppercase" />
                      </div>
                    </div>
                    <div className="flex items-start rounded-xl border border-slate-100 bg-slate-50/40 p-4 mt-2">
                      <input id="overwrite_toggle" type="checkbox" {...register("overwrite_existing")} className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                      <label htmlFor="overwrite_toggle" className="ml-3 text-sm font-semibold text-slate-800 select-none">
                        Overwrite Existing Clashing Parameters
                      </label>
                    </div>
                  </form>
                )}

                {step === 2 && (
                  <div className="space-y-4">
                    <div className="rounded-xl border border-amber-100 bg-amber-50/40 p-3 flex gap-2 items-start text-xs text-amber-800">
                      <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                      <p>Verify the incoming synchronized calendar list below before executing database commits.</p>
                    </div>
                    <HolidayPreviewTable data={previewData} />
                  </div>
                )}

                {step === 3 && <HolidayImportSummary summary={summaryData} />}
              </FormProvider>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2.5">
              {step === 1 && (
                <>
                  <button type="button" onClick={handleTermReset} className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer">Cancel</button>
                  <button type="submit" form="step-one-form" disabled={isPreviewing} className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 cursor-pointer disabled:opacity-50">
                    {isPreviewing && <Loader2 className="h-4 w-4 animate-spin" />}
                    Query Remote Feed
                  </button>
                </>
              )}
              {step === 2 && (
                <>
                  <button type="button" disabled={isCommitting} onClick={() => setStep(1)} className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer">Back</button>
                  <button type="button" disabled={isCommitting || previewData.length === 0} onClick={handleExecuteImport} className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 cursor-pointer disabled:opacity-50">
                    {isCommitting && <Loader2 className="h-4 w-4 animate-spin" />}
                    Execute Structural Merge ({previewData.length} entries)
                  </button>
                </>
              )}
              {step === 3 && (
                <button type="button" onClick={handleTermReset} className="rounded-lg bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-800 cursor-pointer">Terminate Pipeline Session</button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};