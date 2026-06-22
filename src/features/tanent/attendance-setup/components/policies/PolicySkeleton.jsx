import React from "react";

export const PolicySkeleton = () => {
  return (
    <div className="space-y-8 animate-pulse max-w-5xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center pb-6 border-b border-slate-200">
        <div className="space-y-3 w-1/3">
          <div className="h-7 bg-slate-200 rounded-md" />
          <div className="h-4 bg-slate-100 rounded-md w-3/4" />
        </div>
        <div className="h-6 bg-slate-200 rounded-full w-24" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
            <div className="h-3 bg-slate-200 rounded w-1/2" />
            <div className="h-6 bg-slate-300 rounded w-3/4" />
          </div>
        ))}
      </div>
      {[...Array(3)].map((_, i) => (
        <div key={i} className="border border-slate-200 rounded-xl p-6 space-y-4 bg-white">
          <div className="h-4 bg-slate-200 rounded w-1/4 mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2"><div className="h-9 bg-slate-100 rounded-lg" /></div>
            <div className="space-y-2"><div className="h-9 bg-slate-100 rounded-lg" /></div>
          </div>
        </div>
      ))}
    </div>
  );
};