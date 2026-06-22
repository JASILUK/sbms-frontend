import React from 'react';
import { Check } from 'lucide-react';
import { METHODS_META } from '../../../constants/attendanceAccessConstants';

export const AllowedMethodsSelector = React.memo(({ 
  companyMethods = [], 
  value = [], 
  onChange, 
  disabled,
  isLoading = false 
}) => {
  // Defensive array normalization against null/undefined values
  const activeSelectedValues = Array.isArray(value) ? value : [];

  const toggleSelection = (cMethod) => {
    if (disabled) return;
    
    // ✅ FIXED: Track selections matching purely against unique Primary Key IDs (Integers)
    const isSelected = activeSelectedValues.includes(cMethod.id);

    let nextValue;
    if (isSelected) {
      nextValue = activeSelectedValues.filter(id => id !== cMethod.id);
    } else {
      nextValue = [...activeSelectedValues, cMethod.id]; // ✅ FIXED: Append database numerical IDs
    }
    onChange(nextValue);
  };

  // Premium Shimmer Loading Skeleton State
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((idx) => (
          <div key={idx} className="border border-slate-100 rounded-xl p-4 bg-white flex items-center gap-3 animate-pulse">
            <div className="w-8 h-8 bg-slate-100 rounded-lg flex-shrink-0" />
            <div className="space-y-2 flex-1 min-w-0">
              <div className="h-3 bg-slate-100 rounded w-2/3" />
              <div className="h-2 bg-slate-100 rounded w-5/6" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Polished Empty State Layout 
  if (!companyMethods || companyMethods.length === 0) {
    return (
      <div className="text-center p-8 border border-dashed border-slate-200 bg-slate-50/50 rounded-xl max-w-xl mx-auto flex flex-col items-center justify-center gap-2 animate-fadeIn">
        <p className="text-xs font-bold text-slate-800 tracking-tight">No Active Authentication Channels Available</p>
        <p className="text-[11px] text-slate-400 font-normal leading-relaxed max-w-xs">
          Verify corporate tracking settings parameters inside the primary Validation Methods configuration engine workflow tree sheets.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 animate-fadeIn">
      {companyMethods.map((cMethod) => {
        const meta = METHODS_META[cMethod.method] || {
          label: cMethod.method_display || cMethod.method,
          bg: 'bg-slate-50',
          color: 'text-slate-600',
          icon: () => null
        };
        
        const Icon = meta.icon;
        
        // ✅ FIXED: Evaluate active styles using database Primary Keys
        const isSelected = activeSelectedValues.includes(cMethod.id);

        return (
          <div
            key={cMethod.id}
            onClick={() => toggleSelection(cMethod)}
            className={`group relative border rounded-xl p-4 flex items-start gap-3.5 transition-all duration-200 select-none overflow-hidden ${
              disabled 
                ? 'opacity-40 cursor-not-allowed bg-slate-50/50 border-slate-100' 
                : 'cursor-pointer'
            } ${
              isSelected
                ? 'border-slate-900 bg-slate-50/40 ring-[1px] ring-slate-900 font-bold shadow-xs'
                : 'border-slate-200/80 bg-white hover:border-slate-300 hover:bg-slate-50/30 hover:shadow-2xs active:scale-[0.98]'
            }`}
          >
            {/* Context Active Dynamic Selection Check Indicator */}
            {isSelected && !disabled && (
              <div className="absolute top-0 right-0 w-3 h-3 bg-slate-900 text-white rounded-bl-lg flex items-center justify-center pt-0.5 pr-0.5">
                <Check className="h-2 w-2 stroke-[3.5]" />
              </div>
            )}

            {/* Premium Soft Tint Geometric Icon Wrapper Frame */}
            <div className={`p-2 rounded-xl border flex-shrink-0 transition-all duration-300 ${
              isSelected 
                ? 'bg-white border-slate-200 shadow-3xs' 
                : `${meta.bg} border-transparent group-hover:scale-105`
            } ${meta.color}`}>
              <Icon className="h-4 w-4" />
            </div>

            {/* Dynamic Typography Block Content Panel */}
            <div className="space-y-0.5 min-w-0 flex-1 pt-0.5">
              <span className={`text-xs block truncate tracking-tight transition-colors ${
                isSelected ? 'font-bold text-slate-900' : 'font-semibold text-slate-700 group-hover:text-slate-900'
              }`}>
                {meta.label}
              </span>
              <span className="text-[10px] text-slate-400 block leading-normal truncate font-normal">
                {cMethod.method_display || `Gate authentication route proxy: ${cMethod.method}`}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
});

AllowedMethodsSelector.displayName = 'AllowedMethodsSelector';