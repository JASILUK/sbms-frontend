//  attendance/api/hrAttendance/liveWorkforceApi.js

import { baseApi } from "../../../../../services/baseApi";

export const liveWorkforceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Live Workforce operational endpoint.
     * Returns summary, filter metadata, paginated workforce rows, and pagination info.
     */
    getLiveWorkforce: builder.query({
      query: (params) => ({
        url: '/attendance/v1/hr/live-workforce/',
        method: 'GET',
        params,
      }),
      providesTags: (result, error, params) => [
        { type: 'LiveWorkforce', id: `${params?.date || 'TODAY'}-${params?.status || 'ALL'}` },
      ],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetLiveWorkforceQuery,
} = liveWorkforceApi;