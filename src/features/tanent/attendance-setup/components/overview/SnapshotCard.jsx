// attendance-setup/components/overview/SnapshotCard.jsx
import React from "react";
import { ShieldCheck } from "lucide-react";

export const SnapshotCard = ({ modules }) => {
  const daysString = modules.schedule.raw?.work_days?.map(d => d.substring(0,3)).join(", ") || "None Configured";
  
  return (
    <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 text-slate-300 shadow-xl space-y-4 font-mono text-xs">
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-white font-sans font-bold">
        <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
        <span>System Setup Snapshot</span>
      </div>
      
      <div className="space-y-3 leading-normal">
        <div>
          <span className="text-slate-500 block text-[10px] font-bold uppercase font-sans tracking-wide">Schedule Framework</span>
          <span className="text-white block truncate">{daysString}</span>
          <span className="text-slate-400 text-[11px] block">{modules.schedule.raw?.timezone || "Timezone Unmapped"}</span>
        </div>
        <div>
          <span className="text-slate-500 block text-[10px] font-bold uppercase font-sans tracking-wide">Policy Guardrails</span>
          <span className="text-white block">Required: {modules.policy.raw?.required_hours || 0} Hours/Day</span>
          <span className="text-slate-400 text-[11px] block">Late Limit: {modules.policy.raw?.late_threshold_minutes || 0}m Threshold</span>
        </div>
        <div>
          <span className="text-slate-500 block text-[10px] font-bold uppercase font-sans tracking-wide">Data Matrix Logs</span>
          <span className="text-white block">Holidays: {modules.holidays.raw?.length || 0} Days Mapped</span>
          <span className="text-white block">Assignments: {modules.assignments.raw?.length || 0} Live Links</span>
        </div>
      </div>
    </div>
  );
};
