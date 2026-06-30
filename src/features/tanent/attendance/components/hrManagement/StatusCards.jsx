import React from "react";
import { motion } from "framer-motion";
import clsx from "clsx";
import {
  CheckCircle2, XCircle, Clock4, Activity, LogOut, Coffee,
  CalendarDays, PartyPopper, CalendarOff, AlertTriangle, Timer,
} from "lucide-react";
import { StatusCardSkeleton } from "./Skeletons";

const STATUS_CARDS = [
  { key: "present", label: "Present", icon: CheckCircle2, color: "text-emerald-600" },
  { key: "absent", label: "Absent", icon: XCircle, color: "text-rose-600" },
  { key: "late", label: "Late", icon: Clock4, color: "text-amber-600" },
  { key: "working", label: "Working", icon: Activity, color: "text-blue-600" },
  { key: "checked_out", label: "Checked Out", icon: LogOut, color: "text-neutral-500" },
  { key: "on_break", label: "On Break", icon: Coffee, color: "text-orange-600" },
  { key: "leave", label: "Leave", icon: CalendarDays, color: "text-violet-600" },
  { key: "holiday", label: "Holiday", icon: PartyPopper, color: "text-sky-600" },
  { key: "weekend", label: "Weekend", icon: CalendarOff, color: "text-neutral-500" },
  { key: "need_review", label: "Need Review", icon: AlertTriangle, color: "text-red-600" },
  { key: "overtime", label: "Overtime", icon: Timer, color: "text-fuchsia-600" },
];

// Maps each card key to a field on the dashboard-summary payload.
// Update these accessors to match your real summary field names.
function valueFor(summary, key) {
  const map = {
    present: summary.present_count,
    absent: summary.absent_count,
    late: summary.late_count,
    working: summary.working_count,
    checked_out: summary.checked_out_count,
    on_break: summary.on_break_count,
    leave: summary.leave_count,
    holiday: summary.holiday_count,
    weekend: summary.weekend_count,
    need_review: summary.review_required_count,
    overtime: summary.overtime_count,
  };
  return map[key] ?? 0;
}

export default function StatusCards({ summary, isLoading, activeFilter, onToggle }) {
  if (isLoading || !summary) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 xl:grid-cols-11">
        {STATUS_CARDS.map((c) => (
          <StatusCardSkeleton key={c.key} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 xl:grid-cols-11">
      {STATUS_CARDS.map((card, i) => {
        const isActive = activeFilter === card.key;
        const value = valueFor(summary, card.key);
        return (
          <motion.button
            key={card.key}
            type="button"
            onClick={() => onToggle(card.key)}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: i * 0.03 }}
            whileTap={{ scale: 0.97 }}
            aria-pressed={isActive}
            className={clsx(
              "rounded-xl border p-3.5 text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
              isActive
                ? "border-indigo-400 bg-indigo-50/70 shadow-sm dark:border-indigo-500 dark:bg-indigo-500/10"
                : "border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
            )}
          >
            <card.icon className={clsx("h-4 w-4", card.color)} />
            <p className="mt-2 text-lg font-semibold tabular-nums text-neutral-900 dark:text-neutral-100">{value}</p>
            <p className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400">{card.label}</p>
          </motion.button>
        );
      })}
    </div>
  );
}
