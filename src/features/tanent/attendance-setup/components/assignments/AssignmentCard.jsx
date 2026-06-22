import React from "react";
import { format, parseISO } from "date-fns";
import { AssignmentRowActions } from "./AssignmentRowActions";
import { Calendar, Briefcase } from "lucide-react";

export const AssignmentCard = ({ record, lookupEmployee, lookupShift, onView, onEdit, onTransfer, onEnd, onDeactivate }) => {
  const employee = record.employee || lookupEmployee?.(record.membership_id);
  const shift = record.shift || lookupShift?.(record.shift_id);
  const nameString = employee ? `${employee.first_name || ""} ${employee.last_name || ""}`.trim() || employee.username : "Unresolved Resource";

  return (
    <div className="block md:hidden border border-slate-200 rounded-xl p-5 bg-white shadow-3xs space-y-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3 truncate max-w-[80%]">
          <div className="h-9 w-9 rounded-full bg-indigo-50 border border-indigo-100 font-bold text-indigo-700 text-xs flex items-center justify-center shrink-0">
            {nameString.charAt(0).toUpperCase()}
          </div>
          <div className="truncate">
            <h4 className="font-bold text-slate-900 text-sm truncate">{nameString}</h4>
            <p className="text-xs text-slate-400 truncate flex items-center gap-1 mt-0.5">
              <Briefcase className="h-3 w-3 shrink-0" /> {employee?.job_title || "Enterprise Associate"}
            </p>
          </div>
        </div>
        <AssignmentRowActions
          record={record}
          onView={onView}
          onEdit={onEdit}
          onTransfer={onTransfer}
          onEnd={onEnd}
          onDeactivate={onDeactivate}
        />
      </div>

      <div className="border-t border-slate-100 pt-3 grid grid-cols-2 gap-3 text-xs">
        <div>
          <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px] block">Pattern Profile</span>
          <span className="text-slate-800 font-bold block mt-1 truncate">{shift?.name || "Corporate Pattern"}</span>
          <span className="text-slate-500 font-mono text-[11px] block mt-0.5">
            {shift?.start_time?.substring(0, 5)} - {shift?.end_time?.substring(0, 5)}
          </span>
        </div>
        <div>
          <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px] block">Timeline Range</span>
          <span className="text-slate-700 font-medium mt-1 block font-mono">
            {record.effective_from ? format(parseISO(record.effective_from), "dd MMM yy") : "—"} → 
            {record.effective_to ? ` ${format(parseISO(record.effective_to), "dd MMM yy")}` : " Open"}
          </span>
          <span className={`inline-flex items-center px-1.5 py-0.5 text-[10px] font-bold rounded-full mt-1.5 ${
            record.is_active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"
          }`}>
            {record.is_active ? "Active Link" : "Historical"}
          </span>
        </div>
      </div>
    </div>
  );
};