import React from 'react';
import { MapPin, Compass, ShieldCheck } from 'lucide-react';

export const AllowedLocationsSelector = React.memo(({ 
  locations = [], 
  value = [], 
  onChange, 
  disabled,
  isLoading = false 
}) => {
  const activeSelectedValues = Array.isArray(value) ? value : [];

  const handleToggle = (locId) => {
    if (disabled) return;
    
    const numericId = Number(locId);
    const stringId = String(locId);

    const isChecked = activeSelectedValues.includes(numericId) || activeSelectedValues.includes(stringId);

    const nextValue = isChecked
      ? activeSelectedValues.filter(item => Number(item) !== numericId && String(item) !== stringId)
      : [...activeSelectedValues, numericId];

    onChange(nextValue);
  };

  // Premium Shimmer Loading State Matching the Row Geometry
  if (isLoading) {
    return (
      <div className="border border-slate-200/80 rounded-2xl bg-white divide-y divide-slate-100 overflow-hidden shadow-3xs">
        {[1, 2].map((idx) => (
          <div key={idx} className="flex items-center justify-between p-4 bg-white animate-pulse">
            <div className="flex items-center gap-3.5 flex-1 min-w-0">
              <div className="w-8 h-8 bg-slate-100 rounded-xl flex-shrink-0" />
              <div className="space-y-2 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <div className="h-3 bg-slate-100 rounded w-1/3" />
                  <div className="h-3 bg-slate-100 rounded w-12" />
                </div>
                <div className="h-2.5 bg-slate-100 rounded w-3/4" />
              </div>
            </div>
            <div className="w-4 h-4 bg-slate-100 rounded ml-4 flex-shrink-0" />
          </div>
        ))}
      </div>
    );
  }

  // Polished Operational Empty State Layout
  if (!locations || locations.length === 0) {
    return (
      <div className="text-center p-8 border border-dashed border-slate-200 bg-slate-50/50 rounded-2xl max-w-xl mx-auto flex flex-col items-center justify-center gap-2 animate-fadeIn">
        <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-3xs text-slate-400">
          <Compass className="h-4 w-4 text-slate-400" />
        </div>
        <p className="text-xs font-bold text-slate-800 tracking-tight">No Active Spatial Perimeters Found</p>
        <p className="text-[11px] text-slate-400 font-normal leading-relaxed max-w-xs">
          Please establish verified geo-coordinates and boundary perimeters inside the Deployed Geofences tab first.
        </p>
      </div>
    );
  }

  return (
    <div className="border border-slate-200 rounded-2xl bg-white divide-y divide-slate-100 max-h-60 overflow-y-auto shadow-3xs overflow-hidden transition-all duration-300 animate-fadeIn custom-scrollbar">
      {locations.map((loc) => {
        const isChecked = activeSelectedValues.includes(loc.id) || activeSelectedValues.includes(String(loc.id));

        return (
          <div
            key={loc.id}
            onClick={() => handleToggle(loc.id)}
            className={`group flex items-center justify-between p-3.5 text-xs transition-all duration-200 select-none ${
              disabled 
                ? 'cursor-not-allowed opacity-40 bg-slate-50/30' 
                : 'cursor-pointer hover:bg-slate-50/50 active:scale-[0.998]'
            } ${isChecked ? 'bg-slate-50/30' : ''}`}
          >
            <div className="flex items-center gap-3.5 min-w-0 pr-4">
              {/* Premium Geometric Geolocation Icon Wrapper Frame */}
              <div className={`p-2 rounded-xl border flex-shrink-0 transition-all duration-300 ${
                isChecked 
                  ? 'bg-slate-900 border-slate-950 text-white shadow-3xs rotate-6' 
                  : 'bg-slate-50 border-slate-100 text-slate-400 group-hover:bg-slate-100 group-hover:text-slate-600'
              }`}>
                <MapPin className="h-4 w-4" />
              </div>

              {/* Text Metadata Configuration Layout Panel */}
              <div className="min-w-0 space-y-1">
                <div className="flex items-center gap-2.5">
                  <span className={`truncate text-xs tracking-tight transition-colors ${
                    isChecked ? 'font-bold text-slate-900' : 'font-semibold text-slate-700 group-hover:text-slate-900'
                  }`}>
                    {loc.name}
                  </span>
                  
                  {/* Custom Radius Monospace Badge */}
                  <span className={`text-[9px] font-bold font-mono px-2 py-0.5 rounded-md border tracking-wide flex items-center gap-1 flex-shrink-0 ${
                    isChecked
                      ? 'bg-slate-900/5 border-slate-900/10 text-slate-800'
                      : 'bg-slate-100 border-slate-200/60 text-slate-500'
                  }`}>
                    <ShieldCheck className="h-2.5 w-2.5 stroke-[2.5]" />
                    r:{loc.radius_meters}m
                  </span>
                </div>
                
                {loc.address && (
                  <p className="text-[10px] text-slate-400 font-normal truncate max-w-md sm:max-w-xl group-hover:text-slate-500 transition-colors leading-normal">
                    {loc.address}
                  </p>
                )}
              </div>
            </div>
            
            {/* Interactive Custom Checkbox Ingestion Frame */}
            <div className="relative flex items-center justify-center ml-4 flex-shrink-0">
              <input
                type="checkbox"
                checked={isChecked}
                disabled={disabled}
                onChange={() => {}} // Controlled row tap callbacks event interception proxy
                className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 focus:ring-offset-0 accent-slate-900 cursor-pointer transition-all duration-200"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
});

AllowedLocationsSelector.displayName = 'AllowedLocationsSelector';