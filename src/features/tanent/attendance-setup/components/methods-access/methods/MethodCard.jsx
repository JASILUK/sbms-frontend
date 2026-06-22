import React from 'react';
import { METHOD_META_REGISTRY } from '../../../constants/attendanceMethodsConstants';

export const MethodCard = React.memo(({ methodKey, isActive, onToggle, onShowDetails, isDisabled }) => {
  const meta = METHOD_META_REGISTRY[methodKey];
  const Icon = meta?.icon;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between space-y-4 group">
      <div className="space-y-3">
        <div className="flex justify-between items-start">
          <div className={`p-2.5 rounded-xl border ${isActive ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
            {Icon && <Icon className="h-4 w-4" />}
          </div>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border tracking-wide uppercase ${
            isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-200/60'
          }`}>
            {isActive ? 'Active' : 'Offline'}
          </span>
        </div>

        <div className="space-y-1">
          <h3 className="text-xs font-bold text-slate-900 group-hover:text-slate-700 transition-colors">{meta?.label || methodKey}</h3>
          <p className="text-[11px] text-slate-500 leading-relaxed font-medium">{meta?.description}</p>
        </div>
      </div>

      <div className="border-t border-slate-50 pt-3 flex items-center justify-between text-xs font-semibold">
        <button
          type="button"
          onClick={onShowDetails}
          className="text-slate-500 hover:text-slate-900 hover:bg-slate-50 px-2 py-1 rounded-md transition-all"
        >
          View Bounds Drawer
        </button>
        <button
          type="button"
          disabled={isDisabled}
          onClick={onToggle}
          className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold tracking-wide shadow-2xs transition-all ${
            isActive 
              ? 'bg-white border-red-200 text-red-600 hover:bg-red-50' 
              : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
          } disabled:opacity-40 disabled:cursor-not-allowed`}
        >
          {isActive ? 'Deactivate' : 'Activate Routing'}
        </button>
      </div>
    </div>
  );
});

MethodCard.displayName = 'MethodCard';