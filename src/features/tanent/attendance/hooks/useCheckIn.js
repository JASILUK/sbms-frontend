import { useState, useCallback, useRef, useEffect } from "react";
import {
  useVerifyGPSMutation,
  useVerifyFaceMutation,
  useCheckInMutation,
  useCheckOutMutation,
  useBreakOutMutation,
  useBreakInMutation,
} from "../api/attendanceApi";

const STEPS = {
  METHOD_SELECTION: "METHOD_SELECTION",
  GPS_VERIFY: "GPS_VERIFY",
  FACE_VERIFY: "FACE_VERIFY",
  CONFIRM: "CONFIRM",
  PROCESSING: "PROCESSING",
  SUCCESS: "SUCCESS",
  ERROR: "ERROR",
};

const ACTION_LABELS = {
  CHECK_IN: "Check In",
  CHECK_OUT: "Check Out",
  BREAK_OUT: "Start Break",
  BREAK_IN: "Resume Work",
};

/**
 * Extract actual data from API response wrapper
 * Backend returns: { success: true, message: "...", data: { ... } }
 */
function extractResponseData(result) {
  if (result && result.data && typeof result.data === "object") {
    return result.data;
  }
  return result;
}

export function useCheckIn() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(STEPS.METHOD_SELECTION);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [actionType, setActionType] = useState("CHECK_IN");
  const [accessConfig, setAccessConfig] = useState(null);
  const [verificationTokens, setVerificationTokens] = useState({
    gps: null,
    face: null,
  });
  const [verificationResults, setVerificationResults] = useState({
    gps: null,
    face: null,
  });
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [gpsLocation, setGpsLocation] = useState(null);

  const successTimerRef = useRef(null);

  const [verifyGPSApi, { isLoading: isVerifyingGPS }] = useVerifyGPSMutation();
  const [verifyFaceApi, { isLoading: isVerifyingFace }] = useVerifyFaceMutation();
  const [checkInApi, { isLoading: isCheckingIn }] = useCheckInMutation();
  const [checkOutApi, { isLoading: isCheckingOut }] = useCheckOutMutation();
  const [breakOutApi, { isLoading: isBreakingOut }] = useBreakOutMutation();
  const [breakInApi, { isLoading: isBreakingIn }] = useBreakInMutation();

  const isPunching = isCheckingIn || isCheckingOut || isBreakingOut || isBreakingIn;

  const determineInitialStep = useCallback((config) => {
    if (!config) return STEPS.METHOD_SELECTION;
    const { validation_mode, available_methods, gps_required, face_required } = config;
    const methods = available_methods || [];

    if (config.auto_synced) {
      return STEPS.ERROR;
    }

    // ALL / STRICT_ALL / FACE_GPS modes - sequential wizard progression
    if (validation_mode === "ALL" || validation_mode === "STRICT_ALL" || validation_mode === "FACE_GPS") {
      if (gps_required || methods.includes("GPS")) return STEPS.GPS_VERIFY;
      if (face_required || methods.includes("FACE")) return STEPS.FACE_VERIFY;
      return STEPS.CONFIRM;
    }

    // ANY mode - display selection card grid if multiple options exist
    if (validation_mode === "ANY") {
      const activeMethods = methods.filter((m) =>
        ["GPS", "FACE", "QR", "BIOMETRIC"].includes(m)
      );
      if (activeMethods.length === 1) {
        const method = activeMethods[0];
        if (method === "GPS") return STEPS.GPS_VERIFY;
        if (method === "FACE") return STEPS.FACE_VERIFY;
        return STEPS.METHOD_SELECTION;
      }
      return STEPS.METHOD_SELECTION;
    }

    return STEPS.METHOD_SELECTION;
  }, []);

  const getNextStep = useCallback(
    (config, currentStepType, tokens) => {
      const { validation_mode, available_methods } = config;
      const methods = available_methods || [];

      if (validation_mode === "ALL" || validation_mode === "STRICT_ALL" || validation_mode === "FACE_GPS") {
        if (currentStepType === STEPS.GPS_VERIFY) {
          // If face is also listed in the rule configuration, step straight into the camera layout
          if (config.face_required || methods.includes("FACE")) {
            return STEPS.FACE_VERIFY;
          }
          return STEPS.CONFIRM;
        }
        if (currentStepType === STEPS.FACE_VERIFY) {
          return STEPS.CONFIRM;
        }
      }

      return STEPS.CONFIRM;
    },
    []
  );

  const openModal = useCallback(
    (type, config) => {
      setActionType(type);
      setAccessConfig(config);
      setSelectedMethod(null);
      setVerificationTokens({ gps: null, face: null });
      setVerificationResults({ gps: null, face: null });
      setGpsLocation(null);
      setError(null);
      setSuccessMessage("");
      setCurrentStep(determineInitialStep(config));
      setIsModalOpen(true);
    },
    [determineInitialStep]
  );

  // ✅ FIXED: Explicitly zero out tracking cache layers on exit to block cross-user data leakage
  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setCurrentStep(STEPS.METHOD_SELECTION);
    setSelectedMethod(null);
    setVerificationTokens({ gps: null, face: null });
    setVerificationResults({ gps: null, face: null });
    setGpsLocation(null);
    setError(null);
    setSuccessMessage("");
    if (successTimerRef.current) {
      clearTimeout(successTimerRef.current);
      successTimerRef.current = null;
    }
  }, []);

  const selectMethod = useCallback((method) => {
    setSelectedMethod(method);
    setError(null);
    if (method === "GPS") {
      setCurrentStep(STEPS.GPS_VERIFY);
    } else if (method === "FACE") {
      setCurrentStep(STEPS.FACE_VERIFY);
    } else if (method === "QR" || method === "BIOMETRIC") {
      setCurrentStep(STEPS.CONFIRM);
    }
  }, []);

  // ─── GPS VERIFICATION ───
  const verifyGPS = useCallback(async () => {
    setError(null);

    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        const msg = "Geolocation is not supported by your browser.";
        setError(msg);
        reject(new Error(msg));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude, accuracy } = position.coords;
            setGpsLocation({ latitude, longitude, accuracy });

            const apiResult = await verifyGPSApi({ latitude, longitude }).unwrap();
            const result = extractResponseData(apiResult);

            if (result.verified) {
              setVerificationTokens((prev) => ({ ...prev, gps: result.token }));
              setVerificationResults((prev) => ({
                ...prev,
                gps: {
                  location_name: result.location_name,
                  distance_meters: result.distance_meters,
                },
              }));

              const currentTokens = {
                gps: result.token,
                face: verificationTokens.face,
              };

              const next = getNextStep(accessConfig, STEPS.GPS_VERIFY, currentTokens);
              setCurrentStep(next);
              resolve(result);
            } else {
              const msg = result.message || "GPS boundary validation failed.";
              setError(msg);
              reject(new Error(msg));
            }
          } catch (err) {
            const msg = err?.data?.message || err?.message || "GPS verification failed.";
            setError(msg);
            reject(err);
          }
        },
        (geoError) => {
          let msg = "Unable to retrieve your location.";
          switch (geoError.code) {
            case geoError.PERMISSION_DENIED:
              msg = "Location access denied. Please enable location permissions in browser settings.";
              break;
            case geoError.POSITION_UNAVAILABLE:
              msg = "Location information is unavailable.";
              break;
            case geoError.TIMEOUT:
              msg = "Location request timed out.";
              break;
          }
          setError(msg);
          reject(new Error(msg));
        },
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
      );
    });
  }, [verifyGPSApi, accessConfig, getNextStep, verificationTokens.face]);

  // ─── FACE VERIFICATION ───
  const verifyFace = useCallback(
    async (faceEmbedding) => {
      setError(null);
      // ✅ DEFENSIVE ENGINE: Guard against unpopulated or empty canvas tracking data parameters
      if (!faceEmbedding || faceEmbedding.length === 0) {
        setError("Biometric tracking extraction parameters are missing.");
        return;
      }

      try {
        const apiResult = await verifyFaceApi({
          face_embedding: faceEmbedding, // Fresh array forwarded straight from video canvas frame metrics
          verification_method: "browser_embedding",
        }).unwrap();

        const result = extractResponseData(apiResult);

        if (result.verified) {
          setVerificationTokens((prev) => ({ ...prev, face: result.token }));
          setVerificationResults((prev) => ({
            ...prev,
            face: { confidence: result.confidence },
          }));

          const currentTokens = {
            gps: verificationTokens.gps,
            face: result.token,
          };

          const next = getNextStep(accessConfig, STEPS.FACE_VERIFY, currentTokens);
          setCurrentStep(next);
          return result;
        } else {
          const msg = "Face structure matrix mismatch. Access denied.";
          setError(msg);
          throw new Error(msg);
        }
      } catch (err) {
        const msg = err?.data?.message || err?.message || "Face verification failed.";
        setError(msg);
        throw err;
      }
    },
    [verifyFaceApi, accessConfig, getNextStep, verificationTokens.gps]
  );

  const buildAttendanceMethod = useCallback(() => {
    const hasGPS = !!verificationTokens.gps;
    const hasFace = !!verificationTokens.face;

    if (hasGPS && hasFace) return "GPS_FACE";
    if (hasGPS) return "GPS_ONLY";
    if (hasFace) return "FACE_ONLY";
    if (selectedMethod === "BIOMETRIC") return "BIOMETRIC";
    if (selectedMethod === "QR") return "QR_ONLY";
    return "GPS_ONLY";
  }, [verificationTokens, selectedMethod]);

  // ─── CONFIRM PUNCH ───
  const confirmPunch = useCallback(async () => {
    setError(null);
    setCurrentStep(STEPS.PROCESSING);

    const attendanceMethod = buildAttendanceMethod();
    const payload = {
      attendance_method: attendanceMethod,
    };

    if (verificationTokens.gps) {
      payload.gps_verification_token = verificationTokens.gps;
    }
    if (verificationTokens.face) {
      payload.face_verification_token = verificationTokens.face;
    }

    try {
      let apiResult;
      switch (actionType) {
        case "CHECK_IN":
          apiResult = await checkInApi(payload).unwrap();
          break;
        case "CHECK_OUT":
          apiResult = await checkOutApi(payload).unwrap();
          break;
        case "BREAK_OUT":
          apiResult = await breakOutApi(payload).unwrap();
          break;
        case "BREAK_IN":
          apiResult = await breakInApi(payload).unwrap();
          break;
        default:
          throw new Error("Invalid action type");
      }

      const result = extractResponseData(apiResult);
      const message = result?.message || apiResult?.message || "Attendance recorded successfully.";
      setSuccessMessage(message);

      setCurrentStep(STEPS.SUCCESS);
      successTimerRef.current = setTimeout(() => {
        closeModal();
      }, 2000);

      return result;
    } catch (err) {
      console.error("Punch registry error:", err);
      const msg = err?.data?.message || err?.message || "Failed to finalize timesheet record.";
      setError(msg);
      setCurrentStep(STEPS.ERROR);
      throw err;
    }
  }, [
    actionType,
    buildAttendanceMethod,
    verificationTokens,
    checkInApi,
    checkOutApi,
    breakOutApi,
    breakInApi,
    closeModal,
  ]);

  const resetError = useCallback(() => {
    setError(null);
    if (currentStep === STEPS.ERROR) {
      if (verificationTokens.gps && verificationTokens.face) {
        setCurrentStep(STEPS.CONFIRM);
      } else if (verificationTokens.gps) {
        const next = getNextStep(accessConfig, STEPS.GPS_VERIFY, verificationTokens);
        setCurrentStep(next === STEPS.CONFIRM ? STEPS.CONFIRM : STEPS.FACE_VERIFY);
      } else if (verificationTokens.face) {
        setCurrentStep(STEPS.CONFIRM);
      } else {
        setCurrentStep(determineInitialStep(accessConfig));
      }
    }
  }, [currentStep, verificationTokens, accessConfig, getNextStep, determineInitialStep]);

  useEffect(() => {
    return () => {
      if (successTimerRef.current) clearTimeout(successTimerRef.current);
    };
  }, []);

  return {
    isModalOpen,
    currentStep,
    selectedMethod,
    actionType,
    accessConfig,
    verificationTokens,
    verificationResults,
    gpsLocation,
    error,
    successMessage,
    steps: STEPS,
    actionLabels: ACTION_LABELS,
    openModal,
    closeModal,
    selectMethod,
    verifyGPS,
    verifyFace,
    confirmPunch,
    resetError,
    isVerifyingGPS,
    isVerifyingFace,
    isPunching,
  };
}