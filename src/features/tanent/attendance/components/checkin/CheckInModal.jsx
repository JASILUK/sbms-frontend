import React, { useEffect, useRef, useCallback, useState } from "react";
import { createPortal } from "react-dom";
import * as faceapi from 'face-api.js';
import {
  X,
  MapPin,
  ScanFace,
  QrCode,
  Fingerprint,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  Navigation,
  ShieldCheck,
  Camera,
  RefreshCw,
  ChevronRight,
  LocateFixed,
} from "lucide-react";

const METHOD_ICONS = {
  GPS: MapPin,
  FACE: ScanFace,
  QR: QrCode,
  BIOMETRIC: Fingerprint,
};

const METHOD_LABELS = {
  GPS: "GPS Location",
  FACE: "Face Recognition",
  QR: "QR Code Scan",
  BIOMETRIC: "Biometric Device",
};

const METHOD_DESCRIPTIONS = {
  GPS: "Verify your current location",
  FACE: "Verify your identity with face scan",
  QR: "Scan office QR code to verify",
  BIOMETRIC: "Use biometric device to verify",
};

// ─── Modal Backdrop ─────────────────────────────────────────────

function ModalBackdrop({ children, onClose, isOpen, allowClose }) {
  const backdropRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e) => {
      if (e.key === "Escape" && allowClose) onClose();
    };
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose, allowClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      aria-modal="true"
      role="dialog"
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={allowClose ? onClose : undefined}
        aria-hidden="true"
      />
      <div className="relative z-10 w-full sm:max-w-lg sm:mx-4 bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[92vh] sm:max-h-[85vh] flex flex-col animate-slideUp sm:animate-fadeIn">
        {children}
      </div>
    </div>,
    document.body
  );
}

function ModalHeader({ title, onClose, showClose = true }) {
  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 flex-shrink-0">
      <h2 className="text-sm font-bold text-slate-900 tracking-tight">{title}</h2>
      {showClose && (
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-200"
          aria-label="Close modal"
        >
          <X className="h-4 w-4 text-slate-500" />
        </button>
      )}
    </div>
  );
}

function ContextBar({ today, actionLabel }) {
  const shift = today?.shift;
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="mx-5 mt-4 p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-bold text-slate-700">
            {dateStr}
            {shift?.name && (
              <span className="text-slate-400 font-medium ml-1">• {shift.name} Shift</span>
            )}
          </p>
          {shift?.start && shift?.end && (
            <p className="text-[10px] text-slate-400 mt-0.5 font-medium">
              {shift.start} — {shift.end}
            </p>
          )}
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-white border border-slate-200 px-2 py-0.5 rounded-md">
          {actionLabel}
        </span>
      </div>
    </div>
  );
}

function StepIndicator({ currentStep, totalSteps, stepLabels }) {
  return (
    <div className="flex items-center justify-center gap-2 py-3">
      {Array.from({ length: totalSteps }).map((_, i) => {
        const isActive = i + 1 === currentStep;
        const isCompleted = i + 1 < currentStep;
        return (
          <div key={i} className="flex items-center gap-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                isActive
                  ? "w-6 bg-slate-900"
                  : isCompleted
                  ? "w-2 bg-emerald-500"
                  : "w-2 bg-slate-200"
              }`}
            />
            {isActive && stepLabels[i] && (
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                {stepLabels[i]}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

function MethodCard({ method, onSelect, disabled }) {
  const Icon = METHOD_ICONS[method] || MapPin;
  return (
    <button
      onClick={() => onSelect(method)}
      disabled={disabled}
      className="w-full p-4 bg-white border border-slate-200 rounded-xl hover:border-slate-300 hover:shadow-sm transition-all active:scale-[0.98] text-left group focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <div className="flex items-start gap-3">
        <div className="p-2.5 bg-slate-50 rounded-lg group-hover:bg-slate-100 transition-colors">
          <Icon className="h-5 w-5 text-slate-700" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-slate-900">{METHOD_LABELS[method]}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">{METHOD_DESCRIPTIONS[method]}</p>
        </div>
        <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-slate-500 transition-colors mt-1" />
      </div>
    </button>
  );
}

// ─── GPS VERIFY PANEL ───────────────────────────────────────────

function GPSVerifyPanel({ onVerify, isVerifying, error, result, gpsLocation }) {
  const [coords, setCoords] = useState(gpsLocation);
  const [isLocating, setIsLocating] = useState(false);
  const [locError, setLocError] = useState(null);
  const mapRef = useRef(null);

  const getLocation = useCallback(() => {
    setIsLocating(true);
    setLocError(null);

    if (!navigator.geolocation) {
      setLocError("Geolocation not supported by this browser.");
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        setCoords({ latitude, longitude, accuracy });
        setIsLocating(false);
      },
      (geoError) => {
        let msg = "Unable to get location.";
        if (geoError.code === geoError.PERMISSION_DENIED) {
          msg = "Location permission denied. Please allow location access in browser settings.";
        } else if (geoError.code === geoError.POSITION_UNAVAILABLE) {
          msg = "Location unavailable. Please try again.";
        } else if (geoError.code === geoError.TIMEOUT) {
          msg = "Location request timed out. Please try again.";
        }
        setLocError(msg);
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
    );
  }, []);

  useEffect(() => {
    if (!coords) getLocation();
  }, [getLocation, coords]);

  useEffect(() => {
    if (!coords || !mapRef.current) return;
    const { latitude, longitude } = coords;
    const delta = 0.005;
    mapRef.current.src = `https://www.openstreetmap.org/export/embed.html?bbox=${
      longitude - delta
    }%2C${latitude - delta}%2C${longitude + delta}%2C${
      latitude + delta
    }&layer=mapnik&marker=${latitude}%2C${longitude}`;
  }, [coords]);

  if (result) {
    return (
      <div className="p-5 space-y-4">
        <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
          <div className="p-2 bg-emerald-100 rounded-full">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs font-bold text-emerald-800">Location Verified</p>
            <p className="text-[11px] text-emerald-600">
              {result.location_name} ({result.distance_meters?.toFixed(0)}m away)
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 space-y-4">
      <div className="relative w-full h-48 bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
        {coords ? (
          <iframe ref={mapRef} title="Current Location" className="w-full h-full border-0" loading="lazy" />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
            {isLocating ? (
              <>
                <Loader2 className="h-8 w-8 animate-spin mb-2 text-slate-600" />
                <p className="text-xs font-medium">Getting your location...</p>
              </>
            ) : (
              <>
                <LocateFixed className="h-8 w-8 mb-2" />
                <p className="text-xs font-medium">Waiting for location...</p>
              </>
            )}
          </div>
        )}
        {coords && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm px-2.5 py-1.5 rounded-lg border border-slate-200 shadow-sm">
            <Navigation className="h-3 w-3 text-slate-600" />
            <span className="text-[10px] font-bold text-slate-700">
              {coords.latitude.toFixed(5)}, {coords.longitude.toFixed(5)}
            </span>
          </div>
        )}
      </div>

      {coords && (
        <div className="flex items-center gap-2 text-[11px] text-slate-500">
          <MapPin className="h-3.5 w-3.5 text-slate-400" />
          <span>Lat: {coords.latitude.toFixed(5)}, Lng: {coords.longitude.toFixed(5)}</span>
        </div>
      )}

      {(error || locError) && (
        <div className="flex items-start gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl">
          <AlertCircle className="h-4 w-4 text-rose-500 mt-0.5 flex-shrink-0" />
          <p className="text-[11px] text-rose-700 leading-relaxed">{error || locError}</p>
        </div>
      )}

      <div className="space-y-2">
        <button
          onClick={coords ? onVerify : getLocation}
          disabled={isVerifying || isLocating}
          className="w-full py-3 px-4 bg-slate-900 text-white font-bold rounded-xl text-xs tracking-tight transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:bg-slate-800"
        >
          {isVerifying ? (
            <><Loader2 className="h-4 w-4 animate-spin" />Verifying location...</>
          ) : isLocating ? (
            <><Loader2 className="h-4 w-4 animate-spin" />Getting location...</>
          ) : coords ? (
            <><ShieldCheck className="h-4 w-4" />Verify Location</>
          ) : (
            <><RefreshCw className="h-4 w-4" />Retry Location</>
          )}
        </button>
      </div>
    </div>
  );
}

// ─── FABRICATED FACE VERIFY PANEL ────────────────────────────────

function FaceVerifyPanel({ onVerify, isVerifying, error, result }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);

  useEffect(() => {
    const initializePanel = async () => {
      try {
        const MODEL_URL = '/models'; 
        
        if (
          !faceapi.nets.tinyFaceDetector.params || 
          !faceapi.nets.faceLandmark68Net.params ||
          !faceapi.nets.faceRecognitionNet.params
        ) {
          await Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
            faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
            faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
          ]);
        }
        setModelsLoaded(true);

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 640 } },
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setCameraReady(true);
          setCameraError(null);
        }
      } catch (err) {
        console.error("Panel init error:", err);
        setCameraError("Initialization failed. Check system permissions or models folder path.");
      }
    };

    initializePanel();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleCapture = useCallback(async () => {
    if (!videoRef.current || !cameraReady || !modelsLoaded || isCapturing) return;
    setIsCapturing(true);
    
    try {
      const video = videoRef.current;
      
      const detection = await faceapi
        .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions({ inputSize: 320, scoreThreshold: 0.5 }))
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detection) {
        throw new Error("No face detected. Center your face inside the guide frame ring and adjust lighting.");
      }

      const faceEmbedding = Array.from(detection.descriptor);
      await onVerify(faceEmbedding);
    } catch (err) {
      console.error("Face landmark track parsing failed:", err);
      alert(err.message || "Face tracking failed. Please ensure your face is well-lit.");
    } finally {
      setIsCapturing(false);
    }
  }, [cameraReady, modelsLoaded, isCapturing, onVerify]);

  if (result) {
    return (
      <div className="p-5 space-y-4">
        <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
          <div className="p-2 bg-emerald-100 rounded-full">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs font-bold text-emerald-800">Identity Verified</p>
            <p className="text-[11px] text-emerald-600">
              Confidence: {(result.confidence * 100).toFixed(0)}% match confidence clear
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 space-y-4">
      <div className="relative w-full aspect-[1/1] bg-slate-900 rounded-xl overflow-hidden border border-slate-800 shadow-inner">
        <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-40 h-52 border-2 border-dashed border-white/40 rounded-[40%] flex items-center justify-center">
            <div className="w-36 h-48 border border-white/10 rounded-[40%]" />
          </div>
        </div>
        <div className="absolute top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full">
          <p className="text-[10px] font-bold text-white/90">
            {!modelsLoaded ? "Loading AI models..." : cameraReady ? "Align your face in the frame guide" : "Initializing camera matrix tracks..."}
          </p>
        </div>
      </div>

      <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-[11px] text-slate-500 leading-normal">
        💡 <span className="font-bold text-slate-700">Night Shift Tip:</span> Lean slightly closer toward your monitor screen panel. The bright white glare from the interface will illuminate your profile features, compensating for missing ambient illumination and matching your daylight registration data.
      </div>

      {cameraError && (
        <div className="flex items-start gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl">
          <AlertCircle className="h-4 w-4 text-rose-500 mt-0.5 flex-shrink-0" />
          <p className="text-[11px] text-rose-700 leading-relaxed">{cameraError}</p>
        </div>
      )}

      {error && !cameraError && (
        <div className="flex items-start gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl">
          <AlertCircle className="h-4 w-4 text-rose-500 mt-0.5 flex-shrink-0" />
          <p className="text-[11px] text-rose-700 leading-relaxed">{error}</p>
        </div>
      )}

      <button
        onClick={handleCapture}
        disabled={isVerifying || isCapturing || !cameraReady || !modelsLoaded}
        className="w-full py-3 px-4 bg-slate-900 text-white font-bold rounded-xl text-xs tracking-tight transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:bg-slate-800"
      >
        {isVerifying || isCapturing ? (
          <><Loader2 className="h-4 w-4 animate-spin text-white" />Analyzing Facial Vectors...</>
        ) : (
          <><Camera className="h-4 w-4" />Capture & Verify</>
        )}
      </button>
    </div>
  );
}

// ─── CONFIRM / PANELS ───────────────────────────────────────────

function ConfirmPanel({ verificationResults, actionType, actionLabel, onConfirm, isPunching }) {
  const gpsResult = verificationResults.gps;
  const faceResult = verificationResults.face;

  return (
    <div className="p-5 space-y-5">
      <div className="text-center space-y-1">
        <ShieldCheck className="h-8 w-8 text-slate-700 mx-auto" />
        <p className="text-xs font-bold text-slate-900">Ready to Confirm</p>
        <p className="text-[11px] text-slate-500">Review your verification details below</p>
      </div>

      <div className="space-y-2.5">
        {gpsResult && (
          <div className="flex items-center gap-3 p-3 bg-emerald-50/60 border border-emerald-200/50 rounded-xl">
            <div className="p-1.5 bg-emerald-100 rounded-lg"><MapPin className="h-4 w-4 text-emerald-600" /></div>
            <div className="flex-1">
              <p className="text-[11px] font-bold text-emerald-800">GPS Verified</p>
              <p className="text-[10px] text-emerald-600">{gpsResult.location_name} ({gpsResult.distance_meters?.toFixed(1)}m away)</p>
            </div>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>
        )}
        {faceResult && (
          <div className="flex items-center gap-3 p-3 bg-emerald-50/60 border border-emerald-200/50 rounded-xl">
            <div className="p-1.5 bg-emerald-100 rounded-lg"><ScanFace className="h-4 w-4 text-emerald-600" /></div>
            <div className="flex-1">
              <p className="text-[11px] font-bold text-emerald-800">Face Verified</p>
              <p className="text-[10px] text-emerald-600">{(faceResult.confidence * 100).toFixed(0)}% match confidence</p>
            </div>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>
        )}
      </div>

      <button
        onClick={onConfirm}
        disabled={isPunching}
        className="w-full py-3.5 px-4 bg-slate-900 text-white font-bold rounded-xl text-sm tracking-tight transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:bg-slate-800 shadow-lg"
      >
        {isPunching ? <><Loader2 className="h-4 w-4 animate-spin" />Recording attendance...</> : <><span>Confirm {actionLabel}</span><ArrowRight className="h-4 w-4" /></>}
      </button>
    </div>
  );
}

function ProcessingPanel({ actionLabel }) {
  return (
    <div className="p-10 flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        <div className="h-16 w-16 rounded-full border-4 border-slate-100" />
        <div className="absolute inset-0 h-16 w-16 rounded-full border-4 border-slate-900 border-t-transparent animate-spin" />
      </div>
      <p className="text-sm font-bold text-slate-900">Recording {actionLabel.toLowerCase()}...</p>
      <p className="text-[11px] text-slate-400">Please do not close this window</p>
    </div>
  );
}

function SuccessPanel({ message }) {
  const now = new Date();
  const timeStr = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  return (
    <div className="p-10 flex flex-col items-center justify-center space-y-4 animate-fadeIn">
      <div className="h-20 w-20 rounded-full bg-emerald-50 flex items-center justify-center border-4 border-emerald-100">
        <CheckCircle2 className="h-10 w-10 text-emerald-500" />
      </div>
      <div className="text-center space-y-1">
        <p className="text-sm font-bold text-emerald-800">{message}</p>
        <p className="text-[11px] text-emerald-600/80">at {timeStr}</p>
      </div>
      <p className="text-[10px] text-slate-400 animate-pulse">Closing automatically...</p>
    </div>
  );
}

function ErrorPanel({ error, onRetry, onReset }) {
  return (
    <div className="p-5 space-y-4">
      <div className="flex flex-col items-center text-center space-y-3 py-4">
        <div className="h-16 w-16 rounded-full bg-rose-50 flex items-center justify-center border-4 border-rose-100">
          <AlertCircle className="h-8 w-8 text-rose-500" />
        </div>
        <div>
          <p className="text-sm font-bold text-rose-800">Something went wrong</p>
          <p className="text-[11px] text-rose-600 mt-1 max-w-xs mx-auto">{error}</p>
        </div>
      </div>
      <div className="flex gap-3">
        <button onClick={onReset} className="flex-1 py-2.5 px-4 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl text-xs tracking-tight transition-all active:scale-[0.98] hover:bg-slate-50">Go Back</button>
        <button onClick={onRetry} className="flex-1 py-2.5 px-4 bg-slate-900 text-white font-bold rounded-xl text-xs tracking-tight transition-all active:scale-[0.98] hover:bg-slate-800 flex items-center justify-center gap-2">
          <RefreshCw className="h-3.5 w-3.5" />Try Again
        </button>
      </div>
    </div>
  );
}

// ─── MAIN EXPORT GATEWAY ────────────────────────────────────────

export default function CheckInModal({
  isOpen, onClose, accessConfig, todayStatus, actionType, actionLabel,
  currentStep, selectedMethod, verificationTokens, verificationResults, gpsLocation, error, successMessage, steps,
  selectMethod, verifyGPS, verifyFace, confirmPunch, resetError,
  isVerifyingGPS, isVerifyingFace, isPunching,
}) {
  const { validation_mode, available_methods, gps_required, face_required } = accessConfig || {};
  const methods = available_methods || [];

  const getStepInfo = () => {
    if (validation_mode === "ALL" || validation_mode === "STRICT_ALL") {
      const hasGPS = gps_required || methods.includes("GPS");
      const hasFace = face_required || methods.includes("FACE");
      const total = (hasGPS ? 1 : 0) + (hasFace ? 1 : 0) + 1;
      let current = 1;
      if (currentStep === steps.GPS_VERIFY) current = 1;
      else if (currentStep === steps.FACE_VERIFY) current = hasGPS ? 2 : 1;
      else if ([steps.CONFIRM, steps.PROCESSING, steps.SUCCESS].includes(currentStep)) current = total;
      const labels = [];
      if (hasGPS) labels.push("GPS");
      if (hasFace) labels.push("Face");
      labels.push("Confirm");
      return { current, total, labels };
    }
    return { current: 1, total: 1, labels: ["Verify"] };
  };

  const stepInfo = getStepInfo();
  const activeMethods = methods.filter((m) => ["GPS", "FACE", "QR", "BIOMETRIC"].includes(m));

  const handleRetry = () => {
    if (currentStep === steps.ERROR) {
      if (!verificationTokens.gps && (gps_required || methods.includes("GPS"))) resetError();
      else if (!verificationTokens.face && (face_required || methods.includes("FACE"))) resetError();
      else confirmPunch();
    }
  };

  return (
    <ModalBackdrop isOpen={isOpen} onClose={onClose} allowClose={currentStep !== steps.PROCESSING}>
      <ModalHeader title={`${actionLabel || "Check In"}`} onClose={onClose} showClose={currentStep !== steps.PROCESSING} />
      <div className="flex-1 overflow-y-auto">
        <ContextBar today={{ shift: accessConfig?.shift }} actionLabel={actionLabel} />
        {(validation_mode === "ALL" || validation_mode === "STRICT_ALL") &&
          currentStep !== steps.METHOD_SELECTION &&
          currentStep !== steps.SUCCESS &&
          currentStep !== steps.ERROR && (
            <StepIndicator currentStep={stepInfo.current} totalSteps={stepInfo.total} stepLabels={stepInfo.labels} />
          )}

        {currentStep === steps.METHOD_SELECTION && (
          <div className="p-5 space-y-3">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Choose Verification Method</p>
            {activeMethods.map((method) => (
              <MethodCard key={method} method={method} onSelect={selectMethod} disabled={false} />
            ))}
            {activeMethods.length === 0 && (
              <div className="text-center py-8 text-slate-400">
                <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                <p className="text-xs">No verification methods available</p>
              </div>
            )}
          </div>
        )}

        {currentStep === steps.GPS_VERIFY && (
          <GPSVerifyPanel onVerify={verifyGPS} isVerifying={isVerifyingGPS} error={error} result={verificationResults.gps} gpsLocation={gpsLocation} />
        )}

        {currentStep === steps.FACE_VERIFY && (
          <FaceVerifyPanel onVerify={(faceEmbedding) => verifyFace(faceEmbedding)} isVerifying={isVerifyingFace} error={error} result={verificationResults.face} />
        )}

        {currentStep === steps.CONFIRM && (
          <ConfirmPanel verificationResults={verificationResults} actionType={actionType} actionLabel={actionLabel} onConfirm={confirmPunch} isPunching={isPunching} />
        )}

        {currentStep === steps.PROCESSING && <ProcessingPanel actionLabel={actionLabel} />}
        {currentStep === steps.SUCCESS && <SuccessPanel message={successMessage} />}
        {currentStep === steps.ERROR && <ErrorPanel error={error} onRetry={handleRetry} onReset={resetError} />}
      </div>
    </ModalBackdrop>
  );
}