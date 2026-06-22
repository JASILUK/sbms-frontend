import React from 'react';
import { ShieldCheck, Eye, Sun, Camera } from 'lucide-react';

export function FaceEnrollmentInstructions({ onStart, isPolicyRestricted, policyType }) {
  const isApprovalRequired = policyType === 'SELF_WITH_APPROVAL';

  const items = [
    { icon: Sun, title: 'Optimum Ambient Lighting', desc: 'Ensure your capture space features consistent lighting profiles. Avoid strong overhead backlighting.' },
    { icon: Camera, title: 'Clear Visibility Profile', desc: 'Remove hats, sunglasses, or large frame items that block key eye structures before scanning.' },
    { icon: Eye, title: 'Interactive Challenge Verification', desc: 'Follow the live prompts to perform natural eye blinking and head rotations.' }
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6 animate-fadeIn">
      <div className="space-y-1">
        <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Biometric Onboarding Workflow Instructions</h3>
        <p className="text-[11px] text-slate-400 font-normal">
          Registering a unique mathematical descriptor matrix facilitates frictionless authentication. Review the parameters checklist below.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="border border-slate-100 p-4 rounded-xl space-y-2 bg-slate-50/40">
              <div className="p-2 bg-slate-900 text-white border border-slate-950 rounded-lg w-fit shadow-xs">
                <Icon className="h-4 w-4" />
              </div>
              <span className="font-bold text-slate-800 text-[11px] tracking-tight block">{item.title}</span>
              <p className="text-[10px] font-normal text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Corporate Policy Context Banner */}
      <div className="p-4 bg-indigo-50/40 border border-indigo-100 rounded-xl flex gap-3 items-start">
        <ShieldCheck className="h-4.5 w-4.5 text-indigo-600 mt-0.5 flex-shrink-0" />
        <div className="space-y-0.5 text-[11px]">
          <span className="font-bold text-slate-900 block tracking-tight">Corporate Governance Strategy Notice</span>
          <p className="text-slate-500 font-normal leading-relaxed">
            {isApprovalRequired 
              ? 'This workspace enforces validation reviews. Fresh biometric coordinates require review and approval by an HR Administrator before access is activated.'
              : 'This workspace parameters support automatic activation. Verified captures immediately go live across active terminals registers.'}
          </p>
        </div>
      </div>

      {!isPolicyRestricted && (
        <div className="flex justify-end border-t border-slate-50 pt-4">
          <button
            type="button"
            onClick={onStart}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-xs active:scale-98 transition-all text-xs cursor-pointer"
          >
            Begin Biometric Scan Sequence
          </button>
        </div>
      )}
    </div>
  );
}