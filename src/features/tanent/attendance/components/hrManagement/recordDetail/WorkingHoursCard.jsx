import React from "react";
import PropTypes from "prop-types";

export default function WorkingHoursCard({ summary }) {
  if (!summary) return null;

  const reqHours = summary.required_work_minutes ? (summary.required_work_minutes / 60).toFixed(2) : "0.00";
  const workedHours = summary.working_hours ? summary.working_hours.toFixed(2) : "0.00";
  const breakHours = summary.break_hours ? summary.break_hours.toFixed(2) : "0.00";
  const otHours = summary.overtime_hours ? summary.overtime_hours.toFixed(2) : "0.00";
  const progressPct = Math.min(100, (parseFloat(workedHours) / (parseFloat(reqHours) || 1)) * 100);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-5">
      <h2 className="text-sm font-bold text-slate-900 tracking-tight uppercase">Working Time Analysis</h2>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-xs font-semibold text-slate-500 mb-2 font-mono">
            <span>Fulfilled Schedule</span>
            <span className="text-indigo-600">{workedHours}h / {reqHours}h Required</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200">
            <div 
              className="bg-indigo-600 h-2.5 rounded-full transition-all duration-700 ease-out" 
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs font-mono">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-col gap-1">
            <span className="text-slate-400 uppercase tracking-wider text-[10px] font-sans font-bold">Total Break</span>
            <span className="font-semibold text-slate-700 text-sm">{breakHours}h</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-col gap-1">
            <span className="text-slate-400 uppercase tracking-wider text-[10px] font-sans font-bold">Overtime</span>
            <span className="font-semibold text-emerald-600 text-sm">+{otHours}h</span>
          </div>
        </div>
      </div>
    </div>
  );
}

WorkingHoursCard.propTypes = {
  summary: PropTypes.object,
};