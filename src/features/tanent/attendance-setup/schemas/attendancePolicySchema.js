import { z } from "zod";

export const attendancePolicySchema = z
  .object({
    required_work_minutes: z
      .number({ invalid_type_error: "Minutes must be a valid number" })
      .positive("Required work minutes must be greater than 0"),
    half_day_below_minutes: z
      .number({ invalid_type_error: "Minutes must be a valid number" })
      .positive("Half-day threshold must be greater than 0"),
    late_after_minutes: z
      .number({ invalid_type_error: "Minutes must be a valid number" })
      .min(0, "Late arrival grace period cannot be negative"),
    early_exit_before_minutes: z
      .number({ invalid_type_error: "Minutes must be a valid number" })
      .min(0, "Early exit margin cannot be negative"),
    overtime_enabled: z.boolean(),
    overtime_after_minutes: z
      .number({ invalid_type_error: "Minutes must be a valid number" })
      .positive("Overtime threshold must be greater than 0"),
    count_weekend_as_overtime: z.boolean(),
    auto_absent_if_no_checkin: z.boolean(),
    attendance_regularization_enabled: z.boolean(),
    is_active: z.boolean(),
  })
  .refine((data) => data.half_day_below_minutes < data.required_work_minutes, {
    message: "Half-day threshold must be less than required daily work minutes",
    path: ["half_day_below_minutes"],
  })
  .refine(
    (data) => {
      if (data.overtime_enabled) {
        return data.overtime_after_minutes >= data.required_work_minutes;
      }
      return true;
    },
    {
      message: "Overtime calculation threshold must be equal to or greater than required daily work minutes",
      path: ["overtime_after_minutes"],
    }
  );