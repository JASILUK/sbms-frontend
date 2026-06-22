import React from "react";

export const ShiftSkeleton = () => {
  return (
    <div className="space-y-4 w-full">
      {/* Filters Skeleton bar */}
      <div className="h-16 bg-slate-100 border border-slate-200 rounded-xl w-full animate-pulse" />
      
      {/* Table Shell Simulator */}
      <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
        <div className="h-12 bg-slate-50 border-b border-slate-200 w-full flex items-center px-6 space-x-4">
          <div className="h-4 bg-slate-200 rounded w-1/4 animate-pulse" />
          <div className="h-4 bg-slate-200 rounded w-1/6 animate-pulse" />
          <div className="h-4 bg-slate-200 rounded w-1/6 animate-pulse" />
          <div className="h-4 bg-slate-200 rounded w-1/6 animate-pulse" />
        </div>
        <div className="p-6 space-y-5">
          {[1, 2, 3, 4, 5].map((idx) => (
            <div key={idx} className="flex justify-between items-center space-x-4">
              <div className="space-y-2 w-1/4">
                <div className="h-4 bg-slate-100 rounded w-5/6 animate-pulse" />
                <div className="h-3 bg-slate-50 rounded w-1/2 animate-pulse" />
              </div>
              <div className="h-6 bg-slate-100 rounded-full w-1/6 silverware animate-pulse" />
              <div className="h-4 bg-slate-100 rounded w-1/6 animate-pulse" />
              <div className="h-4 bg-slate-100 rounded w-1/12 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};