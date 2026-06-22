import React from "react";
import { CalendarDays, Plus } from "lucide-react";

export const ScheduleEmptyState = ({ onCreateInit, isInitializing }) => {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50/50 p-8 text-center md:p-12 font-sans">
      {/* Icon Frame: Balanced, high-contrast, non-decorative */}
      <div className="flex h-10 w-10 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-500 shadow-sm">
        <CalendarDays className="h-5 w-5" aria-hidden="true" />
      </div>

      {/* Content Block */}
      <h3 className="mt-4 text-base font-semibold text-gray-900">
        No Working Schedule Configured
      </h3>
      <p className="mt-1.5 max-w-md text-sm text-gray-500 leading-relaxed">
        Set up your organization's core operations schedule to enable shift calculations, holiday synchronization, and team tracking.
      </p>

      {/* Action Zone */}
      <div className="mt-6">
        <button
          type="button"
          onClick={onCreateInit}
          disabled={isInitializing}
          aria-busy={isInitializing}
          className="inline-flex items-center gap-2 rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors duration-150 hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isInitializing ? (
            /* Smooth system-native spinner for active processes */
            <svg 
              className="h-4 w-4 animate-spin text-white" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : (
            <Plus className="h-4 w-4" aria-hidden="true" />
          )}
          
          {isInitializing ? "Initializing schedule..." : "Create Organization Schedule"}
        </button>
      </div>
    </div>
  );
};