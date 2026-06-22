import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import { formatTimeToAmPm } from '../../utils/dashboardHelpers';

export const DashboardHeader = React.memo(({ employee, shift }) => {
  const currentFormattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-5">
      <div className="space-y-1">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Good Morning, {employee?.name || employee?.username || 'Team Member'}
        </h1>
        <div className="flex items-center gap-2 text-[11px] text-slate-400 font-normal">
          <Calendar className="h-3.5 w-3.5 text-slate-400" />
          <span>{currentFormattedDate}</span>
        </div>
      </div>
      
      {shift ? (
        <div className="flex items-center gap-3 bg-slate-50/80 border border-slate-200/60 rounded-xl px-4 py-2.5 shadow-4xs">
          <div className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-600 shadow-4xs">
            <Clock className="h-4 w-4 stroke-[1.75]" />
          </div>
          <div className="space-y-0.5">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Current Assigned Shift</h4>
            <p className="text-xs font-bold text-slate-800 tracking-tight">
              {shift.name} <span className="font-normal text-slate-400 mx-1">|</span> {formatTimeToAmPm(shift.start)} – {formatTimeToAmPm(shift.end)}
            </p>
          </div>
        </div>
      ) : (
        <div className="text-[11px] font-medium text-slate-400 italic bg-slate-50 rounded-xl px-3 py-2 border border-dashed border-slate-200">
          No active shift assigned today
        </div>
      )}
    </div>
  );
});

DashboardHeader.displayName = 'DashboardHeader';