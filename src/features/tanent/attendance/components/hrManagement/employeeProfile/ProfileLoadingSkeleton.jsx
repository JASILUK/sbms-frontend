import React, { memo } from "react";

const SkeletonBlock = memo(({ className }) => (
  <div className={`animate-pulse bg-slate-200 rounded-lg ${className}`} />
));
SkeletonBlock.displayName = "SkeletonBlock";

const ProfileLoadingSkeleton = memo(() => {
  return (
    <div className="space-y-6 pb-12">
      {/* Header Skeleton */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-start gap-5">
          <SkeletonBlock className="w-20 h-20 rounded-2xl flex-shrink-0" />
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-3">
              <SkeletonBlock className="w-48 h-7" />
              <SkeletonBlock className="w-24 h-4" />
            </div>
            <div className="flex items-center gap-4">
              <SkeletonBlock className="w-28 h-3.5" />
              <SkeletonBlock className="w-24 h-3.5" />
              <SkeletonBlock className="w-32 h-3.5" />
            </div>
            <div className="flex items-center gap-2">
              <SkeletonBlock className="w-20 h-6 rounded-lg" />
              <SkeletonBlock className="w-24 h-6 rounded-lg" />
              <SkeletonBlock className="w-20 h-6 rounded-lg" />
            </div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-3">
          <SkeletonBlock className="w-32 h-8" />
          <SkeletonBlock className="w-32 h-8" />
          <SkeletonBlock className="w-40 h-8" />
          <SkeletonBlock className="w-28 h-8" />
        </div>
      </div>

      {/* Summary Cards Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {Array.from({ length: 14 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 p-4">
            <SkeletonBlock className="w-16 h-3 mb-3" />
            <SkeletonBlock className="w-12 h-7" />
          </div>
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 p-5">
            <SkeletonBlock className="w-32 h-4 mb-1" />
            <SkeletonBlock className="w-48 h-3 mb-4" />
            <SkeletonBlock className="w-full h-56" />
          </div>
        ))}
      </div>

      {/* Table Skeleton */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <SkeletonBlock className="w-36 h-4 mb-1" />
          <SkeletonBlock className="w-48 h-3" />
        </div>
        <div className="p-4 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonBlock key={i} className="w-full h-10" />
          ))}
        </div>
      </div>
    </div>
  );
});

ProfileLoadingSkeleton.displayName = "ProfileLoadingSkeleton";

export default ProfileLoadingSkeleton;