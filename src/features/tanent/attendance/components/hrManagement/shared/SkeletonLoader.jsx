import React from 'react';
import PropTypes from 'prop-types';

export default function SkeletonLoader({ variant = 'card', count = 1 }) {
  const items = Array.from({ length: count }, (_, i) => i);

  if (variant === 'table') {
    return (
      <div className="w-full space-y-4" role="status" aria-label="Loading content infrastructure">
        <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded w-full animate-pulse" />
        {items.map((i) => (
          <div key={i} className="h-16 bg-slate-100 dark:bg-slate-900/60 rounded w-full animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4" role="status" aria-label="Loading summary metrics">
      {items.map((i) => (
        <div key={i} className="h-32 bg-slate-100 dark:bg-slate-900/40 rounded-xl border border-slate-200/60 dark:border-slate-800/60 p-5 space-y-3 animate-pulse">
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
          <div className="h-8 bg-slate-300 dark:bg-slate-700 rounded w-1/2" />
        </div>
      ))}
    </div>
  );
}

SkeletonLoader.propTypes = {
  variant: PropTypes.oneOf(['card', 'table']),
  count: PropTypes.number,
};