// features/roles/api/rolesApi.js
import { baseApi } from "../../../services/baseApi";

export const roleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    
    getRoles: builder.query({
      query: () => ({
        url: "rbac/v1/roles/",
        method: "GET",
      }),
      providesTags: (result) => {
        if (!result?.data) {
          return [{ type: "Roles", id: "LIST" }];
        }
        return [
          ...result.data.map((role) => ({ type: "Roles", id: role.id })),
          { type: "Roles", id: "LIST" },
        ];
      },
    }),

    getRoleDetail: builder.query({
      query: (id) => ({
        url: `rbac/v1/roles/${id}/`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Roles", id }],
    }),

    createRole: builder.mutation({
      query: (data) => ({
        url: "rbac/v1/roles/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Roles", id: "LIST" }],
    }),

    updateRole: builder.mutation({
      query: ({ id, data }) => ({
        url: `rbac/v1/roles/${id}/`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Roles", id },
        { type: "Roles", id: "LIST" },
      ],
    }),

    deleteRole: builder.mutation({
      query: (id) => ({
        url: `rbac/v1/roles/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Roles", id: "LIST" }],
    }),

    getPermissions: builder.query({
      query: () => ({
        url: "rbac/v1/permissions/",
        method: "GET",
      }),
    }),
    
  }),
});

export const {
  useGetRolesQuery,
  useGetRoleDetailQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
  useGetPermissionsQuery,
} = roleApi;