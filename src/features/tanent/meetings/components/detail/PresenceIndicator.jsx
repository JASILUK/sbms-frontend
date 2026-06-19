import React from "react";
import { motion } from "framer-motion";

const PresenceIndicator = ({ isPresent }) => {
  if (isPresent) {
    return (
      <div className="flex items-center gap-1.5">
        <motion.div
          className="w-2 h-2 rounded-full bg-emerald-500"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <span className="text-xs font-medium text-emerald-600">Online</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      <div className="w-2 h-2 rounded-full bg-slate-300" />
      <span className="text-xs text-slate-400">Offline</span>
    </div>
  );
};

export default PresenceIndicator;
