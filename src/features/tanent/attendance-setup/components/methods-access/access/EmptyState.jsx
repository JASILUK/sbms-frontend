import React from 'react';
import { AlertCircle } from 'lucide-react';

export const EmptyState = React.memo(({ title, description }) => (
  <div className="flex flex-col items-center justify-center p-12 border border-dashed border-slate-200 rounded-xl bg-slate-50/50 text-center animate-fadeIn">
    <div className="p-3 bg-white rounded-full shadow-sm border border-slate-100 text-slate-400 mb-3">
      <AlertCircle className="h-6 w-6" />
    </div>
    <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
    <p className="text-xs text-slate-500 mt-1 max-w-sm leading-normal">{description}</p>
  </div>
));

EmptyState.displayName = 'EmptyState';