import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldOff, ArrowRight, HelpCircle } from 'lucide-react';

export function FacePolicyGatekeeperState() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-12 shadow-sm flex flex-col items-center text-center max-w-xl mx-auto my-12 animate-fadeIn space-y-6 text-xs font-medium text-slate-700">
      
      {/* Visual Identity Ring Badge */}
      <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl shadow-3xs ring-4 ring-rose-50/50 animate-pulse-slow">
        <ShieldOff className="h-8 w-8 stroke-[1.5]" />
      </div>
      
      {/* Typography Description Set */}
      <div className="space-y-2 max-w-sm">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          Face Attendance Not Enabled
        </h2>
        <p className="text-[11px] text-slate-400 font-normal leading-relaxed">
          Biometric face enrollment policy matrices are gatekept and hidden until the global **Facial Recognition Engine** verification method is turned on for this company workspace context.
        </p>
      </div>

      {/* Action Navigation Matrix */}
      <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto">
        {/* ✅ FIXED: Uses native client-side Link wrapper to prevent page flashes and maintain RTK Query caches */}
        <Link
          to="/app/setup-attendance/methods"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-white bg-slate-900 hover:bg-slate-800 font-bold rounded-xl shadow-xs active:scale-98 transition-all duration-200 group w-full sm:w-auto cursor-pointer"
        >
          <span>Go to Attendance Methods</span>
          <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-white transition-colors duration-200 transform group-hover:translate-x-0.5" />
        </Link>
        
        <button 
          type="button" 
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 hover:border-slate-300 font-bold rounded-xl shadow-3xs active:scale-98 transition-all duration-200 w-full sm:w-auto cursor-pointer"
        >
          <HelpCircle className="h-3.5 w-3.5 text-slate-400" />
          <span>Documentation Setup Guides</span>
        </button>
      </div>

    </div>
  );
}