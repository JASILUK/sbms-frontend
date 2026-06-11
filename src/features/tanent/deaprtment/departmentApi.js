// features/departments/api/departmentApi.js

import { baseApi } from "../../../services/baseApi";

export const departmentApi = baseApi.injectEndpoints({

  endpoints: (builder) => ({

    // =====================================================
    // GET DEPARTMENTS
    // =====================================================

    getDepartments: builder.query({

      query: () => ({

        url: "company/v1/departments/",
        method: "GET",
      }),

      providesTags: (result) =>

        result?.data

          ? [

              ...result.data.map((department) => ({

                type: "Departments",
                id: department.id,
              })),

              {
                type: "Departments",
                id: "LIST",
              },
            ]

          : [

              {
                type: "Departments",
                id: "LIST",
              },
            ],
    }),

    // =====================================================
    // GET DEPARTMENT DETAIL
    // =====================================================

    getDepartmentDetail: builder.query({

      query: (departmentId) => ({

        url: `company/v1/departments/${departmentId}/`,
        method: "GET",
      }),

      providesTags: (
        result,
        error,
        departmentId,
      ) => [

        {
          type: "Departments",
          id: departmentId,
        },
      ],
    }),

    // =====================================================
    // CREATE DEPARTMENT
    // =====================================================

    createDepartment: builder.mutation({

      query: (data) => ({

        url: "company/v1/departments/",
        method: "POST",
        body: data,
      }),

      invalidatesTags: [

        {
          type: "Departments",
          id: "LIST",
        },
      ],
    }),

    // =====================================================
    // UPDATE DEPARTMENT
    // =====================================================

    updateDepartment: builder.mutation({

      query: ({ id, data }) => ({

        url: `company/v1/departments/${id}/`,
        method: "PATCH",
        body: data,
      }),

      invalidatesTags: (
        result,
        error,
        { id },
      ) => [

        {
          type: "Departments",
          id,
        },

        {
          type: "Departments",
          id: "LIST",
        },
      ],
    }),

    // =====================================================
    // DELETE DEPARTMENT
    // =====================================================

    deleteDepartment: builder.mutation({

      query: (departmentId) => ({

        url: `company/v1/departments/${departmentId}/`,
        method: "DELETE",
      }),

      invalidatesTags: (
        result,
        error,
        departmentId,
      ) => [

        {
          type: "Departments",
          id: departmentId,
        },

        {
          type: "Departments",
          id: "LIST",
        },
      ],
    }),

    // =====================================================
    // ASSIGN MEMBERS
    // SUPPORTS:
    // - SINGLE MEMBER
    // - BULK MEMBERS
    // =====================================================

    assignDepartmentMembers: builder.mutation({

      query: ({
        departmentId,
        membershipIds,
      }) => ({

        url: `company/v1/departments/${departmentId}/assign-member/`,

        method: "POST",

        body: {
          membership_ids: membershipIds,
        },
      }),

      invalidatesTags: (
        result,
        error,
        { departmentId },
      ) => [

        {
          type: "Departments",
          id: departmentId,
        },

        {
          type: "Departments",
          id: "LIST",
        },

        {
          type: "Employees",
          id: "LIST",
        },
      ],
    }),

    // =====================================================
    // REMOVE MEMBER
    // =====================================================

    removeDepartmentMember: builder.mutation({

      query: ({
        departmentId,
        membershipId,
      }) => ({

        url: `company/v1/departments/${departmentId}/remove-member/`,

        method: "POST",

        body: {
          membership_id: membershipId,
        },
      }),

      invalidatesTags: (
        result,
        error,
        { departmentId },
      ) => [

        {
          type: "Departments",
          id: departmentId,
        },

        {
          type: "Departments",
          id: "LIST",
        },

        {
          type: "Employees",
          id: "LIST",
        },
      ],
    }),

    // =====================================================
    // TRANSFER MEMBER
    // =====================================================

    transferDepartmentMember: builder.mutation({

      query: ({
        fromDepartmentId,
        membershipId,
        toDepartmentId,
      }) => ({

        url: `company/v1/departments/${fromDepartmentId}/transfer-member/`,

        method: "POST",

        body: {

          membership_id: membershipId,

          to_department_id: toDepartmentId,
        },
      }),

      invalidatesTags: (
        result,
        error,
        {
          fromDepartmentId,
          toDepartmentId,
        },
      ) => [

        // SOURCE DEPARTMENT
        {
          type: "Departments",
          id: fromDepartmentId,
        },

        // TARGET DEPARTMENT
        {
          type: "Departments",
          id: toDepartmentId,
        },

        // DEPARTMENT LIST
        {
          type: "Departments",
          id: "LIST",
        },

        // EMPLOYEE LIST
        {
          type: "Employees",
          id: "LIST",
        },
      ],
    }),
  }),
});

// =====================================================
// EXPORT HOOKS
// =====================================================

export const {

  useGetDepartmentsQuery,

  useGetDepartmentDetailQuery,

  useCreateDepartmentMutation,

  useUpdateDepartmentMutation,

  useDeleteDepartmentMutation,

  useAssignDepartmentMembersMutation,

  useRemoveDepartmentMemberMutation,

  useTransferDepartmentMemberMutation,

} = departmentApi;