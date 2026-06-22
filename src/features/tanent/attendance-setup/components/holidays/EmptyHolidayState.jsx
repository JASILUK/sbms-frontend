import React from "react";
import { CalendarDays, Plus, UploadCloud } from "lucide-react";

export const EmptyHolidayState = ({ onAddClick, onImportClick }) => {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-xs">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 ring-4 ring-indigo-50/40">
        <CalendarDays className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-base font-semibold text-slate-900">No holidays found</h3>
      <p className="mt-2 max-w-sm text-sm text-slate-500">
        No calendar metrics found under active filter bounds. Initialize workspace entries manually or parse automated statutory registers.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={onImportClick}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-xs hover:bg-slate-50 cursor-pointer transition-colors"
        >
          <UploadCloud className="h-4 w-4 text-slate-500" />
          Import Holidays
        </button>
        <button
          type="button"
          onClick={onAddClick}
          className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 cursor-pointer transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Holiday Manual
        </button>
      </div>
    </div>
  );
};