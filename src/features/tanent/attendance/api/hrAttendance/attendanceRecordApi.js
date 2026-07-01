import { baseApi } from "../../../../../services/baseApi"; // Absolute context mapping fallback

export const attendanceRecordApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAttendanceRecordDetail: builder.query({
      query: (recordId) => ({
        url: `/attendance/v1/hr/records/${recordId}/`,
        method: 'GET',
      }),
      providesTags: (result, error, recordId) => [{ type: 'HR_Record_Detail', id: recordId }],
    }),
    getAttendanceRecordTimeline: builder.query({
      query: (recordId) => ({
        url: `/attendance/v1/hr/records/${recordId}/timeline/`,
        method: 'GET',
      }),
      providesTags: (result, error, recordId) => [{ type: 'HR_Record_Timeline', id: recordId }],
    }),
    getAttendanceRecordAuditHistory: builder.query({
      query: (recordId) => ({
        url: `/attendance/v1/hr/records/${recordId}/audit-history/`,
        method: 'GET',
      }),
      providesTags: (result, error, recordId) => [{ type: 'HR_Record_Audit', id: recordId }],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetAttendanceRecordDetailQuery,
  useGetAttendanceRecordTimelineQuery,
  useGetAttendanceRecordAuditHistoryQuery,
} = attendanceRecordApi;