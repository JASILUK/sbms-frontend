


import React from 'react';

export function FaceManagementSkeleton() {
  return (
    <div className="space-y-6 w-full animate-pulse p-1">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-20 bg-white border border-slate-100 rounded-2xl p-5 shadow-3xs" />
        ))}
      </div>
      <div className="h-14 bg-white border border-slate-100 rounded-2xl w-full shadow-3xs" />
      <div className="bg-white border border-slate-100 rounded-2xl h-80 w-full shadow-3xs" />
    </div>
  );
}