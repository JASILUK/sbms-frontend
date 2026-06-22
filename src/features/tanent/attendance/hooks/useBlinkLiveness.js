import { useState, useEffect, useRef, useCallback } from 'react';
import * as faceapi from 'face-api.js';
import { estimateFaceYawAngle } from '../utils/faceEmbedding';
import { COMPLIANCE_CHALLENGES } from './useChallengeSequence';
import { BIOMETRIC_BOUNDS } from '../constants/faceEnrollmentConstants';
import { validateSingleFace, validateFaceSize, validateFaceCenter, calculateBrightness } from '../utils/faceValidation';
import { activeEmbeddingProvider } from '../utils/EmbeddingProvider';

const FRAME_INTERVAL_MS = 100;

function estimatePitch(landmarks) {
  const nose = landmarks[30];        
  const chin = landmarks[8];         
  const forehead = landmarks[27];    
  
  const faceHeight = Math.abs(chin.y - forehead.y);
  if (faceHeight === 0) return 0;
  
  const faceCenterY = (forehead.y + chin.y) / 2;
  return (nose.y - faceCenterY) / faceHeight;
}

function estimateMouthOpen(landmarks) {
  const upperLip = landmarks[62];
  const lowerLip = landmarks[66];
  const leftCorner = landmarks[48];
  const rightCorner = landmarks[54];
  
  const lipDistance = Math.abs(lowerLip.y - upperLip.y);
  const mouthWidth = Math.abs(rightCorner.x - leftCorner.x);
  if (mouthWidth === 0) return 0;
  
  return lipDistance / mouthWidth;
}

export function useBlinkLiveness(
  isActive,
  currentChallenge,
  isPipelineComplete,
  videoRef,
  onChallengePassed,
  onPipelineComplete
) {
  const [livenessError, setLivenessError] = useState(null);
  const [computedDescriptor, setComputedDescriptor] = useState(null);

  const intervalIdRef = useRef(null);
  const isProcessingFrameRef = useRef(false);

  const challengeStateRef = useRef({
    calibrations: {},  
  });

  const lastChallengeRef = useRef(null);

  const resetLivenessEngine = useCallback(() => {
    setComputedDescriptor(null);
    setLivenessError(null);
    challengeStateRef.current = { calibrations: {} };
    lastChallengeRef.current = null;
    isProcessingFrameRef.current = false;
  }, []);

  useEffect(() => {
    if (currentChallenge !== lastChallengeRef.current) {
      lastChallengeRef.current = currentChallenge;
      setLivenessError(null);
    }
  }, [currentChallenge]);

  const processFrame = useCallback(async () => {
    const video = videoRef.current;
    if (!isActive || !video || video.paused || video.ended || video.readyState < 2 || isProcessingFrameRef.current) {
      return;
    }

    if (!faceapi.nets.tinyFaceDetector.params || !faceapi.nets.faceLandmark68Net.params) {
      setLivenessError('Loading...');
      return;
    }

    isProcessingFrameRef.current = true;

    try {
      if (video.videoWidth === 0 || video.videoHeight === 0) {
        isProcessingFrameRef.current = false;
        return;
      }

      const detection = await faceapi
        .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions({ inputSize: 320, scoreThreshold: 0.5 }))
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detection?.detection?.box) {
        setLivenessError('Align your face in the frame');
        isProcessingFrameRef.current = false;
        return;
      }

      const boundingBox = detection.detection.box;

      const singleFaceValid = validateSingleFace(detection, 0.45);
      const faceSizeValid = validateFaceSize(boundingBox, BIOMETRIC_BOUNDS.FACE_MIN_WIDTH * 0.85, BIOMETRIC_BOUNDS.FACE_MAX_WIDTH * 1.15);
      const faceCenterValid = validateFaceCenter(boundingBox, video.videoWidth, video.videoHeight, BIOMETRIC_BOUNDS.CENTER_TOLERANCE_PERCENT * 1.2);
      const brightness = calculateBrightness(video);

      if (!singleFaceValid.isValid || !faceSizeValid.isValid || !faceCenterValid.isValid || brightness < BIOMETRIC_BOUNDS.MIN_BRIGHTNESS * 0.7) {
        const failMessage =
          !singleFaceValid.isValid ? singleFaceValid.message :
          !faceSizeValid.isValid ? faceSizeValid.message :
          !faceCenterValid.isValid ? faceCenterValid.message :
          'Too dark — find better lighting';
        setLivenessError(failMessage);
        isProcessingFrameRef.current = false;
        return;
      }

      setLivenessError(null);
      const landmarks = detection.landmarks.positions;
      const state = challengeStateRef.current;

      const calKey = currentChallenge || 'default';
      if (!state.calibrations[calKey]) {
        state.calibrations[calKey] = { value: null, samples: [], done: false };
      }
      const cal = state.calibrations[calKey];

      let challengeSucceeded = false;

      const needsCalibration = (
        (currentChallenge === COMPLIANCE_CHALLENGES.TURN_LEFT || 
         currentChallenge === COMPLIANCE_CHALLENGES.TURN_RIGHT ||
         currentChallenge === COMPLIANCE_CHALLENGES.NOD_UP || 
         currentChallenge === COMPLIANCE_CHALLENGES.NOD_DOWN) && cal.value === null
      );

      if (needsCalibration) {
        const yaw = estimateFaceYawAngle(landmarks);
        const pitch = estimatePitch(landmarks);

        cal.samples.push({ yaw, pitch });

        if (cal.samples.length < 8) {
          setLivenessError('Hold still… calibrating');
          isProcessingFrameRef.current = false;
          return;
        }

        const sortedYaw = cal.samples.map(s => s.yaw).sort((a, b) => a - b);
        const sortedPitch = cal.samples.map(s => s.pitch).sort((a, b) => a - b);
        
        cal.value = {
          yaw: sortedYaw[Math.floor(sortedYaw.length / 2)],
          pitch: sortedPitch[Math.floor(sortedPitch.length / 2)],
        };
        cal.done = true;

        setLivenessError('Calibrated! Follow the instruction');
        isProcessingFrameRef.current = false;
        return;
      }

      const currentYaw = estimateFaceYawAngle(landmarks);
      const currentPitch = estimatePitch(landmarks);
      
      if (currentChallenge === COMPLIANCE_CHALLENGES.TURN_LEFT) {
        const delta = cal.value.yaw - currentYaw;
        if (delta < 0.18) setLivenessError('Turn your head LEFT');
        else challengeSucceeded = true;
      }

      if (currentChallenge === COMPLIANCE_CHALLENGES.TURN_RIGHT) {
        const delta = currentYaw - cal.value.yaw;
        if (delta < 0.18) setLivenessError('Turn your head RIGHT');
        else challengeSucceeded = true;
      }

      if (currentChallenge === COMPLIANCE_CHALLENGES.NOD_UP) {
        const delta = cal.value.pitch - currentPitch;
        if (delta < 0.05) setLivenessError('Look UP — tilt head back');
        else challengeSucceeded = true;
      }

      if (currentChallenge === COMPLIANCE_CHALLENGES.NOD_DOWN) {
        const delta = currentPitch - cal.value.pitch;
        if (delta < 0.05) setLivenessError('Look DOWN — tilt chin down');
        else challengeSucceeded = true;
      }

      if (currentChallenge === COMPLIANCE_CHALLENGES.OPEN_MOUTH) {
        const mouthOpen = estimateMouthOpen(landmarks);
        if (mouthOpen > 0.25) challengeSucceeded = true;
        else setLivenessError('Open your mouth wide');
      }

      // ── PIPELINE PASS VERIFICATION STEP ──
      if (challengeSucceeded) {
        // ✅ FIXED: Determine absolute final challenge completion status immediately
        const isFinalStep = isPipelineComplete || currentChallenge === null;

        if (isFinalStep && !computedDescriptor) {
          console.log("🧬 Final step matched. Compiling 128D descriptor matrix...");
          const finalVectorToken = await activeEmbeddingProvider.generateEmbedding(video, detection);
          setComputedDescriptor(finalVectorToken);
          
          onPipelineComplete(finalVectorToken);

          if (intervalIdRef.current) {
            clearInterval(intervalIdRef.current);
            intervalIdRef.current = null;
          }
        }

        onChallengePassed();
      }
    } catch (err) {
      console.error('Frame processing error:', err);
    }

    isProcessingFrameRef.current = false;
  }, [isActive, currentChallenge, isPipelineComplete, computedDescriptor, onChallengePassed, onPipelineComplete, videoRef]);

  useEffect(() => {
    if (isActive) {
      intervalIdRef.current = setInterval(processFrame, FRAME_INTERVAL_MS);
    }
    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
    };
  }, [isActive, processFrame]);

  return {
    livenessError,
    computedDescriptor,
    resetLivenessEngine,
  };
}