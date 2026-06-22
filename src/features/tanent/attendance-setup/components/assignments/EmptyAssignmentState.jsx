import React from "react";
import { UserCheck, Plus } from "lucide-react";

export const EmptyAssignmentState = ({ isSearchFilterActive, onAssignClick }) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-3xs max-w-2xl mx-auto my-4">
      <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl text-indigo-600 mb-4 shadow-3xs">
        <UserCheck className="h-8 w-8 stroke-[1.5]" />
      </div>
      <h3 className="text-base font-bold text-slate-900">
        {isSearchFilterActive ? "No matching assignments" : "No shift assignments found"}
      </h3>
      <p className="mt-1 text-sm text-slate-500 max-w-sm">
        {isSearchFilterActive 
          ? "Adjust your filters or query settings to locate historical or active personnel schedules maps."
          : "Map your employee headcount profiles explicitly onto active shifts matrices to initialize compliance monitoring logs tracking."}
      </p>
      {!isSearchFilterActive && (
        <button
          type="button"
          onClick={onAssignClick}
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 cursor-pointer transition-all"
        >
          <Plus className="h-4 w-4" /> Assign Employee
        </button>
      )}
    </div>
  );
};