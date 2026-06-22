import React from 'react';
import { Ban } from 'lucide-react';

export function FaceManagementEmptyState() {
  return (
    <div className="min-h-[70vh] w-full flex items-center justify-center p-6 bg-slate-50/40 rounded-3xl border border-dashed border-slate-200">
      <div className="text-center max-w-sm space-y-3 animate-scaleIn">
        <div className="h-12 w-12 bg-red-50 border border-red-100 rounded-2xl flex items-center justify-center text-red-600 mx-auto shadow-4xs">
          <Ban className="h-6 w-6 stroke-[1.5]" />
        </div>
        <div className="space-y-1">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Face Attendance Not Enabled</h2>
          <p className="text-[11px] text-slate-400 leading-relaxed font-normal">
            Your organization has not enabled biometric attendance settings configurations inside global methods parameters. Contact your administrator.
          </p>
        </div>
      </div>
    </div>
  );
}