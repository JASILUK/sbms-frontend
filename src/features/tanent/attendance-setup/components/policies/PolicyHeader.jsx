import React from "react";

export const PolicyHeader = ({ isActive, updatedAt }) => {
  const formattedDate = React.useMemo(() => {
    if (!updatedAt) return "";
    return new Date(updatedAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }, [updatedAt]);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-6 mb-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Attendance Policies</h1>
        <p className="mt-1 text-sm text-slate-500">
          Define interpretative core logic metrics for daily compliance schedules across international tenants.
        </p>
      </div>
      <div className="flex flex-row sm:flex-col items-start sm:items-end justify-between sm:justify-center gap-2">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border ${
            isActive
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-slate-50 text-slate-600 border-slate-200"
          }`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-emerald-500" : "bg-slate-400"}`} />
          {isActive ? "Active Interpretation Stack" : "Inactive System Setup"}
        </span>
        {updatedAt && (
          <span className="text-xs text-slate-400 font-medium">
            Last structural change: {formattedDate}
          </span>
        )}
      </div>
    </div>
  );
};