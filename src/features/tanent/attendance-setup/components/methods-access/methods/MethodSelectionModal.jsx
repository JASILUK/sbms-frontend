import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, AlertCircle } from 'lucide-react';
import { attendanceMethodsFormSchema } from '../../../schemas/attendanceMethodsSchemas';
import { METHOD_META_REGISTRY } from '../../../constants/attendanceMethodsConstants';

export function MethodSelectionModal({ enabledMethods = [], onClose, onSave }) {
  // Safe normalization prevents instantiation errors if RTK Query cache is loading
  const initialMethods = Array.isArray(enabledMethods) ? enabledMethods : [];

  const { handleSubmit, control, formState: { errors, isSubmitting, isDirty } } = useForm({
    resolver: zodResolver(attendanceMethodsFormSchema),
    defaultValues: { 
      methods: initialMethods 
    }
  });

  useEffect(() => {
    const escape = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', escape);
    return () => window.removeEventListener('keydown', escape);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-2xs" onClick={onClose} />
      
      <div className="bg-white border border-slate-200 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col relative animate-scaleUp z-10">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/60">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">Synchronize System Channel Matrices</h3>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form container wrapping inputs cleanly */}
        <form onSubmit={handleSubmit(onSave)} className="p-5 overflow-y-auto space-y-4 text-xs flex-1 max-h-[70vh]">
          <p className="text-slate-500 font-medium leading-normal mb-2">
            Select or omit tracking options. Configuration sets automatically drop metadata tracking links across company registers tables indexes rows.
          </p>

          <Controller
            name="methods"
            control={control}
            render={({ field }) => {
              // Guarantee field.value remains an array context under all state variations
              const currentValue = Array.isArray(field.value) ? field.value : [];

              return (
                <div className="space-y-2.5">
                  {Object.entries(METHOD_META_REGISTRY).map(([key, meta]) => {
                    const isChecked = currentValue.includes(key);
                    
                    const handleCheckboxToggle = () => {
                      const next = isChecked 
                        ? currentValue.filter(m => m !== key) 
                        : [...currentValue, key];
                      field.onChange(next);
                    };

                    return (
                      <div
                        key={key}
                        onClick={handleCheckboxToggle}
                        className={`border rounded-xl p-3 flex items-start gap-3 cursor-pointer transition-all ${
                          isChecked ? 'border-slate-900 bg-slate-50/30 ring-1 ring-slate-900' : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          readOnly
                          className="h-3.5 w-3.5 rounded border-slate-300 text-slate-900 focus:ring-slate-900 mt-0.5 flex-shrink-0"
                        />
                        <div className="space-y-0.5 pr-2 min-w-0">
                          <span className="font-bold text-slate-900 block">{meta.label}</span>
                          <p className="text-slate-500 leading-normal font-medium truncate">{meta.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            }}
          />

          {errors.methods && (
            <div className="p-3 bg-red-50 border border-red-100 text-red-700 rounded-xl flex gap-2 items-start font-semibold">
              <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <span>{errors.methods.message}</span>
            </div>
          )}

          {/* HTML semantic buttons must sit inside the form wrapper block or trigger it explicitly */}
          <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 border border-slate-200 rounded-lg font-semibold text-slate-700 bg-white hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !isDirty}
              className="px-3 py-1.5 border border-transparent rounded-lg font-semibold text-white bg-slate-900 hover:bg-slate-800 shadow-sm disabled:opacity-40"
            >
              {isSubmitting ? 'Saving matrix changes...' : 'Commit Matrix State'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}