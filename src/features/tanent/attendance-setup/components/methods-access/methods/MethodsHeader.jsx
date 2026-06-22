import React from 'react';
import { Settings2, RefreshCw } from 'lucide-react';

export const MethodsHeader = React.memo(({ onConfigure, onRefetch, isRefetching }) => (
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-5 gap-4">
    <div className="space-y-1">
      <h1 className="text-base font-bold tracking-tight text-slate-900 flex items-center gap-2">
        <Settings2 className="h-4 w-4 text-slate-700 flex-shrink-0" />
        Attendance Methods
      </h1>
      <p className="text-xs text-slate-500 leading-normal max-w-2xl">
        Choose how employees can record attendance across your organization context boundaries. Unlocked methods sync as valid gates references profiles.
      </p>
    </div>
    <div className="flex items-center gap-2 w-full sm:w-auto">
      <button
        onClick={onRefetch}
        disabled={isRefetching}
        className="flex-1 sm:flex-none inline-flex items-center justify-center px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
      >
        <RefreshCw className={`h-3.5 w-3.5 ${isRefetching ? 'animate-spin' : ''}`} />
      </button>
      <button
        onClick={onConfigure}
        className="flex-1 sm:flex-none inline-flex items-center justify-center px-3 py-1.5 border border-transparent rounded-lg text-xs font-semibold text-white bg-slate-900 shadow-sm hover:bg-slate-800 transition-colors"
      >
        Configure Channels
      </button>
    </div>
  </div>
));

MethodsHeader.displayName = 'MethodsHeader';