import React from "react";
import PropTypes from "prop-types";
import { ATTENDANCE_STATUS, ATTENDANCE_THEME } from "../../../constants/hrAttendance";

export default function OverrideStatusForm({ selectedStatus, onStatusChange, reason, onReasonChange, errors }) {
  // Enterprise compliance allowable targeted status matrices variables
  const statuses = [
    { id: ATTENDANCE_STATUS.PRESENT, label: "Present" },
    { id: ATTENDANCE_STATUS.ABSENT, label: "Absent" },
    { id: ATTENDANCE_STATUS.HALF_DAY, label: "Half Day" },
    { id: ATTENDANCE_STATUS.LEAVE, label: "On Leave" },
    { id: ATTENDANCE_STATUS.HOLIDAY, label: "Company Holiday" },
    { id: ATTENDANCE_STATUS.WEEKEND, label: "Weekend Roster" },
    { id: "EXCUSED", label: "Excused Absence" },
    { id: "WORK_FROM_HOME", label: "Remote WFH" },
  ];

  return (
    <div className="space-y-4 text-sm">
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
          Select Targeted Status Override
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2" role="radiogroup" aria-label="Select targeted status override values">
          {statuses.map((st) => {
            const isSelected = selectedStatus === st.id;
            const theme = ATTENDANCE_THEME[st.id] || { color: "text-slate-600", bg: "bg-slate-50" };
            
            return (
              <button
                key={st.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => onStatusChange(st.id)}
                className={`p-3 rounded-xl border text-left transition-all duration-150 flex flex-col justify-between min-h-[64px] focus:outline-none ${
                  isSelected
                    ? "border-indigo-600 bg-indigo-50/30 ring-2 ring-indigo-600/10 font-semibold"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${theme.bg} ${theme.color}`}>
                  {st.id.substring(0, 8)}
                </span>
                <span className="text-xs font-medium text-slate-800 mt-1 truncate w-full">{st.label}</span>
              </button>
            );
          })}
        </div>
        {errors.status && <span className="text-xs text-rose-600 font-medium block">{errors.status}</span>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="override-reason" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Compliance Justification Narrative Reason
        </label>
        <textarea
          id="override-reason"
          rows={3}
          value={reason}
          onChange={(e) => onReasonChange(e.target.value)}
          placeholder="Specify a comprehensive administrative rationale context explanation detailing why this ledger status override row adjustment is mandated..."
          className={`w-full rounded-xl border bg-white px-3 py-2.5 text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all leading-relaxed ${
            errors.reason ? "border-rose-400 focus:border-rose-500" : "border-slate-200 focus:border-indigo-500"
          }`}
        />
        {errors.reason && <span className="text-xs text-rose-600 font-medium block">{errors.reason}</span>}
      </div>
    </div>
  );
}

OverrideStatusForm.propTypes = {
  selectedStatus: PropTypes.string.isRequired,
  onStatusChange: PropTypes.func.isRequired,
  reason: PropTypes.string.isRequired,
  onReasonChange: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
};