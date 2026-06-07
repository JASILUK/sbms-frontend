// features/auth/AuthGuard/MfaLoginModal.jsx
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, 
  Smartphone, 
  Key, 
  ArrowRight, 
  Loader2, 
  X,
  Lock,
  RefreshCcw,
  CheckCircle2,
  AlertCircle,
  Fingerprint
} from "lucide-react";
import { useMfaLoginVerifyMutation } from "../authApi";
import { useNavigate } from "react-router-dom";

export default function MfaLoginModal({ tempToken, devices, onClose }) {
  const [selectedDeviceId, setSelectedDeviceId] = useState(
  devices?.length ? devices[0].id : ""
);
  const [code, setCode] = useState("");
  const [isBackupMode, setIsBackupMode] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const [verify, { isLoading }] = useMfaLoginVerifyMutation();
  const navigate = useNavigate();

  const selectedDevice =
  devices?.find(d => d.id === selectedDeviceId) || devices?.[0];

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && !success && !isLoading) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [success, isLoading]);

  const handleClose = useCallback(() => {
    if (isLoading || success) return;
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 200);
  }, [isLoading, success, onClose]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");

    if (!code.trim()) {
      setError(isBackupMode ? "Please enter a backup code" : "Please enter the 6-digit code");
      return;
    }

    try {
      await verify({
        temp_token: tempToken,
        device_id: isBackupMode ? null : Number(selectedDeviceId),
        code: code.trim(),
        }).unwrap();

      setSuccess(true);
      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 1200);
    } catch (err) {
      setError(err?.data?.detail || err?.data?.message || "Verification failed. Please try again.");
      setCode("");
    }
  };

  const handleCodeChange = (e) => {
    const value = e.target.value.replace(/\s/g, '');
    if (isBackupMode) {
      if (value.length <= 8) setCode(value);
    } else {
      if (/^\d*$/.test(value) && value.length <= 6) setCode(value);
    }
  };

  const switchMode = () => {
    setIsBackupMode(!isBackupMode);
    setCode("");
    setError("");
  };


  if (!devices?.length) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-xl">Loading MFA...</div>
    </div>
  );
}

  return (
    <div 
      className="fixed inset-0 z-50"
      style={{ overflow: 'hidden' }}
    >
      {/* Backdrop - Separate from flex container */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isClosing ? 0 : 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 bg-slate-900/70 backdrop-blur-md"
        onClick={handleClose}
        style={{ cursor: isLoading || success ? 'default' : 'pointer' }}
      />

      {/* Center Container */}
      <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-6 pointer-events-none">
        {/* Modal - Stop propagation here */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ 
            opacity: isClosing ? 0 : 1, 
            scale: isClosing ? 0.95 : 1, 
            y: isClosing ? 20 : 0 
          }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-[420px] max-h-[90vh] overflow-y-auto bg-white rounded-2xl sm:rounded-3xl shadow-2xl scrollbar-hide pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          {/* Success Overlay */}
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white rounded-2xl sm:rounded-3xl"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-4"
                >
                  <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-600" />
                </motion.div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900">Verified!</h3>
                <p className="text-sm text-slate-500 mt-1">Redirecting...</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Header */}
          <div className="relative bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 p-6 sm:p-8 text-white overflow-hidden shrink-0">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/10 rounded-full blur-3xl animate-pulse" />
              <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-indigo-400/20 rounded-full blur-2xl" />
            </div>

            <div className="absolute inset-0 opacity-[0.03]" style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
              backgroundSize: '20px 20px'
            }} />
            
            <div className="relative z-10">
              {/* Brand Logo Area */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center ring-1 ring-white/30">
                    <Fingerprint className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-lg tracking-tight">SBMS</span>
                </div>
                
                {/* Close Button */}
                {!isLoading && !success && (
                  <button
                    onClick={handleClose}
                    className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all active:scale-95 pointer-events-auto"
                    type="button"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center shrink-0 ring-1 ring-white/20">
                  <Shield className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold leading-tight">Two-Factor Auth</h2>
                  <p className="text-indigo-100 text-xs sm:text-sm mt-0.5 leading-relaxed">
                    {isBackupMode 
                      ? "Enter backup code to continue"
                      : "Verify your identity to access your account"
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-5 sm:p-6 space-y-5">
            <AnimatePresence mode="wait">
              {!isBackupMode ? (
                <motion.div
                  key="totp-mode"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-4"
                >
                  {/* Device Selection */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                      <Smartphone className="w-3.5 h-3.5 text-indigo-500" />
                      Authenticator Device
                    </label>
                    <div className="relative">
                      <select
                        value={selectedDeviceId}
                        onChange={(e) => setSelectedDeviceId(e.target.value)}
                        disabled={isLoading}
                        className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 pr-10 text-sm text-slate-900 font-medium focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 outline-none transition-all cursor-pointer hover:border-slate-300 disabled:opacity-50"
                      >
                        {devices.map((device) => (
                          <option key={device.id} value={device.id}>
                            {device.name}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Code Input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-indigo-500" />
                      6-Digit Code
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        autoFocus
                        value={code}
                        onChange={handleCodeChange}
                        placeholder="000000"
                        maxLength={6}
                        disabled={isLoading}
                        className="w-full text-center text-2xl sm:text-3xl font-bold tracking-[0.3em] bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all disabled:opacity-50"
                      />
                    </div>
                    <p className="text-xs text-slate-500 text-center">
                      Open {selectedDevice?.name} and enter the code
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="backup-mode"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-4"
                >
                  {/* Backup Code Input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                      <Key className="w-3.5 h-3.5 text-amber-500" />
                      Backup Code
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        autoFocus
                        value={code}
                        onChange={handleCodeChange}
                        placeholder="XXXX-XXXX"
                        disabled={isLoading}
                        className="w-full text-center text-lg sm:text-xl font-mono font-bold tracking-wider bg-amber-50/30 border-2 border-amber-200 rounded-xl px-4 py-3 text-slate-900 placeholder:text-amber-300/50 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all uppercase disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg border border-amber-100">
                    <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-700 leading-relaxed">
                      Backup codes are single-use only. Each code can be used once for account recovery.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-sm text-red-700"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span className="text-xs leading-relaxed">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Actions */}
            <div className="space-y-2">
              <motion.button
                whileHover={!isLoading ? { scale: 1.01 } : {}}
                whileTap={!isLoading ? { scale: 0.99 } : {}}
                onClick={handleVerify}
                disabled={isLoading || code.length < (isBackupMode ? 8 : 6)}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm ${
                  isBackupMode 
                    ? "bg-amber-500 hover:bg-amber-600 shadow-amber-500/25" 
                    : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/25"
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <span>Verify & Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>

              {/* Switch Mode */}
              {!isLoading && (
                <button
                  onClick={switchMode}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-slate-500 hover:text-slate-700 transition-colors rounded-lg hover:bg-slate-50"
                >
                  <RefreshCcw className="w-3.5 h-3.5" />
                  {isBackupMode 
                    ? "Use authenticator app" 
                    : "Use backup code"
                  }
                </button>
              )}
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] sm:text-xs font-medium text-slate-500">Secure SSL Connection</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] sm:text-xs text-slate-400">
                  <Shield className="w-3 h-3" />
                  <span>Protected by SBMS</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}