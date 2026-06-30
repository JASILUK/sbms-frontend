import React from "react";

function formatMinutes(mins) {
  if (!mins) return "0h 0m";
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}h ${m}m`;
}

function formatTime(value) {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return value;
  }
}

/**
 * Maps directly onto DailyAttendanceDetailSerializer fields.
 */
export default function SummaryGrid({ record }) {
  if (!record) return null;

  const items = [
    { label: "Check In", value: formatTime(record.first_check_in_at) },
    { label: "Check Out", value: formatTime(record.last_check_out_at) },
    { label: "Working Hours", value: formatMinutes(record.total_work_minutes) },
    { label: "Break Hours", value: formatMinutes(record.total_break_minutes) },
    { label: "Late", value: record.late_minutes ? `${record.late_minutes}m` : "On time" },
    { label: "Overtime", value: record.overtime_minutes ? `${record.overtime_minutes}m` : "—" },
    { label: "Review", value: record.needs_review ? record.review_reason || "Flagged" : "Clear" },
    { label: "Auto Closed", value: record.is_auto_closed ? record.auto_close_reason || "Yes" : "No" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-xl border border-neutral-100 bg-neutral-50/60 p-3 dark:border-neutral-800 dark:bg-neutral-900/40"
        >
          <p className="text-[11px] font-medium uppercase tracking-wide text-neutral-400">{item.label}</p>
          <p className="mt-1 truncate text-sm font-semibold text-neutral-900 dark:text-neutral-100">{item.value}</p>
        </div>
      ))}
    </div>
  );
}
