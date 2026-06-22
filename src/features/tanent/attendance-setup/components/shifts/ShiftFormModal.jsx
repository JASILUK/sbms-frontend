import React from "react";
import { FormProvider, useWatch } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { useShiftForm } from "../../hooks/useShiftForm";
import { formatTime12Hour, calculateShiftDuration, formatDurationText } from "../../utils/shiftHelpers";
import { X, Loader2, Calendar, ShieldCheck, Moon } from "lucide-react";

const LivePreviewCard = ({ control }) => {
  const formValues = useWatch({
    control,
    defaultValue: { name: "Untitled Work Pattern", shift_type: "regular", start_time: "09:00", end_time: "18:00", break_duration_minutes: 60 }
  });

  const durationHours = calculateShiftDuration(formValues.start_time, formValues.end_time, formValues.break_duration_minutes);

  return (
    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-4 relative overflow-hidden">
      <span className="absolute right-3 top-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-white px-2 py-0.5 rounded-md border border-slate-100 shadow-3xs">Live Engine Preview</span>
      <div className="flex gap-3 items-center">
        <div className={`p-2 rounded-lg border ${formValues.shift_type === "night" ? "bg-indigo-50 border-indigo-100 text-indigo-600" : "bg-white border-slate-200 text-slate-500"}`}>
          {formValues.shift_type === "night" ? <Moon className="h-4 w-4" /> : <Calendar className="h-4 w-4" />}
        </div>
        <div className="max-w-[70%]">
          <h4 className="text-sm font-bold text-slate-900 truncate">{formValues.name || "Untitled Work Pattern"}</h4>
          <p className="text-xs font-semibold text-slate-700 mt-0.5">
            {formatTime12Hour(formValues.start_time)} – {formatTime12Hour(formValues.end_time)}
          </p>
          <p className="text-[11px] text-slate-400 font-medium mt-0.5">
            Net Value: <span className="text-slate-700 font-bold">{formatDurationText(durationHours)}</span> (Unpaid Break: {formValues.break_duration_minutes || 0}m)
          </p>
        </div>
      </div>
    </div>
  );
};

export const ShiftFormModal = ({ isOpen, onClose, activeShift }) => {
  const { methods, onSubmit, isSaving } = useShiftForm(activeShift, onClose);
  const { register, formState: { errors }, control } = methods;

  React.useEffect(() => {
    const handleEscapeKey = (e) => { if (e.key === "Escape") onClose(); };
    if (isOpen) window.addEventListener("keydown", handleEscapeKey);
    return () => window.removeEventListener("keydown", handleEscapeKey);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={onClose} />
          <motion.div initial={{ opacity: 0, scale: 0.96, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 12 }} className="relative z-10 w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 flex flex-col max-h-[90vh] overflow-hidden">
            
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/60">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-indigo-500" />
                <h3 className="text-base font-bold text-slate-900">
                  {activeShift ? "Modify Work Pattern Template" : "Create Reusable Shift Definition"}
                </h3>
              </div>
              <button type="button" onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"><X className="h-4 w-4" /></button>
            </div>

            <FormProvider {...methods}>
              <form onSubmit={onSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
                
                {/* Live Preview Engine Insertion Point */}
                <LivePreviewCard control={control} />

                <div>
                  <label htmlFor="shift-name" className="block text-xs font-bold uppercase tracking-wide text-slate-600">Shift Blueprint Designation</label>
                  <input
                    id="shift-name"
                    type="text"
                    {...register("name")}
                    placeholder="e.g. General Day Operations, Nocturnal Logistics Base"
                    className="mt-1.5 block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                  {errors.name && <p className="mt-1 text-xs text-red-600 font-semibold">{errors.name.message}</p>}
                </div>

                <div>
                  <label htmlFor="shift-description" className="block text-xs font-bold uppercase tracking-wide text-slate-600">Operational Notes Summary (Optional)</label>
                  <textarea
                    id="shift-description"
                    rows={2}
                    {...register("description")}
                    placeholder="Provide notes for automated cross-regional system assignments..."
                    className="mt-1.5 block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all resize-none"
                  />
                  {errors.description && <p className="mt-1 text-xs text-red-600 font-semibold">{errors.description.message}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="shift-type" className="block text-xs font-bold uppercase tracking-wide text-slate-600">Classification Type</label>
                    <select
                      id="shift-type"
                      {...register("shift_type")}
                      className="mt-1.5 block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 bg-white focus:border-indigo-500 focus:outline-none cursor-pointer"
                    >
                      <option value="regular">Regular Work Pattern</option>
                      <option value="night">Night Duty Window</option>
                    </select>
                    {errors.shift_type && <p className="mt-1 text-xs text-red-600 font-semibold">{errors.shift_type.message}</p>}
                  </div>

                  <div>
                    <label htmlFor="break-duration" className="block text-xs font-bold uppercase tracking-wide text-slate-600">Unpaid Break Volume</label>
                    <input
                      id="break-duration"
                      type="number"
                      {...register("break_duration_minutes", { valueAsNumber: true })}
                      className="mt-1.5 block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none"
                    />
                    {errors.break_duration_minutes && <p className="mt-1 text-xs text-red-600 font-semibold">{errors.break_duration_minutes.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="start-time" className="block text-xs font-bold uppercase tracking-wide text-slate-600">Duty Execution Start</label>
                    <input
                      id="start-time"
                      type="time"
                      {...register("start_time")}
                      className="mt-1.5 block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none"
                    />
                    {errors.start_time && <p className="mt-1 text-xs text-red-600 font-semibold">{errors.start_time.message}</p>}
                  </div>

                  <div>
                    <label htmlFor="end-time" className="block text-xs font-bold uppercase tracking-wide text-slate-600">Duty Execution Close</label>
                    <input
                      id="end-time"
                      type="time"
                      {...register("end_time")}
                      className="mt-1.5 block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none"
                    />
                    {errors.end_time && <p className="mt-1 text-xs text-red-600 font-semibold">{errors.end_time.message}</p>}
                  </div>
                </div>

                <div className="flex items-start rounded-xl border border-slate-100 bg-slate-50/40 p-3 mt-1">
                  <input
                    id="is-active-toggle"
                    type="checkbox"
                    {...register("is_active")}
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                  <label htmlFor="is-active-toggle" className="ml-2.5 text-sm font-semibold text-slate-800 select-none">
                    Activate Work Pattern Definition
                    <span className="block font-normal text-xs text-slate-400 mt-0.5">Makes this template instantly eligible for scheduling routing models.</span>
                  </label>
                </div>

                <div className="mt-6 flex justify-end gap-2.5 border-t border-slate-100 pt-4">
                  <button type="button" onClick={onClose} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer disabled:opacity-50" disabled={isSaving}>Cancel</button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                    {activeShift ? "Modify Template" : "Publish Configuration"}
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