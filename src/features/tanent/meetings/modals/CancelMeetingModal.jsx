import { useState } from "react";

import {
  AlertTriangle,
  Loader2,
} from "lucide-react";

export default function CancelMeetingModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}) {
  const [reason, setReason] =
    useState("");

  if (!isOpen) {
    return null;
  }

  const handleConfirm = async () => {
    try {
      await onConfirm(reason);

      setReason("");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 z-40"
        onClick={
          isLoading
            ? undefined
            : onClose
        }
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">

          {/* Header */}
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Cancel Meeting
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  This action will cancel the meeting for all participants.
                </p>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Cancellation Reason
            </label>

            <textarea
              value={reason}
              onChange={(e) =>
                setReason(
                  e.target.value
                )
              }
              rows={4}
              placeholder="Optional reason..."
              disabled={isLoading}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium hover:bg-slate-50 disabled:opacity-50"
            >
              Keep Meeting
            </button>

            <button
              type="button"
              onClick={handleConfirm}
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold disabled:opacity-50"
            >
              {isLoading && (
                <Loader2 className="w-4 h-4 animate-spin" />
              )}

              Cancel Meeting
            </button>
          </div>
        </div>
      </div>
    </>
  );
}