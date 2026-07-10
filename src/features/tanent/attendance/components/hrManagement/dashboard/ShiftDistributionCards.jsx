import React from 'react';
import PropTypes from 'prop-types';

export const ShiftDistributionCards = React.memo(({ shifts, activeShift, onShiftClick }) => {
  if (!shifts || shifts.length === 0) {
    return (
      <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-10 text-center animate-fade-in">
        <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
          <svg className="w-6 h-6 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-sm font-medium text-slate-400">No shift data available</p>
      </div>
    );
  }

  return (
    <div className="relative group">
      <div className="flex gap-4 overflow-x-auto pb-3 px-1 -mx-1 snap-x snap-mandatory scrollbar-thin">
        {shifts.map((shift, index) => {
          const total = shift.employees_count || 0;
          const working = shift.working_count || 0;
          // Calculate realistic attendance percentage safely
          const attendancePct = total > 0 ? Math.round((working / total) * 100) : 0;
          
          const isActive = activeShift === shift.shift_id;
          const isHealthy = attendancePct >= 80;
          const isWarning = attendancePct >= 50 && attendancePct < 80;

          const statusColor = isHealthy ? 'emerald' : isWarning ? 'amber' : 'rose';
          const statusBg = {
            emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
            amber: 'bg-amber-50 text-amber-700 ring-amber-600/20',
            rose: 'bg-rose-50 text-rose-700 ring-rose-600/20',
          }[statusColor];

          return (
            <button
              key={shift.shift_id}
              type="button"
              onClick={() => onShiftClick(shift.shift_id)}
              style={{ animationDelay: `${index * 80}ms` }}
              className={`snap-start shrink-0 w-[300px] text-left bg-white border rounded-2xl p-5 shadow-sm transition-all duration-300 ease-out
                hover:shadow-lg hover:-translate-y-1 hover:border-slate-300
                focus:outline-none focus:ring-2 focus:ring-indigo-500/30
                animate-fade-in-up
                ${isActive ? 'border-indigo-400 ring-2 ring-indigo-100 shadow-md' : 'border-slate-200'}
              `}
            >
              {/* Header Details */}
              <div className="flex items-start justify-between mb-4">
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-slate-800 truncate">{shift.shift_name}</h4>
                  <p className="text-[10px] font-medium text-slate-400 mt-0.5">
                    {shift.start_time && shift.end_time ? `${shift.start_time} – ${shift.end_time}` : 'Timing Pending'}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {shift.absent_count > 0 && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 text-[9px] font-bold ring-1 ring-rose-600/10">
                      ABS
                    </span>
                  )}
                  {shift.leave_count > 0 && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-violet-50 text-violet-700 text-[9px] font-bold ring-1 ring-violet-600/10">
                      LV
                    </span>
                  )}
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ring-1 ${statusBg}`}>
                    {attendancePct}%
                  </span>
                </div>
              </div>

              {/* Core Distribution Metrics Grid */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[
                  { label: 'Total', value: shift.employees_count, color: 'text-slate-900', bg: 'bg-slate-50' },
                  { label: 'Working', value: shift.working_count, color: 'text-emerald-600', bg: 'bg-emerald-50/60' },
                  { label: 'Break', value: shift.break_count, color: 'text-amber-600', bg: 'bg-amber-50/60' },
                  { label: 'Leave', value: shift.leave_count, color: 'text-violet-600', bg: 'bg-violet-50/60' },
                  { label: 'Absent', value: shift.absent_count, color: 'text-rose-600', bg: 'bg-rose-50/60' },
                  { label: 'Out', value: shift.checked_out_count, color: 'text-blue-600', bg: 'bg-blue-50/60' },
                ].map((metric) => (
                  <div key={metric.label} className={`${metric.bg} rounded-xl py-2 px-1 text-center transition-transform hover:scale-105`}>
                    <p className={`text-sm font-black ${metric.color} leading-none`}>{metric.value || 0}</p>
                    <p className="text-[9px] font-bold uppercase text-slate-400 tracking-wider mt-1">{metric.label}</p>
                  </div>
                ))}
              </div>

              {/* Attendance Bar */}
              <div className="relative w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ease-out ${
                    isHealthy ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' :
                    isWarning ? 'bg-gradient-to-r from-amber-400 to-amber-500' :
                    'bg-gradient-to-r from-rose-400 to-rose-500'
                  }`}
                  style={{ width: `${attendancePct}%` }}
                />
              </div>

              {/* Bottom Exception Flags */}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-2.5">
                  <span className="flex items-center gap-1 text-[10px] font-semibold text-amber-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    Late ({shift.late_count || 0})
                  </span>
                  <span className="flex items-center gap-1 text-[10px] font-semibold text-rose-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                    Absent ({shift.absent_count || 0})
                  </span>
                  <span className="flex items-center gap-1 text-[10px] font-semibold text-violet-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                    Leave ({shift.leave_count || 0})
                  </span>
                </div>
                <span className="text-[9px] font-medium text-slate-400">
                  {shift.not_started_count || 0} left
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Overflow Scroll Hint indicator */}
      <div className="absolute right-0 top-0 bottom-3 w-12 bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none flex items-center justify-end pr-2 opacity-100 transition-opacity group-hover:opacity-0">
        <svg className="w-5 h-5 text-slate-300 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );
});

ShiftDistributionCards.displayName = 'ShiftDistributionCards';

ShiftDistributionCards.propTypes = {
  shifts: PropTypes.arrayOf(
    PropTypes.shape({
      shift_id: PropTypes.number.isRequired,
      shift_name: PropTypes.string.isRequired,
      employees_count: PropTypes.number,
      working_count: PropTypes.number,
      break_count: PropTypes.number,
      checked_out_count: PropTypes.number,
      leave_count: PropTypes.number,
      absent_count: PropTypes.number,
      late_count: PropTypes.number,
      start_time: PropTypes.string,
      end_time: PropTypes.string,
      not_started_count: PropTypes.number,
    })
  ),
  activeShift: PropTypes.number,
  onShiftClick: PropTypes.func.isRequired,
};