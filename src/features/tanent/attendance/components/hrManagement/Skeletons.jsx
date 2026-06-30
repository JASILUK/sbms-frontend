import React from "react";
import clsx from "clsx";

function Shimmer({ className }) {
  return (
    <div
      className={clsx(
        "animate-pulse rounded-md bg-neutral-200/70 dark:bg-neutral-800/70",
        className
      )}
    />
  );
}

export function KpiCardSkeleton() {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
      <div className="flex items-center justify-between">
        <Shimmer className="h-9 w-9 rounded-xl" />
        <Shimmer className="h-4 w-10" />
      </div>
      <Shimmer className="mt-4 h-7 w-20" />
      <Shimmer className="mt-2 h-3 w-28" />
    </div>
  );
}

export function StatusCardSkeleton() {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
      <Shimmer className="h-3 w-16" />
      <Shimmer className="mt-3 h-6 w-10" />
    </div>
  );
}

export function TableSkeleton({ rows = 8 }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800">
      <div className="flex items-center gap-4 border-b border-neutral-200 bg-neutral-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900/60">
        {Array.from({ length: 6 }).map((_, i) => (
          <Shimmer key={i} className="h-3 flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div
          key={r}
          className="flex items-center gap-4 border-b border-neutral-100 px-4 py-3.5 last:border-b-0 dark:border-neutral-800/60"
        >
          <Shimmer className="h-8 w-8 shrink-0 rounded-full" />
          {Array.from({ length: 6 }).map((_, i) => (
            <Shimmer key={i} className="h-3 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function TimelineSkeleton({ items = 4 }) {
  return (
    <div className="space-y-5">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex gap-3">
          <Shimmer className="h-8 w-8 shrink-0 rounded-full" />
          <div className="flex-1 space-y-2 pt-1">
            <Shimmer className="h-3 w-1/3" />
            <Shimmer className="h-3 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function DrawerSkeleton() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-3">
        <Shimmer className="h-14 w-14 rounded-full" />
        <div className="space-y-2">
          <Shimmer className="h-4 w-36" />
          <Shimmer className="h-3 w-24" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Shimmer key={i} className="h-16 rounded-xl" />
        ))}
      </div>
      <TimelineSkeleton />
    </div>
  );
}

export default Shimmer;
