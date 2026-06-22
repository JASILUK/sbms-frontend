import React from 'react';
import { Eye, Edit2, ShieldAlert, ShieldCheck } from 'lucide-react';

export const LocationCard = React.memo(({ loc, onView, onEdit, onToggleStatus, isUpdating }) => {
  // FIXED: Explicitly parse variables to numeric data types to prevent crashing on string responses
  const safeLat = Number(loc.latitude || 0).toFixed(6);
  const safeLon = Number(loc.longitude || 0).toFixed(6);

  return (
    <div className="block md:hidden bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-3 text-xs font-medium">
      <div className="flex justify-between items-start">
        <div className="space-y-0.5">
          <h3 className="font-bold text-slate-900 text-sm">{loc.name}</h3>
          <span className="text-[10px] text-slate-400 font-mono">{safeLat}, {safeLon}</span>
        </div>
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
          loc.is_active ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-200'
        }`}>
          {loc.is_active ? 'Active' : 'Disabled'}
        </span>
      </div>
      <p className="text-slate-500 leading-normal line-clamp-2">{loc.address || 'No location description.'}</p>
      <div className="flex items-center justify-between border-t border-slate-100 pt-2.5">
        <span className="text-slate-700 font-bold">Perimeter Radius: <span className="text-slate-900">{loc.radius_meters}m</span></span>
        <div className="flex gap-1.5">
          <button onClick={() => onView(loc.id)} className="p-1.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50"><Eye className="h-3.5 w-3.5" /></button>
          <button onClick={() => onEdit(loc)} className="p-1.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50"><Edit2 className="h-3.5 w-3.5" /></button>
          <button
            disabled={isUpdating}
            onClick={() => onToggleStatus(loc.id, loc.is_active)}
            className={`p-1.5 border rounded-lg ${loc.is_active ? 'border-red-100 text-red-600 hover:bg-red-50' : 'border-slate-200 text-slate-700'}`}
          >
            {loc.is_active ? <ShieldAlert className="h-3.5 w-3.5" /> : <ShieldCheck className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
});

LocationCard.displayName = 'LocationCard';