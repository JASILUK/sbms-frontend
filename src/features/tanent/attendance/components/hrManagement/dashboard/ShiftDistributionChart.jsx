// attendance/components/hrManagement/dashboard/ShiftDistributionChart.jsx
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

// ─── Status Badge ─────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const config = {
    Healthy: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' },
    Warning: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500' },
    Critical: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', dot: 'bg-rose-500' },
    'Low Coverage': { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', dot: 'bg-orange-400' },
  };
  const c = config[status] || config.Healthy;

  return (
    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-medium ${c.bg} ${c.text} border ${c.border} opacity-0 group-hover:opacity-100 transition-opacity duration-200`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {status}
    </span>
  );
};

StatusBadge.propTypes = { status: PropTypes.string.isRequired };

// ─── Shift Row ────────────────────────────────────────────────
const ShiftRow = React.memo(({ shift }) => {
  const total = shift.employees_count || 0;
  const active = (shift.working_count || 0) + (shift.checked_out_count || 0);
  
  // Calculate percentages safely handling division by zero
  const progressPct = total > 0 ? Math.min(100, (active / total) * 100) : 0;
  const absentPct = total > 0 ? Math.min(100, ((shift.absent_count || 0) / total) * 100) : 0;
  const leavePct = total > 0 ? Math.min(100, ((shift.leave_count || 0) / total) * 100) : 0;

  // Determine status thresholds
  let status = 'Healthy';
  if (total > 0) {
    if ((shift.absent_count || 0) > total * 0.15) status = 'Critical';
    else if ((shift.late_count || 0) > total * 0.1) status = 'Warning';
    else if (progressPct < 70 && total > (shift.leave_count || 0)) status = 'Low Coverage';
  }

  return (
    <div className="group relative rounded-xl border border-transparent hover:border-slate-200 hover:bg-slate-50/80 transition-all duration-200 cursor-default p-3 -mx-1">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2.5">
          <div className={`w-2 h-2 rounded-full ring-2 ring-white shadow-sm ${
            status === 'Critical' ? 'bg-rose-500' : 
            status === 'Warning' ? 'bg-amber-500' : 
            status === 'Low Coverage' ? 'bg-orange-400' : 'bg-emerald-500'
          }`} />
          <span className="text-sm font-semibold text-slate-800 group-hover:text-indigo-700 transition-colors">
            {shift.shift_name}
          </span>
          <StatusBadge status={status} />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-slate-400 tabular-nums">
            <span className="text-slate-700 font-semibold">{active}</span> / {total}
          </span>
          <span className="text-[10px] font-bold text-slate-300 group-hover:text-indigo-500 transition-colors">
            {Math.round(progressPct)}%
          </span>
        </div>
      </div>

      {/* Segmented Progress Bar */}
      <div className="relative w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200/40">
        {/* Active Working Stack */}
        <div className="absolute top-0 left-0 h-full rounded-l-full transition-all duration-700 ease-out group-hover:brightness-110"
             style={{ 
               width: `${progressPct}%`, 
               background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)' 
             }}>
          <div className="absolute inset-0 bg-white/20 animate-shimmer" />
        </div>
        {/* Leave Segment */}
        {leavePct > 0 && (
          <div className="absolute top-0 h-full bg-sky-400/60 transition-all duration-700" 
               style={{ left: `${progressPct}%`, width: `${leavePct}%` }} />
        )}
        {/* Absent Segment */}
        {absentPct > 0 && (
          <div className="absolute top-0 h-full bg-rose-400/50 rounded-r-full transition-all duration-700" 
               style={{ left: `${progressPct + leavePct}%`, width: `${absentPct}%` }} />
        )}
      </div>

      {/* Metrics Row */}
      <div className="flex justify-between mt-2 text-[11px]">
        <div className="flex gap-3">
          <span className="flex items-center gap-1 text-slate-400 group-hover:text-amber-600 transition-colors">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            Late: <span className="font-mono font-semibold text-slate-600 group-hover:text-amber-600 tabular-nums">{shift.late_count || 0}</span>
          </span>
          <span className="flex items-center gap-1 text-slate-400 group-hover:text-sky-600 transition-colors">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            Leave: <span className="font-mono font-semibold text-slate-600 group-hover:text-sky-600 tabular-nums">{shift.leave_count || 0}</span>
          </span>
          <span className="flex items-center gap-1 text-slate-400 group-hover:text-rose-500 transition-colors">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
            Absent: <span className="font-mono font-semibold text-slate-600 group-hover:text-rose-600 tabular-nums">{shift.absent_count || 0}</span>
          </span>
        </div>
        <span className="text-slate-400 group-hover:text-indigo-400 transition-colors">
          Out: <span className="font-mono font-semibold tabular-nums text-slate-500">{shift.checked_out_count || 0}</span>
        </span>
      </div>

      {/* Hover Tooltip Panel */}
      <div className="absolute left-full top-0 ml-3 w-56 bg-white rounded-xl shadow-xl border border-slate-200/80 p-4 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-x-2 group-hover:translate-x-0 pointer-events-none">
        <div className="text-xs font-bold text-slate-800 mb-2">{shift.shift_name}</div>
        <div className="space-y-2">
          <div className="flex justify-between text-[11px]">
            <span className="text-slate-500">Coverage</span>
            <span className={`font-mono font-semibold ${progressPct >= 80 ? 'text-emerald-600' : progressPct >= 50 ? 'text-amber-600' : 'text-rose-600'}`}>
              {Math.round(progressPct)}%
            </span>
          </div>
          <div className="flex justify-between text-[11px]">
            <span className="text-slate-500">Currently Working</span>
            <span className="font-mono font-semibold text-slate-700">{shift.working_count || 0}</span>
          </div>
          <div className="flex justify-between text-[11px]">
            <span className="text-slate-500">Checked Out</span>
            <span className="font-mono font-semibold text-slate-700">{shift.checked_out_count || 0}</span>
          </div>
          <div className="h-px bg-slate-100 my-2" />
          <div className="flex justify-between text-[11px]">
            <span className="text-amber-600">Late</span>
            <span className="font-mono font-semibold text-amber-600">{shift.late_count || 0}</span>
          </div>
          <div className="flex justify-between text-[11px]">
            <span className="text-sky-600">On Leave</span>
            <span className="font-mono font-semibold text-sky-600">{shift.leave_count || 0}</span>
          </div>
          <div className="flex justify-between text-[11px]">
            <span className="text-rose-500">Absent</span>
            <span className="font-mono font-semibold text-rose-500">{shift.absent_count || 0}</span>
          </div>
        </div>
        <div className="absolute -left-1.5 top-6 w-3 h-3 bg-white border-l border-b border-slate-200/80 rotate-45" />
      </div>
    </div>
  );
});

ShiftRow.displayName = 'ShiftRow';
ShiftRow.propTypes = {
  shift: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
};

// ─── Main Component ───────────────────────────────────────────
export const ShiftDistributionChart = React.memo(({ shifts = [], lastUpdated }) => {
  const totals = useMemo(() => {
    const totalShifts = shifts.length;
    const totalEmployees = shifts.reduce((s, sh) => s + (sh.employees_count || 0), 0);
    const totalActive = shifts.reduce((s, sh) => s + (sh.working_count || 0) + (sh.checked_out_count || 0), 0);
    const totalLate = shifts.reduce((s, sh) => s + (sh.late_count || 0), 0);
    const totalLeave = shifts.reduce((s, sh) => s + (sh.leave_count || 0), 0);
    const totalAbsent = shifts.reduce((s, sh) => s + (sh.absent_count || 0), 0);
    return { totalShifts, totalEmployees, totalActive, totalLate, totalLeave, totalAbsent };
  }, [shifts]);

  if (!shifts.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm min-h-[360px] flex flex-col items-center justify-center text-center space-y-4 animate-fade-in">
        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100">
          <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-700">No Active Shifts</p>
          <p className="text-xs text-slate-400 mt-1">No shifts are currently assigned to the roster.</p>
        </div>
      </div>
    );
  }

  const { totalShifts, totalEmployees, totalActive, totalLate, totalLeave, totalAbsent } = totals;
  const coveragePct = totalEmployees > 0 ? Math.round((totalActive / totalEmployees) * 100) : 0;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="px-6 pt-5 pb-4 border-b border-slate-100">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Shift Deployment Metrics</h3>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1 h-1 rounded-full bg-emerald-500 mr-1 animate-pulse" />
                Live
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">Assigned profile distributions across {totalShifts} active shifts</p>
          </div>
          <div className="flex items-center gap-4 text-right">
            <div>
              <div className="text-lg font-bold text-slate-900 tabular-nums">{totalActive}</div>
              <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">Active</div>
            </div>
            <div className="w-px h-8 bg-slate-200" />
            <div>
              <div className="text-lg font-bold text-slate-900 tabular-nums">{totalEmployees}</div>
              <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">Total</div>
            </div>
          </div>
        </div>

        {/* Summary Chips */}
        <div className="flex flex-wrap gap-2 mt-3">
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-50 border border-amber-200/60 text-[10px] font-semibold text-amber-700">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01"/>
            </svg>
            {totalLate} Late
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-sky-50 border border-sky-200/60 text-[10px] font-semibold text-sky-700">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            {totalLeave} Leave
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-rose-50 border border-rose-200/60 text-[10px] font-semibold text-rose-700">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
            {totalAbsent} Absent
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-indigo-50 border border-indigo-200/60 text-[10px] font-semibold text-indigo-700">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
            {coveragePct}% Coverage
          </span>
        </div>
      </div>

      {/* Shift List Container */}
      <div className="px-5 py-3 max-h-[320px] overflow-y-auto scrollbar-thin">
        <div className="space-y-1">
          {shifts.map((shift, idx) => (
            <ShiftRow key={shift.shift_id || idx} shift={shift} index={idx} />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-3 bg-slate-50/60 border-t border-slate-100 flex justify-between items-center">
        <span className="text-[10px] text-slate-400 font-medium">
          Last updated: <span className="font-mono">{lastUpdated || new Date().toLocaleTimeString()}</span>
        </span>
        <span className="text-[10px] text-slate-400">{shifts.length} shifts · {totalEmployees} employees</span>
      </div>
    </div>
  );
});

ShiftDistributionChart.displayName = 'ShiftDistributionChart';
ShiftDistributionChart.propTypes = {
  shifts: PropTypes.arrayOf(PropTypes.shape({
    shift_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    shift_name: PropTypes.string,
    employees_count: PropTypes.number,
    working_count: PropTypes.number,
    checked_out_count: PropTypes.number,
    late_count: PropTypes.number,
    leave_count: PropTypes.number,
    absent_count: PropTypes.number,
  })),
  lastUpdated: PropTypes.string,
};

ShiftDistributionChart.defaultProps = {
  shifts: [],
  lastUpdated: null,
};