import React, { memo, useCallback, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
} from "lucide-react";
import { ATTENDANCE_THEME } from "../../../constants/hrAttendance";

// ------------------------------------------------------------------------------
// Table Row Component
// ------------------------------------------------------------------------------
const RecordRow = memo(({ record, onClick }) => {
  const theme = ATTENDANCE_THEME[record.attendance_status] || {
    color: "text-slate-600",
    bg: "bg-slate-50",
    border: "border-slate-200",
  };

  const formatTime = (datetime) => {
    if (!datetime) return "--:--";
    const d = new Date(datetime);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "--";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <tr
      onClick={() => onClick(record.id)}
      className="group border-b border-slate-100 text-sm transition-colors hover:bg-slate-50/60 cursor-pointer"
      role="row"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick(record.id)}
      aria-label={`Attendance record for ${record.attendance_date}`}
    >
      <td className="py-3.5 px-4">
        <div className="font-medium text-slate-900">{formatDate(record.attendance_date)}</div>
        <div className="text-xs text-slate-400 mt-0.5">{record.attendance_status}</div>
      </td>
      <td className="py-3.5 px-3">
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold border ${theme.bg} ${theme.color} ${theme.border}`}
        >
          {record.attendance_status === "PRESENT" && <CheckCircle2 className="w-3 h-3" />}
          {record.attendance_status === "ABSENT" && <XCircle className="w-3 h-3" />}
          {record.attendance_status}
        </span>
      </td>
      <td className="py-3.5 px-3 font-mono text-xs text-slate-600">
        {formatTime(record.check_in)}
      </td>
      <td className="py-3.5 px-3 font-mono text-xs text-slate-600">
        {formatTime(record.check_out)}
      </td>
      <td className="py-3.5 px-3 text-right font-mono font-medium text-slate-900">
        {record.work_hours?.toFixed(2)}h
      </td>
      <td className="py-3.5 px-3 text-right font-mono text-slate-500">
        {record.break_hours?.toFixed(2)}h
      </td>
      <td className="py-3.5 px-3 text-right font-mono text-amber-600">
        {record.late_minutes > 0 ? `${record.late_minutes}m` : "—"}
      </td>
      <td className="py-3.5 px-3 text-right font-mono text-emerald-600">
        {record.overtime_minutes > 0 ? `${record.overtime_minutes}m` : "—"}
      </td>
      <td className="py-3.5 px-3 text-center">
        {record.needs_review ? (
          <span
            className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-rose-50 text-rose-500"
            title={record.review_reason || "Needs review"}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
          </span>
        ) : (
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-50 text-emerald-500">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </span>
        )}
      </td>
      <td className="py-3.5 px-3 text-center">
        <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-400 group-hover:text-slate-600 transition-colors">
          View
          <ArrowUpRight className="w-3 h-3" />
        </span>
      </td>
    </tr>
  );
});

RecordRow.displayName = "RecordRow";

// ------------------------------------------------------------------------------
// Pagination Component
// ------------------------------------------------------------------------------
const Pagination = memo(({ count, offset, limit, onPageChange }) => {
  const totalPages = Math.ceil(count / limit);
  const currentPage = Math.floor(offset / limit) + 1;

  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
      <p className="text-xs text-slate-400">
        Showing{" "}
        <span className="font-medium text-slate-600">{offset + 1}</span> to{" "}
        <span className="font-medium text-slate-600">
          {Math.min(offset + limit, count)}
        </span>{" "}
        of <span className="font-medium text-slate-600">{count}</span> records
      </p>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(0)}
          disabled={currentPage === 1}
          className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="First page"
        >
          <ChevronsLeft className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => onPageChange(Math.max(0, offset - limit))}
          disabled={currentPage === 1}
          className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        {getPageNumbers().map((page) => (
          <button
            key={page}
            onClick={() => onPageChange((page - 1) * limit)}
            className={`min-w-[32px] px-2 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              page === currentPage
                ? "bg-slate-800 text-white"
                : "border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => onPageChange(offset + limit)}
          disabled={currentPage >= totalPages}
          className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Next page"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => onPageChange((totalPages - 1) * limit)}
          disabled={currentPage >= totalPages}
          className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Last page"
        >
          <ChevronsRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
});

Pagination.displayName = "Pagination";

// ------------------------------------------------------------------------------
// Main Records Section
// ------------------------------------------------------------------------------
const AttendanceRecordsSection = memo(
  ({ records, filters, onFilterChange, onRecordClick, pagination }) => {
    return (
      <section
        className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
        aria-label="Attendance records"
      >
        {/* Section Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-800">
              Attendance Records
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Detailed daily attendance log
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* Status Filter Dropdown */}
            <select
              value={filters.attendance_status || ""}
              onChange={(e) =>
                onFilterChange({
                  attendance_status: e.target.value || undefined,
                })
              }
              className="px-3 py-1.5 text-xs font-medium bg-white border border-slate-200 rounded-lg text-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-200 cursor-pointer"
              aria-label="Filter by status"
            >
              <option value="">All Statuses</option>
              <option value="PRESENT">Present</option>
              <option value="ABSENT">Absent</option>
              <option value="HALF_DAY">Half Day</option>
              <option value="LEAVE">Leave</option>
              <option value="HOLIDAY">Holiday</option>
              <option value="WEEKEND">Weekend</option>
              <option value="INCOMPLETE">Incomplete</option>
              <option value="REVIEW_REQUIRED">Review Required</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse" role="grid">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4" scope="col">Date</th>
                <th className="py-3 px-3" scope="col">Status</th>
                <th className="py-3 px-3" scope="col">Check In</th>
                <th className="py-3 px-3" scope="col">Check Out</th>
                <th className="py-3 px-3 text-right" scope="col">Work</th>
                <th className="py-3 px-3 text-right" scope="col">Break</th>
                <th className="py-3 px-3 text-right" scope="col">Late</th>
                <th className="py-3 px-3 text-right" scope="col">OT</th>
                <th className="py-3 px-3 text-center w-16" scope="col">Review</th>
                <th className="py-3 px-3 text-center w-16" scope="col">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {records.map((record) => (
                <RecordRow
                  key={record.id}
                  record={record}
                  onClick={onRecordClick}
                />
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination
          count={pagination.count}
          offset={pagination.offset}
          limit={pagination.limit}
          onPageChange={pagination.onPageChange}
        />
      </section>
    );
  }
);

AttendanceRecordsSection.displayName = "AttendanceRecordsSection";

export default AttendanceRecordsSection;