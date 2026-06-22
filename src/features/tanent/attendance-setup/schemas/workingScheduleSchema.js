import { z } from "zod";

export const workingScheduleSchema = z.object({
  working_days: z.array(z.string()).min(1, "You must select at least one working day."),
  weekend_days: z.array(z.string()),
  work_start_time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/, "Invalid start time format"),
  work_end_time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/, "Invalid end time format"),
  break_minutes: z.number().min(0, "Break minutes cannot be negative"),
  timezone: z.string().min(1, "Timezone is required"),
  // Hardened line: Softened from .length(2) to generic string validation to allow full names like "India"
  country: z.string().min(1, "Country designation is required"),
  state: z.string().optional().or(z.literal("")),
  holiday_sync_enabled: z.boolean(),
  holiday_provider: z.string().optional().or(z.literal("")),
}).refine((data) => {
  const start = data.work_start_time.split(":");
  const end = data.work_end_time.split(":");
  const startMins = parseInt(start[0], 10) * 60 + parseInt(start[1], 10);
  const endMins = parseInt(end[0], 10) * 60 + parseInt(end[1], 10);
  return endMins > startMins;
}, {
  message: "End time must be chronologically after the start time",
  path: ["work_end_time"],
});