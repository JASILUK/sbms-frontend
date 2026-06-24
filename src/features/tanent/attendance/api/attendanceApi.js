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
      query: () => ({
        url: "/attendance/v1/my-attendance/summary/",
        method: "GET",
      }),
      providesTags: ["MyAttendanceSummary"],
    }),

    getMyAttendanceTrends: builder.query({
      query: (params) => ({
        url: "/attendance/v1/my-attendance/trends/",
        method: "GET",
        params,
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
  overrideExisting: true, // Swapped to true to safely update registration entries within the shared file runtime
});

// Clean corporate unified structural hooks export block
export const {
  // Operational Punch Mutations Hooks
  useVerifyGPSMutation,
  useVerifyFaceMutation,
  useCheckInMutation,
  useCheckOutMutation,
  useBreakOutMutation,
  useBreakInMutation,
  
  // Historical Analytics Dashboard Queries Hooks
  useGetMyAttendanceQuery,
  useGetMyAttendanceSummaryQuery,
  useGetMyAttendanceTrendsQuery,
  useGetMyAttendanceCalendarQuery,
  useGetMyAttendanceDetailQuery,
} = attendanceApi;