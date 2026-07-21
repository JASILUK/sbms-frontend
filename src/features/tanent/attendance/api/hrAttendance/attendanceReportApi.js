import { baseApi } from "../../../../../services/baseApi";

export const attendanceReportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAttendanceReport: builder.query({
      query: (params = {}) => ({
        url: "/attendance/v1/hr/reports/",
        method: "GET",
        params,
      }),
      transformResponse: (response) => response.data,
      providesTags: (result) =>
        result?.results
          ? [
              ...result.results.map(({ membership_id }) => ({
                type: "AttendanceReport",
                id: membership_id,
              })),
              { type: "AttendanceReport", id: "LIST" },
            ]
          : [{ type: "AttendanceReport", id: "LIST" }],
    }),

    exportAttendanceReport: builder.mutation({
      query: (params) => ({
        url: "/attendance/v1/hr/reports/export/",
        method: "GET",
        params,
        responseHandler: async (response) => {
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Export failed (${response.status}): ${errorText}`);
          }
          const blob = await response.blob();
          const contentDisposition = response.headers.get("content-disposition");
          let filename = "attendance_report";
          if (contentDisposition) {
            const match = contentDisposition.match(/filename="?([^"]+)"?/);
            if (match) filename = match[1];
          }
          return { blob, filename, contentType: response.headers.get("content-type") };
        },
      }),
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetAttendanceReportQuery,
  useExportAttendanceReportMutation,
} = attendanceReportApi;