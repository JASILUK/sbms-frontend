import {
  Bell,
  MessageSquare,
  Calendar,
  Shield,
  X,
  Loader2,
} from "lucide-react";

import { useEffect } from "react";

export default function NotificationPermissionModal({

  isOpen,
  onEnable,
  onClose,
  isLoading = false,

}) {

  // =====================================================
  // ESC CLOSE
  // =====================================================

  useEffect(() => {

    if (!isOpen) {
      return;
    }

    const handleEscape = (event) => {

      if (event.key === "Escape") {
        onClose();
      }

    };

    window.addEventListener(
      "keydown",
      handleEscape,
    );

    return () => {

      window.removeEventListener(
        "keydown",
        handleEscape,
      );

    };

  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (

    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="notification-modal-title"
    >

      {/* BACKDROP CLICK */}
      <div
        className="absolute inset-0"
        onClick={onClose}
      />

      {/* MODAL */}
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">

        {/* HEADER */}
        <div className="relative bg-gradient-to-br from-indigo-600 to-indigo-800 px-6 py-8 text-white">

          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            aria-label="Close modal"
            className="absolute right-4 top-4 rounded-xl p-2 text-white/70 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
          >

            <X className="h-5 w-5" />

          </button>

          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">

            <Bell className="h-7 w-7" />

          </div>

          <h2
            id="notification-modal-title"
            className="text-2xl font-bold"
          >
            Enable Notifications
          </h2>

          <p className="mt-2 text-sm leading-relaxed text-indigo-100">

            Stay updated with important business activity,
            messages, meetings, and system alerts in real time.

          </p>

        </div>

        {/* BODY */}
        <div className="space-y-5 px-6 py-6">

          <FeatureItem
            icon={
              <MessageSquare className="h-5 w-5" />
            }
            title="Chat Messages"
            description="Receive instant alerts when teammates send new messages."
          />

          <FeatureItem
            icon={
              <Calendar className="h-5 w-5" />
            }
            title="Meetings & Reminders"
            description="Get reminders for meetings, schedules, and events."
          />

          <FeatureItem
            icon={
              <Shield className="h-5 w-5" />
            }
            title="Security & System Activity"
            description="Stay informed about important account and workspace activity."
          />

        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-5">

          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
          >
            Maybe Later
          </button>

          <button
            type="button"
            onClick={onEnable}
            disabled={isLoading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-700 disabled:opacity-60"
          >

            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Enabling...
              </>
            ) : (
              "Enable Notifications"
            )}

          </button>

        </div>

      </div>

    </div>
  );
}

function FeatureItem({

  icon,
  title,
  description,

}) {

  return (

    <div className="flex items-start gap-4">

      <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">

        {icon}

      </div>

      <div className="min-w-0 flex-1">

        <h3 className="font-semibold text-slate-900">
          {title}
        </h3>

        <p className="mt-1 text-sm leading-relaxed text-slate-500">
          {description}
        </p>

      </div>

    </div>
  );
}