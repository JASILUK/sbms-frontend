import React from "react";
import { motion } from "framer-motion";
import { Search, X, Download } from "lucide-react";
import clsx from "clsx";

const STATUS_OPTIONS = ["PRESENT", "ABSENT", "LATE", "LEAVE", "HOLIDAY", "WEEKEND"];
const METHOD_OPTIONS = ["MANUAL", "GPS", "FACE", "BIOMETRIC"];

export default function FilterBar({ filters, updateFilter, clearFilters, departments = [], onExport }) {
  const activeChips = Object.entries(filters).filter(([, v]) => v);

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="sticky top-0 z-10 -mx-1 space-y-3 rounded-2xl border border-neutral-200 bg-white/90 p-4 backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:border-neutral-800 dark:bg-neutral-900/80"
    >
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            placeholder="Search employee, ID, department…"
            className="w-full rounded-lg border border-neutral-200 bg-white py-2 pl-9 pr-3 text-sm shadow-sm transition focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-neutral-700 dark:bg-neutral-900"
          />
        </div>

        <select
          value={filters.department}
          onChange={(e) => updateFilter("department", e.target.value)}
          className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm shadow-sm dark:border-neutral-700 dark:bg-neutral-900"
        >
          <option value="">All Departments</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>

        <select
          value={filters.status || ""}
          onChange={(e) => updateFilter("status", e.target.value)}
          className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm shadow-sm dark:border-neutral-700 dark:bg-neutral-900"
        >
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <select
          value={filters.method}
          onChange={(e) => updateFilter("method", e.target.value)}
          className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm shadow-sm dark:border-neutral-700 dark:bg-neutral-900"
        >
          <option value="">All Methods</option>
          {METHOD_OPTIONS.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={filters.dateFrom}
          onChange={(e) => updateFilter("dateFrom", e.target.value)}
          className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm shadow-sm dark:border-neutral-700 dark:bg-neutral-900"
        />
        <span className="text-neutral-300">–</span>
        <input
          type="date"
          value={filters.dateTo}
          onChange={(e) => updateFilter("dateTo", e.target.value)}
          className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm shadow-sm dark:border-neutral-700 dark:bg-neutral-900"
        />

        <button
          onClick={clearFilters}
          className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-neutral-500 transition hover:bg-neutral-100 dark:hover:bg-neutral-800"
        >
          <X className="h-3.5 w-3.5" /> Clear
        </button>

        <button
          onClick={onExport}
          className="ml-auto inline-flex items-center gap-1.5 rounded-lg bg-neutral-900 px-3.5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-900"
        >
          <Download className="h-3.5 w-3.5" /> Export
        </button>
      </div>

      {activeChips.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {activeChips.map(([key, value]) => (
            <span
              key={key}
              className={clsx(
                "inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700",
                "dark:bg-indigo-500/10 dark:text-indigo-300"
              )}
            >
              {key}: {value}
              <button onClick={() => updateFilter(key, "")} aria-label={`Remove ${key} filter`}>
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
}
