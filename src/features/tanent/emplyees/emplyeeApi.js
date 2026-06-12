import { baseApi } from "../../../services/baseApi";

export const employeeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // =============================
    // EMPLOYEE LIST
    // =============================
    getEmployees: builder.query({
      query: () => ({
        url: "company/v1/employee/",
        method: "GET",
      }),
      providesTags: ["Employees"],
    }),

    // =============================
    // EMPLOYEE DETAIL
    // =============================
    getEmployeeDetail: builder.query({
      query: (id) => ({
        url: `company/v1/employee/${id}/`,
      }),
      providesTags: ["Employees"],
    }),

    // =============================
    // UPDATE EMPLOYEE
    // =============================
    updateEmployee: builder.mutation({
      query: ({ id, data }) => ({
        url: `company/v1/employee/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Employees","Departments"],
    }),


    // DELETE EMPLOYEE

    deleteEmployee: builder.mutation({
      query:(id)=>({
        url:`company/v1/employee/${id}/`,
        method:"DELETE"
      }),
      invalidatesTags:["Employees","Departments"]
    }),

    // =============================
    // BLOCK
    // =============================
    blockEmployee: builder.mutation({
      query: (id) => ({
        url: `company/v1/employee/${id}/block/`,
        method: "POST",
      }),
      invalidatesTags: ["Employees"],
    }),

    // =============================
    // UNBLOCK
    // =============================
    unblockEmployee: builder.mutation({
      query: (id) => ({
        url: `company/v1/employee/${id}/unblock/`,
        method: "POST",
      }),
      invalidatesTags: ["Employees"],
    }),

    // =============================
    // INVITE EMPLOYEE
    // =============================
    inviteEmployee: builder.mutation({
      query: (data) => ({
        url: "company/v1/invite/users/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Employees"],
    }),

    // =============================
    // BULK INVITE
    // =============================
    bulkInviteEmployees: builder.mutation({
      query: (data) => ({
        url: "company/v1/invite/bulk/users/",
        method: "POST",
        body: data,
      }),
    }),

    // =============================
    // CSV INVITE
    // =============================
    bulkInviteCSV: builder.mutation({
      query: (formData) => ({
        url: "company/v1/invite/bulk_in_csv/users/",
        method: "POST",
        body: formData,
      }),
    }),

    // =============================
    // INVITE DETAILS
    // =============================
    getInviteDetails: builder.mutation({
      query: (token) => ({
        url: "company/v1/invite/detailes/",
        method: "POST",
        body: { token },
      }),
    }),

    // =============================
    // ACCEPT INVITE
    // =============================
    acceptInvite: builder.mutation({
      query: (data) => ({
        url: "company/v1/invite/accept/",
        method: "POST",
        body: data,
      }),
    }),

  }),
});

export const {

  useGetEmployeesQuery,
  useGetEmployeeDetailQuery,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
  
  useBlockEmployeeMutation,
  useUnblockEmployeeMutation,

  useInviteEmployeeMutation,
  useBulkInviteEmployeesMutation,
  useBulkInviteCSVMutation,

  useGetInviteDetailsMutation,
  useAcceptInviteMutation,

} = employeeApi;