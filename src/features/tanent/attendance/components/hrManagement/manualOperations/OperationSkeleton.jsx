import React from "react";

export default function OperationSkeleton() {
  return (
    <div className="w-full space-y-5 animate-pulse p-1" role="status" aria-label="Loading workspace configurations">
      <div className="h-24 bg-slate-100 rounded-xl w-full" />
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {[...Array(5)].map((_, idx) => (
          <div key={idx} className="h-16 bg-slate-50 border border-slate-100 rounded-xl w-full" />
        ))}
      </div>
      <div className="space-y-3 pt-2">
        <div className="h-10 bg-slate-100 rounded-xl w-full" />
        <div className="h-10 bg-slate-100 rounded-xl w-full" />
        <div className="h-20 bg-slate-100 rounded-xl w-full" />
      </div>
    </div>
  );
}