// # attendance/components/hrManagement/dashboard/ShiftDistributionCards.jsx

import React from 'react';
import PropTypes from 'prop-types';

export const ShiftDistributionCards = React.memo(({ shifts, activeShift, onShiftClick }) => {
  if (!shifts || shifts.length === 0) {
    return (
      <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-8 text-center">
        <p className="text-sm text-slate-400">No shift data available.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {shifts.map((shift) => {
        const total = shift.employees_count || 1;
        const working = shift.working_count || 0;
        const attendancePct = Math.round((working / total) * 100);
        const isActive = activeShift === shift.shift_id;

        return (
          <button
            key={shift.shift_id}
            type="button"
            onClick={() => onShiftClick(shift.shift_id)}
            className={`text-left bg-white border rounded-2xl p-4 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 ${
              isActive ? 'border-indigo-400 ring-2 ring-indigo-100' : 'border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-slate-800">{shift.shift_name}</h4>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                attendancePct >= 80 ? 'bg-emerald-50 text-emerald-700' :
                attendancePct >= 50 ? 'bg-amber-50 text-amber-700' :
                'bg-rose-50 text-rose-700'
              }`}>
                {attendancePct}%
              </span>
            </div>

            {/* Mini metrics grid */}
            <div className="grid grid-cols-4 gap-2 mb-3">
              <div className="text-center">
                <p className="text-lg font-black text-slate-900">{shift.employees_count || 0}</p>
                <p className="text-[9px] font-bold uppercase text-slate-400 tracking-wide">Total</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-black text-emerald-600">{shift.working_count || 0}</p>
                <p className="text-[9px] font-bold uppercase text-slate-400 tracking-wide">Working</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-black text-amber-600">{shift.break_count || 0}</p>
                <p className="text-[9px] font-bold uppercase text-slate-400 tracking-wide">Break</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-black text-blue-600">{shift.checked_out_count || 0}</p>
                <p className="text-[9px] font-bold uppercase text-slate-400 tracking-wide">Out</p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${attendancePct}%` }}
              />
            </div>

            {/* Bottom row */}
            <div className="flex items-center justify-between mt-2 text-[10px] text-slate-400 font-medium">
              <span>Late: {shift.late_count || 0}</span>
              <span>Absent: {shift.absent_count || 0}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
});

ShiftDistributionCards.displayName = 'ShiftDistributionCards';
ShiftDistributionCards.propTypes = {
  shifts: PropTypes.array,
  activeShift: PropTypes.number,
  onShiftClick: PropTypes.func.isRequired,
};