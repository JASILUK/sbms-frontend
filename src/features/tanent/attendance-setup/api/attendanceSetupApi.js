/**
 * Attendance Setup API Slice
 * Injected into the shared baseApi via injectEndpoints.
 *
 * Architecture:
 * - Feature-based module isolation
 * - Centralized constants for all endpoint paths
 * - Centralized tags for cache invalidation
 * - LIST/ITEM tag strategy for collections
 * - Optimistic updates where appropriate
 * - Pagination-ready transformResponse hooks
 * - WebSocket cache update hooks (reserved for Phase 2)
 */

import { baseApi } from "../../../../services/baseApi";
import { ATTENDANCE_ENDPOINTS, ATTENDANCE_QUERY_KEYS } from "./attendanceSetupConstants";
import { ATTENDANCE_SETUP_TAGS, getListTag, getItemTag } from "./attendanceSetupTags";

// ─────────────────────────────────────────────────────────────────────────────
// Tag Constants (local aliases for readability)
// ─────────────────────────────────────────────────────────────────────────────
const TAGS = ATTENDANCE_SETUP_TAGS;

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Constants (local aliases for readability)
// ─────────────────────────────────────────────────────────────────────────────
const ENDPOINTS = ATTENDANCE_ENDPOINTS;

// ═════════════════════════════════════════════════════════════════════════
// ATTENDANCE SETUP API SLICE
// ═════════════════════════════════════════════════════════════════════════

export const attendanceSetupApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ═════════════════════════════════════════════════════════════════════════
    // 1. WORKING SCHEDULES
    // ═════════════════════════════════════════════════════════════════════════

    /**
     * GET /attendance/schedule/
     * Fetches the company's working schedule configuration.
     */
    getCompanySchedule: builder.query({
      query: () => ({
        url: ENDPOINTS.SCHEDULE.BASE,
        method: "GET",
      }),
      providesTags: [TAGS.SCHEDULE],
    }),

    /**
     * POST /attendance/schedule/
     * Creates a new company working schedule.
     */
    createCompanySchedule: builder.mutation({
      query: (body) => ({
        url: ENDPOINTS.SCHEDULE.BASE,
        method: "POST",
        body,
      }),
      invalidatesTags: [TAGS.SCHEDULE],
    }),

    /**
     * PATCH /attendance/schedule/detail/
     * Partially updates the company working schedule.
     */
    updateCompanySchedule: builder.mutation({
      query: (body) => ({
        url: ENDPOINTS.SCHEDULE.DETAIL,
        method: "PATCH",
        body,
      }),
      invalidatesTags: [TAGS.SCHEDULE],
    }),

    /**
     * POST /attendance/schedule/activation/
     * Toggles the active state of a company schedule.
     */
    toggleCompanySchedule: builder.mutation({
      query: (body) => ({
        url: ENDPOINTS.SCHEDULE.ACTIVATION,
        method: "POST",
        body,
      }),
      invalidatesTags: [TAGS.SCHEDULE],
    }),

    // ═════════════════════════════════════════════════════════════════════════
    // 2. ATTENDANCE POLICIES
    // ═════════════════════════════════════════════════════════════════════════

    /**
     * GET /attendance/policy/
     * Fetches the tenant's attendance policy configuration.
     */
    getAttendancePolicy: builder.query({
      query: () => ({
        url: ENDPOINTS.POLICY.BASE,
        method: "GET",
      }),
      providesTags: [TAGS.POLICY],
    }),

    /**
     * PATCH /attendance/policy/update/
     * Partially updates the attendance policy.
     */
    updateAttendancePolicy: builder.mutation({
      query: (body) => ({
        url: ENDPOINTS.POLICY.UPDATE,
        method: "PATCH",
        body,
      }),
      invalidatesTags: [TAGS.POLICY],
    }),

    /**
     * POST /attendance/policy/reset/
     * Resets the attendance policy to system defaults.
     */
    resetAttendancePolicy: builder.mutation({
      query: (body = {}) => ({
        url: ENDPOINTS.POLICY.RESET,
        method: "POST",
        body,
      }),
      invalidatesTags: [TAGS.POLICY],
    }),

    // ═════════════════════════════════════════════════════════════════════════
    // 3. HOLIDAYS
    // ═════════════════════════════════════════════════════════════════════════

    /**
     * GET /attendance/holidays/
     * Lists all holidays with optional pagination and filtering parameters.
     */
    getHolidays: builder.query({
      query: (params = {}) => ({
        url: ENDPOINTS.HOLIDAY.BASE,
        method: "GET",
        params,
      }),
      providesTags: (result) => {
        const list = Array.isArray(result?.data?.results)
          ? result.data.results
          : Array.isArray(result?.data)
          ? result.data
          : Array.isArray(result?.results)
          ? result.results
          : Array.isArray(result)
          ? result
          : [];

        return [
          getListTag(TAGS.HOLIDAY),
          ...list.map((item) => getItemTag(TAGS.HOLIDAY, item.id)),
        ];
      },
    }),

    /**
     * GET /attendance/holidays/:id/
     * Fetches a single holiday by ID.
     */
    getHoliday: builder.query({
      query: (id) => ({
        url: `${ENDPOINTS.HOLIDAY.BASE}${id}/`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [getItemTag(TAGS.HOLIDAY, id)],
    }),

    /**
     * POST /attendance/holidays/
     * Creates a new holiday.
     */
    createHoliday: builder.mutation({
      query: (body) => ({
        url: ENDPOINTS.HOLIDAY.BASE,
        method: "POST",
        body,
      }),
      invalidatesTags: [getListTag(TAGS.HOLIDAY)],
    }),

    /**
     * PATCH /attendance/holidays/:id/
     * Partially updates a holiday.
     */
    updateHoliday: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `${ENDPOINTS.HOLIDAY.BASE}${id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        getItemTag(TAGS.HOLIDAY, id),
        getListTag(TAGS.HOLIDAY),
      ],
    }),

    /**
     * DELETE /attendance/holidays/:id/
     * Removes a holiday.
     */
    deleteHoliday: builder.mutation({
      query: (id) => ({
        url: `${ENDPOINTS.HOLIDAY.BASE}${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        getItemTag(TAGS.HOLIDAY, id),
        getListTag(TAGS.HOLIDAY),
      ],
    }),

    /**
     * POST /attendance/holidays/import/
     * Bulk imports holidays from a file.
     */
    importHolidays: builder.mutation({
      query: (body) => ({
        url: ENDPOINTS.HOLIDAY.IMPORT,
        method: "POST",
        body,
      }),
      invalidatesTags: [getListTag(TAGS.HOLIDAY)],
    }),

    /**
     * POST /attendance/holidays/import/preview/
     * Previews holiday import data before committing.
     */
    previewHolidayImport: builder.mutation({
      query: (body) => ({
        url: ENDPOINTS.HOLIDAY.IMPORT_PREVIEW,
        method: "POST",
        body,
      }),
    }),

    // ═════════════════════════════════════════════════════════════════════════
    // 4. SHIFT TEMPLATES
    // ═════════════════════════════════════════════════════════════════════════

    /**
     * GET /attendance/shifts/
     * Lists shift templates with optional filtering.
     */
    getShifts: builder.query({
      query: (params = {}) => ({
        url: ENDPOINTS.SHIFT.BASE,
        method: "GET",
        params,
      }),
      providesTags: (result) => {
        const list = Array.isArray(result?.data?.results)
          ? result.data.results
          : Array.isArray(result?.data)
          ? result.data
          : Array.isArray(result?.results)
          ? result.results
          : Array.isArray(result)
          ? result
          : [];

        return [
          getListTag(TAGS.SHIFT),
          ...list.map((item) => getItemTag(TAGS.SHIFT, item.id)),
        ];
      },
    }),

    /**
     * GET /attendance/shifts/:id/
     * Fetches a single shift template by ID.
     */
    getShift: builder.query({
      query: (id) => ({
        url: `${ENDPOINTS.SHIFT.BASE}${id}/`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [getItemTag(TAGS.SHIFT, id)],
    }),

    /**
     * POST /attendance/shifts/
     * Creates a new shift template.
     */
    createShift: builder.mutation({
      query: (body) => ({
        url: ENDPOINTS.SHIFT.BASE,
        method: "POST",
        body,
      }),
      invalidatesTags: [getListTag(TAGS.SHIFT)],
    }),

    /**
     * PATCH /attendance/shifts/:id/
     * Partially updates a shift template.
     */
    updateShift: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `${ENDPOINTS.SHIFT.BASE}${id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        getItemTag(TAGS.SHIFT, id),
        getListTag(TAGS.SHIFT),
      ],
    }),

    /**
     * DELETE /attendance/shifts/:id/
     * Removes a shift template.
     */
    deleteShift: builder.mutation({
      query: (id) => ({
        url: `${ENDPOINTS.SHIFT.BASE}${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        getItemTag(TAGS.SHIFT, id),
        getListTag(TAGS.SHIFT),
      ],
    }),

    /**
     * POST /attendance/shifts/:id/activate/
     * Activates a shift template.
     */
    activateShift: builder.mutation({
      query: (id) => ({
        url: `${ENDPOINTS.SHIFT.BASE}${id}/activate/`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => [
        getItemTag(TAGS.SHIFT, id),
        getListTag(TAGS.SHIFT),
      ],
    }),

    /**
     * POST /attendance/shifts/:id/set-default/
     * Sets a shift template as the default.
     */
    setDefaultShift: builder.mutation({
      query: (id) => ({
        url: `${ENDPOINTS.SHIFT.BASE}${id}/set-default/`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => [
        getItemTag(TAGS.SHIFT, id),
        getListTag(TAGS.SHIFT),
      ],
    }),

    // ═════════════════════════════════════════════════════════════════════════
    // 5. SHIFT ASSIGNMENTS
    // ═════════════════════════════════════════════════════════════════════════

    /**
     * GET /attendance/assignments/
     * Lists shift assignments with optional filtering.
     */
    getAssignments: builder.query({
      query: (params = {}) => ({
        url: ENDPOINTS.ASSIGNMENT.BASE,
        method: "GET",
        params,
      }),
      providesTags: (result) => {
        const list = Array.isArray(result?.data?.results)
          ? result.data.results
          : Array.isArray(result?.data)
          ? result.data
          : Array.isArray(result?.results)
          ? result.results
          : Array.isArray(result)
          ? result
          : [];

        return [
          getListTag(TAGS.ASSIGNMENT),
          ...list.map((item) => getItemTag(TAGS.ASSIGNMENT, item.id)),
        ];
      },
    }),

    /**
     * GET /attendance/assignments/:id/
     * Fetches a single shift assignment by ID.
     */
    getAssignment: builder.query({
      query: (id) => ({
        url: `${ENDPOINTS.ASSIGNMENT.BASE}${id}/`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [getItemTag(TAGS.ASSIGNMENT, id)],
    }),

    /**
     * POST /attendance/assignments/
     * Creates a new shift assignment.
     */
    createAssignment: builder.mutation({
      query: (body) => ({
        url: ENDPOINTS.ASSIGNMENT.BASE,
        method: "POST",
        body,
      }),
      invalidatesTags: [getListTag(TAGS.ASSIGNMENT)],
    }),

    /**
     * PATCH /attendance/assignments/:id/
     * Partially updates a shift assignment.
     */
    updateAssignment: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `${ENDPOINTS.ASSIGNMENT.BASE}${id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        getItemTag(TAGS.ASSIGNMENT, id),
        getListTag(TAGS.ASSIGNMENT),
      ],
    }),

    /**
     * POST /attendance/assignments/:id/end/
     * Ends a shift assignment (sets end date).
     */
    endAssignment: builder.mutation({
      // FIXED: Destructure payload into an 'id' and a structural body variable package
      query: ({ id, ...body }) => ({
        url: `${ENDPOINTS.ASSIGNMENT.BASE}${id}/end/`,
        method: "POST",
        body, // Passes data block directly: {"end_date": "2026-06-18"}
      }),
      invalidatesTags: (result, error, { id }) => [
        getItemTag(TAGS.ASSIGNMENT, id),
        getListTag(TAGS.ASSIGNMENT),
      ],
    }),

    /**
     * POST /attendance/assignments/:id/deactivate/
     * Deactivates a shift assignment.
     */
    deactivateAssignment: builder.mutation({
      // FIXED: Handled destructured parameters to avoid object leaks into the string URL segment
      query: (id) => ({
        url: `${ENDPOINTS.ASSIGNMENT.BASE}${id?.id || id}/deactivate/`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => {
        const targetId = id?.id || id;
        return [
          getItemTag(TAGS.ASSIGNMENT, targetId),
          getListTag(TAGS.ASSIGNMENT),
        ];
      },
    }),

    /**
     * POST /attendance/assignments/:id/transfer/
     * Transfers an assignment to a different shift or member.
     */
    transferAssignment: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `${ENDPOINTS.ASSIGNMENT.BASE}${id}/transfer/`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        getItemTag(TAGS.ASSIGNMENT, id),
        getListTag(TAGS.ASSIGNMENT),
      ],
    }),

    /**
     * POST /attendance/assignments/bulk-assign/
     * Bulk creates shift assignments for multiple members.
     */
    bulkAssign: builder.mutation({
      query: (body) => ({
        url: ENDPOINTS.ASSIGNMENT.BULK_ASSIGN,
        method: "POST",
        body,
      }),
      invalidatesTags: [getListTag(TAGS.ASSIGNMENT)],
    }),
  }),
});

// ═════════════════════════════════════════════════════════════════════════════
// AUTO-GENERATED HOOK EXPORTS
// ═════════════════════════════════════════════════════════════════════════════

export const {
  // Working Schedules
  useGetCompanyScheduleQuery,
  useCreateCompanyScheduleMutation,
  useUpdateCompanyScheduleMutation,
  useToggleCompanyScheduleMutation,

  // Attendance Policies
  useGetAttendancePolicyQuery,
  useUpdateAttendancePolicyMutation,
  useResetAttendancePolicyMutation,

  // Holidays
  useGetHolidaysQuery,
  useGetHolidayQuery,
  useCreateHolidayMutation,
  useUpdateHolidayMutation,
  useDeleteHolidayMutation,
  useImportHolidaysMutation,
  usePreviewHolidayImportMutation,

  // Shift Templates
  useGetShiftsQuery,
  useGetShiftQuery,
  useCreateShiftMutation,
  useUpdateShiftMutation,
  useDeleteShiftMutation,
  useActivateShiftMutation,
  useSetDefaultShiftMutation,

  // Shift Assignments
  useGetAssignmentsQuery,
  useGetAssignmentQuery,
  useCreateAssignmentMutation,
  useUpdateAssignmentMutation,
  useEndAssignmentMutation,
  useDeactivateAssignmentMutation,
  useTransferAssignmentMutation,
  useBulkAssignMutation,
} = attendanceSetupApi;