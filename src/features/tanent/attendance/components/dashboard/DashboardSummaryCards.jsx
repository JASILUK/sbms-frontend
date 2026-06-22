import React from 'react';
import { LogIn, LogOut, Hourglass } from 'lucide-react';
import { formatMinutesToHours } from '../../utils/dashboardHelpers';

export const DashboardSummaryCards = React.memo(({ today }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
      
      {/* Check In */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-3xs flex items-center gap-3.5">
        <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-slate-600 shadow-4xs">
          <LogIn className="h-4 w-4 stroke-[1.75]" />
        </div>
        <div className="space-y-0.5">
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">First Check In</h4>
          <p className="text-sm font-black text-slate-800 font-mono">
            {today?.check_in || '--:--:--'}
          </p>
        </div>
      </div>

      {/* Check Out */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-3xs flex items-center gap-3.5">
        <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-slate-600 shadow-4xs">
          <LogOut className="h-4 w-4 stroke-[1.75]" />
        </div>
        <div className="space-y-0.5">
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Last Check Out</h4>
          <p className="text-sm font-black text-slate-800 font-mono">
            {today?.check_out || '--:--:--'}
          </p>
        </div>
      </div>

      {/* Total Active Work Minutes */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-3xs flex items-center gap-3.5">
        <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-slate-600 shadow-4xs">
          <Hourglass className="h-4 w-4 stroke-[1.75]" />
        </div>
        <div className="space-y-0.5">
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Logged Hours Today</h4>
          <p className="text-sm font-black text-slate-800 font-mono">
            {formatMinutesToHours(today?.working_minutes)}
          </p>
        </div>
      </div>

    </div>
  );
});

DashboardSummaryCards.displayName = 'DashboardSummaryCards';