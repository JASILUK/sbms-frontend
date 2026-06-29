import React from "react";

export default function LeaveStatusBadge({ status }) {
  const norm = status ? status.toLowerCase() : "pending";
  let classes = "bg-amber-50 border-amber-100 text-amber-700";
  let label = "Pending";

  if (norm === "approved") {
    classes = "bg-emerald-50 border-emerald-100 text-emerald-700";
    label = "Approved";
  } else if (norm === "rejected") {
    classes = "bg-rose-50 border-rose-100 text-rose-700";
    label = "Rejected";
  } else if (norm === "cancelled") {
    classes = "bg-slate-50 border-slate-200 text-slate-500";
    label = "Cancelled";
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border uppercase tracking-wide ${classes}`}>
      {label}
    </span>
  );
}