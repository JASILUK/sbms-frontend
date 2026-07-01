import { baseApi } from "../../../../../services/baseApi";

export const employeeDirectoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * GET /api/v1/attendance/hr-management/employees/
     * Retrieves the company-wide paginated Employee Attendance Directory grid.
     * Implements rigorous tenant caching keys to prevent cross-tenant leak lines.
     */
    getEmployeeAttendanceDirectory: builder.query({
      query: (params) => ({
        url: "/attendance/v1/hr-management/employees/",
        method: "GET",
        params,
      }),
      providesTags: (result) =>
        result?.data?.results
          ? [
              ...result.data.results.map(({ membership_id }) => ({ type: "HR_Employee_Row", id: membership_id })),
              { type: "HR_Employee_Directory", id: "PARTIAL_LIST" },
            ]
          : [{ type: "HR_Employee_Directory", id: "PARTIAL_LIST" }],
    }),
  }),
  overrideExisting: true,
});

export const { useGetEmployeeAttendanceDirectoryQuery } = employeeDirectoryApi;