import { baseApi } from "../../../../services/baseApi";

export const attendanceDashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAttendanceDashboard: builder.query({
      query: () => ({
        url: '/attendance/v1/dashboard/',
        method: 'GET',
      }),
      providesTags: (result) => 
        result 
          ? [{ type: 'AttendanceDashboard', id: 'LATEST' }] 
          : [{ type: 'AttendanceDashboard', id: 'LATEST' }],
      keepUnusedDataFor: 60,
    }),
  }),
  overrideExisting: false,
});

export const { useGetAttendanceDashboardQuery } = attendanceDashboardApi;