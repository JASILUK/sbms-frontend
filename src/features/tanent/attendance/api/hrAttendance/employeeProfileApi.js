import { baseApi } from "../../../../../services/baseApi";

export const employeeProfileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * GET /api/v1/attendance/hr-management/employees/{membership_id}/
     * Pulls core profile details, summary matrices, historical charts, and 
     * base records queries for a single worker inside a multi-tenant isolation context.
     */
    getEmployeeAttendanceProfileDetail: builder.query({
      query: ({ membershipId, ...params }) => ({
        url: `/attendance/v1/hr-management/employees/${membershipId}/`,
        method: "GET",
        params,
      }),
      providesTags: (result, error, { membershipId }) => [
        { type: "HR_Employee_Profile", id: membershipId },
        { type: "HR_Employee_Profile_List", id: "PARTIAL" }
      ],
    }),
  }),
  overrideExisting: true,
});

export const { useGetEmployeeAttendanceProfileDetailQuery } = employeeProfileApi;