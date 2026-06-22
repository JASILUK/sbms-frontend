import React from 'react';
import { ScanFace, Shield } from 'lucide-react';

export function FacePolicyHero({ isReadOnly }) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-fadeIn">
      <div className="flex gap-4 items-center">
        <div className="p-3 bg-slate-900 border border-slate-950 rounded-xl text-white shadow-xs">
          <ScanFace className="h-6 w-6 stroke-[1.5]" />
        </div>
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-black text-slate-900 uppercase tracking-wide">Face Enrollment Policy Strategy</h1>
            <span className="px-2 py-0.5 text-[9px] bg-slate-100 border text-slate-800 font-extrabold uppercase rounded-md tracking-wider flex items-center gap-1">
              <Shield className="h-2.5 w-2.5 text-slate-600" /> Enterprise Security
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-normal max-w-xl leading-relaxed">
            Define registration workflows for facial template matrices. Biometric feature arrays are securely hashed locally; source images are discarded instantly.
          </p>
        </div>
      </div>

      {isReadOnly && (
        <span className="px-2.5 py-1 text-[10px] font-black uppercase rounded-lg bg-amber-50 border border-amber-200 text-amber-800 tracking-wider">
          View Only Mode
        </span>
      )}
    </div>
  );
}