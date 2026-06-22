import React from "react";
import { useFormContext } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarRange } from "lucide-react";

export const HolidayIntegrationCard = () => {
  const { register, watch, setValue } = useFormContext();
  
  // Watch flag to coordinate local conditional rendering rules safely
  const isSyncEnabled = watch("holiday_sync_enabled");

  const handleToggle = () => {
    setValue("holiday_sync_enabled", !isSyncEnabled, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  return (
    <div className="space-y-6 font-sans bg-white">
      {/* Hidden input element ensures standard hook form array registry remains working */}
      <input 
        type="checkbox" 
        id="holiday_sync_enabled" 
        {...register("holiday_sync_enabled")} 
        className="sr-only" 
      />

      {/* Header Block and Toggle Element Row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <div className="flex items-start gap-2.5">
          <div className="mt-0.5 text-gray-400 shrink-0">
            <CalendarRange className="h-4 w-4" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900">
              Holiday Synchronization
            </h3>
            <p className="mt-0.5 text-sm text-gray-500 max-w-xl leading-relaxed">
              Automatically exclude recognized holidays from attendance calculations.
            </p>
          </div>
        </div>

        {/* Enterprise Switch Element Wrapper */}
        <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto min-h-[44px]">
          <span className="text-xs font-medium text-gray-500" aria-hidden="true">
            {isSyncEnabled ? "Enabled" : "Disabled"}
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={isSyncEnabled}
            aria-label="Toggle Holiday Synchronization"
            onClick={handleToggle}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-150 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 ${
              isSyncEnabled ? "bg-gray-900" : "bg-gray-200"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-150 ease-in-out ${
                isSyncEnabled ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>

      {/* State-Driven Status Messaging */}
      <div className="rounded-md bg-gray-50 p-3 border border-gray-200/60">
        <p className="text-xs text-gray-600">
          {isSyncEnabled 
            ? "Recognized holidays will be excluded from attendance evaluations." 
            : "Holidays will not automatically affect attendance calculations."
          }
        </p>
      </div>

      {/* Conditional Provider Selection Context */}
      <AnimatePresence initial={false}>
        {isSyncEnabled && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="space-y-1.5 border-t border-gray-100 pt-4 max-w-md">
              <label 
                htmlFor="holiday_provider" 
                className="block text-sm font-medium text-gray-700"
              >
                Holiday Source
              </label>
              <select
                id="holiday_provider"
                {...register("holiday_provider")}
                className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm transition-colors duration-100 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
              >
                <option value="public_holidays">Public Holidays (Automated Region Rules)</option>
                <option value="manual">Manual Management</option>
              </select>
              <p className="text-[11px] text-gray-400">
                Determines how recognized non-working dates enter system calculation parameters.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Context Guideline Footnote */}
      <div className="border-t border-gray-100 pt-3">
        <p className="text-xs text-gray-400 leading-normal">
          Holiday settings influence attendance calculations across the organization.
        </p>
      </div>
    </div>
  );
};