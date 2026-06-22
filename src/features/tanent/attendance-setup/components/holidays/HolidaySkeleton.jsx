import React from "react";

export const HolidaySkeleton = () => {
  return (
    <div className="w-full space-y-6 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, idx) => (
          <div key={idx} className="h-24 bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
            <div className="h-3 bg-slate-200 rounded-sm w-1/2" />
            <div className="h-6 bg-slate-300 rounded-md w-1/3" />
          </div>
        ))}
      </div>
      <div className="border border-slate-200 rounded-xl bg-white overflow-hidden">
        <div className="p-5 border-b border-slate-100 h-16 bg-slate-50" />
        <div className="p-6 space-y-4">
          {[...Array(5)].map((_, idx) => (
            <div key={idx} className="flex justify-between items-center py-2">
              <div className="space-y-2 w-1/4">
                <div className="h-4 bg-slate-200 rounded-md w-3/4" />
                <div className="h-3 bg-slate-100 rounded-sm w-1/2" />
              </div>
              <div className="h-6 bg-slate-200 rounded-full w-16" />
              <div className="h-4 bg-slate-200 rounded-md w-24" />
              <div className="h-6 bg-slate-200 rounded-md w-12" />
              <div className="h-4 bg-slate-100 rounded-sm w-8" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};