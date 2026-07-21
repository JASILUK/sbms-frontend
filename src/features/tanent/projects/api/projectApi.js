import { baseApi } from "../../../../services/baseApi";

export const projectApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 1. GET LIST & METRICS SUMMARY
    getProjects: builder.query({
      query: (params = {}) => ({
        url: "/projects/v1/",
        method: "GET",
        params,
      }),
      providesTags: (result) =>
        result?.data?.results
          ? [
              ...result.data.results.map(({ id }) => ({ type: "Project", id })),
              { type: "Project", id: "LIST" },
            ]
          : [{ type: "Project", id: "LIST" }],
    }),

    // 2. GET SINGLE PROJECT OVERVIEW WORKSPACE
    getProjectDetail: builder.query({
      query: (projectId) => ({
        url: `/projects/v1/${projectId}/`,
        method: "GET",
      }),
      providesTags: (result, error, projectId) => [{ type: "Project", id: projectId }],
    }),

    // 3. CREATE PROJECT
    createProject: builder.mutation({
      query: (body) => ({
        url: "/projects/v1/",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Project", id: "LIST" }],
    }),

    // 4. UPDATE PROJECT
    updateProject: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/projects/v1/${id}/update/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Project", id },
        { type: "Project", id: "LIST" },
      ],
    }),

    // 5. ARCHIVE PROJECT
    archiveProject: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/projects/v1/${id}/archive/`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Project", id },
        { type: "Project", id: "LIST" },
      ],
    }),

    // 6. RESTORE PROJECT
    restoreProject: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/projects/v1/${id}/restore/`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Project", id },
        { type: "Project", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetProjectsQuery,
  useGetProjectDetailQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useArchiveProjectMutation,
  useRestoreProjectMutation,
} = projectApi;