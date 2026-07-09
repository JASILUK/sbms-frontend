// # attendance/components/hrManagement/dashboard/DashboardChartsSkeleton.jsx

import React from 'react';

export const DashboardChartsSkeleton = React.memo(() => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm animate-pulse h-[320px]">
        <div className="w-32 h-3 bg-slate-200 rounded mb-4" />
        <div className="w-full h-[200px] bg-slate-100 rounded-xl" />
      </div>
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm animate-pulse h-[320px]">
        <div className="w-32 h-3 bg-slate-200 rounded mb-4" />
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 bg-slate-100 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
});

DashboardChartsSkeleton.displayName = 'DashboardChartsSkeleton';