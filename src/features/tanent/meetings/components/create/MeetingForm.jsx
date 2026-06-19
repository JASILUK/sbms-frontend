import React from "react";
import { FormProvider } from "react-hook-form";

import MeetingBasicSection from "./MeetingBasicSection";
import MeetingScheduleSection from "./MeetingScheduleSection";
import MeetingVisibilitySection from "./MeetingVisibilitySection";
import MeetingParticipantsSection from "./participants/meetingParticipantsSection";
import MeetingTargetsSection from "./targets/meetingTargetsSection";
import MeetingOptionsSection from "./MeetingOptionSection";
import MeetingSubmitBar from "./MeetingSubmitBar";

import { useCreateMeetingForm } from "../../hooks/useCreateMeetingForm";

export default function MeetingForm() {
  const {
    methods,
    visibility,
    participants = [], // Ensured default fallback array to prevent .map or navigation exceptions
    setParticipants,
    targets = [],      // Ensured default fallback array
    setTargets,
    onSubmit,
    isSubmitting,
  } = useCreateMeetingForm();

  // Custom pre-submission parser to protect against runtime exceptions and empty values
  const handleFormSanitizer = (data) => {
    // 1. Safe parsing of relational fields based on backend layout architecture
    const payload = {
      ...data,
      participant_ids: Array.isArray(participants)
        ? participants.filter(p => p && (p.id || p.membership_id)).map(p => p.id || p.membership_id)
        : [],
      targets: Array.isArray(targets) 
        ? targets.map(t => ({ target_type: t.target_type, target_id: Number(t.target_id) })) 
        : [],
    };

    // 2. Adjust dates if the meeting type is configured as instant
    if (payload.schedule_type === "instant") {
      const now = new Date();
      const endOffset = new Date(now.getTime() + 60 * 60 * 1000); // Defaults to a 1-hour session duration
      payload.scheduled_start = now.toISOString();
      payload.scheduled_end = endOffset.toISOString();
      payload.recurrence_rule = null;
    }

    // 3. Ensure recurrence rules strictly match RecurrenceValidator parameters
    if (payload.schedule_type === "recurring" && payload.recurrence_rule) {
      const freq = payload.recurrence_rule.frequency || "daily";
      
      // Clean up parameters that are not allowed for specific frequencies
      if (freq === "daily") {
        delete payload.recurrence_rule.days;
        delete payload.recurrence_rule.day_of_month;
      } else if (freq === "weekly") {
        delete payload.recurrence_rule.day_of_month;
        if (!Array.isArray(payload.recurrence_rule.days) || payload.recurrence_rule.days.length === 0) {
          // Fallback context: backend requires at least one weekday value for weekly scheduling
          const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
          payload.recurrence_rule.days = [dayNames[new Date(payload.scheduled_start || Date.now()).getDay()]];
        }
      } else if (freq === "monthly") {
        delete payload.recurrence_rule.days;
        if (!payload.recurrence_rule.day_of_month) {
          payload.recurrence_rule.day_of_month = new Date(payload.scheduled_start || Date.now()).getDate();
        }
      }

      // Convert optional properties to null instead of empty string values
      if (!payload.recurrence_rule.until) {
        payload.recurrence_rule.until = null;
      } else {
        payload.recurrence_rule.until = new Date(payload.recurrence_rule.until).toISOString();
      }
    }

    // 4. Safely forward clean data variables back to your custom hook executor
    onSubmit(payload);
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(handleFormSanitizer)}
        className="space-y-6 pb-28"
      >
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

        <MeetingSubmitBar isSubmitting={isSubmitting} />
      </form>
    </FormProvider>
  );
}