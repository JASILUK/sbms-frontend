import React, { memo } from "react";
import { CalendarX, FilterX } from "lucide-react";

const EmptyAttendanceState = memo(({ dateRange, onClearFilters }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
      <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-4">
        <CalendarX className="w-7 h-7 text-slate-400" />
      </div>
      <h3 className="text-base font-semibold text-slate-800 mb-1">
        No attendance records found
      </h3>
      <p className="text-sm text-slate-400 mb-5 max-w-md mx-auto">
        {dateRange?.date_from && dateRange?.date_to
          ? `No records match your filters for the period ${dateRange.date_from} to ${dateRange.date_to}.`
          : "No attendance records are available for the selected period."}
      </p>
      <button
        onClick={onClearFilters}
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
      >
        <FilterX className="w-4 h-4" />
        Clear Filters
      </button>
    </div>
  );
});

EmptyAttendanceState.displayName = "EmptyAttendanceState";

export default EmptyAttendanceState;