import React from "react";
import { motion } from "framer-motion";
import { Calendar, Video, Search } from "lucide-react";

const EmptyMeetingsState = ({ 
  type = "default", 
  title = "No meetings found", 
  description = "Get started by creating your first meeting.",
  icon: CustomIcon,
}) => {
  const icons = {
    default: Video,
    today: Calendar,
    search: Search,
    live: Video,
  };

  const Icon = CustomIcon || icons[type] || Video;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-12 px-4 text-center"
    >
      <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-4">
        <Icon className="w-7 h-7 text-slate-400" />
      </div>
      <h3 className="text-sm font-semibold text-slate-900 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-xs">{description}</p>
    </motion.div>
  );
};

export default EmptyMeetingsState;
