import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

export const ShiftErrorState = ({ onRetry }) => {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50/40 p-8 text-center max-w-xl mx-auto my-6">
      <div className="inline-flex p-3 bg-red-100 text-red-700 border border-red-200 rounded-full mb-3 shadow-2xs">
        <AlertCircle className="h-6 w-4 stroke-[2.5]" />
      </div>
      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Data pipeline synchronization failed</h3>
      <p className="mt-1 text-xs text-slate-500">
        Something went wrong while loading shift templates. Secure infrastructure tokens might be validating or network connection was dropped.
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-3xs transition-all cursor-pointer"
      >
        <RefreshCw className="h-3 w-3" /> Retry Pipeline Fetch
      </button>
    </div>
  );
};