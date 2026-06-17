// features/settings/security/pages/SecuritySettings.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Shield, 
  Key, 
  Clock, 
  AlertTriangle, 
  Plus, 
  Settings
} from "lucide-react";
import { useGetMfaDevicesQuery, useRegenerateBackupCodesMutation, useDeleteMfaDeviceMutation } from "../../auth/authApi";
import MFADeviceList from "../Component/MFADeviceList";
import MFASetupModal from "../Component/MFA_setupModal";
import BackupCodesModal from "../Component/BackupCodeModal";  // Fixed path

export default function SecuritySettings() {
  const { data, isLoading, error } = useGetMfaDevicesQuery();
  const [regenerateCodes, { isLoading: isRegenerating }] = useRegenerateBackupCodesMutation();
  const [deleteDevice] = useDeleteMfaDeviceMutation();
  
  const [isSetupOpen, setIsSetupOpen] = useState(false);
  const [backupCodes, setBackupCodes] = useState(null);

  const devices = data?.data || [];

  const handleRegenerateCodes = async () => {
    try {
      const res = await regenerateCodes().unwrap();
      setBackupCodes(res.data?.backup_codes || res.backup_codes || []);
    } catch (err) {
      console.error("Failed to regenerate codes:", err);
    }
  };

  const handleDeleteDevice = async (deviceId) => {
    try {
      await deleteDevice(deviceId).unwrap();
    } catch (err) {
      console.error("Failed to delete device:", err);
      alert("Failed to remove device. Please try again.");
      throw err; // Re-throw so child component knows it failed
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center text-violet-600">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Security</h1>
            <p className="text-gray-500">Manage your account security and authentication settings</p>
          </div>
        </div>
      </motion.div>

      <div className="space-y-6">
        {/* MFA Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
        >
          <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-violet-50/50 to-purple-50/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center text-violet-600">
                <Settings className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Account Protection</h2>
                <p className="text-sm text-gray-500">
                  Multi-factor authentication adds an extra layer of security
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-medium text-gray-900">Multi-Factor Authentication</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {devices.length > 0 
                    ? `${devices.length} device${devices.length > 1 ? 's' : ''} configured`
                    : "No devices configured yet"
                  }
                </p>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsSetupOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-xl transition-all shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Add Device
              </motion.button>
            </div>

            <MFADeviceList 
              devices={devices}
              isLoading={isLoading}
              error={error}
              onDeleteDevice={handleDeleteDevice}
            />
          </div>
        </motion.section>

        {/* Backup Codes Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
        >
          <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-amber-50/50 to-orange-50/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Recovery Backup Codes</h2>
                <p className="text-sm text-gray-500">
                  Use these codes if you lose access to your MFA device
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-4">
                  Backup codes are single-use codes for account recovery.
                </p>
                
                <div className="flex items-center gap-3 p-4 bg-amber-50/50 border border-amber-100 rounded-xl">
                  <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                  <p className="text-sm text-amber-800">
                    Each code can only be used once. Generate new codes if you've used most.
                  </p>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleRegenerateCodes}
                disabled={isRegenerating}
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 hover:border-amber-300 hover:bg-amber-50/30 text-gray-700 font-medium rounded-xl transition-all disabled:opacity-50 whitespace-nowrap"
              >
                {isRegenerating ? (
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                ) : (
                  <Key className="w-4 h-4" />
                )}
                Regenerate Codes
              </motion.button>
            </div>
          </div>
        </motion.section>

        {/* Activity Placeholder */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden opacity-75"
        >
          <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Security Activity</h2>
                <p className="text-sm text-gray-500">Coming soon</p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <p className="text-sm text-gray-400 text-center py-8">
              Security activity log will be available in a future update
            </p>
          </div>
        </motion.section>
      </div>

      {/* Modals */}
      <MFASetupModal 
        isOpen={isSetupOpen} 
        onClose={() => setIsSetupOpen(false)} 
      />
      
      <BackupCodesModal
        isOpen={!!backupCodes}
        codes={backupCodes || []}
        onClose={() => setBackupCodes(null)}
      />
    </div>
  );
}