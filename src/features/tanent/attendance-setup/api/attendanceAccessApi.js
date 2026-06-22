import { baseApi } from "../../../../services/baseApi";
import { ACCESS_CACHE_TAGS } from '../constants/attendanceAccessConstants';

export const attendanceAccessApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Global Fallback Defaults Profile Orchestration Nodes
    getCompanyDefaultsProfile: builder.query({
      query: () => 'attendance/v1/access/defaults/',
      providesTags: [ACCESS_CACHE_TAGS.COMPANY_DEFAULTS]
    }),
    // ✅ ADDED: Primary Creation Endpoint for fresh tenant onboarding
    createCompanyDefaultsProfile: builder.mutation({
      query: (body) => ({
        url: 'attendance/v1/access/defaults/',
        method: 'POST',
        body
      }),
      invalidatesTags: [ACCESS_CACHE_TAGS.COMPANY_DEFAULTS]
    }),
    updateCompanyDefaultsProfile: builder.mutation({
      query: (body) => ({
        url: 'attendance/v1/access/defaults/',
        method: 'PATCH',
        body
      }),
      invalidatesTags: [ACCESS_CACHE_TAGS.COMPANY_DEFAULTS]
    }),

    // Custom Scoped Conditional Policies Matching Array Sets
    getAccessRulesProfiles: builder.query({
      query: () => 'attendance/v1/access/rules/',
      providesTags: [ACCESS_CACHE_TAGS.ACCESS_RULES]
    }),
    createAccessRuleProfile: builder.mutation({
      query: (body) => ({
        url: 'attendance/v1/access/rules/',
        method: 'POST',
        body
      }),
      invalidatesTags: [ACCESS_CACHE_TAGS.ACCESS_RULES]
    }),
    updateAccessRuleProfile: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `attendance/v1/access/rules/${id}/`,
        method: 'PATCH',
        body
      }),
      invalidatesTags: [ACCESS_CACHE_TAGS.ACCESS_RULES]
    }),
    deleteAccessRuleProfile: builder.mutation({
      query: (id) => ({
        url: `attendance/v1/access/rules/${id}/`,
        method: 'DELETE'
      }),
      invalidatesTags: [ACCESS_CACHE_TAGS.ACCESS_RULES]
    }),

    // Individual Member Exception Telemetry Overrides Vectors
    // Add the missing mutation method block straight into your api slice definition:

    // Individual Member Exception Telemetry Overrides Vectors
    getEmployeeOverridesProfiles: builder.query({
      query: () => 'attendance/v1/access/overrides/',
      providesTags: [ACCESS_CACHE_TAGS.EMPLOYEE_OVERRIDES]
    }),
    createEmployeeOverrideProfile: builder.mutation({
      query: (body) => ({
        url: 'attendance/v1/access/overrides/',
        method: 'POST',
        body
      }),
      invalidatesTags: [ACCESS_CACHE_TAGS.EMPLOYEE_OVERRIDES]
    }),
    // ✅ ADDED: Missing update execution routing mapping onto PATCH method
    updateEmployeeOverrideProfile: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `attendance/v1/access/overrides/${id}/`,
        method: 'PATCH',
        body
      }),
      invalidatesTags: [ACCESS_CACHE_TAGS.EMPLOYEE_OVERRIDES]
    }),
    deleteEmployeeOverrideProfile: builder.mutation({
      query: (id) => ({
        url: `attendance/v1/access/overrides/${id}/`,
        method: 'DELETE'
      }),
      invalidatesTags: [ACCESS_CACHE_TAGS.EMPLOYEE_OVERRIDES]
    }),

    // Real-Time Simulator Testing Evaluator Engine Trace
    evaluatePolicyMatrixResolution: builder.query({
      query: (membershipId) => ({
        url: 'attendance/v1/access/resolve/',
        method: 'GET',
        params: { membership_id: membershipId }
      }),
      keepUnusedDataFor: 0
    })
  }),
  overrideExisting: false
});

export const {
  useGetCompanyDefaultsProfileQuery,
  useCreateCompanyDefaultsProfileMutation, // ✅ Exported Creation Hook
  useUpdateCompanyDefaultsProfileMutation,
  useGetAccessRulesProfilesQuery,
  useCreateAccessRuleProfileMutation,
  useUpdateAccessRuleProfileMutation,
  useDeleteAccessRuleProfileMutation,
  useGetEmployeeOverridesProfilesQuery,
  useCreateEmployeeOverrideProfileMutation,
  useUpdateEmployeeOverrideProfileMutation, // ✅ FIXED: Export the generated react mutation hook cleanly
  useDeleteEmployeeOverrideProfileMutation,
  useLazyEvaluatePolicyMatrixResolutionQuery
} = attendanceAccessApi;