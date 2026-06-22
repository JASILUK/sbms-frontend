import React from "react";
import { formatTime12Hour, calculateShiftDuration, formatDurationText } from "../../utils/shiftHelpers";
import { ShiftRowActions } from "./ShiftRowActions";

export const ShiftCard = ({ shift, onView, onEdit, onSetDefault, onDeactivate, onActivate }) => {
  const netHours = calculateShiftDuration(shift.start_time, shift.end_time, shift.break_duration_minutes);

  return (
    <div className="block lg:hidden rounded-xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4 hover:border-slate-300 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <div className="max-w-[80%]">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-bold text-slate-900 text-base truncate">{shift.name}</h4>
            {shift.is_default && (
              <span className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-bold rounded-sm bg-amber-50 border border-amber-200 text-amber-800">
                Default
              </span>
            )}
          </div>
          {shift.description && (
            <p className="text-xs text-slate-400 mt-1 line-clamp-2">{shift.description}</p>
          )}
        </div>
        <ShiftRowActions
          shift={shift}
          onView={onView}
          onEdit={onEdit}
          onSetDefault={onSetDefault}
          onDeactivate={onDeactivate}
          onActivate={onActivate}
        />
      </div>

      <div className="grid grid-cols-2 gap-y-3 gap-x-2 border-t border-b border-slate-100 py-3 text-xs">
        <div>
          <span className="text-slate-400 font-medium block uppercase tracking-wider text-[10px]">Classification</span>
          <span className={`inline-flex items-center px-2 py-0.5 text-[11px] font-semibold rounded-full mt-1 ${
            shift.shift_type === "night" ? "bg-indigo-50 text-indigo-700" : "bg-slate-100 text-slate-700"
          }`}>
            {shift.shift_type}
          </span>
        </div>
        <div>
          <span className="text-slate-400 font-medium block uppercase tracking-wider text-[10px]">Operational Status</span>
          <span className={`inline-flex items-center px-2 py-0.5 text-[11px] font-semibold rounded-full mt-1 ${
            shift.is_active ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
          }`}>
            {shift.is_active ? "Active" : "Inactive"}
          </span>
        </div>
        <div className="col-span-2">
          <span className="text-slate-400 font-medium block uppercase tracking-wider text-[10px]">Core Range & Net Volume</span>
          <span className="text-slate-800 font-semibold block mt-0.5 text-sm">
            {formatTime12Hour(shift.start_time)} – {formatTime12Hour(shift.end_time)}
          </span>
          <span className="text-xs font-medium text-slate-400 mt-0.5 block">
            Net Processing Value: {formatDurationText(netHours)} (Unpaid Break: {shift.break_duration_minutes}m)
          </span>
        </div>
      </div>
    </div>
  );
};