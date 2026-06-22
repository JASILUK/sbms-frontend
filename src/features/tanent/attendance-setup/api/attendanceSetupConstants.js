/**
 * Attendance Setup — Endpoint Constants
 * Centralized endpoint path definitions to eliminate hardcoded strings.
 * All paths are relative to the base API URL injected via baseApi.
 */

export const ATTENDANCE_ENDPOINTS = {
  // ─── Working Schedules ─────────────────────────────────────────────
  SCHEDULE: {
    BASE: "attendance/v1/schedule/",
    DETAIL: "attendance/v1/schedule/detail/",
    ACTIVATION: "attendance/v1/schedule/activation/",
  },

  // ─── Attendance Policies ───────────────────────────────────────────
  POLICY: {
    BASE: "attendance/v1/policy/",
    UPDATE: "attendance/v1/policy/update/",
    RESET: "attendance/v1/policy/reset/",
  },

  // ─── Holidays ──────────────────────────────────────────────────────
  HOLIDAY: {
    BASE: "attendance/v1/holidays/",
    IMPORT: "attendance/v1/holidays/import/",
    IMPORT_PREVIEW: "attendance/v1/holidays/import/preview/",
  },

  // ─── Shift Templates ───────────────────────────────────────────────
  SHIFT: {
    BASE: "attendance/v1/shifts/",
  },

  // ─── Shift Assignments ─────────────────────────────────────────────
  ASSIGNMENT: {
    BASE: "attendance/v1/assignments/",
    BULK_ASSIGN: "attendance/v1/assignments/bulk-assign/",
  },
};

/**
 * Query parameter keys used across attendance setup endpoints.
 * Centralized to prevent typos and support future refactoring.
 */
export const ATTENDANCE_QUERY_KEYS = {
  HOLIDAY: {
    HOLIDAY_TYPE: "holiday_type",
    YEAR: "year",
    MONTH: "month",
    UPCOMING: "upcoming",
  },
  SHIFT: {
    IS_ACTIVE: "is_active",
    SHIFT_TYPE: "shift_type",
    SEARCH: "search",
    ORDERING: "ordering",
  },
  ASSIGNMENT: {
    MEMBERSHIP_ID: "membership_id",
    SHIFT_ID: "shift_id",
    ACTIVE_ONLY: "active_only",
    ORDERING: "ordering",
  },
};