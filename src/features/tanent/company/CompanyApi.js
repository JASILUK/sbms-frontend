import { baseApi } from "../../../services/baseApi";

export const companyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    createCompany: builder.mutation({
      query: (data) => ({
        url: "company/v1/companies/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User", "CompanyContext"],
    }),

    getMyCompanies: builder.query({
      query: () => "company/v1/companies/",
      providesTags: ["CompanyContext"],
    }),

  }),
});

export const {
  useCreateCompanyMutation,
  useGetMyCompaniesQuery
} = companyApi;