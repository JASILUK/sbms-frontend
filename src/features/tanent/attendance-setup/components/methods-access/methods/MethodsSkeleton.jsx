import React from 'react';

export const MethodsSkeleton = React.memo(() => (
  <div className="space-y-6" aria-hidden="true">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3, 4, 5].map((idx) => (
        <div key={idx} className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-2xs animate-pulse">
          <div className="flex justify-between items-start">
            <div className="h-10 w-10 bg-slate-100 rounded-lg" />
            <div className="h-5 w-16 bg-slate-50 rounded-full" />
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-slate-100 rounded w-1/3" />
            <div className="h-3 bg-slate-50 rounded w-5/6" />
            <div className="h-3 bg-slate-50 rounded w-2/3" />
          </div>
          <div className="h-px bg-slate-100 pt-1" />
          <div className="flex justify-between items-center pt-2">
            <div className="h-3 bg-slate-100 rounded w-1/4" />
            <div className="h-7 bg-slate-100 rounded-lg w-1/4" />
          </div>
        </div>
      ))}
    </div>
  </div>
));

MethodsSkeleton.displayName = 'MethodsSkeleton';