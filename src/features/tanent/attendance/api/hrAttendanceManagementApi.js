import { baseApi } from "../../../../services/baseApi"; // Adjusted relative lookup depth to fit your feature root

const ENDPOINTS = {
  DASHBOARD_SUMMARY: "/attendance/v1/attendance-management/dashboard-summary/",
  COMPANY_LEDGER: "/attendance/v1/attendance-management/company-ledger/",
  OVERRIDE_PUNCH: "/attendance/v1/attendance-management/override-punch/",
  RECORD_DETAIL: (id) => `/attendance/v1/attendance-management/records/${id}/`,
  RECORD_ACTION: (id) => `/attendance/v1/attendance-management/records/${id}/action/`,
};

export const hrAttendanceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // =====================================================
    // 1. DASHBOARD SUMMARY (QUERY)
    // =====================================================
    getHRDashboardSummary: builder.query({
      query: (params = {}) => ({
        url: ENDPOINTS.DASHBOARD_SUMMARY,
        method: "GET",
        params,
      }),
      providesTags: ["HRDashboardSummary"],
    }),

    // =====================================================
    // 2. COMPANY-WIDE ATTENDANCE LEDGER (QUERY)
    // params: date_from, date_to, status, membership, department, search, limit, offset
    // =====================================================
    getHRCompanyLedger: builder.query({
      query: (params = {}) => ({
        url: ENDPOINTS.COMPANY_LEDGER,
        method: "GET",
        params,
      }),
      providesTags: (result) => {
        const list = Array.isArray(result?.results) ? result.results : [];
        return [
          "HRLedger",
          ...list.map((item) => ({ type: "HRLedgerItem", id: item.id })),
        ];
      },
    }),

    // =====================================================
    // 3. MANUAL CORRECTION / OVERRIDE PUNCH (MUTATION)
    // =====================================================
    overrideHRPunch: builder.mutation({
      query: (body) => ({
        url: ENDPOINTS.OVERRIDE_PUNCH,
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, arg) => [
        "HRLedger",
        "HRDashboardSummary",
        arg?.membership ? { type: "HRRecordDetail", id: arg.membership } : "HRRecordDetail",
      ],
    }),

    // =====================================================
    // 4. SINGLE RECORD DETAIL + TIMELINE (QUERY)
    // returns { daily_record, timeline }
    // =====================================================
    getHRRecordDetail: builder.query({
      query: (id) => ({
        url: ENDPOINTS.RECORD_DETAIL(id),
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "HRRecordDetail", id }],
    }),

    // =====================================================
    // 5. RECORD ACTIONS — finalize / unlock / reprocess (MUTATION)
    // =====================================================
    runHRRecordAction: builder.mutation({
      query: ({ id, action }) => ({
        url: ENDPOINTS.RECORD_ACTION(id),
        method: "POST",
        body: { action },
      }),
      // Optimistic update on the record's status while the request is in flight
      async onQueryStarted({ id, action }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          hrAttendanceApi.util.updateQueryData("getHRRecordDetail", id, (draft) => {
            if (!draft?.daily_record) return;
            if (action === "finalize") draft.daily_record.attendance_status = "FINALIZED";
            if (action === "unlock") draft.daily_record.attendance_status = "UNLOCKED";
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: (result, error, { id }) => [
        { type: "HRRecordDetail", id },
        "HRLedger",
        "HRDashboardSummary",
      ],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetHRDashboardSummaryQuery,
  useGetHRCompanyLedgerQuery,
  useOverrideHRPunchMutation,
  useGetHRRecordDetailQuery,
  useRunHRRecordActionMutation,
} = hrAttendanceApi;
