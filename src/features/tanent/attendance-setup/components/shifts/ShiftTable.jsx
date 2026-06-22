import React from "react";
import { formatTime12Hour, calculateShiftDuration, formatDurationText } from "../../utils/shiftHelpers";
import { ShiftRowActions } from "./ShiftRowActions";

export const ShiftTable = ({ shifts = [], onView, onEdit, onSetDefault, onDeactivate, onActivate }) => {
  return (
    <div className="hidden lg:block border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500">
          <tr>
            <th className="px-6 py-3.5">Work Pattern Profile</th>
            <th className="px-6 py-3.5">Classification</th>
            <th className="px-6 py-3.5">Core Active Range</th>
            <th className="px-6 py-3.5">Unpaid Break</th>
            <th className="px-6 py-3.5">Status</th>
            <th className="px-6 py-3.5">Policy Target</th>
            <th className="px-6 py-3.5 text-right pr-8">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-sm text-slate-600">
          {shifts.map((shift) => {
            // FIXED: Fallback missing field down to 0 to safeguard calculation loops
            const breakMinutes = shift.break_duration_minutes ?? 0;
            const netHours = calculateShiftDuration(shift.start_time, shift.end_time, breakMinutes);
            
            return (
              // FIXED: Use shift.public_id for the absolute unique key value!
              <tr key={shift.public_id} className="hover:bg-slate-50/60 transition-colors">
                <td className="px-6 py-4 max-w-xs">
                  <span className="font-semibold text-slate-900 block truncate">{shift.name}</span>
                  {shift.description && (
                    <span className="text-xs text-slate-400 block truncate mt-0.5">{shift.description}</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-full border capitalize ${
                    shift.shift_type === "night" 
                      ? "bg-indigo-50 border-indigo-100 text-indigo-700" 
                      : "bg-slate-100 border-slate-200 text-slate-700"
                  }`}>
                    {shift.shift_type}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="font-medium text-slate-800 block">
                    {formatTime12Hour(shift.start_time)} – {formatTime12Hour(shift.end_time)}
                  </span>
                  <span className="text-xs text-slate-400 block mt-0.5">
                    Net: {formatDurationText(netHours)}
                  </span>
                </td>
                <td className="px-6 py-4 font-medium text-slate-700">
                  {breakMinutes} min
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-full ${
                    shift.is_active ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
                  }`}>
                    {shift.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {shift.is_default ? (
                    <span className="inline-flex items-center px-2 py-0.5 text-xs font-bold rounded-md bg-amber-50 border border-amber-200 text-amber-800 shadow-2xs">
                      Default
                    </span>
                  ) : (
                    <span className="text-slate-300">—</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right pr-6">
                  <ShiftRowActions
                    shift={shift}
                    onView={onView}
                    onEdit={onEdit}
                    onSetDefault={onSetDefault}
                    onDeactivate={onDeactivate}
                    onActivate={onActivate}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};