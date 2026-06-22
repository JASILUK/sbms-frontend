import React, { useState, useMemo, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Search, ShieldAlert, Sliders, MapPin, Layers } from 'lucide-react';

import { employeeOverrideValidationSchema } from '../../../schemas/attendanceAccessSchemas';
import { VALIDATION_MODE_REGISTRY, ANCHOR_VALIDATION_MODES } from '../../../constants/attendanceAccessConstants';
import { matchesEmployeeSearchCriteria } from '../../../utils/accessHelpers';

export function OverrideModal({ initialValues, employeesPool, companyMethodsPool, companyLocationsPool, onClose, onSave }) {
  const [searchQuery, setSearchQuery] = useState('');
  const isEditMode = !!initialValues?.id;

  const { register, handleSubmit, control, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(employeeOverrideValidationSchema),
    defaultValues: { 
      membership_id: '',
      validation_mode: ANCHOR_VALIDATION_MODES.ANY, 
      allowed_methods: [], 
      allowed_locations: [], 
      reason: '', 
      is_active: true 
    }
  });

  // ✅ ACTIVE TELEMETRY STATE SYNC FOR EDIT MODE INSTANCES
  useEffect(() => {
    if (initialValues) {
      reset(initialValues);
    }
  }, [initialValues, reset]);

  // Performance Optimization: Memoized Filter Matrix Pools
  const filteredEmployees = useMemo(() => {
    return employeesPool.filter(emp => matchesEmployeeSearchCriteria(emp, searchQuery)).slice(0, 40);
  }, [employeesPool, searchQuery]);

  // ✅ SYSTEM PAYLOAD SANITIZATION INTERCEPTOR
  const handleOverrideSanitizationSubmit = (formData) => {
    const cleanPayload = { ...formData };
    
    // Map frontend reactive key to exact Django ORM Relationship field expectation name
    cleanPayload.membership = formData.membership_id;
    
    // Purge frontend lookup key reference to keep the network payload clean
    delete cleanPayload.membership_id;

    onSave(cleanPayload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 text-xs font-medium text-slate-700 animate-fadeIn" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-3xs" onClick={onClose} />
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col relative animate-scaleUp z-10 max-h-[90vh]">
        
        {/* Dynamic Context Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-gradient-to-b from-slate-50 to-white">
          <div className="space-y-0.5">
            <h3 className="font-bold text-slate-900 text-sm tracking-tight flex items-center gap-2">
              <span className="p-1.5 bg-slate-100 border border-slate-200/60 rounded-lg text-slate-900">
                <Layers className="h-4 w-4" />
              </span>
              {isEditMode ? 'Modify Employee Exception Override' : 'Inject Employee Exception Override'}
            </h3>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 p-2 rounded-xl transition-all"><X className="h-4 w-4" /></button>
        </div>

        {/* Input Fields Wrapper Form */}
        <form onSubmit={handleSubmit(handleOverrideSanitizationSubmit)} className="p-6 overflow-y-auto space-y-4 flex-1">
          
          {/* Section 1: Employee Registry Target Selector */}
          <div className="space-y-2">
            <label className="font-bold text-slate-800 text-xs">1. Isolate Corporate Workforce Registry Profile</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                disabled={isEditMode}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search index via username, email address or operational title..."
                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs placeholder-slate-400 font-medium focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all bg-white hover:border-slate-300 disabled:opacity-50 disabled:bg-slate-50"
              />
            </div>

            <Controller
              name="membership_id"
              control={control}
              render={({ field }) => (
                <select 
                  value={field.value || ''} 
                  disabled={isEditMode}
                  onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : '')} 
                  className="w-full p-2.5 border border-slate-200 bg-white rounded-xl focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 font-bold text-slate-900 shadow-3xs h-32 scrollbar-thin cursor-pointer disabled:opacity-60" 
                  size={5}
                >
                  <option value="" className="font-semibold text-slate-400 p-1">-- Select target workspace identity --</option>
                  {filteredEmployees.map(e => (
                    <option key={e.id} value={e.id} className="p-1.5 border-b border-slate-50 font-medium text-slate-800 hover:bg-slate-50">
                      {e.username} ({e.user_email}) — {e.job_title || 'Staff Member'}
                    </option>
                  ))}
                </select>
              )}
            />
            {errors.membership_id && <p className="text-red-600 font-bold text-[10px] pl-1 animate-fadeIn">• {errors.membership_id.message}</p>}
          </div>

          {/* Section 2: Enforcement Level */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-800 text-xs">2. Exception Validation Enforcement Degree</label>
            <Controller
              name="validation_mode"
              control={control}
              render={({ field }) => (
                <select {...field} className="w-full p-2.5 border border-slate-200 bg-white rounded-xl focus:outline-none font-bold text-slate-900 shadow-3xs cursor-pointer hover:bg-slate-50/40">
                  {VALIDATION_MODE_REGISTRY.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              )}
            />
          </div>

          {/* Section 3: Allowed Verification Channels */}
          <div className="space-y-2">
            <label className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
              <Sliders className="h-3.5 w-3.5 text-slate-500" />
              3. Assigned Exception Method Overrides
            </label>
            <Controller
              name="allowed_methods"
              control={control}
              render={({ field }) => (
                <div className="grid grid-cols-2 gap-2 border border-slate-100 rounded-xl p-3 bg-slate-50/50 shadow-3xs">
                  {companyMethodsPool.map(m => {
                    const isChecked = field.value?.includes(m.id);
                    return (
                      <label key={m.id} className={`flex items-center gap-2.5 px-3 py-2 border rounded-lg cursor-pointer transition-all ${isChecked ? 'bg-white border-slate-900 shadow-4xs font-bold text-slate-900' : 'bg-white/40 border-slate-200/60 font-semibold text-slate-700'}`}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          className="rounded border-slate-300 text-slate-900 h-3.5 w-3.5 focus:ring-0 cursor-pointer"
                          onChange={() => {
                            const next = isChecked ? field.value.filter(x => x !== m.id) : [...(field.value || []), m.id];
                            field.onChange(next);
                          }}
                        />
                        <span>{m.method_display || m.method}</span>
                      </label>
                    );
                  })}
                </div>
              )}
            />
            {errors.allowed_methods && <p className="text-red-600 font-bold text-[10px] pl-1 animate-fadeIn">• {errors.allowed_methods.message}</p>}
          </div>

          {/* Section 4: Allowed Geofencing Locations */}
          <div className="space-y-2">
            <label className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-slate-500" />
              4. Assigned Exception Spatial Bounds Overrides
            </label>
            <Controller
              name="allowed_locations"
              control={control}
              render={({ field }) => (
                <div className="grid grid-cols-1 gap-1.5 border border-slate-100 rounded-xl p-3 bg-slate-50/50 max-h-32 overflow-y-auto shadow-3xs scrollbar-thin">
                  {companyLocationsPool.map(l => {
                    const isChecked = field.value?.includes(l.id);
                    return (
                      <label key={l.id} className={`flex items-center gap-2.5 px-3 py-2 border rounded-lg cursor-pointer transition-all ${isChecked ? 'bg-white border-slate-900 shadow-4xs font-bold text-slate-900' : 'bg-white/40 border-slate-200/60 font-semibold text-slate-700'}`}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          className="rounded border-slate-300 text-slate-900 h-3.5 w-3.5 focus:ring-0 cursor-pointer"
                          onChange={() => {
                            const next = isChecked ? field.value.filter(x => x !== l.id) : [...(field.value || []), l.id];
                            field.onChange(next);
                          }}
                        />
                        <span>{l.name}</span>
                      </label>
                    );
                  })}
                </div>
              )}
            />
            {errors.allowed_locations && <p className="text-red-600 font-bold text-[10px] pl-1 animate-fadeIn">• {errors.allowed_locations.message}</p>}
          </div>

          {/* Section 5: Reason Textarea */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-800 text-xs">5. Corporate Audit Trail Justification Context</label>
            <textarea 
              rows={2} 
              {...register('reason')} 
              placeholder="Provide details regarding exception requirements for tracking transparency balances logs." 
              className={`w-full p-2.5 border text-xs font-semibold resize-none rounded-xl focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all ${
                errors.reason ? 'border-red-300 bg-red-50/10' : 'border-slate-200 bg-white hover:border-slate-300'
              }`} 
            />
            {errors.reason && <p className="text-red-600 font-bold text-[10px] pl-1 animate-fadeIn">• {errors.reason.message}</p>}
          </div>

          {/* Validation Failure Summary Banner */}
          {Object.keys(errors).length > 0 && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex flex-col gap-1 text-red-700 font-bold animate-fadeIn">
              <div className="flex items-center gap-1.5 text-red-800 uppercase text-[9px] font-black tracking-wide">
                <ShieldAlert className="h-4 w-4 flex-shrink-0" />
                <span>Validation Failure Summary Parameters:</span>
              </div>
              {Object.entries(errors).map(([k, err]) => (
                <span key={k} className="font-medium text-[10px]">• Key <span className="font-mono bg-red-100 px-1 rounded font-bold">{k}</span>: {err.message}</span>
              ))}
            </div>
          )}

          {/* Action Footer Controls */}
          <div className="p-4 border-t border-slate-100 bg-slate-50 -mx-6 -mb-6 flex justify-end gap-2.5">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-slate-200 bg-white text-slate-700 rounded-xl font-bold shadow-3xs hover:bg-slate-50 active:scale-98 transition-all">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-white bg-slate-900 font-bold rounded-xl hover:bg-slate-800 active:scale-98 shadow-xs disabled:opacity-50 transition-all flex items-center gap-1.5">
              {isSubmitting && <div className="h-3 w-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              <span>{isEditMode ? 'Save Exception Settings' : 'Commit Exception Override'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}