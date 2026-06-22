import { baseApi } from '../../../../services/baseApi';
import { ATTENDANCE_METHODS_TAG } from '../constants/attendanceMethodsConstants';

export const attendanceMethodsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAttendanceMethods: builder.query({
      query: () => 'attendance/v1/methods/',
      providesTags: [ATTENDANCE_METHODS_TAG]
    }),
    replaceAttendanceMethods: builder.mutation({
      query: (body) => ({
        url: 'attendance/v1/methods/',
        method: 'PUT',
        body
      }),
      invalidatesTags: [ATTENDANCE_METHODS_TAG]
    }),
    enableAttendanceMethod: builder.mutation({
      query: (methodName) => ({
        url: `attendance/v1/methods/${methodName}/enable/`,
        method: 'POST'
      }),
      invalidatesTags: [ATTENDANCE_METHODS_TAG]
    }),
    disableAttendanceMethod: builder.mutation({
      query: (methodName) => ({
        url: `attendance/v1/methods/${methodName}/`,
        method: 'DELETE'
      }),
      invalidatesTags: [ATTENDANCE_METHODS_TAG]
    })
  }),
  overrideExisting: false
});

export const {
  useGetAttendanceMethodsQuery,
  useReplaceAttendanceMethodsMutation,
  useEnableAttendanceMethodMutation,
  useDisableAttendanceMethodMutation
} = attendanceMethodsApi; // Maps onto the primary setup module endpoints controller block