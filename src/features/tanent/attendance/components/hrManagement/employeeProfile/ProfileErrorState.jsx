import React, { memo } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

const ProfileErrorState = memo(({ onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">
      <div className="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center mb-5">
        <AlertTriangle className="w-8 h-8 text-rose-500" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-2">
        Failed to load profile
      </h3>
      <p className="text-sm text-slate-500 max-w-sm mb-6 leading-relaxed">
        We couldn't retrieve the employee attendance profile data. This may be due to a network issue or the employee record may not exist.
      </p>
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-slate-900 rounded-xl hover:bg-slate-800 active:bg-slate-950 transition-colors shadow-sm"
      >
        <RefreshCw className="w-4 h-4" />
        Try Again
      </button>
    </div>
  );
});

ProfileErrorState.displayName = "ProfileErrorState";

export default ProfileErrorState;