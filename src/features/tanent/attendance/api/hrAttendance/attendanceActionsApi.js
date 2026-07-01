import { baseApi } from "../../../../../services/baseApi"; // Absolute context mapping fallback

export const attendanceActionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    injectManualPunch: builder.mutation({
      query: (body) => ({
        url: '/attendance/v1/hr/actions/inject-punch/',
        method: 'POST',
        body,
      }),
      invalidatesTags: (result, error, { membership_id }) => [
        { type: 'HR_Employee_Row', id: membership_id },
        { type: 'HR_Dashboard', id: 'TODAY' },
        { type: 'HR_Live_Stream' },
      ],
    }),
    finalizeRecord: builder.mutation({
      query: ({ recordId, ...body }) => ({
        url: `/attendance/v1/hr/actions/records/${recordId}/finalize/`,
        method: 'POST',
        body,
      }),
      async onQueryStarted({ recordId }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          baseApi.util.updateQueryData('getAttendanceRecordDetail', recordId, (draft) => {
            if (draft?.data?.header) {
              draft.data.header.finalized_at = new Date().toISOString();
            }
          })
        );
        try { await queryFulfilled; } catch { patchResult.undo(); }
      },
      invalidatesTags: (result, error, { recordId }) => [
        { type: 'HR_Record_Detail', id: recordId },
        { type: 'HR_Employee_Directory', id: 'LIST' },
      ],
    }),
    unlockRecord: builder.mutation({
      query: ({ recordId, ...body }) => ({
        url: `/attendance/v1/hr/actions/records/${recordId}/unlock/`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (result, error, { recordId }) => [
        { type: 'HR_Record_Detail', id: recordId },
        { type: 'HR_Employee_Directory', id: 'LIST' },
      ],
    }),
    reprocessTimeline: builder.mutation({
      query: ({ recordId }) => ({
        url: `/attendance/v1/hr/actions/records/${recordId}/reprocess/`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, { recordId }) => [
        { type: 'HR_Record_Detail', id: recordId },
        { type: 'HR_Record_Timeline', id: recordId },
      ],
    }),
  }),
  overrideExisting: true,
});

export const {
  useInjectManualPunchMutation,
  useFinalizeRecordMutation,
  useUnlockRecordMutation,
  useReprocessTimelineMutation,
} = attendanceActionsApi;