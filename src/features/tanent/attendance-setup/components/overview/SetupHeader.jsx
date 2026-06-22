// attendance-setup/components/overview/SetupHeader.jsx
import React from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";

export const SetupHeader = ({ isReady }) => (
  <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
    <div className="space-y-1">
      <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Attendance Setup</h1>
      <p className="text-sm text-slate-500 max-w-2xl">
        Configure corporate working schedules, governance frameworks, holiday registries, and employee assignments before enabling logging mechanisms.
      </p>
    </div>
    
    <div className="shrink-0 self-start sm:self-center">
      <span className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold uppercase tracking-wider border shadow-3xs ${
        isReady 
          ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
          : "bg-amber-50 text-amber-700 border-amber-200"
      }`}>
        {isReady ? (
          <>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Attendance Ready
          </>
        ) : (
          <>
            <AlertCircle className="h-4 w-4 text-amber-500 animate-pulse" /> Setup In Progress
          </>
        )}
      </span>
    </div>
  </header>
);