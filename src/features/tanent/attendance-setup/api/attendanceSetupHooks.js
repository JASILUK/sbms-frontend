/**
 * Attendance Setup — Hook Re-exports
 * Centralized barrel file for all attendance setup data layer hooks.
 *
 * Import from here in UI components to decouple from the API slice
 * and enable future hook wrapping (e.g., domain-specific logic,
 * optimistic UI wrappers, permission gating).
 */

export {
  // ─── Working Schedules ─────────────────────────────────────────────────
  useGetCompanyScheduleQuery,
  useCreateCompanyScheduleMutation,
  useUpdateCompanyScheduleMutation,
  useToggleCompanyScheduleMutation,

  // ─── Attendance Policies ───────────────────────────────────────────────
  useGetAttendancePolicyQuery,
  useUpdateAttendancePolicyMutation,
  useResetAttendancePolicyMutation,

  // ─── Holidays ────────────────────────────────────────────────────────────
  useGetHolidaysQuery,
  useGetHolidayQuery,
  useCreateHolidayMutation,
  useUpdateHolidayMutation,
  useDeleteHolidayMutation,
  useImportHolidaysMutation,
  usePreviewHolidayImportMutation,

  // ─── Shift Templates ─────────────────────────────────────────────────────
  useGetShiftsQuery,
  useGetShiftQuery,
  useCreateShiftMutation,
  useUpdateShiftMutation,
  useDeleteShiftMutation,
  useActivateShiftMutation,
  useSetDefaultShiftMutation,

  // ─── Shift Assignments ─────────────────────────────────────────────────
  useGetAssignmentsQuery,
  useGetAssignmentQuery,
  useCreateAssignmentMutation,
  useUpdateAssignmentMutation,
  useEndAssignmentMutation,
  useDeactivateAssignmentMutation,
  useTransferAssignmentMutation,
  useBulkAssignMutation,
} from "./attendanceSetupApi";