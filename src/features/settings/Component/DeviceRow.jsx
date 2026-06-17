// features/settings/security/components/MFADeviceRow.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Smartphone, 
  Trash2, 
  CheckCircle2,
  Clock,
  AlertCircle,
  Check
} from "lucide-react";

export default function MFADeviceRow({ device, index, onDelete }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(device.id);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (err) {
      console.error("Failed to delete device:", err);
      alert("Failed to remove device. Please try again.");
    } finally {
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  // Format last used time
  const getLastUsedText = () => {
    if (!device.last_used_at) return "Never used";
    const date = new Date(device.last_used_at);
    const now = new Date();
    const diffHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffHours < 48) return "Yesterday";
    return date.toLocaleDateString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="group flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-white hover:border-violet-200 hover:bg-violet-50/30 transition-all duration-200"
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center text-violet-600">
          <Smartphone className="w-5 h-5" />
        </div>
        
        <div>
          <h4 className="font-medium text-gray-900">{device.name}</h4>
          <div className="flex items-center gap-3 mt-1">
            <span className="inline-flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              <CheckCircle2 className="w-3 h-3" />
              Active
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <Clock className="w-3 h-3" />
              Last used: {getLastUsedText()}
            </span>
          </div>
        </div>
      </div>

      <div className="relative">
        <AnimatePresence mode="wait">
          {showSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-2 px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-medium"
            >
              <Check className="w-4 h-4" />
              Removed
            </motion.div>
          ) : showConfirm ? (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="flex items-center gap-2"
            >
              <span className="text-sm text-gray-600 mr-1">Sure?</span>
              <button
                onClick={() => setShowConfirm(false)}
                disabled={isDeleting}
                className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                No
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-3 py-1.5 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center gap-1"
              >
                {isDeleting ? (
                  <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Trash2 className="w-3 h-3" />
                )}
                Yes
              </button>
            </motion.div>
          ) : (
            <motion.button
              key="delete-btn"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowConfirm(true)}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
              title="Remove device"
            >
              <Trash2 className="w-4 h-4" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}