import { z } from "zod";

export const holidaySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Holiday name cannot be blank or whitespace.")
    .max(150, "Holiday name must be under 150 characters."),
  holiday_type: z.string().min(1, "Please select an operational holiday type classification."),
  holiday_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Provide a valid ISO date stamp format (YYYY-MM-DD)."),
  description: z.string().max(500, "Descriptions must not cross 500 characters.").optional().or(z.literal("")),
  is_paid: z.boolean().default(true),
  is_half_day: z.boolean().default(false),
});