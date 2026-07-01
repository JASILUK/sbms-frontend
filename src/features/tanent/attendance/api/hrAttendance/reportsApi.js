import { baseApi } from "../../../../../services/baseApi"; // Absolute context mapping fallback

export const reportsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCompanyReportSummary: builder.query({
      query: (params) => ({
        url: '/attendance/v1/hr/reports/company/',
        method: 'GET',
        params,
      }),
      providesTags: ['HR_Reports'],
    }),
    getPayrollAttendanceDataset: builder.query({
      query: (params) => ({
        url: '/attendance/v1/hr/reports/payroll/',
        method: 'GET',
        params,
      }),
      providesTags: ['HR_Reports_Payroll'],
    }),
    getReportAnalyticsTrends: builder.query({
      query: (params) => ({
        url: '/attendance/v1/hr/reports/analytics/',
        method: 'GET',
        params,
      }),
      providesTags: ['HR_Reports_Analytics'],
    }),
    triggerAsyncReportExport: builder.mutation({
      query: (body) => ({
        url: '/attendance/v1/hr/reports/export/',
        method: 'POST',
        body,
      }),
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetCompanyReportSummaryQuery,
  useGetPayrollAttendanceDatasetQuery,
  useGetReportAnalyticsTrendsQuery,
  useTriggerAsyncReportExportMutation,
} = reportsApi;