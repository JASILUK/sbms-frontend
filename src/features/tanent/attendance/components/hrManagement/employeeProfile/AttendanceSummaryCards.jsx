import React from "react";
import PropTypes from "prop-types";
import { ATTENDANCE_STATUS, ATTENDANCE_THEME } from "../../../constants/hrAttendance";

function KPIStatBox({ label, val, statusKey, suffix = "" }) {
  const theme = ATTENDANCE_THEME[statusKey] || { color: "text-slate-700", bg: "bg-slate-50" };

  return (
    <div className="bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-200/60 dark:border-slate-800/60 shadow-xs flex flex-col justify-between min-h-[84px] hover:shadow-md transition-shadow">
      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">{label}</span>
      <div className="flex items-baseline justify-between w-full mt-1">
        <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white font-mono">
          {val}{suffix}
        </span>
        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider ${theme.bg} ${theme.color}`}>
          {statusKey.substring(0, 6)}
        </span>
      </div>
    </div>
  );
}

KPIStatBox.propTypes = {
  label: PropTypes.string.isRequired,
  val: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  statusKey: PropTypes.string.isRequired,
  suffix: PropTypes.string,
};

export default function AttendanceSummaryCards({ summary }) {
  if (!summary) return null;

  return (
    <section className="grid grid-cols-2 lg:grid-cols-6 gap-3 w-full" aria-label="Quantitative aggregate period statistics summary border">
      <KPIStatBox label="Attendance Ratio" val={summary.attendance_percentage} statusKey={ATTENDANCE_STATUS.PRESENT} suffix="%" />
      <KPIStatBox label="Present Count" val={summary.present} statusKey={ATTENDANCE_STATUS.PRESENT} />
      <KPIStatBox label="Absent Count" val={summary.absent} statusKey={ATTENDANCE_STATUS.ABSENT} />
      <KPIStatBox label="Late Arrivals" val={summary.late_days} statusKey={ATTENDANCE_STATUS.HALF_DAY} />
      <KPIStatBox label="Total Duration" val={summary.total_work_hours} statusKey={ATTENDANCE_STATUS.HOLIDAY} suffix="h" />
      <KPIStatBox label="Review Exceptions" val={summary.needs_review} statusKey={ATTENDANCE_STATUS.REVIEW_REQUIRED} />
    </section>
  );
}

AttendanceSummaryCards.propTypes = {
  summary: PropTypes.object,
};