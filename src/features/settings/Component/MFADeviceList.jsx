// features/settings/security/components/MFADeviceList.jsx
import { motion } from "framer-motion";
import { Smartphone, AlertCircle } from "lucide-react";
import MFADeviceRow from "./DeviceRow";  // Fixed import path

export default function MFADeviceList({ devices, isLoading, error, onDeleteDevice }) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 animate-pulse">
            <div className="w-10 h-10 rounded-lg bg-gray-200" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/4" />
              <div className="h-3 bg-gray-200 rounded w-1/6" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-xl text-red-700">
        <AlertCircle className="w-5 h-5 flex-shrink-0" />
        <p className="text-sm">Failed to load MFA devices. Please try again.</p>
      </div>
    );
  }

  if (devices.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12 px-4"
      >
        <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
          <Smartphone className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No MFA devices configured
        </h3>
        <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
          Add an authenticator app to protect your account with two-factor authentication
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-2">
      {devices.map((device, index) => (
        <MFADeviceRow 
          key={device.id} 
          device={device} 
          index={index}
          onDelete={onDeleteDevice}  // Pass delete handler
        />
      ))}
    </div>
  );
}