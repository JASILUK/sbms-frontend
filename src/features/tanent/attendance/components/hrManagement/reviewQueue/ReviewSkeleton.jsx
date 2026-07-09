import React from "react";

export const ReviewSkeleton = React.memo(() => {
  return (
    <div className="w-full space-y-6 animate-pulse" role="status" aria-label="Loading review queue structural layout">
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {[...Array(6)].map((_, idx) => (
          <div key={idx} className="h-24 bg-slate-200 border rounded-2xl w-full" />
        ))}
      </div>
      <div className="h-14 bg-slate-200 border rounded-2xl w-full" />
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="h-10 bg-slate-100 border-b w-full" />
        {[...Array(4)].map((_, idx) => (
          <div key={idx} className="h-12 bg-white border-b border-slate-100 w-full px-4 flex items-center justify-between gap-4">
            <div className="h-4 bg-slate-200 rounded w-1/4" />
            <div className="h-4 bg-slate-100 rounded w-1/6" />
            <div className="h-4 bg-slate-200 rounded w-1/3" />
          </div>
        ))}
      </div>
    </div>
  );
});

ReviewSkeleton.displayName = "ReviewSkeleton";