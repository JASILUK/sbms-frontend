import React from "react";

export default function RecordDetailSkeleton() {
  return (
    <div className="w-full space-y-6 p-6 animate-pulse" role="status" aria-label="Loading record investigation layout">
      <div className="h-16 bg-slate-200 rounded-2xl w-full" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="h-48 bg-slate-100 rounded-2xl w-full" />
          <div className="h-96 bg-slate-100 rounded-2xl w-full" />
        </div>
        <div className="space-y-6">
          <div className="h-40 bg-slate-100 rounded-2xl w-full" />
          <div className="h-32 bg-slate-100 rounded-2xl w-full" />
          <div className="h-32 bg-slate-100 rounded-2xl w-full" />
        </div>
      </div>
    </div>
  );
}