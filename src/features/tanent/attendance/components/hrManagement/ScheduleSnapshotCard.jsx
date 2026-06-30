import React from "react";
import { CalendarClock } from "lucide-react";

export default function ScheduleSnapshotCard({ snapshot }) {
  if (!snapshot || Object.keys(snapshot).length === 0) return null;

  return (
    <div className="rounded-xl border border-neutral-100 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
      <div className="flex items-center gap-2">
        <CalendarClock className="h-4 w-4 text-indigo-500" />
        <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Schedule Snapshot</h4>
      </div>
      <dl className="mt-3 space-y-1.5 text-sm">
        {Object.entries(snapshot).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between gap-3">
            <dt className="text-neutral-500 dark:text-neutral-400">{key.replace(/_/g, " ")}</dt>
            <dd className="font-medium text-neutral-800 dark:text-neutral-200">{String(value)}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
