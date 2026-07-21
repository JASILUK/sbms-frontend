import React, { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Calendar,
  Building2,
  User,
  CheckCircle2,
  ArrowUpDown,
  RotateCcw,
  Filter,
  ChevronDown,
  X,
  SlidersHorizontal,
} from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const MONTHS = [
  { value: "1", label: "January" },
  { value: "2", label: "February" },
  { value: "3", label: "March" },
  { value: "4", label: "April" },
  { value: "5", label: "May" },
  { value: "6", label: "June" },
  { value: "7", label: "July" },
  { value: "8", label: "August" },
  { value: "9", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

const YEARS = Array.from({ length: 5 }, (_, i) => {
  const year = new Date().getFullYear() - 2 + i;
  return { value: String(year), label: String(year) };
});

const STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "PRESENT", label: "Present" },
  { value: "ABSENT", label: "Absent" },
  { value: "LEAVE", label: "Leave" },
  { value: "HOLIDAY", label: "Holiday" },
  { value: "WEEKEND", label: "Weekend" },
];

const ORDERING_OPTIONS = [
  { value: "user__first_name", label: "Name (A-Z)" },
  { value: "-user__first_name", label: "Name (Z-A)" },
  { value: "attendance_percentage", label: "Attendance % (Low-High)" },
  { value: "-attendance_percentage", label: "Attendance % (High-Low)" },
  { value: "total_work_hours", label: "Work Hours (Low-High)" },
  { value: "-total_work_hours", label: "Work Hours (High-Low)" },
  { value: "late_count", label: "Late Count (Low-High)" },
  { value: "-late_count", label: "Late Count (High-Low)" },
];

function FilterSelect({ icon: Icon, label, value, onChange, options, disabled }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
        <Icon className="w-3 h-3" aria-hidden="true" />
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={cn(
            "appearance-none w-full rounded-lg border border-slate-200 bg-white",
            "py-2 pl-3 pr-9 text-sm text-slate-900",
            "focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/5",
            "hover:border-slate-300",
            "disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed",
            "transition-all duration-150"
          )}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

function FilterInput({ icon: Icon, label, value, onChange, placeholder, disabled }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
        <Icon className="w-3 h-3" aria-hidden="true" />
        {label}
      </label>
      <div className="relative">
        <Icon
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
          aria-hidden="true"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "w-full rounded-lg border border-slate-200 bg-white",
            "py-2 pl-9 pr-8 text-sm text-slate-900",
            "placeholder:text-slate-400",
            "focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/5",
            "hover:border-slate-300",
            "disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed",
            "transition-all duration-150"
          )}
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

export function AttendanceFilterToolbar({
  filters,
  onChange,
  onApply,
  onReset,
  isLoading,
}) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleChange = useCallback(
    (key) => (value) => {
      onChange(key, value);
    },
    [onChange]
  );

  const hasActiveFilters =
    filters.month ||
    filters.year ||
    filters.department_id ||
    filters.search ||
    filters.attendance_status ||
    filters.date_from ||
    filters.date_to;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      /* RESPONSIVE: p-4 mobile → sm:p-5 */
      className="bg-white rounded-xl border border-slate-200/80 shadow-sm shadow-slate-900/3 p-4 sm:p-5 mb-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-slate-500" aria-hidden="true" />
          <h2 className="text-xs font-semibold text-slate-700 uppercase tracking-widest">
            Filters
          </h2>
          {hasActiveFilters && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-900 text-white">
              Active
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => setShowAdvanced((prev) => !prev)}
          className="text-xs font-medium text-slate-500 hover:text-slate-900 flex items-center gap-1 transition-colors"
        >
          {showAdvanced ? "Hide" : "Advanced"}
          <ChevronDown
            className={cn(
              "w-3 h-3 transition-transform duration-200",
              showAdvanced && "rotate-180"
            )}
          />
        </button>
      </div>

      {/* RESPONSIVE: 1 col → 2 col sm → 3 col lg → 6 col xl. gap-3 mobile → sm:gap-4 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
        <FilterSelect
          icon={Calendar}
          label="Month"
          value={filters.month || ""}
          onChange={handleChange("month")}
          options={[{ value: "", label: "Current Month" }, ...MONTHS]}
          disabled={isLoading}
        />

        <FilterSelect
          icon={Calendar}
          label="Year"
          value={filters.year || ""}
          onChange={handleChange("year")}
          options={YEARS}
          disabled={isLoading}
        />

        <FilterSelect
          icon={Building2}
          label="Department"
          value={filters.department_id || ""}
          onChange={handleChange("department_id")}
          options={[{ value: "", label: "All Departments" }]}
          disabled={isLoading}
        />

        <FilterInput
          icon={Search}
          label="Search"
          value={filters.search || ""}
          onChange={handleChange("search")}
          placeholder="Name or title..."
          disabled={isLoading}
        />

        <FilterSelect
          icon={CheckCircle2}
          label="Status"
          value={filters.attendance_status || ""}
          onChange={handleChange("attendance_status")}
          options={STATUS_OPTIONS}
          disabled={isLoading}
        />

        <FilterSelect
          icon={ArrowUpDown}
          label="Sort By"
          value={filters.ordering || "user__first_name"}
          onChange={handleChange("ordering")}
          options={ORDERING_OPTIONS}
          disabled={isLoading}
        />
      </div>

      <AnimatePresence>
        {showAdvanced && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="mt-4 pt-4 border-t border-slate-100">
              <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar className="w-3 h-3" aria-hidden="true" />
                    Custom Date Range
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="date"
                      value={filters.date_from || ""}
                      onChange={(e) => handleChange("date_from")(e.target.value)}
                      disabled={isLoading}
                      className={cn(
                        "rounded-lg border border-slate-200 bg-white",
                        "py-2 px-3 text-sm text-slate-900",
                        "focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/5",
                        "hover:border-slate-300",
                        "disabled:bg-slate-50 disabled:text-slate-400"
                      )}
                    />
                    <span className="text-sm text-slate-400 font-medium">to</span>
                    <input
                      type="date"
                      value={filters.date_to || ""}
                      onChange={(e) => handleChange("date_to")(e.target.value)}
                      disabled={isLoading}
                      className={cn(
                        "rounded-lg border border-slate-200 bg-white",
                        "py-2 px-3 text-sm text-slate-900",
                        "focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/5",
                        "hover:border-slate-300",
                        "disabled:bg-slate-50 disabled:text-slate-400"
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* RESPONSIVE: buttons full width on mobile, auto on sm+ */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 mt-4 pt-4 border-t border-slate-100">
        <motion.button
          type="button"
          onClick={onApply}
          disabled={isLoading}
          whileTap={{ scale: 0.97 }}
          className={cn(
            "inline-flex items-center justify-center sm:justify-start gap-2 px-4 sm:px-5 py-2.5 rounded-lg",
            "text-sm font-semibold text-white bg-slate-900",
            "hover:bg-slate-800",
            "focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:ring-offset-2",
            "shadow-sm shadow-slate-900/10",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "transition-colors duration-200",
            "w-full sm:w-auto"
          )}
        >
          <Filter className="w-4 h-4" aria-hidden="true" />
          {isLoading ? "Loading..." : "Apply Filters"}
        </motion.button>

        <motion.button
          type="button"
          onClick={onReset}
          disabled={isLoading}
          whileTap={{ scale: 0.97 }}
          className={cn(
            "inline-flex items-center justify-center sm:justify-start gap-2 px-4 sm:px-5 py-2.5 rounded-lg",
            "text-sm font-semibold text-slate-600 bg-white border border-slate-200",
            "hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300",
            "focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:ring-offset-2",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "transition-all duration-200",
            "w-full sm:w-auto"
          )}
        >
          <RotateCcw className="w-4 h-4" aria-hidden="true" />
          Reset
        </motion.button>
      </div>
    </motion.div>
  );
}