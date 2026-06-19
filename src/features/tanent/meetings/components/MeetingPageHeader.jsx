import React from "react";
import { motion } from "framer-motion";
import { Video, Plus } from "lucide-react";
import { useMeetingPermissions } from "../hooks/useMeetingPermissions";

const MeetingPageHeader = ({ onCreateClick }) => {
  const { canCreate } = useMeetingPermissions();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
            <Video className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Meetings
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Schedule, join, and manage your team meetings
            </p>
          </div>
        </motion.div>
      </div>

      {canCreate && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <motion.button
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={onCreateClick}
            className="
              flex items-center gap-2
              px-5 py-2.5
              bg-indigo-600 hover:bg-indigo-700
              text-white text-sm font-semibold
              rounded-xl
              shadow-lg shadow-indigo-500/20
              hover:shadow-xl hover:shadow-indigo-500/30
              transition-all duration-200
              border border-indigo-500
            "
          >
            <Plus className="w-4 h-4" />
            Create Meeting
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};

export default MeetingPageHeader;
