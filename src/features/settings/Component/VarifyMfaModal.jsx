// features/settings/security/components/MFAVerifyModal.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Lock, Loader2, AlertCircle, ChevronDown } from "lucide-react";
import { useMfaLoginVerifyMutation } from "../../auth/authApi";

export default function MFAVerifyModal({ isOpen, devices, onVerify, onCancel }) {
  const [selectedDevice, setSelectedDevice] = useState(devices[0]?.id || null);
  const [code, setCode] = useState("");
  const [error, setError] = useState(null);
  const [showDeviceDropdown, setShowDeviceDropdown] = useState(false);

  const [verify, { isLoading }] = useMfaLoginVerifyMutation();

  if (!isOpen) return null;

  const selectedDeviceName = devices.find(d => d.id === selectedDevice)?.name || "Select device";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await verify({
        device_id: selectedDevice,
        code: code,
      }).unwrap();
      
      onVerify(res);
    } catch (err) {
      setError("Invalid verification code. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gradient-to-br from-gray-900/90 to-violet-900/90 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="px-8 py-8 text-center bg-gradient-to-br from-violet-600 to-purple-700">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center mx-auto mb-4"
          >
            <Shield className="w-8 h-8 text-white" />
          </motion.div>
          <h2 className="text-2xl font-bold text-white mb-2">Two-Factor Authentication</h2>
          <p className="text-violet-100 text-sm">
            Verify your identity to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Device Selector */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Authentication Device
            </label>
            <button
              type="button"
              onClick={() => setShowDeviceDropdown(!showDeviceDropdown)}
              className="w-full flex items-center justify-between px-4 py-3 border border-gray-200 rounded-xl hover:border-violet-300 transition-all"
            >
              <span className="text-gray-900">{selectedDeviceName}</span>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showDeviceDropdown ? "rotate-180" : ""}`} />
            </button>
            
            {showDeviceDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-10 overflow-hidden">
                {devices.map((device) => (
                  <button
                    key={device.id}
                    type="button"
                    onClick={() => {
                      setSelectedDevice(device.id);
                      setShowDeviceDropdown(false);
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-violet-50 transition-colors"
                  >
                    <p className="font-medium text-gray-900">{device.name}</p>
                    <p className="text-xs text-gray-500">Last used: {device.last_used_at || "Never"}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Code Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Verification Code
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="000000"
                className="w-full pl-12 pr-4 py-4 text-2xl font-mono tracking-widest text-center border-2 border-gray-200 rounded-xl focus:border-violet-500 focus:ring-4 focus:ring-violet-100 transition-all"
              />
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Enter the 6-digit code from your authenticator app
            </p>
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </motion.div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={code.length !== 6 || isLoading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-300 text-white font-medium rounded-xl transition-all"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Verify"
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}