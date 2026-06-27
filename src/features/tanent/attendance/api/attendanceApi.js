import { baseApi } from "../../../../services/baseApi"; // Adjusted relative lookup depth to fit your feature root

export const attendanceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // =====================================================
    // 1. BIOMETRIC & GEOMETRIC VERIFICATIONS (MUTATIONS)
    // =====================================================
    verifyGPS: builder.mutation({
      query: (body) => ({
        url: "/attendance/v1/verify/gps/",
        method: "POST",
        body,
      }),
    }),

    verifyFace: builder.mutation({
      query: (body) => ({
        url: "/attendance/v1/verify/face/",
        method: "POST",
        body,
      }),
    }),

    // =====================================================
    // 2. REAL-TIME TRACKING PUNCHES (MUTATIONS)
    // =====================================================
    checkIn: builder.mutation({
      query: (body) => ({
        url: "/attendance/v1/punch/check-in/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["AttendanceDashboard", "MyAttendanceList", "MyAttendanceSummary", "MyAttendanceCalendar"],
    }),

    checkOut: builder.mutation({
      query: (body) => ({
        url: "/attendance/v1/punch/check-out/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["AttendanceDashboard", "MyAttendanceList", "MyAttendanceSummary", "MyAttendanceCalendar"],
    }),

    breakOut: builder.mutation({
      query: (body) => ({
        url: "/attendance/v1/punch/break-out/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["AttendanceDashboard", "MyAttendanceList", "MyAttendanceSummary", "MyAttendanceCalendar"],
    }),

    breakIn: builder.mutation({
      query: (body) => ({
        url: "/attendance/v1/punch/break-in/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["AttendanceDashboard", "MyAttendanceList", "MyAttendanceSummary", "MyAttendanceCalendar"],
    }),

   // =====================================================
    // 3. EMPLOYEE PORTAL ATTENDANCE HISTORY (QUERIES)
    // =====================================================
    getMyAttendance: builder.query({
      query: (params) => ({
        url: "/attendance/v1/my-attendance/",
        method: "GET",
        params,
      }),
      providesTags: ["MyAttendanceList"],
    }),

    getMyAttendanceSummary: builder.query({
      query: (params = {}) => ({
        url: "/attendance/v1/my-attendance/summary/",
        method: "GET",
        params,
      }),
      // ← FIXED: Add forceRefetch to always refetch when params change
      forceRefetch({ currentArg, previousArg }) {
        return JSON.stringify(currentArg) !== JSON.stringify(previousArg);
      },
      providesTags: ["MyAttendanceSummary"],
    }),

    getMyAttendanceTrends: builder.query({
      query: ({ year, limit, offset }) => ({
        url: "/attendance/v1/my-attendance/trends/",
        params: { year, ...(limit && { limit }), ...(offset && { offset }) },
      }),
      providesTags: ["MyAttendanceTrends"],
    }),

    getMyAttendanceCalendar: builder.query({
      query: (params) => ({
        url: "/attendance/v1/my-attendance/calendar/",
        method: "GET",
        params,
      }),
      providesTags: ["MyAttendanceCalendar"],
    }),

    getMyAttendanceDetail: builder.query({
      query: (recordId) => ({
        url: `/attendance/v1/my-attendance/${recordId}/`,
        method: "GET",
      }),
      providesTags: (result, error, recordId) => [{ type: "MyAttendanceDetail", id: recordId }],
    }),
  }),
  overrideExisting: true,
});

export const {
  useVerifyGPSMutation,
  useVerifyFaceMutation,
  useCheckInMutation,
  useCheckOutMutation,
  useBreakOutMutation,
  useBreakInMutation,
  useGetMyAttendanceQuery,
  useGetMyAttendanceSummaryQuery,
  useGetMyAttendanceTrendsQuery,
  useGetMyAttendanceCalendarQuery,
  useGetMyAttendanceDetailQuery,
} = attendanceApi;