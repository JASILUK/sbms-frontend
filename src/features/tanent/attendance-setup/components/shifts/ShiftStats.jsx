import React from "react";
import { Calendar, CheckCircle2, Moon, Star } from "lucide-react";

export const ShiftStats = ({ templates = [] }) => {
  const stats = React.useMemo(() => {
    const total = templates.length;
    const active = templates.filter((t) => t.is_active).length;
    const night = templates.filter((t) => t.shift_type === "night").length;
    const defaultShift = templates.find((t) => t.is_default)?.name || "Not Configured";

    return { total, active, night, defaultShift };
  }, [templates]);

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Operational Shift Analytics">
      <div className="rounded-xl border border-slate-200 bg-white p-5 flex items-center gap-4 shadow-2xs">
        <div className="p-3 bg-slate-50 text-slate-600 rounded-xl border border-slate-100">
          <Calendar className="h-5 w-5" />
        </div>
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Tracked</span>
          <span className="text-xl font-bold text-slate-900">{stats.total} {stats.total === 1 ? "Template" : "Templates"}</span>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 flex items-center gap-4 shadow-2xs">
        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
          <CheckCircle2 className="h-5 w-5" />
        </div>
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Active Templates</span>
          <span className="text-xl font-bold text-slate-900">{stats.active} Operating</span>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 flex items-center gap-4 shadow-2xs">
        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100">
          <Moon className="h-5 w-5" />
        </div>
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Night Logistics</span>
          <span className="text-xl font-bold text-slate-900">{stats.night} Nocturnal</span>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 flex items-center gap-4 shadow-2xs">
        <div className="p-3 bg-amber-50 text-amber-600 rounded-xl border border-amber-100">
          <Star className="h-5 w-5" />
        </div>
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Default Pattern</span>
          <span className="text-sm font-bold text-slate-900 truncate max-w-[140px] block" title={stats.defaultShift}>{stats.defaultShift}</span>
        </div>
      </div>
    </section>
  );
};