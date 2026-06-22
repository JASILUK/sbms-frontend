import React, { useState } from "react";
import { ShieldCheck, Loader2 } from "lucide-react";

export const ScheduleStatusCard = ({ isActive, onToggle, isToggling }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleToggleClick = () => {
    if (isActive) {
      // Prompt for confirmation if attempting to pause an active setup
      setShowConfirm(true);
    } else {
      // Immediately pass structural activation calls forward
      onToggle(true);
    }
  };

  const handleConfirmDisable = () => {
    setShowConfirm(false);
    onToggle(false);
  };

  return (
    <div className="font-sans bg-white space-y-6">
      
      {/* Structural Context Split Grid Block */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        
        {/* Left Side: Context Framing & Impact Descriptions */}
        <div className="space-y-4 max-w-2xl">
          <div className="flex items-start gap-2.5">
            <div className="mt-0.5 text-gray-400 shrink-0">
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">
                Attendance Enforcement
              </h3>
              <p className="mt-0.5 text-sm text-gray-500 leading-relaxed">
                Control whether attendance rules are actively applied across the organization.
              </p>
            </div>
          </div>

          {/* Current Realtime Status Indication Strip */}
          <div className="flex items-center gap-4 border-l-2 border-gray-100 pl-4 py-0.5">
            <div>
              <span className="block text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                Enforcement Status
              </span>
              <div className="mt-1 flex items-center gap-2">
                <span 
                  className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-green-600 animate-pulse" : "bg-gray-400"}`} 
                  aria-hidden="true" 
                />
                <span className="text-sm font-semibold text-gray-900">
                  {isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
            <div className="text-xs text-gray-500 max-w-md self-end">
              {isActive 
                ? "Employees' attendance records are evaluated using the configured schedule." 
                : "Attendance calculations and schedule validations will not be applied until enforcement is re-enabled."
              }
            </div>
          </div>
        </div>

        {/* Right Side: Operational Interaction Interface Block */}
        <div className="flex flex-col gap-1.5 shrink-0 self-start lg:items-end min-h-[44px]">
          <span className="text-xs font-medium text-gray-500 lg:text-right" id="switch-label">
            {isToggling ? "Applying modifications..." : isActive ? "Disable Enforcement" : "Enable Enforcement"}
          </span>
          
          <div className="flex items-center gap-2">
            {isToggling && (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-gray-400" aria-hidden="true" />
            )}
            <button
              type="button"
              role="switch"
              aria-checked={isActive}
              aria-labelledby="switch-label"
              disabled={isToggling || showConfirm}
              onClick={handleToggleClick}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-150 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40 ${
                isActive ? "bg-green-600" : "bg-gray-200"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-150 ease-in-out ${
                  isActive ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Lightweight Inline Non-Modal Confirmation Context Guard */}
      {showConfirm && (
        <div className="rounded-md border border-amber-200 bg-amber-50/50 p-4 transition-opacity duration-150">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-amber-900">
                Pause Organization-Wide Attendance Evaluations?
              </p>
              <p className="mt-0.5 text-xs text-amber-700 max-w-xl">
                Disabling enforcement pauses baseline rules and runtime validations immediately. Existing historic tracking logs will not be altered.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDisable}
                className="rounded-md bg-amber-700 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-amber-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-700"
              >
                Disable Enforcement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};