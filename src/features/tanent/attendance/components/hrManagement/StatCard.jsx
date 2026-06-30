import React from "react";
import { motion } from "framer-motion";
import clsx from "clsx";
import CountUp from "./CountUp";

const COLOR_MAP = {
  indigo: "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400",
  emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
  rose: "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400",
  amber: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
  blue: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
  violet: "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400",
};

export default function StatCard({ icon: Icon, title, value, description, trend, color = "indigo", index = 0 }) {
  const isPositive = typeof trend === "number" ? trend >= 0 : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3 }}
      className="group rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900"
    >
      <div className="flex items-start justify-between">
        <div className={clsx("flex h-9 w-9 items-center justify-center rounded-xl", COLOR_MAP[color])}>
          <Icon className="h-4.5 w-4.5" />
        </div>
        {trend !== undefined && trend !== null && (
          <span
            className={clsx(
              "text-xs font-medium",
              isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
            )}
          >
            {isPositive ? "+" : ""}
            {trend}%
          </span>
        )}
      </div>
      <p className="mt-4 text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
        <CountUp value={value ?? 0} decimals={Number.isInteger(value) ? 0 : 1} />
      </p>
      <p className="mt-1 text-sm font-medium text-neutral-600 dark:text-neutral-400">{title}</p>
      {description && <p className="mt-0.5 text-xs text-neutral-400">{description}</p>}
    </motion.div>
  );
}
