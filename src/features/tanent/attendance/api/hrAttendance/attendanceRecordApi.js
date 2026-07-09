import { baseApi } from "../../../../../services/baseApi";

export const attendanceRecordApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getComprehensiveRecordGraph: builder.query({
      query: (recordId) => ({
        url: `/attendance/v1/hr-management/records/${recordId}/`,
        method: "GET",
      }),
      providesTags: (result, error, recordId) => [
        { type: "HR_Record_Detail", id: recordId },
      ],
    }),
    
    finalizeRecord: builder.mutation({
      query: ({ recordId, reason }) => ({
        url: `/attendance/v1/hr-management/records/${recordId}/actions/finalize/`,
        method: "POST",
        body: { reason },
      }),
      invalidatesTags: (result, error, { recordId }) => [{ type: "HR_Record_Detail", id: recordId }],
    }),

    unlockRecord: builder.mutation({
      query: ({ recordId, reason }) => ({
        url: `/attendance/v1/hr-management/records/${recordId}/actions/unlock/`,
        method: "POST",
        body: { reason },
      }),
      invalidatesTags: (result, error, { recordId }) => [{ type: "HR_Record_Detail", id: recordId }],
    }),

    reprocessTimeline: builder.mutation({
      query: ({ recordId, reason }) => ({
        url: `/attendance/v1/hr-management/records/${recordId}/actions/reprocess/`,
        method: "POST",
        body: { reason },
      }),
      invalidatesTags: (result, error, { recordId }) => [{ type: "HR_Record_Detail", id: recordId }],
    }),

    recalculateAttendance: builder.mutation({
      query: ({ recordId, reason }) => ({
        url: `/attendance/v1/hr-management/records/${recordId}/actions/recalculate/`,
        method: "POST",
        body: { reason },
      }),
      invalidatesTags: (result, error, { recordId }) => [{ type: "HR_Record_Detail", id: recordId }],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetComprehensiveRecordGraphQuery,
  useFinalizeRecordMutation,
  useUnlockRecordMutation,
  useReprocessTimelineMutation,
  useRecalculateAttendanceMutation,
} = attendanceRecordApi;