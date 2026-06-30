import React from "react";
import { motion } from "framer-motion";
import { AlertCircle, RotateCw } from "lucide-react";

export default function ErrorState({ message = "Something went wrong while loading this data.", onRetry }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-red-100 bg-red-50/60 px-6 py-12 text-center dark:border-red-900/40 dark:bg-red-950/20"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-red-200 dark:bg-neutral-900 dark:ring-red-900/50">
        <AlertCircle className="h-5 w-5 text-red-500" />
      </div>
      <div>
        <p className="text-sm font-semibold text-red-800 dark:text-red-300">Couldn't load this section</p>
        <p className="mt-1 max-w-sm text-sm text-red-600/80 dark:text-red-400/80">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-1 inline-flex items-center gap-1.5 rounded-lg bg-white px-3.5 py-2 text-sm font-medium text-red-700 shadow-sm ring-1 ring-red-200 transition hover:bg-red-50 dark:bg-neutral-900 dark:text-red-300 dark:ring-red-900/50"
        >
          <RotateCw className="h-3.5 w-3.5" />
          Retry
        </button>
      )}
    </motion.div>
  );
}
