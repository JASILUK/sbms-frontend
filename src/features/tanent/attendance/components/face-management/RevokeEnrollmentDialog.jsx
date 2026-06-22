import React, { useState } from 'react';
import { X } from 'lucide-react';

export function RevokeEnrollmentDialog({ isOpen, onClose, onConfirm, isSubmitting }) {
  const [reason, setReason] = useState('');
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanReason = reason.trim();
    if (cleanReason.length >= 5) {
      // ✅ Pass trimmed text string cleanly down to mutation payload handlers
      onConfirm(cleanReason);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fadeIn">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl max-w-md w-full border border-slate-100 shadow-2xl p-6 relative space-y-4">
        
        {/* Close Button Anchor */}
        <button 
          type="button" 
          onClick={onClose} 
          className="absolute right-4 top-4 p-1 hover:bg-slate-50 text-slate-400 rounded-lg cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="h-4 w-4" />
        </button>
        
        {/* Modal Information Header Block */}
        <div className="space-y-1.5">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Revoke Biometric Token</h3>
          <p className="text-[11px] text-slate-400 font-normal leading-relaxed">
            This immediately deactivates face matching capabilities for this profile inside the operational multi-tenant boundary.
          </p>
        </div>
        
        {/* Input Textarea Data Capture Field */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Reason for Revocation
          </label>
          <textarea
            required
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Minimum 5 characters required..."
            className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50 focus:outline-hidden focus:border-indigo-600 font-medium text-xs h-20 resize-none transition-all"
          />
        </div>
        
        {/* Action Controls Commit Footer Dock */}
        <div className="flex gap-2 justify-end pt-2">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onClose}
            className="px-4 py-2 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl font-bold transition-all cursor-pointer text-xs"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || reason.trim().length < 5}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-all flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-xs"
          >
            {isSubmitting && <div className="h-3 w-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            <span>Revoke Profile</span>
          </button>
        </div>

      </form>
    </div>
  );
}