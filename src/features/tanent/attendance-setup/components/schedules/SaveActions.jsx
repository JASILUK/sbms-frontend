import React from "react";
import { Loader2 } from "lucide-react";

export const SaveActions = ({ isDirty, isSaving, onCancel }) => {
  // Visibility Guard: Strip entirely from the DOM canvas when no delta properties are detected
  if (!isDirty) return null;

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white/95 px-4 py-3.5 backdrop-blur-sm shadow-[0_-4px_12px_-2px_rgba(0,0,0,0.05)] sm:px-6 font-sans transition-opacity duration-150"
      role="region"
      aria-label="Unsaved attendance settings changes detected"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        
        {/* Left Side: Unsaved State Tracking Content Block */}
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span 
              className={`h-1.5 w-1.5 rounded-full ${isSaving ? "bg-gray-400" : "bg-amber-500 animate-pulse"}`} 
              aria-hidden="true" 
            />
            <h4 className="text-sm font-semibold text-gray-900">
              {isSaving ? "Applying Configuration Updates" : "Unsaved Changes"}
            </h4>
          </div>
          <p className="text-xs text-gray-500 leading-normal max-w-md">
            {isSaving 
              ? "Your schedule configuration values are currently being compiled into active global system records." 
              : "Review and save your updates to apply them organization-wide."
            }
          </p>
        </div>

        {/* Right Side: Operational Interaction Stack */}
        <div className="flex items-center gap-3 shrink-0">
          
          {/* Secondary Dismissal Control */}
          <button
            type="button"
            onClick={onCancel}
            disabled={isSaving}
            className="w-full sm:w-auto min-h-[44px] sm:min-h-[36px] rounded-md border border-gray-300 bg-white px-3.5 py-1.5 text-sm font-medium text-gray-700 shadow-sm transition-colors duration-100 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Discard Changes
          </button>
          
          {/* Primary Submission Target */}
          <button
            type="submit"
            disabled={isSaving}
            aria-busy={isSaving}
            className="w-full sm:w-auto min-h-[44px] sm:min-h-[36px] inline-flex items-center justify-center gap-2 rounded-md bg-gray-900 px-3.5 py-1.5 text-sm font-semibold text-white shadow-sm transition-colors duration-100 hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isSaving && (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-white/90" aria-hidden="true" />
            )}
            <span>
              {isSaving ? "Saving Changes..." : "Save Changes"}
            </span>
          </button>

        </div>
      </div>
    </div>
  );
};