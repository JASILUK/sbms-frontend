import React from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { RefreshCw, ChevronRight } from "lucide-react";
import clsx from "clsx";

export default function PageHeader({ selectedDate, onDateChange, onRefresh, isFetching }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-4 border-b border-neutral-200 pb-5 dark:border-neutral-800 sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <nav className="flex items-center gap-1 text-xs text-neutral-400">
          <span>Attendance</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-neutral-600 dark:text-neutral-300">HR Management</span>
        </nav>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
          Attendance Dashboard
        </h1>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          {format(selectedDate, "EEEE, MMMM d, yyyy")}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="date"
          value={format(selectedDate, "yyyy-MM-dd")}
          onChange={(e) => onDateChange(new Date(e.target.value))}
          className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-700 shadow-sm transition focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
        />
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onRefresh}
          aria-label="Refresh dashboard"
          className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-neutral-700 shadow-sm transition hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
        >
          <RefreshCw className={clsx("h-3.5 w-3.5", isFetching && "animate-spin")} />
          Refresh
        </motion.button>
      </div>
    </motion.div>
  );
}
