import React from "react";
import { motion } from "framer-motion";

const MeetingTabs = ({ tabs = [], activeTab, onChange }) => {
  // Safety guard — don't crash if tabs is missing
  if (!Array.isArray(tabs) || tabs.length === 0) {
    return (
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-3 text-sm text-slate-400">
        Loading tabs...
      </div>
    );
  }

  return (
    <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="flex items-center gap-1 px-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`relative px-4 py-3 text-sm font-medium transition-colors ${
                isActive ? "text-indigo-700" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab.label}
              {isActive && (
                <motion.div
                  layoutId="activeMeetingTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MeetingTabs;