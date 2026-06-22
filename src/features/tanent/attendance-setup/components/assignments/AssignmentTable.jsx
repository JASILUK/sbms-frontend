import React from "react";
import { format, parseISO } from "date-fns";
// FIXED: Adjusted import targeting to resolve the standard row action utility component
import { AssignmentRowActions } from "./AssignmentRowActions";
import { Moon, Sunrise } from "lucide-react";

export const AssignmentTable = ({ assignments = [], lookupEmployee, lookupShift, onView, onEdit, onTransfer, onEnd, onDeactivate }) => {
  return (
    <div className="hidden md:block border border-slate-200 rounded-xl overflow-hidden bg-white shadow-3xs">
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500">
          <tr>
            <th className="px-6 py-3.5">Employee Profile</th>
            <th className="px-6 py-3.5">Assigned Shift Pattern</th>
            <th className="px-6 py-3.5">Effective Initialization</th>
            <th className="px-6 py-3.5">Lifecycle Boundary</th>
            <th className="px-6 py-3.5">Status</th>
            <th className="px-6 py-3.5 text-right pr-8">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-sm text-slate-600">
        {assignments.map((record) => {
            
            // 1. FIXED: Safely extract the ID from nested relation blocks or top-level row properties
            const targetEmployeeId = record.membership?.id || record.membership_id;
            const targetShiftId = record.shift?.id || record.shift_id;

            // 2. Resolve lookup references out of your context maps
            const employee = record.employee || lookupEmployee?.(targetEmployeeId);
            const shift = record.shift || lookupShift?.(targetShiftId);
            
            // 3. FIXED: Enhanced fallback matrix. 
            // If the map lookup fails, it prints "Staff Member #ID" so your UI stays readable and informative.
            const nameString = employee?.username || record.membership?.username || (targetEmployeeId ? `Staff Member #${targetEmployeeId}` : "Unknown Profile");
            const initialLetter = nameString.charAt(0).toUpperCase() || "E";

            return (
            <tr key={record.id} className="hover:bg-slate-50/50 transition-colors">
                
                {/* Employee Info Grid */}
                <td className="px-6 py-4 max-w-xs">
                <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-slate-100 text-slate-600 font-bold border border-slate-200 flex items-center justify-center text-xs shrink-0 select-none">
                    {initialLetter}
                    </div>
                    <div className="truncate">
                    <span className="font-semibold text-slate-900 block truncate">{nameString}</span>
                    <span className="text-xs text-slate-400 block truncate mt-0.5">
                        {employee?.user_email || "No contact email linked"}
                    </span>
                    </div>
                </div>
                </td>

                {/* Shift Details Cellular Group */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {shift?.is_night_shift || shift?.shift_type === "night" ? (
                      <Moon className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                    ) : (
                      <Sunrise className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                    )}
                    <div>
                      <span className="font-medium text-slate-800 block truncate max-w-[150px]">
                        {shift?.name || "Corporate Shift Pattern"}
                      </span>
                      <span className="text-xs text-slate-400 font-mono block mt-0.5">
                        {shift?.start_time?.substring(0, 5)} – {shift?.end_time?.substring(0, 5)}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Dates Metrics */}
                <td className="px-6 py-4 font-mono font-medium text-slate-700 text-xs">
                  {record.effective_from ? format(parseISO(record.effective_from), "dd MMM yyyy") : "—"}
                </td>

                <td className="px-6 py-4 font-mono text-xs">
                  {record.effective_to ? (
                    <span className="font-medium text-slate-700">
                      {format(parseISO(record.effective_to), "dd MMM yyyy")}
                    </span>
                  ) : (
                    <span className="text-slate-400 font-normal italic">Ongoing Pipeline</span>
                  )}
                </td>

                {/* Status Badges */}
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-full ${
                    record.is_active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"
                  }`}>
                    {record.is_active ? "Active" : "Inactive"}
                  </span>
                </td>

                {/* Action Droptray */}
                <td className="px-6 py-4 text-right pr-6">
                  {/* FIXED: Changed from ShiftRowActions to match the declared component file context name */}
                  <AssignmentRowActions
                    record={record}
                    onView={onView}
                    onEdit={onEdit}
                    onTransfer={onTransfer}
                    onEnd={onEnd}
                    onDeactivate={onDeactivate}
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