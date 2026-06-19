import React from "react";
import { motion } from "framer-motion";
import { MEETING_STATUS_CONFIG } from "../constants/meetingConstants";

const MeetingStatusBadge = ({ status, className = "" }) => {
  const config = MEETING_STATUS_CONFIG[status] || MEETING_STATUS_CONFIG.scheduled;

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium
        border ${config.bg} ${config.color} ${config.border}
        ${className}
      `}
    >
      {config.pulse && (
        <motion.span
          className={`relative flex h-2 w-2 ${config.dot}`}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full ${config.dot} opacity-75`}
          />
          <span className={`relative inline-flex rounded-full h-2 w-2 ${config.dot}`} />
        </motion.span>
      )}
      {!config.pulse && (
        <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      )}
      {config.label}
    </span>
  );
};

export default MeetingStatusBadge;
