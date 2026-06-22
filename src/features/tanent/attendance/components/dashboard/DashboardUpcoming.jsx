import React from 'react';
import { CalendarCheck, ShieldEllipsis } from 'lucide-react';

export const DashboardUpcoming = React.memo(({ upcoming }) => {
  const holiday = upcoming?.next_holiday;
  const shift = upcoming?.next_shift;

  if (!holiday && !shift) return null;

  return (
    <div className="w-full bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
      <div>
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Upcoming Calendar Events</h3>
        <p className="text-[11px] text-slate-400 font-normal">Planned changes to schedule profiles and public holidays.</p>
      </div>

      <div className="flex flex-col gap-3">
        {holiday && (
          <div className="flex items-center gap-3 p-3 bg-slate-50/50 border border-slate-100 rounded-xl shadow-4xs">
            <div className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 shadow-4xs">
              <CalendarCheck className="h-4 w-4 stroke-[1.75]" />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Next Institutional Holiday</h4>
              <p className="text-xs font-bold text-slate-800 tracking-tight">
                {holiday.name} <span className="font-mono font-normal text-slate-400">({holiday.date})</span>
              </p>
            </div>
          </div>
        )}

        {shift && (
          <div className="flex items-center gap-3 p-3 bg-slate-50/50 border border-slate-100 rounded-xl shadow-4xs">
            <div className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 shadow-4xs">
              <ShieldEllipsis className="h-4 w-4 stroke-[1.75]" />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Scheduled Shift Allocation</h4>
              <p className="text-xs font-bold text-slate-800 tracking-tight">
                {shift.name} <span className="font-mono font-normal text-slate-400">({shift.start} - {shift.end})</span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

DashboardUpcoming.displayName = 'DashboardUpcoming';