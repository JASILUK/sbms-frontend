import React from "react";
import { Plus, Users } from "lucide-react";

export const AssignmentHeader = ({ onAssignSingle, onAssignBulk }) => {
  return (
    <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-5">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">Shift Assignments</h1>
        <p className="mt-1 text-sm text-slate-500">
          Map employee directory vectors directly to validated shift architectures before execution calculation windows begin.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        <button
          type="button"
          onClick={onAssignBulk}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-3xs hover:bg-slate-50 cursor-pointer transition-all"
        >
          <Users className="h-4 w-4 text-slate-400" />
          Bulk Assign
        </button>
        <button
          type="button"
          onClick={onAssignSingle}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer transition-all"
        >
          <Plus className="h-4 w-4 stroke-[2.5]" />
          Assign Employee
        </button>
      </div>
    </header>
  );
};