import { baseApi } from '../../../../services/baseApi';
import { FACE_POLICY_TAGS } from '../constants/facePolicyConstants';

export const faceEnrollmentPolicyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    
    getFaceEnrollmentPolicy: builder.query({
      query: () => 'attendance/v1/face-enrollments/policy/',
      providesTags: [FACE_POLICY_TAGS.FACE_POLICY],
      transformResponse: (response) => response.data,
    }),
    createFaceEnrollmentPolicy: builder.mutation({
      query: (body) => ({
        url: 'attendance/v1/face-enrollments/policy/',
        method: 'POST',
        body,
      }),
      invalidatesTags: [FACE_POLICY_TAGS.FACE_POLICY],
    }),
    updateFaceEnrollmentPolicy: builder.mutation({
      query: (body) => ({
        url: 'attendance/v1/face-enrollments/policy/',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: [FACE_POLICY_TAGS.FACE_POLICY],
    }),
    deactivateFaceEnrollmentPolicy: builder.mutation({
      query: () => ({
        url: 'attendance/v1/face-enrollments/policy/',
        method: 'DELETE',
      }),
      invalidatesTags: [FACE_POLICY_TAGS.FACE_POLICY],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetFaceEnrollmentPolicyQuery,
  useCreateFaceEnrollmentPolicyMutation,
  useUpdateFaceEnrollmentPolicyMutation,
  useDeactivateFaceEnrollmentPolicyMutation,
} = faceEnrollmentPolicyApi;