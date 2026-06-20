import * as faceapi from 'face-api.js';

let modelsLoadedPromise = null;

/**
 * Enterprise Model Cache Engine Loader.
 * Prevents redundant network trips by wrapping execution inside an immutable promise chain.
 */
export function loadFaceApiModels(manifestUri = '/models') {
  if (!modelsLoadedPromise) {
    modelsLoadedPromise = Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(manifestUri),
      faceapi.nets.faceLandmark68Net.loadFromUri(manifestUri),
      faceapi.nets.faceRecognitionNet.loadFromUri(manifestUri)
    ]);
  }
  return modelsLoadedPromise;
}

/**
 * Computes a robust Eye Aspect Ratio (EAR) normalized against scale variances.
 * Expects the 6-point positional coordinate sub-array mapping of a single eye.
 */
export function calculateEyeAspectRatio(eyeLandmarks) {
  if (!eyeLandmarks || eyeLandmarks.length < 6) return 1.0;
  
  const distance = (p1, p2) => Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
  
  // Vertical coordinates pairs vectors tracking opening gaps
  const verticalLeft1 = distance(eyeLandmarks[1], eyeLandmarks[5]);
  const verticalLeft2 = distance(eyeLandmarks[2], eyeLandmarks[4]);
  
  // Horizontal total length vector tracking boundary limits
  const horizontalLeft = distance(eyeLandmarks[0], eyeLandmarks[3]);
  
  if (horizontalLeft === 0) return 1.0;
  return (verticalLeft1 + verticalLeft2) / (2.0 * horizontalLeft);
}

/**
 * Evaluates face rotation vector alignments using raw landmark coordinates.
 * Returns the exact asymmetry ratio value used directly by the liveness engine.
 * * ✅ REFACTORED: Replaced logarithmic degree estimates with facial symmetry tracking.
 * Calculates left and right spatial distances between the nose tip and outer jaw profile.
 */
export function estimateFaceYawAngle(landmarks) {
  if (!landmarks || landmarks.length < 17) return 1.0;
  
  const noseTipX = landmarks[30].x;
  const leftCheekX = landmarks[0].x;
  const rightCheekX = landmarks[16].x;

  const leftDistance = Math.abs(noseTipX - leftCheekX);
  const rightDistance = Math.abs(rightCheekX - noseTipX);

  if (rightDistance === 0) return 1.0;
  
  // Returns raw structural symmetry ratio index
  // 0.8 - 1.2 = Centered | < 0.65 = Turned Left | > 1.45 = Turned Right
  return leftDistance / rightDistance;
}