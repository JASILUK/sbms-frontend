import { baseApi } from "../../services/baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // LOGIN
    login: builder.mutation({
      query: (credentials) => ({
        url: "users/v1/auth/email/login/",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["User"],
    }),

    // LOGOUT
    logout: builder.mutation({
      query: () => ({
        url: "users/v1/auth/logout/",
        method: "POST",
      }),
      invalidatesTags: ["User", "CompanyContext"],
    }),

    // GET CURRENT USER
    getMe: builder.query({
      query: () => "users/v1/auth/me/",
      providesTags: ["User"],

      transformResponse: (response) => ({
        user: response.data.user,
        account_type: response.data.account_type,
        companies: response.data.companies || [],
      }),
    }),

    // REGISTER
    registerWithCompany: builder.mutation({
      query: (data) => ({
        url: "users/v1/auth/register_with_company/",
        method: "POST",
        body: data,
      }),
    }),

    // VERIFY EMAIL
    verifyEmail: builder.mutation({
      query: (data) => ({
        url: "users/v1/auth/verify-email/",
        method: "POST",
        body: data,
      }),
    }),

    // INVITE DETAILS
    getInviteDetails: builder.mutation({
      query: (token) => ({
        url: "company/v1/invite/detailes/",
        method: "POST",
        body: { token },
      }),
    }),

    // ACCEPT INVITE
    acceptInvite: builder.mutation({
      query: (data) => ({
        url: "company/v1/invite/accept/",
        method: "POST",
        body: data,
      }),
    }),

    // RESEND EMAIL
    resendVerification: builder.mutation({
      query: (data) => ({
        url: "users/v1/auth/resend-verification/",
        method: "POST",
        body: data,
      }),
    }),

    // FORGOT PASSWORD
    forgotPassword: builder.mutation({
      query: (data) => ({
        url: "users/v1/auth/password/forget/",
        method: "POST",
        body: data,
      }),
    }),

    // RESET PASSWORD
    resetPassword: builder.mutation({
      query: (data) => ({
        url: "users/v1/auth/password/reset/",
        method: "POST",
        body: data,
      }),
    }),

    /* ================================
        MFA
    ================================= */

    // START MFA SETUP
    mfaSetup: builder.mutation({
      query: (data) => ({
        url: "users/v1/auth/mfa/setup/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["MFADevices"],
    }),

    // VERIFY MFA DEVICE
    mfaVerify: builder.mutation({
      query: (data) => ({
        url: "users/v1/auth/mfa/verify/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["MFADevices"],
    }),

    // MFA DEVICES LIST
    getMfaDevices: builder.query({
      query: () => "users/v1/auth/mfa/devices/",
      providesTags: ["MFADevices"],
    }),

    // DELETE DEVICE
    deleteMfaDevice: builder.mutation({
      query: (id) => ({
        url: `users/v1/auth/mfa/device/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["MFADevices"],
    }),

    // REGENERATE BACKUP CODES
    regenerateBackupCodes: builder.mutation({
      query: () => ({
        url: "users/v1/auth/mfa/backup/regenerate/",
        method: "POST",
      }),
    }),

    // LOGIN MFA VERIFY
    mfaLoginVerify: builder.mutation({
      query: (data) => ({
        url: "users/v1/auth/mfa/login-verify/",
        method: "POST",
        body: data,
      }),
    }),


  getCSRF: builder.query({
    query: () => ({
      url: "users/v1/auth/csrf/",
      method: "GET",
    }),
  }),

  }),
});

export const {

  useLoginMutation,
  useLogoutMutation,
  useGetMeQuery,
  useLazyGetMeQuery,

  useRegisterWithCompanyMutation,
  useVerifyEmailMutation,

  useGetInviteDetailsMutation,
  useAcceptInviteMutation,

  useResendVerificationMutation,

  useForgotPasswordMutation,
  useResetPasswordMutation,

  // MFA
  useMfaSetupMutation,
  useMfaVerifyMutation,
  useGetMfaDevicesQuery,
  useDeleteMfaDeviceMutation,
  useRegenerateBackupCodesMutation,
  useMfaLoginVerifyMutation,


  // csrf

  useGetCSRFQuery,

} = authApi;