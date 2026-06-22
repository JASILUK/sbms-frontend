import React, { useState } from "react";
import { useFormContext } from "react-hook-form";

// Re-mapped meta properties with standard short labels to prevent administrator confusion
const DAYS_META = [
  { value: "monday", label: "Mon" },
  { value: "tuesday", label: "Tue" },
  { value: "wednesday", label: "Wed" },
  { value: "thursday", label: "Thu" },
  { value: "friday", label: "Fri" },
  { value: "saturday", label: "Sat" },
  { value: "sunday", label: "Sun" },
];

export const WorkingDaysSelector = () => {
  const { watch, setValue, formState: { errors } } = useFormContext();
  const currentWorkingDays = watch("working_days") || [];
  const [minDayError, setMinDayError] = useState(false);

  const toggleDay = (dayValue) => {
    let nextDays;
    
    if (currentWorkingDays.includes(dayValue)) {
      // Enforce the requirement of at least 1 working day gracefully
      if (currentWorkingDays.length === 1) {
        setMinDayError(true);
        return;
      }
      nextDays = currentWorkingDays.filter((d) => d !== dayValue);
    } else {
      setMinDayError(false);
      nextDays = [...currentWorkingDays, dayValue];
    }
    
    setValue("working_days", nextDays, { 
      shouldValidate: true, 
      shouldDirty: true 
    });
  };

  return (
    <div className="space-y-4 font-sans">
      {/* Structural Context Framing */}
      <div>
        <h3 className="text-base font-semibold text-gray-900" id="working-days-label">
          Working Days
        </h3>
        <p className="mt-1 text-sm text-gray-500 max-w-xl">
          Select the days on which attendance is evaluated across your organization.
        </p>
      </div>

      {/* Grid Canvas Shell */}
      <div 
        className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7" 
        role="group" 
        aria-labelledby="working-days-label"
      >
        {DAYS_META.map((day) => {
          const isSelected = currentWorkingDays.includes(day.value);
          return (
            <button
              key={day.value}
              type="button"
              onClick={() => toggleDay(day.value)}
              aria-pressed={isSelected}
              className={`flex min-h-[44px] flex-col items-center justify-center rounded-md border px-3 py-2 text-sm font-medium transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 ${
                isSelected
                  ? "bg-gray-900 border-gray-900 text-white font-semibold"
                  : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300"
              }`}
            >
              <span className="block">{day.label}</span>
              
              {/* Multi-signal marker ensuring accessibility compliance without relying on color */}
              <span 
                className={`mt-0.5 text-[10px] font-bold tracking-wider transition-opacity duration-100 ${
                  isSelected ? "opacity-80" : "opacity-0 text-gray-400"
                }`}
                aria-hidden="true"
              >
                {isSelected ? "✓ Active" : "Excluded"}
              </span>
            </button>
          );
        })}
      </div>

      {/* Secondary Helper Messaging & Calm Error Tracking Feedback */}
      <div className="min-h-[20px]">
        {minDayError && (
          <p className="text-xs font-medium text-amber-700" role="alert">
            At least one working day is required for evaluation tracking.
          </p>
        )}
        {errors.working_days && !minDayError && (
          <p className="text-xs font-medium text-red-600" role="alert">
            {errors.working_days.message}
          </p>
        )}
        {!minDayError && !errors.working_days && (
          <p className="text-xs text-gray-400">
            Attendance calculations apply only on active operational days.
          </p>
        )}
      </div>
    </div>
  );
};