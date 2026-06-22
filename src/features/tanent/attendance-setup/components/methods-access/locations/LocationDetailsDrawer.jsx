import React, { useEffect } from 'react';
import { X, Calendar, MapPin, Layers } from 'lucide-react';

export function LocationDetailsDrawer({ record, onClose }) {
  useEffect(() => {
    const escape = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', escape);
    return () => window.removeEventListener('keydown', escape);
  }, [onClose]);

  if (!record) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden text-xs animate-fadeIn" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-2xs" onClick={onClose} />
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-slate-200 flex flex-col justify-between shadow-2xl h-full animate-slideLeft">
          
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Geofence Structural Specs</span>
              <h3 className="text-xs font-bold text-slate-900">{record.name}</h3>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="p-5 overflow-y-auto space-y-5 flex-1 font-medium text-slate-600 leading-relaxed">
            
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wide block">Physical Address Record</span>
              <p className="text-slate-900 font-bold bg-slate-50 border p-3 rounded-xl border-slate-200/60">{record.address || 'No address trace assigned.'}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-b border-slate-100 py-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Latitude Pivot</span>
                <span className="font-mono font-bold text-slate-900 text-[11px]">{record.latitude}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Longitude Pivot</span>
                <span className="font-mono font-bold text-slate-900 text-[11px]">{record.longitude}</span>
              </div>
            </div>

            <div className="flex gap-4 items-center bg-slate-50 p-3 rounded-xl border border-slate-200/60 text-slate-900">
              <Layers className="h-4 w-4 text-slate-400 flex-shrink-0" />
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block leading-none mb-1">Assigned Bounds Radius</span>
                <span className="font-bold">{record.radius_meters} meters radius perimeter</span>
              </div>
            </div>

            <div className="space-y-2 border-t border-slate-100 pt-4 text-slate-500 font-semibold text-[11px]">
              <div className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                <span>Initialized: {new Date(record.created_at || Date.now()).toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                <span>Last Modified Sync: {new Date(record.updated_at || Date.now()).toLocaleString()}</span>
              </div>
            </div>

          </div>

          <div className="p-4 border-t border-slate-100 bg-slate-50 text-center">
            <span className="text-[11px] text-slate-400 italic">Telemetry validation nodes track active check-ins matching pipelines safely.</span>
          </div>

        </div>
      </div>
    </div>
  );
}