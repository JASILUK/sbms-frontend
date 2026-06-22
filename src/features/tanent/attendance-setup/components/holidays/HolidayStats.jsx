import React from "react";
import { Calendar, Receipt, ShieldAlert, Sparkles } from "lucide-react";

export const HolidayStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
      <div className="rounded-xl border border-slate-200 bg-white p-5 flex items-center gap-4 shadow-xs">
        <div className="p-3 bg-slate-50 text-slate-500 rounded-xl border border-slate-100">
          <Calendar className="h-5 w-5" />
        </div>
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Tracked</span>
          <span className="text-xl font-bold text-slate-900">{stats?.total ?? 0} Holidays</span>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 flex items-center gap-4 shadow-xs">
        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
          <Receipt className="h-5 w-5" />
        </div>
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Paid Allocation</span>
          <span className="text-xl font-bold text-slate-900">{stats?.paid ?? 0} Fully Paid</span>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 flex items-center gap-4 shadow-xs">
        <div className="p-3 bg-amber-50 text-amber-600 rounded-xl border border-amber-100">
          <ShieldAlert className="h-5 w-5" />
        </div>
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Half-Day Metrics</span>
          <span className="text-xl font-bold text-slate-900">{stats?.half_day ?? 0} Half Days</span>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 flex items-center gap-4 shadow-xs">
        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Upcoming Count</span>
          <span className="text-xl font-bold text-slate-900">{stats?.upcoming ?? 0} Operational</span>
        </div>
      </div>
    </div>
  );
};