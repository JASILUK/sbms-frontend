import React from 'react';
import PropTypes from 'prop-types';
import { ATTENDANCE_STATUS, ATTENDANCE_THEME } from '../../../constants/hrAttendance';

function SummaryCard({ title, count, statusKey, percentage }) {
  const theme = ATTENDANCE_THEME[statusKey] || {
    color: 'text-slate-700 dark:text-slate-300',
    bg: 'bg-slate-50 dark:bg-slate-900',
    border: 'border-slate-200 dark:border-slate-800'
  };

  return (
    <article className={`bg-white dark:bg-slate-950 p-5 rounded-2xl border ${theme.border} shadow-xs hover:shadow-md transition-all duration-200 group flex flex-col justify-between min-h-[120px]`}>
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{title}</h3>
        <span className={`p-1.5 rounded-xl ${theme.bg} ${theme.color} group-hover:scale-105 transition-transform`}>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354l1.108 2.246 2.479.36-1.794 1.749.424 2.469L12 9.923l-2.217 1.165.424-2.469-1.794-1.749 2.479-.36L12 4.354z" />
          </svg>
        </span>
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-mono">{count}</span>
        {percentage !== undefined && (
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 font-mono">({percentage}%)</span>
        )}
      </div>
    </article>
  );
}

SummaryCard.propTypes = {
  title: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  statusKey: PropTypes.string.isRequired,
  percentage: PropTypes.number,
};

export default function SummaryGrid({ metrics }) {
  if (!metrics) return null;

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" aria-label="Quantitative aggregate indicators grid">
      <SummaryCard title="Total Headcount" count={metrics.total_employees || 0} statusKey={ATTENDANCE_STATUS.WEEKEND} />
      <SummaryCard title="Present Workforce" count={metrics.present || 0} statusKey={ATTENDANCE_STATUS.PRESENT} percentage={metrics.company_attendance_percentage} />
      <SummaryCard title="Currently Working" count={metrics.currently_working || 0} statusKey={ATTENDANCE_STATUS.HOLIDAY} />
      <SummaryCard title="Pending Review" count={metrics.needs_review || 0} statusKey={ATTENDANCE_STATUS.REVIEW_REQUIRED} />
    </section>
  );
}

SummaryGrid.propTypes = {
  metrics: PropTypes.object,
};