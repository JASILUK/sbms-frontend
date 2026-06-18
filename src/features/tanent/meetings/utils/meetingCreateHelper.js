export function buildMeetingPayload({
  values,
  participants,
  targets,
}) {
  return {
    title: values.title,

    description: values.description,

    agenda: values.agenda,

    category: values.category,

    visibility: values.visibility,

    schedule_type:
      values.schedule_type,

    scheduled_start:
      values.scheduled_start,

    scheduled_end:
      values.scheduled_end,

    timezone: values.timezone,

    recurrence_rule:
      values.recurrence_rule,

    participant_ids:
      participants.map((p) => p.id),

    targets,

    ...(values.max_participants && {
      max_participants: Number(
        values.max_participants
      ),
    }),

    waiting_room_enabled:
      values.waiting_room_enabled,

    recording_enabled:
      values.recording_enabled,
  };
}