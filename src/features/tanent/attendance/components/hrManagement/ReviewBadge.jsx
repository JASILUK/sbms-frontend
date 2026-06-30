import React from "react";
import { AlertTriangle } from "lucide-react";

export default function ReviewBadge({ needsReview, reason }) {
  if (!needsReview) return <span className="text-xs text-neutral-400">—</span>;
  return (
    <span
      title={reason || "Needs review"}
      className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20 dark:bg-red-500/10 dark:text-red-400"
    >
      <AlertTriangle className="h-3 w-3" />
      Review
    </span>
  );
}
