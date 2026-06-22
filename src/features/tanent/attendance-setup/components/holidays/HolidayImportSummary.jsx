import React from "react";
import { CheckCircle2 } from "lucide-react";

export const HolidayImportSummary = ({ summary }) => {
  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-emerald-50 border border-emerald-200/60 p-4 flex gap-3 items-start">
        <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
        <div>
          <h4 className="text-sm font-bold text-emerald-900">Import Strategy Terminated Successfully</h4>
          <p className="text-xs text-emerald-700 mt-1">Remote legislative feed has been localized inside multi-tenant structural configurations.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs border border-slate-100 rounded-xl bg-slate-50/50 p-4">
        <div><span className="text-slate-400 font-medium">Provider Feed:</span> <span className="font-bold text-slate-700 capitalize">{summary?.provider || "Public API"}</span></div>
        <div><span className="text-slate-400 font-medium">Target Year:</span> <span className="font-bold text-slate-700">{summary?.year}</span></div>
        <div><span className="text-slate-400 font-medium">Jurisdiction:</span> <span className="font-bold text-slate-700 uppercase">{summary?.country} ({summary?.subdivision || "National"})</span></div>
        <div><span className="text-slate-400 font-medium">Total Captured:</span> <span className="font-bold text-slate-700">{summary?.total_received || 0}</span></div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="p-3 border border-slate-200 rounded-xl bg-white shadow-2xs">
          <span className="block text-lg font-bold text-slate-800">{summary?.created || 0}</span>
          <span className="text-[10px] uppercase tracking-wide font-bold text-emerald-600">Created</span>
        </div>
        <div className="p-3 border border-slate-200 rounded-xl bg-white shadow-2xs">
          <span className="block text-lg font-bold text-slate-800">{summary?.updated || 0}</span>
          <span className="text-[10px] uppercase tracking-wide font-bold text-indigo-600">Updated</span>
        </div>
        <div className="p-3 border border-slate-200 rounded-xl bg-white shadow-2xs">
          <span className="block text-lg font-bold text-slate-800">{summary?.skipped || 0}</span>
          <span className="text-[10px] uppercase tracking-wide font-bold text-slate-400">Skipped</span>
        </div>
      </div>
    </div>
  );
};