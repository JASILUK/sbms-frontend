import React from "react";
import { useFormContext } from "react-hook-form";
import { Briefcase } from "lucide-react";

export const WorkRulesCard = () => {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-3 border-b border-slate-100 pb-4">
        <div className="p-2 bg-slate-50 text-slate-600 rounded-lg border border-slate-200/60">
          <Briefcase className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-slate-900">Daily Work Rules</h3>
          <p className="text-xs text-slate-500">Determine operational baseline metrics for core hour logging definitions.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="required_work_minutes" className="block text-xs font-bold uppercase tracking-wide text-slate-700">
            Required Work Minutes
          </label>
          <div className="relative mt-2 rounded-lg shadow-sm">
            <input
              id="required_work_minutes"
              type="number"
              {...register("required_work_minutes", { valueAsNumber: true })}
              className="block w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-xs font-medium text-slate-400">minutes</span>
            </div>
          </div>
          <p className="mt-2 text-xs text-slate-400">Minimum total active duration required to record full operational single-day counts.</p>
          {errors.required_work_minutes && (
            <p className="mt-1 text-xs font-medium text-red-600" role="alert">{errors.required_work_minutes.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="half_day_below_minutes" className="block text-xs font-bold uppercase tracking-wide text-slate-700">
            Half-Day Upper Threshold Bound
          </label>
          <div className="relative mt-2 rounded-lg shadow-sm">
            <input
              id="half_day_below_minutes"
              type="number"
              {...register("half_day_below_minutes", { valueAsNumber: true })}
              className="block w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-xs font-medium text-slate-400">minutes</span>
            </div>
          </div>
          <p className="mt-2 text-xs text-slate-400">Work instances dropping below this threshold step back to half-day accounting models automatically.</p>
          {errors.half_day_below_minutes && (
            <p className="mt-1 text-xs font-medium text-red-600" role="alert">{errors.half_day_below_minutes.message}</p>
          )}
        </div>
      </div>
    </div>
  );
};