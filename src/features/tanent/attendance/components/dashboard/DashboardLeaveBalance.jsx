import React from 'react';
import { CalendarX2 } from 'lucide-react';

export const DashboardLeaveBalance = React.memo(({ leave }) => {
  if (!leave || leave.enabled === false) {
    return (
      <div className="w-full bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-3">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Leave Balance Pipeline</h3>
        <div className="border border-dashed border-slate-200 bg-slate-50/50 rounded-xl p-6 text-center flex flex-col items-center justify-center space-y-2">
          <CalendarX2 className="h-5 w-5 text-slate-400 stroke-[1.5]" />
          <p className="text-[11px] text-slate-400 font-medium leading-normal max-w-[240px]">
            Leave information unavailable. Integration ledger is currently incomplete.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Leave Balance Pipeline</h3>
      <div className="grid grid-cols-1 gap-2">
        {leave.balances?.map((b, idx) => (
          <div key={idx} className="flex justify-between items-center p-3 border border-slate-100 rounded-xl bg-slate-50/40">
            <span className="text-xs font-bold text-slate-700">{b.type}</span>
            <span className="font-mono font-black text-xs text-slate-900">{b.available} available</span>
          </div>
        ))}
      </div>
    </div>
  );
});

DashboardLeaveBalance.displayName = 'DashboardLeaveBalance';