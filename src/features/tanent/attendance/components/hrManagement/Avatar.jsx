import React from "react";
import clsx from "clsx";

function initialsFromName(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default function Avatar({ name, src, size = "md", className }) {
  const sizes = {
    sm: "h-7 w-7 text-xs",
    md: "h-9 w-9 text-sm",
    lg: "h-14 w-14 text-lg",
  };

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={clsx("rounded-full object-cover ring-2 ring-white dark:ring-neutral-900", sizes[size], className)}
      />
    );
  }

  return (
    <div
      className={clsx(
        "flex items-center justify-center rounded-full font-medium text-white shrink-0",
        "bg-gradient-to-br from-indigo-500 to-violet-600 ring-2 ring-white dark:ring-neutral-900",
        sizes[size],
        className
      )}
      aria-hidden="true"
    >
      {initialsFromName(name) || "?"}
    </div>
  );
}
