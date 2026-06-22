import React from 'react';
import { Plus, MapPin } from 'lucide-react';

export const LocationsHeader = React.memo(({ onAddLocation }) => (
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-5 gap-4">
    <div className="space-y-1">
      <h1 className="text-base font-bold tracking-tight text-slate-900 flex items-center gap-2">
        <MapPin className="h-4 w-4 text-slate-700 flex-shrink-0" />
        Attendance Locations
      </h1>
      <p className="text-xs text-slate-500 leading-normal max-w-2xl">
        Manage approved GPS locations and tracking perimeters employees can use for attendance.
      </p>
    </div>
    <button
      onClick={onAddLocation}
      className="w-full sm:w-auto inline-flex items-center justify-center px-3 py-1.5 border border-transparent rounded-lg text-xs font-semibold text-white bg-slate-900 shadow-sm hover:bg-slate-800 transition-colors gap-1.5"
    >
      <Plus className="h-4 w-4" />
      Add Location
    </button>
  </div>
));

LocationsHeader.displayName = 'LocationsHeader';