import { baseApi } from "../../../../services/baseApi";

export const leaveApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    getMyLeaveBalances: builder.query({
      query: (params) => ({
        url: "/attendance/v1/me/leave-balances/",
        method: "GET",
        params,
      }),
      providesTags: ["MyLeaveBalances"],
    }),

    getMyLeaveRequests: builder.query({
      query: (params) => ({
        url: "/attendance/v1/me/leave-requests/",
        method: "GET",
        params,
      }),
      providesTags: ["MyLeaveRequests"],
    }),

    createLeaveRequest: builder.mutation({
      query: (body) => ({
        url: "/attendance/v1/me/leave-requests/",
        method: "POST",
        body, // Form-data object compiled inside hook pipeline for attachments
      }),
      invalidatesTags: ["MyLeaveRequests", "MyLeaveBalances", "HRLeaveRequests"],
    }),

    getMyLeaveRequestDetail: builder.query({
      query: (requestId) => ({
        url: `/attendance/v1/me/leave-requests/${requestId}/`,
        method: "GET",
      }),
      providesTags: (result, error, requestId) => [{ type: "MyLeaveRequestDetail", id: requestId }],
    }),

    cancelLeaveRequest: builder.mutation({
    query: ({ requestId, body }) => ({
        //  FIXED: Removed the trailing ",
        url: `/attendance/v1/me/leave-requests/${requestId}/cancel/`,
        method: "POST",
        body,
    }),
    invalidatesTags: ["MyLeaveRequests", "MyLeaveBalances", "HRLeaveRequests"],
    }),

    // =====================================================
    // 5. HR ADMINISTRATIVE LEAVE REQUEST MANAGEMENT
    // =====================================================
    getHRLeaveRequests: builder.query({
      query: (params) => ({
        url: "/attendance/v1/leave-requests/",
        method: "GET",
        params,
      }),
      providesTags: ["HRLeaveRequests"],
    }),

    getHRLeaveRequestDetail: builder.query({
      query: (requestId) => ({
        url: `/attendance/v1/leave-requests/${requestId}/`,
        method: "GET",
      }),
      providesTags: (result, error, requestId) => [{ type: "HRLeaveRequestDetail", id: requestId }],
    }),

    approveLeaveRequest: builder.mutation({
      query: (requestId) => ({
        url: `/attendance/v1/leave-requests/${requestId}/approve/`,
        method: "POST",
      }),
      invalidatesTags: ["HRLeaveRequests", "MyLeaveRequests", "MyLeaveBalances"],
    }),

    rejectLeaveRequest: builder.mutation({
      query: ({ requestId, body }) => ({
        url: `/attendance/v1/leave-requests/${requestId}/reject/`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["HRLeaveRequests", "MyLeaveRequests", "MyLeaveBalances"],
    }),

    hrCancelLeaveRequest: builder.mutation({
      query: ({ requestId, body }) => ({
        url: `/attendance/v1/leave-requests/${requestId}/cancel/`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["HRLeaveRequests", "MyLeaveRequests", "MyLeaveBalances"],
    }),

    // =====================================================
    // 6. EMPLOYEE PROFILE MANAGEMENT LOOKUPS (HR VIEW)
    // =====================================================
    getEmployeeLeaveBalances: builder.query({
      query: ({ membershipId, year }) => ({
        url: `/attendance/v1/employees/${membershipId}/leave-balances/`,
        method: "GET",
        params: { year },
      }),
      providesTags: ["EmployeeLeaveBalances"],
    }),

    getEmployeeLeaveRequests: builder.query({
      query: ({ membershipId, params }) => ({
        url: `/attendance/v1/employees/${membershipId}/leave-requests/`,
        method: "GET",
        params,
      }),
      providesTags: ["EmployeeLeaveRequests"],
    }),

    // =====================================================
    // 7. LEAVE TYPE CONFIGURATION RULES MANAGEMENT
    // =====================================================
    getLeaveTypes: builder.query({
      query: (params) => ({
        url: "/attendance/v1/leave-types/",
        method: "GET",
        params,
      }),
      providesTags: ["LeaveTypes"],
    }),

    createLeaveType: builder.mutation({
      query: (body) => ({
        url: "/attendance/v1/leave-types/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["LeaveTypes"],
    }),

    updateLeaveType: builder.mutation({
      query: ({ leaveTypeId, body }) => ({
        url: `/attendance/v1/leave-types/${leaveTypeId}/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["LeaveTypes"],
    }),

    deactivateLeaveType: builder.mutation({
      query: (leaveTypeId) => ({
        url: `/attendance/v1/leave-types/${leaveTypeId}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["LeaveTypes"],
    }),

    // =====================================================
    // 8. LEAVE BALANCE LEDGER ADMINISTRATION
    // =====================================================
    getLeaveBalancesLedger: builder.query({
      query: (params) => ({
        url: "/attendance/v1/leave-balances/",
        method: "GET",
        params,
      }),
      providesTags: ["LeaveBalances"],
    }),

    adjustLeaveBalance: builder.mutation({
      query: ({ balanceId, body }) => ({
        url: `/attendance/v1/leave-balances/${balanceId}/adjust/`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["LeaveBalances", "MyLeaveBalances", "EmployeeLeaveBalances"],
    }),

    allocateLeaveBalancesBulk: builder.mutation({
      query: (body) => ({
        url: "/attendance/v1/leave-balances/allocate/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["LeaveBalances", "MyLeaveBalances", "EmployeeLeaveBalances"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetMyLeaveBalancesQuery,
  useGetMyLeaveRequestsQuery,
  useCreateLeaveRequestMutation,
  useGetMyLeaveRequestDetailQuery,
  useCancelLeaveRequestMutation,
  useGetHRLeaveRequestsQuery,
  useGetHRLeaveRequestDetailQuery,
  useApproveLeaveRequestMutation,
  useRejectLeaveRequestMutation,
  useHrCancelLeaveRequestMutation,
  useGetEmployeeLeaveBalancesQuery,
  useGetEmployeeLeaveRequestsQuery,
  useGetLeaveTypesQuery,
  useCreateLeaveTypeMutation,
  useUpdateLeaveTypeMutation,
  useDeactivateLeaveTypeMutation,
  useGetLeaveBalancesLedgerQuery,
  useAdjustLeaveBalanceMutation,
  useAllocateLeaveBalancesBulkMutation,
} = leaveApi;