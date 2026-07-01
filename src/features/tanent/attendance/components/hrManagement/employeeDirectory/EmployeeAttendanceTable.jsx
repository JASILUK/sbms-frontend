import React, { memo } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { HR_ROUTES, ATTENDANCE_THEME } from "../../../constants/hrAttendance";

const EmployeeRowItem = memo(({ row, isSelected, onToggleSelection }) => {
  const theme = ATTENDANCE_THEME[row.attendance_status] || { color: "text-slate-600", bg: "bg-slate-50" };

  return (
    <tr 
      className={`border-b border-slate-100 dark:border-slate-900 text-sm transition-colors hover:bg-slate-50/60 dark:hover:bg-slate-900/40 ${
        isSelected ? "bg-indigo-50/30 dark:bg-indigo-950/20" : ""
      }`}
      role="row"
    >
      {/* 1. Checkbox Column */}
      <td className="py-3 px-3 text-center">
        <input 
          type="checkbox" 
          checked={isSelected}
          onChange={() => onToggleSelection(row.membership_id)}
          aria-label={`Select tracking row for ${row.employee_name}`}
          className="rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 dark:border-slate-800 h-4 w-4 cursor-pointer"
        />
      </td>

      {/* 2. Interactive Employee Name Column (Fixed with click isolation and z-index priority) */}
      <td className="py-3 px-3" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 relative z-10">
          <img 
            src={row.avatar_url || `https://ui-avatars.com/api/?name=${row.employee_name}&background=random`} 
            alt={`Profile look for ${row.employee_name}`}
            className="h-8 w-8 rounded-full bg-slate-100 object-cover pointer-events-none"
            loading="lazy"
          />
          <div className="flex flex-col min-w-0">
            <Link 
              to={HR_ROUTES.PROFILE(row.membership_id)}
              className="font-semibold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 block transition-colors relative z-20 cursor-pointer py-0.5 pr-2"
            >
              {row.employee_name}
            </Link>
            <span className="text-xs text-slate-400 font-mono block truncate">{row.email}</span>
          </div>
        </div>
      </td>

      {/* 3. Department Column */}
      <td className="py-3 px-3 text-slate-600 dark:text-slate-400 font-medium">{row.department_name}</td>
      
      {/* 4. Shift Column */}
      <td className="py-3 px-3 text-slate-500 dark:text-slate-400">{row.shift_name}</td>
      
      {/* 5. Attendance Status Column */}
      <td className="py-3 px-2">
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold border ${theme.bg} ${theme.color} ${theme.border}`}>
          {row.attendance_status}
        </span>
      </td>

      {/* 6. Current State Column */}
      <td className="py-3 px-2 font-semibold text-slate-700 dark:text-slate-300">{row.current_state}</td>
      
      {/* 7. First Check In Column */}
      <td className="py-3 px-2 font-mono text-xs text-slate-600 dark:text-slate-400">
        {row.first_check_in ? new Date(row.first_check_in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--:--"}
      </td>
      
      {/* 8. Last Check Out Column */}
      <td className="py-3 px-2 font-mono text-xs text-slate-600 dark:text-slate-400">
        {row.last_check_out ? new Date(row.last_check_out).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--:--"}
      </td>
      
      {/* 9. Worked Duration Column */}
      <td className="py-3 px-3 text-right font-mono font-medium text-slate-900 dark:text-white">
        {row.working_duration_minutes ? `${(row.working_duration_minutes / 60).toFixed(2)}h` : "0.00h"}
      </td>
      
      {/* 10. Audit/Review Status Column */}
      <td className="py-3 px-3 text-center">
        {row.needs_review ? (
          <span className="inline-flex h-2 w-2 rounded-full bg-rose-500 ring-4 ring-rose-500/20" title={row.review_reason} />
        ) : (
          <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20" />
        )}
      </td>
      
      {/* 11. Action Buttons Column (Isolated from row interactions) */}
      <td className="py-3 px-3 text-center" onClick={(e) => e.stopPropagation()}>
        <Link
          to={row.attendance_record_id ? HR_ROUTES.RECORD_DETAIL(row.attendance_record_id) : "#"}
          onClick={(e) => !row.attendance_record_id && e.preventDefault()}
          className={`text-xs font-semibold px-2.5 py-1 rounded-lg border transition-colors relative z-20 ${
            row.attendance_record_id 
              ? "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 cursor-pointer"
              : "border-slate-100 dark:border-slate-900 opacity-40 cursor-not-allowed text-slate-400"
          }`}
        >
          Audit sheet
        </Link>
      </td>
    </tr>
  );
});

EmployeeRowItem.displayName = "EmployeeRowItem";

export default function EmployeeAttendanceTable({ rows = [], selectedRowIds = new Set(), onToggleRow }) {
  if (!rows.length) {
    return (
      <div className="text-center py-12 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-950">
        <p className="text-sm text-slate-400 font-medium">No workforce logs trace matching active filter boundaries.</p>
      </div>
    );
  }

  return (
    <section className="bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/60 shadow-sm rounded-2xl overflow-hidden w-full" aria-label="Corporate employees daily trackings data sheet">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse" role="grid">
          <thead>
            <tr className="bg-slate-50/70 dark:bg-slate-900/40 border-b border-slate-100 dark:border-slate-900 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-3 w-12 text-center" scope="col">Select</th>
              <th className="py-3 px-3" scope="col">Employee Name</th>
              <th className="py-3 px-3" scope="col">Department</th>
              <th className="py-3 px-3" scope="col">Shift Schedule</th>
              <th className="py-3 px-2" scope="col">Calculated Status</th>
              <th className="py-3 px-2" scope="col">Current State</th>
              <th className="py-3 px-2" scope="col">First In</th>
              <th className="py-3 px-2" scope="col">Last Out</th>
              <th className="py-3 px-3 text-right" scope="col">Duration</th>
              <th className="py-3 px-3 w-16 text-center" scope="col">Audit</th>
              <th className="py-3 px-3 w-28 text-center" scope="col">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-900">
            {rows.map((row) => (
              <EmployeeRowItem 
                key={row.membership_id} 
                row={row} 
                isSelected={selectedRowIds.has(row.membership_id)}
                onToggleSelection={onToggleRow}
              />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

EmployeeAttendanceTable.propTypes = {
  rows: PropTypes.array,
  selectedRowIds: PropTypes.instanceOf(Set),
  onToggleRow: PropTypes.func.isRequired,
};