import React from "react";
import { AlertTriangle, Info, CheckCircle2, HelpCircle } from "lucide-react";

export default function NotificationStatusBanner({ status }) {
  if (status === "granted") {
    return (
      <div className="mb-6 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 flex items-start gap-3">
        <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
        <div>
          <h4 className="text-sm font-semibold text-emerald-800">Browser Permissions Allowed</h4>
          <p className="text-xs text-emerald-700 mt-0.5">
            Your browser is correctly configured to receive desktop push notifications.
          </p>
        </div>
      </div>
    );
  }

  if (status === "denied") {
    return (
      <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50/60 p-4 flex items-start gap-3 animate-fadeIn">
        <AlertTriangle className="w-5 h-5 text-rose-600 mt-0.5 shrink-0" />
        <div>
          <h4 className="text-sm font-semibold text-rose-800">Push Notifications Blocked</h4>
          <p className="text-xs text-rose-700 mt-0.5">
            Your browser is currently blocking push alerts. Please unlock desktop layout notification privileges in your site settings to receive live session context.
          </p>
        </div>
      </div>
    );
  }

  if (status === "unsupported") {
    return (
      <div className="mb-6 rounded-2xl border border-blue-200 bg-blue-50/60 p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
        <div>
          <h4 className="text-sm font-semibold text-blue-800">Unsupported Browser Environment</h4>
          <p className="text-xs text-blue-700 mt-0.5">
            This platform engine environment doesn't natively support structural HTML5 Push API alerts. Consider accessing your space using an enterprise desktop platform client wrapper.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 flex items-start gap-3">
      <HelpCircle className="w-5 h-5 text-slate-500 mt-0.5 shrink-0" />
      <div>
        <h4 className="text-sm font-semibold text-slate-800">Permission Action Required</h4>
        <p className="text-xs text-slate-600 mt-0.5">
          Push privileges have not been explicitly evaluated yet. Click Enable below to prompt verification context layouts.
        </p>
      </div>
    </div>
  );
}