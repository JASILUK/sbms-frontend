import React from "react";
import { MapPin, ScanFace, Fingerprint, Smartphone, Pencil } from "lucide-react";
import clsx from "clsx";

const METHOD_ICONS = {
  GPS: MapPin,
  FACE: ScanFace,
  BIOMETRIC: Fingerprint,
  MANUAL: Pencil,
  MOBILE: Smartphone,
};

export default function MethodBadge({ method, className }) {
  const Icon = METHOD_ICONS[method?.toUpperCase()] || Pencil;
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 rounded-md bg-neutral-50 px-2 py-1 text-xs font-medium text-neutral-600",
        "dark:bg-neutral-800 dark:text-neutral-300",
        className
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {method ? method.charAt(0) + method.slice(1).toLowerCase() : "Unknown"}
    </span>
  );
}
