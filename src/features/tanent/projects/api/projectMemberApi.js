import { baseApi } from "../../../../services/baseApi";

export const projectMemberApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 1. GET PROJECT MEMBERS LIST
    getProjectMembers: builder.query({
      query: ({ projectId, search, role, ordering, limit, offset }) => ({
        url: `/projects/v1/${projectId}/members/`,
        method: "GET",
        params: { search, role, ordering, limit, offset },
      }),
      providesTags: (result, error, { projectId }) =>
        result?.data?.results
          ? [
              ...result.data.results.map(({ id }) => ({
                type: "ProjectMember",
                id,
              })),
              { type: "ProjectMember", id: `LIST_${projectId}` },
            ]
          : [{ type: "ProjectMember", id: `LIST_${projectId}` }],
    }),

    // 2. GET SINGLE PROJECT MEMBER DETAIL
    getProjectMemberDetail: builder.query({
      query: ({ projectId, memberId }) => ({
        url: `/projects/v1/${projectId}/members/${memberId}/`,
        method: "GET",
      }),
      providesTags: (result, error, { memberId }) => [
        { type: "ProjectMember", id: memberId },
      ],
    }),

    // 3. ADD SINGLE MEMBER
    addProjectMember: builder.mutation({
      query: ({ projectId, membership_id, role, notes }) => ({
        url: `/projects/v1/${projectId}/members/`,
        method: "POST",
        body: { membership_id, role, notes },
      }),
      invalidatesTags: (result, error, { projectId }) => [
        { type: "ProjectMember", id: `LIST_${projectId}` },
        { type: "Project", id: projectId },
        { type: "Project", id: "LIST" },
      ],
    }),

    // 4. UPDATE MEMBER (ROLE / NOTES)
    updateProjectMember: builder.mutation({
      query: ({ projectId, memberId, role, notes }) => ({
        url: `/projects/v1/${projectId}/members/${memberId}/update/`,
        method: "PATCH",
        body: { role, notes },
      }),
      invalidatesTags: (result, error, { projectId, memberId }) => [
        { type: "ProjectMember", id: memberId },
        { type: "ProjectMember", id: `LIST_${projectId}` },
        { type: "Project", id: projectId },
      ],
    }),

    // 5. REMOVE MEMBER
    removeProjectMember: builder.mutation({
      query: ({ projectId, memberId }) => ({
        url: `/projects/v1/${projectId}/members/${memberId}/remove/`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { projectId, memberId }) => [
        { type: "ProjectMember", id: memberId },
        { type: "ProjectMember", id: `LIST_${projectId}` },
        { type: "Project", id: projectId },
        { type: "Project", id: "LIST" },
      ],
    }),

    // 6. TRANSFER PROJECT OWNERSHIP
    transferProjectOwnership: builder.mutation({
      query: ({ projectId, new_owner_membership_id }) => ({
        url: `/projects/v1/${projectId}/members/transfer-owner/`,
        method: "POST",
        body: { new_owner_membership_id },
      }),
      invalidatesTags: (result, error, { projectId }) => [
        { type: "ProjectMember", id: `LIST_${projectId}` },
        { type: "Project", id: projectId },
        { type: "Project", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetProjectMembersQuery,
  useGetProjectMemberDetailQuery,
  useAddProjectMemberMutation,
  useUpdateProjectMemberMutation,
  useRemoveProjectMemberMutation,
  useTransferProjectOwnershipMutation,
} = projectMemberApi;