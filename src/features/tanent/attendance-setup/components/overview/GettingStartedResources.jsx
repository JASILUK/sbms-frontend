// attendance-setup/components/overview/GettingStartedResources.jsx
import React from "react";
import { Fingerprint, Landmark, FileBarChart2 } from "lucide-react";

export const GettingStartedResources = () => (
  <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-3xs space-y-4">
    <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider">Next Operations Phases</h4>
    
    <div className="space-y-3.5">
      <div className="flex gap-3 items-start opacity-60">
        <div className="p-1.5 bg-slate-50 rounded-md border border-slate-100 text-slate-500"><Fingerprint className="h-3.5 w-3.5" /></div>
        <div>
          <h5 className="text-xs font-bold text-slate-800">Daily Log Channels</h5>
          <p className="text-[11px] text-slate-400 leading-normal mt-0.5">Asynchronous punch-in handling frameworks via web portal or biometric links.</p>
        </div>
      </div>

      <div className="flex gap-3 items-start opacity-60">
        <div className="p-1.5 bg-slate-50 rounded-md border border-slate-100 text-slate-500"><Landmark className="h-3.5 w-3.5" /></div>
        <div>
          <h5 className="text-xs font-bold text-slate-800">Regularization Portal</h5>
          <p className="text-[11px] text-slate-400 leading-normal mt-0.5">Employee correction flows processing missed logs or unexpected absences.</p>
        </div>
      </div>

      <div className="flex gap-3 items-start opacity-60">
        <div className="p-1.5 bg-slate-50 rounded-md border border-slate-100 text-slate-500"><FileBarChart2 className="h-3.5 w-3.5" /></div>
        <div>
          <h5 className="text-xs font-bold text-slate-800">Audits & Reports Export</h5>
          <p className="text-[11px] text-slate-400 leading-normal mt-0.5">Payroll-ready summaries containing aggregated hours worked, lateness, and overtime.</p>
        </div>
      </div>
    </div>
  </div>
);