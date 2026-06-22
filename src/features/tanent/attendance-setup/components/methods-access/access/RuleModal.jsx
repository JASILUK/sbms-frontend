import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, ShieldAlert, Layers, Sliders, MapPin } from 'lucide-react';

import { accessRuleValidationSchema } from '../../../schemas/attendanceAccessSchemas';
import { SCOPE_TREATMENT_MODES, VALIDATION_MODE_REGISTRY, WORK_MODE_REGISTRY, ANCHOR_VALIDATION_MODES } from '../../../constants/attendanceAccessConstants';

// ✅ FIXED: Destructured initialValues from your props cleanly!
export function RuleModal({ initialValues, departmentsPool, companyMethodsPool, companyLocationsPool, onClose, onSave }) {
  const isEditMode = !!initialValues?.id;

  const { register, handleSubmit, control, watch, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(accessRuleValidationSchema),
    defaultValues: {
      name: '', 
      scope_type: SCOPE_TREATMENT_MODES.DEPARTMENT, 
      department: null, 
      work_mode: null, 
      validation_mode: ANCHOR_VALIDATION_MODES.ALL, 
      allowed_methods: [], 
      allowed_locations: [], 
      priority: 10, 
      is_active: true
    }
  });

  // ✅ FIXED: Actively syncs values when the admin triggers an edit action
  useEffect(() => {
    if (initialValues) {
      reset(initialValues);
    }
  }, [initialValues, reset]);

  const selectedScope = watch('scope_type');

  const handleFormSanitizationSubmit = (formData) => {
    const cleanPayload = { ...formData };
    if (cleanPayload.scope_type === SCOPE_TREATMENT_MODES.WORK_MODE) {
      cleanPayload.department = null;
    } else if (cleanPayload.scope_type === SCOPE_TREATMENT_MODES.DEPARTMENT) {
      cleanPayload.work_mode = null;
    }
    onSave(cleanPayload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 text-xs font-medium text-slate-700 animate-fadeIn" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-3xs" onClick={onClose} />
      
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col relative animate-scaleUp z-10 max-h-[90vh]">
        
        {/* Header Section */}
        <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-gradient-to-b from-slate-50 to-white">
          <div className="space-y-0.5">
            <h3 className="font-bold text-slate-900 text-sm tracking-tight flex items-center gap-2">
              <span className="p-1.5 bg-slate-100 border border-slate-200/60 rounded-lg text-slate-900">
                <Layers className="h-4 w-4" />
              </span>
              {isEditMode ? 'Modify Scoped Access Strategy' : 'Append Custom Scoped Access Rule'}
            </h3>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 p-2 rounded-xl transition-all"><X className="h-4 w-4" /></button>
        </div>

        {/* Input Fields Form Context */}
        <form onSubmit={handleSubmit(handleFormSanitizationSubmit)} className="p-6 overflow-y-auto space-y-5 grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4 flex-1">
          <div className="sm:col-span-2 space-y-1.5">
            <label className="font-bold text-slate-800 text-xs">Policy Identification Rule Label Name</label>
            <input type="text" {...register('name')} className="w-full p-2.5 border border-slate-200 rounded-xl font-semibold text-slate-900" placeholder="e.g., Engineering Core Scoped Clearance Bounds" />
            {errors.name && <p className="text-red-600 font-bold text-[10px] pl-1">• {errors.name.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-800 text-xs">Target Segment Dimensional Scope</label>
            <Controller
              name="scope_type"
              control={control}
              render={({ field }) => (
                <select {...field} className="w-full p-2.5 border border-slate-200 bg-white rounded-xl font-bold text-slate-900 cursor-pointer">
                  <option value={SCOPE_TREATMENT_MODES.DEPARTMENT}>Corporate Department Node</option>
                  <option value={SCOPE_TREATMENT_MODES.WORK_MODE}>Assigned Workforce Mode</option>
                </select>
              )}
            />
          </div>

          <div className="space-y-1.5">
            {selectedScope === SCOPE_TREATMENT_MODES.DEPARTMENT ? (
              <>
                <label className="font-bold text-slate-800 text-xs">Select Production Department Reference</label>
                <Controller
                  name="department"
                  control={control}
                  render={({ field }) => (
                    <select value={field.value || ''} onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)} className="w-full p-2.5 border border-slate-200 bg-white rounded-xl font-bold text-slate-900 cursor-pointer">
                      <option value="">-- Choose Segment Node --</option>
                      {departmentsPool.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                  )}
                />
                {errors.department && <p className="text-red-600 font-bold text-[10px] pl-1">• {errors.department.message}</p>}
              </>
            ) : (
              <>
                <label className="font-bold text-slate-800 text-xs">Select Bound Workforce Mode Choice</label>
                <Controller
                  name="work_mode"
                  control={control}
                  render={({ field }) => (
                    <select value={field.value || ''} onChange={(e) => field.onChange(e.target.value ? e.target.value : null)} className="w-full p-2.5 border border-slate-200 bg-white rounded-xl font-bold text-slate-900 cursor-pointer">
                      <option value="">-- Choose Mode Variable --</option>
                      {WORK_MODE_REGISTRY.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                    </select>
                  )}
                />
                {errors.work_mode && <p className="text-red-600 font-bold text-[10px] pl-1">• {errors.work_mode.message}</p>}
              </>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-800 text-xs">Rule Enforcement Mode Level</label>
            <Controller
              name="validation_mode"
              control={control}
              render={({ field }) => (
                <select {...field} className="w-full p-2.5 border border-slate-200 bg-white rounded-xl font-bold text-slate-900 cursor-pointer">
                  {VALIDATION_MODE_REGISTRY.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              )}
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-800 text-xs">Rule Prioritization Scale Rank Index</label>
            <input type="number" {...register('priority')} className="w-full p-2.5 border border-slate-200 rounded-xl font-bold text-slate-900" />
            {errors.priority && <p className="text-red-600 font-bold text-[10px] pl-1">• {errors.priority.message}</p>}
          </div>

          {/* Methods Checkbox Framework Row */}
          <div className="sm:col-span-2 space-y-2 pt-1">
            <label className="font-bold text-slate-800 text-xs flex items-center gap-1.5"><Sliders className="h-3.5 w-3.5 text-slate-500" /> Authorized Verification Routing Channels Matrix</label>
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
                          className="rounded border-slate-300 text-slate-900 h-3.5 w-3.5 cursor-pointer"
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
          </div>

          {/* Locations Checkbox Framework Row */}
          <div className="sm:col-span-2 space-y-2 pt-1">
            <label className="font-bold text-slate-800 text-xs flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-slate-500" /> Permitted Geographic Geofences Constraints Bounds</label>
            <Controller
              name="allowed_locations"
              control={control}
              render={({ field }) => (
                <div className="grid grid-cols-1 gap-1.5 border border-slate-100 rounded-xl p-3 bg-slate-50/50 max-h-36 overflow-y-auto shadow-3xs">
                  {companyLocationsPool.map(l => {
                    const isChecked = field.value?.includes(l.id);
                    return (
                      <label key={l.id} className={`flex items-center gap-2.5 px-3 py-2 border rounded-lg cursor-pointer transition-all ${isChecked ? 'bg-white border-slate-900 shadow-4xs font-bold text-slate-900' : 'bg-white/40 border-slate-200/60 font-semibold text-slate-700'}`}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          className="rounded border-slate-300 text-slate-900 h-3.5 w-3.5 cursor-pointer"
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
          </div>

          {Object.keys(errors).length > 0 && (
            <div className="sm:col-span-2 p-3.5 bg-red-50 border border-red-100 rounded-xl flex flex-col gap-1 text-red-700 font-bold animate-fadeIn">
              <div className="flex items-center gap-1.5 text-red-800 uppercase text-[9px] font-black tracking-wide"><ShieldAlert className="h-4 w-4 flex-shrink-0" /><span>Validation Errors:</span></div>
              {Object.entries(errors).map(([k, err]) => <span key={k} className="font-medium text-[10px]">• Field {k}: {err.message}</span>)}
            </div>
          )}

          <div className="sm:col-span-2 p-4 border-t border-slate-100 bg-slate-50 -mx-6 -mb-6 flex justify-end gap-2.5">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-slate-200 bg-white text-slate-700 rounded-xl font-bold shadow-3xs hover:bg-slate-50 transition-all">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-white bg-slate-900 font-bold rounded-xl hover:bg-slate-800 transition-all flex items-center gap-1.5">
              {isSubmitting && <div className="h-3 w-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              <span>{isEditMode ? 'Save Dynamic Strategy' : 'Commit Custom Rule'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}