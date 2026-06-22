import { baseApi } from '../../../../services/baseApi';
import { ATTENDANCE_LOCATIONS_TAG } from '../constants/attendanceLocationConstants';

export const attendanceLocationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAttendanceLocations: builder.query({
      query: (params) => ({
        url: 'attendance/v1/locations/',
        method: 'GET',
        params: {
          search: params?.search || undefined,
          active_only: params?.activeOnly !== undefined ? params.activeOnly : undefined
        }
      }),
      providesTags: (result) => [
        ATTENDANCE_LOCATIONS_TAG,
        ...(result?.data ? result.data.map(({ id }) => ({ type: ATTENDANCE_LOCATIONS_TAG, id })) : [])
      ]
    }),
    getAttendanceLocation: builder.query({
      query: (id) => `attendance/v1/locations/${id}/`,
      providesTags: (result, error, id) => [{ type: ATTENDANCE_LOCATIONS_TAG, id }]
    }),
    createAttendanceLocation: builder.mutation({
      query: (body) => ({
        url: 'attendance/v1/locations/',
        method: 'POST',
        body
      }),
      invalidatesTags: [ATTENDANCE_LOCATIONS_TAG]
    }),
    updateAttendanceLocation: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `attendance/v1/locations/${id}/`,
        method: 'PATCH',
        body
      }),
      invalidatesTags: (result, error, { id }) => [
        ATTENDANCE_LOCATIONS_TAG,
        { type: ATTENDANCE_LOCATIONS_TAG, id }
      ]
    }),
    deactivateAttendanceLocation: builder.mutation({
      query: (id) => ({
        url: `attendance/v1/locations/${id}/`,
        method: 'DELETE'
      }),
      invalidatesTags: (result, error, id) => [
        ATTENDANCE_LOCATIONS_TAG,
        { type: ATTENDANCE_LOCATIONS_TAG, id }
      ]
    }),
    activateAttendanceLocation: builder.mutation({
      query: (id) => ({
        url: `attendance/v1/locations/${id}/activate/`,
        method: 'POST'
      }),
      invalidatesTags: (result, error, id) => [
        ATTENDANCE_LOCATIONS_TAG,
        { type: ATTENDANCE_LOCATIONS_TAG, id }
      ]
    })
  }),
  overrideExisting: false
});

export const {
  useGetAttendanceLocationsQuery,
  useGetAttendanceLocationQuery,
  useCreateAttendanceLocationMutation,
  useUpdateAttendanceLocationMutation,
  useDeactivateAttendanceLocationMutation,
  useActivateAttendanceLocationMutation
} = attendanceLocationsApi;