import React from "react";

export default function StatusOverrideSkeleton() {
  return (
    <div className="w-full space-y-5 p-1 animate-pulse" role="status" aria-label="Loading configuration layouts">
      <div className="h-28 bg-slate-100 rounded-xl w-full" />
      <div className="h-10 bg-slate-50 border border-slate-100 rounded-xl w-1/3" />
      <div className="grid grid-cols-3 gap-2">
        {[...Array(6)].map((_, idx) => (
          <div key={idx} className="h-12 bg-slate-50 rounded-xl w-full" />
        ))}
      </div>
      <div className="h-32 bg-slate-100 rounded-xl w-full" />
    </div>
  );
}