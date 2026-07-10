// # attendance/components/hrManagement/dashboard/DashboardSummaryCards.jsx (CORRECTED)

import React from 'react';
import PropTypes from 'prop-types';

const CARD_CONFIG = [
  { key: 'total_employees', label: 'Total Headcount', statusKey: null, color: 'slate' },
  { key: 'currently_working', label: 'Active Working', statusKey: 'WORKING', color: 'emerald' },
  { key: 'on_break', label: 'On Break', statusKey: 'BREAK', color: 'amber' },
  { key: 'checked_out', label: 'Checked Out', statusKey: 'CHECKED_OUT', color: 'blue' },
  { key: 'on_leave', label: 'On Leave', statusKey: 'ON_LEAVE', color: 'violet' },
  { key: 'absent_until_now', label: 'Absent', statusKey: 'NOT_STARTED', color: 'rose' },
];

function SummaryCard({ title, value, color, isActive, isAlert, onClick }) {
  const colorMap = {
    slate: 'border-slate-200 text-slate-800 bg-slate-50 hover:border-slate-300',
    emerald: 'border-emerald-200 text-emerald-700 bg-emerald-50 hover:border-emerald-300',
    amber: 'border-amber-200 text-amber-700 bg-amber-50 hover:border-amber-300',
    blue: 'border-blue-200 text-blue-700 bg-blue-50 hover:border-blue-300',
    rose: 'border-rose-200 text-rose-700 bg-rose-50 hover:border-rose-300',
    violet: 'border-violet-200 text-violet-700 bg-violet-50 hover:border-violet-300',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left bg-white border p-5 rounded-2xl shadow-sm flex flex-col justify-between min-h-[110px] transition-all ${
        isActive ? 'ring-2 ring-indigo-500/20 border-indigo-400' : ''
      } ${isAlert ? 'ring-2 ring-rose-500/10' : ''} ${colorMap[color] || colorMap.slate} hover:shadow-md hover:-translate-y-0.5`}
    >
      <div className="flex items-center justify-between w-full">
        <h3 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 font-sans">{title}</h3>
        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-3xl font-black font-mono tracking-tight text-slate-900">{value || 0}</span>
      </div>
    </button>
  );
}

SummaryCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.number,
  color: PropTypes.string.isRequired,
  isActive: PropTypes.bool,
  isAlert: PropTypes.bool,
  onClick: PropTypes.func,
};

export const DashboardSummaryCards = React.memo(({ summary, onCardClick, activeStatus, activeNeedsReview }) => {
  if (!summary) return null;

  // Add review card if there are reviews needed
  const cards = [...CARD_CONFIG];
  if (summary.review_required > 0) {
    cards.push({ key: 'review_required', label: 'Needs Review', statusKey: 'REVIEW_REQUIRED', color: 'rose' });
  }

  return (
    <div className="space-y-4 w-full">
      {/* Calendar Notice */}
      {(summary.is_holiday || summary.is_off_day) && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 text-xs px-4 py-3 rounded-xl font-medium flex items-center gap-2 animate-fade-in shadow-xs">
          <svg className="h-4 w-4 text-amber-600 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>
            Calendar Notice: Today is designated as a <strong>{summary.is_holiday ? "Company Holiday" : "Standard Weekend Rest Day"}</strong>. Real-time metrics are active for rostered personnel only.
          </span>
        </div>
      )}

      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 w-full" aria-label="Workforce live status indicators">
        {cards.map((card) => {
          const isActive = card.statusKey === 'REVIEW_REQUIRED'
            ? activeNeedsReview === 'true'
            : activeStatus === card.statusKey;
          const isAlert = card.key === 'absent_until_now' && (summary[card.key] || 0) > 0;

          return (
            <SummaryCard
              key={card.key}
              title={card.label}
              value={summary[card.key]}
              color={card.color}
              isActive={isActive}
              isAlert={isAlert}
              onClick={() => onCardClick?.(card.statusKey)}
            />
          );
        })}
      </section>
    </div>
  );
});

DashboardSummaryCards.displayName = "DashboardSummaryCards";
DashboardSummaryCards.propTypes = {
  summary: PropTypes.object,
  onCardClick: PropTypes.func,
  activeStatus: PropTypes.string,
  activeNeedsReview: PropTypes.string,
};