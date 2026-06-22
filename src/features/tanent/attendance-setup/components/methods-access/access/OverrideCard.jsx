import React from 'react';
import { UserMinus, Edit2, ShieldAlert, Fingerprint, MessageSquare, MapPin } from 'lucide-react';

export const OverrideCard = React.memo(({ override, employeeRecord, onEditTrigger, onDeleteTrigger }) => {
  const profileLabel = employeeRecord
    ? `${employeeRecord.username} (${employeeRecord.user_email})`
    : `User Record Key Ref: ${override.membership?.id || override.membership}`;

  const deptLabel = employeeRecord?.department_name || 'Staff Node';
  const titleLabel = employeeRecord?.job_title || 'General';

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex flex-col justify-between space-y-4 font-medium text-slate-700 animate-fadeIn hover:shadow-xs hover:border-slate-300 transition-all duration-200 min-h-[160px]">
      <div className="space-y-2.5">
        
        <div className="flex justify-between items-start gap-2">
          <div className="space-y-0.5 min-w-0 flex-1">
            <h4 className="font-bold text-slate-900 truncate text-xs tracking-tight">{profileLabel}</h4>
            <span className="text-[10px] text-slate-400 font-semibold truncate block">
              Dept: {deptLabel} | Title: {titleLabel}
            </span>
          </div>
          <span className="px-2 py-0.5 text-[9px] font-extrabold bg-rose-50 text-rose-700 border border-rose-200/60 rounded-md uppercase tracking-wider flex-shrink-0">
            Override
          </span>
        </div>

        {override.reason && (
          <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-lg text-[11px] leading-relaxed font-medium text-slate-600 flex gap-1.5 items-start shadow-4xs">
            <MessageSquare className="h-3.5 w-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
            <p className="italic truncate max-w-full">"{override.reason}"</p>
          </div>
        )}

        <div className="pt-1 grid grid-cols-1 gap-2 border-t border-slate-50 text-[11px] leading-relaxed">
          <div className="space-y-1">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1">
              <Fingerprint className="h-3.5 w-3.5 text-slate-400" /> Bypassed Methods Matrix:
            </span>
            <div className="flex flex-wrap gap-1">
              {override.allowed_methods?.map(m => {
                const methodKey = typeof m === 'object' && m !== null ? m.id : m;
                const methodLabel = typeof m === 'object' && m !== null ? (m.method_display || m.method) : m;
                return (
                  <span key={methodKey} className="px-1.5 py-0.2 bg-slate-50 border border-slate-200 text-slate-700 text-[9px] font-bold rounded uppercase shadow-4xs">
                    {methodLabel}
                  </span>
                );
              })}
              {(!override.allowed_methods || override.allowed_methods.length === 0) && (
                <span className="text-rose-500 italic text-[10px]">No Channels Allowed (Locked)</span>
              )}
            </div>
          </div>

          {Array.isArray(override.allowed_locations) && override.allowed_locations.length > 0 && (
            <div className="space-y-1 pt-0.5">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-slate-400" /> Bound Spatial Perimeter Exceptions:
              </span>
              <div className="flex flex-wrap gap-1 max-h-12 overflow-y-auto scrollbar-none">
                {override.allowed_locations.map(loc => {
                  const locKey = typeof loc === 'object' && loc !== null ? loc.id : loc;
                  const locLabel = typeof loc === 'object' && loc !== null ? loc.name : `Location Ref: ${loc}`;
                  return (
                    <span key={locKey} className="px-1.5 py-0.2 bg-slate-50 border border-slate-200 text-slate-800 text-[9px] font-semibold rounded truncate max-w-[120px] shadow-4xs">
                      {locLabel}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Footer Bar */}
      <div className="border-t border-slate-100 pt-2 flex justify-between items-center text-[10px] font-bold">
        <span className="inline-flex items-center gap-1 text-slate-500">
          <ShieldAlert className="h-3.5 w-3.5 text-amber-500" /> 
          Enforce Mode: <span className="text-slate-900 font-extrabold">{override.validation_mode || 'ANY'}</span>
        </span>
        
        {/* ✅ FIXED: Added interactive actions tool dock supporting both PATCH and DELETE bindings */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onEditTrigger(override)}
            className="text-slate-500 hover:text-slate-900 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            title="Modify Exception Configuration"
          >
            <Edit2 className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onDeleteTrigger(override.id)}
            className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition-colors inline-flex items-center gap-0.5"
            title="Revoke Exception Context"
          >
            <UserMinus className="h-3.5 w-3.5" /> Evict
          </button>
        </div>
      </div>
    </div>
  );
});

OverrideCard.displayName = 'OverrideCard';