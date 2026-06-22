import React from 'react';
import { GitCommit, Sliders, MapPin, Trash2, Edit2, ShieldCheck, ShieldAlert } from 'lucide-react';

export const RuleCard = React.memo(({ rule, locationMap, onEditTrigger, onDeleteTrigger }) => {
  // ✅ FIXED: Handle Django's pre-nested Department Minimal serialization shape safely
  const hasDepartmentObject = typeof rule.department === 'object' && rule.department !== null;
  const departmentName = hasDepartmentObject ? rule.department.name : null;

  const targetScopeString = rule.scope_type === 'DEPARTMENT'
    ? `Department Domain: ${departmentName || 'Unassigned Component'}`
    : `Workplace Strategy Mode: ${rule.work_mode?.toUpperCase()}`;

  // Check if detail parameters exist inside list instance telemetry row
  const detailedDataAvailable = Array.isArray(rule.allowed_methods) && Array.isArray(rule.allowed_locations);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex flex-col justify-between space-y-4 font-medium text-slate-700 hover:shadow-xs hover:border-slate-300 transition-all duration-200 animate-fadeIn min-h-[145px]">
      <div className="space-y-2">
        <div className="flex justify-between items-start gap-2">
          <div className="space-y-0.5 min-w-0 flex-1">
            <h4 className="font-bold text-slate-900 truncate text-xs tracking-tight">{rule.name}</h4>
            <span className="text-[10px] text-slate-400 font-semibold tracking-wide flex items-center gap-1">
              <GitCommit className="h-3 w-3 text-slate-400 flex-shrink-0" /> {targetScopeString}
            </span>
          </div>
          <span className="px-2 py-0.5 text-[9px] font-bold uppercase rounded-md bg-slate-50 border border-slate-200 text-slate-800 tracking-wider flex-shrink-0">
            Priority: {rule.priority}
          </span>
        </div>

        {/* Channels and Locations Sub-Grid Layout Panel */}
        <div className="pt-1.5 grid grid-cols-2 gap-3 text-[11px] leading-relaxed border-t border-slate-50">
          <div className="space-y-1">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1">
              <Sliders className="h-3 w-3" /> Channels
            </span>
            <div className="flex flex-wrap gap-1">
              {detailedDataAvailable ? (
                rule.allowed_methods.map(m => {
                  const label = typeof m === 'object' ? (m.method_display || m.method) : m;
                  const key = typeof m === 'object' ? m.id : m;
                  return (
                    <span key={key} className="px-1.5 py-0.2 bg-slate-50 border text-[9px] rounded font-bold uppercase tracking-wider text-slate-700 shadow-4xs">
                      {label}
                    </span>
                  );
                })
              ) : (
                <span className="text-[10px] text-slate-400 font-normal italic">Cascaded from root</span>
              )}
              {detailedDataAvailable && rule.allowed_methods.length === 0 && (
                <span className="text-[10px] text-red-500 italic">None Enabled</span>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1">
              <MapPin className="h-3 w-3" /> Geofences
            </span>
            <div className="flex flex-wrap gap-1 max-h-16 overflow-y-auto">
              {detailedDataAvailable ? (
                rule.allowed_locations.map(loc => {
                  const isObj = typeof loc === 'object' && loc !== null;
                  const locId = isObj ? loc.id : loc;
                  const locName = isObj ? loc.name : (locationMap?.get(Number(locId))?.name || `Ref: ${locId}`);
                  return (
                    <span key={locId} className="px-1.5 py-0.2 bg-slate-50 border text-[9px] rounded font-semibold text-slate-800 truncate max-w-[90px] shadow-4xs">
                      {locName}
                    </span>
                  );
                })
              ) : (
                <span className="text-[10px] text-slate-400 font-normal italic">Cascaded from root</span>
              )}
              {detailedDataAvailable && rule.allowed_locations.length === 0 && (
                <span className="text-[10px] text-slate-400 italic">Global bounds</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Card Action Interactive Footer Dock */}
      <div className="border-t border-slate-100 pt-2 flex justify-between items-center text-[10px] font-bold">
        <span className="inline-flex items-center gap-1 text-slate-500">
          {rule.validation_mode === 'ALL' ? (
            <ShieldAlert className="h-3.5 w-3.5 text-amber-500" />
          ) : (
            <ShieldCheck className="h-3.5 w-3.5 text-indigo-500" />
          )}
          Enforce: <span className="text-slate-900 font-extrabold">{rule.validation_mode || 'ANY'}</span>
        </span>
        
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onEditTrigger(rule)}
            className="text-slate-500 hover:text-slate-900 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            title="Modify Rule Settings"
          >
            <Edit2 className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onDeleteTrigger(rule.id)}
            className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
            title="Purge Strategy Rule"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
});

RuleCard.displayName = 'RuleCard';