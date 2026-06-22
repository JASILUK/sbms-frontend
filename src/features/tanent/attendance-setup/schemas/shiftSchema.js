import { z } from "zod";

// FIXED: Changed z.zodObject to z.object
export const shiftSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Shift name is required." })
    .max(100, { message: "Shift name must be under 100 characters." })
    .transform((val) => val.trim()),
  
  description: z
    .string()
    .max(500, { message: "Description must be under 500 characters." })
    .transform((val) => val.trim())
    .optional()
    .default(""),
  
  shift_type: z.enum(["regular", "night"], {
    errorMap: () => ({ message: "Please select a valid shift classification type." }),
  }),
  
  start_time: z
    .string()
    .min(1, { message: "Start time is required." })
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: "Invalid 24-hour time format (HH:MM)." }),
  
  end_time: z
    .string()
    .min(1, { message: "End time is required." })
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: "Invalid 24-hour time format (HH:MM)." }),
  
  break_duration_minutes: z
    .number({ invalid_type_error: "Break duration must be a valid number." })
    .min(0, { message: "Break duration cannot be negative." })
    .max(240, { message: "Break duration cannot exceed 240 minutes." })
    .default(60),
  
  is_active: z.boolean().default(true),
}).refine((data) => data.start_time !== data.end_time, {
  message: "Start and end times cannot be identical.",
  path: ["end_time"],
});