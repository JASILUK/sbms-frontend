import React, { memo } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { HR_ROUTES, ATTENDANCE_THEME } from "../../../constants/hrAttendance";

const ProfileTableRow = memo(({ record }) => {
  const theme = ATTENDANCE_THEME[record.attendance_status] || { color: "text-slate-600", bg: "bg-slate-50" };

  return (
    <tr className="border-b border-slate-100 dark:border-slate-900 text-sm transition-colors hover:bg-slate-50/40 dark:hover:bg-slate-900/30" role="row">
      <td className="py-3 px-3 font-mono font-semibold text-slate-900 dark:text-white">{record.attendance_date}</td>
      <td className="py-3 px-2">
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold border ${theme.bg} ${theme.color} ${theme.border}`}>
          {record.attendance_status}
        </span>
      </td>
      <td className="py-3 px-2 font-mono text-xs text-slate-600 dark:text-slate-400">
        {record.first_check_in_at ? new Date(record.first_check_in_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--:--"}
      </td>
      <td className="py-3 px-2 font-mono text-xs text-slate-600 dark:text-slate-400">
        {record.last_check_out_at ? new Date(record.last_check_out_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--:--"}
      </td>
      <td className="py-3 px-3 text-right font-mono font-medium text-slate-900 dark:text-white">{record.work_hours.toFixed(2)}h</td>
      <td className="py-3 px-3 text-right font-mono text-slate-500 dark:text-slate-400">{record.break_hours.toFixed(2)}h</td>
      <td className="py-3 px-3 text-right font-mono text-amber-600 dark:text-amber-400">{record.late_minutes}m</td>
      <td className="py-3 px-3 text-center">
        {record.needs_review ? (
          <span className="inline-flex h-2 w-2 rounded-full bg-rose-500 ring-4 ring-rose-500/20" title={record.review_reason} />
        ) : (
          <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20" />
        )}
      </td>
      <td className="py-3 px-3 text-center">
        <Link
          to={HR_ROUTES.RECORD_DETAIL(record.id)}
          className="text-xs font-semibold px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 transition-colors"
        >
          Drill Sheet
        </Link>
      </td>
    </tr>
  );
});

ProfileTableRow.displayName = "ProfileTableRow";

export default function AttendanceRecordsTable({ records = [] }) {
  if (!records.length) {
    return (
      <div className="text-center py-12 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-950 w-full">
        <p className="text-sm text-slate-400 font-medium">No fine-grained sub-ledger records log trace found for this period filter match.</p>
      </div>
    );
  }

  return (
    <section className="bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/60 shadow-sm rounded-2xl overflow-hidden w-full" aria-label="Employee historical trackings matrix data grid">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse" role="grid">
          <thead>
            <tr className="bg-slate-50/70 dark:bg-slate-900/40 border-b border-slate-100 dark:border-slate-900 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-3" scope="col">Attendance Date</th>
              <th className="py-3 px-2" scope="col">Status</th>
              <th className="py-3 px-2" scope="col">Clock In</th>
              <th className="py-3 px-2" scope="col">Clock Out</th>
              <th className="py-3 px-3 text-right" scope="col">Work Duration</th>
              <th className="py-3 px-3 text-right" scope="col">Break</th>
              <th className="py-3 px-3 text-right" scope="col">Late</th>
              <th className="py-3 px-3 w-16 text-center" scope="col">Audit</th>
              <th className="py-3 px-3 w-28 text-center" scope="col">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-900">
            {records.map((record) => (
              <ProfileTableRow key={record.id} record={record} />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

AttendanceRecordsTable.propTypes = {
  records: PropTypes.array,
};