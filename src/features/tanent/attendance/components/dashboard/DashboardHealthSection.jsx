import React, { useMemo } from 'react';
import { Percent, Award, ShieldAlert } from 'lucide-react';

export const DashboardHealthSection = React.memo(({ summary }) => {
  const currentDaysInMonth = new Date().getDate();
  
  const presentRate = useMemo(() => {
    if (!summary?.present_days || summary.present_days <= 0) return 0;
    return Math.min(100, Math.round((summary.present_days / currentDaysInMonth) * 100));
  }, [summary?.present_days, currentDaysInMonth]);

  return (
    <div className="w-full bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
      <div>
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Attendance Cycle Health</h3>
        <p className="text-[11px] text-slate-400 font-normal">Real-time indicators tracking active policy compliance parameters.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
        
        {/* Present Rate Indicator Progress Track */}
        <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/40 space-y-3">
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <Percent className="h-4 w-4 text-slate-600 stroke-[1.75]" />
              <span>Month Adherence Velocity</span>
            </div>
            <span className="font-mono text-xs font-black text-slate-900">{presentRate}%</span>
          </div>
          
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-indigo-600 transition-all duration-500 ease-out"
              style={{ width: `${presentRate}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-400 font-normal leading-normal">
            Calculated across {summary?.present_days || 0} active attendance vectors reported in the current billing loop.
          </p>
        </div>

        {/* Overtime Metric Box */}
        <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/40 flex items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <Award className="h-4 w-4 text-slate-600 stroke-[1.75]" />
              <span>Accumulated Overtime</span>
            </div>
            <p className="text-[10px] text-slate-400 font-normal leading-normal max-w-[200px]">
              Approved minutes logged outside standard effective date ranges.
            </p>
          </div>
          
          <div className="text-right flex-shrink-0">
            <span className="text-2xl font-black text-slate-900 font-mono tracking-tight">
              {summary?.overtime_hours || '0.0'}
            </span>
            <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider font-mono">Hours</span>
          </div>
        </div>

      </div>
    </div>
  );
});

DashboardHealthSection.displayName = 'DashboardHealthSection';