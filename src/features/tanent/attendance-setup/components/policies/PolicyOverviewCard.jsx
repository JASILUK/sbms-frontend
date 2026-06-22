import React from "react";
import { Clock, ShieldCheck, Hourglass, Zap } from "lucide-react";

export const PolicyOverviewCard = ({ policy }) => {
  const formatMinutesToHours = (mins) => {
    if (!mins) return "0 hrs";
    const hrs = mins / 60;
    return `${Number(hrs.toFixed(2))} hrs/day`;
  };

  return (
    <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 flex items-center gap-4">
        <div className="p-3 bg-white border border-slate-200 rounded-xl text-slate-500 shadow-sm">
          <Clock className="h-5 w-5" />
        </div>
        <div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Required Runtime</span>
          <span className="text-base font-bold text-slate-800">{formatMinutesToHours(policy?.required_work_minutes)}</span>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 flex items-center gap-4">
        <div className="p-3 bg-white border border-slate-200 rounded-xl text-slate-500 shadow-sm">
          <Hourglass className="h-5 w-5" />
        </div>
        <div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Half-Day Threshold</span>
          <span className="text-base font-bold text-slate-800">{policy?.half_day_below_minutes ? `${policy.half_day_below_minutes} mins` : "Not Configured"}</span>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 flex items-center gap-4">
        <div className="p-3 bg-white border border-slate-200 rounded-xl text-slate-500 shadow-sm">
          <Zap className="h-5 w-5" />
        </div>
        <div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Late Arrival Limit</span>
          <span className="text-base font-bold text-slate-800">{policy?.late_after_minutes} mins grace</span>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 flex items-center gap-4">
        <div className="p-3 bg-white border border-slate-200 rounded-xl text-slate-500 shadow-sm">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Overtime Rule</span>
          <span className={`text-base font-bold ${policy?.overtime_enabled ? "text-indigo-600" : "text-slate-500"}`}>
            {policy?.overtime_enabled ? "Active Tracking" : "Disabled"}
          </span>
        </div>
      </div>
    </div>
  );
};