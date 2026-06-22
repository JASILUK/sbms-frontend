import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { X, Check, Plus, HelpCircle, Sliders, MapPin, Shield, Layers, ArrowRight } from 'lucide-react';

import { 
  useUpdateCompanyDefaultsProfileMutation,
  useCreateCompanyDefaultsProfileMutation 
} from '../../../api/attendanceAccessApi';
import { companyDefaultsValidationSchema } from '../../../schemas/attendanceAccessSchemas';
import { VALIDATION_MODE_REGISTRY, ANCHOR_VALIDATION_MODES } from '../../../constants/attendanceAccessConstants';
import { formatAxiosErrorContext } from '../../../utils/accessHelpers';
import { CompanyDefaultsCard } from './CompanyDefaultsCard';
import { AllowedMethodsSelector } from './AllowedMethodsSelector';
import { AllowedLocationsSelector } from './AllowedLocationsSelector';

export function CompanyDefaultsSection({ 
  defaults, 
  companyMethodsPool = [], 
  companyLocationsPool = [], 
  locationMap 
}) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [updateDefaultsProfile, { isLoading: isUpdating }] = useUpdateCompanyDefaultsProfileMutation();
  const [createDefaultsProfile, { isLoading: isCreating }] = useCreateCompanyDefaultsProfileMutation();

  // Unified loading status flag tracking both active asynchronous cycles
  const isCommitting = isUpdating || isCreating;

  const { handleSubmit, control, reset, formState: { errors } } = useForm({
    resolver: zodResolver(companyDefaultsValidationSchema),
    defaultValues: defaults || { 
      validation_mode: ANCHOR_VALIDATION_MODES.STRICT, 
      allowed_methods: [], 
      allowed_locations: [] 
    }
  });

  // Sync form initial parameters dynamically the moment the background data pool arrives
  useEffect(() => {
    if (isEditMode && !defaults && companyMethodsPool.length > 0) {
      reset({
        validation_mode: ANCHOR_VALIDATION_MODES.STRICT, 
        allowed_methods: companyMethodsPool.map(m => m.id), // ✅ FIXED: Extracts dynamic primary key ID arrays 
        allowed_locations: companyLocationsPool.map(l => l.id)
      });
    }
  }, [companyMethodsPool, companyLocationsPool, isEditMode, defaults, reset]);

  const handleCommitDefaultsUpdate = async (formData) => {
    try {
      // ✅ INTUITIVE DISPATCH: Emits POST when creating from scratch, PATCH for pre-existing profiles
      if (!defaults || !defaults.id) {
        await createDefaultsProfile(formData).unwrap();
        toast.success('Corporate global access control default parameters initialized successfully.');
      } else {
        await updateDefaultsProfile(formData).unwrap();
        toast.success('Corporate global access control default parameters synced successfully.');
      }
      setIsEditMode(false);
    } catch (err) {
      toast.error(formatAxiosErrorContext(err));
    }
  };

  // Find the "if (!isEditMode)" block near line 57 and refactor the component return statement to this:
  if (!isEditMode) {
    if (!defaults) {
      return (
        <div className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-slate-100/50 border border-slate-200 rounded-2xl p-10 text-center flex flex-col items-center justify-center gap-4 transition-all duration-300 shadow-xs animate-fadeIn">
          <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 bg-slate-200/30 rounded-full blur-2xl pointer-events-none" />
          
          <div className="p-3.5 bg-white rounded-2xl shadow-sm border border-slate-200/60 text-slate-400 relative">
            <Shield className="h-6 w-6 text-slate-500 animate-pulse" />
          </div>
          
          <div className="space-y-1 max-w-md">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">No Corporate Access Fallbacks Initialized</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Establish core organization baseline validation perimeters, tracking channels routing matrix, and systemic operational authentication fallback stack rows.
            </p>
          </div>
          
          <button
            type="button"
            onClick={() => {
              reset({ 
                validation_mode: ANCHOR_VALIDATION_MODES.STRICT, 
                allowed_methods: companyMethodsPool.map(m => m.id), 
                allowed_locations: companyLocationsPool.map(l => l.id) 
              });
              setIsEditMode(true);
            }}
            className="mt-2 inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold tracking-wide text-white bg-slate-900 rounded-xl hover:bg-slate-800 active:scale-98 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <Plus className="h-4 w-4" /> Initialize Workspace Defaults
          </button>
        </div>
      );
    }

    // ✅ FIXED: Build a dynamic dictionary lookup map for methods pool records
    const methodMap = new Map(companyMethodsPool.map(m => [m.id, m]));

    return (
      <CompanyDefaultsCard 
        defaults={defaults} 
        methodMap={methodMap} // ✅ FIXED: Pass true live operational dictionary map
        locationMap={locationMap} 
        onTriggerEdit={() => { 
          // Normalize fields map to map database relationship arrays onto raw primary key arrays for the form reset lifecycle
          const normalizedMethods = Array.isArray(defaults.allowed_methods)
            ? defaults.allowed_methods.map(m => typeof m === 'object' ? m.id : m)
            : [];
          const normalizedLocations = Array.isArray(defaults.allowed_locations)
            ? defaults.allowed_locations.map(l => typeof l === 'object' ? l.id : l)
            : [];

          reset({
            ...defaults,
            allowed_methods: normalizedMethods,
            allowed_locations: normalizedLocations
          }); 
          setIsEditMode(true); 
        }} 
      />
    );
  }

  // State 2: Premium Interactive Form Editing Interface Block
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6 text-xs font-medium text-slate-700 transition-all duration-300 animate-fadeIn">
      
      {/* Dynamic Upper Component Header Section */}
      <div className="flex justify-between items-start border-b border-slate-100 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-slate-100 border border-slate-200/60 rounded-lg text-slate-900">
              <Layers className="h-3.5 w-3.5" />
            </span>
            <h3 className="font-bold text-slate-900 text-sm tracking-tight">Global System Fallback Configurations</h3>
          </div>
          <p className="text-slate-400 text-[11px] font-normal leading-relaxed pl-7">
            Configure default corporate authentication constraints applied when no specific custom cascaded validation policies target the identity framework.
          </p>
        </div>
        <button 
          type="button" 
          onClick={() => setIsEditMode(false)} 
          className="text-slate-400 hover:text-slate-600 p-2 border border-transparent hover:border-slate-100 rounded-xl hover:bg-slate-50 transition-all duration-200"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <form onSubmit={handleSubmit(handleCommitDefaultsUpdate)} className="space-y-6">
        
        {/* Premium Verification Policy Card Container */}
        <div className="space-y-3 max-w-md bg-gradient-to-b from-white to-slate-50/40 border border-slate-200/80 rounded-2xl p-5 shadow-3xs transition-all duration-300 hover:shadow-2xs hover:border-slate-300/80">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <label className="font-bold text-slate-800 text-xs flex items-center gap-2">
              <div className="p-1 bg-slate-900/5 text-slate-700 rounded-md border border-slate-900/10">
                <Shield className="h-3.5 w-3.5 stroke-[2.2]" />
              </div>
              Enforcement Severity Policy Mode
            </label>
            
            {/* Real-time policy level indicator pill */}
            <Controller
              name="validation_mode"
              control={control}
              render={({ field }) => {
                const isStrict = field.value === 'PRIMARY';
                const isAny = field.value === 'ANY';
                return (
                  <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border transition-all duration-200 ${
                    isStrict 
                      ? 'bg-red-50 border-red-200 text-red-700' 
                      : isAny 
                        ? 'bg-amber-50 border-amber-200 text-amber-700'
                        : 'bg-indigo-50 border-indigo-200 text-indigo-700'
                  }`}>
                    {isStrict ? 'High Risk Shielding' : isAny ? 'Adaptive Fallback' : 'Multi-Layer Mandatory'}
                  </span>
                );
              }}
            />
          </div>

          <Controller
            name="validation_mode"
            control={control}
            render={({ field }) => (
              <div className="space-y-2">
                <div className="relative">
                  <select 
                    {...field} 
                    className="w-full p-3 pl-3.5 pr-10 border border-slate-200 bg-white rounded-xl font-bold text-slate-900 text-xs shadow-3xs focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 appearance-none transition-all duration-200 cursor-pointer hover:bg-slate-50/50 hover:border-slate-300"
                  >
                    {VALIDATION_MODE_REGISTRY.map(opt => (
                      <option key={opt.value} value={opt.value} className="font-semibold text-slate-800 py-2">
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-slate-400 border-l border-slate-100 my-2 pl-3">
                    <ArrowRight className="h-3.5 w-3.5 rotate-90 text-slate-500 transition-transform duration-200 group-hover:text-slate-900" />
                  </div>
                </div>

                <div className="bg-white border border-slate-100 rounded-xl p-3 flex items-start gap-2.5 shadow-4xs min-h-[58px]">
                  <HelpCircle className="h-3.5 w-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                  <p className="text-[10px] text-slate-400 font-normal leading-relaxed">
                    {field.value === 'PRIMARY' && 'Strict isolation is active. Employees must authenticate using their mapped primary tracking channel or entry sequences will fail.'}
                    {field.value === 'ANY' && 'Permissive fallback routing configuration allows warning dispatch states while keeping peripheral workspace connection checkpoints accessible.'}
                    {field.value === 'ALL' && 'Maximum restriction profile. System requires comprehensive multi-vector validation clearance across all selected tracking channels simultaneously.'}
                  </p>
                </div>
              </div>
            )}
          />
        </div>

        {/* Dynamic Nested Structural Selector Blocks */}
        <div className="space-y-6">
          {/* Method Selector */}
          <div className="space-y-2 bg-white border border-slate-100 rounded-xl p-1 transition-all">
            <div className="px-3 pt-2 pb-1 flex items-center gap-2">
              <div className="p-1.5 bg-slate-50 rounded-lg text-slate-500 border border-slate-100">
                <Sliders className="h-3.5 w-3.5" />
              </div>
              <div>
                <label className="font-bold text-slate-800 block text-xs">Global Authorized Verification Gateways</label>
                <span className="text-[10px] text-slate-400 font-normal block">Select active check-in authentication vectors permitted at system baseline level.</span>
              </div>
            </div>
            <div className="p-2 bg-slate-50/30 border border-slate-100 rounded-xl">
              <Controller
                name="allowed_methods"
                control={control}
                render={({ field }) => (
                  <AllowedMethodsSelector
                    companyMethods={companyMethodsPool}
                    value={field.value || []}
                    onChange={field.onChange}
                    disabled={isCommitting}
                  />
                )}
              />
            </div>
            {errors.allowed_methods && (
              <p className="text-red-600 font-semibold text-[11px] px-3 mt-1 flex items-center gap-1">
                • {errors.allowed_methods.message}
              </p>
            )}
          </div>

          {/* Location Selector */}
          <div className="space-y-2 bg-white border border-slate-100 rounded-xl p-1 transition-all">
            <div className="px-3 pt-2 pb-1 flex items-center gap-2">
              <div className="p-1.5 bg-slate-50 rounded-lg text-slate-500 border border-slate-100">
                <MapPin className="h-3.5 w-3.5" />
              </div>
              <div>
                <label className="font-bold text-slate-800 block text-xs">Global Authorized Geofencing Perimeters</label>
                <span className="text-[10px] text-slate-400 font-normal block">Check approved default operational coordinates coordinate matrices tracking perimeters.</span>
              </div>
            </div>
            <div className="p-2 bg-slate-50/30 border border-slate-100 rounded-xl">
              <Controller
                name="allowed_locations"
                control={control}
                render={({ field }) => (
                  <AllowedLocationsSelector
                    locations={companyLocationsPool}
                    value={field.value || []}
                    onChange={field.onChange}
                    disabled={isCommitting}
                  />
                )}
              />
            </div>
            {errors.allowed_locations && (
              <p className="text-red-600 font-semibold text-[11px] px-3 mt-1 flex items-center gap-1">
                • {errors.allowed_locations.message}
              </p>
            )}
          </div>
        </div>

        {/* Validation Error Trap Panel */}
        {Object.keys(errors).length > 0 && (
          <div className="text-red-600 font-bold p-3 bg-red-50 border border-red-100 rounded-xl text-[10px] tracking-wide animate-fadeIn flex flex-col gap-0.5">
            <span className="uppercase text-[9px] font-black tracking-wider text-red-700 block">Form Validation Restrictions Blocked Submit:</span>
            {Object.entries(errors).map(([field, err]) => (
              <span key={field} className="font-medium">• Field <span className="font-mono bg-red-100/60 px-1 py-0.2 rounded font-bold">{field}</span>: {err.message}</span>
            ))}
          </div>
        )}

        {/* Submit Actions Button Layout Footer */}
        <div className="pt-4 border-t border-slate-100 flex justify-end items-center gap-2.5">
          <button 
            type="button" 
            onClick={() => setIsEditMode(false)} 
            className="px-4 py-2 border border-slate-200 rounded-xl text-slate-700 bg-white hover:bg-slate-50 active:scale-98 font-bold shadow-3xs transition-all duration-200"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={isCommitting} 
            className="inline-flex items-center gap-1.5 px-4 py-2 text-white bg-slate-900 font-bold rounded-xl hover:bg-slate-800 disabled:opacity-50 active:scale-98 shadow-xs hover:shadow-sm transition-all duration-200"
          >
            {isCommitting ? (
              <div className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Check className="h-4 w-4" />
            )}
            <span>Commit Setup Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
}