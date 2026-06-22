/**
 * Attendance Setup — Cache Tag Definitions
 * Centralized RTK Query cache tags for consistent invalidation strategies.
 *
 * Usage:
 *   providesTags: [ATTENDANCE_SETUP_TAGS.SCHEDULE]
 *   invalidatesTags: [{ type: ATTENDANCE_SETUP_TAGS.HOLIDAY, id: "LIST" }]
 */

export const ATTENDANCE_SETUP_TAGS = {
  SCHEDULE: "SCHEDULE",
  POLICY: "POLICY",
  HOLIDAY: "HOLIDAY",
  SHIFT: "SHIFT",
  ASSIGNMENT: "ASSIGNMENT",
};

/**
 * Helper to generate LIST tag objects for collection endpoints.
 * Supports the standard RTK Query LIST invalidation pattern.
 *
 * @param {string} tag - One of ATTENDANCE_SETUP_TAGS values
 * @returns {{ type: string, id: string }} LIST tag descriptor
 */
export const getListTag = (tag) => ({
  type: tag,
  id: "LIST",
});

/**
 * Helper to generate ITEM tag objects for individual resource endpoints.
 * Enables granular cache invalidation when a single item changes.
 *
 * @param {string} tag - One of ATTENDANCE_SETUP_TAGS values
 * @param {string|number} id - Resource identifier
 * @returns {{ type: string, id: string|number }} ITEM tag descriptor
 */
export const getItemTag = (tag, id) => ({
  type: tag,
  id,
});