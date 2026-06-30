import React from "react";
import { Lock, Unlock, RotateCw } from "lucide-react";

const ACTIONS = [
  { key: "finalize", label: "Finalize", icon: Lock, tone: "emerald" },
  { key: "unlock", label: "Unlock", icon: Unlock, tone: "amber" },
  { key: "reprocess", label: "Reprocess", icon: RotateCw, tone: "indigo" },
];

const TONE_CLASSES = {
  emerald: "bg-emerald-600 hover:bg-emerald-700",
  amber: "bg-amber-500 hover:bg-amber-600",
  indigo: "bg-indigo-600 hover:bg-indigo-700",
};

export default function ActionBar({ recordId, onAction, isLoading }) {
  return (
    <div className="flex flex-wrap items-center gap-2 border-t border-neutral-100 pt-4 dark:border-neutral-800">
      {ACTIONS.map((action) => (
        <button
          key={action.key}
          disabled={isLoading}
          onClick={() => onAction(recordId, action.key)}
          className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium text-white shadow-sm transition disabled:cursor-not-allowed disabled:opacity-50 ${TONE_CLASSES[action.tone]}`}
        >
          <action.icon className="h-3.5 w-3.5" />
          {action.label}
        </button>
      ))}
    </div>
  );
}
