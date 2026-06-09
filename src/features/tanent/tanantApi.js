import { baseApi } from "../../services/baseApi";

export const tenantApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    getCompanyContext: builder.query({
      query: () => "company/v1/context/",
      providesTags: ["CompanyContext"],
      refetchOnMountOrArgChange: true,
    }),

  }),
});

export const {
  useGetCompanyContextQuery
} = tenantApi;