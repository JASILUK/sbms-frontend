import { baseApi } from "../../../../services/baseApi"; // Adjust import based on your real global core base path

export const faceManagementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFaceEnrollments: builder.query({
      query: (params) => ({
        url: '/attendance/v1/face-enrollments/',
        method: 'GET',
        params // Passes status, membership, source filters transparently
      }),
      providesTags: (result) =>
        result && Array.isArray(result.data)
          ? [
              ...result.data.map(({ id }) => ({ type: 'FACE_ENROLLMENTS', id })),
              { type: 'FACE_ENROLLMENTS', id: 'LIST' }
            ]
          : [{ type: 'FACE_ENROLLMENTS', id: 'LIST' }]
    }),
    getFaceEnrollmentDetail: builder.query({
      query: (id) => ({
        url: `/attendance/v1/face-enrollments/${id}/`,
        method: 'GET'
      }),
      providesTags: (result, error, id) => [{ type: 'FACE_ENROLLMENT_DETAIL', id }]
    }),
    approveFaceEnrollment: builder.mutation({
      query: (id) => ({
        url: `/attendance/v1/face-enrollments/${id}/approve/`,
        method: 'POST'
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'FACE_ENROLLMENTS', id: 'LIST' },
        { type: 'FACE_ENROLLMENT_DETAIL', id }
      ]
    }),
    rejectFaceEnrollment: builder.mutation({
      query: ({ id, reason }) => ({
        url: `/attendance/v1/face-enrollments/${id}/reject/`,
        method: 'POST',
        data: { reason }
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'FACE_ENROLLMENTS', id: 'LIST' },
        { type: 'FACE_ENROLLMENT_DETAIL', id }
      ]
    }),
    revokeFaceEnrollment: builder.mutation({
    query: ({ id, reason }) => ({
        url: `/attendance/v1/face-enrollments/${id}/revoke/`,
        method: 'POST',
        // ✅ FIXED: Pass the body payload object directly to "data" parameter mapping context
        data: { reason: reason } 
    }),
    invalidatesTags: (result, error, { id }) => [
        { type: 'FACE_ENROLLMENTS', id: 'LIST' },
        { type: 'FACE_ENROLLMENT_DETAIL', id }
    ]
    }),
    hrEnrollEmployee: builder.mutation({
      query: (payload) => ({
        url: '/attendance/v1/face-enrollments/hr/',
        method: 'POST',
        data: payload // payload: { membership_id, embedding }
      }),
      invalidatesTags: [{ type: 'FACE_ENROLLMENTS', id: 'LIST' }]
    })
  }),
  overrideExisting: false
});

export const {
  useGetFaceEnrollmentsQuery,
  useGetFaceEnrollmentDetailQuery,
  useApproveFaceEnrollmentMutation,
  useRejectFaceEnrollmentMutation,
  useRevokeFaceEnrollmentMutation,
  useHrEnrollEmployeeMutation
} = faceManagementApi;