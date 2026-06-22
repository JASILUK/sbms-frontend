import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import {  
  useGetFaceEnrollmentPolicyQuery,
  useCreateFaceEnrollmentPolicyMutation,
  useUpdateFaceEnrollmentPolicyMutation,
  useDeactivateFaceEnrollmentPolicyMutation,
} from '../api/faceEnrollmentPolicyApi';

import { facePolicyValidationSchema } from '../schemas/facePolicySchema';
import { formatAxiosErrorContext } from '../utils/accessHelpers';

import { FacePolicyHero } from '../components/face-enrollment-policy/FacePolicyHero';
import { FacePolicyStrategySelector } from '../components/face-enrollment-policy/FacePolicyStrategySelector';
import { FacePolicyStatusCard } from '../components/face-enrollment-policy/FacePolicyStatusCard';
import { FacePolicyAuditCard } from '../components/face-enrollment-policy/FacePolicyAuditCard';
import { FacePolicyReadOnlyCard } from '../components/face-enrollment-policy/FacePolicyReadOnlyCard';
import { FacePolicyGatekeeperState } from '../components/face-enrollment-policy/FacePolicyGatekeeperState';
import { FacePolicyEmptyState } from '../components/face-enrollment-policy/FacePolicyEmptyState';
import { FacePolicyDeactivateCard } from '../components/face-enrollment-policy/FacePolicyDeactivateCard';
import { FacePolicySkeleton } from '../components/face-enrollment-policy/FacePolicySkeleton';
import { useAttendanceMethods } from '../hooks/useAttendanceMethods';

// ✅ PROFESSIONAL UPDATE: Leverage your pre-existing permissions hook directly
import { usePermission } from '../../../auth/usePermission';// Adjust path to your hook file

export default function FaceEnrollmentPolicyPage() {
  const [isEditing, setIsEditing] = useState(false);

  // 1. ✅ RESOLVED: Compute capability codes independently without relying on layout parameters
  const { hasPermission } = usePermission();
  const canManage = hasPermission('tenant.attendance.manage');
  const isReadOnly = !canManage;

  // 2. Load methods dependencies to execute gatekeeping requirements
  const { methods: methodsPool, isLoading: loadingMethods } = useAttendanceMethods();
  const { data: policyData, isLoading: loadingPolicy } = useGetFaceEnrollmentPolicyQuery();

  const [createPolicy] = useCreateFaceEnrollmentPolicyMutation();
  const [updatePolicy] = useUpdateFaceEnrollmentPolicyMutation();
  const [deactivatePolicy] = useDeactivateFaceEnrollmentPolicyMutation();

  const { handleSubmit, control, reset, formState: { isSubmitting } } = useForm({
    resolver: zodResolver(facePolicyValidationSchema),
  });

  // Verify whether Face authentication methods are globally enabled for the tenant company context
  const isFaceEnabled = Array.isArray(methodsPool) && methodsPool.some(m => m.method === 'FACE' && m.is_active);

  if (loadingMethods || loadingPolicy) {
    return <FacePolicySkeleton />;
  }

  if (!isFaceEnabled) {
    return <FacePolicyGatekeeperState />;
  }

  const handleStartInitialization = () => {
    reset({ policy_type: 'SELF_WITH_APPROVAL', is_active: true });
    setIsEditing(true);
  };

  const handleStartEditing = () => {
    reset({
      policy_type: policyData.policy_type,
      is_active: policyData.is_active,
    });
    setIsEditing(true);
  };

  const handleCancelFormSubmit = () => {
    setIsEditing(false);
  };

  const handleCommitFormSubmit = async (formData) => {
    try {
      if (policyData && policyData.id) {
        await updatePolicy(formData).unwrap();
        toast.success('Face enrollment tracking policy configuration patched safely.');
      } else {
        await createPolicy(formData).unwrap();
        toast.success('Dynamic biometric policy layer initialized successfully.');
      }
      setIsEditing(false);
    } catch (err) {
      toast.error(formatAxiosErrorContext(err));
    }
  };

  const handleExecuteSoftDeactivation = async () => {
    try {
      await deactivatePolicy().unwrap();
      toast.success('Face enrollment policy disabled.');
      setIsEditing(false);
    } catch (err) {
      toast.error(formatAxiosErrorContext(err));
    }
  };

  return (
    <div className="space-y-5 max-w-4xl tracking-tight">
      
      {/* Upper Hero Branding Section */}
      <FacePolicyHero isReadOnly={isReadOnly} />

      {policyData === null && !isEditing ? (
        <FacePolicyEmptyState onInitialize={handleStartInitialization} canManage={canManage} />
      ) : (
        <>
          {/* Dynamic Render Context */}
          {isEditing && canManage ? (
            <form onSubmit={handleSubmit(handleCommitFormSubmit)} className="space-y-5 animate-fadeIn">
              
              <FacePolicyStrategySelector control={control} disabled={isSubmitting} />
              
              <FacePolicyStatusCard control={control} disabled={isSubmitting} />
              
              {/* Form Action Controls Dock */}
              <div className="p-4 bg-slate-50 border border-slate-200/60 rounded-2xl flex justify-end gap-2.5 shadow-3xs">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleCancelFormSubmit}
                  className="px-4 py-2 border border-slate-200 bg-white font-bold text-slate-700 rounded-xl shadow-3xs hover:bg-slate-50 active:scale-98 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-white bg-slate-900 font-bold rounded-xl shadow-xs hover:bg-slate-800 active:scale-98 transition-all flex items-center gap-1.5"
                >
                  {isSubmitting && <div className="h-3 w-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                  <span>Save Policy Configuration</span>
                </button>
              </div>

            </form>
          ) : (
            <div className="space-y-5">
              
              <FacePolicyReadOnlyCard 
                policyData={policyData} 
                onEditTrigger={handleStartEditing} 
                canManage={canManage} 
              />
              
              <FacePolicyAuditCard policyData={policyData} />
              
              {canManage && policyData?.is_active && (
                <FacePolicyDeactivateCard onDeactivate={handleExecuteSoftDeactivation} />
              )}
              
            </div>
          )}
        </>
      )}
    </div>
  );
}