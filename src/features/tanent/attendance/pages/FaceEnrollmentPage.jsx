// ============================================
// FaceEnrollmentPage.jsx — SIMPLE
// ============================================

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { ScanFace, AlertTriangle, Loader2 } from 'lucide-react';

import { useAttendanceMethods } from '../../attendance-setup/hooks/useAttendanceMethods';
import { useGetFaceEnrollmentPolicyQuery } from '../../attendance-setup/api/faceEnrollmentPolicyApi';
import { loadFaceApiModels } from '../utils/faceEmbedding';
import { WIZARD_STEPS } from '../constants/faceEnrollmentConstants';
import { formatAxiosErrorContext } from '../../attendance-setup/utils/accessHelpers';
import { useChallengeSequence } from '../hooks/useChallengeSequence';

import { 
  useGetMyFaceEnrollmentsQuery, 
  useSubmitSelfEnrollmentMutation 
} from '../api/faceEnrollmentApi';

import { FacePolicyGatekeeperState } from '../../attendance-setup/components/face-enrollment-policy/FacePolicyGatekeeperState';
import { FaceCameraCapture } from '../components/face-enrollment/FaceCameraCapture';
import { FaceEnrollmentStatusCard } from '../components/face-enrollment/FaceEnrollmentStatusCard';
import { FaceEnrollmentInstructions } from '../components/face-enrollment/FaceEnrollmentInstructions';
import { FaceEnrollmentSkeleton } from '../components/face-enrollment/FaceEnrollmentSkeleton';

export default function FaceEnrollmentPage() {
  const [wizardStep, setWizardStep] = useState(WIZARD_STEPS.INTRODUCTION);
  const [modelsReady, setModelsReady] = useState(false);
  const [modelError, setModelError] = useState(null);
  const [cachedDescriptorArray, setCachedDescriptorArray] = useState(null);

  const challengeEngine = useChallengeSequence();
  const { sequence, currentIndex, progress, generateSequence, moveNext, reset: resetChallenges } = challengeEngine;

  const { methods: methodsPool, isLoading: loadingMethods } = useAttendanceMethods();
  const { data: policyConfig, isLoading: loadingPolicy } = useGetFaceEnrollmentPolicyQuery();
  
  const { data: enrollmentHistory, isLoading: loadingHistory } = useGetMyFaceEnrollmentsQuery();
  const [commitEnrollment, { isLoading: isSubmitting }] = useSubmitSelfEnrollmentMutation();

  useEffect(() => {
    let isMounted = true;
    async function bootstrapModels() {
      try {
        const absoluteModelsPath = `${window.location.origin}/models`;
        await loadFaceApiModels(absoluteModelsPath);
        if (isMounted) setModelsReady(true);
      } catch (err) {
        if (isMounted) setModelError('Failed to initialize computer vision network components.');
      }
    }
    bootstrapModels();
    return () => { isMounted = false; };
  }, []);

  if (loadingMethods || loadingPolicy || loadingHistory || (!modelsReady && !modelError)) {
    return <FaceEnrollmentSkeleton />;
  }

  const isFaceEnabled = Array.isArray(methodsPool) && methodsPool.some(m => m.method === 'FACE' && m.is_active);
  if (!isFaceEnabled) return <FacePolicyGatekeeperState />;

  const isHrRestricted = policyConfig?.policy_type === 'HR_ONLY';
  const latestActiveRecord = Array.isArray(enrollmentHistory) && enrollmentHistory.length > 0 
    ? enrollmentHistory[0] 
    : null;

  const handleStartInitialization = () => {
    setCachedDescriptorArray(null);
    resetChallenges();
    generateSequence();
    setWizardStep(1); 
  };

  const handleStepCompletionSequence = () => {
    setWizardStep(prev => prev + 1);
  };

  const handleResetCaptureSequence = () => {
    setCachedDescriptorArray(null);
    resetChallenges();
    generateSequence();
    setWizardStep(1);
  };

  const handleReceiveDescriptorArray = (descriptorArray) => {
    setCachedDescriptorArray(descriptorArray);
    setWizardStep(WIZARD_STEPS.CAPTURE_PREVIEW); 
  };

  const handleDispatchPayloadMutation = async () => {
    if (!cachedDescriptorArray || cachedDescriptorArray.length !== 128) {
      toast.error('Biometric matrix compile pending. Please align face securely and tap Commit again.');
      return;
    }

    try {
      await commitEnrollment({ embedding: cachedDescriptorArray }).unwrap();
      toast.success(
        policyConfig?.policy_type === 'SELF_ONLY' 
          ? 'Biometric profile signature recorded and approved automatically.' 
          : 'Biometric face registration submitted successfully for administrative review.'
      );
      setWizardStep(WIZARD_STEPS.INTRODUCTION);
      setCachedDescriptorArray(null);
      resetChallenges();
    } catch (err) {
      toast.error(formatAxiosErrorContext(err));
    }
  };

  const formatChallengeLabel = (rawName) => {
    if (!rawName) return "Complete Verification";
    return rawName.replace('_', ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
  };

  return (
    <div className="space-y-5 max-w-4xl text-xs font-medium text-slate-700 tracking-tight p-2 sm:p-4 w-full mx-auto animate-fadeIn">
      
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div className="flex gap-4 items-center">
          <div className="p-3 bg-slate-900 border border-slate-950 text-white rounded-xl shadow-xs">
            <ScanFace className="h-6 w-6 stroke-[1.5]" />
          </div>
          <div className="space-y-0.5">
            <h1 className="text-sm font-bold text-slate-900 uppercase tracking-wide">My Biometric Face Profile</h1>
            <p className="text-[11px] text-slate-400 font-normal max-w-xl leading-relaxed">Configure your biometric registration tokens cleanly.</p>
          </div>
        </div>
      </div>

      {modelError && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-2xl flex gap-3 items-start shadow-sm">
          <AlertTriangle className="h-4.5 w-4.5 text-red-600 mt-0.5 flex-shrink-0" />
          <p className="text-[11px] leading-relaxed font-semibold">{modelError}</p>
        </div>
      )}

      {wizardStep === WIZARD_STEPS.INTRODUCTION ? (
        <div className="space-y-5">
          {latestActiveRecord && (
            <FaceEnrollmentStatusCard 
              activeRecord={latestActiveRecord} 
              onReenrollTrigger={handleStartInitialization}
              isHrRestricted={isHrRestricted}
            />
          )}
          {(!latestActiveRecord || latestActiveRecord.status !== 'APPROVED') && (
            <FaceEnrollmentInstructions 
              onStart={handleStartInitialization}
              isPolicyRestricted={isHrRestricted}
              policyType={policyConfig?.policy_type}
            />
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
          <div className="md:col-span-2">
            <FaceCameraCapture 
              challengeEngine={challengeEngine}
              onStepVerified={handleStepCompletionSequence}
              onDescriptorGenerated={handleReceiveDescriptorArray}
              onResetWizard={handleResetCaptureSequence}
              isSubmitting={isSubmitting}
              modelsReady={modelsReady}
            />
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
            <h4 className="font-bold text-slate-900 uppercase tracking-wide text-[10px] text-slate-400">Scan Pipeline Track Matrix</h4>
            
            <div className="space-y-3">
              {sequence.map((challengeName, index) => {
                const stepNum = index + 1;
                const isPassed = currentIndex > index || wizardStep === WIZARD_STEPS.CAPTURE_PREVIEW;
                const isCurrent = currentIndex === index && wizardStep !== WIZARD_STEPS.CAPTURE_PREVIEW;

                return (
                  <div key={challengeName + index} className="flex items-center gap-2 text-[11px]">
                    <div className={`h-4 w-4 rounded-full border flex items-center justify-center font-mono text-[9px] font-black ${
                      isPassed 
                        ? 'bg-slate-900 border-slate-950 text-white' 
                        : isCurrent ? 'bg-indigo-50 border-indigo-500 text-indigo-700 font-bold ring-2 ring-indigo-50' : 'bg-slate-50 border-slate-200 text-slate-400'
                    }`}>
                      {isPassed ? '✓' : stepNum}
                    </div>
                    <span className={isCurrent ? 'font-bold text-slate-900' : 'text-slate-500'}>
                      {formatChallengeLabel(challengeName)} Verification
                    </span>
                  </div>
                );
              })}
            </div>

            {wizardStep === WIZARD_STEPS.CAPTURE_PREVIEW && (
              <div className="pt-3 border-t border-slate-100 space-y-2 animate-scaleIn">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleDispatchPayloadMutation}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-all active:scale-98"
                >
                  {isSubmitting && <Loader2 className="h-3 w-3 animate-spin text-white" />}
                  <span>Commit Biometric Profile</span>
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => {
                    setWizardStep(WIZARD_STEPS.INTRODUCTION);
                    setCachedDescriptorArray(null);
                    resetChallenges();
                  }}
                  className="w-full py-2.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-bold rounded-xl text-xs transition-all cursor-pointer flex items-center justify-center"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}