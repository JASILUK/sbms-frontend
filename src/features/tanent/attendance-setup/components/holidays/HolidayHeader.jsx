import React from "react";
import { Plus, UploadCloud } from "lucide-react";

export const HolidayHeader = ({ onAddClick, onImportClick }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5 mb-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Workspace Holidays</h1>
        <p className="mt-1 text-sm text-slate-500">
          Establish and maintain corporate and public statutory calendars running alongside payroll operations.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onImportClick}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-xs hover:bg-slate-50 cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
        >
          <UploadCloud className="h-4 w-4 text-slate-500" />
          Import Statutory Calendar
        </button>
        <button
          type="button"
          onClick={onAddClick}
          className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
        >
          <Plus className="h-4 w-4" />
          Add Corporate Holiday
        </button>
      </div>
    </div>
  );
};