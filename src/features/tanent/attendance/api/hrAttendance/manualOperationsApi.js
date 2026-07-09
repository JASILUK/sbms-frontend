import { baseApi } from "../../../../../services/baseApi";

export const manualOperationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * POST hr-management/records/{record_id}/actions/check-in/
     */
    manualCheckIn: builder.mutation({
      query: ({ recordId, ...body }) => ({
        url: `/attendance/v1/hr-management/records/${recordId}/actions/check-in/`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { recordId }) => [
        { type: "HR_Record_Detail", id: recordId },
        { type: "HR_Dashboard" },
        { type: "HR_Employee_Profile" }
      ],
    }),

    /**
     * POST hr-management/records/{record_id}/actions/check-out/
     */
    manualCheckOut: builder.mutation({
      query: ({ recordId, ...body }) => ({
        url: `/attendance/v1/hr-management/records/${recordId}/actions/check-out/`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { recordId }) => [
        { type: "HR_Record_Detail", id: recordId },
        { type: "HR_Dashboard" },
        { type: "HR_Employee_Profile" }
      ],
    }),

    /**
     * POST hr-management/records/{record_id}/actions/break-start/
     */
    manualBreakStart: builder.mutation({
      query: ({ recordId, ...body }) => ({
        url: `/attendance/v1/hr-management/records/${recordId}/actions/break-start/`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { recordId }) => [
        { type: "HR_Record_Detail", id: recordId },
        { type: "HR_Dashboard" },
        { type: "HR_Employee_Profile" }
      ],
    }),

    /**
     * POST hr-management/records/{record_id}/actions/break-end/
     */
    manualBreakEnd: builder.mutation({
      query: ({ recordId, ...body }) => ({
        url: `/attendance/v1/hr-management/records/${recordId}/actions/break-end/`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { recordId }) => [
        { type: "HR_Record_Detail", id: recordId },
        { type: "HR_Dashboard" },
        { type: "HR_Employee_Profile" }
      ],
    }),

    /**
     * POST hr-management/corrections/manual-punch/
     */
    advancedManualPunch: builder.mutation({
      query: (body) => ({
        url: "/attendance/v1/hr-management/corrections/manual-punch/",
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { record_id }) => [
        { type: "HR_Record_Detail", id: record_id },
        { type: "HR_Dashboard" },
        { type: "HR_Employee_Profile" }
      ],
    }),
  }),
  overrideExisting: true,
});

export const {
  useManualCheckInMutation,
  useManualCheckOutMutation,
  useManualBreakStartMutation,
  useManualBreakEndMutation,
  useAdvancedManualPunchMutation,
} = manualOperationsApi;