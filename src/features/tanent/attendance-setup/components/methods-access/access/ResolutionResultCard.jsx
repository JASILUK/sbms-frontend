import React from 'react';
import { GitBranch, Fingerprint, MapPin, CheckSquare, ShieldCheck, Map } from 'lucide-react';

export const ResolutionResultCard = React.memo(({ result }) => {
  // Exit gracefully if the prop is totally empty
  if (!result) return null;

  // ✅ DEFENSIVE EXTRACT MATRIX: Auto-unpack the envelope if "data" exists, else fallback onto root
  const payload = result.data ? result.data : result;

  // Safety check: ensure the payload object contains real properties before executing layout loops
  if (!payload.source && !payload.validation_mode) return null;

  const sourceBanners = {
    override: { label: 'Individual Employee Override', color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
    rule: { label: 'Scoped Conditional Access Rule', color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' },
    default: { label: 'Global Corporate Fallback Default', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' }
  };

  const currentSource = sourceBanners[payload.source] || { 
    label: 'Calculated Structural Resolution', 
    color: 'text-slate-400 bg-slate-500/10 border-slate-500/20' 
  };

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl grid grid-cols-1 md:grid-cols-5 gap-6 animate-scaleUp text-xs font-medium text-slate-300">
      
      {/* Upper Matrix Context Panel Column */}
      <div className="md:col-span-2 space-y-4">
        <div className="space-y-1.5">
          <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider flex items-center gap-1.5">
            <GitBranch className="h-3.5 w-3.5" /> 
            Hierarchy Evaluation Origin
          </span>
          <div className={`px-3 py-1.5 border rounded-xl text-xs font-bold tracking-wide uppercase inline-flex items-center gap-2 ${currentSource.color}`}>
            <ShieldCheck className="h-4 w-4 flex-shrink-0" /> 
            {currentSource.label}
          </div>
        </div>

        <div className="space-y-1.5 pt-2 border-t border-slate-900">
          <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider block">
            Enforcement Severity Mode
          </span>
          <span className={`inline-block font-mono font-black text-xs px-2.5 py-1 rounded-lg border shadow-inner ${
            payload.validation_mode === 'ALL'
              ? 'bg-amber-950/40 border-amber-900 text-amber-400'
              : 'bg-blue-950/40 border-blue-900 text-blue-400'
          }`}>
            {payload.validation_mode === 'ALL' ? 'ALL (Multi-Layer Enforced)' : 'ANY (Adaptive Choice)'}
          </span>
        </div>
      </div>

      {/* Dynamic Channels and Spatial Coordinates Render Columns */}
      <div className="md:col-span-3 border-t md:border-t-0 md:border-l border-slate-900 pt-4 md:pt-0 md:pl-6 space-y-4 flex flex-col justify-between">
        <div className="space-y-3.5">
          
          {/* Section 1: Allowed Routing Channels */}
          <div className="space-y-1.5">
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Fingerprint className="h-3.5 w-3.5 text-slate-600" /> 
              Permitted Clearance Channels:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {payload.methods?.map(methodToken => (
                <span 
                  key={methodToken} 
                  className="px-2.5 py-0.5 bg-slate-900 border border-slate-800 text-slate-200 rounded-md font-bold uppercase tracking-wide text-[10px] shadow-sm"
                >
                  {methodToken}
                </span>
              ))}
              {(!payload.methods || payload.methods.length === 0) && (
                <span className="text-rose-400 italic font-semibold text-[11px]">System Locked: No Verification Methods Permitted</span>
              )}
            </div>
          </div>

          {/* Section 2: Active Locations Geofences */}
          <div className="space-y-2 pt-1.5">
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-slate-600" /> 
              Active Geofence Constraints:
            </span>
            <div className="flex flex-col gap-1.5 max-h-40 overflow-y-auto scrollbar-thin pr-1">
              {payload.locations?.map(loc => (
                <div 
                  key={loc.id} 
                  className="p-2.5 bg-slate-900/60 border border-slate-800/80 rounded-xl flex items-start gap-3 text-[11px] text-slate-300 shadow-4xs"
                >
                  <Map className="h-4 w-4 text-slate-500 mt-0.5 flex-shrink-0" />
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <span className="font-bold text-slate-100 block truncate">{loc.name}</span>
                    <span className="text-[10px] text-slate-500 font-mono block">
                      Coords: {loc.latitude.toFixed(4)}°, {loc.longitude.toFixed(4)}° | Radius: {loc.radius_meters}m
                    </span>
                  </div>
                </div>
              ))}
              {(!payload.locations || payload.locations.length === 0) && (
                <span className="text-slate-500 italic text-[11px] pl-1">
                  No explicit geographic perimeter blocks bound to this rule resolution strategy context.
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Informational Verification Disclaimer */}
        <div className="p-2.5 bg-slate-950/80 border border-slate-900 rounded-xl text-[10px] text-slate-500 flex gap-2 items-start mt-2">
          <CheckSquare className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5 stroke-[2.5]" />
          <p className="leading-normal font-normal">
            Simulation trace executed successfully. This computed profile represents the active verification boundary conditions used during live sign-in evaluation.
          </p>
        </div>
      </div>

    </div>
  );
});