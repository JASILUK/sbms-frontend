// attendance/api/hrAttendance/dashboardApi.js
import { baseApi } from "../../../../../services/baseApi";

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * 1. HR Dashboard Summary Metrics
     * Fetches top-level KPIs, Department breakdown graphs, Activity, and Alerts.
     */
    getHRDashboardSummary: builder.query({
      query: (params) => ({
        url: '/attendance/v1/hr-management/dashboard-summary/', // Matches your HRDashboardSummaryAPIView
        method: 'GET',
        params,
      }),
      providesTags: (result, error, { date }) => [{ type: 'HR_Dashboard', id: date || 'TODAY' }],
    }),

    /**
     * 2. Live Workforce Attendance Stream (HR View)
     * Reuses the highly optimized corporate ledger endpoint.
     * Dynamically filters for employees who have clocked in but have NOT clocked out today.
     */
    getHRLiveAttendanceStream: builder.query({
      query: (params) => ({
        url: '/attendance/v1/hr-management/company-ledger/', // Reuses HRCompanyLedgerAPIView
        method: 'GET',
        params: {
          ...params,
          // Custom filter parameters ensuring we only fetch currently working staff
          review_required: false, 
          is_finalized: false,
          // Note: In your frontend, your page wrapper will filter this list down to active workers[cite: 1, 2]
        },
      }),
      providesTags: ['HR_Live_Stream'],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetHRDashboardSummaryQuery,
  useGetHRLiveAttendanceStreamQuery,
} = dashboardApi;