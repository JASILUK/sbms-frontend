import React from "react";
import { motion } from "framer-motion";
import {
  Users,
  UserCheck,
  UserX,
  Palmtree,
  Clock,
  Timer,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const CARD_CONFIG = [
  {
    key: "total_employees",
    label: "Total Employees",
    icon: Users,
    format: (v) => v?.toLocaleString() ?? "0",
    accent: "text-slate-700",
    iconBg: "bg-slate-100",
    iconColor: "text-slate-600",
    borderColor: "border-slate-200",
  },
  {
    key: "present_employees",
    label: "Present Today",
    icon: UserCheck,
    format: (v) => v?.toLocaleString() ?? "0",
    accent: "text-emerald-700",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    borderColor: "border-emerald-200/60",
  },
  {
    key: "absent_employees",
    label: "Absent",
    icon: UserX,
    format: (v) => v?.toLocaleString() ?? "0",
    accent: "text-red-700",
    iconBg: "bg-red-50",
    iconColor: "text-red-500",
    borderColor: "border-red-200/60",
  },
  {
    key: "employees_on_leave",
    label: "On Leave",
    icon: Palmtree,
    format: (v) => v?.toLocaleString() ?? "0",
    accent: "text-amber-700",
    iconBg: "bg-amber-50",
    iconColor: "text-amber-500",
    borderColor: "border-amber-200/60",
  },
  {
    key: "employees_late",
    label: "Late Arrivals",
    icon: Clock,
    format: (v) => v?.toLocaleString() ?? "0",
    accent: "text-orange-700",
    iconBg: "bg-orange-50",
    iconColor: "text-orange-500",
    borderColor: "border-orange-200/60",
  },
  {
    key: "average_attendance_percentage",
    label: "Avg Attendance",
    icon: TrendingUp,
    format: (v) => `${v ?? 0}%`,
    accent: "text-blue-700",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-500",
    borderColor: "border-blue-200/60",
  },
  {
    key: "total_work_hours",
    label: "Work Hours",
    icon: Timer,
    format: (v) =>
      v?.toLocaleString(undefined, {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }) ?? "0.0",
    accent: "text-slate-700",
    iconBg: "bg-slate-100",
    iconColor: "text-slate-500",
    borderColor: "border-slate-200",
  },
  {
    key: "total_overtime_hours",
    label: "Overtime Hours",
    icon: AlertTriangle,
    format: (v) =>
      v?.toLocaleString(undefined, {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }) ?? "0.0",
    accent: "text-indigo-700",
    iconBg: "bg-indigo-50",
    iconColor: "text-indigo-500",
    borderColor: "border-indigo-200/60",
  },
];

function SummaryCardSkeleton({ index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="rounded-xl border border-slate-200/80 bg-white p-4 sm:p-5 overflow-hidden"
    >
      <div className="flex items-center justify-between">
        <div className="space-y-3 w-full">
          <div className="h-3 w-20 bg-slate-100 rounded animate-pulse" />
          <div className="h-8 w-16 bg-slate-100 rounded animate-pulse" />
        </div>
        <div className="h-10 w-10 bg-slate-100 rounded-xl animate-pulse shrink-0" />
      </div>
    </motion.div>
  );
}

function SummaryCard({ config, value, index }) {
  const Icon = config.icon;
  const displayValue = config.format(value);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.06,
        duration: 0.35,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{
        y: -2,
        transition: { duration: 0.2 },
      }}
      className={cn(
        "rounded-xl border cursor-default",
        "bg-white",
        "shadow-sm shadow-slate-900/3",
        "hover:shadow-md hover:shadow-slate-900/5",
        "transition-shadow duration-300",
        /* RESPONSIVE: p-4 mobile → sm:p-5 */
        "p-4 sm:p-5",
        config.borderColor || "border-slate-200/80"
      )}
    >
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider truncate">
            {config.label}
          </p>
          <p
            className={cn(
              /* RESPONSIVE: text-xl mobile → sm:text-[1.625rem] */
              "text-xl sm:text-[1.625rem] font-bold mt-1.5 font-mono tabular-nums leading-tight",
              config.accent || "text-slate-900"
            )}
          >
            {displayValue}
          </p>
        </div>
        <div
          className={cn(
            /* RESPONSIVE: w-9 h-9 mobile → sm:w-10 sm:h-10 */
            "flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl shrink-0 ml-3",
            config.iconBg || "bg-slate-100"
          )}
        >
          <Icon
            className={cn(
              /* RESPONSIVE: w-4 h-4 mobile → sm:w-5 sm:h-5 */
              "w-4 h-4 sm:w-5 sm:h-5",
              config.iconColor || "text-slate-500"
            )}
            aria-hidden="true"
          />
        </div>
      </div>
    </motion.div>
  );
}

export function AttendanceSummaryCards({ summary, isLoading }) {
  if (isLoading) {
    return (
      /* RESPONSIVE: 1 col → 2 col sm → 4 col lg. gap-3 mobile → sm:gap-4 */
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 md:mb-8">
        {Array.from({ length: 8 }).map((_, i) => (
          <SummaryCardSkeleton key={i} index={i} />
        ))}
      </div>
    );
  }

  if (!summary) {
    return null;
  }

  return (
    /* RESPONSIVE: 1 col → 2 col sm → 4 col lg. gap-3 mobile → sm:gap-4. mb-6 mobile → md:mb-8 */
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 md:mb-8">
      {CARD_CONFIG.map((config, index) => (
        <SummaryCard
          key={config.key}
          config={config}
          value={summary[config.key]}
          index={index}
        />
      ))}
    </div>
  );
}