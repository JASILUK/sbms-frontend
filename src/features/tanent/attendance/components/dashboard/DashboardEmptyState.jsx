import React from 'react';
import { DatabaseBackup } from 'lucide-react';

export const DashboardEmptyState = () => {
  return (
    <div className="w-full max-w-sm mx-auto p-8 bg-white border border-slate-200 rounded-3xl text-center space-y-3 my-16 shadow-xs animate-fadeIn">
      <div className="p-3.5 bg-slate-50 border border-slate-100 text-slate-400 rounded-full w-12 h-12 flex items-center justify-center mx-auto shadow-4xs">
        <DatabaseBackup className="h-5 w-5 stroke-[1.5]" />
      </div>
      <div className="space-y-1">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Empty Scope Environment</h3>
        <p className="text-[11px] text-slate-400 font-normal leading-relaxed">
          No institutional telemetry metrics found linking your membership credentials to this tenant.
        </p>
      </div>
    </div>
  );
};