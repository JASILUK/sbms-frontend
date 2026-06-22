import React from 'react';
import { MapPinned } from 'lucide-react';

export const EmptyLocationsState = React.memo(({ onAddLocation }) => (
  <div className="flex flex-col items-center justify-center p-12 border border-dashed border-slate-200 rounded-xl bg-slate-50/50 text-center animate-fadeIn">
    <div className="p-3 bg-white rounded-full shadow-2xs border border-slate-100 text-slate-400 mb-3">
      <MapPinned className="h-6 w-6" />
    </div>
    <h3 className="text-sm font-bold text-slate-900">No attendance locations found</h3>
    <p className="text-xs text-slate-500 mt-1 max-w-sm leading-normal">
      Create approved attendance locations perimeters to enable tracking rules matrices context logs.
    </p>
    <button
      onClick={onAddLocation}
      className="mt-4 inline-flex items-center justify-center px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-2xs transition-colors"
    >
      Add Location
    </button>
  </div>
));

EmptyLocationsState.displayName = 'EmptyLocationsState';