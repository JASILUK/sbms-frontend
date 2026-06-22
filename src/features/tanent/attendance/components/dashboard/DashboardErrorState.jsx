import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export const DashboardErrorState = ({ error, onRetry }) => {
  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white border border-slate-200 rounded-2xl text-center space-y-4 my-12 shadow-md animate-fadeIn">
      <div className="p-3 bg-rose-50 border border-rose-100 text-rose-600 rounded-full w-12 h-12 flex items-center justify-center mx-auto">
        <AlertCircle className="h-6 w-6 stroke-[1.75]" />
      </div>
      <div className="space-y-1">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Sync Layer Disruption</h3>
        <p className="text-xs text-slate-400 font-normal leading-relaxed">
          {error?.data?.message || 'Failed to aggregate corporate attendance pipeline structures correctly.'}
        </p>
      </div>
      <div className="pt-2">
        <button
          type="button"
          onClick={onRetry}
          className="py-2 px-4 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-1.5 mx-auto shadow-4xs"
        >
          <RefreshCw className="h-3.5 w-3.5 text-slate-400" />
          <span>Synchronize Cache API</span>
        </button>
      </div>
    </div>
  );
};