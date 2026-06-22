import React from 'react';
import { Controller } from 'react-hook-form';
import { Eye, ShieldAlert, History } from 'lucide-react';

export function FacePolicyStatusCard({ control, disabled }) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs flex items-center justify-between gap-6">
      <div className="space-y-0.5 flex-1">
        <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
          Enable Face Enrollment
        </h3>
        <p className="text-[11px] text-slate-400 font-normal leading-normal max-w-md">
          Controls whether the biometric facial scanner engine captures fresh profile templates across organization clients.
        </p>
      </div>

      <Controller
        name="is_active"
        control={control}
        render={({ field: { value, onChange } }) => (
          <button
            type="button"
            disabled={disabled}
            onClick={() => onChange(!value)}
            className={`w-11 h-6 flex items-center rounded-full p-1 transition-all duration-300 focus:outline-none ${
              disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
            } ${value ? 'bg-slate-900 justify-end' : 'bg-slate-200 justify-start'}`}
          >
            <div className="bg-white w-4 h-4 rounded-full shadow-md" />
          </button>
        )}
      />
    </div>
  );
}