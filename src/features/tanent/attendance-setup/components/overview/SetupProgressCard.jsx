// attendance-setup/components/overview/SetupProgressCard.jsx
import React from "react";

export const SetupProgressCard = ({ score, count }) => (
  <div className="relative overflow-hidden bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
    <div className="absolute top-0 left-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 w-full" />
    
    <div className="space-y-2 text-center md:text-left">
      <h3 className="text-3xl font-black text-slate-900 tracking-tight">{score}% Complete</h3>
      <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
        {count} of 5 organizational configuration modules successfully mapped
      </p>
    </div>

    <div className="w-full md:max-w-md space-y-2">
      <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${score}%` }}
        />
      </div>
      <div className="flex justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wide">
        <span>Structural Baseline</span>
        <span>Launch Matrix</span>
      </div>
    </div>
  </div>
);