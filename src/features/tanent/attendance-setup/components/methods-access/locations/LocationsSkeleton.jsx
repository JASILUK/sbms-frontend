import React from 'react';

export const LocationsSkeleton = React.memo(() => (
  <div className="space-y-4" aria-hidden="true">
    <div className="flex justify-between items-center gap-4">
      <div className="h-8 bg-slate-100 rounded-lg w-64 animate-pulse" />
      <div className="h-8 bg-slate-50 rounded-lg w-32 animate-pulse" />
    </div>
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
      <div className="p-4 bg-slate-50/70 border-b border-slate-100 h-10 animate-pulse" />
      {[1, 2, 3, 4].map((idx) => (
        <div key={idx} className="p-5 border-b border-slate-100 flex justify-between items-center gap-6 animate-pulse">
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-slate-100 rounded w-1/4" />
            <div className="h-3 bg-slate-50 rounded w-1/2" />
          </div>
          <div className="h-4 bg-slate-100 rounded w-16" />
          <div className="h-4 bg-slate-100 rounded w-12" />
          <div className="h-6 bg-slate-100 rounded-full w-14" />
        </div>
      ))}
    </div>
  </div>
));

LocationsSkeleton.displayName = 'LocationsSkeleton';