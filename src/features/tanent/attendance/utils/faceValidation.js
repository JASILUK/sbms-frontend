/**
 * Face processing bounding dimension and brightness checking gateway utility.
 * Production Safe Edition - Prevents Null Matrix Destructuring Crashes.
 */

/**
 * Validates whether exactly one face is detected with an acceptable confidence score.
 */
export function validateSingleFace(detection, scoreThreshold = 0.80) {
  if (!detection || !detection.detection) {
    return { isValid: false, message: "Align your face inside the center frame." };
  }
  if (detection.detection.score < scoreThreshold) {
    return { isValid: false, message: "Low visibility profile. Step into a brighter space." };
  }
  return { isValid: true, message: null };
}

/**
 * Validates whether the bounding box dimensions fit safely within optimal processing bounds.
 */
export function validateFaceSize(box, minWidth = 120, maxWidth = 420) {
  // Safe validation guard block against unpopulated box values from loss of tracking
  if (!box || box.width === null || box.width === undefined || isNaN(box.width)) {
    return { isValid: false, message: "Align your face inside the center frame." };
  }
  if (box.width < minWidth) {
    return { isValid: false, message: "Please step slightly closer to the camera." };
  }
  if (box.width > maxWidth) {
    return { isValid: false, message: "Please move slightly back from the lens." };
  }
  return { isValid: true, message: null };
}

/**
 * Validates face center alignment metrics against viewport canvas centers.
 * Dynamically broadens tracking thresholds to support wide head rotations without locking out.
 */
export function validateFaceCenter(box, containerWidth = 640, containerHeight = 640, tolerancePercent = 15) {
  // Safe validation fallback preventing structural null pointer destructuring crashes
  if (!box || box.x === null || box.y === null || box.width === null || box.height === null) {
    return { isValid: false, message: "Face tracking lost. Turn back slowly toward the center." };
  }
  
  const faceCenterX = box.x + box.width / 2;
  const faceCenterY = box.y + box.height / 2;
  const targetCenterX = containerWidth / 2;
  const targetCenterY = containerHeight / 2;

  // Expanded the clearance alignment window safely (3x tolerance) to allow wide left/right profile rotations
  const dynamicTolerance = tolerancePercent * 3; 
  const maxAllowedDeltaX = containerWidth * (dynamicTolerance / 100);
  const maxAllowedDeltaY = containerHeight * (dynamicTolerance / 100);

  if (Math.abs(faceCenterX - targetCenterX) > maxAllowedDeltaX || Math.abs(faceCenterY - targetCenterY) > maxAllowedDeltaY) {
    return { isValid: false, message: "Keep your face visible inside the circular reticle view." };
  }
  return { isValid: true, message: null };
}

/**
 * Calculates raw luminosity metrics directly from underlying canvas media context tracks.
 */
export function calculateBrightness(videoElement) {
  if (!videoElement || videoElement.readyState < 2) return 0;
  
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;
    const ctx = canvas.getContext('2d');
    if (!ctx) return 75;

    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    let totalLuminosity = 0;
    for (let i = 0; i < data.length; i += 4) {
      totalLuminosity += (0.299 * data[i] + 0.587 * data[i+1] + 0.114 * data[i+2]);
    }
    
    return totalLuminosity / (data.length / 4);
  } catch (e) {
    return 75; // Return safe standard intermediate baseline if canvas read permissions lock
  }
}






