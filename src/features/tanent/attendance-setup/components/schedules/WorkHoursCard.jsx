import React from "react";
import { useFormContext } from "react-hook-form";
import { Clock } from "lucide-react";

export const WorkHoursCard = () => {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="space-y-6 font-sans bg-white">
      {/* Labeled Structural Header Frame */}
      <div className="flex items-start gap-2.5">
        <div className="mt-0.5 text-gray-400 shrink-0">
          <Clock className="h-4 w-4" aria-hidden="true" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-gray-900">
            Work Hours & Breaks
          </h3>
          <p className="mt-0.5 text-sm text-gray-500 max-w-2xl leading-relaxed">
            Define the standard workday and break deductions used in attendance evaluations.
          </p>
        </div>
      </div>

      {/* Field Input Grid Layout Wrapper */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        
        {/* Start Time Input */}
        <div className="space-y-1.5">
          <label 
            htmlFor="work_start_time" 
            className="block text-sm font-medium text-gray-700"
          >
            Start Time
          </label>
          <input
            id="work_start_time"
            type="time"
            {...register("work_start_time")}
            className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm transition-colors duration-100 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
          />
          {errors.work_start_time && (
            <p className="text-xs font-medium text-red-600 transition-opacity duration-150" role="alert">
              {errors.work_start_time.message}
            </p>
          )}
        </div>

        {/* End Time Input */}
        <div className="space-y-1.5">
          <label 
            htmlFor="work_end_time" 
            className="block text-sm font-medium text-gray-700"
          >
            End Time
          </label>
          <input
            id="work_end_time"
            type="time"
            {...register("work_end_time")}
            className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm transition-colors duration-100 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
          />
          {errors.work_end_time && (
            <p className="text-xs font-medium text-red-600 transition-opacity duration-150" role="alert">
              {errors.work_end_time.message}
            </p>
          )}
        </div>

        {/* Break Duration Numeric Input */}
        <div className="space-y-1.5 md:col-span-2 lg:col-span-1">
          <label 
            htmlFor="break_minutes" 
            className="block text-sm font-medium text-gray-700"
          >
            Break Duration
          </label>
          <div className="relative rounded-md shadow-sm">
            <input
              id="break_minutes"
              type="number"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="0"
              {...register("break_minutes", { valueAsNumber: true })}
              className="block w-full rounded-md border border-gray-300 bg-white pl-3 pr-16 py-2 text-sm text-gray-900 transition-colors duration-100 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-xs font-medium text-gray-400">
                minutes
              </span>
            </div>
          </div>
          {errors.break_minutes && (
            <p className="text-xs font-medium text-red-600 transition-opacity duration-150" role="alert">
              {errors.break_minutes.message}
            </p>
          )}
        </div>
      </div>

      {/* Structural System Context Guidance Footnote */}
      <div className="border-t border-gray-100 pt-3">
        <p className="text-xs text-gray-400 leading-normal">
          Break duration is excluded from total worked hours during attendance calculations.
        </p>
      </div>
    </div>
  );
};