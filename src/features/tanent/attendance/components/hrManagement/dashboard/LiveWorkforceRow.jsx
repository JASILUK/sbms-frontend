// # attendance/components/hrManagement/dashboard/LiveWorkforceRow.jsx

import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { LiveWorkforceStatusBadge } from './LiveWorkforceStatusBadge';
import { formatDuration, formatTime, formatDateTime } from '../../../utils/hrAttendance/statusUtils';

export const LiveWorkforceRow = React.memo(({ employee }) => {
  const navigate = useNavigate();

  const handleRowClick = () => {
    navigate(`/app/attendance/hr/profile/${employee.membership_id}`);
  };

  const handleDetailClick = (e) => {
    e.stopPropagation();
    if (employee.attendance_record_id) {
      navigate(`/app/attendance/hr/records/${employee.attendance_record_id}`);
    }
  };

  return (
    <tr
      onClick={handleRowClick}
      className="group border-b border-slate-100 hover:bg-slate-50/80 transition-colors cursor-pointer"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleRowClick()}
    >
      {/* Avatar + Name */}
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-3">
          <img
            src={employee.avatar}
            alt={employee.employee_name}
            className="w-9 h-9 rounded-full object-cover border border-slate-200 bg-slate-100"
            loading="lazy"
          />
          <div>
            <p className="text-sm font-bold text-slate-900">{employee.employee_name}</p>
            <p className="text-xs text-slate-500">{employee.email}</p>
          </div>
        </div>
      </td>

      {/* Department */}
      <td className="px-4 py-3.5">
        <span className="text-sm text-slate-700">{employee.department}</span>
      </td>

      {/* Shift */}
      <td className="px-4 py-3.5">
        <div className="flex flex-col">
          <span className="text-sm font-medium text-slate-700">{employee.shift}</span>
          {employee.shift_start && employee.shift_end && (
            <span className="text-[10px] text-slate-400 font-mono">
              {employee.shift_start} - {employee.shift_end}
            </span>
          )}
        </div>
      </td>

      {/* Status */}
      <td className="px-4 py-3.5">
        <LiveWorkforceStatusBadge
          status={employee.current_status}
          needsReview={employee.needs_review}
        />
      </td>

      {/* First Check In */}
      <td className="px-4 py-3.5">
        <span className="text-sm font-mono text-slate-700">
          {formatTime(employee.first_check_in)}
        </span>
      </td>

      {/* Last Event */}
      <td className="px-4 py-3.5">
        <div className="flex flex-col">
          <span className="text-sm text-slate-700">{employee.last_event_type || '—'}</span>
          <span className="text-[10px] text-slate-400 font-mono">
            {formatDateTime(employee.last_event_time)}
          </span>
        </div>
      </td>

      {/* Working Duration */}
      <td className="px-4 py-3.5">
        <span className="text-sm font-mono font-medium text-slate-700">
          {employee.working_duration}
        </span>
      </td>

      {/* Late */}
      <td className="px-4 py-3.5">
        {employee.is_late ? (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
            {employee.late_minutes}m
          </span>
        ) : (
          <span className="text-sm text-slate-400">—</span>
        )}
      </td>

      {/* Actions */}
      <td className="px-4 py-3.5">
        <button
          type="button"
          onClick={handleDetailClick}
          className="opacity-0 group-hover:opacity-100 px-3 py-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-all"
        >
          Detail
        </button>
      </td>
    </tr>
  );
});

LiveWorkforceRow.displayName = 'LiveWorkforceRow';
LiveWorkforceRow.propTypes = {
  employee: PropTypes.object.isRequired,
};