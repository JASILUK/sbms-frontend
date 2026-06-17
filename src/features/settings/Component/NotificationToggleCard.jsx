import React from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function NotificationToggleCard({
  title,
  description,
  enabled,
  onChange,
  disabled = false,
  isUpdating = false,
}) {
  return (
    <div 
      className={`bg-white border border-slate-200 rounded-2xl p-5 transition-all duration-200 ${
        disabled ? "opacity-40 select-none pointer-events-none bg-slate-50/50" : "hover:border-slate-350"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            {title}
            {isUpdating && <Loader2 className="w-3.5 h-3.5 text-indigo-600 animate-spin" />}
          </h3>
          <p className="text-sm text-slate-500 mt-1 leading-relaxed">
            {description}
          </p>
        </div>

        <button
          type="button"
          disabled={disabled || isUpdating}
          aria-checked={!!enabled}
          role="switch"
          onClick={() => onChange(!enabled)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 shrink-0 outline-none focus:ring-2 focus:ring-indigo-500/20 ${
            enabled ? "bg-indigo-600" : "bg-slate-300"
          } ${disabled || isUpdating ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
        >
          <motion.span
            layout
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 30,
            }}
            className="inline-block h-5 w-5 rounded-full bg-white shadow-sm"
            style={{
              marginLeft: enabled ? "22px" : "2px",
            }}
          />
        </button>
      </div>
    </div>
  );
}