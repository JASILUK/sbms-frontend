import { memo } from "react";
import { motion } from "framer-motion";
import { LogOut, X, Loader2 } from "lucide-react";

const LeaveConfirmModal = memo(function LeaveConfirmModal({ groupName, onConfirm, onCancel, isLeaving }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 350 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-[340px] p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-full bg-rose-50 flex items-center justify-center">
            <LogOut className="w-5 h-5 text-rose-500" />
          </div>
          <div>
            <h3 className="text-[15px] font-bold text-gray-900">Leave Group</h3>
            <p className="text-xs text-gray-500 mt-0.5">{groupName || "This group"}</p>
          </div>
        </div>

        <p className="text-[13px] text-gray-600 mb-5 leading-relaxed">
          Are you sure you want to leave this group? You won't be able to see new messages unless you're added back.
        </p>

        <div className="flex gap-2">
          <button
            onClick={onCancel}
            disabled={isLeaving}
            className="flex-1 px-4 py-2.5 rounded-xl text-[13px] font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLeaving}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold text-white bg-rose-500 hover:bg-rose-600 shadow-lg shadow-rose-500/20 transition-all disabled:opacity-50"
          >
            {isLeaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Leaving...
              </>
            ) : (
              <>
                <LogOut className="w-4 h-4" />
                Leave
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
});

export default LeaveConfirmModal;