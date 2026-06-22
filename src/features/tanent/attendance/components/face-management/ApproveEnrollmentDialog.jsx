import React from 'react';
import { X } from 'lucide-react';

export function ApproveEnrollmentDialog({ isOpen, onClose, onConfirm, isSubmitting }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-md w-full border border-slate-100 shadow-2xl p-6 relative space-y-4">
        <button onClick={onClose} className="absolute right-4 top-4 p-1 hover:bg-slate-50 text-slate-400 rounded-lg cursor-pointer">
          <X className="h-4 w-4" />
        </button>
        <div className="space-y-1.5">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Approve Enrollment</h3>
          <p className="text-[11px] text-slate-400 font-normal leading-relaxed">
            This will activate this biometric profile and revoke previously active profiles for this employee inside the multitenant operational boundary.
          </p>
        </div>
        <div className="flex gap-2 justify-end pt-2">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onClose}
            className="px-4 py-2 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl font-bold transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onConfirm}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            {isSubmitting && <div className="h-3 w-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            <span>Approve Enrollment</span>
          </button>
        </div>
      </div>
    </div>
  );
}