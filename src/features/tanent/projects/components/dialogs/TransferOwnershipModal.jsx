import React, { useState } from "react";
import { X, Crown, Loader2 } from "lucide-react";

export const TransferOwnershipModal = ({
  isOpen,
  onClose,
  members = [],
  onTransfer,
  isLoading,
}) => {
  const [newOwnerId, setNewOwnerId] = useState("");

  if (!isOpen) return null;

  const eligibleCandidates = members.filter((m) => !m.is_owner);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newOwnerId) return;

    try {
      await onTransfer(Number(newOwnerId));
      onClose();
    } catch {
      // Handled by parent hook
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-50 rounded-2xl shadow-xl border border-slate-200/80 w-full max-w-md my-auto overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        <div className="px-6 py-4 border-b border-slate-200/70 flex items-center justify-between bg-white/80 backdrop-blur">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-50 border border-amber-100 rounded-xl text-amber-600">
              <Crown className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Transfer Ownership</h2>
              <p className="text-xs text-slate-500">Assign project primary owner rights to another member.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select New Owner <span className="text-rose-500">*</span>
            </label>
            <select
              value={newOwnerId}
              onChange={(e) => setNewOwnerId(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
            >
              <option value="">Choose a member...</option>
              {eligibleCandidates.map((m) => (
                <option key={m.id} value={m.membership?.id}>
                  {m.membership?.full_name} ({m.role.toUpperCase()})
                </option>
              ))}
            </select>
          </div>

          <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200/60 p-3 rounded-xl leading-relaxed">
            <strong>Warning:</strong> Transferring ownership will make the selected user the primary owner of this project.
          </p>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200/70">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!newOwnerId || isLoading}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-sm transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Transfer Ownership</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};