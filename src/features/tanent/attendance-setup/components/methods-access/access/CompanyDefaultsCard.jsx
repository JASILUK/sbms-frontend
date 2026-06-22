import React from 'react';
import { ShieldAlert, Fingerprint, MapPin, Edit3 } from 'lucide-react';

export const CompanyDefaultsCard = React.memo(({ defaults, methodMap, locationMap, onTriggerEdit }) => {
  if (!defaults) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5 text-xs font-medium text-slate-700 animate-fadeIn">
      <div className="flex justify-between items-center border-b border-slate-100 pb-4">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <div className="p-1.5 bg-slate-100 border border-slate-200/60 rounded-lg text-slate-900">
              <ShieldAlert className="h-4 w-4 text-slate-700" />
            </div>
            Global Organization Fallback Default Policy Profile
          </h3>
          <p className="text-[11px] text-slate-400 font-normal pl-9">
            Applied universally when an employee matches no customized priorities policies context rules.
          </p>
        </div>
        <button
          type="button"
          onClick={onTriggerEdit}
          className="inline-flex items-center justify-center px-3 py-1.5 border border-slate-200 rounded-xl bg-white text-slate-800 font-bold hover:bg-slate-50 active:scale-98 transition-all gap-1.5 shadow-3xs"
        >
          <Edit3 className="h-3.5 w-3.5" /> Modify Baseline Defaults
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Module 1: Enforcement Severity Display */}
        <div className="bg-slate-50/50 border border-slate-100 p-4 rounded-xl space-y-2">
          <span className="text-[10px] uppercase text-slate-400 font-bold tracking-wider block">Verification Enforcement level</span>
          <span className="font-bold text-slate-900 text-xs px-2.5 py-1 bg-white rounded-md border inline-block shadow-4xs">
            {defaults.validation_mode === 'PRIMARY' && 'Primary Method Only'}
            {defaults.validation_mode === 'ANY' && 'Any Method Allowed'}
            {defaults.validation_mode === 'ALL' && 'All Methods Required'}
            {!['PRIMARY', 'ANY', 'ALL'].includes(defaults.validation_mode) && defaults.validation_mode}
          </span>
        </div>

        {/* Module 2: Allowed Verification Channels */}
        <div className="bg-slate-50/50 border border-slate-100 p-4 rounded-xl space-y-2">
          <span className="text-[10px] uppercase text-slate-400 font-bold tracking-wider flex items-center gap-1.5">
            <Fingerprint className="h-3.5 w-3.5 text-slate-400" /> 
            Channels Allowed
          </span>
          <div className="flex flex-wrap gap-1.5">
            {defaults.allowed_methods?.map((m) => {
              // ✅ FIXED: Handle both full method records or primitive ID keys defensively
              const isObjectShape = typeof m === 'object' && m !== null;
              const lookupId = isObjectShape ? m.id : m;
              const mappedRecord = methodMap?.get(Number(lookupId));
              
              const renderKey = isObjectShape ? `obj-${m.id}` : `val-${m}`;
              const displayName = isObjectShape 
                ? (m.method_display || m.method) 
                : (mappedRecord ? (mappedRecord.method_display || mappedRecord.method) : `Channel Ref: ${m}`);

              return (
                <span 
                  key={renderKey} 
                  className="px-2 py-0.5 bg-white border border-slate-200 rounded-md text-[10px] font-bold text-slate-800 uppercase tracking-wide shadow-4xs"
                >
                  {displayName}
                </span>
              );
            })}
            {defaults.allowed_methods?.length === 0 && <span className="text-slate-400 italic">No access parameters allocated.</span>}
          </div>
        </div>

        {/* Module 3: Active Geofencing Perimeters */}
        <div className="bg-slate-50/50 border border-slate-100 p-4 rounded-xl space-y-2">
          <span className="text-[10px] uppercase text-slate-400 font-bold tracking-wider flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-slate-400" /> 
            Active Geofences Bound
          </span>
          <div className="flex flex-wrap gap-1.5">
            {defaults.allowed_locations?.map((loc) => {
              // ✅ FIXED: Handle both full location objects or primitive primary keys defensively
              const isObjectShape = typeof loc === 'object' && loc !== null;
              const lookupId = isObjectShape ? loc.id : loc;
              const locationRecord = locationMap?.get(Number(lookupId));
              
              const renderKey = isObjectShape ? `loc-obj-${loc.id}` : `loc-val-${loc}`;
              const displayName = isObjectShape 
                ? loc.name 
                : (locationRecord ? locationRecord.name : `Perimeter Ref: ${loc}`);

              return (
                <span 
                  key={renderKey} 
                  className="px-2 py-0.5 bg-white border border-slate-200 rounded-md text-[10px] font-semibold text-slate-800 shadow-4xs"
                >
                  {displayName}
                </span>
              );
            })}
            {defaults.allowed_locations?.length === 0 && <span className="text-slate-400 italic">No geographic geofence bindings assigned.</span>}
          </div>
        </div>
      </div>
    </div>
  );
});

CompanyDefaultsCard.displayName = 'CompanyDefaultsCard';