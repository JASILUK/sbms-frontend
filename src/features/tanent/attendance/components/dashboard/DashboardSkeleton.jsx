import React from 'react';

export const DashboardSkeleton = () => {
  return (
    <div className="space-y-5 animate-pulse w-full max-w-7xl mx-auto p-2 sm:p-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4 pb-4">
        <div className="space-y-2">
          <div className="h-5 w-48 bg-slate-200 rounded-lg" />
          <div className="h-3 w-32 bg-slate-100 rounded-md" />
        </div>
        <div className="h-10 w-44 bg-slate-100 rounded-xl" />
      </div>

      <div className="h-44 w-full bg-slate-100 rounded-2xl border border-slate-200/40" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
        <div className="h-20 bg-slate-100 rounded-xl border border-slate-200/20" />
        <div className="h-20 bg-slate-100 rounded-xl border border-slate-200/20" />
        <div className="h-20 bg-slate-100 rounded-xl border border-slate-200/20" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="md:col-span-2 space-y-5">
          <div className="h-44 bg-slate-100 rounded-2xl border border-slate-200/20" />
          <div className="h-32 bg-slate-100 rounded-2xl border border-slate-200/20" />
        </div>
        <div className="space-y-5">
          <div className="h-36 bg-slate-100 rounded-2xl border border-slate-200/20" />
          <div className="h-36 bg-slate-100 rounded-2xl border border-slate-200/20" />
        </div>
      </div>
    </div>
  );
};