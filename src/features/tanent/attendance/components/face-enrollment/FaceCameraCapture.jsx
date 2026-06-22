import React, { useEffect, useState, useCallback } from 'react';
import { Sparkles, CheckCircle2, ArrowLeft, ArrowRight, ArrowUp, ArrowDown, RefreshCw, AlertCircle, Loader2, Smile } from 'lucide-react';
import { useFaceCamera } from '../../hooks/useFaceCamera';
import { useBlinkLiveness } from '../../hooks/useBlinkLiveness';
import { COMPLIANCE_CHALLENGES } from '../../hooks/useChallengeSequence';

export function FaceCameraCapture({ 
  challengeEngine,
  onStepVerified, 
  onDescriptorGenerated, 
  onResetWizard, 
  isSubmitting, 
  modelsReady = true 
}) {
  const { videoRef, cameraError, isActive, startCamera, stopCamera } = useFaceCamera();
  const [isWarmingUp, setIsWarmingUp] = useState(true);
  
  // ✅ FIXED: Defensive Guard layout preventing unmount destructuring crashes during async step transitions
  if (!challengeEngine) {
    return (
      <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col items-center justify-center transition-all duration-300 w-full max-w-sm mx-auto min-h-[380px]">
        <div className="h-60 w-60 rounded-full border border-slate-100 flex flex-col items-center justify-center bg-slate-50 gap-2 font-bold text-[11px] text-slate-400">
          <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
          <span>Initializing tracking matrices...</span>
        </div>
      </div>
    );
  }

  // Safe to destructure now that context validation checks have resolved cleanly
  const {
    sequence = [],
    currentChallenge,
    currentIndex = 0,
    isComplete = false,
    progress: sequenceProgress = 0,
    moveNext,
  } = challengeEngine;

  const handleChallengePassed = useCallback(() => {
    if (!sequence || sequence.length === 0) return;
    const isFinalChallenge = currentIndex === (sequence.length - 1);
    
    if (moveNext) moveNext();
    if (onStepVerified) onStepVerified();

    if (isFinalChallenge) {
      console.log("🏁 Final challenge verified successfully. Awaiting data collection event loop.");
    }
  }, [moveNext, onStepVerified, currentIndex, sequence]);

  const handlePipelineComplete = useCallback((finalDescriptor) => {
    if (onDescriptorGenerated && finalDescriptor) {
      const standardArray = Array.from(finalDescriptor);
      console.log("🧬 Vector signature compiled securely: ready to render Commit layout");
      onDescriptorGenerated(standardArray);
    }
  }, [onDescriptorGenerated]);

  const { 
    livenessError, 
    resetLivenessEngine 
  } = useBlinkLiveness(
    isActive && modelsReady && !isWarmingUp,
    currentChallenge,
    isComplete || (sequence.length > 0 && currentIndex === (sequence.length - 1)),
    videoRef,
    handleChallengePassed,
    handlePipelineComplete
  );

  useEffect(() => {
    let active = true;
    setIsWarmingUp(true);
    startCamera().then(() => {
      if (active) setTimeout(() => setIsWarmingUp(false), 400);
    });
    return () => { active = false; stopCamera(); };
  }, [startCamera, stopCamera]);

  const handleRetakeSequence = useCallback(() => {
    resetLivenessEngine();
    if (onResetWizard) onResetWizard();
  }, [resetLivenessEngine, onResetWizard]);

  const getRingColorStyle = () => {
    if (cameraError) return 'border-red-500 ring-4 ring-red-50';
    if (isComplete) return 'border-emerald-500 ring-4 ring-emerald-50 shadow-[0_0_20px_rgba(16,185,129,0.15)]';
    if (livenessError) return 'border-amber-400 ring-4 ring-amber-50';
    return 'border-indigo-600 ring-4 ring-indigo-50';
  };

  const getChallengeDisplay = () => {
    if (!modelsReady || isWarmingUp || cameraError) return null;
    
    switch (currentChallenge) {
      case COMPLIANCE_CHALLENGES.TURN_LEFT:
        return (
          <div className="animate-fadeIn space-y-1">
            <h3 className="text-xs font-bold text-indigo-900 uppercase tracking-wider flex items-center justify-center gap-1.5">
              <ArrowLeft className="h-4 w-4 text-indigo-600" /> Turn Head Left
            </h3>
            <p className="text-[11px] text-slate-400 font-normal">Face straight, then turn LEFT.</p>
          </div>
        );
      case COMPLIANCE_CHALLENGES.TURN_RIGHT:
        return (
          <div className="animate-fadeIn space-y-1">
            <h3 className="text-xs font-bold text-indigo-900 uppercase tracking-wider flex items-center justify-center gap-1.5">
              <ArrowRight className="h-4 w-4 text-indigo-600" /> Turn Head Right
            </h3>
            <p className="text-[11px] text-slate-400 font-normal">Face straight, then turn RIGHT.</p>
          </div>
        );
      case COMPLIANCE_CHALLENGES.NOD_UP:
        return (
          <div className="animate-fadeIn space-y-1">
            <h3 className="text-xs font-bold text-indigo-900 uppercase tracking-wider flex items-center justify-center gap-1.5">
              <ArrowUp className="h-4 w-4 text-indigo-600" /> Look Up
            </h3>
            <p className="text-[11px] text-slate-400 font-normal">Tilt head BACK — look at ceiling.</p>
          </div>
        );
      case COMPLIANCE_CHALLENGES.NOD_DOWN:
        return (
          <div className="animate-fadeIn space-y-1">
            <h3 className="text-xs font-bold text-indigo-900 uppercase tracking-wider flex items-center justify-center gap-1.5">
              <ArrowDown className="h-4 w-4 text-indigo-600" /> Look Down
            </h3>
            <p className="text-[11px] text-slate-400 font-normal">Tilt chin DOWN — look at floor.</p>
          </div>
        );
      case COMPLIANCE_CHALLENGES.OPEN_MOUTH:
        return (
          <div className="animate-fadeIn space-y-1">
            <h3 className="text-xs font-bold text-indigo-900 uppercase tracking-wider flex items-center justify-center gap-1.5">
              <Smile className="h-4 w-4 text-indigo-600" /> Open Mouth
            </h3>
            <p className="text-[11px] text-slate-400 font-normal">Open your mouth wide.</p>
          </div>
        );
      default:
        return isComplete ? (
          <div className="animate-scaleIn space-y-1">
            <h3 className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center justify-center gap-1.5">
              <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600" /> Done
            </h3>
            <p className="text-[11px] text-emerald-600/80 font-medium">All checks passed.</p>
          </div>
        ) : null;
    }
  };

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col items-center space-y-6 transition-all duration-300 w-full max-w-sm mx-auto">
      
      <div className="text-center space-y-1.5 w-full max-w-sm h-14 flex flex-col justify-center">
        {(!modelsReady || isWarmingUp) && !cameraError ? (
          <div className="flex items-center justify-center gap-2 text-[10px] font-bold tracking-wider text-slate-400 uppercase animate-pulse">
            <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-600" />
            <span>Loading...</span>
          </div>
        ) : getChallengeDisplay()}
      </div>

      <div className={`relative h-60 w-60 rounded-full overflow-hidden border-3 bg-slate-950 flex items-center justify-center transition-all duration-500 ease-out z-10 ${getRingColorStyle()}`}>
        {cameraError ? (
          <div className="p-5 text-center text-red-400 space-y-2 animate-fadeIn max-w-[180px]">
            <AlertCircle className="h-6 w-6 mx-auto stroke-[1.5]" />
            <p className="text-[10px] font-semibold leading-normal">{cameraError}</p>
          </div>
        ) : (
          <div className="relative w-full h-full">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              controls={false}
              disablePictureInPicture
              width="640"
              height="640"
              className={`h-full w-full object-cover scale-x-[-1] transition-all duration-500 ${isComplete || !modelsReady || isWarmingUp ? 'blur-xs opacity-40 brightness-75' : 'brightness-105'}`}
            />
            {isComplete && (
              <div className="absolute inset-0 flex items-center justify-center animate-scaleIn bg-emerald-900/10 backdrop-blur-xs">
                <div className="p-4 bg-white/95 text-emerald-600 rounded-full shadow-xl ring-8 ring-emerald-500/20">
                  <Sparkles className="h-8 w-8 stroke-[1.5] animate-pulse" />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="w-full space-y-1">
        <div className="flex justify-between text-[10px] uppercase tracking-wider font-bold text-slate-400">
          <span>Progress</span>
          <span>{isComplete ? `${sequence.length} of ${sequence.length}` : `${Math.max(0, currentIndex)} of ${sequence.length || 3}`}</span>
        </div>
        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-indigo-600 transition-all duration-300" style={{ width: `${sequenceProgress}%` }} />
        </div>
      </div>

      <div className="h-8 flex items-center justify-center w-full">
        {livenessError && !cameraError && !isComplete && !isWarmingUp && modelsReady && (
          <div className="px-3 py-1.5 bg-amber-50 border border-amber-200/60 rounded-xl text-amber-800 text-[10px] font-bold tracking-wide flex items-center gap-1.5 animate-fadeIn shadow-4xs">
            <AlertCircle className="h-3.5 w-3.5 text-amber-600 flex-shrink-0" />
            <span>{livenessError}</span>
          </div>
        )}
      </div>

      <div className="w-full max-w-xs transition-all duration-200">
        <button
          type="button"
          disabled={isSubmitting}
          onClick={handleRetakeSequence}
          className="w-full py-2.5 border border-slate-200 bg-white hover:bg-slate-50 hover:text-slate-900 text-slate-600 font-bold rounded-xl text-xs transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-1.5"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
}