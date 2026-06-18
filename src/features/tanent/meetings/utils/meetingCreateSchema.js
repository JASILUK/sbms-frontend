import { z } from "zod";

export const meetingCreateSchema =
  z.object({
    title: z
      .string()
      .min(2),

    description: z.string(),

    agenda: z.string(),

    category: z.string(),

    visibility: z.string(),

    schedule_type: z.string(),

    scheduled_start: z.string(),

    scheduled_end: z.string(),

    timezone: z.string(),

    recurrence_rule:
      z.string(),

    max_participants:
      z.union([
        z.string(),
        z.number(),
      ]),

    waiting_room_enabled:
      z.boolean(),

    recording_enabled:
      z.boolean(),
  });