import React from 'react';

export default function DashboardSkeleton() {
  return (
    <div className="w-full space-y-6 animate-pulse p-1" role="status" aria-label="Loading workspace telemetry data">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, idx) => (
          <div key={idx} className="h-28 bg-slate-200 rounded-2xl w-full" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="h-80 bg-slate-100 rounded-2xl w-full" />
          <div className="h-96 bg-slate-100 rounded-2xl w-full" />
        </div>
        <div className="h-96 bg-slate-100 rounded-2xl w-full" />
      </div>
    </div>
  );
}