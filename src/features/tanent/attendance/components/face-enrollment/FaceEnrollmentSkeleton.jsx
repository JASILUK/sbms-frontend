import React from 'react';

/**
 * 🦴 Premium Loading Skeleton Screen
 * Implements low-overhead localized micro-shimmer sweeps matching Darwinbox standards.
 * Provides a fluid layout transition while computer vision weights and backend profiles resolve.
 */
export function FaceEnrollmentSkeleton() {
  return (
    <div className="space-y-6 max-w-4xl text-xs font-medium tracking-tight p-2 sm:p-4 w-full animate-pulse">
      
      {/* Upper Hero Block Skeleton */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-3xs flex items-center justify-between gap-4">
        <div className="flex gap-4 items-center w-full">
          {/* Circular Icon Placeholder */}
          <div className="h-12 w-12 bg-slate-100 rounded-xl flex-shrink-0" />
          
          {/* Title & Desc Line Placeholders */}
          <div className="space-y-2 flex-1 max-w-xl">
            <div className="h-4 bg-slate-100 rounded-md w-1/3" />
            <div className="h-3 bg-slate-100 rounded-md w-3/4" />
          </div>
        </div>
      </div>

      {/* Main Core Viewport Content Deck Skeleton */}
      <div className="bg-white border border-slate-200 rounded-2xl p-10 flex flex-col items-center space-y-6 shadow-3xs">
        
        {/* Upper Messaging Circle */}
        <div className="h-14 w-14 bg-slate-50 border border-slate-100 rounded-2xl flex-shrink-0 shadow-4xs" />
        
        {/* Informational Paragraph Lines */}
        <div className="space-y-2 w-full max-w-xs flex flex-col items-center">
          <div className="h-3.5 bg-slate-100 rounded-md w-2/3" />
          <div className="h-3 bg-slate-100 rounded-md w-full" />
          <div className="h-3 bg-slate-100 rounded-md w-5/6" />
        </div>

        {/* Footer Action Anchor CTA Button Skeleton */}
        <div className="pt-2 w-full max-w-xs flex justify-center">
          <div className="h-9 bg-slate-100 rounded-xl w-1/2 shadow-4xs" />
        </div>

      </div>

    </div>
  );
}