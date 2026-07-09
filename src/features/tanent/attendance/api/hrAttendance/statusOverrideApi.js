import { baseApi } from "../../../../../services/baseApi";

export const statusOverrideApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * POST /attendance/v1/hr-management/records/{record_id}/actions/override-status/
     */
    overrideStatus: builder.mutation({
      query: ({ recordId, ...body }) => ({
        url: `/attendance/v1/hr-management/records/${recordId}/actions/override-status/`,
        method: "POST",
        body, // payload: { status, reason }
      }),
      invalidatesTags: (result, error, { recordId }) => [
        { type: "HR_Record_Detail", id: recordId },
        { type: "HR_Dashboard" },
        { type: "HR_Employee_Profile" },
        { type: "HR_Employee_Directory" }
      ],
    }),

    /**
     * POST /attendance/v1/hr-management/records/{record_id}/actions/mark-review/
     */
    markReview: builder.mutation({
      query: ({ recordId, ...body }) => ({
        url: `/attendance/v1/hr-management/records/${recordId}/actions/mark-review/`,
        method: "POST",
        body, // payload: { reason }
      }),
      invalidatesTags: (result, error, { recordId }) => [
        { type: "HR_Record_Detail", id: recordId },
        { type: "HR_Dashboard" },
        { type: "HR_Employee_Profile" }
      ],
    }),

    /**
     * POST /attendance/v1/hr-management/records/{record_id}/actions/clear-review/
     */
    clearReview: builder.mutation({
      query: ({ recordId, ...body }) => ({
        url: `/attendance/v1/hr-management/records/${recordId}/actions/clear-review/`,
        method: "POST",
        body, // payload: { reason }
      }),
      invalidatesTags: (result, error, { recordId }) => [
        { type: "HR_Record_Detail", id: recordId },
        { type: "HR_Dashboard" },
        { type: "HR_Employee_Profile" }
      ],
    }),
  }),
  overrideExisting: true,
});

export const {
  useOverrideStatusMutation,
  useMarkReviewMutation,
  useClearReviewMutation,
} = statusOverrideApi;