// attendance-setup/components/overview/OverviewSkeleton.jsx
import React from "react";

export const OverviewSkeleton = () => (
  <div className="mx-auto max-w-7xl px-4 py-8 space-y-8 animate-pulse">
    <div className="h-14 bg-slate-100 border border-slate-200 rounded-xl w-3/4" />
    <div className="h-24 bg-slate-100 border border-slate-200 rounded-2xl w-full" />
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-28 bg-slate-100 border border-slate-200 rounded-xl" />
          <div className="h-28 bg-slate-100 border border-slate-200 rounded-xl" />
          <div className="h-28 bg-slate-100 border border-slate-200 rounded-xl" />
          <div className="h-28 bg-slate-100 border border-slate-200 rounded-xl" />
        </div>
        <div className="h-44 bg-slate-100 border border-slate-200 rounded-xl w-full" />
      </div>
      <div className="space-y-6">
        <div className="h-36 bg-slate-100 border border-slate-200 rounded-xl w-full" />
        <div className="h-44 bg-slate-100 border border-slate-200 rounded-xl w-full" />
      </div>
    </div>
  </div>
);

