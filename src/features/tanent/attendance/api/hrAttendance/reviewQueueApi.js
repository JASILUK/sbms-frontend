import { baseApi } from "../../../../../services/baseApi"; // Absolute context mapping fallback

export const reviewQueueApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getReviewQueueDashboard: builder.query({
      query: () => ({
        url: '/attendance/v1/hr/review/dashboard/',
        method: 'GET',
      }),
      providesTags: ['HR_Review_Dashboard'],
    }),
    getReviewQueueList: builder.query({
      query: (params) => ({
        url: '/attendance/v1/hr/review/',
        method: 'GET',
        params,
      }),
      providesTags: ['HR_Review_Queue'],
    }),
    assignReviewer: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/attendance/v1/hr/review/${id}/assign/`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['HR_Review_Queue'],
    }),
    resolveReviewItem: builder.mutation({
      query: ({ id, action, ...body }) => ({
        url: `/attendance/v1/hr/review/${id}/${action}/`, // action options: resolve, reject, escalate
        method: 'POST',
        body,
      }),
      invalidatesTags: ['HR_Review_Queue', 'HR_Review_Dashboard'],
    }),
    appendReviewNote: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/attendance/v1/hr/review/${id}/note/`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'HR_Record_Detail', id }],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetReviewQueueDashboardQuery,
  useGetReviewQueueListQuery,
  useAssignReviewerMutation,
  useResolveReviewItemMutation,
  useAppendReviewNoteMutation,
} = reviewQueueApi;