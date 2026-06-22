import React from "react";
import { AlertCircle, RefreshCcw } from "lucide-react";

export const HolidayErrorState = ({ onRetry }) => {
  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600 border border-red-100 shadow-sm">
        <AlertCircle className="h-5 w-5" />
      </div>
      <h3 className="mt-4 text-base font-semibold text-slate-900">Unable to load holidays</h3>
      <p className="mt-2 text-sm text-slate-500">
        The remote cluster framework failed to complete data serialization rules. Verify connection or lease vectors.
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-6 inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 cursor-pointer transition-colors"
      >
        <RefreshCcw className="h-4 w-4" />
        Retry Query Processing
      </button>
    </div>
  );
};