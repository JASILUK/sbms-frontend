import React from "react";
import { motion } from "framer-motion";
import { Layers, Plus } from "lucide-react";

export const EmptyShiftState = ({ onCreateClick }) => {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-2xs">
      <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl text-indigo-600 mb-4 shadow-sm">
        <Layers className="h-8 w-8 stroke-[1.5]" />
      </div>
      <h3 className="text-base font-bold text-slate-900">No shift templates found</h3>
      <p className="mt-1 text-sm text-slate-500 max-w-sm">
        Build structural daily execution windows, unpaid break thresholds, and custom work hour criteria patterns.
      </p>
      <button
        type="button"
        onClick={onCreateClick}
        className="mt-5 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 cursor-pointer transition-all"
      >
        <Plus className="h-4 w-4" />
        Create Shift
      </button>
    </motion.div>
  );
};