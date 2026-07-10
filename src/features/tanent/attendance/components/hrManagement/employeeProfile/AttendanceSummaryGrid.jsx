import React, { memo } from "react";
import {
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Briefcase,
  Zap,
  AlertTriangle,
} from "lucide-react";
import { SUMMARY_CARD_CONFIG } from "../../../constants/hrAttendance";

const ICON_MAP = {
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Briefcase,
  Zap,
  AlertTriangle,
};

const COLOR_MAP = {
  emerald: { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700", icon: "text-emerald-500" },
  rose:    { bg: "bg-rose-50",    border: "border-rose-200",    text: "text-rose-700",    icon: "text-rose-500" },
  amber:   { bg: "bg-amber-50",   border: "border-amber-200",   text: "text-amber-700",   icon: "text-amber-500" },
  violet:  { bg: "bg-violet-50",  border: "border-violet-200",  text: "text-violet-700",  icon: "text-violet-500" },
  sky:     { bg: "bg-sky-50",     border: "border-sky-200",     text: "text-sky-700",     icon: "text-sky-500" },
};

const SummaryCard = memo(({ config, value }) => {
  const colors = COLOR_MAP[config.color] || COLOR_MAP.emerald;
  const Icon = ICON_MAP[config.icon] || CheckCircle;
  const displayValue = value !== undefined && value !== null ? value : 0;

  return (
    <div className={`group bg-white rounded-xl border ${colors.border} p-5 hover:shadow-md transition-all duration-200`}>
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${colors.icon}`} strokeWidth={2} />
        </div>
        <span className={`text-3xl font-bold ${colors.text} tabular-nums tracking-tight`}>
          {typeof displayValue === "number" && config.suffix === "%"
            ? displayValue.toFixed(1)
            : displayValue}
          {config.suffix && (
            <span className="text-base font-medium text-slate-400 ml-0.5">{config.suffix}</span>
          )}
        </span>
      </div>
      <p className="text-sm font-semibold text-slate-700">{config.label}</p>
      <p className="text-xs text-slate-400 mt-0.5">{config.description}</p>
    </div>
  );
});

SummaryCard.displayName = "SummaryCard";

const AttendanceSummaryGrid = memo(({ summary }) => {
  if (!summary) return null;

  return (
    <section aria-label="Attendance summary KPIs">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {SUMMARY_CARD_CONFIG.map((config) => (
          <SummaryCard key={config.key} config={config} value={summary[config.key]} />
        ))}
      </div>
    </section>
  );
});

AttendanceSummaryGrid.displayName = "AttendanceSummaryGrid";

export default AttendanceSummaryGrid;