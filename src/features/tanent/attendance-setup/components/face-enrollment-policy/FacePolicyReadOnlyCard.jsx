import React from 'react';
import { ShieldCheck, User, Building2, SlidersHorizontal } from 'lucide-react';
import { POLICY_STRATEGY_REGISTRY } from '../../constants/facePolicyConstants';

const iconMap = { User, ShieldCheck, Building2 };

export function FacePolicyReadOnlyCard({ policyData, onEditTrigger, canManage }) {
  if (!policyData) return null;

  const activeStrategy = POLICY_STRATEGY_REGISTRY.find(s => s.value === policyData.policy_type);
  const IconComponent = activeStrategy ? iconMap[activeStrategy.icon] : ShieldCheck;

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs space-y-5 animate-fadeIn">
      <div className="flex justify-between items-start gap-4">
        <div className="space-y-0.5">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Active Configuration Profile</h3>
          <p className="text-[11px] text-slate-400 font-normal">Active baseline attendance routing metrics.</p>
        </div>
        {canManage && (
          <button
            type="button"
            onClick={onEditTrigger}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 active:scale-98 text-slate-800 font-bold rounded-xl shadow-3xs transition-all"
          >
            <SlidersHorizontal className="h-3.5 w-3.5 text-slate-500" /> Edit Policy Strategy
          </button>
        )}
      </div>

      <div className="border border-slate-200/80 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-4xs bg-slate-50/20">
        <div className="flex gap-3.5 items-start">
          <div className="p-2 bg-slate-900 border border-slate-950 text-white rounded-lg flex-shrink-0 mt-0.5">
            <IconComponent className="h-4 w-4 stroke-[1.8]" />
          </div>
          <div className="space-y-0.5">
            <span className="text-xs font-extrabold text-slate-900 tracking-tight">{activeStrategy?.title || policyData.policy_type}</span>
            <p className="text-[11px] font-normal text-slate-400 leading-normal max-w-xl">{activeStrategy?.description}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-1 bg-white border border-slate-200 p-2 rounded-xl self-start md:self-auto shadow-4xs">
          {activeStrategy?.steps.map((step, idx) => (
            <React.Fragment key={step}>
              <span className="px-2 py-0.5 bg-slate-50 border border-slate-200/60 rounded text-[9px] whitespace-nowrap tracking-tight font-bold text-slate-700">
                {step}
              </span>
              {idx < activeStrategy.steps.length - 1 && <span className="text-slate-300 px-0.5 text-[10px]">→</span>}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}