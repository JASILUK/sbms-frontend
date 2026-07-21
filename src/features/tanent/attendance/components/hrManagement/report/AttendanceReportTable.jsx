import React from "react";
import { motion } from "framer-motion";
import {
  ArrowUp,
  ArrowDown,
  AlertCircle,
  User,
  Briefcase,
  Building2,
  Inbox,
} from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const COLUMNS = [
  { key: "employee_name", label: "Employee", width: "min-w-[200px]", sortable: true },
  { key: "department", label: "Department", width: "min-w-[130px]", sortable: true },
  { key: "job_title", label: "Title", width: "min-w-[140px]", sortable: false },
  { key: "present_days", label: "Present", width: "min-w-[70px]", sortable: true, align: "right" },
  { key: "absent_days", label: "Absent", width: "min-w-[70px]", sortable: true, align: "right" },
  { key: "leave_days", label: "Leave", width: "min-w-[70px]", sortable: true, align: "right" },
  { key: "late_count", label: "Late", width: "min-w-[60px]", sortable: true, align: "right" },
  { key: "attendance_percentage", label: "Attnd %", width: "min-w-[80px]", sortable: true, align: "right" },
  { key: "total_work_hours", label: "Work Hrs", width: "min-w-[80px]", sortable: true, align: "right" },
  { key: "overtime_hours", label: "OT Hrs", width: "min-w-[70px]", sortable: true, align: "right" },
  { key: "needs_review", label: "Review", width: "min-w-[80px]", sortable: false, align: "center" },
];

function TableSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="rounded-xl border border-slate-200/80 bg-white overflow-hidden shadow-sm shadow-slate-900/3"
    >
      <div className="bg-slate-50 border-b border-slate-200 px-4 py-3.5">
        <div className="flex items-center gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-3.5 bg-slate-200 rounded animate-pulse"
              style={{ width: `${60 + Math.random() * 80}px` }}
            />
          ))}
        </div>
      </div>
      <div className="divide-y divide-slate-100">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04, duration: 0.25 }}
            className="px-4 py-4 flex items-center gap-4"
          >
            <div className="h-9 w-9 bg-slate-100 rounded-full animate-pulse shrink-0" />
            <div className="flex-1 flex items-center gap-4">
              <div className="h-3.5 w-32 bg-slate-100 rounded animate-pulse" />
              <div className="h-3.5 w-24 bg-slate-100 rounded animate-pulse" />
              <div className="h-3.5 w-28 bg-slate-100 rounded animate-pulse" />
            </div>
            {Array.from({ length: 7 }).map((__, j) => (
              <div
                key={j}
                className="h-3.5 w-10 bg-slate-100 rounded animate-pulse"
              />
            ))}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function EmptyState({ onReset }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="rounded-xl border border-slate-200/80 bg-white py-16 sm:py-20 px-4"
    >
      <div className="flex flex-col items-center text-center max-w-sm mx-auto">
        <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-5">
          <Inbox className="w-7 h-7 text-slate-400" aria-hidden="true" />
        </div>
        <h3 className="text-base font-semibold text-slate-900">
          No employees found
        </h3>
        <p className="text-sm text-slate-500 mt-2 leading-relaxed">
          Try adjusting your filters or search criteria to find what you are looking for.
        </p>
        {onReset && (
          <motion.button
            type="button"
            onClick={onReset}
            whileTap={{ scale: 0.97 }}
            className={cn(
              "mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg",
              "text-sm font-semibold text-slate-700 bg-white border border-slate-200",
              "hover:bg-slate-50 hover:border-slate-300",
              "focus:outline-none focus:ring-2 focus:ring-slate-900/20",
              "transition-all duration-200"
            )}
          >
            Reset Filters
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

function SortIndicator({ field, sortField, sortDirection }) {
  const isActive = field === sortField;
  return (
    <span className="inline-flex flex-col ml-1.5 -space-y-0.5">
      <ArrowUp
        className={cn(
          "w-2.5 h-2.5 transition-colors duration-150",
          isActive && sortDirection === "asc"
            ? "text-slate-900"
            : "text-slate-300"
        )}
        aria-hidden="true"
      />
      <ArrowDown
        className={cn(
          "w-2.5 h-2.5 transition-colors duration-150",
          isActive && sortDirection === "desc"
            ? "text-slate-900"
            : "text-slate-300"
        )}
        aria-hidden="true"
      />
    </span>
  );
}

function EmployeeRow({ row, index }) {
  return (
    <motion.tr
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.02,
        duration: 0.25,
        ease: "easeOut",
      }}
      className={cn(
        "group transition-colors duration-150",
        index % 2 === 0 ? "bg-white" : "bg-slate-50/40",
        "hover:bg-slate-50"
      )}
    >
      <td className="px-3 sm:px-4 py-3 sm:py-3.5 whitespace-nowrap">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <img
            src={row.employee_avatar}
            alt=""
            /* RESPONSIVE: w-8 h-8 mobile → sm:w-9 sm:h-9 */
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-100 object-cover ring-2 ring-white shadow-sm"
            loading="lazy"
          />
          <div className="min-w-0">
            <div className="text-sm font-semibold text-slate-900 truncate">
              {row.employee_name}
            </div>
            <div className="text-[11px] text-slate-500 font-mono mt-0.5">
              ID: {row.membership_id}
            </div>
          </div>
        </div>
      </td>

      <td className="px-3 sm:px-4 py-3 sm:py-3.5 whitespace-nowrap">
        <div className="flex items-center gap-1.5 text-sm text-slate-600">
          <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
          <span className="truncate">{row.department}</span>
        </div>
      </td>

      <td className="px-3 sm:px-4 py-3 sm:py-3.5 whitespace-nowrap">
        <div className="flex items-center gap-1.5 text-sm text-slate-600">
          <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
          <span className="truncate">{row.job_title || "N/A"}</span>
        </div>
      </td>

      <td className="px-3 sm:px-4 py-3 sm:py-3.5 whitespace-nowrap text-right">
        <span className="text-sm font-mono tabular-nums font-medium text-slate-900">
          {row.present_days}
        </span>
      </td>

      <td className="px-3 sm:px-4 py-3 sm:py-3.5 whitespace-nowrap text-right">
        <span
          className={cn(
            "text-sm font-mono tabular-nums font-medium",
            row.absent_days > 0 ? "text-red-600" : "text-slate-400"
          )}
        >
          {row.absent_days}
        </span>
      </td>

      <td className="px-3 sm:px-4 py-3 sm:py-3.5 whitespace-nowrap text-right">
        <span className="text-sm font-mono tabular-nums text-slate-600">
          {row.leave_days}
        </span>
      </td>

      <td className="px-3 sm:px-4 py-3 sm:py-3.5 whitespace-nowrap text-right">
        <span
          className={cn(
            "text-sm font-mono tabular-nums font-medium",
            row.late_count > 0 ? "text-orange-600" : "text-slate-400"
          )}
        >
          {row.late_count}
        </span>
      </td>

      <td className="px-3 sm:px-4 py-3 sm:py-3.5 whitespace-nowrap text-right">
        <span
          className={cn(
            "text-sm font-mono tabular-nums font-semibold",
            row.attendance_percentage >= 95
              ? "text-emerald-600"
              : row.attendance_percentage >= 80
              ? "text-amber-600"
              : "text-red-600"
          )}
        >
          {row.attendance_percentage}%
        </span>
      </td>

      <td className="px-3 sm:px-4 py-3 sm:py-3.5 whitespace-nowrap text-right">
        <span className="text-sm font-mono tabular-nums text-slate-900">
          {row.total_work_hours}
        </span>
      </td>

      <td className="px-3 sm:px-4 py-3 sm:py-3.5 whitespace-nowrap text-right">
        <span
          className={cn(
            "text-sm font-mono tabular-nums font-medium",
            row.overtime_hours > 0 ? "text-indigo-600" : "text-slate-400"
          )}
        >
          {row.overtime_hours}
        </span>
      </td>

      <td className="px-3 sm:px-4 py-3 sm:py-3.5 whitespace-nowrap text-center">
        {row.needs_review ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-red-50 text-red-600 border border-red-100">
            <AlertCircle className="w-3 h-3" aria-hidden="true" />
            Review
          </span>
        ) : (
          <span className="text-sm text-slate-300">—</span>
        )}
      </td>
    </motion.tr>
  );
}

export function AttendanceReportTable({
  data,
  isLoading,
  onSort,
  sortField,
  sortDirection,
  onReset,
}) {
  if (isLoading) {
    return <TableSkeleton />;
  }

  if (!data || data.length === 0) {
    return <EmptyState onReset={onReset} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="rounded-xl border border-slate-200/80 overflow-hidden bg-white shadow-sm shadow-slate-900/3"
    >
      {/* RESPONSIVE: horizontal scroll container with min-width table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead className="bg-slate-50 sticky top-0 z-10">
            <tr className="border-b border-slate-200">
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className={cn(
                    /* RESPONSIVE: px-3 mobile → sm:px-4 */
                    "px-3 sm:px-4 py-3 sm:py-3.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider",
                    "whitespace-nowrap select-none",
                    col.sortable && "cursor-pointer hover:text-slate-700",
                    col.align === "right" && "text-right",
                    col.align === "center" && "text-center",
                    col.width
                  )}
                  onClick={() => col.sortable && onSort(col.key)}
                  aria-sort={
                    col.key === sortField
                      ? sortDirection === "asc"
                        ? "ascending"
                        : "descending"
                      : "none"
                  }
                >
                  <div
                    className={cn(
                      "flex items-center",
                      col.align === "right" && "justify-end",
                      col.align === "center" && "justify-center"
                    )}
                  >
                    {col.label}
                    {col.sortable && (
                      <SortIndicator
                        field={col.key}
                        sortField={sortField}
                        sortDirection={sortDirection}
                      />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((row, index) => (
              <EmployeeRow key={row.membership_id} row={row} index={index} />
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}