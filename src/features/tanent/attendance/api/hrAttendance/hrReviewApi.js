import { baseApi } from "../../../../../services/baseApi";

export const hrReviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getReviewDashboard: builder.query({
      query: () => ({
        url: "/attendance/v1/hr/reviews/dashboard/",
        method: "GET",
      }),
      providesTags: ["AttendanceReviewDashboard"],
    }),
    getReviewQueue: builder.query({
      query: (params) => ({
        url: "/attendance/v1/hr/reviews/",
        method: "GET",
        params,
      }),
      providesTags: (result) =>
        result?.data?.results
          ? [
              ...result.data.results.map(({ id }) => ({ type: "AttendanceReviewQueue", id })),
              { type: "AttendanceReviewQueue", id: "LIST" },
            ]
          : [{ type: "AttendanceReviewQueue", id: "LIST" }],
    }),
    resolveReview: builder.mutation({
      query: ({ recordId, reason }) => ({
        url: `/attendance/v1/hr/reviews/${recordId}/resolve/`,
        method: "POST",
        body: { reason },
      }),
      invalidatesTags: (result, error, { recordId }) => [
        { type: "AttendanceReviewQueue", id: recordId },
        { type: "AttendanceReviewQueue", id: "LIST" },
        { type: "AttendanceReviewDashboard" },
        { type: "HR_Record_Detail", id: recordId }
      ],
    }),
    addReviewNote: builder.mutation({
      query: ({ recordId, reason }) => ({
        url: `/attendance/v1/hr/reviews/${recordId}/note/`,
        method: "POST",
        body: { reason },
      }),
      invalidatesTags: (result, error, { recordId }) => [
        { type: "AttendanceReviewQueue", id: recordId },
        { type: "HR_Record_Detail", id: recordId }
      ],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetReviewDashboardQuery,
  useGetReviewQueueQuery,
  useResolveReviewMutation,
  useAddReviewNoteMutation,
} = hrReviewApi;