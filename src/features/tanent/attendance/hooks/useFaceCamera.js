import { useState, useCallback, useRef, useEffect } from 'react';

export function useFaceCamera() {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [cameraError, setCameraError] = useState(null);
  const [isActive, setIsActive] = useState(false);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
        streamRef.current.removeTrack(track);
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsActive(false);
  }, []);

  const startCamera = useCallback(async () => {
    setCameraError(null);
    stopCamera(); // Defensive baseline purge before requesting hardware links

    try {
      const mediaPromise = navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 640 }, // Enforce 1:1 aspect ratio square tracking maps
          frameRate: { ideal: 30 }
        },
        audio: false
      });

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Hardware timeout')), 7000)
      );

      const mediaStream = await Promise.race([mediaPromise, timeoutPromise]);
      streamRef.current = mediaStream;

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        // Wait for video metadata to load completely before declaring active state
        await new Promise((resolve) => {
          videoRef.current.onloadedmetadata = () => resolve();
        });
        await videoRef.current.play();
      }
      setIsActive(true);
    } catch (err) {
      console.error("Webcam track capture failure:", err);
      stopCamera();
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError("Camera access denied. Enable permissions in your browser settings.");
      } else {
        setCameraError("Webcam busy or timed out. Close other apps using your camera and try again.");
      }
    }
  }, [stopCamera]);

  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  return {
    videoRef,
    cameraError,
    isActive,
    startCamera,
    stopCamera,
  };
}