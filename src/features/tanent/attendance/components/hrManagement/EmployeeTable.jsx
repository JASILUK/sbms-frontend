import React from "react";
import { motion } from "framer-motion";
import { ChevronUp, ChevronDown, Eye, Lock, Unlock, RotateCw } from "lucide-react";
import Avatar from "./Avatar";
import StatusBadge from "./StatusBadge";
import MethodBadge from "./MethodBadge";
import ReviewBadge from "./ReviewBadge";
import { TableSkeleton } from "./Skeletons";
import EmptyState from "./EmptyState";
import ErrorState from "./ErrorState";
import Pagination from "./Pagination";

const COLUMNS = [
  { key: "employee", label: "Employee", sortable: false },
  { key: "department", label: "Department", sortable: true },
  { key: "shift", label: "Shift", sortable: false },
  { key: "attendance_status", label: "Status", sortable: true },
  { key: "first_check_in_at", label: "Check In", sortable: true },
  { key: "last_check_out_at", label: "Check Out", sortable: true },
  { key: "late_minutes", label: "Late", sortable: true },
  { key: "total_work_minutes", label: "Work Hours", sortable: true },
  { key: "total_break_minutes", label: "Break", sortable: false },
  { key: "attendance_method_summary", label: "Method", sortable: false },
  { key: "needs_review", label: "Review", sortable: false },
  { key: "actions", label: "", sortable: false },
];

function formatTime(value) {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return value;
  }
}

function formatMinutes(mins) {
  if (!mins) return "0h 0m";
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}h ${m}m`;
}

export default function EmployeeTable({
  rows,
  isLoading,
  isFetching,
  isError,
  onRetry,
  sort,
  setSort,
  page,
  setPage,
  totalPages,
  totalCount,
  pageSize,
  onRowClick,
  onAction,
}) {
  if (isLoading) return <TableSkeleton />;
  if (isError) return <ErrorState message="Couldn't load attendance records." onRetry={onRetry} />;
  if (!rows?.length) {
    return (
      <EmptyState
        title="No attendance records"
        description="Try adjusting your filters or selecting a different date."
      />
    );
  }

  function toggleSort(field) {
    setSort((prev) =>
      prev.field === field
        ? { field, direction: prev.direction === "asc" ? "desc" : "asc" }
        : { field, direction: "asc" }
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1080px] text-left text-sm">
          <thead className="sticky top-0 z-10 bg-neutral-50/95 backdrop-blur dark:bg-neutral-900/95">
            <tr className="border-b border-neutral-200 dark:border-neutral-800">
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-500"
                >
                  {col.sortable ? (
                    <button
                      onClick={() => toggleSort(col.key)}
                      className="inline-flex items-center gap-1 hover:text-neutral-800 dark:hover:text-neutral-200"
                    >
                      {col.label}
                      {sort.field === col.key &&
                        (sort.direction === "asc" ? (
                          <ChevronUp className="h-3 w-3" />
                        ) : (
                          <ChevronDown className="h-3 w-3" />
                        ))}
                    </button>
                  ) : (
                    col.label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={isFetching ? "opacity-60 transition-opacity" : "transition-opacity"}>
            {rows.map((row, i) => (
              <motion.tr
                key={row.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: Math.min(i, 12) * 0.015 }}
                onClick={() => onRowClick(row.id)}
                className="cursor-pointer border-b border-neutral-100 transition-colors last:border-b-0 hover:bg-neutral-50 dark:border-neutral-800/60 dark:hover:bg-neutral-800/40"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <Avatar name={row.employee_name} src={row.employee_avatar} size="sm" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-neutral-900 dark:text-neutral-100">
                        {row.employee_name || "—"}
                      </p>
                      <p className="truncate text-xs text-neutral-400">{row.employee_code || ""}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-neutral-600 dark:text-neutral-300">{row.department_name || "—"}</td>
                <td className="px-4 py-3 text-neutral-600 dark:text-neutral-300">{row.shift_name || "—"}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={row.attendance_status} />
                </td>
                <td className="px-4 py-3 tabular-nums text-neutral-600 dark:text-neutral-300">
                  {formatTime(row.first_check_in_at)}
                </td>
                <td className="px-4 py-3 tabular-nums text-neutral-600 dark:text-neutral-300">
                  {formatTime(row.last_check_out_at)}
                </td>
                <td className="px-4 py-3 tabular-nums text-neutral-600 dark:text-neutral-300">
                  {row.late_minutes ? `${row.late_minutes}m` : "—"}
                </td>
                <td className="px-4 py-3 tabular-nums text-neutral-600 dark:text-neutral-300">
                  {formatMinutes(row.total_work_minutes)}
                </td>
                <td className="px-4 py-3 tabular-nums text-neutral-600 dark:text-neutral-300">
                  {formatMinutes(row.total_break_minutes)}
                </td>
                <td className="px-4 py-3">
                  <MethodBadge method={row.attendance_method_summary} />
                </td>
                <td className="px-4 py-3">
                  <ReviewBadge needsReview={row.needs_review} reason={row.review_reason} />
                </td>
                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-1">
                    <button
                      title="View details"
                      onClick={() => onRowClick(row.id)}
                      className="rounded-md p-1.5 text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      title="Finalize"
                      onClick={() => onAction(row.id, "finalize")}
                      className="rounded-md p-1.5 text-neutral-400 transition hover:bg-neutral-100 hover:text-emerald-600 dark:hover:bg-neutral-800"
                    >
                      <Lock className="h-4 w-4" />
                    </button>
                    <button
                      title="Unlock"
                      onClick={() => onAction(row.id, "unlock")}
                      className="rounded-md p-1.5 text-neutral-400 transition hover:bg-neutral-100 hover:text-amber-600 dark:hover:bg-neutral-800"
                    >
                      <Unlock className="h-4 w-4" />
                    </button>
                    <button
                      title="Reprocess"
                      onClick={() => onAction(row.id, "reprocess")}
                      className="rounded-md p-1.5 text-neutral-400 transition hover:bg-neutral-100 hover:text-indigo-600 dark:hover:bg-neutral-800"
                    >
                      <RotateCw className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination page={page} setPage={setPage} totalPages={totalPages} totalCount={totalCount} pageSize={pageSize} />
    </div>
  );
}
