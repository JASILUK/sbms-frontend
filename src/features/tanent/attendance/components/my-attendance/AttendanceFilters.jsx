import React, { useState, useEffect } from "react";
import { SlidersHorizontal, RotateCcw, ChevronDown, ChevronUp, Check } from "lucide-react";

const STATUS_OPTIONS = [
  { value: "",         label: "All statuses" },
  { value: "PRESENT",  label: "Present",  dot: "#22c55e" },
  { value: "ABSENT",   label: "Absent",   dot: "#ef4444" },
  { value: "LATE",     label: "Late",     dot: "#f59e0b" },
  { value: "LEAVE",    label: "On leave", dot: "#818cf8" },
  { value: "HALF_DAY", label: "Half day", dot: "#f97316" },
  { value: "HOLIDAY",  label: "Holiday",  dot: "#06b6d4" },
];

export default function AttendanceFilters({
  isOpen,
  setIsOpen,
  statusFilter,
  dateFrom,
  dateTo,
  onApply,
  onReset,
}) {
  const [localStatus, setLocalStatus] = useState(statusFilter || "");
  const [localFrom,   setLocalFrom]   = useState(dateFrom    || "");
  const [localTo,     setLocalTo]     = useState(dateTo      || "");

  /* Sync when parent resets externally */
  useEffect(() => {
    setLocalStatus(statusFilter || "");
    setLocalFrom(dateFrom       || "");
    setLocalTo(dateTo           || "");
  }, [statusFilter, dateFrom, dateTo]);

  const hasActiveFilters = !!(statusFilter || dateFrom || dateTo);
  const hasPendingChanges =
    localStatus !== (statusFilter || "") ||
    localFrom   !== (dateFrom    || "") ||
    localTo     !== (dateTo      || "");

  const handleApply = () => {
    onApply({ status: localStatus, date_from: localFrom, date_to: localTo });
  };

  const handleReset = () => {
    setLocalStatus("");
    setLocalFrom("");
    setLocalTo("");
    onReset();
  };

  const activeLabel = STATUS_OPTIONS.find((o) => o.value === localStatus)?.label || "All statuses";

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      {/* Toggle header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-slate-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500"
        aria-expanded={isOpen}
        aria-controls="filter-panel"
      >
        <div className="flex items-center gap-2.5">
          <SlidersHorizontal className="h-4 w-4 text-slate-400 flex-shrink-0" />
          <span className="text-sm font-semibold text-slate-800">Filters</span>
          {hasActiveFilters && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-50 border border-indigo-100 text-[10px] font-bold text-indigo-600 uppercase tracking-wide">
              Active
            </span>
          )}
        </div>
        {isOpen
          ? <ChevronUp  className="h-4 w-4 text-slate-400 flex-shrink-0" />
          : <ChevronDown className="h-4 w-4 text-slate-400 flex-shrink-0" />
        }
      </button>

      {/* Filter panel */}
      {isOpen && (
        <div
          id="filter-panel"
          className="border-t border-slate-100 bg-slate-50/40 px-5 py-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

            {/* Status */}
            <fieldset>
              <legend className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                Status
              </legend>
              <div className="flex flex-wrap gap-1.5">
                {STATUS_OPTIONS.map((opt) => {
                  const active = localStatus === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setLocalStatus(opt.value)}
                      className={`
                        inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold
                        transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 cursor-pointer
                        ${active
                          ? "bg-slate-900 border-slate-900 text-white shadow-sm"
                          : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                        }
                      `}
                      aria-pressed={active}
                    >
                      {opt.dot && (
                        <span
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ background: active ? "#fff" : opt.dot }}
                        />
                      )}
                      {opt.label}
                      {active && !opt.dot && <Check className="h-3 w-3 ml-0.5" />}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            {/* Date from */}
            <div>
              <label
                htmlFor="filter-date-from"
                className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2"
              >
                From
              </label>
              <input
                id="filter-date-from"
                type="date"
                value={localFrom}
                max={localTo || undefined}
                onChange={(e) => setLocalFrom(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-700
                  focus:outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100
                  hover:border-slate-300 transition-colors"
              />
            </div>

            {/* Date to */}
            <div>
              <label
                htmlFor="filter-date-to"
                className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2"
              >
                To
              </label>
              <input
                id="filter-date-to"
                type="date"
                value={localTo}
                min={localFrom || undefined}
                onChange={(e) => setLocalTo(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-700
                  focus:outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100
                  hover:border-slate-300 transition-colors"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={handleReset}
              disabled={!hasActiveFilters && !hasPendingChanges}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-500
                rounded-xl hover:bg-white hover:text-slate-800 hover:border-slate-200 border border-transparent
                transition-all disabled:opacity-30 disabled:pointer-events-none focus:outline-none
                focus-visible:ring-2 focus-visible:ring-slate-400 cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </button>

            <button
              type="button"
              onClick={handleApply}
              disabled={!hasPendingChanges}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800
                text-white text-xs font-semibold rounded-xl shadow-sm transition-all
                disabled:opacity-40 disabled:pointer-events-none active:scale-[0.98]
                focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2
                cursor-pointer"
            >
              <Check className="h-3.5 w-3.5" />
              Apply filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}