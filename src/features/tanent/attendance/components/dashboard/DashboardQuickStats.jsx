import React from 'react';
import { AlertCircle, AlertTriangle, HelpCircle } from 'lucide-react';

export const DashboardQuickStats = React.memo(({ summary, pending }) => {
  return (
    <div className="w-full bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
      <div>
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Exception & Tracking Matrix</h3>
        <p className="text-[11px] text-slate-400 font-normal">Summary indicators highlighting flags that modify payroll compilation logic.</p>
      </div>

      <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
        
        {/* Late Days */}
        <div className="border border-slate-100 rounded-xl p-3.5 bg-slate-50/30 flex flex-col items-center justify-center text-center space-y-1">
          <AlertCircle className="h-4 w-4 text-amber-500 stroke-[1.75]" />
          <span className="text-base font-black text-slate-800 font-mono tracking-tight">
            {summary?.late_days || 0}
          </span>
          <h4 className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Late Days</h4>
        </div>

        {/* Absent Days */}
        <div className="border border-slate-100 rounded-xl p-3.5 bg-slate-50/30 flex flex-col items-center justify-center text-center space-y-1">
          <AlertTriangle className="h-4 w-4 text-rose-500 stroke-[1.75]" />
          <span className="text-base font-black text-slate-800 font-mono tracking-tight">
            {summary?.absent_days || 0}
          </span>
          <h4 className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Absences</h4>
        </div>

        {/* Pending Corrections Requests */}
        <div className="border border-slate-100 rounded-xl p-3.5 bg-slate-50/30 flex flex-col items-center justify-center text-center space-y-1">
          <HelpCircle className="h-4 w-4 text-indigo-500 stroke-[1.75]" />
          <span className="text-base font-black text-slate-800 font-mono tracking-tight">
            {pending?.count || 0}
          </span>
          <h4 className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Open Audits</h4>
        </div>

      </div>
    </div>
  );
});

DashboardQuickStats.displayName = 'DashboardQuickStats';