import React from "react";
import { Lock, Globe } from "lucide-react";

export const VisibilityBadge = ({ visibility }) => {
  const isPrivate = visibility === "private";

  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
      {isPrivate ? <Lock className="w-3 h-3" /> : <Globe className="w-3 h-3" />}
      <span className="capitalize">{visibility}</span>
    </span>
  );
};