import React from "react";
import { useFormContext } from "react-hook-form";
import { Loader2, RotateCcw, ShieldCheck } from "lucide-react";

export const SaveActions = ({ isSaving, onTriggerReset }) => {
  const { formState: { isDirty } } = useFormContext();

  return (
    /* FIXED: Removed 'left-0'. 
      Added 'right-0 lg:left-auto' combined with matching sidebar layout width shifts (e.g., w-full lg:w-[calc(100%-16rem)]) 
      or using standard contextual block flows if matching layout containers.
      Alternatively, using standard bottom-0 left-0 right-0 but adding responsive pl shifts matching your sidebar:
    */
    <div className="fixed bottom-0 left-0 lg:left-64 right-0 z-40 border-t border-slate-200 bg-white/95 px-4 sm:px-6 py-4 backdrop-blur-xs shadow-[0_-4px_12px_rgba(0,0,0,0.04)] transition-all duration-200">
      <div className="mx-auto flex max-w-5xl flex-col sm:flex-row items-center justify-between gap-4">
        {/* Status indicator badge wrapper */}
        <div className="flex items-center w-full sm:w-auto justify-center sm:justify-start">
          {isDirty ? (
            <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200/60 animate-pulse">
              Unsaved modifications detected
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-400 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200/40">
              Settings synchronized
            </span>
          )}
        </div>

        {/* Dynamic button control row handling flex collapse on mobile viewports */}
        <div className="flex items-center justify-center sm:justify-end gap-3 w-full sm:w-auto">
          <button
            type="button"
            disabled={isSaving}
            onClick={onTriggerReset}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 disabled:opacity-50 transition-colors cursor-pointer whitespace-nowrap"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset Defaults
          </button>
          
          <button
            type="submit"
            disabled={!isDirty || isSaving}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 disabled:opacity-50 transition-colors cursor-pointer whitespace-nowrap"
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ShieldCheck className="h-4 w-4" />
            )}
            {isSaving ? "Saving..." : "Commit Changes"}  
          </button>
        </div>
      </div>
    </div>
  );
};