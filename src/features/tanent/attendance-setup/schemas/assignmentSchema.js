import { z } from "zod";
import { isBefore, parseISO } from "date-fns";

export const assignmentSchema = z.object({
  membership_id: z.string().min(1, { message: "An explicit employee selection is required." }),
  shift_id: z.string().min(1, { message: "A specific operational shift target must be designated." }),
  effective_from: z.string().min(1, { message: "Effective lifecycle activation date is required." }),
  effective_to: z.string().nullable().optional().default(null),
  notes: z.string().max(1000, { message: "Audit logs cannot exceed 1000 characters." }).optional().default(""),
}).refine(
  (data) => {
    if (!data.effective_to) return true;
    return !isBefore(parseISO(data.effective_to), parseISO(data.effective_from));
  },
  {
    message: "Deactivation checkpoint date cannot precede activation lifecycle dates.",
    path: ["effective_to"],
  }
);

export const transferAssignmentSchema = z.object({
  new_shift_id: z.string().min(1, { message: "Designate a separate target pattern destination." }),
  transfer_date: z.string().min(1, { message: "Effective structural cutoff date parameter is required." }),
  notes: z.string().max(1000).optional().default(""),
});

export const bulkAssignmentSchema = z.object({
  membership_ids: z.array(z.string()).min(1, { message: "At least one target profile must be selected." }),
  shift_id: z.string().min(1, { message: "A structural shift pattern target must be assigned." }),
  effective_from: z.string().min(1, { message: "Bulk lifecycle initialization checkpoint date required." }),
  effective_to: z.string().nullable().optional().default(null),
  notes: z.string().optional().default(""),
}).refine(
  (data) => {
    if (!data.effective_to) return true;
    return !isBefore(parseISO(data.effective_to), parseISO(data.effective_from));
  },
  {
    message: "Lifecycle limits must match sequential timeline logic constraints.",
    path: ["effective_to"],
  }
);