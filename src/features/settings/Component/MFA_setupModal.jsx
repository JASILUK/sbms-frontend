// features/settings/security/components/MFASetupModal.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, QrCode, CheckCircle2, Loader2, ArrowRight, Shield } from "lucide-react";
import { useMfaSetupMutation, useMfaVerifyMutation  } from "../../auth/authApi"; 

const STEPS = {
  INTRO: 0,
  QR_CODE: 1,
  VERIFY: 2,
  SUCCESS: 3,
};

export default function MFASetupModal({ isOpen, onClose }) {
  const [step, setStep] = useState(STEPS.INTRO);
  const [deviceName, setDeviceName] = useState("My Authenticator");
  const [qrCode, setQrCode] = useState(null);
  const [deviceId, setDeviceId] = useState(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState(null);

  const [setup, { isLoading: isSettingUp }] = useMfaSetupMutation();
  const [verify, { isLoading: isVerifying }] = useMfaVerifyMutation();

  if (!isOpen) return null;

  const handleStartSetup = async () => {
    setError(null);
    try {
      const res = await setup({ device_name: deviceName }).unwrap();
      setQrCode(res.data?.qr_code || res.qr_code);
      setDeviceId(res.data?.device_id || res.device_id);
      setStep(STEPS.QR_CODE);
    } catch (err) {
      setError("Failed to generate QR code. Please try again.");
    }
  };

  const handleVerify = async () => {
    setError(null);
    try {
      await verify({
        device_id: deviceId,
        code: verificationCode,
      }).unwrap();
      setStep(STEPS.SUCCESS);
    } catch (err) {
      setError("Invalid verification code. Please try again.");
    }
  };

  const handleClose = () => {
    setStep(STEPS.INTRO);
    setDeviceName("My Authenticator");
    setQrCode(null);
    setDeviceId(null);
    setVerificationCode("");
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-violet-50 to-purple-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center text-white">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Add MFA Device</h2>
              <p className="text-xs text-gray-500">Step {step + 1} of 3</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white/50 rounded-lg transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {/* Step 1: Intro */}
            {step === STEPS.INTRO && (
              <motion.div
                key="intro"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="text-center py-4">
                  <div className="w-20 h-20 rounded-2xl bg-violet-100 flex items-center justify-center mx-auto mb-4">
                    <QrCode className="w-10 h-10 text-violet-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Set Up Authenticator
                  </h3>
                  <p className="text-sm text-gray-500">
                    You'll need an authenticator app like Google Authenticator or Authy
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Device Name
                  </label>
                  <input
                    type="text"
                    value={deviceName}
                    onChange={(e) => setDeviceName(e.target.value)}
                    placeholder="e.g., My iPhone"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all"
                  />
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600">
                    {error}
                  </div>
                )}

                <button
                  onClick={handleStartSetup}
                  disabled={!deviceName.trim() || isSettingUp}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-300 text-white font-medium rounded-xl transition-all"
                >
                  {isSettingUp ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      Continue
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </motion.div>
            )}

            {/* Step 2: QR Code */}
            {step === STEPS.QR_CODE && (
              <motion.div
                key="qr"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-4">
                    Scan this QR code with your authenticator app
                  </p>
                  
                  <div className="w-48 h-48 mx-auto bg-white p-4 rounded-xl border-2 border-gray-100 shadow-inner">
                    {qrCode ? (
                      <img
                        src={`data:image/png;base64,${qrCode}`}
                        alt="QR Code"
                        className="w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 rounded animate-pulse" />
                    )}
                  </div>
                </div>

                <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl">
                  <p className="text-sm text-amber-800">
                    Can't scan? You can manually enter the setup key in your authenticator app.
                  </p>
                </div>

                <button
                  onClick={() => setStep(STEPS.VERIFY)}
                  className="w-full px-4 py-3 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-xl transition-all"
                >
                  I've scanned the code
                </button>
              </motion.div>
            )}

            {/* Step 3: Verify */}
            {step === STEPS.VERIFY && (
              <motion.div
                key="verify"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-4">
                    Enter the 6-digit code from your authenticator app
                  </p>
                  
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                    className="w-full text-center text-3xl font-mono tracking-widest px-4 py-4 rounded-xl border-2 border-gray-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 transition-all"
                  />
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600 text-center">
                    {error}
                  </div>
                )}

                <button
                  onClick={handleVerify}
                  disabled={verificationCode.length !== 6 || isVerifying}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-300 text-white font-medium rounded-xl transition-all"
                >
                  {isVerifying ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Verify & Enable"
                  )}
                </button>
              </motion.div>
            )}

            {/* Step 4: Success */}
            {step === STEPS.SUCCESS && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4"
                >
                  <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                </motion.div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  MFA Enabled!
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  Your account is now protected with two-factor authentication
                </p>

                <button
                  onClick={handleClose}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-all"
                >
                  Done
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}