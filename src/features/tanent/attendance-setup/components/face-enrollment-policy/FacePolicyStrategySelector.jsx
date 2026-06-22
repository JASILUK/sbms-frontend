import React from 'react';
import { Controller } from 'react-hook-form';
import { User, ShieldCheck, Building2, ChevronRight, Check } from 'lucide-react';
import { POLICY_STRATEGY_REGISTRY } from '../../constants/facePolicyConstants';

const iconMap = { User, ShieldCheck, Building2 };

export function FacePolicyStrategySelector({ control, disabled }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6 animate-fadeIn text-xs font-medium text-slate-700">
      {/* Section Header */}
      <div className="space-y-1">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 font-mono text-[10px] font-black text-white">1</span>
          Enrollment Strategy Pattern
        </h3>
        <p className="text-[11px] text-slate-400 font-normal pl-7">
          Select the orchestration workflow structure for employee facial biometric identity scans.
        </p>
      </div>

      <Controller
        name="policy_type"
        control={control}
        render={({ field: { value, onChange } }) => (
          <div className="grid grid-cols-1 gap-4 pl-7">
            {POLICY_STRATEGY_REGISTRY.map((strategy) => {
              const IconComponent = iconMap[strategy.icon];
              const isSelected = value === strategy.value;

              return (
                <label
                  key={strategy.value}
                  className={`group relative border rounded-xl p-5 flex flex-col xl:flex-row xl:items-center justify-between gap-5 transition-all duration-200 ease-in-out ${
                    disabled 
                      ? 'opacity-60 cursor-not-allowed' 
                      : 'cursor-pointer transform hover:-translate-y-[1px]'
                  } ${
                    isSelected 
                      ? 'border-slate-900 bg-slate-50/50 shadow-sm ring-[0.5px] ring-slate-900' 
                      : 'border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/20 hover:shadow-2xs bg-white'
                  }`}
                >
                  {/* Hidden Native Input */}
                  <input
                    type="radio"
                    name="policy_type"
                    value={strategy.value}
                    checked={isSelected}
                    disabled={disabled}
                    className="sr-only"
                    onChange={() => !disabled && onChange(strategy.value)}
                  />

                  {/* Left Side: Icon, Selection State & Content descriptions */}
                  <div className="flex gap-4 items-start max-w-xl">
                    {/* Premium Strategic Custom Radio Indicator Checkbox Accent */}
                    <div className="mt-0.5 flex-shrink-0 flex items-center justify-center">
                      <div className={`h-4 w-4 rounded-full border transition-all duration-200 flex items-center justify-center ${
                        isSelected 
                          ? 'border-slate-900 bg-slate-900 text-white scale-105' 
                          : 'border-slate-300 bg-white group-hover:border-slate-400'
                      }`}>
                        {isSelected && <Check className="h-2.5 w-2.5 stroke-[3]" />}
                      </div>
                    </div>

                    {/* Feature Vector Icon Wrapper */}
                    <div className={`p-2.5 rounded-xl border flex-shrink-0 transition-all duration-200 ${
                      isSelected 
                        ? 'bg-slate-900 text-white border-slate-950 shadow-xs' 
                        : 'bg-slate-50 text-slate-500 border-slate-100 group-hover:bg-slate-100 group-hover:text-slate-700'
                    }`}>
                      <IconComponent className="h-4 w-4 stroke-[2]" />
                    </div>

                    {/* Metadata Header Text Blocks */}
                    <div className="space-y-1">
                      <span className={`text-xs block tracking-tight transition-colors duration-200 ${
                        isSelected ? 'font-extrabold text-slate-900' : 'font-bold text-slate-800'
                      }`}>
                        {strategy.title}
                      </span>
                      <p className="text-[11px] font-normal text-slate-400 leading-relaxed group-hover:text-slate-500 transition-colors">
                        {strategy.description}
                      </p>
                    </div>
                  </div>

                  {/* Right Side: Flow Visualization Pipeline Dock */}
                  <div className={`flex items-center gap-1.5 border p-2 rounded-xl self-start xl:self-auto overflow-x-auto max-w-full scrollbar-none transition-all duration-200 ${
                    isSelected 
                      ? 'bg-white border-slate-200 shadow-3xs' 
                      : 'bg-slate-50/50 border-slate-200/40'
                  }`}>
                    {strategy.steps.map((step, idx) => (
                      <React.Fragment key={step}>
                        <span className={`px-2.5 py-1 rounded-lg text-[9px] font-bold whitespace-nowrap tracking-tight transition-all duration-200 border ${
                          isSelected 
                            ? 'bg-slate-50/60 border-slate-200/80 text-slate-700 font-extrabold' 
                            : 'bg-white border-slate-100 text-slate-400 font-semibold shadow-4xs'
                        }`}>
                          {step}
                        </span>
                        {idx < strategy.steps.length - 1 && (
                          <ChevronRight className={`h-3 w-3 flex-shrink-0 transition-colors duration-200 ${
                            isSelected ? 'text-slate-400' : 'text-slate-200'
                          }`} />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </label>
              );
            })}
          </div>
        )}
      />
    </div>
  );
}