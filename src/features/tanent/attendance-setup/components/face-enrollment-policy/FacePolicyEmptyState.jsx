import React, { useState } from 'react';
import { ShieldOff, Compass, ShieldAlert, AlertTriangle } from 'lucide-react';



export function FacePolicyEmptyState({ onInitialize, canManage }) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-8 shadow-2xs flex flex-col items-center text-center max-w-lg mx-auto my-6 animate-scaleUp space-y-4">
      <div className="p-3 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-2xl shadow-4xs">
        <Compass className="h-7 w-7 stroke-[1.5]" />
      </div>
      <div className="space-y-1">
        <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">No Face Enrollment Policy Configured</h3>
        <p className="text-[11px] text-slate-400 font-normal max-w-xs">
          Choose how facial biometric registration workflows should operate across your global corporate tenant workspace parameters.
        </p>
      </div>
      {canManage && (
        <button
          type="button"
          onClick={onInitialize}
          className="px-4 py-2 text-white bg-slate-900 hover:bg-slate-800 font-bold rounded-xl shadow-xs active:scale-98 transition-all"
        >
          Initialize Policy
        </button>
      )}
    </div>
  );
}