import { useState } from "react";
import { useForm } from "react-hook-form";
import { useCreateMeetingMutation } from "../api/meetingsApi"; // Adjust endpoint path if needed
import { useNavigate } from "react-router-dom";

export const useCreateMeetingForm = () => {
  const navigate = useNavigate();
  const [createMeeting, { isLoading: isSubmitting }] = useCreateMeetingMutation();

  // Local state parameters for external relations components
  const [participants, setParticipants] = useState([]);
  const [targets, setTargets] = useState([]);

  const methods = useForm({
    defaultValues: {
      title: "",
      description: "",
      agenda: "",
      category: "general",
      visibility: "private",
      schedule_type: "scheduled",
      scheduled_start: "",
      scheduled_end: "",
      timezone: "UTC",
      recurrence_rule: null,
      max_participants: 100,
      waiting_room_enabled: false,
      recording_enabled: false,
    },
  });

  const visibility = methods.watch("visibility");
  const scheduleType = methods.watch("schedule_type");

  const onSubmit = async (formData) => {
    try {
      // LINE 81 FIX: Safely parse participant listings without crashing if an item or its ID is undefined
      const cleanParticipantIds = Array.isArray(participants)
        ? participants
            .filter((p) => p !== null && p !== undefined)
            .map((p) => {
              if (typeof p === "number" || typeof p === "string") return Number(p);
              return p.id || p.membership_id || p.value;
            })
            .filter((id) => id !== undefined && id !== null)
        : [];

      // Safely parse target layouts matching backend types
      const cleanTargets = Array.isArray(targets)
        ? targets
            .filter((t) => t !== null && t !== undefined)
            .map((t) => ({
              target_type: t.target_type || "team",
              target_id: Number(t.target_id || t.id || 0),
            }))
            .filter((t) => t.target_id > 0)
        : [];

      // Normalize primary properties into an exact DRF payload pattern
      const payload = {
        ...formData,
        participant_ids: cleanParticipantIds,
        targets: cleanTargets,
      };
      console.log("PAYLOAD SENT", payload);

      // Format ISO strings for timestamps if not instant mode
      if (payload.schedule_type === "instant") {
        const now = new Date();
        payload.scheduled_start = now.toISOString();
        payload.scheduled_end = new Date(now.getTime() + 60 * 60 * 1000).toISOString();
        payload.recurrence_rule = null;
      } else {
        if (payload.scheduled_start) payload.scheduled_start = new Date(payload.scheduled_start).toISOString();
        if (payload.scheduled_end) payload.scheduled_end = new Date(payload.scheduled_end).toISOString();
      }

      // Format the recursive structure matching your backend validator expectations
      if (payload.schedule_type === "recurring" && payload.recurrence_rule) {
        const freq = payload.recurrence_rule.frequency || "daily";
        
        if (freq === "daily") {
          delete payload.recurrence_rule.days;
          delete payload.recurrence_rule.day_of_month;
        } else if (freq === "weekly") {
          delete payload.recurrence_rule.day_of_month;
          // Set an initial active day if the array was left unconfigured
          if (!Array.isArray(payload.recurrence_rule.days) || payload.recurrence_rule.days.length === 0) {
            const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
            const currentDay = dayNames[new Date(payload.scheduled_start || Date.now()).getDay()];
            payload.recurrence_rule.days = [currentDay];
          }
        } else if (freq === "monthly") {
          delete payload.recurrence_rule.days;
          if (!payload.recurrence_rule.day_of_month) {
            payload.recurrence_rule.day_of_month = new Date(payload.scheduled_start || Date.now()).getDate();
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



      console.log("=================================");
      console.log("FORM DATA");
      console.log("scheduled_start:", formData.scheduled_start);
      console.log("scheduled_end:", formData.scheduled_end);
      console.log("timezone:", formData.timezone);

      console.log("=================================");
      console.log("PAYLOAD BEFORE API");

      console.log(
        JSON.stringify(
          payload,
          null,
          2
        )
      );

      console.log("=================================");

      console.log(
        "LOCAL START:",
        payload.scheduled_start
      );

      console.log(
        "LOCAL END:",
        payload.scheduled_end
      );

      if (payload.scheduled_start) {
        console.log(
          "ISO START:",
          new Date(
            payload.scheduled_start
          ).toISOString()
        );
      }

      if (payload.scheduled_end) {
        console.log(
          "ISO END:",
          new Date(
            payload.scheduled_end
          ).toISOString()
        );
      }

      console.log("=================================");
      // Fire the API call
      const response = await createMeeting(payload).unwrap();
      
      if (response) {
        navigate("/app/meetings");
      }
    } catch (error) {
      console.error("Backend validation lifecycle rejected target request payload:", error);
    }
  };

  return {
    methods,
    visibility,
    scheduleType,
    participants,
    setParticipants,
    targets,
    setTargets,
    onSubmit,
    isSubmitting,
  };
};