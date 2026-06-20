import { baseApi } from '../../../../services/baseApi';
import { FACE_ENROLLMENT_TAGS } from '../constants/faceEnrollmentConstants';

export const faceEnrollmentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyFaceEnrollments: builder.query({
      query: () => 'attendance/v1/face-enrollments/',
      providesTags: [FACE_ENROLLMENT_TAGS.ENROLLMENT_LIST],
      transformResponse: (response) => response.data,
    }),
    getMyFaceEnrollmentDetail: builder.query({
      query: (id) => `attendance/v1/face-enrollments/${id}/`,
      providesTags: (result, error, id) => [{ type: FACE_ENROLLMENT_TAGS.ENROLLMENT_DETAIL, id }],
      transformResponse: (response) => response.data,
    }),
    submitSelfEnrollment: builder.mutation({
      query: (body) => ({
        url: 'attendance/v1/face-enrollments/self/',
        method: 'POST',
        body, // Formatted as { embedding: number[] }
      }),
      invalidatesTags: [FACE_ENROLLMENT_TAGS.ENROLLMENT_LIST],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetMyFaceEnrollmentsQuery,
  useGetMyFaceEnrollmentDetailQuery,
  useSubmitSelfEnrollmentMutation,
} = faceEnrollmentApi;