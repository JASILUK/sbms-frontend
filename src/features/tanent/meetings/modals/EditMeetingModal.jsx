import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";

import MeetingBasicSection from "../components/create/MeetingBasicSection";
import MeetingScheduleSection from "../components/create/MeetingScheduleSection";
import MeetingVisibilitySection from "../components/create/MeetingVisibilitySection";
import MeetingParticipantsSection from "../components/create/participants/meetingParticipantsSection";
import MeetingTargetsSection from "../components/create/targets/meetingTargetsSection";
import MeetingOptionsSection from "../components/create/MeetingOptionSection";

export default function EditMeetingModal({
  meeting,
  isOpen,
  onClose,
  onSubmit,
}) {
  const methods = useForm();
  const [participants, setParticipants] = useState([]);
  const [targets, setTargets] = useState([]);

  const visibility = methods.watch("visibility");



  const toLocalDateTimeInput = (isoString) => {
    if (!isoString) return "";

    const date = new Date(isoString);

    const timezoneOffset =
      date.getTimezoneOffset() * 60000;

    return new Date(
      date.getTime() - timezoneOffset
    )
      .toISOString()
      .slice(0, 16);
  };


  // =====================================================
  // INITIALIZE FORM WITH RECURRENCE PATTERNS
  // =====================================================
  useEffect(() => {
    if (!meeting || !isOpen) {
      return;
    }

    // Safely parse the backend recurrence data format
    let initializedRecurrenceRule = null;
    if (meeting.schedule_type === "recurring" && meeting.recurrence_rule) {
      const rawRule = typeof meeting.recurrence_rule === "string"
        ? JSON.parse(meeting.recurrence_rule)
        : meeting.recurrence_rule;

      initializedRecurrenceRule = {
        frequency: rawRule.frequency || "daily",
        interval: rawRule.interval || 1,
        until: rawRule.until ? rawRule.until.slice(0, 16) : "",
        days: Array.isArray(rawRule.days) ? rawRule.days : [],
        day_of_month: rawRule.day_of_month || "",
      };
    }

    methods.reset({
      title: meeting.title || "",
      description: meeting.description || "",
      agenda: meeting.agenda || "",
      category: meeting.category || "general",
      visibility: meeting.visibility || "private",
      schedule_type: meeting.schedule_type || "scheduled",

      scheduled_start: toLocalDateTimeInput(
        meeting.scheduled_start
      ),

      scheduled_end: toLocalDateTimeInput(
        meeting.scheduled_end
      ),
      timezone: meeting.timezone || "UTC",

      recurrence_rule: initializedRecurrenceRule,

      max_participants: meeting.max_participants || 100,
      waiting_room_enabled: !!meeting.waiting_room_enabled,
      recording_enabled: !!meeting.recording_enabled,
      
      // Auto-load raw selected reminder array parameters direct to context
      reminder_minutes: Array.isArray(meeting.reminder_minutes) ? meeting.reminder_minutes : [],
    });

    // =================================================
    // NORMALIZE PARTICIPANTS
    // =================================================
    setParticipants(
      (meeting.participants || []).map((participant) => ({
        id: participant.membership_id || participant.id,
        username: participant.username,
        role: participant.role,
        status: participant.status,
      }))
    );

    // =================================================
    // NORMALIZE TARGETS
    // =================================================
    setTargets(
      (meeting.targets || []).map((target) => ({
        target_type: target.target_type,
        target_id: target.target_id,
        name: target.target_name || target.name,
      }))
    );
  }, [meeting, isOpen, methods]);

  // =====================================================
  // SUBMIT HANDLER & PAYLOAD SANITIZATION
  // =====================================================
  const handleSubmit = (values) => {
    // Prevent mapping over undefined collections
    const cleanParticipantIds = Array.isArray(participants)
      ? participants
          .filter((p) => p !== null && p !== undefined)
          .map((p) => (typeof p === "number" || typeof p === "string" ? Number(p) : p.id))
          .filter((id) => id !== undefined && id !== null)
      : [];

    const cleanTargets = Array.isArray(targets)
      ? targets
          .filter((t) => t !== null && t !== undefined)
          .map((t) => ({
            target_type: t.target_type,
            target_id: Number(t.target_id || 0),
          }))
          .filter((t) => t.target_id > 0)
      : [];

    const payload = {
      ...values,
      participant_ids: cleanParticipantIds,
      targets: cleanTargets,
    };

    // Format fields correctly for the backend
    if (payload.schedule_type === "instant") {
      const now = new Date();
      payload.scheduled_start = now.toISOString();
      payload.scheduled_end = new Date(now.getTime() + 60 * 60 * 1000).toISOString();
      payload.recurrence_rule = null;
    } else {
      if (payload.scheduled_start) payload.scheduled_start = new Date(payload.scheduled_start).toISOString();
      if (payload.scheduled_end) payload.scheduled_end = new Date(payload.scheduled_end).toISOString();
    }

    // Clean up keys to match backend validator rules
    if (payload.schedule_type === "recurring" && payload.recurrence_rule) {
      const freq = payload.recurrence_rule.frequency || "daily";

      if (freq === "daily") {
        delete payload.recurrence_rule.days;
        delete payload.recurrence_rule.day_of_month;
      } else if (freq === "weekly") {
        delete payload.recurrence_rule.day_of_month;
        if (!Array.isArray(payload.recurrence_rule.days) || payload.recurrence_rule.days.length === 0) {
          const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
          const automaticDay = dayNames[new Date(payload.scheduled_start).getDay()];
          payload.recurrence_rule.days = [automaticDay];
        }
      } else if (freq === "monthly") {
        delete payload.recurrence_rule.days;
        if (!payload.recurrence_rule.day_of_month) {
          payload.recurrence_rule.day_of_month = new Date(payload.scheduled_start).getDate();
        } else {
          payload.recurrence_rule.day_of_month = Number(payload.recurrence_rule.day_of_month);
        }
      }

      if (!payload.recurrence_rule.until) {
        payload.recurrence_rule.until = null;
      } else {
        payload.recurrence_rule.until = new Date(payload.recurrence_rule.until).toISOString();
      }
    } else if (payload.schedule_type !== "recurring") {
      payload.recurrence_rule = null;
    }

    onSubmit(payload);
  };

  // =====================================================
  // HIDE BOUNDARY
  // =====================================================
  if (!isOpen || !meeting) {
    return null;
  }

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="min-h-full flex items-start justify-center p-6">
          <div className="w-full max-w-5xl bg-slate-50 rounded-2xl shadow-2xl overflow-hidden border border-slate-100">
            
            <div className="sticky top-0 z-20 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-990">
                  Edit Meeting
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Update your standard or recurring session configurations.
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 rounded-lg text-xs font-medium border text-slate-600 bg-white hover:bg-slate-50 transition-colors shadow-sm"
              >
                Close
              </button>
            </div>

            <div className="p-6">
              <FormProvider {...methods}>
                <form
                  onSubmit={methods.handleSubmit(handleSubmit)}
                  className="space-y-6"
                >
                  <div className="space-y-6 pb-24">
                    <MeetingBasicSection />
                    <MeetingScheduleSection />
                    <MeetingVisibilitySection />

                    {visibility !== "public" && (
                      <MeetingParticipantsSection
                        participants={participants}
                        onChange={setParticipants}
                      />
                    )}

                    {visibility === "targeted" && (
                      <MeetingTargetsSection
                        targets={targets}
                        onChange={setTargets}
                      />
                    )}

                    <MeetingOptionsSection />
                  </div>

                  <div className="sticky bottom-0 bg-slate-50 pt-4 border-t border-slate-200/60">
                    <div className="flex items-center justify-end gap-3 pb-2">
                      <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-sm transition-colors"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </form>
              </FormProvider>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}