import React from 'react';
import { HelpCircle } from 'lucide-react';

export const RadiusPreviewCard = React.memo(({ lat, lon, radius = 150 }) => {
  const safeLat = typeof lat === 'number' && !isNaN(lat) ? lat.toFixed(5) : '0.00000';
  const safeLon = typeof lon === 'number' && !isNaN(lon) ? lon.toFixed(5) : '0.00000';

  return (
    <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2 text-xs leading-relaxed">
      <div className="flex gap-2 items-center text-slate-800 font-bold">
        <HelpCircle className="h-4 w-4 text-slate-400 flex-shrink-0" />
        <span>Geofence Parameters Summary</span>
      </div>
      <div className="space-y-1 font-medium text-slate-600 pl-6">
        <p>Center Pivot Vector: <span className="font-mono text-slate-900 text-[11px] font-bold">{safeLat}, {safeLon}</span></p>
        <p>Perimeter Envelope Scale: <span className="text-slate-900 font-bold">{radius} meters</span></p>
      </div>
      <p className="text-[11px] text-slate-500 pl-6 leading-normal font-medium">
        Workforce profile members must present authorization tokens within approximately <span className="font-bold text-slate-800">{radius} meters</span> of this coordinate pivot point to authenticate successful attendance records logs.
      </p>
    </div>
  );
});

RadiusPreviewCard.displayName = 'RadiusPreviewCard';