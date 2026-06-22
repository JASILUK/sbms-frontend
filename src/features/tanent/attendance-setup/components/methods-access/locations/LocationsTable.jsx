import React from 'react';
import { Eye, Edit2, ShieldAlert, ShieldCheck, Globe } from 'lucide-react';

export const LocationsTable = React.memo(({ locations = [], onView, onEdit, onToggleStatus, isUpdating }) => (
  <div className="hidden md:block bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="bg-slate-50/70 border-b border-slate-100 font-bold text-slate-500 uppercase tracking-wider text-[10px]">
            <th className="p-4">Perimeter Name</th>
            <th className="p-4">Corporate Address</th>
            <th className="p-4">Coordinates</th>
            <th className="p-4 text-center">Radius</th>
            <th className="p-4 text-center">System Status</th>
            <th className="p-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
          {locations.map((loc) => {
            // FIXED: Explicitly parse variables to numeric data types to guarantee .toFixed() context safety
            const safeLat = Number(loc.latitude || 0).toFixed(6);
            const safeLon = Number(loc.longitude || 0).toFixed(6);

            return (
              <tr key={loc.id} className="hover:bg-slate-50/40 transition-colors">
                <td className="p-4 font-bold text-slate-900">{loc.name}</td>
                <td className="p-4 text-slate-500 max-w-xs truncate">{loc.address || 'No explicit address assigned.'}</td>
                <td className="p-4 font-mono text-[11px] text-slate-600">
                  <span className="inline-flex items-center gap-1">
                    <Globe className="h-3 w-3 text-slate-400" />
                    {safeLat}, {safeLon}
                  </span>
                </td>
                <td className="p-4 text-center font-bold text-slate-800">{loc.radius_meters}m</td>
                <td className="p-4 text-center">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                    loc.is_active ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-200'
                  }`}>
                    {loc.is_active ? 'Active' : 'Archived'}
                  </span>
                </td>
                <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                  <button onClick={() => onView(loc.id)} className="p-1.5 border border-slate-200 rounded-md hover:bg-slate-100 text-slate-600 transition-colors">
                    <Eye className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => onEdit(loc)} className="p-1.5 border border-slate-200 rounded-md hover:bg-slate-100 text-slate-600 transition-colors">
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    disabled={isUpdating}
                    onClick={() => onToggleStatus(loc.id, loc.is_active)}
                    className={`p-1.5 border rounded-md transition-colors ${
                      loc.is_active ? 'border-red-100 text-red-600 hover:bg-red-50' : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {loc.is_active ? <ShieldAlert className="h-3.5 w-3.5" /> : <ShieldCheck className="h-3.5 w-3.5" />}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
));

LocationsTable.displayName = 'LocationsTable';