import React from "react";
import { Plus } from "lucide-react";

export const ShiftHeader = ({ onCreateClick }) => {
  return (
    <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">Shift Templates</h1>
        <p className="mt-1 text-sm text-slate-500">
          Configure operational standard hours, classifications, and break parameters used across scheduling algorithms.
        </p>
      </div>
      <button
        type="button"
        onClick={onCreateClick}
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all cursor-pointer"
      >
        <Plus className="h-4 w-4 stroke-[2.5]" />
        Create Template
      </button>
    </header>
  );
};