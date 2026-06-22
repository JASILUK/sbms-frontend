import React from "react";
import { useFormContext } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp } from "lucide-react";

export const OvertimeCard = () => {
  const { register, watch, formState: { errors } } = useFormContext();
  const isOvertimeEnabled = watch("overtime_enabled");

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-50 text-slate-600 rounded-lg border border-slate-200/60">
            <TrendingUp className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900">Overtime Rules</h3>
            <p className="text-xs text-slate-500">Regulate authorization limits for premium capacity hours tracking metrics.</p>
          </div>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={isOvertimeEnabled}
          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 ${
            isOvertimeEnabled ? "bg-indigo-600" : "bg-slate-200"
          }`}
          onClick={() => {
            const current = watch("overtime_enabled");
            // Direct reference avoid state hook lag structures
            document.getElementById("overtime_enabled_checkbox")?.click();
          }}
        >
          <span
            aria-hidden="true"
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
              isOvertimeEnabled ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
        <input
          id="overtime_enabled_checkbox"
          type="checkbox"
          {...register("overtime_enabled")}
          className="sr-only"
        />
      </div>

      <AnimatePresence initial={false}>
        {isOvertimeEnabled && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="space-y-6 pt-2">
              <div className="max-w-md">
                <label htmlFor="overtime_after_minutes" className="block text-xs font-bold uppercase tracking-wide text-slate-700">
                  Overtime Threshold Boundary Point
                </label>
                <div className="relative mt-2 rounded-lg shadow-sm">
                  <input
                    id="overtime_after_minutes"
                    type="number"
                    {...register("overtime_after_minutes", { valueAsNumber: true })}
                    className="block w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <span className="text-xs font-medium text-slate-400">minutes</span>
                  </div>
                </div>
                <p className="mt-2 text-xs text-slate-400">Incremental premium computation tiers execute exclusively upon passing this tracking cap baseline.</p>
                {errors.overtime_after_minutes && (
                  <p className="mt-1 text-xs font-medium text-red-600" role="alert">{errors.overtime_after_minutes.message}</p>
                )}
              </div>

              <div className="relative flex items-start rounded-xl border border-slate-100 bg-slate-50/40 p-4">
                <div className="flex h-5 items-center">
                  <input
                    id="count_weekend_as_overtime"
                    type="checkbox"
                    {...register("count_weekend_as_overtime")}
                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="count_weekend_as_overtime" className="font-semibold text-slate-800">
                    Count Weekend Attendance as Overtime
                  </label>
                  <p className="text-xs text-slate-500 mt-0.5">
                    When active, weekend check-in sequences bypass daily regular required rules and calculate instantly as overtime accruals.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};