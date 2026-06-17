import React, { useEffect, useState } from "react";
import { Bell, BellOff, Info } from "lucide-react";
import {
  useGetNotificationPreferencesQuery,
  useUpdateNotificationPreferencesMutation,
} from "../../notifications/notificationApi";
import NotificationToggleCard from "../Component/NotificationToggleCard"
import NotificationStatusBanner from "../Component/NotificationStatusBanner";

export default function Notification_Settings() {
  const { data: prefResponse, isLoading: isPrefLoading } = useGetNotificationPreferencesQuery();
  const [updatePreferences] = useUpdateNotificationPreferencesMutation();

  const [notificationStatus, setNotificationStatus] = useState("default");
  const [actionLoading, setActionLoading] = useState(false);
  
  // Track field-specific micro loading states to prevent whole page layout locking
  const [updatingFields, setUpdatingFields] = useState({});

  useEffect(() => {
    if (typeof Notification === "undefined") {
      setNotificationStatus("unsupported");
      return;
    }
    setNotificationStatus(Notification.permission);
  }, []);

  const preferences = prefResponse?.data || {};
    const globalPushEnabled = !!preferences.push_enabled;

  const handleGlobalPushToggle = async (targetState) => {
    try {
      setActionLoading(true);
      
      // Perform optimistic API modification directly matched on backend payload requirements
      await updatePreferences({ push_enabled: targetState }).unwrap();
    } catch (error) {
      console.error("Failed to mutate push preference channel state:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handlePreferenceChange = async (field, value) => {
    setUpdatingFields((prev) => ({ ...prev, [field]: true }));
    try {
      await updatePreferences({ [field]: value }).unwrap();
    } catch (error) {
      console.error(`Field update rollback structural handler for ${field}:`, error);
    } finally {
      setUpdatingFields((prev) => ({ ...prev, [field]: false }));
    }
  };

  if (isPrefLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="h-12 w-48 bg-slate-100 rounded-xl animate-pulse" />
        <div className="h-40 bg-white border border-slate-200 rounded-2xl p-6 animate-pulse" />
        <div className="h-64 bg-white border border-slate-200 rounded-2xl p-6 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* HEADER RAIL */}
      <div>
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Notification Configuration</h1>
            <p className="text-sm text-slate-500 mt-0.5">Configure system metrics routing triggers and delivery transport topologies.</p>
          </div>
        </div>
      </div>

      {/* BROWSER DIAGNOSTIC STATUS BANNER */}
      <NotificationStatusBanner status={notificationStatus} />

      {/* SECTION 1: GLOBAL NOTIFICATION CHANNELS */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-900">Notification Delivery Channels</h3>
          <p className="text-xs text-slate-400 mt-0.5">Control global pipelines used by downstream structural features.</p>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50/50 border border-slate-100">
            <div>
              <h4 className="text-sm font-semibold text-slate-800">Master Real-time Push Pipeline</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Current status: <span className="font-semibold">{globalPushEnabled ? "Active" : "Suspended"}</span> &bull; Permission: <span className="font-semibold capitalize">{notificationStatus}</span>
              </p>
            </div>
            {globalPushEnabled ? (
              <button
                type="button"
                onClick={() => handleGlobalPushToggle(false)}
                disabled={actionLoading}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 transition-colors disabled:opacity-50"
              >
                <BellOff className="w-3.5 h-3.5" /> Disable Push Channel
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleGlobalPushToggle(true)}
                disabled={actionLoading || notificationStatus === "denied"}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-colors disabled:opacity-50"
              >
                <Bell className="w-3.5 h-3.5" /> Enable Push Channel
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <NotificationToggleCard
              title="Email Notification Subsystem"
              description="Dispatch asynchronous recap messages and schedule logs direct to your registered inbox layout context."
              enabled={preferences.email_enabled}
              isUpdating={updatingFields["email_enabled"]}
              onChange={(v) => handlePreferenceChange("email_enabled", v)}
            />
            <NotificationToggleCard
              title="Audio Interface Signaling"
              description="Play sound indicators on inbound desktop structural notifications when client workspace windows retain active focus."
              enabled={preferences.sound_enabled}
              isUpdating={updatingFields["sound_enabled"]}
              onChange={(v) => handlePreferenceChange("sound_enabled", v)}
            />
          </div>
        </div>
      </div>

      {/* SECTION 2: NOTIFICATION TYPES */}
      <div className="space-y-3">
        <div>
          <h3 className="text-base font-semibold text-slate-900">Feature Event Topologies</h3>
          {!globalPushEnabled && (
            <p className="text-xs text-amber-600 font-medium flex items-center gap-1 mt-0.5 animate-slideDown">
              <Info className="w-3.5 h-3.5 shrink-0" /> Feature alerts are currently muted because the master push delivery channel is offline.
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <NotificationToggleCard
            title="Instant Chat Messages"
            description="Trigger alerts on inbound direct text context payloads inside live team workspaces."
            enabled={preferences.chat_message_enabled}
            disabled={!globalPushEnabled}
            isUpdating={updatingFields["chat_message_enabled"]}
            onChange={(v) => handlePreferenceChange("chat_message_enabled", v)}
          />

          <NotificationToggleCard
            title="Direct Mentions & Tag Rules"
            description="Acquire immediate alerts when your handle is specifically called within active work item notes."
            enabled={preferences.mention_enabled}
            disabled={!globalPushEnabled}
            isUpdating={updatingFields["mention_enabled"]}
            onChange={(v) => handlePreferenceChange("mention_enabled", v)}
          />

          <NotificationToggleCard
            title="Meeting Schedule Triggers"
            description="Receive lifecycle sync adjustments, timeline revisions, and automatic room connection countdown warnings."
            enabled={preferences.meeting_enabled}
            disabled={!globalPushEnabled}
            isUpdating={updatingFields["meeting_enabled"]}
            onChange={(v) => handlePreferenceChange("meeting_enabled", v)}
          />

          <NotificationToggleCard
            title="Session Attendance Controls"
            description="Track participant checklist signatures and room onboarding verification logs real-time updates."
            enabled={preferences.attendance_enabled}
            disabled={!globalPushEnabled}
            isUpdating={updatingFields["attendance_enabled"]}
            onChange={(v) => handlePreferenceChange("attendance_enabled", v)}
          />

          <NotificationToggleCard
            title="Core System Node Logs"
            description="Critical cluster updates, compliance assertions, and automated architecture space billing reminders."
            enabled={preferences.system_enabled}
            disabled={!globalPushEnabled}
            isUpdating={updatingFields["system_enabled"]}
            onChange={(v) => handlePreferenceChange("system_enabled", v)}
          />
        </div>
      </div>

    </div>
  );
}