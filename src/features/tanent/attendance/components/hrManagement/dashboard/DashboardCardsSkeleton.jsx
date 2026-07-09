// # attendance/components/hrManagement/dashboard/DashboardCardsSkeleton.jsx

import React from 'react';

export const DashboardCardsSkeleton = React.memo(() => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 w-full">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm animate-pulse">
          <div className="w-20 h-2.5 bg-slate-200 rounded mb-4" />
          <div className="w-12 h-8 bg-slate-200 rounded" />
        </div>
      ))}
    </div>
  );
});

DashboardCardsSkeleton.displayName = 'DashboardCardsSkeleton';