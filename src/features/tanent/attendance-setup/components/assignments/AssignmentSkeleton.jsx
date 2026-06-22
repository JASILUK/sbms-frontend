import React from "react";

export const AssignmentSkeleton = () => {
  return (
    <div className="space-y-5 w-full animate-pulse">
      {/* Cards Row Grid Simulator */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 bg-slate-100 border border-slate-200 rounded-xl" />
        ))}
      </div>
      {/* Searchbar wrapper */}
      <div className="h-14 bg-slate-50 border border-slate-200 rounded-xl w-full" />
      {/* Big presentation container shell simulation */}
      <div className="border border-slate-200 rounded-xl overflow-hidden bg-white h-64" />
    </div>
  );
};