import React from "react";
import { ShieldAlert, RefreshCcw } from "lucide-react";

export const AssignmentErrorState = ({ onRetry }) => {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50/40 p-8 text-center max-w-md mx-auto my-6 shadow-3xs">
      <div className="inline-flex p-3 bg-red-100 text-red-700 border border-red-200 rounded-full mb-3">
        <ShieldAlert className="h-5 w-5 stroke-[2]" />
      </div>
      <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Infrastructure Sync Error</h4>
      <p className="mt-1 text-xs text-slate-500 leading-relaxed">
        Something went wrong while loading shift assignments records layers. Security tokens validation failed or connection pipe dropped out during extraction runs.
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-3xs transition-all cursor-pointer"
      >
        <RefreshCcw className="h-3 w-3" /> Retry Pipeline Connection
      </button>
    </div>
  );
};