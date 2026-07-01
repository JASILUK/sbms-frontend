import React from "react";
import PropTypes from "prop-types";
import { ATTENDANCE_STATUS, ATTENDANCE_THEME } from "../../../constants/hrAttendance";

function StatMetricButton({ title, count, isActive, onClick, statusKey }) {
  const theme = ATTENDANCE_THEME[statusKey] || {
    color: 'text-slate-700 dark:text-slate-300',
    bg: 'bg-slate-50 dark:bg-slate-900',
    border: 'border-slate-200 dark:border-slate-800'
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      className={`p-4 rounded-xl border text-left bg-white dark:bg-slate-950 shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 select-none flex flex-col justify-between min-h-[96px] ${
        isActive 
          ? `border-indigo-600 dark:border-indigo-400 ring-2 ring-indigo-600/20` 
          : `border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700`
      }`}
    >
      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">{title}</span>
      <div className="flex items-baseline justify-between w-full mt-2">
        <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-mono">{count}</span>
        <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold uppercase ${theme.bg} ${theme.color}`}>
          {statusKey.substring(0, 7)}
        </span>
      </div>
    </button>
  );
}

StatMetricButton.propTypes = {
  title: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  isActive: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  statusKey: PropTypes.string.isRequired,
};

export default function StatisticsStrip({ summaryStats, currentActiveStatus, onStatusSelect }) {
  if (!summaryStats) return null;

  return (
    <section className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full" aria-label="Quick metrics filter configuration controls">
      <StatMetricButton 
        title="Present" 
        count={summaryStats.present || 0} 
        statusKey={ATTENDANCE_STATUS.PRESENT} 
        isActive={currentActiveStatus === ATTENDANCE_STATUS.PRESENT}
        onClick={() => onStatusSelect(currentActiveStatus === ATTENDANCE_STATUS.PRESENT ? "" : ATTENDANCE_STATUS.PRESENT)}
      />
      <StatMetricButton 
        title="Absent" 
        count={summaryStats.absent || 0} 
        statusKey={ATTENDANCE_STATUS.ABSENT} 
        isActive={currentActiveStatus === ATTENDANCE_STATUS.ABSENT}
        onClick={() => onStatusSelect(currentActiveStatus === ATTENDANCE_STATUS.ABSENT ? "" : ATTENDANCE_STATUS.ABSENT)}
      />
      <StatMetricButton 
        title="Late Arrival" 
        count={summaryStats.late || 0} 
        statusKey={ATTENDANCE_STATUS.HALF_DAY} 
        isActive={currentActiveStatus === "LATE"}
        onClick={() => onStatusSelect(currentActiveStatus === "LATE" ? "" : "LATE")}
      />
      <StatMetricButton 
        title="Needs Review" 
        count={summaryStats.review_required || 0} 
        statusKey={ATTENDANCE_STATUS.REVIEW_REQUIRED} 
        isActive={currentActiveStatus === ATTENDANCE_STATUS.REVIEW_REQUIRED}
        onClick={() => onStatusSelect(currentActiveStatus === ATTENDANCE_STATUS.REVIEW_REQUIRED ? "" : ATTENDANCE_STATUS.REVIEW_REQUIRED)}
      />
    </section>
  );
}

StatisticsStrip.propTypes = {
  summaryStats: PropTypes.object,
  currentActiveStatus: PropTypes.string.isRequired,
  onStatusSelect: PropTypes.func.isRequired,
};