import React from "react";
import { Sliders } from "lucide-react";

export default function LeaveBalanceCards({ balances, isHRMode, onTriggerAdjust }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {balances.map((row) => {
        const remaining = parseFloat(row.remaining_days || 0);
        const allocated = parseFloat(row.allocated_days || 1);
        const used = parseFloat(row.used_days || 0);
        const ratio = Math.min(100, Math.max(0, (remaining / allocated) * 100));

        let ringColor = "stroke-emerald-500";
        if (ratio < 20) ringColor = "stroke-rose-500";
        else if (ratio >= 20 && ratio <= 50) ringColor = "stroke-amber-500";

        return (
          <div key={row.id} className="bg-white border border-slate-200/80 rounded-2xl p-4 flex items-center justify-between shadow-3xs group relative overflow-hidden">
            <div className="space-y-2">
              <div className="flex items-start gap-1">
                <div>
                  <h4 className="text-sm font-black text-slate-800 tracking-tight">{row.leave_type?.name || "Unknown Policy"}</h4>
                  <p className="text-[10px] font-mono text-slate-400 uppercase font-bold">{row.leave_type?.code}</p>
                </div>
                
                {/* ✅ HR MANUALLY ADJUSTMENT TRIGGER ACTION TRIGGER */}
                {isHRMode && (
                  <button 
                    onClick={() => onTriggerAdjust(row)}
                    className="p-1 hover:bg-slate-100 border border-transparent hover:border-slate-200 text-slate-400 hover:text-slate-900 rounded-lg transition-all absolute top-2 right-2 cursor-pointer"
                    title="Adjust Balance Ledger"
                  >
                    <Sliders className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
              
              <div className="flex gap-4 text-xs font-medium text-slate-500 font-mono pt-1">
                <div>Allocated: <span className="text-slate-800 font-bold">{allocated}</span></div>
                <div>Used: <span className="text-slate-800 font-bold">{used}</span></div>
              </div>
            </div>

            <div className="relative w-14 h-14 flex items-center justify-center flex-shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path className="stroke-slate-100" strokeWidth="3" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className={`${ringColor} transition-all duration-500`} strokeDasharray={`${ratio}, 100`} strokeWidth="3" strokeLinecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xs font-black text-slate-800 font-mono leading-none">{remaining}</span>
                <span className="text-[7px] font-bold uppercase text-slate-400">Left</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}