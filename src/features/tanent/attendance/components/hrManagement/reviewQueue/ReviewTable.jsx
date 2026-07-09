import React, { memo } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { HR_ROUTES } from "../../../constants/hrAttendance";

const ReviewRow = memo(({ record, onResolveClick, onNoteClick }) => {
  return (
    <tr className="border-b border-slate-100 text-sm transition-colors hover:bg-slate-50/50" role="row">
      <td className="py-3 px-4 font-semibold text-slate-900">{record.employee_name}</td>
      <td className="py-3 px-4 text-slate-500 font-medium">{record.department_name}</td>
      <td className="py-3 px-4 font-mono font-medium text-slate-700">{record.attendance_date}</td>
      <td className="py-3 px-4">
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
          {record.attendance_status}
        </span>
      </td>
      <td className="py-3 px-4 text-xs text-rose-600 font-medium max-w-[240px] truncate" title={record.review_reason}>
        {record.review_reason}
      </td>
      <td className="py-3 px-4 font-mono text-xs text-slate-500">
        {record.first_check_in_at ? new Date(record.first_check_in_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--:--"}
      </td>
      <td className="py-3 px-4 font-mono text-xs text-slate-500">
        {record.last_check_out_at ? new Date(record.last_check_out_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--:--"}
      </td>
      <td className="py-3 px-4 text-center">
        <div className="flex items-center justify-center gap-1.5">
          <Link
            to={`/attendance/hr/records/${record.id}`}
            className="text-xs font-bold px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 transition-colors"
          >
            Investigate
          </Link>
          <button
            type="button"
            onClick={() => onResolveClick(record.id)}
            className="text-xs font-bold px-2.5 py-1 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs transition-colors cursor-pointer"
          >
            Resolve
          </button>
          <button
            type="button"
            onClick={() => onNoteClick(record.id)}
            className="text-xs font-bold px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 transition-colors cursor-pointer"
            aria-label="Append investigative note"
          >
            Note
          </button>
        </div>
      </td>
    </tr>
  );
});

ReviewRow.displayName = "ReviewRow";
ReviewRow.propTypes = {
  record: PropTypes.object.isRequired,
  onResolveClick: PropTypes.func.isRequired,
  onNoteClick: PropTypes.func.isRequired,
};

export const ReviewTable = React.memo(({ rows = [], onResolve, onNote }) => {
  return (
    <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden w-full" aria-label="Anomaly listing data grid">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse" role="grid">
          <thead>
            <tr className="bg-slate-50/70 border-b border-slate-200 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-4" scope="col">Employee Name</th>
              <th className="py-3 px-4" scope="col">Department</th>
              <th className="py-3 px-4" scope="col">Target Date</th>
              <th className="py-3 px-4" scope="col">Status</th>
              <th className="py-3 px-4" scope="col">Anomaly Narrative Log</th>
              <th className="py-3 px-4" scope="col">Clock In</th>
              <th className="py-3 px-4" scope="col">Clock Out</th>
              <th className="py-3 px-4 text-center w-64" scope="col">Actions Workspace</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {rows.map((record) => (
              <ReviewRow key={record.id} record={record} onResolveClick={onResolve} onNoteClick={onNote} />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
});

ReviewTable.displayName = "ReviewTable";
ReviewTable.propTypes = {
  rows: PropTypes.array,
  onResolve: PropTypes.func.isRequired,
  onNote: PropTypes.func.isRequired,
};