import React from "react";
import { useFormContext } from "react-hook-form";
import { Sliders } from "lucide-react";

export const AttendanceThresholdCard = () => {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-3 border-b border-slate-100 pb-4">
        <div className="p-2 bg-slate-50 text-slate-600 rounded-lg border border-slate-200/60">
          <Sliders className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-slate-900">Attendance Thresholds</h3>
          <p className="text-xs text-slate-500">Define operational buffer time criteria for late punch variations.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="late_after_minutes" className="block text-xs font-bold uppercase tracking-wide text-slate-700">
            Late Arrival Grace Window
          </label>
          <div className="relative mt-2 rounded-lg shadow-sm">
            <input
              id="late_after_minutes"
              type="number"
              {...register("late_after_minutes", { valueAsNumber: true })}
              className="block w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-xs font-medium text-slate-400">minutes</span>
            </div>
          </div>
          <p className="mt-2 text-xs text-slate-400">Allocated tracking window buffer before an operational shift is flagged with late metrics status flags.</p>
          {errors.late_after_minutes && (
            <p className="mt-1 text-xs font-medium text-red-600" role="alert">{errors.late_after_minutes.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="early_exit_before_minutes" className="block text-xs font-bold uppercase tracking-wide text-slate-700">
            Early Exit Margin Exception Limit
          </label>
          <div className="relative mt-2 rounded-lg shadow-sm">
            <input
              id="early_exit_before_minutes"
              type="number"
              {...register("early_exit_before_minutes", { valueAsNumber: true })}
              className="block w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-xs font-medium text-slate-400">minutes</span>
            </div>
          </div>
          <p className="mt-2 text-xs text-slate-400">Allowable timing delta buffer parameter space applied relative to target standard endpoint departures.</p>
          {errors.early_exit_before_minutes && (
            <p className="mt-1 text-xs font-medium text-red-600" role="alert">{errors.early_exit_before_minutes.message}</p>
          )}
        </div>
      </div>
    </div>
  );
};